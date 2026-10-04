import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
  Calendar,
  Mic,
  Plus,
  Info,
  Check,
  Sparkles,
  ListTodo,
  Bell,
  Volume2
} from 'lucide-react';
import { Medication, Language, SafetyConflict } from '../types';
import { translations } from '../locales/translations';
import { tText } from '../utils/localizationHelper';

interface MedicationTrackerProps {
  medications: Medication[];
  conflicts: SafetyConflict[];
  currentLanguage: Language;
  onToggleTaken: (id: string) => void;
  onOpenVoiceAssistant: () => void;
  onSyncGoogleTasks: () => void;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  medications,
  conflicts,
  currentLanguage,
  onToggleTaken,
  onOpenVoiceAssistant,
  onSyncGoogleTasks,
}) => {
  const t = translations[currentLanguage];
  const [selectedTiming, setSelectedTiming] = useState<string>('All');
  const [remindersActive, setRemindersActive] = useState<boolean>(true);
  const [testingAlarm, setTestingAlarm] = useState<string | null>(null);

  const playChime = (slotName: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2); // A5
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      }
    } catch {
      // Audio context not allowed or unsupported
    }
    setTestingAlarm(slotName);
    setTimeout(() => setTestingAlarm(null), 3000);
  };

  const reminderSlots = [
    { label: currentLanguage === 'hi' ? 'सुबह' : currentLanguage === 'gu' ? 'સવાર' : 'Morning', time: '08:00 AM', tag: 'Morning' },
    { label: currentLanguage === 'hi' ? 'दोपहर' : currentLanguage === 'gu' ? 'બપોર' : 'Afternoon', time: '01:00 PM', tag: 'Afternoon' },
    { label: currentLanguage === 'hi' ? 'शाम' : currentLanguage === 'gu' ? 'સાંજ' : 'Evening', time: '06:30 PM', tag: 'Evening' },
    { label: currentLanguage === 'hi' ? 'रात' : currentLanguage === 'gu' ? 'રાત' : 'Night', time: '09:30 PM', tag: 'Night' },
  ];

  const timings = ['All', 'Morning', 'Afternoon', 'Evening', 'Night', 'As Needed'];

  const filteredMeds =
    selectedTiming === 'All'
      ? medications
      : medications.filter((m) => m.timing.includes(selectedTiming as any));

  const total = medications.length;
  const taken = medications.filter((m) => m.is_taken_today).length;
  const adherence = Math.round((taken / (total || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner & Adherence Meter */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
            <Pill className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'hi'
                ? 'डिस्चार्ज दवा कार्यक्रम'
                : currentLanguage === 'gu'
                ? 'ડિસ્ચાર્જ દવાનું સમયપત્રક'
                : 'Discharge Medication Schedule'}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.medicationsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            {currentLanguage === 'hi'
              ? 'हृदय और स्वास्थ्य सुरक्षा के लिए निर्धारित दवाओं का समय पर सेवन अत्यंत महत्वपूर्ण है।'
              : currentLanguage === 'gu'
              ? 'હૃદય અને સ્વાસ્થ્ય રક્ષણ માટે નિયત કરેલી દવાઓનું સમયસર સેવન અત્યંત મહત્વપૂર્ણ છે.'
              : 'Strict adherence to prescribed cardiac and antibiotic medications is critical for graft patency and infection prevention.'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-stretch md:self-auto justify-between md:justify-start">
          <div className="text-center">
            <div className="text-3xl font-extrabold">{adherence}%</div>
            <div className="text-[11px] text-teal-100 font-medium">
              {currentLanguage === 'hi' ? 'आज की नियमितता' : currentLanguage === 'gu' ? 'આજની નિયમિતતા' : "Today's Adherence"}
            </div>
          </div>
          <div className="h-10 w-px bg-white/20" />
          <div className="text-center">
            <div className="text-2xl font-bold">{taken} / {total}</div>
            <div className="text-[11px] text-teal-100 font-medium">
              {currentLanguage === 'hi' ? 'खुराक पूर्ण' : currentLanguage === 'gu' ? 'ડોઝ પૂર્ણ' : 'Doses Completed'}
            </div>
          </div>
        </div>
      </div>

      {/* Medication Reminder Alarms Schedule */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {currentLanguage === 'hi'
                    ? 'दवा रिमाइंडर और अलार्म समय'
                    : currentLanguage === 'gu'
                    ? 'દવા રીમાઇન્ડર અને એલાર્મ સમયપત્રક'
                    : 'Medication Dose Reminders & Alarms'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  {remindersActive ? 'Active' : 'Muted'}
                </span>
              </h4>
              <p className="text-xs text-slate-500">
                {currentLanguage === 'hi'
                  ? 'प्रत्येक समय स्लॉट के लिए निर्धारित अलार्म समय'
                  : currentLanguage === 'gu'
                  ? 'દરેક સમયગાળા માટે નક્કી કરેલ એલાર્મ'
                  : 'Automatic chimes & notifications configured for each dosing window.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setRemindersActive(!remindersActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              remindersActive
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300'
            }`}
          >
            {remindersActive ? '🔔 Reminders ON' : '🔕 Reminders OFF'}
          </button>
        </div>

        {/* Reminder Slot Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {reminderSlots.map((slot) => {
            const countForSlot = medications.filter((m) => m.timing.includes(slot.tag as any)).length;
            const isPlaying = testingAlarm === slot.tag;
            return (
              <div
                key={slot.tag}
                className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-teal-100 dark:bg-teal-900/60 border-teal-400 ring-2 ring-teal-400/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {slot.label}
                  </span>
                  <button
                    onClick={() => playChime(slot.tag)}
                    title="Test chime sound"
                    className="p-1 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-teal-600 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-sm font-extrabold font-mono text-teal-700 dark:text-teal-300">
                    {slot.time}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {countForSlot} {countForSlot === 1 ? 'dose' : 'doses'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Alert (NSAID vs Aspirin) */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-950 dark:text-teal-200">
            <span className="font-bold">
              {currentLanguage === 'hi' ? 'दवा सुरक्षा नोट: ' : currentLanguage === 'gu' ? 'દવા સુરક્ષા નોંધ: ' : 'Drug Safety Note: '}
            </span>
            {tText(conflicts[0].description, currentLanguage)} {tText(conflicts[0].recommendation, currentLanguage)}
          </div>
        </div>
      )}

      {/* Filter Tabs & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl overflow-x-auto max-w-full">
          {timings.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTiming(time)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTiming === time
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tText(time, currentLanguage)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVoiceAssistant}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold hover:bg-teal-100 transition-colors shadow-sm"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse text-teal-600" />
            <span>{tText('Voice Log Doses', currentLanguage)}</span>
          </button>

          <button
            onClick={onSyncGoogleTasks}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <ListTodo className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.syncToGoogleTasks}</span>
          </button>
        </div>
      </div>

      {/* Medications List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => (
          <div
            key={med.id}
            className={`p-5 rounded-3xl border transition-all ${
              med.is_taken_today
                ? 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-90'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-400'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    med.is_taken_today
                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                      : 'bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400'
                  }`}
                >
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {med.name}
                    <span className="text-xs font-normal text-slate-500">
                      ({med.dosage})
                    </span>
                  </h4>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                    {tText(med.purpose, currentLanguage)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onToggleTaken(med.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  med.is_taken_today
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-95'
                }`}
              >
                {med.is_taken_today ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.alreadyTaken}</span>
                  </>
                ) : (
                  <span>{t.logAsTaken}</span>
                )}
              </button>
            </div>

            {/* Badges / Instructions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {tText(med.frequency, currentLanguage)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {tText(med.food_relation, currentLanguage)}
                </span>
                {med.timing.map((itemTiming) => (
                  <span
                    key={itemTiming}
                    className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-medium text-[10px]"
                  >
                    {tText(itemTiming, currentLanguage)}
                  </span>
                ))}
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {currentLanguage === 'hi' ? 'निर्देश: ' : currentLanguage === 'gu' ? 'સૂચના: ' : 'Instructions: '}
                </span>
                {tText(med.instructions, currentLanguage)}
              </p>

              {med.precautions && (
                <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400 font-medium text-[11px] bg-amber-50/70 dark:bg-amber-950/30 p-2 rounded-xl">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{tText(med.precautions, currentLanguage)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
