import React from 'react';
import {
  Home,
  MessageSquare,
  Stethoscope,
  BookOpen,
  Pill,
  FileText,
  Leaf,
  MapPin,
  AlertTriangle,
  Bookmark,
  MessageCircle,
  Settings,
  HeartHandshake,
  X,
  Heart
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

export type NavSection =
  | 'home'
  | 'ask-ai'
  | 'symptom-guide'
  | 'health-library'
  | 'medications'
  | 'upload-report'
  | 'wellness-hub'
  | 'find-healthcare'
  | 'emergency-help'
  | 'saved'
  | 'my-chats'
  | 'settings'
  | 'database-api'
  | 'audit-trail';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  currentLanguage: Language;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  currentLanguage,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const t = translations[currentLanguage];

  const mainNavItems: { id: NavSection; label: string; icon: React.ReactNode; badge?: string; danger?: boolean }[] = [
    { id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: 'ask-ai', label: t.navAskAI, icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'symptom-guide', label: t.navSymptomGuide, icon: <Stethoscope className="w-5 h-5" /> },
    { id: 'health-library', label: t.navHealthLibrary, icon: <BookOpen className="w-5 h-5" /> },
    { id: 'medications', label: t.navMedicineInfo, icon: <Pill className="w-5 h-5" />, badge: '6' },
    { id: 'upload-report', label: t.navUploadReport, icon: <FileText className="w-5 h-5" /> },
    { id: 'wellness-hub', label: t.navWellnessHub, icon: <Leaf className="w-5 h-5" /> },
    { id: 'find-healthcare', label: t.navFindHealthcare, icon: <MapPin className="w-5 h-5" /> },
    {
      id: 'emergency-help',
      label: t.navEmergencyHelp,
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      danger: true,
    },
  ];

  const secondaryNavItems: { id: NavSection; label: string; icon: React.ReactNode }[] = [
    { id: 'saved', label: t.navSaved, icon: <Bookmark className="w-4.5 h-4.5" /> },
    { id: 'my-chats', label: t.navMyChats, icon: <MessageCircle className="w-4.5 h-4.5" /> },
    { id: 'settings', label: t.navSettings, icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  const renderNavList = (onItemClick?: () => void) => (
    <div className="space-y-6">
      {/* Main Menu */}
      <nav className="space-y-1">
        {mainNavItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectSection(item.id);
                onItemClick?.();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? item.danger
                    ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-semibold'
                    : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold shadow-sm'
                  : item.danger
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    isActive
                      ? item.danger
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-teal-600 dark:text-teal-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
        <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          System & Records
        </div>
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onItemClick?.();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <span className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Aside (Hidden on Mobile, Visible on Large Screens) */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between py-6 px-4 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
        {renderNavList()}

        {/* Motivational Bottom Card */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/70 dark:from-slate-800/80 dark:to-slate-800/40 border border-teal-100 dark:border-slate-700/60 relative overflow-hidden shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                “Small steps lead to a healthier tomorrow.”
              </p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 font-semibold">
                RecoveryNav Care Team
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Aside Drawer (Active when isMobileOpen is true) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-5 shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-5">
              {/* Header with Brand & Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    Recovery<span className="text-teal-600 dark:text-teal-400">Nav</span>
                  </span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items (auto closes drawer upon selection) */}
              {renderNavList(onCloseMobile)}
            </div>

            {/* Motivational Bottom Card */}
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/70 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700/60">
              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  “Small steps lead to a healthier tomorrow.”
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
