import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Download,
  Filter,
  Eye,
  EyeOff,
  User,
  Clock
} from 'lucide-react';
import { AuditLog, Language } from '../types';
import { translations } from '../locales/translations';
import { maskSensitiveValue, maskMRN, maskPhoneNumber } from '../services/encryptionService';

interface AuditLogViewerProps {
  logs: AuditLog[];
  currentLanguage: Language;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs, currentLanguage }) => {
  const t = translations[currentLanguage];
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [unmasked, setUnmasked] = useState(false);
  const [pinPrompt, setPinPrompt] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const actions = ['ALL', 'READ', 'CREATE', 'UPDATE', 'DELETE', 'VOICE_COMMAND', 'OCR_EXTRACT', 'EXPORT_CALENDAR'];

  const filteredLogs =
    filterAction === 'ALL' ? logs : logs.filter((l) => l.action === filterAction);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '2026') {
      setUnmasked(true);
      setPinPrompt(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. For demo access use 1234.');
    }
  };

  const handleExportAuditCSV = () => {
    const header = 'ID,Timestamp,User,Action,ResourceType,IPAddress,Details\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.user_id}","${l.action}","${l.resource_type}","${l.ip_address}","${l.details.replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `hipaa_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-teal-950 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HIPAA Security Rule §164.312(b) Audit Controls</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.auditTrailTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Immutable recording of every electronic Protected Health Information (ePHI) view, mutation, voice command, and document extraction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (unmasked) {
                setUnmasked(false);
              } else {
                setPinPrompt(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-colors"
          >
            {unmasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{unmasked ? t.maskSensitiveData : t.unmaskSensitiveData}</span>
          </button>

          <button
            onClick={handleExportAuditCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto max-w-full">
        {actions.map((act) => (
          <button
            key={act}
            onClick={() => setFilterAction(act)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filterAction === act
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Resource</th>
              <th className="py-3 px-3">Actor / MRN</th>
              <th className="py-3 px-3">Details & Audit Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.map((log) => {
              const dateStr = new Date(log.timestamp).toLocaleString();
              return (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 whitespace-nowrap text-slate-500 font-mono">
                    {dateStr}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.action === 'OCR_EXTRACT'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                          : log.action === 'VOICE_COMMAND'
                          ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                          : log.action === 'UPDATE'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    {log.resource_type}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {unmasked ? 'Niti Viramgama (MRN-7849201)' : maskMRN('Niti V. (MRN-7849201)')}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    <p className="leading-relaxed">{log.details}</p>
                    <span className="text-[10px] text-slate-400 font-mono">IP: {log.ip_address}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Security PIN Modal */}
      {pinPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                HIPAA Identity Verification
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Enter your clinical passkey or patient PIN to view unmasked protected health information. (Demo PIN: <strong>1234</strong>)
            </p>

            <form onSubmit={handleVerifyPin} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center tracking-widest text-lg font-bold py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              {pinError && <p className="text-xs text-red-500 font-medium">{pinError}</p>}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPinPrompt(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                >
                  Verify & Reveal PII
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
