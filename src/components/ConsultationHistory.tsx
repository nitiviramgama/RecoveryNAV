import React, { useMemo } from 'react';
import { CalendarDays, CheckCircle2, Clock3, MapPin, Stethoscope, UserCheck } from 'lucide-react';
import { Appointment, Language } from '../types';

interface ConsultationHistoryProps {
  appointments: Appointment[];
  currentLanguage: Language;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
}

export const ConsultationHistory: React.FC<ConsultationHistoryProps> = ({ appointments, currentLanguage, onUpdateStatus }) => {
  const text = (en: string, hi: string, gu: string) => currentLanguage === 'hi' ? hi : currentLanguage === 'gu' ? gu : en;
  const sorted = useMemo(() => [...appointments].sort((a, b) => new Date(b.date_time || 0).getTime() - new Date(a.date_time || 0).getTime()), [appointments]);
  const completed = sorted.filter((apt) => apt.status === 'COMPLETED');
  const upcoming = sorted.filter((apt) => apt.status !== 'COMPLETED');

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-800 to-teal-700 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
          <Stethoscope className="w-3.5 h-3.5" />
          {text('Medical Records', 'चिकित्सा रिकॉर्ड', 'મેડિકલ રેકોર્ડ્સ')}
        </div>
        <h2 className="text-2xl font-bold mt-3">{text('Consultation History', 'परामर्श इतिहास', 'પરામર્શ ઇતિહાસ')}</h2>
        <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl">
          {text('A record of your actual follow-up consultations and appointments. AI conversations are kept separate from this record.', 'आपके वास्तविक फॉलो-अप परामर्श और अपॉइंटमेंट का रिकॉर्ड। AI बातचीत इस रिकॉर्ड से अलग रहती है।', 'તમારી વાસ્તવિક ફોલો-અપ મુલાકાતો અને એપોઇન્ટમેન્ટનો રેકોર્ડ. AI વાતચીત આ રેકોર્ડથી અલગ રહે છે.')}
        </p>
      </div>

      <section className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 dark:text-white">{text('Completed Consultations', 'पूर्ण परामर्श', 'પૂર્ણ પરામર્શ')}</h3>
          <span className="ml-auto text-xs font-bold text-slate-400">{completed.length}</span>
        </div>
        {completed.length === 0 ? (
          <p className="text-xs text-slate-500">{text('No completed consultations recorded yet.', 'अभी कोई पूर्ण परामर्श रिकॉर्ड नहीं है।', 'હજુ કોઈ પૂર્ણ પરામર્શ રેકોર્ડ થયેલ નથી.')}</p>
        ) : (
          <div className="space-y-3">
            {completed.map((apt) => <ConsultationCard key={apt.id} apt={apt} currentLanguage={currentLanguage} onUpdateStatus={onUpdateStatus} />)}
          </div>
        )}
      </section>

      <section className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock3 className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 dark:text-white">{text('Upcoming & Scheduled Consultations', 'आगामी और निर्धारित परामर्श', 'આગામી અને નિર્ધારિત પરામર્શ')}</h3>
          <span className="ml-auto text-xs font-bold text-slate-400">{upcoming.length}</span>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-500">{text('No upcoming consultations recorded.', 'कोई आगामी परामर्श रिकॉर्ड नहीं है।', 'કોઈ આગામી પરામર્શ રેકોર્ડ થયેલ નથી.')}</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => <ConsultationCard key={apt.id} apt={apt} currentLanguage={currentLanguage} onUpdateStatus={onUpdateStatus} />)}
          </div>
        )}
      </section>
    </div>
  );
};

const ConsultationCard: React.FC<{ apt: Appointment; currentLanguage: Language; onUpdateStatus: (id: string, status: Appointment['status']) => void }> = ({ apt, currentLanguage, onUpdateStatus }) => {
  const text = (en: string, hi: string, gu: string) => currentLanguage === 'hi' ? hi : currentLanguage === 'gu' ? gu : en;
  const date = apt.date_time ? new Date(apt.date_time) : null;
  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-700 text-teal-600 shadow-sm"><UserCheck className="w-5 h-5" /></div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{apt.doctor_name || text('Healthcare provider', 'स्वास्थ्य सेवा प्रदाता', 'હેલ્થકેર પ્રોવાઇડર')}</h4>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{apt.specialty}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{apt.purpose || text('Follow-up consultation', 'फॉलो-अप परामर्श', 'ફોલો-અપ પરામર્શ')}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase self-start ${apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'}`}>
          {apt.status}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5" />{date ? date.toLocaleString(currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'gu' ? 'gu-IN' : 'en-US') : text('Date not specified', 'तारीख उपलब्ध नहीं', 'તારીખ ઉપલબ્ધ નથી')}</div>
        <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{apt.hospital_clinic || text('Clinic not specified', 'क्लिनिक उपलब्ध नहीं', 'ક્લિનિક ઉપલબ્ધ નથી')}</div>
      </div>
      {apt.notes && <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">{apt.notes}</p>}
      {apt.status !== 'COMPLETED' && (
        <button onClick={() => onUpdateStatus(apt.id, 'COMPLETED')} className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {text('Mark consultation completed', 'परामर्श पूर्ण चिह्नित करें', 'પરામર્શ પૂર્ણ તરીકે ચિહ્નિત કરો')}
        </button>
      )}
    </div>
  );
};
