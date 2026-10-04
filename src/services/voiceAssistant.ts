import { Language } from '../types';
import { interpretVoiceCommandWithAI, textToSpeechAudio } from './geminiClient';

export interface VoiceAssistantCallbacks {
  onNavigate: (section: string) => void;
  onLogMedication: (name: string) => void;
  onLogExercise: (title: string) => void;
  onSpokenFeedback: (text: string) => void;
  onStatusChange: (isListening: boolean, transcript: string) => void;
}

class VoiceAssistantService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: Language = 'en';
  private callbacks: VoiceAssistantCallbacks | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks?.onStatusChange(true, '');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks?.onStatusChange(false, '');
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.callbacks?.onStatusChange(false, '');
      };

      this.recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.callbacks?.onStatusChange(false, transcript);
        await this.handleTranscript(transcript);
      };
    }
  }

  public registerCallbacks(callbacks: VoiceAssistantCallbacks) {
    this.callbacks = callbacks;
  }

  public setLanguage(lang: Language) {
    this.currentLanguage = lang;
    if (this.recognition) {
      if (lang === 'hi') {
        this.recognition.lang = 'hi-IN';
      } else if (lang === 'gu') {
        this.recognition.lang = 'gu-IN';
      } else {
        this.recognition.lang = 'en-US';
      }
    }
  }

  public startListening() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    if (this.recognition && !this.isListening) {
      try {
        this.setLanguage(this.currentLanguage);
        this.recognition.start();
      } catch (e) {
        console.warn('Could not start recognition:', e);
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Could not stop recognition:', e);
      }
    }
  }

  public async handleTranscript(transcript: string) {
    if (!transcript.trim()) return;

    const parsed = await interpretVoiceCommandWithAI(transcript, this.currentLanguage);
    const feedback = parsed.spokenFeedback || 'Command processed';

    // Provide audible feedback
    this.callbacks?.onSpokenFeedback(feedback);
    await this.speak(feedback);

    if (parsed.action === 'NAVIGATE' && parsed.parameters?.target) {
      this.callbacks?.onNavigate(parsed.parameters.target);
    } else if (parsed.action === 'LOG_MEDICATION') {
      this.callbacks?.onLogMedication(parsed.parameters?.medicationName || 'morning');
    } else if (parsed.action === 'LOG_EXERCISE') {
      this.callbacks?.onLogExercise(parsed.parameters?.exerciseTitle || 'exercise');
    }
  }

  public async speak(text: string): Promise<void> {
    // 1. Try Gemini TTS audio
    try {
      const audioBase64 = await textToSpeechAudio(text, this.currentLanguage);
      if (audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        this.currentAudio = audio;
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Audio playback from Gemini TTS failed, using Web Speech synthesis:', e);
    }

    // 2. Web Speech API fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.currentLanguage === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (this.currentLanguage === 'gu') {
        utterance.lang = 'gu-IN';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceAssistant = new VoiceAssistantService();
