import React, { useState } from 'react';
import {
  Heart,
  Search,
  Globe,
  Bell,
  Sun,
  Moon,
  Mic,
  Wifi,
  WifiOff,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  UserCheck,
  LogOut,
  Menu,
  FileText
} from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales/translations';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isOnline: boolean;
  user: User;
  onOpenVoiceAssistant: () => void;
  onSearch: (query: string) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onLogout: () => void;
  onToggleMobileSidebar?: () => void;
  onOpenDischargeIntake?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  isOnline,
  user,
  onOpenVoiceAssistant,
  onSearch,
  onOpenNotifications,
  unreadCount,
  onLogout,
  onToggleMobileSidebar,
  onOpenDischargeIntake,
}) => {
  const t = translations[currentLanguage];
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearch(searchVal.trim());
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          {/* Mobile Aside Toggle Button */}
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Open Navigation Menu"
            className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recovery<span className="text-teal-600 dark:text-teal-400">Nav</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                AI Health Guide
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Global Search Bar (Matching Screenshot 1) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl hidden md:flex items-center relative"
        >
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full text-sm border border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-teal-500 dark:text-teal-400 pointer-events-none">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online/Offline Badge */}
          <div
            title={isOnline ? t.onlineMode : t.offlineMessage}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>

          {/* Voice Assistant Mic Button (Prominent in Header) */}
          <button
            onClick={onOpenVoiceAssistant}
            title={t.voiceAssistantTitle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-medium text-xs sm:text-sm transition-all shadow-sm active:scale-95"
          >
            <Mic className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>

          {/* Quick Scan / Upload Discharge Summary Button */}
          {onOpenDischargeIntake && (
            <button
              onClick={onOpenDischargeIntake}
              title="Upload & Analyze Discharge Summary"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold text-xs sm:text-sm transition-all shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {currentLanguage === 'hi'
                  ? 'दस्तावेज़ स्कैन'
                  : currentLanguage === 'gu'
                  ? 'દસ્તાવેજ સ્કેન'
                  : 'Scan Discharge'}
              </span>
            </button>
          )}

          {/* Language Switcher Dropdown (Matching Screenshot 1) */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="hidden xs:inline">
                {languages.find((l) => l.code === currentLanguage)?.label.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Language / ભાષા / भाषा
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-medium'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>
                      {lang.flag} {lang.label}
                    </span>
                    {currentLanguage === lang.code && <span className="text-teal-600 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? t.lightMode : t.darkMode}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* User Profile (Matching Screenshot 1: Hello, Niti) */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white dark:ring-slate-900">
              {user.full_name.charAt(0)}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                Hello, {user.full_name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Patient</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
