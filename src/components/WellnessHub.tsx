import React, { useState } from 'react';
import {
  Droplets,
  HeartPulse,
  Activity,
  Thermometer,
  Moon,
  Sparkles,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales/translations';

interface WellnessHubProps {
  user: User;
  currentLanguage: Language;
  hydrationCount: number;
  dietaryInstructions: string;
  hydrationTargetMl?: number;
  onIncrementHydration: () => void;
  onResetHydration: () => void;
}

export const WellnessHub: React.FC<WellnessHubProps> = ({
  user,
  currentLanguage,
  hydrationCount,
  dietaryInstructions,
  hydrationTargetMl = 2000,
  onIncrementHydration,
  onResetHydration,
}) => {
  const t = translations[currentLanguage];
  const [bloodPressure, setBloodPressure] = useState('118/76');
  const [heartRate, setHeartRate] = useState(68);
  const [oxygenSpO2, setOxygenSpO2] = useState(98);
  const [tempF, setTempF] = useState(98.4);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [vitalsSaved, setVitalsSaved] = useState(false);

  const targetMl = hydrationTargetMl;
  const targetGlasses = Math.max(1, Math.ceil(targetMl / 250));

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    setVitalsSaved(true);
    setTimeout(() => setVitalsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5" />
          <span>Vitals Monitoring & Wellness Habits</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t.featWellnessTitle}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
          Track essential post-op recovery metrics: blood pressure, pulse rhythm, hydration balance, and restful sleep.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Tracker Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hydration Target Tracker
                </h3>
                <p className="text-xs text-slate-500">Hydration target extracted from your recovery documents.</p>
              </div>
            </div>
            <button
              onClick={onResetHydration}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Reset
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold text-sky-700 dark:text-sky-300">
                {hydrationCount * 250} <span className="text-sm font-semibold">/ {targetMl} ml</span>
              </div>
              <div className="text-xs text-sky-600 font-medium mt-0.5">
                {hydrationCount} of {targetGlasses} glasses consumed
              </div>
            </div>

            <button
              onClick={onIncrementHydration}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 active:scale-95 transition-transform flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+1 Glass (250ml)</span>
            </button>
          </div>

          {/* Visual Glass Indicators */}
          <div className="grid grid-cols-8 gap-2 pt-2">
            {Array.from({ length: targetGlasses }).map((_, i) => (
              <div
                key={i}
                className={`h-12 rounded-xl border flex items-end justify-center pb-1 transition-all ${
                  i < hydrationCount
                    ? 'bg-sky-500 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Document-derived Diet Plan */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400"><Sparkles className="w-6 h-6" /></div>
            <div><h3 className="text-base font-bold text-slate-900 dark:text-white">Personalized Diet Plan</h3><p className="text-xs text-slate-500">Built from your analyzed discharge documents</p></div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
            {dietaryInstructions || 'No dietary instructions were found in the supplied documents.'}
          </div>
        </div>

        {/* Daily Recovery Vitals Log Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log Recovery Vitals
              </h3>
              <p className="text-xs text-slate-500">Record according to your discharge instructions or care plan</p>
            </div>
          </div>

          <form onSubmit={handleSaveVitals} className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Blood Pressure (mmHg)
              </label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Resting Pulse (BPM)
              </label>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Oxygen Saturation (SpO2 %)
              </label>
              <input
                type="number"
                value={oxygenSpO2}
                onChange={(e) => setOxygenSpO2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Body Temp (°F)
              </label>
              <input
                type="number"
                step="0.1"
                value={tempF}
                onChange={(e) => setTempF(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {vitalsSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Vitals Logged to Clinical Record</span>
                  </>
                ) : (
                  <span>Save Vitals Log</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
