import React, { useState, useEffect } from 'react';
import {
  Header
} from './components/Header';
import {
  Sidebar,
  NavSection
} from './components/Sidebar';
import {
  DashboardHome
} from './components/DashboardHome';
import {
  MedicationTracker
} from './components/MedicationTracker';
import {
  ExerciseTracker
} from './components/ExerciseTracker';
import {
  AppointmentScheduler
} from './components/AppointmentScheduler';
import {
  AskAIAssistant
} from './components/AskAIAssistant';
import {
  SymptomGuide
} from './components/SymptomGuide';
import {
  PersonalizedRecoveryPlan
} from './components/PersonalizedRecoveryPlan';
import { SavedInstructions } from './components/SavedInstructions';
import { ConsultationHistory } from './components/ConsultationHistory';
import {
  WellnessHub
} from './components/WellnessHub';
import {
  EmergencyHelp
} from './components/EmergencyHelp';
import {
  VoiceAssistantModal
} from './components/VoiceAssistantModal';
import {
  FloatingVoiceBar
} from './components/FloatingVoiceBar';
import {
  DatabaseSchemaViewer
} from './components/DatabaseSchemaViewer';
import {
  AuditLogViewer
} from './components/AuditLogViewer';
import {
  OnboardingModal
} from './components/OnboardingModal';
import {
  AuthModal
} from './components/AuthModal';
import {
  NotificationsModal
} from './components/NotificationsModal';
import {
  DischargeSurveyModal
} from './components/DischargeSurveyModal';
import {
  SettingsView
} from './components/SettingsView';
import {
  LoginScreen
} from './components/LoginScreen';
import {
  DischargeOnboarding
} from './components/DischargeOnboarding';

import {
  Language,
  User,
  Medication,
  PhysicalTherapyExercise,
  Appointment,
  SafetyConflict,
  DischargeSummary,
  AuditLog
} from './types';
import { initialUser } from './data/sampleDischargeData';
import { OfflineStorageService } from './services/offlineStorageService';
import { voiceAssistant } from './services/voiceAssistant';
import { recordAuditLog, getAuditLogs } from './services/auditService';
import { translations } from './locales/translations';
import { Home, Pill, Dumbbell, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';

export default function App() {
  // 1. Initial State from Offline Storage
  const initialState = OfflineStorageService.loadInitialState();

  const [user, setUser] = useState<User>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [hasAnalyzedDocument, setHasAnalyzedDocument] = useState<boolean>(() => {
    return localStorage.getItem('recovery_document_analyzed_v2') === 'true';
  });
  const [isDischargeIntakeOpen, setIsDischargeIntakeOpen] = useState<boolean>(false);

  // Clinical Datasets
  const [dischargeSummary, setDischargeSummary] = useState<DischargeSummary | null>(initialState.dischargeSummary);
  const [medications, setMedications] = useState<Medication[]>(initialState.medications);
  const [exercises, setExercises] = useState<PhysicalTherapyExercise[]>(initialState.exercises);
  const [appointments, setAppointments] = useState<Appointment[]>(initialState.appointments);
  const [conflicts, setConflicts] = useState<SafetyConflict[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getAuditLogs());
  const [hydrationCount, setHydrationCount] = useState<number>(0);
  const [hydrationTargetMl, setHydrationTargetMl] = useState<number>(2000);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(3);

  // Voice Assistant state
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [voiceFeedbackText, setVoiceFeedbackText] = useState<string>('');

  // 2. Network status listener
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      OfflineStorageService.clearQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 3. Dark mode class binding
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // 4. Register Voice Assistant callbacks on every page
  useEffect(() => {
    voiceAssistant.setLanguage(currentLanguage);

    voiceAssistant.registerCallbacks({
      onNavigate: (sectionKey: string) => {
        const mapping: Record<string, NavSection> = {
          home: 'home',
          medications: 'medications',
          exercises: 'wellness-hub',
          appointments: 'find-healthcare',
          scanner: 'upload-report',
          symptoms: 'symptom-guide',
          emergency: 'emergency-help',
          wellness: 'wellness-hub',
          settings: 'settings',
          audit: 'audit-trail',
        };
        const target = mapping[sectionKey] || 'home';
        setActiveSection(target);
        recordAuditLog({
          user_id: user.id,
          action: 'VOICE_COMMAND',
          resource_type: 'SYSTEM',
          details: `Navigated to ${target} via voice assistant in ${currentLanguage}.`,
        });
        setAuditLogs(getAuditLogs());
      },
      onLogMedication: (name: string) => {
        handleToggleMedicationTaken('med_1');
      },
      onLogExercise: (title: string) => {
        handleToggleExerciseCompleted('ex_1');
      },
      onSpokenFeedback: (text: string) => {
        setVoiceFeedbackText(text);
      },
      onStatusChange: (listening: boolean, transcript: string) => {
        setIsVoiceListening(listening);
        if (transcript) setVoiceTranscript(transcript);
      },
    });
  }, [currentLanguage, user.id]);

  // 5. Clinical State Mutators with Offline Persistence & Audit Logging
  const handleToggleMedicationTaken = (id: string) => {
    setMedications((prev) => {
      const updated = prev.map((m) =>
        m.id === id ? { ...m, is_taken_today: !m.is_taken_today, taken_time: 'Just now' } : m
      );
      OfflineStorageService.saveMedications(updated);
      OfflineStorageService.queueAction('LOG_MEDICATION', { id });
      return updated;
    });

    const targetMed = medications.find((m) => m.id === id);
    recordAuditLog({
      user_id: user.id,
      action: 'UPDATE',
      resource_type: 'MEDICATION',
      resource_id: id,
      details: `Logged dose for ${targetMed?.name || 'medication'}. Compliance status updated.`,
    });
    setAuditLogs(getAuditLogs());
  };

  const handleToggleExerciseCompleted = (id: string) => {
    setExercises((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, is_completed_today: !e.is_completed_today } : e
      );
      OfflineStorageService.saveExercises(updated);
      OfflineStorageService.queueAction('LOG_EXERCISE', { id });
      return updated;
    });

    const targetEx = exercises.find((e) => e.id === id);
    recordAuditLog({
      user_id: user.id,
      action: 'UPDATE',
      resource_type: 'EXERCISE',
      resource_id: id,
      details: `Logged physical therapy set for ${targetEx?.title || 'exercise'}.`,
    });
    setAuditLogs(getAuditLogs());
  };

  const handleAddAppointment = (aptData: Omit<Appointment, 'id' | 'summary_id' | 'user_id'>) => {
    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      summary_id: dischargeSummary?.id || 'summary_pending',
      user_id: user.id,
      ...aptData,
    };
    const updated = [...appointments, newApt];
    setAppointments(updated);
    OfflineStorageService.saveAppointments(updated);
    OfflineStorageService.queueAction('ADD_APPOINTMENT', newApt);

    recordAuditLog({
      user_id: user.id,
      action: 'CREATE',
      resource_type: 'APPOINTMENT',
      resource_id: newApt.id,
      details: `Scheduled new follow-up appointment with ${newApt.doctor_name} (${newApt.specialty}).`,
    });
    setAuditLogs(getAuditLogs());
  };

  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const updated = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, status } : appointment
    );
    setAppointments(updated);
    OfflineStorageService.saveAppointments(updated);
    OfflineStorageService.queueAction('ADD_APPOINTMENT', { id, status });
    recordAuditLog({
      user_id: user.id,
      action: 'UPDATE',
      resource_type: 'APPOINTMENT',
      resource_id: id,
      details: `Updated consultation ${id} status to ${status}.`,
    });
    setAuditLogs(getAuditLogs());
  };

  const handleSyncGoogleCalendar = (id: string) => {
    recordAuditLog({
      user_id: user.id,
      action: 'EXPORT_CALENDAR',
      resource_type: 'APPOINTMENT',
      resource_id: id,
      details: `Exported appointment ${id} to Google Calendar.`,
    });
    setAuditLogs(getAuditLogs());
  };

  const handleApplyExtractedData = (data: any) => {
    // 1. Update Discharge Summary
    const updatedSummary: DischargeSummary = {
      ...(dischargeSummary || {}),
      id: dischargeSummary?.id || `summary_${Date.now()}`,
      user_id: user.id,
      allergies: data.allergies || [],
      attending_physician: data.attending_physician || '',
      admission_date: data.admission_date || '',
      discharge_date: data.discharge_date || '',
      summary_text: data.diagnosis || '',
      parsed_status: 'PROCESSED',
      created_at: new Date().toISOString(),
      hospital_name: data.hospital_name || dischargeSummary?.hospital_name || '',
      diagnosis: data.diagnosis || '',
      surgical_procedure: data.surgical_procedure || '',
      dietary_instructions: data.dietary_instructions || dischargeSummary?.dietary_instructions || '',
      activity_restrictions: data.activity_restrictions || '',
      warning_signs: data.warning_signs && data.warning_signs.length > 0 ? data.warning_signs : (dischargeSummary?.warning_signs || []),
    };
    setDischargeSummary(updatedSummary);
    OfflineStorageService.saveDischargeSummary(updatedSummary);
    setHydrationTargetMl(data.hydration_target_ml || 2000);
    setHydrationCount(0);

    // 2. Replace Medications & Dosages with exactly what the documents contain
    const newMeds: Medication[] = (data.medications || []).map((m: any, idx: number) => ({
      id: `med_extracted_${idx}_${Date.now()}`,
      summary_id: updatedSummary.id,
      user_id: user.id,
      name: m.name || 'Unnamed medication',
      generic_name: m.generic_name || m.name || '',
      dosage: m.dosage || '',
      frequency: m.frequency || 'As directed in document',
      route: m.route || 'Not specified',
      timing: (m.timing && m.timing.length > 0 ? m.timing : []) as any,
      purpose: m.purpose || 'As documented',
      instructions: m.food_relation || 'Follow the supplied document instructions.',
      precautions: m.precautions || '',
      food_relation: (m.food_relation as any) || 'Not specified',
      start_date: m.start_date || data.discharge_date || '',
      end_date: m.end_date || '',
      is_taken_today: false,
    }));
    setMedications(newMeds);
    OfflineStorageService.saveMedications(newMeds);

    // 3. Replace Exercises & Physical Therapy with exactly what the documents contain
    const newExercises: PhysicalTherapyExercise[] = (data.exercises || []).map((ex: any, idx: number) => ({
      id: `ex_extracted_${idx}_${Date.now()}`,
      summary_id: updatedSummary.id,
      title: ex.title || 'Recovery exercise',
      category: (ex.category as any) || 'Rehabilitation',
      target_body_part: ex.target_body_part || 'Not specified',
      repetitions: ex.repetitions || '',
      frequency_per_day: Number(ex.frequency_per_day) || 1,
      duration_minutes: Number(ex.duration_minutes) || 0,
      user_id: user.id,
      precautions: ex.precautions || '',
      instructions: ex.instructions || '',
      is_completed_today: false,
      completed_sets_today: 0,
    }));
    setExercises(newExercises);
    OfflineStorageService.saveExercises(newExercises);

    // 4. Replace Follow-ups & Appointments with exactly what the documents contain
    const newAppointments: Appointment[] = (data.appointments || []).map((apt: any, idx: number) => ({
      id: `apt_extracted_${idx}_${Date.now()}`,
      summary_id: updatedSummary.id,
      user_id: user.id,
      doctor_name: apt.doctor_name || '',
      specialty: apt.specialty || '',
      hospital_clinic: apt.hospital_clinic || data.hospital_name || '',
      date_time: apt.date_time || '',
      purpose: apt.purpose || '',
      notes: '',
      phone: apt.phone || '',
      status: 'SCHEDULED',
    }));
    setAppointments(newAppointments);
    OfflineStorageService.saveAppointments(newAppointments);

    // 5. Update Safety Conflicts
    if (data.detected_conflicts && data.detected_conflicts.length > 0) {
      setConflicts(data.detected_conflicts.map((c: any, idx: number) => ({ id: `conflict_${idx}_${Date.now()}`, summary_id: updatedSummary.id, severity: c.severity || 'WARNING', title: c.title || 'Document conflict', description: c.description || '', source_documents: c.source_documents || [], recommendation: c.recommendation || '', is_resolved: false })));
    } else {
      setConflicts([]);
    }

    // 6. Complete Intake & Persist
    setHasAnalyzedDocument(true);
    localStorage.setItem('recovery_document_analyzed_v2', 'true');
    setIsDischargeIntakeOpen(false);
    setActiveSection('home');

    recordAuditLog({
      user_id: user.id,
      action: 'UPDATE',
      resource_type: 'DISCHARGE_SUMMARY',
      details: `Discharge documents analyzed: updated medications, exercises, appointments, and diet plan for ${user.full_name}.`,
    });
    setAuditLogs(getAuditLogs());
  };

  const handleQuickAskAI = (prompt: string) => {
    setActiveSection('ask-ai');
  };

  const handleCallEmergency = () => {
    setActiveSection('emergency-help');
  };

  const handleVoiceSimulate = (command: string) => {
    voiceAssistant.handleTranscript(command);
  };

  const t = translations[currentLanguage];

  // Show Login Screen first before the rest of the application
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
        <LoginScreen
          onLogin={(loggedInUser) => {
            setUser(loggedInUser);
            setIsAuthenticated(true);
            setDischargeSummary((prev) => prev ? ({
              ...prev,
              user_id: loggedInUser.id,
              summary_text: (prev.summary_text || '').replace(/Niti Viramgama/g, loggedInUser.full_name),
            }) : null);
            recordAuditLog({
              user_id: loggedInUser.id,
              action: 'READ',
              resource_type: 'USER_PROFILE',
              details: `Patient session started for ${loggedInUser.full_name} (${loggedInUser.mrn}). Phone: ${loggedInUser.phone}`,
            });
            setAuditLogs(getAuditLogs());
          }}
          currentUser={user}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        />

        {/* Floating Voice Assistant Bar on Login Screen */}
        <FloatingVoiceBar
          isListening={isVoiceListening}
          transcript={voiceTranscript}
          feedbackText={voiceFeedbackText}
          currentLanguage={currentLanguage}
          onOpenModal={() => setIsVoiceModalOpen(true)}
          onToggleMic={() => {
            if (isVoiceListening) {
              voiceAssistant.stopListening();
            } else {
              voiceAssistant.startListening();
            }
          }}
        />

        {/* Voice Assistant Modal */}
        <VoiceAssistantModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          isListening={isVoiceListening}
          transcript={voiceTranscript}
          feedbackText={voiceFeedbackText}
          currentLanguage={currentLanguage}
          onStartListening={() => voiceAssistant.startListening()}
          onStopListening={() => voiceAssistant.stopListening()}
          onSimulateCommand={handleVoiceSimulate}
        />
      </div>
    );
  }

  if (!hasAnalyzedDocument || isDischargeIntakeOpen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <DischargeOnboarding
          user={user}
          currentLanguage={currentLanguage}
          onPlanGenerated={handleApplyExtractedData}
          onCancel={hasAnalyzedDocument ? () => setIsDischargeIntakeOpen(false) : undefined}
          canCancel={hasAnalyzedDocument}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-teal-500 selection:text-white">
      {/* 1. Header (Matching Screenshot 1) */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isOnline={isOnline}
        user={user}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        onSearch={(q) => {
          handleQuickAskAI(q);
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadNotifications}
        onLogout={() => setIsAuthenticated(false)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenDischargeIntake={() => setIsDischargeIntakeOpen(true)}
      />

      {/* Offline Status Warning Bar (if connection is lost) */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 text-center font-semibold shadow-inner flex items-center justify-center gap-2">
          <span>{t.offlineMessage}</span>
          <span className="bg-amber-700 px-2 py-0.5 rounded text-[10px]">
            {OfflineStorageService.getQueue().length} Changes Queued
          </span>
        </div>
      )}

      {/* 2. Main Content Body with Left Sidebar (Matching Screenshot 1) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          currentLanguage={currentLanguage}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeSection === 'home' && (
            <DashboardHome
              user={user}
              currentLanguage={currentLanguage}
              onNavigate={setActiveSection}
              medications={medications}
              exercises={exercises}
              appointments={appointments}
              conflicts={conflicts}
              onToggleMedicationTaken={handleToggleMedicationTaken}
              onToggleExerciseCompleted={handleToggleExerciseCompleted}
              onQuickAskAI={handleQuickAskAI}
              onCallEmergency={handleCallEmergency}
              hydrationCount={hydrationCount}
              hydrationTargetMl={hydrationTargetMl}
              dischargeSummary={dischargeSummary || undefined}
              onIncrementHydration={() => setHydrationCount((prev) => Math.min(Math.ceil(hydrationTargetMl / 250), prev + 1))}
            />
          )}

          {activeSection === 'ask-ai' && (
            <AskAIAssistant
              user={user}
              currentLanguage={currentLanguage}
              medications={medications}
              exercises={exercises}
            />
          )}

          {activeSection === 'symptom-guide' && (
            <SymptomGuide
              currentLanguage={currentLanguage}
              warningSigns={dischargeSummary?.warning_signs || []}
              onCallEmergency={handleCallEmergency}
            />
          )}

          {activeSection === 'health-library' && (
            <PersonalizedRecoveryPlan
              user={user}
              currentLanguage={currentLanguage}
              dischargeSummary={dischargeSummary || undefined}
              medications={medications}
              exercises={exercises}
              appointments={appointments}
              onToggleMedication={handleToggleMedicationTaken}
              onToggleExercise={handleToggleExerciseCompleted}
            />
          )}

          {activeSection === 'medications' && (
            <MedicationTracker
              medications={medications}
              conflicts={conflicts}
              currentLanguage={currentLanguage}
              onToggleTaken={handleToggleMedicationTaken}
              onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
              onSyncGoogleTasks={() => {
                alert('Medication schedule successfully synchronized with Google Tasks!');
                recordAuditLog({
                  user_id: user.id,
                  action: 'CREATE',
                  resource_type: 'MEDICATION',
                  details: 'Synchronized medication schedule with Google Tasks.',
                });
                setAuditLogs(getAuditLogs());
              }}
            />
          )}

          {activeSection === 'upload-report' && (
            <DischargeOnboarding
              user={user}
              currentLanguage={currentLanguage}
              onPlanGenerated={handleApplyExtractedData}
              onCancel={() => setActiveSection('home')}
              canCancel
            />
          )}

          {activeSection === 'wellness-hub' && (
            <div className="space-y-8">
              <ExerciseTracker
                exercises={exercises}
                currentLanguage={currentLanguage}
                onToggleComplete={handleToggleExerciseCompleted}
                onSyncGoogleTasks={() => {
                  alert('Physical therapy checklist synchronized with Google Tasks!');
                }}
              />
              <WellnessHub
                user={user}
                currentLanguage={currentLanguage}
                dietaryInstructions={dischargeSummary?.dietary_instructions || ''}
                hydrationTargetMl={hydrationTargetMl}
                hydrationCount={hydrationCount}
                onIncrementHydration={() => setHydrationCount((prev) => Math.min(8, prev + 1))}
                onResetHydration={() => setHydrationCount(0)}
              />
            </div>
          )}

          {activeSection === 'find-healthcare' && (
            <AppointmentScheduler
              appointments={appointments}
              currentLanguage={currentLanguage}
              onAddAppointment={handleAddAppointment}
              onSyncGoogleCalendar={handleSyncGoogleCalendar}
            />
          )}

          {activeSection === 'emergency-help' && (
            <EmergencyHelp user={user} currentLanguage={currentLanguage} />
          )}

          {activeSection === 'saved' && (
            <SavedInstructions user={user} currentLanguage={currentLanguage} />
          )}

          {activeSection === 'my-chats' && (
            <ConsultationHistory
              appointments={appointments}
              currentLanguage={currentLanguage}
              onUpdateStatus={handleUpdateAppointmentStatus}
            />
          )}

          {activeSection === 'settings' && (
            <SettingsView
              user={user}
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              onClearOfflineCache={() => {
                OfflineStorageService.clearQueue();
                alert('Local offline cache refreshed successfully.');
              }}
            />
          )}

          {activeSection === 'database-api' && (
            <DatabaseSchemaViewer
              medications={medications}
              exercises={exercises}
              appointments={appointments}
            />
          )}

          {activeSection === 'audit-trail' && (
            <AuditLogViewer logs={auditLogs} currentLanguage={currentLanguage} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (for iOS & Android phone responsiveness) */}
      <nav className="lg:hidden sticky bottom-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveSection('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold ${
            activeSection === 'home' ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveSection('medications')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold ${
            activeSection === 'medications' ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <Pill className="w-5 h-5" />
          <span>Meds</span>
        </button>

        <button
          onClick={() => setActiveSection('wellness-hub')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold ${
            activeSection === 'wellness-hub' ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          <span>Therapy</span>
        </button>

        <button
          onClick={() => setActiveSection('find-healthcare')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold ${
            activeSection === 'find-healthcare' ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Visits</span>
        </button>

        <button
          onClick={() => setActiveSection('ask-ai')}
          className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold ${
            activeSection === 'ask-ai' ? 'text-teal-600' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Ask AI</span>
        </button>

        <button
          onClick={() => setActiveSection('emergency-help')}
          className="flex flex-col items-center gap-1 py-1 px-2 text-[10px] font-semibold text-red-500"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>SOS</span>
        </button>
      </nav>

      {/* Floating Voice Assistant Bar on EVERY Screen */}
      <FloatingVoiceBar
        isListening={isVoiceListening}
        transcript={voiceTranscript}
        feedbackText={voiceFeedbackText}
        currentLanguage={currentLanguage}
        onOpenModal={() => setIsVoiceModalOpen(true)}
        onToggleMic={() => {
          if (isVoiceListening) {
            voiceAssistant.stopListening();
          } else {
            voiceAssistant.startListening();
          }
        }}
      />

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        isListening={isVoiceListening}
        transcript={voiceTranscript}
        feedbackText={voiceFeedbackText}
        currentLanguage={currentLanguage}
        onStartListening={() => voiceAssistant.startListening()}
        onStopListening={() => voiceAssistant.stopListening()}
        onSimulateCommand={handleVoiceSimulate}
      />

      {/* Onboarding Walkthrough Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentLanguage={currentLanguage}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
        currentUser={user}
        currentLanguage={currentLanguage}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => setUnreadNotifications(0)}
        currentLanguage={currentLanguage}
        medications={medications}
        exercises={exercises}
        appointments={appointments}
        dietaryInstructions={dischargeSummary?.dietary_instructions || ''}
      />

      {/* Discharge Survey Modal */}
      <DischargeSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
