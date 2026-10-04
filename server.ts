import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

// Server-side Gemini initialization with telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// 1. OCR & NLP Discharge Summary Extraction Endpoint
app.post('/api/gemini/extract-discharge', async (req: Request, res: Response) => {
  try {
    const { documentText = '', imageBase64, mimeType, documents = [], language = 'en' } = req.body;
    const incomingDocuments = Array.isArray(documents) && documents.length
      ? documents
      : (imageBase64 ? [{ name: 'discharge-document', mimeType: mimeType || 'application/pdf', base64: imageBase64, text: documentText }] : []);

    if (!incomingDocuments.length && !documentText.trim()) {
      return res.status(400).json({ success: false, error: 'Please provide at least one discharge, medication, diet, exercise, or follow-up document.' });
    }

    const systemInstruction = `You are RecoveryNav's clinical document extraction engine. Analyze ALL supplied post-hospital documents together as one patient record. Documents may include a discharge summary, separate prescription/medication sheet, diet instructions, physiotherapy sheet, follow-up/appointment sheet, lab instructions, or scanned images/PDFs.

IMPORTANT:
- Extract only information actually present in the supplied documents. Never invent a medication, dose, appointment, diet rule, exercise, diagnosis, warning sign, date, doctor, or patient detail.
- If two documents disagree, preserve both values in detected_conflicts and do not silently choose one.
- If a field is absent, return an empty string/array rather than a sample value.
- Normalize frequency and timing where explicitly stated. Keep exact dose, route, food relation, duration and precautions.
- Build a unified recovery plan from the supplied documents so the frontend can populate the dashboard, medication tracker/reminders, symptoms/red flags, follow-up appointments, diet plan, and exercise/rehabilitation sections.
- Warning signs must come from the documents; you may only normalize wording, not invent clinical thresholds.
- The user's requested language is ${language} for explanatory text, while medicine names and clinical identifiers should remain recognizable.
Return ONLY valid JSON matching the schema.`;

    const contents: any[] = [];
    for (const doc of incomingDocuments) {
      if (doc.base64) {
        contents.push({ inlineData: { mimeType: doc.mimeType || 'application/pdf', data: doc.base64 } });
      }
      if (doc.text) {
        contents.push({ text: `DOCUMENT: ${doc.name || 'unnamed'}\n${doc.text}` });
      } else {
        contents.push({ text: `DOCUMENT: ${doc.name || 'unnamed'}\nAnalyze the attached document above.` });
      }
    }
    if (documentText) contents.push({ text: `ADDITIONAL USER-PROVIDED TEXT:\n${documentText}` });

    let parsedData: any = null;
    let lastError: any = null;
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.1-pro-preview'];

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                hospital_name: { type: Type.STRING },
                patient_name: { type: Type.STRING },
                admission_date: { type: Type.STRING },
                discharge_date: { type: Type.STRING },
                attending_physician: { type: Type.STRING },
                diagnosis: { type: Type.STRING },
                surgical_procedure: { type: Type.STRING },
                allergies: { type: Type.ARRAY, items: { type: Type.STRING } },
                dietary_instructions: { type: Type.STRING },
                hydration_target_ml: { type: Type.NUMBER },
                activity_restrictions: { type: Type.STRING },
                warning_signs: { type: Type.ARRAY, items: { type: Type.STRING } },
                medications: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                  name: { type: Type.STRING }, generic_name: { type: Type.STRING }, dosage: { type: Type.STRING },
                  frequency: { type: Type.STRING }, route: { type: Type.STRING }, timing: { type: Type.ARRAY, items: { type: Type.STRING } },
                  purpose: { type: Type.STRING }, food_relation: { type: Type.STRING }, precautions: { type: Type.STRING },
                  duration: { type: Type.STRING }, start_date: { type: Type.STRING }, end_date: { type: Type.STRING },
                }, required: ['name', 'dosage', 'frequency'] } },
                exercises: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                  title: { type: Type.STRING }, category: { type: Type.STRING }, target_body_part: { type: Type.STRING },
                  repetitions: { type: Type.STRING }, frequency_per_day: { type: Type.NUMBER }, duration_minutes: { type: Type.NUMBER },
                  instructions: { type: Type.STRING }, precautions: { type: Type.STRING },
                }, required: ['title', 'instructions'] } },
                appointments: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                  doctor_name: { type: Type.STRING }, specialty: { type: Type.STRING }, hospital_clinic: { type: Type.STRING },
                  date_time: { type: Type.STRING }, purpose: { type: Type.STRING }, phone: { type: Type.STRING },
                }, required: ['doctor_name', 'purpose'] } },
                detected_conflicts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                  title: { type: Type.STRING }, severity: { type: Type.STRING }, description: { type: Type.STRING },
                  source_documents: { type: Type.ARRAY, items: { type: Type.STRING } }, recommendation: { type: Type.STRING },
                }, required: ['title', 'description', 'severity'] } },
              },
              required: ['hospital_name', 'patient_name', 'diagnosis', 'medications', 'warning_signs'],
            },
          },
        });
        if (response.text) { parsedData = JSON.parse(response.text); break; }
      } catch (err: any) {
        lastError = err;
        console.warn(`Extraction model ${modelName} failed, trying next candidate:`, err.message || err);
      }
    }

    if (!parsedData) throw lastError || new Error('All document-analysis models failed.');
    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error in /api/gemini/extract-discharge:', error);
    return res.status(500).json({ success: false, error: error.message || 'Discharge extraction failed' });
  }
});

// 2. Multi-turn Chat Assistant Endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userContext, language = 'en' } = req.body;

    const languageDirective =
      language === 'hi'
        ? `CRITICAL LANGUAGE REQUIREMENT: You MUST speak and reply EXCLUSIVELY in pure, natural HINDI (हिन्दी - देवनागरी लिपि). Every single word, sentence, advice, medication instruction, reassurance, and greeting must be in Hindi script. Even if the user writes in English, Hinglish, or Roman script, your entire reply MUST be in Devanagari Hindi (हिन्दी). Do NOT use English.`
        : language === 'gu'
        ? `CRITICAL LANGUAGE REQUIREMENT: You MUST speak and reply EXCLUSIVELY in pure, natural GUJARATI (ગુજરાતી લિપિ). Every single word, sentence, advice, medication instruction, reassurance, and greeting must be in Gujarati script. Even if the user writes in English, Gujlish, or Roman script, your entire reply MUST be in Gujarati (ગુજરાતી). Do NOT use English.`
        : `CRITICAL LANGUAGE REQUIREMENT: You must converse clearly, warmly, and empathetically in English.`;

    const systemInstruction = `You are "RecoveryNav Assistant", a compassionate, highly knowledgeable, and reliable post-hospital recovery and healthcare guide.
The patient or caregiver is asking questions about recovery, health, lifestyle, symptoms, diet, exercises, medications, activities, or general medical topics.

Patient Context (for your reference to personalize advice):
${JSON.stringify(userContext || {})}

${languageDirective}

Capabilities and Guidelines:
1. Answer ANY and ALL questions the user asks. You are a versatile medical intelligence assistant, NOT a canned FAQ database. You are NOT restricted to only what is stored in their discharge summary. Answer general medical questions, lifestyle questions, nutrition questions, questions about other conditions, post-surgery precautions, sleeping positions, tea/coffee/diet, wound care, emotional recovery, etc.
2. If the user asks something directly related to their medications (e.g. Aspirin, Metoprolol, Atorvastatin) or surgery (CABG / Gallbladder), incorporate their discharge context seamlessly.
3. If they ask about everyday topics (e.g. "Can I drink tea?", "Can I sleep on my stomach?", "When can I shower?", "How to manage pain?"), provide direct, safe, actionable, and medically grounded answers.
4. Strongly reiterate sternum precautions when physical activity or lifting is asked (no lifting > 5 kg for 6 weeks, hold pillow against chest when coughing or sneezing).
5. Always flag emergency red flags (severe chest pain, sudden breathlessness, high fever > 100.5°F, calf pain/swelling, wound drainage) and advise contacting 112 / doctor immediately if alarming symptoms are reported.
6. Format answers with clear, scannable paragraphs and bullet points in the user's requested language.`;

    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }],
    }));

    let replyText = '';
    let lastError: any = null;
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction,
          },
        });
        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate:`, err.message || err);
      }
    }

    if (!replyText) {
      throw lastError || new Error('All AI models unavailable');
    }

    return res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Text to Speech (TTS) using gemini-3.8-flash-tts
app.post('/api/gemini/tts', async (req: Request, res: Response) => {
  try {
    const { text, language = 'en' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    const voicePrompt = language === 'hi'
      ? `मधुर और स्पष्ट आवाज़ में कहें: ${text}`
      : language === 'gu'
      ? `સ્પષ્ટ અને શાંત અવાજમાં બોલો: ${text}`
      : `Say warmly and clearly: ${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: voicePrompt,
              speechMetadata: {
                style: 'Clear, gentle, compassionate healthcare voice assistant',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
      });
    } else {
      return res.status(500).json({ success: false, error: 'No audio generated' });
    }
  } catch (error: any) {
    console.error('Error in /api/gemini/tts:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Voice Command Interpreter Endpoint
app.post('/api/gemini/interpret-voice-command', async (req: Request, res: Response) => {
  try {
    const { transcript, language = 'en' } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `You are an intent parser for a medical recovery application.
User speech transcript (could be in English, Hindi, or Gujarati): "${transcript}"
Language: ${language}

Map this transcript to one of the following actions:
- NAVIGATE (target: 'home' | 'medications' | 'exercises' | 'appointments' | 'scanner' | 'symptoms' | 'emergency' | 'wellness' | 'settings' | 'audit')
- LOG_MEDICATION (medicationName: string, taken: boolean)
- LOG_EXERCISE (exerciseTitle: string, completed: boolean)
- SET_REMINDER (reminderText: string, time: string)
- ASK_INFO (question: string)
- CALL_EMERGENCY ()

Provide a JSON object with:
{
  "action": string,
  "parameters": object,
  "spokenFeedback": string (a short, comforting confirmation message to speak back to the user in ${language})
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, intent: parsed });
  } catch (error: any) {
    console.error('Error in interpret-voice-command:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Conflict Detection Engine Endpoint
app.post('/api/gemini/detect-conflicts', async (req: Request, res: Response) => {
  try {
    const { medications, exercises, instructions } = req.body;

    const prompt = `Perform clinical safety conflict and drug-drug interaction screening on these post-discharge items:
Medications: ${JSON.stringify(medications || [])}
Exercises: ${JSON.stringify(exercises || [])}
Instructions: ${instructions || 'Sternal precautions, low sodium diet'}

Identify:
1. Potential contraindications (e.g. NSAID with Aspirin, Beta blockers with low heart rate).
2. Exercise risks against surgical wound healing.
3. Dietary conflicts.
Output strict JSON with an array of conflicts (title, severity: 'CRITICAL'|'WARNING'|'INFO', description, recommendation).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ success: true, conflicts: parsed });
  } catch (error: any) {
    console.error('Error in detect-conflicts:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Vite Middleware for Development Mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RecoveryNav server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
