import { AuditLog } from '../types';
import { sampleAuditLogs } from '../data/sampleDischargeData';

const AUDIT_STORAGE_KEY = 'recoverynav_audit_logs';

export function getAuditLogs(): AuditLog[] {
  if (typeof window === 'undefined') return sampleAuditLogs;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read audit logs:', e);
  }
  return sampleAuditLogs;
}

export function recordAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp' | 'ip_address' | 'user_agent'>): AuditLog {
  const currentLogs = getAuditLogs();
  const newLog: AuditLog = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ip_address: '103.21.124.89 (Masked)',
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 80) : 'RecoveryNav Client',
    ...entry,
  };

  const updated = [newLog, ...currentLogs].slice(0, 100);
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to store audit log:', e);
  }
  return newLog;
}
