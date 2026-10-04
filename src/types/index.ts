export type Language = 'en' | 'hi' | 'gu';

export type UserRole = 'PATIENT' | 'CAREGIVER' | 'DOCTOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string;
  mrn: string; // Medical Record Number
  phone: string;
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  language_preference: Language;
  dark_mode: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface DischargeSummary {
  id: string;
  user_id: string;
  hospital_name: string;
  admission_date: string;
  discharge_date: string;
  attending_physician: string;
  diagnosis: string;
  surgical_procedure?: string;
  allergies: string[];
  dietary_instructions: string;
  activity_restrictions: string;
  warning_signs: string[];
  summary_text: string;
  file_url?: string;
  parsed_status: 'PENDING' | 'PROCESSED' | 'FAILED';
  created_at: string;
}

export interface Medication {
  id: string;
  summary_id: string;
  user_id: string;
  name: string;
  generic_name: string;
  dosage: string;
  frequency: string; // e.g., 'Twice daily', 'Once at night'
  route: string; // 'Oral', 'Sublingual', etc.
  timing: ('Morning' | 'Afternoon' | 'Evening' | 'Night' | 'As Needed')[];
  purpose: string;
  instructions: string;
  precautions: string;
  food_relation: 'Before Food' | 'After Food' | 'With Food' | 'Empty Stomach' | 'Not specified';
  start_date: string;
  end_date: string;
  is_taken_today: boolean;
  taken_time?: string;
}

export interface PhysicalTherapyExercise {
  id: string;
  summary_id: string;
  user_id: string;
  title: string;
  category: 'Breathing' | 'Mobility' | 'Strength' | 'Circulation' | 'Walking';
  target_body_part: string;
  repetitions: string;
  frequency_per_day: number;
  duration_minutes: number;
  instructions: string;
  precautions: string;
  is_completed_today: boolean;
  completed_sets_today: number;
  pain_level_recorded?: number; // 0-10
}

export interface Appointment {
  id: string;
  summary_id: string;
  user_id: string;
  doctor_name: string;
  specialty: string;
  hospital_clinic: string;
  date_time: string;
  purpose: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  phone?: string;
  google_calendar_url?: string;
}

export interface SafetyConflict {
  id: string;
  summary_id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  source_documents: string[];
  recommendation: string;
  is_resolved: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'VOICE_COMMAND' | 'OCR_EXTRACT' | 'EXPORT_CALENDAR';
  resource_type: 'DISCHARGE_SUMMARY' | 'MEDICATION' | 'EXERCISE' | 'APPOINTMENT' | 'USER_PROFILE' | 'SYSTEM';
  resource_id?: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  details: string;
}

export interface RecoveryProgress {
  overall_percentage: number;
  medications_completed: number;
  medications_total: number;
  exercises_completed: number;
  exercises_total: number;
  hydration_current_ml: number;
  hydration_target_ml: number;
  vital_signs: {
    blood_pressure: string;
    heart_rate_bpm: number;
    oxygen_saturation: number;
    temperature_f: number;
  };
}
