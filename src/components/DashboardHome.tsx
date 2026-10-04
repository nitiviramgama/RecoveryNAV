import React, { useState } from 'react';
import {
  MessageSquare,
  Stethoscope,
  BookOpen,
  Pill,
  FileText,
  Leaf,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Send,
  CheckCircle2,
  Circle,
  PhoneCall,
  Calendar,
  Sparkles,
  Dumbbell,
  ShieldAlert,
  ChevronRight,
  Bookmark,
  MessageCircle,
  Settings as SettingsIcon,
  Flame,
  Droplets,
  HeartPulse
} from 'lucide-react';
import { Language, User, Medication, PhysicalTherapyExercise, Appointment, SafetyConflict, DischargeSummary } from '../types';
import { translations } from '../locales/translations';
import { NavSection } from './Sidebar';
import { tText } from '../utils/localizationHelper';

interface DashboardHomeProps {
  user: User;
  currentLanguage: Language;
  onNavigate: (section: NavSection) => void;
  medications: Medication[];
  exercises: PhysicalTherapyExercise[];
  appointments: Appointment[];
  conflicts: SafetyConflict[];
  onToggleMedicationTaken: (id: string) => void;
  onToggleExerciseCompleted: (id: string) => void;
  onQuickAskAI: (prompt: string) => void;
  onCallEmergency: () => void;
  hydrationCount: number;
  hydrationTargetMl?: number;
  onIncrementHydration: () => void;
  dischargeSummary?: DischargeSummary;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  user,
  currentLanguage,
  onNavigate,
  medications,
  exercises,
  appointments,
  conflicts,
  onToggleMedicationTaken,
  onToggleExerciseCompleted,
  onQuickAskAI,
  onCallEmergency,
  hydrationCount,
  hydrationTargetMl = 2000,
  onIncrementHydration,
  dischargeSummary,
}) => {
  const t = translations[currentLanguage];
  const [askInput, setAskInput] = useState('');

  const completedMeds = medications.filter((m) => m.is_taken_today).length;
  const totalMeds = medications.length || 1;
  const completedExercises = exercises.filter((e) => e.is_completed_today).length;
  const totalExercises = exercises.length || 1;

  // Recovery progress calculation
  const recoveryProgressPercent = Math.min(
    100,
    Math.round(((completedMeds / totalMeds) * 0.5 + (completedExercises / totalExercises) * 0.3 + (hydrationCount >= 8 ? 0.2 : (hydrationCount / 8) * 0.2)) * 100)
  );

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (askInput.trim()) {
      onQuickAskAI(askInput.trim());
      onNavigate('ask-ai');
    }
  };

  return (
    <div className="space-y-8">
      {/* Critical Safety Conflicts Alert Banner (if unresolved) */}
      {conflicts.filter((c) => !c.is_resolved).length > 0 && (
        <div className="p-4 rounded-2xl bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-start justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 shrink-0">
              <ShieldAlert className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-teal-950 dark:text-teal-200">
                {t.conflictsTitle}: {currentLanguage === 'hi' ? 'दवा / गतिविधि सुरक्षा चेतावनी' : currentLanguage === 'gu' ? 'દવા / પ્રવૃત્તિ સલામતી ચેતવણી' : 'Potential Contraindication Detected'}
              </h4>
              <p className="text-xs text-teal-800 dark:text-teal-300 mt-0.5">
                {tText(conflicts[0].title, currentLanguage)} — {tText(conflicts[0].recommendation, currentLanguage)}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('medications')}
            className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
          >
            {currentLanguage === 'hi' ? 'सावधानी देखें' : currentLanguage === 'gu' ? 'ચેતવણી જુઓ' : 'Review Caution'}
          </button>
        </div>
      )}

      {/* Main Grid: Left 2 Cols (Hero + Features + Today's Recovery), Right 1 Col (Daily Banner + Quick Actions + Emergency) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns */}
        <div className="xl:col-span-2 space-y-8">
          {/* Top Hero Card (Matching Screenshot 1) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-50 via-teal-100/50 to-emerald-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-teal-950/40 border border-teal-100 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
            <div className="max-w-xl space-y-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 mb-2 border border-teal-200 dark:border-teal-800">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  {currentLanguage === 'hi' ? 'AI-सहायित रिकवरी सहायता' : currentLanguage === 'gu' ? 'AI-સહાયિત રિકવરી માર્ગદર્શન' : 'AI-Assisted Recovery Support'}
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t.heroWelcome}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 font-medium">
                  {t.heroSubtitle}
                </p>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  {t.trustedBadge}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  {t.simpleBadge}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  {t.aiBadge}
                </span>
              </div>

              {/* Hero Search / Prompt Input (Matching Screenshot 1) */}
              <form onSubmit={handleHeroSubmit} className="pt-2">
                <div className="relative flex items-center shadow-md rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <input
                    type="text"
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    placeholder={t.askHealthPrompt}
                    className="w-full pl-5 pr-14 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-transform active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Doctor Avatar / Medical Graphic Illustration */}
            <div className="hidden md:flex absolute right-6 -bottom-4 items-end pointer-events-none opacity-90 select-none">
              <div className="relative">
                <div className="w-48 h-56 bg-gradient-to-t from-teal-500/20 to-transparent rounded-full filter blur-xl absolute -bottom-4 -left-4" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 shadow-md border border-teal-100 dark:border-slate-700 text-[11px] font-bold text-teal-700 dark:text-teal-300 mb-2 animate-bounce">
                    {currentLanguage === 'hi' ? 'बेहतर स्वास्थ्य, उज्ज्वल भविष्य ❤️' : currentLanguage === 'gu' ? 'ઉત્તમ આરોગ્ય, ઉજ્જવળ ભવિષ્ય ❤️' : 'Better Health, Brighter You ❤️'}
                  </div>
                  <div className="w-36 h-48 rounded-t-full bg-teal-600/10 dark:bg-teal-500/20 border-2 border-dashed border-teal-300 dark:border-teal-700 flex flex-col items-center justify-center p-3 text-center">
                    <HeartPulse className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-pulse mb-1" />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1 text-center">
                      {dischargeSummary?.hospital_name
                        ? dischargeSummary.hospital_name.split(' - ')[0]
                        : currentLanguage === 'hi'
                        ? 'अपोलो हार्ट केयर'
                        : currentLanguage === 'gu'
                        ? 'એપોલો હાર્ટ કેર'
                        : 'Your Healthcare Provider'}
                    </span>
                    <span className="text-[9px] text-slate-500 line-clamp-1 text-center">
                      {dischargeSummary?.surgical_procedure || dischargeSummary?.diagnosis?.slice(0, 32) || (
                        currentLanguage === 'hi'
                          ? 'सर्जरी पश्चात प्रोटोकॉल'
                          : currentLanguage === 'gu'
                          ? 'સર્જરી પછીનો પ્રોટોકોલ'
                          : 'Personalized Recovery Plan'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Recovery Progress Card (Matching Screenshot 2) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {t.recoveryDashboard}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {t.goodMorning}, {user.full_name.split(' ')[0] || user.full_name}
                  {user.mrn && (
                    <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-normal">
                      {user.mrn}
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5" />
                  <span>{medications.length} {t.medicinesCount.split(' ')[1] || 'Medicines'}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{exercises.length} {t.tasksCount.split(' ')[1] || 'Tasks'}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar (Matching Screenshot 2: Recovery Progress 72%) */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t.recoveryProgress}
                </span>
                <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                  {recoveryProgressPercent}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${recoveryProgressPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.keepFollowing}
              </p>
            </div>

            {/* Today's Recovery Checklist Items (Matching Screenshot 2) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.todaysRecovery}</span>
                <button
                  onClick={() => onNavigate('medications')}
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 text-xs font-medium"
                >
                  {t.viewAll}
                </button>
              </div>

              {/* Medication Item */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-100/80 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {medications.length > 0 ? `${t.medicationLabel}: ${medications.slice(0, 2).map((m) => m.name).join(' & ')}` : 'No medications extracted'}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.takePrescribed} ({currentLanguage === 'hi' ? 'सुबह की खुराक' : currentLanguage === 'gu' ? 'સવારની દવા' : 'Morning Doses'})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => medications[0] && onToggleMedicationTaken(medications[0].id)}
                  className="text-teal-600 dark:text-teal-400 hover:scale-105 transition-transform"
                >
                  {medications[0]?.is_taken_today ? (
                    <CheckCircle2 className="w-6 h-6 fill-teal-600 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Physical Therapy Activity Item */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.lightActivityLabel}: {tText(exercises[0]?.title, currentLanguage) || 'Spirometer & Ankle Pumps'}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.lightActivityDesc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => exercises[0] && onToggleExerciseCompleted(exercises[0].id)}
                  className="text-teal-600 dark:text-teal-400 hover:scale-105 transition-transform"
                >
                  {exercises[0]?.is_completed_today ? (
                    <CheckCircle2 className="w-6 h-6 fill-teal-600 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Hydration Tracker Item */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-100/80 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.hydrationLabel} ({hydrationCount * 250} ml / {hydrationTargetMl} ml)
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t.hydrationDesc}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onIncrementHydration}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 hover:bg-sky-200 transition-colors"
                >
                  {currentLanguage === 'hi' ? '+ गिलास जोड़ें (250ml)' : currentLanguage === 'gu' ? '+ ગ્લાસ ઉમેરો (250ml)' : '+ Add Glass (250ml)'}
                </button>
              </div>
            </div>
          </div>

          {/* Explore Our Features Grid (8 Cards Matching Screenshot 1) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.exploreFeatures}
              </h3>
              <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold cursor-pointer">
                {t.viewAll} →
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Ask AI Assistant */}
              <div
                onClick={() => onNavigate('ask-ai')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {t.featAskAITitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featAskAIDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featAskAIAction}
                </div>
              </div>

              {/* 2. Symptom Guide */}
              <div
                onClick={() => onNavigate('symptom-guide')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {t.featSymptomTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featSymptomDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featSymptomAction}
                </div>
              </div>

              {/* 3. Health Library */}
              <div
                onClick={() => onNavigate('health-library')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {t.featLibraryTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featLibraryDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featLibraryAction}
                </div>
              </div>

              {/* 4. Medicine Information */}
              <div
                onClick={() => onNavigate('medications')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {t.featMedicineTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featMedicineDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featMedicineAction}
                </div>
              </div>

              {/* 5. Upload Medical Report */}
              <div
                onClick={() => onNavigate('upload-report')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {t.featUploadTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featUploadDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featUploadAction}
                </div>
              </div>

              {/* 6. Wellness Hub */}
              <div
                onClick={() => onNavigate('wellness-hub')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {t.featWellnessTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featWellnessDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featWellnessAction}
                </div>
              </div>

              {/* 7. Find Healthcare / Follow-up */}
              <div
                onClick={() => onNavigate('find-healthcare')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                    {t.featFindTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featFindDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featFindAction}
                </div>
              </div>

              {/* 8. Emergency Help */}
              <div
                onClick={() => onNavigate('emergency-help')}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950/60 hover:border-red-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-red-600 dark:text-red-400 transition-colors">
                    {t.featEmergencyTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {t.featEmergencyDesc}
                  </p>
                </div>
                <div className="pt-3 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {t.featEmergencyAction}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Quotes, Quick Actions & Emergency Card (Matching Screenshot 1) */}
        <div className="space-y-6">
          {/* Landscape Photo Card with Inspirational Quote (Matching Screenshot 1) */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 text-white relative shadow-md p-6 min-h-[160px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" />
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                {currentLanguage === 'hi' ? 'दैनिक स्वास्थ्य संकल्प' : currentLanguage === 'gu' ? 'દૈનિક સ્વાસ્થ્ય સંકલ્પ' : 'Daily Recovery Affirmation'}
              </span>
              <p className="text-lg font-semibold italic leading-snug">
                {t.quoteRight}
              </p>
              <div className="w-12 h-1 bg-teal-400 rounded-full" />
            </div>
          </div>

          {/* Date Widget (Matching Screenshot 1: Fri, 12 Sept 2026) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {new Date().toLocaleDateString(currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'gu' ? 'gu-IN' : 'en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentLanguage === 'hi'
                  ? 'मजबूत कल के लिए आज ही अपने स्वास्थ्य का ध्यान रखें।'
                  : currentLanguage === 'gu'
                  ? 'મજબૂત આવતીકાલ માટે આજે જ તમારા સ્વાસ્થ્યની કાળજી લો.'
                  : 'Take care of your health today for a stronger tomorrow.'}
              </p>
            </div>
          </div>

          {/* Quick Actions Card (Matching Screenshot 1) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.quickActions}
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <button
                onClick={() => onNavigate('health-library')}
                className="w-full py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{t.bookmarkedArticles}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('my-chats')}
                className="w-full py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{t.viewMyChats}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('upload-report')}
                className="w-full py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{t.myReports}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="w-full py-2.5 flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <SettingsIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{t.navSettings}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* In an Emergency? Card (Matching Screenshot 1) */}
          <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="text-base font-bold text-red-700 dark:text-red-400">
                {t.inAnEmergency}
              </h4>
            </div>

            <p className="text-xs text-red-900 dark:text-red-300 leading-relaxed">
              {t.emergencyDesc}
            </p>

            <button
              onClick={onCallEmergency}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.callEmergencyBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Banner: Small Steps, Big Results (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-sm shrink-0">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t.smallStepsHeader}
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {t.smallStepsSub}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-100 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 italic">
            {t.quoteBottom}
          </p>
        </div>
      </div>
    </div>
  );
};
