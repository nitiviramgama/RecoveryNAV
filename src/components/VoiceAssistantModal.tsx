import React from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Command,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  transcript: string;
  feedbackText: string;
  currentLanguage: Language;
  onStartListening: () => void;
  onStopListening: () => void;
  onSimulateCommand: (command: string) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  isListening,
  transcript,
  feedbackText,
  currentLanguage,
  onStartListening,
  onStopListening,
  onSimulateCommand,
}) => {
  const t = translations[currentLanguage];

  if (!isOpen) return null;

  const quickCommands = {
    en: [
      '“Go to medications”',
      '“Mark morning pills as taken”',
      '“Show physical therapy exercises”',
      '“Open follow-up appointments”',
      '“Scan discharge document”',
      '“Emergency help”',
    ],
    hi: [
      '“दवाओं पर जाओ”',
      '“सुबह की दवा ली गई दर्ज करो”',
      '“कसरत दिखाओ”',
      '“डॉक्टर अपॉइंटमेंट खोलो”',
      '“आपातकालीन सहायता”',
    ],
    gu: [
      '“દવાઓ બતાવો”',
      '“દવા લીધી તે નોંધો”',
      '“કસરતો બતાવો”',
      '“એપોઇન્ટમેન્ટ ખોલો”',
      '“ઇમરજન્સી મદદ”',
    ],
  }[currentLanguage] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.voiceAssistantTitle}
              </h3>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                {t.voiceAssistantAccessible}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Audio Waveform & Mic Circle */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <button
            onClick={isListening ? onStopListening : onStartListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all relative ${
              isListening
                ? 'bg-red-500 text-white shadow-red-500/30 scale-105 ring-8 ring-red-500/20 animate-pulse'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-600/30 active:scale-95'
            }`}
          >
            {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          {/* Status Label */}
          <div className="text-center space-y-1">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isListening ? 'text-red-500 animate-pulse' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {isListening ? t.voiceListening : 'Tap Microphone to Speak'}
            </span>
            <p className="text-xs text-slate-400 max-w-xs">
              {isListening
                ? 'Speak in English, हिन्दी, or ગુજરાતી...'
                : 'Supports hands-free section navigation, medication logging, and appointment checks.'}
            </p>
          </div>

          {/* Live Transcript Bubble */}
          {(transcript || feedbackText) && (
            <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-center space-y-2">
              {transcript && (
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 italic">
                  “{transcript}”
                </div>
              )}
              {feedbackText && (
                <div className="text-sm font-bold text-teal-700 dark:text-teal-300 flex items-center justify-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-teal-600 animate-pulse" />
                  <span>{feedbackText}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Voice Command Suggestions */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-teal-600" />
            <span>Try saying or tapping:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {quickCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => onSimulateCommand(cmd.replace(/“|”/g, ''))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-teal-500 border border-transparent transition-colors text-left"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-teal-600">
            <CheckCircle2 className="w-3 h-3" />
            Clear Audio Feedback Enabled
          </span>
          <span>Web Speech & Gemini 3.8 TTS</span>
        </div>
      </div>
    </div>
  );
};
