import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  PhoneCall,
  Activity,
  HeartPulse
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface SymptomGuideProps {
  currentLanguage: Language;
  warningSigns: string[];
  onCallEmergency: () => void;
}

export const SymptomGuide: React.FC<SymptomGuideProps> = ({
  currentLanguage,
  warningSigns,
  onCallEmergency,
}) => {
  const t = translations[currentLanguage];
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CHEST' | 'WOUND' | 'BREATHING'>('ALL');

  const symptoms = warningSigns.map((warning, idx) => ({
    title: warning,
    urgency: idx === 0 ? 'EMERGENCY' : 'URGENT',
    desc: 'This warning sign was identified from your supplied recovery documents.',
    action: idx === 0 ? 'Seek urgent medical attention or use the emergency service specified in your discharge instructions.' : 'Contact your healthcare provider promptly and follow the instructions in your discharge documents.',
    category: idx % 3 === 0 ? 'CHEST' : idx % 3 === 1 ? 'WOUND' : 'BREATHING',
  }));


  const filtered = selectedCategory === 'ALL'
    ? symptoms
    : symptoms.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Post-Operative Triage & Warning Signs</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t.featSymptomTitle}
        </h2>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          Quickly identify whether a sensation is part of normal surgical healing, requires a prompt call to your doctor, or demands immediate emergency care.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'CHEST', 'WOUND', 'BREATHING'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Symptoms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length > 0 ? filtered.map((sym, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-3xl border transition-all ${
              sym.urgency === 'EMERGENCY'
                ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900/60'
                : sym.urgency === 'URGENT'
                ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase mb-2 ${
                    sym.urgency === 'EMERGENCY'
                      ? 'bg-red-600 text-white animate-pulse'
                      : sym.urgency === 'URGENT'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {sym.urgency}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {sym.title}
                </h4>
              </div>

              {sym.urgency === 'EMERGENCY' && (
                <button
                  onClick={onCallEmergency}
                  className="p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-sm shrink-0"
                  title="Call Emergency"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {sym.desc}
            </p>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold">
              <span className="text-slate-500">Action: </span>
              <span
                className={
                  sym.urgency === 'EMERGENCY'
                    ? 'text-red-700 dark:text-red-400'
                    : sym.urgency === 'URGENT'
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-teal-700 dark:text-teal-400'
                }
              >
                {sym.action}
              </span>
            </div>
          </div>
        )) : (
          <div className="md:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-500">
            No red-flag warning signs were found in the analyzed documents. If you develop concerning symptoms, contact your healthcare provider.
          </div>
        )}
      </div>
    </div>
  );
};
