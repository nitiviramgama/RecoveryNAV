import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Circle,
  Clock3,
  Droplets,
  FileText,
  HeartPulse,
  Pill,
  Save,
  Stethoscope,
  Target,
  Utensils,
} from 'lucide-react';
import { Appointment, DischargeSummary, Language, Medication, PhysicalTherapyExercise, User } from '../types';

export interface SavedInstruction {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'DIET' | 'ACTIVITY' | 'WARNING' | 'GENERAL';
  source: string;
  saved_at: string;
}

interface PersonalizedRecoveryPlanProps {
  user: User;
  currentLanguage: Language;
  dischargeSummary?: DischargeSummary;
  medications: Medication[];
  exercises: PhysicalTherapyExercise[];
  appointments: Appointment[];
  onToggleMedication: (id: string) => void;
  onToggleExercise: (id: string) => void;
}

const storageKey = (userId: string) => `recoverynav_saved_instructions_${userId}`;

export const loadSavedInstructions = (userId: string): SavedInstruction[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveInstruction = (instruction: SavedInstruction) => {
  const existing = loadSavedInstructions(instruction.user_id);
  const withoutDuplicate = existing.filter((item) => item.id !== instruction.id);
  localStorage.setItem(storageKey(instruction.user_id), JSON.stringify([instruction, ...withoutDuplicate]));
};

const removeInstruction = (userId: string, instructionId: string) => {
  const existing = loadSavedInstructions(userId);
  localStorage.setItem(storageKey(userId), JSON.stringify(existing.filter((item) => item.id !== instructionId)));
};

export const PersonalizedRecoveryPlan: React.FC<PersonalizedRecoveryPlanProps> = ({
  user,
  currentLanguage,
  dischargeSummary,
  medications,
  exercises,
  appointments,
  onToggleMedication,
  onToggleExercise,
}) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(
    () => new Set(loadSavedInstructions(user.id).map((item) => item.id))
  );

  const text = (en: string, hi: string, gu: string) =>
    currentLanguage === 'hi' ? hi : currentLanguage === 'gu' ? gu : en;

  const progress = useMemo(() => {
    const total = medications.length + exercises.length;
    const completed = medications.filter((m) => m.is_taken_today).length + exercises.filter((e) => e.is_completed_today).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [medications, exercises]);

  const saveOrRemove = (instruction: SavedInstruction) => {
    if (savedIds.has(instruction.id)) {
      removeInstruction(user.id, instruction.id);
      setSavedIds((previous) => {
        const next = new Set(previous);
        next.delete(instruction.id);
        return next;
      });
      return;
    }
    saveInstruction(instruction);
    setSavedIds((previous) => new Set(previous).add(instruction.id));
  };

  const instructionCards = [
    dischargeSummary?.dietary_instructions
      ? {
          id: 'diet-instructions',
          title: text('Diet & Nutrition', 'आहार और पोषण', 'આહાર અને પોષણ'),
          content: dischargeSummary.dietary_instructions,
          category: 'DIET' as const,
          icon: <Utensils className="w-5 h-5" />,
        }
      : null,
    dischargeSummary?.activity_restrictions
      ? {
          id: 'activity-restrictions',
          title: text('Activity & Restrictions', 'गतिविधि और प्रतिबंध', 'પ્રવૃત્તિ અને પ્રતિબંધો'),
          content: dischargeSummary.activity_restrictions,
          category: 'ACTIVITY' as const,
          icon: <Activity className="w-5 h-5" />,
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; title: string; content: string; category: SavedInstruction['category']; icon: React.ReactNode }>;

  return (
    <div className="space-y-6">
<section className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md text-left">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
    <div className="space-y-2 text-left items-start">
      <div className="inline-flex items-center justify-start gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-left">
        <HeartPulse className="w-3.5 h-3.5" />
        {text('Personalized Recovery Planning', 'व्यक्तिगत रिकवरी योजना', 'વ્યક્તિગત રિકવરી આયોજન')}
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-left">
        {text('Your Personalized Recovery Plan', 'आपकी व्यक्तिगत रिकवरी योजना', 'તમારી વ્યક્તિગત રિકવરી યોજના')}
      </h2>
            <p className="text-xs sm:text-sm text-teal-100 max-w-2xl">
              {text(
                'Built from the recovery information extracted from your uploaded discharge documents and updated as you track your daily progress.',
                'आपके अपलोड किए गए डिस्चार्ज दस्तावेज़ों से निकाली गई जानकारी के आधार पर तैयार की गई योजना, जिसे आपकी दैनिक प्रगति के साथ अपडेट किया जाता है।',
                'તમારા અપલોડ કરેલા ડિસ્ચાર્જ દસ્તાવેજોમાંથી મળેલી માહિતી પરથી બનાવેલી યોજના, જે તમારી દૈનિક પ્રગતિ સાથે અપડેટ થાય છે.'
              )}
            </p>
          </div>
          <div className="min-w-[180px] p-4 rounded-2xl bg-white/10 border border-white/15">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span>{text('Today’s progress', 'आज की प्रगति', 'આજની પ્રગતિ')}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[10px] text-teal-100 mt-2">
              {medications.filter((m) => m.is_taken_today).length + exercises.filter((e) => e.is_completed_today).length}{' '}
              {text('tasks completed', 'कार्य पूरे', 'કાર્યો પૂર્ણ')}
            </p>
          </div>
        </div>
      </section>

      {dischargeSummary && (
        <section className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {text('Plan source', 'योजना का स्रोत', 'યોજનાનો સ્ત્રોત')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {dischargeSummary.hospital_name || text('Uploaded discharge document', 'अपलोड किया गया डिस्चार्ज दस्तावेज़', 'અપલોડ કરાયેલ ડિસ્ચાર્જ દસ્તાવેજ')}
              </p>
              {dischargeSummary.diagnosis && (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">{dischargeSummary.diagnosis}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">{text('Medication Plan', 'दवा योजना', 'દવા યોજના')}</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">{medications.length}</span>
          </div>
          <div className="space-y-2">
            {medications.length === 0 ? (
              <p className="text-xs text-slate-500">{text('No medications were extracted from your documents.', 'आपके दस्तावेज़ों से कोई दवा नहीं मिली।', 'તમારા દસ્તાવેજોમાંથી કોઈ દવા મળી નથી.')}</p>
            ) : medications.map((med) => (
              <button
                key={med.id}
                onClick={() => onToggleMedication(med.id)}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors flex items-start gap-3"
              >
                {med.is_taken_today ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /> : <Circle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />}
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">{med.name} · {med.dosage}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{med.frequency}{med.food_relation && med.food_relation !== 'Not specified' ? ` · ${med.food_relation}` : ''}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">{text('Activity & Therapy Plan', 'गतिविधि और थेरेपी योजना', 'પ્રવૃત્તિ અને થેરાપી યોજના')}</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">{exercises.length}</span>
          </div>
          <div className="space-y-2">
            {exercises.length === 0 ? (
              <p className="text-xs text-slate-500">{text('No therapy or exercise instructions were extracted.', 'कोई थेरेपी या व्यायाम निर्देश नहीं मिले।', 'કોઈ થેરાપી અથવા કસરત સૂચનાઓ મળી નથી.')}</p>
            ) : exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => onToggleExercise(exercise.id)}
                className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors flex items-start gap-3"
              >
                {exercise.is_completed_today ? <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" /> : <Circle className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />}
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">{exercise.title}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{exercise.repetitions}{exercise.duration_minutes ? ` · ${exercise.duration_minutes} min` : ''}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock3 className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 dark:text-white">{text('Recovery Timeline & Follow-ups', 'रिकवरी टाइमलाइन और फॉलो-अप', 'રિકવરી સમયરેખા અને ફોલો-અપ')}</h3>
        </div>
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="text-xs text-slate-500">{text('No follow-up consultations were found in the uploaded information.', 'अपलोड की गई जानकारी में कोई फॉलो-अप परामर्श नहीं मिला।', 'અપલોડ કરેલી માહિતીમાં કોઈ ફોલો-અપ પરામર્શ મળ્યો નથી.')}</p>
          ) : appointments.map((apt) => (
            <div key={apt.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-700 text-teal-600 shadow-sm"><Stethoscope className="w-4 h-4" /></div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{apt.purpose || text('Follow-up consultation', 'फॉलो-अप परामर्श', 'ફોલો-અપ પરામર્શ')}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{apt.doctor_name}{apt.specialty ? ` · ${apt.specialty}` : ''}</p>
                <p className="text-[11px] text-teal-700 dark:text-teal-300 mt-1">{apt.date_time ? new Date(apt.date_time).toLocaleString(currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'gu' ? 'gu-IN' : 'en-US') : text('Date not specified', 'तारीख उपलब्ध नहीं', 'તારીખ ઉપલબ્ધ નથી')}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {instructionCards.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {instructionCards.map((instruction) => {
            const saved = savedIds.has(instruction.id);
            return (
              <div key={instruction.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">{instruction.icon}</div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{instruction.title}</h3>
                  </div>
                  <button
                    onClick={() => saveOrRemove({
                      id: instruction.id,
                      user_id: user.id,
                      title: instruction.title,
                      content: instruction.content,
                      category: instruction.category,
                      source: dischargeSummary?.hospital_name || 'Recovery document',
                      saved_at: new Date().toISOString(),
                    })}
                    className={`p-2 rounded-xl transition-colors ${saved ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-teal-600'}`}
                    title={saved ? text('Remove from saved instructions', 'सहेजे गए निर्देशों से हटाएँ', 'સાચવેલ સૂચનાઓમાંથી દૂર કરો') : text('Save instruction', 'निर्देश सहेजें', 'સૂચના સાચવો')}
                  >
                    {saved ? <Bookmark className="w-4 h-4 fill-current" /> : <Save className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3">{instruction.content}</p>
              </div>
            );
          })}
        </section>
      )}

      {dischargeSummary?.warning_signs?.length ? (
        <section className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-amber-900 dark:text-amber-200">{text('Documented Warning Signs', 'दस्तावेज़ में दिए गए चेतावनी संकेत', 'દસ્તાવેજમાં આપેલા ચેતવણી સંકેતો')}</h3>
            </div>
          </div>
          <div className="space-y-2">
            {dischargeSummary.warning_signs.map((warning, index) => {
              const id = `warning-${index}`;
              const saved = savedIds.has(id);
              return (
                <div key={id} className="flex items-start gap-3 text-xs text-amber-900 dark:text-amber-100">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="flex-1">{warning}</span>
                  <button
                    onClick={() => saveOrRemove({ id, user_id: user.id, title: 'Warning sign', content: warning, category: 'WARNING', source: dischargeSummary.hospital_name || 'Recovery document', saved_at: new Date().toISOString() })}
                    className="p-1.5 rounded-lg bg-white/70 dark:bg-slate-900/50 hover:bg-white text-amber-700"
                    title={saved ? text('Remove saved instruction', 'सहेजे गए निर्देश हटाएँ', 'સાચવેલ સૂચના દૂર કરો') : text('Save warning sign', 'चेतावनी सहेजें', 'ચેતવણી સાચવો')}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="flex items-center gap-2 text-[11px] text-slate-400">
        <Target className="w-3.5 h-3.5" />
        <span>{text('Progress is based on today’s medication and therapy completion.', 'प्रगति आज की दवा और थेरेपी पूर्णता पर आधारित है।', 'પ્રગતિ આજની દવા અને થેરાપી પૂર્ણતા પર આધારિત છે.')}</span>
      </div>
    </div>
  );
};

export const getSavedInstructionStorageKey = storageKey;
export const deleteSavedInstruction = removeInstruction;
