import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  UserCheck,
  Phone,
  Plus,
  ExternalLink,
  Download,
  CheckCircle2,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { Appointment, Language } from '../types';
import { translations } from '../locales/translations';
import { tText } from '../utils/localizationHelper';

interface AppointmentSchedulerProps {
  appointments: Appointment[];
  currentLanguage: Language;
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'summary_id' | 'user_id'>) => void;
  onSyncGoogleCalendar: (id: string) => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  appointments,
  currentLanguage,
  onAddAppointment,
  onSyncGoogleCalendar,
}) => {
  const t = translations[currentLanguage];
  const [showAddModal, setShowAddModal] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospitalClinic, setHospitalClinic] = useState('Apollo Heart Institute');
  const [dateTime, setDateTime] = useState('2026-09-25T11:00');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  const handleDownloadICS = (apt: Appointment) => {
    const startDate = new Date(apt.date_time).toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(new Date(apt.date_time).getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d+/g, '');

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RecoveryNav//Post-Hospital Recovery Manager//EN
BEGIN:VEVENT
SUMMARY:${apt.doctor_name} (${apt.specialty})
DESCRIPTION:${apt.purpose} - ${apt.notes}
LOCATION:${apt.hospital_clinic}
DTSTART:${startDate}
DTEND:${endDate}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment_${apt.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !purpose) return;
    onAddAppointment({
      doctor_name: doctorName,
      specialty: specialty || 'General Surgery Follow-up',
      hospital_clinic: hospitalClinic,
      date_time: dateTime,
      purpose,
      status: 'SCHEDULED',
      notes,
    });
    setShowAddModal(false);
    setDoctorName('');
    setPurpose('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>
              {currentLanguage === 'hi'
                ? 'डॉक्टर परामर्श और घाव निरीक्षण'
                : currentLanguage === 'gu'
                ? 'ડૉક્ટર પરામર્શ અને ઘા તપાસ'
                : 'Doctor Consultations & Wound Inspections'}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.appointmentsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
            {currentLanguage === 'hi'
              ? 'समय पर डॉक्टर फॉलो-अप से टांकों की जांच, ईसीजी और दवाओं का सही समायोजन सुनिश्चित होता है।'
              : currentLanguage === 'gu'
              ? 'સમયસર ડૉક્ટર મુલાકાતથી ટાંકાની ચકાસણી, ઇસીજી અને દવાનું યોગ્ય એડજસ્ટમેન્ટ સુનિશ્ચિત થાય છે.'
              : 'Timely post-op visits ensure proper suture removal, echo evaluation, and medication titration.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-teal-700 font-bold text-xs shadow-sm hover:bg-slate-100 transition-colors"
        >
          <Plus className="w-4 h-4 text-teal-600" />
          <span>
            {currentLanguage === 'hi' ? 'नई अपॉइंटमेंट जोड़ें' : currentLanguage === 'gu' ? 'નવી મુલાકાત ઉમેરો' : 'Add New Appointment'}
          </span>
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {appointments.map((apt) => {
          const aptDate = new Date(apt.date_time);
          const formattedDate = aptDate.toLocaleDateString(
            currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'gu' ? 'gu-IN' : 'en-US',
            {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }
          );
          const formattedTime = aptDate.toLocaleTimeString(
            currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'gu' ? 'gu-IN' : 'en-US',
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          );

          return (
            <div
              key={apt.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {currentLanguage === 'hi' ? 'पुष्ट' : currentLanguage === 'gu' ? 'પુષ્ટિ થયેલ' : apt.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {tText(apt.doctor_name, currentLanguage)}
                  </h4>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {tText(apt.specialty, currentLanguage)}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formattedDate} {currentLanguage === 'hi' ? 'को' : currentLanguage === 'gu' ? 'ના રોજ' : 'at'} {formattedTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.hospital_clinic}</span>
                  </div>
                  {apt.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.phone}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentLanguage === 'hi' ? 'उद्देश्य: ' : currentLanguage === 'gu' ? 'હેતુ: ' : 'Purpose: '}
                    {tText(apt.purpose, currentLanguage)}
                  </div>
                  {apt.notes && (
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {currentLanguage === 'hi' ? 'नोट: ' : currentLanguage === 'gu' ? 'નોંધ: ' : 'Note: '}
                      {apt.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons: Add to Google Calendar & Download .ics */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <a
                  href={
                    apt.google_calendar_url ||
                    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      apt.doctor_name + ' - ' + apt.specialty
                    )}&details=${encodeURIComponent(apt.purpose)}&location=${encodeURIComponent(
                      apt.hospital_clinic
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onSyncGoogleCalendar(apt.id)}
                  className="py-2 px-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Cal</span>
                </a>

                <button
                  onClick={() => handleDownloadICS(apt)}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Offline (.ICS)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Schedule New Follow-Up
            </h3>

            <form onSubmit={handleSubmitNew} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Parekh"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology / Wound Care"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Clinic Location
                </label>
                <input
                  type="text"
                  value={hospitalClinic}
                  onChange={(e) => setHospitalClinic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2-Week Post-op Incision Check"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Preparation Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fast for 6 hours prior to blood test"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Save & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
