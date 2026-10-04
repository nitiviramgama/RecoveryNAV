import React from 'react';
import { Bell, X, Check, Clock, AlertTriangle, Pill, Calendar } from 'lucide-react';
import { Language, Medication, PhysicalTherapyExercise, Appointment } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  currentLanguage: Language;
  medications: Medication[];
  exercises: PhysicalTherapyExercise[];
  appointments: Appointment[];
  dietaryInstructions: string;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onClear,
  currentLanguage,
  medications,
  exercises,
  appointments,
  dietaryInstructions,
}) => {
  if (!isOpen) return null;

  const notifications = [
    ...medications.slice(0, 8).map((m) => ({ id: `med_${m.id}`, title: `${m.name} ${m.dosage} reminder`, time: m.timing.join(' / '), type: 'MEDICATION', icon: <Pill className="w-4 h-4 text-teal-600" />, desc: `${m.frequency}${m.food_relation ? ` • ${m.food_relation}` : ''}${m.precautions ? ` • ${m.precautions}` : ''}` })),
    ...exercises.slice(0, 5).map((e) => ({ id: `ex_${e.id}`, title: `${e.title} exercise reminder`, time: `${e.frequency_per_day || 1} time(s) daily`, type: 'EXERCISE', icon: <Clock className="w-4 h-4 text-indigo-600" />, desc: `${e.repetitions}${e.precautions ? ` • ${e.precautions}` : ''}` })),
    ...appointments.slice(0, 5).map((a) => ({ id: `apt_${a.id}`, title: `Follow-up: ${a.purpose}`, time: new Date(a.date_time).toLocaleString(), type: 'APPOINTMENT', icon: <Calendar className="w-4 h-4 text-cyan-600" />, desc: `With ${a.doctor_name}${a.specialty ? ` • ${a.specialty}` : ''}` })),
    ...(dietaryInstructions ? [{ id: 'diet_plan', title: 'Diet plan reminder', time: 'Today', type: 'DIET', icon: <AlertTriangle className="w-4 h-4 text-emerald-600" />, desc: dietaryInstructions }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recovery Reminders & Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {notifications.length > 0 ? notifications.map((n) => (
            <div key={n.id} className="py-3 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {n.icon}
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{n.time}</div>
                <p className="text-slate-500 dark:text-slate-400">{n.desc}</p>
              </div>
            </div>
          )) : <div className="py-6 text-center text-slate-500">No reminders were generated from the analyzed documents.</div>}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
