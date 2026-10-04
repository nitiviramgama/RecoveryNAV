import { Medication, PhysicalTherapyExercise, Appointment, DischargeSummary, RecoveryProgress, AuditLog } from '../types';
import { sampleAuditLogs } from '../data/sampleDischargeData';

export interface OfflineActionQueueItem {
  id: string;
  action: 'LOG_MEDICATION' | 'LOG_EXERCISE' | 'ADD_APPOINTMENT' | 'UPDATE_SETTINGS' | 'VOICE_COMMAND';
  payload: any;
  timestamp: string;
  synced: boolean;
}

const STORAGE_KEYS = {
  MEDICATIONS: 'recoverynav_offline_medications',
  EXERCISES: 'recoverynav_offline_exercises',
  APPOINTMENTS: 'recoverynav_offline_appointments',
  SUMMARY: 'recoverynav_offline_summary',
  PROGRESS: 'recoverynav_offline_progress',
  QUEUE: 'recoverynav_offline_action_queue',
  LAST_SYNC: 'recoverynav_last_sync_timestamp',
};

export class OfflineStorageService {
  public static loadInitialState() {
    if (typeof window === 'undefined') {
      return {
        dischargeSummary: null,
        medications: [],
        exercises: [],
        appointments: [],
        auditLogs: sampleAuditLogs,
      };
    }

    try {
      const storedMeds = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      const storedEx = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      const storedAppt = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      const storedSummary = localStorage.getItem(STORAGE_KEYS.SUMMARY);

      return {
        dischargeSummary: storedSummary ? JSON.parse(storedSummary) : null,
        medications: storedMeds ? JSON.parse(storedMeds) : [],
        exercises: storedEx ? JSON.parse(storedEx) : [],
        appointments: storedAppt ? JSON.parse(storedAppt) : [],
        auditLogs: sampleAuditLogs,
      };
    } catch (e) {
      console.warn('Error reading from offline storage, using defaults:', e);
      return {
        dischargeSummary: null,
        medications: [],
        exercises: [],
        appointments: [],
        auditLogs: sampleAuditLogs,
      };
    }
  }

  public static saveMedications(medications: Medication[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
    } catch (e) {
      console.warn('Failed to save medications offline:', e);
    }
  }

  public static saveExercises(exercises: PhysicalTherapyExercise[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (e) {
      console.warn('Failed to save exercises offline:', e);
    }
  }

  public static saveAppointments(appointments: Appointment[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Failed to save appointments offline:', e);
    }
  }

  public static saveDischargeSummary(summary: DischargeSummary) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SUMMARY, JSON.stringify(summary));
    } catch (e) {
      console.warn('Failed to save discharge summary offline:', e);
    }
  }

  public static queueAction(action: OfflineActionQueueItem['action'], payload: any) {
    if (typeof window === 'undefined') return;
    try {
      const currentQueue = this.getQueue();
      const newItem: OfflineActionQueueItem = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        action,
        payload,
        timestamp: new Date().toISOString(),
        synced: false,
      };
      currentQueue.push(newItem);
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(currentQueue));
    } catch (e) {
      console.warn('Failed to queue offline action:', e);
    }
  }

  public static getQueue(): OfflineActionQueueItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  public static clearQueue() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.QUEUE);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  }

  public static getLastSync(): string {
    if (typeof window === 'undefined') return 'Just now';
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Never';
  }
}
