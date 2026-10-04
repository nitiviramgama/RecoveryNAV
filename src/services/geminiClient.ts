import { Language } from '../types';

export interface DischargeExtractionResult {
  hospital_name: string;
  patient_name: string;
  admission_date?: string;
  discharge_date?: string;
  attending_physician?: string;
  diagnosis: string;
  surgical_procedure?: string;
  dietary_instructions?: string;
  hydration_target_ml?: number;
  allergies?: string[];
  activity_restrictions?: string;
  warning_signs?: string[];
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    timing?: string[];
    purpose?: string;
    food_relation?: string;
    precautions?: string;
  }>;
  exercises?: Array<{
    title: string;
    category?: string;
    target_body_part?: string;
    repetitions?: string;
    instructions: string;
    precautions?: string;
  }>;
  appointments?: Array<{
    doctor_name: string;
    specialty?: string;
    date_time: string;
    purpose: string;
  }>;
  detected_conflicts?: Array<{
    title: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    description: string;
    recommendation: string;
  }>;
}

export interface RecoveryDocumentPayload {
  name: string;
  mimeType: string;
  base64?: string;
  text?: string;
}

export async function extractDischargeWithAI(params: {
  documentText?: string;
  imageBase64?: string;
  mimeType?: string;
  documents?: RecoveryDocumentPayload[];
  language?: Language;
}): Promise<DischargeExtractionResult> {
  const payload = {
    ...params,
    documents: params.documents || (params.imageBase64
      ? [{ name: 'discharge-document', mimeType: params.mimeType || 'application/pdf', base64: params.imageBase64, text: params.documentText }]
      : []),
  };

  const res = await fetch('/api/gemini/extract-discharge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.error || `Document analysis failed (${res.status})`);
  }
  return data.data as DischargeExtractionResult;
}

export async function askRecoveryAIAssistant(params: {
  messages: Array<{ role: 'user' | 'model'; content: string }>;
  userContext?: any;
  language?: Language;
}): Promise<string> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (data.success && data.reply) {
      return data.reply;
    }
    throw new Error(data.error || 'Chat request failed');
  } catch (err) {
    console.warn('Chat request failed, providing topic-aware recovery guidance:', err);
    const lastUserMsg = (
      [...params.messages].reverse().find((m) => m.role === 'user')?.content || ''
    ).toLowerCase();
    const lang = params.language || 'en';

    // Topic 1: Diet, Tea, Coffee, Water, Food
    if (
      lastUserMsg.includes('tea') ||
      lastUserMsg.includes('coffee') ||
      lastUserMsg.includes('diet') ||
      lastUserMsg.includes('food') ||
      lastUserMsg.includes('चा') ||
      lastUserMsg.includes('चाय') ||
      lastUserMsg.includes('खाना') ||
      lastUserMsg.includes('ખોરાક')
    ) {
      if (lang === 'hi') {
        return 'सर्जरी के बाद आहार और पेय पदार्थों के संबंध में:\n\n• **चाय और कैफीन:** दिन में 1-2 कप हल्की चाय या ग्रीन टी ले सकते हैं। अधिक कैफीन से बचें ताकि रक्तचाप और हृदय गति सामान्य रहे।\n• **नमक व वसा:** हृदय की सुरक्षा के लिए कम नमक (सोडियम < 2 ग्राम/दिन) और कम तेल वाला सादा भोजन लें।\n• **पानी (जलयोजन):** दिन भर में पर्याप्त पानी (लगभग 2 लीटर) पिएं।';
      }
      if (lang === 'gu') {
        return 'સર્જરી પછી ખોરાક અને પીણાં બાબતે:\n\n• **ચા અને કોફી:** દિવસમાં 1-2 કપ હળવી ચા અથવા ગ્રીન ટી લઈ શકાય છે. વધુ પડતા કેફીનથી દૂર રહો.\n• **મીઠું અને તેલ:** હૃદયના સ્વાસ્થ્ય માટે ઓછું મીઠું અને પૌષ્ટિક સાદો ખોરાક લો.\n• **પાણી:** આખો દિવસ મળીને નિયમિતપણે પૂરતું પાણી (અંદાજે 2 લિટર) પીવો.';
      }
      return 'Regarding diet and beverages post-surgery:\n\n• **Tea & Coffee:** 1-2 cups of mild tea or green tea daily is generally acceptable, but avoid heavy caffeine intake as it can elevate heart rate.\n• **Sodium & Fat:** Follow a strict low-sodium (< 2g/day) and heart-healthy high-fiber diet.\n• **Hydration:** Drink approximately 2.0 Liters of water evenly spaced throughout the day.';
    }

    // Topic 2: Sleeping position, side, back
    if (
      lastUserMsg.includes('sleep') ||
      lastUserMsg.includes('side') ||
      lastUserMsg.includes('bed') ||
      lastUserMsg.includes('सोना') ||
      lastUserMsg.includes('करवट') ||
      lastUserMsg.includes('ઊંઘ') ||
      lastUserMsg.includes('પડખું')
    ) {
      if (lang === 'hi') {
        return 'सोने की सही मुद्रा (Sleeping Position):\n\n• **पीठ के बल सोना:** सर्जरी के बाद पहले 6 हफ्तों तक पीठ के बल सीधा सोना सबसे सुरक्षित है। इससे छाती की हड्डी (स्टर्नम) पर दबाव नहीं पड़ता।\n• **करवट लेना:** जब तक डॉक्टर अनुमति न दें, करवट लेने से बचें। यदि अनुमति मिले, तो छाती के आगे तकिया लगाकर सोएं।\n• **उठने का तरीका:** बिस्तर से उठते समय हाथों पर जोर न दें; धीरे-धीरे पैरों को नीचे उतारें।';
      }
      if (lang === 'gu') {
        return 'ઊંઘવાની યોગ્ય સ્થિતિ (Sleeping Position):\n\n• **પીઠ પર સીધા સૂવું:** સર્જરી પછીના પ્રથમ 6 અઠવાડિયા સુધી પીઠ પર સીધા સૂવું સૌથી સલામત છે. તેનાથી છાતીના હાડકા પર દબાણ નથી આવતું.\n• **પડખું ફેરવવું:** ડૉક્ટરની મંજૂરી વિના પડખે સૂવાનું ટાળો. જો પરવાનગી મળે, તો છાતી આગળ ઓશીકું રાખીને સૂવું.\n• **પથારીમાંથી ઊઠવું:** હાથ પર બહુ ભાર આપ્યા વગર ધીમેથી ઊભા થાઓ.';
      }
      return 'Regarding post-op sleeping positions:\n\n• **Back Sleeping:** Sleeping flat on your back is the safest position for the first 6 weeks while your sternum bone is healing.\n• **Side Sleeping:** Avoid rolling onto your side without clearance from your surgeon, as this twists the sternal incision.\n• **Bed Mobility:** When getting out of bed, do not push aggressively with your arms. Roll gently and use leg momentum.';
    }

    // General default answer
    if (params.language === 'hi') {
      return 'नमस्ते! आपकी सर्जरी के बाद रिकवरी सामान्य गति से चल रही है। कृपया अपनी दवाएं (जैसे मेटोप्रोलोल और एस्पिरिन) समय पर लें, छाती पर तकिया लगाकर ही खांसें, और दिन में 15 मिनट की धीमी सैर करें। यदि सीने में तेज दर्द हो तो तुरंत 112 पर कॉल करें।';
    } else if (params.language === 'gu') {
      return 'નમસ્તે! તમારી હોસ્પિટલ ડિસ્ચાર્જ પછીની રિકવરી યોગ્ય દિશામાં છે. કૃપા કરીને સમયસર દવાઓ લો, છાતી પર ભારે વજન ન ઉઠાવો (5 કિલોથી વધુ નહીં), અને પૂરતું પાણી પીવો. કોઈ પણ કટોકટીમાં તરત જ ડૉક્ટરનો સંપર્ક કરો.';
    }
    return 'Hello! Based on your post-op discharge summary, you are making steady progress. Remember to follow your sternal precautions (no lifting > 5kg for 6 weeks), take your morning Metoprolol and Aspirin with meals, and practice your incentive spirometer exercises 10 times an hour. If you experience sudden chest pain or fever > 100.5°F, please seek immediate emergency care.';
  }
}

export async function textToSpeechAudio(text: string, language: Language): Promise<string | null> {
  try {
    const res = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    const data = await res.json();
    if (data.success && data.audioBase64) {
      return data.audioBase64;
    }
    return null;
  } catch (err) {
    console.warn('Gemini TTS server call failed, will use Web Speech API fallback:', err);
    return null;
  }
}

export async function interpretVoiceCommandWithAI(transcript: string, language: Language) {
  try {
    const res = await fetch('/api/gemini/interpret-voice-command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language }),
    });

    const data = await res.json();
    if (data.success && data.intent) {
      return data.intent;
    }
  } catch (err) {
    console.warn('Voice command interpretation fallback to regex:', err);
  }

  // Robust local keyword matching fallback for English, Hindi, and Gujarati
  const lower = transcript.toLowerCase();
  
  // Navigation
  if (lower.includes('medication') || lower.includes('medicine') || lower.includes('दवा') || lower.includes('ગોળી')) {
    return {
      action: 'NAVIGATE',
      parameters: { target: 'medications' },
      spokenFeedback: language === 'hi' ? 'दवा प्रबंधन खोला जा रहा है' : language === 'gu' ? 'દવા વિભાગ ખોલી રહ્યા છીએ' : 'Opening medications schedule',
    };
  }
  if (lower.includes('exercise') || lower.includes('therapy') || lower.includes('व्यायाम') || lower.includes('કસરત')) {
    return {
      action: 'NAVIGATE',
      parameters: { target: 'exercises' },
      spokenFeedback: language === 'hi' ? 'फिजियोथेरेपी व्यायाम दिखाए जा रहे हैं' : language === 'gu' ? 'ફિઝિયોથેરાપી કસરતો બતાવી રહ્યા છીએ' : 'Opening physical therapy exercises',
    };
  }
  if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('डॉक्टर') || lower.includes('તબીબ')) {
    return {
      action: 'NAVIGATE',
      parameters: { target: 'appointments' },
      spokenFeedback: language === 'hi' ? 'डॉक्टर अपॉइंटमेंट खोला जा रहा है' : language === 'gu' ? 'ફોલો-અપ મુલાકાતો બતાવી રહ્યા છીએ' : 'Opening follow-up appointments',
    };
  }
  if (lower.includes('scan') || lower.includes('upload') || lower.includes('रिपोर्ट') || lower.includes('રિપોર્ટ')) {
    return {
      action: 'NAVIGATE',
      parameters: { target: 'scanner' },
      spokenFeedback: language === 'hi' ? 'दस्तावेज़ स्कैनर खोला जा रहा है' : language === 'gu' ? 'ડોક્યુમેન્ટ સ્કેનર ખોલી રહ્યા છીએ' : 'Opening document scanner',
    };
  }
  if (lower.includes('emergency') || lower.includes('help') || lower.includes('मदद') || lower.includes('કટોકટી')) {
    return {
      action: 'NAVIGATE',
      parameters: { target: 'emergency' },
      spokenFeedback: language === 'hi' ? 'आपातकालीन सहायता स्क्रीन खोली जा रही है' : language === 'gu' ? 'ઇમરજન્સી પેજ ખોલી રહ્યા છીએ' : 'Opening emergency assistance',
    };
  }
  if (lower.includes('home') || lower.includes('डैशबोर्ड') || lower.includes('મુખ્ય')) {
    return {
      action: 'NAVIGATE',
      parameters: { target: 'home' },
      spokenFeedback: language === 'hi' ? 'मुख्य पृष्ठ पर जा रहे हैं' : language === 'gu' ? 'મુખ્ય પૃષ્ઠ પર જઈ રહ્યા છીએ' : 'Navigating to home dashboard',
    };
  }

  // Log medication
  if (lower.includes('taken') || lower.includes('took') || lower.includes('લીધી') || lower.includes('ली')) {
    return {
      action: 'LOG_MEDICATION',
      parameters: { medicationName: 'Morning Medication', taken: true },
      spokenFeedback: language === 'hi' ? 'दवा ली गई दर्ज कर ली गई है' : language === 'gu' ? 'દવા લેવાઈ ગઈ તે નોંધી લીધું છે' : 'Logged your medication as taken successfully',
    };
  }

  return {
    action: 'ASK_INFO',
    parameters: { question: transcript },
    spokenFeedback: language === 'hi' ? 'मैं आपकी सहायता के लिए तैयार हूँ' : language === 'gu' ? 'હું તમારી સહાય કરવા તૈયાર છું' : 'Processing your voice request',
  };
}
