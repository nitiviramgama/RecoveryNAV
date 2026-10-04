import React from 'react';
import { Mic, Volume2, Sparkles, X, ChevronUp } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface FloatingVoiceBarProps {
  isListening: boolean;
  transcript: string;
  feedbackText: string;
  currentLanguage: Language;
  onOpenModal: () => void;
  onToggleMic: () => void;
}

export const FloatingVoiceBar: React.FC<FloatingVoiceBarProps> = ({
  isListening,
  transcript,
  feedbackText,
  currentLanguage,
  onOpenModal,
  onToggleMic,
}) => {
  const t = translations[currentLanguage];

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      {/* Active speech bubble if speaking or feedback */}
      {(transcript || feedbackText) && (
        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 text-white text-xs backdrop-blur-md shadow-xl border border-slate-700 max-w-xs animate-in slide-in-from-bottom-2">
          <Volume2 className="w-3.5 h-3.5 text-teal-400 shrink-0 animate-pulse" />
          <span className="truncate">{feedbackText || transcript}</span>
        </div>
      )}

      {/* Floating Microphone Trigger */}
      <button
        onClick={onOpenModal}
        className={`flex items-center gap-2.5 px-4 py-3 rounded-full text-white font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-95 ${
          isListening
            ? 'bg-red-500 shadow-red-500/40 ring-4 ring-red-400/30 animate-pulse'
            : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30'
        }`}
      >
        <Mic className="w-4 h-4 text-white" />
        <span className="hidden xs:inline">
          {isListening ? 'Listening...' : 'Voice Assistant'}
        </span>
      </button>
    </div>
  );
};
