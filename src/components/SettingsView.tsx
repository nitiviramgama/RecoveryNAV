import React from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Sun,
  Moon,
  Mic,
  Shield,
  Wifi,
  RotateCcw,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales/translations';

interface SettingsViewProps {
  user: User;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenOnboarding: () => void;
  onClearOfflineCache: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  currentLanguage,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  onOpenOnboarding,
  onClearOfflineCache,
}) => {
  const t = translations[currentLanguage];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-teal-600" />
          <span>{t.navSettings}</span>
        </h2>
        <p className="text-xs text-slate-500">
          Configure multilingual voice assistance, theme modes, HIPAA privacy locks, and offline cache storage.
        </p>
      </div>

      {/* Language Selection */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-teal-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Application & Voice Language
            </h4>
            <p className="text-xs text-slate-500">
              Select your primary language for voice commands, audio playback, and dashboard texts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { code: 'en' as Language, title: 'English', desc: 'Standard Medical UK/US' },
            { code: 'hi' as Language, title: 'हिन्दी (Hindi)', desc: 'हिंदी भाषा और वॉयस' },
            { code: 'gu' as Language, title: 'ગુજરાતી (Gujarati)', desc: 'ગુજરાતી ભાષા અને અવાજ' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => onLanguageChange(item.code)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                currentLanguage === item.code
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-sm">{item.title}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dark Mode */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          {darkMode ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-teal-600" />}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Night Reading Mode (Dark Theme)
            </h4>
            <p className="text-xs text-slate-500">
              Reduces blue light exposure and ocular strain for nighttime medication checking.
            </p>
          </div>
        </div>

        <button
          onClick={onToggleDarkMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            darkMode
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {darkMode ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* Onboarding walkthrough */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Onboarding Tutorial & How It Works
          </h4>
          <p className="text-xs text-slate-500">
            Revisit the intuitive 4-step recovery navigation walkthrough.
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-200 dark:border-teal-800 hover:bg-teal-100"
        >
          View Walkthrough
        </button>
      </div>

      {/* Offline Storage & Cache */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-teal-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Local Offline Storage Cache
            </h4>
            <p className="text-xs text-slate-500">
              Discharge documents, medications, and contact numbers cached locally on your device.
            </p>
          </div>
        </div>

        <button
          onClick={onClearOfflineCache}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold"
        >
          Clear & Refresh Cache
        </button>
      </div>
    </div>
  );
};
