import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Pill,
  Dumbbell,
  Calendar,
  Layers
} from 'lucide-react';
import { DischargeSummary, Language } from '../types';
import { translations } from '../locales/translations';
import { extractDischargeWithAI, DischargeExtractionResult } from '../services/geminiClient';
import { recordAuditLog } from '../services/auditService';

interface DocumentOCRScannerProps {
  currentLanguage: Language;
  onApplyExtractedData: (data: DischargeExtractionResult) => void;
}

export const DocumentOCRScanner: React.FC<DocumentOCRScannerProps> = ({
  currentLanguage,
  onApplyExtractedData,
}) => {
  const t = translations[currentLanguage];
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedResult, setExtractedResult] = useState<DischargeExtractionResult | null>(null);
  const [extractionSuccess, setExtractionSuccess] = useState(false);

  const sampleDischargeText = `APOLLO HOSPITAL & HEART INSTITUTE - DISCHARGE SUMMARY
PATIENT: Niti Viramgama | AGE: 42 | SEX: Female | MRN: MRN-7849201
ATTENDING SURGEON: Dr. Vikram Shah, MS, MCh (CTVS)
ADMITTED: 04/09/2026 | DISCHARGED: 11/09/2026

PRIMARY DIAGNOSIS:
Stable post-op Coronary Artery Bypass Graft (CABG x2: LIMA-LAD, SVG-OM) and concurrent laparoscopic cholecystectomy.

DISCHARGE MEDICATIONS:
1. Metoprolol Tartrate 25mg PO BID with food (Pulse check: hold if < 55)
2. Atorvastatin 40mg PO QHS (Avoid grapefruit)
3. Aspirin 81mg (Ecotrin) PO daily with breakfast
4. Cefuroxime 500mg PO BID x 5 days (Finish full course)
5. Pantoprazole 40mg PO daily morning before meal

REHABILITATION & PRECAUTIONS:
- Incentive Spirometer: 10 breaths / waking hour (target > 1500ml).
- Ankle pumps: 20 reps 3x/day.
- Sternum precautions: Strictly NO lifting > 5kg for 6 weeks. No driving for 3 weeks.
- Diet: Low sodium (< 2g/day), 2.0L fluid intake.

FOLLOW-UPS:
- Sept 18, 2026 at 10:30 AM: Wound inspection with Dr. Vikram Shah.
- Sept 22, 2026 at 02:00 PM: Phase II Cardiac Rehab intake.

RED FLAG WARNING SIGNS:
Sudden chest tightness, fever > 100.5°F, purulent sternal discharge, calf pain/swelling.`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleProcessDocument = async () => {
    setIsLoading(true);
    setExtractionSuccess(false);

    let base64Data: string | undefined = undefined;
    let mimeType: string | undefined = undefined;

    if (selectedFile) {
      mimeType = selectedFile.type;
      const reader = new FileReader();
      base64Data = await new Promise((resolve) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
        };
        reader.readAsDataURL(selectedFile);
      });
    }

    try {
      const result = await extractDischargeWithAI({
        documentText: inputText || sampleDischargeText,
        imageBase64: base64Data,
        mimeType,
        language: currentLanguage,
      });

      setExtractedResult(result);
      setExtractionSuccess(true);

      // HIPAA Audit log
      recordAuditLog({
        user_id: 'usr_niti_2026',
        action: 'OCR_EXTRACT',
        resource_type: 'DISCHARGE_SUMMARY',
        details: `Processed discharge document. Extracted ${result.medications?.length || 0} medications, ${result.exercises?.length || 0} exercises.`,
      });
    } catch (e) {
      console.error('OCR processing error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToDashboard = () => {
    if (extractedResult) {
      onApplyExtractedData(extractedResult);
      alert('Discharge plan successfully synchronized to your medications and exercise schedules!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal OCR & Clinical NLP Engine</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t.featUploadTitle}
        </h2>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          Upload hospital discharge letters, pharmacy slips, or prescriptions. Our clinical NLP extracts structured recovery timelines, medication dosages, and alerts you to conflicting advice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Input Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Upload or Paste Discharge Document</span>
          </h3>

          {/* Drag & Drop Upload Box */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-teal-500 transition-colors relative">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-teal-600 dark:text-teal-400">Click to upload</span> or drag document photo
              </div>
              <p className="text-[11px] text-slate-400">
                Supports PNG, JPG, PDF (Max 25MB). Auto-enhanced with OCR.
              </p>
            </div>
          </div>

          {selectedFile && (
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-900 dark:text-teal-200 truncate">
                📄 {selectedFile.name}
              </span>
              <span className="text-teal-600 text-[11px]">Ready for OCR</span>
            </div>
          )}

          {/* Or Paste Raw Text */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Or Paste Discharge Summary Text:
              </label>
              <button
                type="button"
                onClick={() => setInputText(sampleDischargeText)}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
              >
                Load Apollo Hospital Sample
              </button>
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste discharge text or clinical notes here..."
              className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          <button
            onClick={handleProcessDocument}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing with Gemini 3.1 Pro OCR...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Recovery Plan with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Extraction Preview Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-teal-600" />
                <span>Structured Extraction Results</span>
              </h3>
              {extractionSuccess && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  NLP Parsed
                </span>
              )}
            </div>

            {extractedResult ? (
              <div className="space-y-4 text-xs max-h-[460px] overflow-y-auto pr-2">
                {/* Hospital & Diagnosis */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {extractedResult.hospital_name}
                  </div>
                  <div className="text-teal-700 dark:text-teal-300 font-semibold">
                    Diagnosis: {extractedResult.diagnosis}
                  </div>
                  {extractedResult.surgical_procedure && (
                    <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Procedure: {extractedResult.surgical_procedure}
                    </div>
                  )}
                </div>

                {/* Extracted Medications */}
                {extractedResult.medications && (
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      <span>Extracted Medications ({extractedResult.medications.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {extractedResult.medications.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                            <span className="text-slate-500 ml-1.5 font-normal">({m.dosage})</span>
                            <div className="text-[10px] text-teal-600">{m.frequency} • {m.food_relation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Exercises */}
                {extractedResult.exercises && (
                  <div className="space-y-2">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Physical Therapy & Rehab ({extractedResult.exercises.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {extractedResult.exercises.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700"
                        >
                          <span className="font-bold text-slate-900 dark:text-white">{ex.title}</span>
                          <p className="text-[11px] text-slate-500">{ex.instructions}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conflict Warnings */}
                {extractedResult.detected_conflicts && extractedResult.detected_conflicts.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                    <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Safety Conflict Alert</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                      {extractedResult.detected_conflicts[0].description}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <Layers className="w-10 h-10 opacity-30" />
                <p className="text-xs">
                  Upload a document or load sample text on the left to view parsed clinical results.
                </p>
              </div>
            )}
          </div>

          {extractedResult && (
            <button
              onClick={handleApplyToDashboard}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Apply Extracted Plan to Today's Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
