import React, { useState } from 'react';
import {
  Database,
  FileCode,
  Terminal,
  Copy,
  Check,
  Server,
  ShieldCheck,
  Play,
  Layers,
  Code2
} from 'lucide-react';
import {
  POSTGRESQL_SCHEMA_SQL,
  DJANGO_CODE_MODELS,
  DJANGO_CODE_VIEWS,
  DJANGO_CODE_URLS
} from '../services/schemaAndApiDocs';
import { Medication, PhysicalTherapyExercise, Appointment } from '../types';

interface DatabaseSchemaViewerProps {
  medications: Medication[];
  exercises: PhysicalTherapyExercise[];
  appointments: Appointment[];
}

export const DatabaseSchemaViewer: React.FC<DatabaseSchemaViewerProps> = ({
  medications,
  exercises,
  appointments,
}) => {
  const [activeTab, setActiveTab] = useState<'POSTGRESQL' | 'DJANGO_MODELS' | 'DJANGO_VIEWS' | 'DJANGO_URLS' | 'SQL_RUNNER'>('POSTGRESQL');
  const [copied, setCopied] = useState(false);
  const [sqlQuery, setSqlQuery] = useState(`SELECT name, dosage, frequency, food_relation, is_taken_today \nFROM medications \nWHERE user_id = 'usr_niti_2026';`);
  const [queryResult, setQueryResult] = useState<any[] | null>(null);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSQL = () => {
    const lower = sqlQuery.toLowerCase();
    if (lower.includes('from medications')) {
      setQueryResult(
        medications.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          food_relation: m.food_relation,
          is_taken_today: m.is_taken_today,
        }))
      );
    } else if (lower.includes('from physical_therapy_exercises') || lower.includes('from exercises')) {
      setQueryResult(
        exercises.map((e) => ({
          title: e.title,
          category: e.category,
          repetitions: e.repetitions,
          duration_minutes: e.duration_minutes,
          is_completed: e.is_completed_today,
        }))
      );
    } else if (lower.includes('from appointments')) {
      setQueryResult(
        appointments.map((a) => ({
          doctor: a.doctor_name,
          specialty: a.specialty,
          date_time: a.date_time,
          purpose: a.purpose,
          status: a.status,
        }))
      );
    } else {
      setQueryResult([
        {
          table_name: 'users',
          row_count: 1,
          rls_enabled: true,
          status: 'ACTIVE',
        },
        {
          table_name: 'discharge_summaries',
          row_count: 1,
          rls_enabled: true,
          status: 'ACTIVE',
        },
        {
          table_name: 'medications',
          row_count: medications.length,
          rls_enabled: true,
          status: 'ACTIVE',
        },
        {
          table_name: 'physical_therapy_exercises',
          row_count: exercises.length,
          rls_enabled: true,
          status: 'ACTIVE',
        },
        {
          table_name: 'appointments',
          row_count: appointments.length,
          rls_enabled: true,
          status: 'ACTIVE',
        },
        {
          table_name: 'audit_logs',
          row_count: 5,
          rls_enabled: true,
          status: 'IMMUTABLE_LOG',
        },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md space-y-2 border border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
          <Database className="w-3.5 h-3.5" />
          <span>Production Architecture Spec</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          PostgreSQL Database Schema & Python/Django REST API
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Comprehensive relational database architecture with Row-Level Security (RLS), HIPAA audit trails, AES-256 PII fields, and Django REST Framework ModelViewSets.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('POSTGRESQL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'POSTGRESQL'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL DDL Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('DJANGO_MODELS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'DJANGO_MODELS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Django models.py</span>
          </button>

          <button
            onClick={() => setActiveTab('DJANGO_VIEWS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'DJANGO_VIEWS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Django views.py</span>
          </button>

          <button
            onClick={() => setActiveTab('DJANGO_URLS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'DJANGO_URLS'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Django urls.py</span>
          </button>

          <button
            onClick={() => setActiveTab('SQL_RUNNER')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'SQL_RUNNER'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive SQL Simulator</span>
          </button>
        </div>

        {activeTab !== 'SQL_RUNNER' && (
          <button
            onClick={() =>
              handleCopyCode(
                activeTab === 'POSTGRESQL'
                  ? POSTGRESQL_SCHEMA_SQL
                  : activeTab === 'DJANGO_MODELS'
                  ? DJANGO_CODE_MODELS
                  : activeTab === 'DJANGO_VIEWS'
                  ? DJANGO_CODE_VIEWS
                  : DJANGO_CODE_URLS
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        )}
      </div>

      {/* Code Display Area */}
      {activeTab === 'SQL_RUNNER' ? (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-teal-400 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>PostgreSQL Query Simulator (Live Patient In-Memory Dataset)</span>
              </span>
              <button
                onClick={handleRunSQL}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Execute Query</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 font-mono text-xs text-teal-300 border border-slate-800 focus:outline-none focus:border-teal-500"
            />

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
              <span>Quick Queries:</span>
              <button
                onClick={() => {
                  setSqlQuery(`SELECT name, dosage, frequency, food_relation, is_taken_today \nFROM medications \nWHERE user_id = 'usr_niti_2026';`);
                }}
                className="text-teal-400 hover:underline"
              >
                Query Medications
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSqlQuery(`SELECT title, category, repetitions, duration_minutes \nFROM physical_therapy_exercises;`);
                }}
                className="text-teal-400 hover:underline"
              >
                Query Exercises
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setSqlQuery(`SELECT doctor_name, specialty, appointment_time, purpose \nFROM appointments;`);
                }}
                className="text-teal-400 hover:underline"
              >
                Query Appointments
              </button>
            </div>
          </div>

          {/* Results Table */}
          {queryResult && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 overflow-x-auto">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Query Output ({queryResult.length} rows returned)
              </h4>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    {Object.keys(queryResult[0] || {}).map((k) => (
                      <th key={k} className="py-2.5 px-3">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono">
                  {queryResult.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      {Object.values(row).map((v: any, i) => (
                        <td key={i} className="py-2.5 px-3 text-slate-800 dark:text-slate-200">
                          {typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 shadow-lg overflow-x-auto max-h-[600px]">
          <pre className="whitespace-pre">
            {activeTab === 'POSTGRESQL'
              ? POSTGRESQL_SCHEMA_SQL
              : activeTab === 'DJANGO_MODELS'
              ? DJANGO_CODE_MODELS
              : activeTab === 'DJANGO_VIEWS'
              ? DJANGO_CODE_VIEWS
              : DJANGO_CODE_URLS}
          </pre>
        </div>
      )}
    </div>
  );
};
