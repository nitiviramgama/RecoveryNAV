import React, { useState } from 'react';
import {
  Dumbbell,
  Wind,
  Footprints,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ListTodo,
  Sparkles,
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { PhysicalTherapyExercise, Language } from '../types';
import { translations } from '../locales/translations';
import { tText } from '../utils/localizationHelper';

interface ExerciseTrackerProps {
  exercises: PhysicalTherapyExercise[];
  currentLanguage: Language;
  onToggleComplete: (id: string) => void;
  onSyncGoogleTasks: () => void;
}

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({
  exercises,
  currentLanguage,
  onToggleComplete,
  onSyncGoogleTasks,
}) => {
  const t = translations[currentLanguage];
  const [activeTimerExId, setActiveTimerExId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min default
  const [timerRunning, setTimerRunning] = useState(false);

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Breathing':
        return <Wind className="w-5 h-5 text-sky-500" />;
      case 'Circulation':
      case 'Walking':
        return <Footprints className="w-5 h-5 text-emerald-500" />;
      default:
        return <Dumbbell className="w-5 h-5 text-teal-500" />;
    }
  };

  const handleStartTimer = (ex: PhysicalTherapyExercise) => {
    setActiveTimerExId(ex.id);
    setTimerSeconds(ex.duration_minutes * 60);
    setTimerRunning(true);
  };

  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'hi'
                ? 'कार्डियोपल्मोनरी और छाती पुनर्वास'
                : currentLanguage === 'gu'
                ? 'કાર્ડિયોપલ્મોનરી અને છાતી પુનર્વસન'
                : 'Cardiopulmonary & Sternal Rehabilitation'}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.exercisesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            {currentLanguage === 'hi'
              ? 'हल्की गतिशीलता और गहरी सांस के व्यायाम रक्त के थक्कों और फेफड़ों के संक्रमण से बचाते हैं। 5 किलो से अधिक वजन कभी न उठाएं।'
              : currentLanguage === 'gu'
              ? 'હળવી કસરતો અને ઊંડા શ્વાસની ક્રિયાઓ લોહી ગંઠાઈ જતું અટકાવે છે અને ફેફસાંને મજબૂત કરે છે. 5 કિલોથી વધુ વજન ક્યારેય ન ઉઠાવો.'
              : 'Gentle mobility and deep breathing exercises prevent atelectasis and deep vein thrombosis. Never lift more than 5kg.'}
          </p>
        </div>

        <button
          onClick={onSyncGoogleTasks}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-teal-700 font-bold text-xs shadow-sm hover:bg-slate-100 transition-colors"
        >
          <ListTodo className="w-4 h-4 text-teal-600" />
          <span>{t.syncToGoogleTasks}</span>
        </button>
      </div>

      {/* Active Workout Timer Widget (if running) */}
      {activeTimerExId && (
        <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-lg flex items-center justify-between gap-4 border border-teal-500">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400">
              <Wind className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-teal-300 font-semibold uppercase">
                {currentLanguage === 'hi' ? 'पुनर्वास टाइमर चालू है' : currentLanguage === 'gu' ? 'રિહેબ ટાઈમર ચાલુ છે' : 'Rehab Timer Running'}
              </div>
              <h4 className="text-base font-bold">
                {tText(exercises.find((e) => e.id === activeTimerExId)?.title, currentLanguage)}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-mono font-bold tracking-wider text-teal-400">
              {formatTimer(timerSeconds)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setTimerSeconds(300);
                  setTimerRunning(false);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sternal Precaution Safety Notice */}
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-slate-800/80 border border-teal-200 dark:border-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-700 dark:text-slate-300">
          <span className="font-bold text-teal-800 dark:text-teal-200">
            {currentLanguage === 'hi' ? 'छाती की सुरक्षा का नियम: ' : currentLanguage === 'gu' ? 'છાતીની સલામતીનો નિયમ: ' : 'Sternal Stability Rule: '}
          </span>
          {currentLanguage === 'hi'
            ? 'खांसते समय या श्वास व्यायाम करते समय हमेशा अपने सीने पर तकिया दबाकर रखें। सीने में खिंचाव महसूस होने पर तुरंत आराम करें।'
            : currentLanguage === 'gu'
            ? 'ઉધરસ ખાતી વખતે અથવા શ્વાસની કસરત કરતી વખતે હંમેશા તમારી છાતી પર ઓશીકું દબાવી રાખો. છાતીમાં ખેંચાણ થાય તો તરત જ આરામ કરો.'
            : 'Always press your cardiac pillow against your chest while coughing or performing breathing exercises. If you feel any chest pulling, stop immediately and rest.'}
        </p>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className={`p-5 rounded-3xl border transition-all ${
              ex.is_completed_today
                ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-400'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getCategoryIcon(ex.category)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {tText(ex.title, currentLanguage)}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {tText(ex.category, currentLanguage)}
                    </span>
                    <span>•</span>
                    <span>{tText(ex.target_body_part, currentLanguage)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onToggleComplete(ex.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  ex.is_completed_today
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm active:scale-95'
                }`}
              >
                {ex.is_completed_today ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.alreadyTaken}</span>
                  </>
                ) : (
                  <span>{t.completeSet}</span>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {tText(ex.repetitions, currentLanguage)}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {ex.duration_minutes} {currentLanguage === 'hi' ? 'मिनट' : currentLanguage === 'gu' ? 'મિનિટ' : 'min duration'}
                </span>
                <button
                  onClick={() => handleStartTimer(ex)}
                  className="ml-auto text-teal-600 hover:text-teal-700 dark:text-teal-400 font-semibold flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>
                    {currentLanguage === 'hi' ? 'टाइमर शुरू करें' : currentLanguage === 'gu' ? 'ટાઈમર શરૂ કરો' : 'Start Guided Timer'}
                  </span>
                </button>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentLanguage === 'hi' ? 'करने की विधि: ' : currentLanguage === 'gu' ? 'કેવી રીતે કરવું: ' : 'How to do it: '}
                </span>
                {tText(ex.instructions, currentLanguage)}
              </p>

              {ex.precautions && (
                <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400 font-medium text-[11px] bg-amber-50/80 dark:bg-amber-950/30 p-2 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{tText(ex.precautions, currentLanguage)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
