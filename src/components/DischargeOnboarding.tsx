import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Pill,
  Dumbbell,
  Calendar,
  Heart,
  Droplets,
  Clock,
  Check,
  FileCheck
} from 'lucide-react';
import { Language, User, Medication, PhysicalTherapyExercise, Appointment, SafetyConflict } from '../types';
import { translations } from '../locales/translations';
import { extractDischargeWithAI, DischargeExtractionResult } from '../services/geminiClient';
import { recordAuditLog } from '../services/auditService';

interface DischargeOnboardingProps {
  user: User;
  currentLanguage: Language;
  onPlanGenerated: (result: DischargeExtractionResult) => void;
  onCancel?: () => void;
  canCancel?: boolean;
}

export const DischargeOnboarding: React.FC<DischargeOnboardingProps> = ({
  user,
  currentLanguage,
  onPlanGenerated,
  onCancel,
  canCancel = false,
}) => {
  const t = translations[currentLanguage];

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [extractedData, setExtractedData] = useState<DischargeExtractionResult | null>(null);
  const [analysisError, setAnalysisError] = useState('');

  const sampleDocuments = [
    {
      title: 'Apollo Hospital & Heart Institute - Post-CABG Discharge Summary',
      category: 'Cardiac Surgery (CABG x2)',
      hospital: 'Apollo Heart Institute, Ahmedabad',
      patient: user.full_name || 'Niti Viramgama',
      text: `APOLLO HOSPITAL & HEART INSTITUTE - DISCHARGE SUMMARY
PATIENT: ${user.full_name || 'Niti Viramgama'} | AGE: 42 | SEX: Female | MRN: ${user.mrn || 'MRN-7849201'}
ATTENDING SURGEON: Dr. Vikram Shah, MS, MCh (CTVS)
ADMITTED: 04/09/2026 | DISCHARGED: 11/09/2026

PRIMARY DIAGNOSIS:
Coronary Artery Disease - Triple Vessel Disease (CAD-TVD).
SURGICAL PROCEDURE PERFORMED:
Off-Pump Coronary Artery Bypass Graft (OP-CABG x2: LIMA to LAD, Reverse Saphenous Vein Graft to OM1). Concurrent laparoscopic cholecystectomy for symptomatic cholelithiasis.

DISCHARGE MEDICATIONS:
1. Metoprolol Tartrate 25 mg PO BID (Twice daily after food). Monitor resting pulse; hold if heart rate < 55 bpm.
2. Atorvastatin 40 mg PO QHS (Once daily at bedtime). Avoid grapefruit juice.
3. Aspirin (Ecotrin) 81 mg PO Daily with breakfast (Antiplatelet bypass graft protection). Do NOT take OTC Ibuprofen/Naproxen.
4. Cefuroxime Axetil 500 mg PO BID x 5 days (Finish full antibiotic course).
5. Pantoprazole 40 mg PO Daily in the morning 30 minutes before meal.

PHYSICAL THERAPY & STERNAL REHABILITATION:
- Incentive Spirometer Deep Breathing: 10 deep breaths every waking hour (target > 1500 ml). Hug cardiac pillow firmly against chest when coughing.
- Ankle Pumps & Calf Elevation: 20 repetitions each leg, 3 times daily to prevent deep vein thrombosis.
- Sternal Precautions: Strictly NO lifting > 5 kg (10 lbs) for 6 weeks. No driving for 3 weeks. No pushing or pulling with arms.

DIETARY & HYDRATION GUIDELINES:
- Low-Sodium Diet: Strictly < 2,000 mg (2 g) sodium per day. Avoid pickles, papads, processed cheese, and canned soups.
- Fluid Intake: 2.0 Liters of water daily, evenly spaced.

FOLLOW-UP CONSULTATIONS:
- Sept 18, 2026 at 10:30 AM: Sternal wound inspection & suture line assessment with Dr. Vikram Shah.
- Sept 22, 2026 at 02:00 PM: Phase-II Cardiac Rehabilitation Intake at Apollo Wellness Center.

RED-FLAG WARNING SIGNS (CONTACT CLINIC OR CALL 112 IMMEDIATELY):
- Sudden crushing chest tightness or persistent shortness of breath.
- Fever above 100.5°F (38.0°C) or chills.
- Sternal incision redness, swelling, instability, or purulent drainage.
- Sudden warmth, severe pain, or asymmetric swelling in either calf.`,
    },
    {
      title: 'Max Super Specialty Hospital - Total Knee Replacement (TKR)',
      category: 'Orthopedic Surgery',
      hospital: 'Max Super Specialty Hospital',
      patient: user.full_name || 'Niti Viramgama',
      text: `MAX SUPER SPECIALTY HOSPITAL - DISCHARGE SUMMARY
PATIENT: ${user.full_name || 'Niti Viramgama'} | AGE: 58 | SEX: Female | MRN: MRN-9023412
ATTENDING ORTHOPEDIC SURGEON: Dr. Rajesh Mehta, MS (Ortho)
ADMITTED: 15/09/2026 | DISCHARGED: 19/09/2026

PRIMARY DIAGNOSIS:
Severe Osteoarthritis Right Knee (Grade IV Tricompartmental).
SURGERY PERFORMED:
Right Total Knee Arthroplasty (TKA / TKR) with high-flexion implant and computer navigation.

DISCHARGE MEDICATIONS:
1. Enoxaparin (Clexane) 40 mg SC Once Daily for 14 days (Deep Vein Thrombosis prophylaxis).
2. Tramadol + Paracetamol (37.5mg/325mg) 1 tab PO TID PRN for moderate post-op knee pain.
3. Calcium Carbonate 500mg + Vitamin D3 PO Daily after lunch.
4. Pantoprazole 40mg PO Daily before breakfast.

PHYSICAL THERAPY & JOINT REHABILITATION:
- Straight Leg Raises (SLR): 15 reps, 3 sets daily.
- Quad Sets & Heel Slides: 10 reps every 2 hours to regain 90° knee flexion.
- Mobilization: Walk with two-wheeled walker. Weight-bearing as tolerated. Avoid twisting knee.

DIETARY & WOUND CARE:
- High protein diet for tissue repair. High fiber and adequate fluids to prevent constipation.
- Keep incision dry. Suture removal scheduled on Day 14.

FOLLOW-UP APPOINTMENT:
- Sept 29, 2026 at 11:00 AM: Suture removal and post-op X-Ray review with Dr. Rajesh Mehta.

RED-FLAG WARNING SIGNS:
- Sudden calf pain, redness, or unilateral leg swelling (suspected DVT).
- High fever > 101°F or spreading redness around the knee incision.
- Inability to bend knee or severe uncontrolled pain.`,
    },
    {
      title: 'Fortis Hospital - Laparoscopic Cholecystectomy Discharge Plan',
      category: 'General & GI Surgery',
      hospital: 'Fortis Hospital',
      patient: user.full_name || 'Niti Viramgama',
      text: `FORTIS HOSPITAL - CLINICAL DISCHARGE SUMMARY
PATIENT: ${user.full_name || 'Niti Viramgama'} | AGE: 42 | SEX: Female | MRN: MRN-5541092
ATTENDING SURGEON: Dr. Anita Desai, MS (General Surgery)
ADMITTED: 02/09/2026 | DISCHARGED: 04/09/2026

PRIMARY DIAGNOSIS:
Chronic Symptomatic Cholelithiasis (Gallbladder stones) with Acute Cholecystitis.
PROCEDURE:
Four-port Elective Laparoscopic Cholecystectomy under General Anesthesia.

DISCHARGE MEDICATIONS:
1. Ciprofloxacin 500mg PO BID x 5 days (Antibiotic course).
2. Paracetamol 650mg PO TID as needed for port-site soreness.
3. Pantoprazole 40mg PO Daily 30 mins before breakfast.

RECOVERY EXERCISES & ACTIVITY:
- Light walking: 15-20 minutes twice daily.
- Avoid lifting anything heavier than 7 kg for 3 weeks to prevent port-site incisional hernia.
- Deep breathing exercises: 5 deep breaths every 2 hours.

DIET & HYDRATION:
- Low-fat, low-grease, bland diet for 4 weeks. Avoid fried foods, rich curries, and high-fat dairy.
- Drink 2 Liters of water daily.

FOLLOW-UP:
- Sept 12, 2026 at 04:30 PM: Port-site dressing review and pathology report discussion.

RED-FLAG WARNING SIGNS:
- Yellowing of skin or eyes (jaundice).
- High fever with chills or worsening abdominal pain.
- Persistent vomiting or wound redness with discharge.`,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter((file) => file.size <= 25 * 1024 * 1024);
    setSelectedFiles(valid);
    setAnalysisError(valid.length !== files.length ? 'One or more files exceeded the 25MB limit and were skipped.' : '');
  };

  const handleStartAnalysis = async () => {
    setAnalysisError('');
    setIsAnalyzing(true);
    setAnalysisStep(1);

    const timer1 = setTimeout(() => setAnalysisStep(2), 700);
    const timer2 = setTimeout(() => setAnalysisStep(3), 1500);
    const timer3 = setTimeout(() => setAnalysisStep(4), 2300);

    try {
      if (activeTab === 'upload' && selectedFiles.length === 0) {
        throw new Error('Please upload at least one document before starting analysis.');
      }
      if (activeTab === 'paste' && !pastedText.trim()) {
        throw new Error('Please paste the discharge/medication/diet instructions before starting analysis.');
      }

      const documents = activeTab === 'upload'
        ? await Promise.all(selectedFiles.map(async (file) => {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(String(reader.result).split(',')[1] || '');
              reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
              reader.readAsDataURL(file);
            });
            return { name: file.name, mimeType: file.type || 'application/pdf', base64 };
          }))
        : [];

      const result = await extractDischargeWithAI({
        documentText: activeTab === 'paste' ? pastedText.trim() : undefined,
        documents,
        language: currentLanguage,
      });

      setExtractedData(result);
      recordAuditLog({
        user_id: user.id || 'usr_default',
        action: 'OCR_EXTRACT',
        resource_type: 'DISCHARGE_SUMMARY',
        details: `Analyzed ${activeTab === 'upload' ? selectedFiles.length : 1} recovery document(s) for ${result.patient_name || user.full_name}: ${result.medications?.length || 0} medications, ${result.exercises?.length || 0} exercises, ${result.appointments?.length || 0} follow-ups.`,
      });
    } catch (err: any) {
      console.error('Extraction error:', err);
      setAnalysisError(err?.message || 'Document analysis failed. Please try again.');
    } finally {
      clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3);
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndLaunch = () => {
    if (extractedData) {
      onPlanGenerated(extractedData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-4 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 text-white p-6 sm:p-10 shadow-xl border border-teal-500/30">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Discharge Intake & Clinical Analyzer</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {currentLanguage === 'hi'
              ? 'डिस्चार्ज सारांश और दवा विवरण दर्ज करें'
              : currentLanguage === 'gu'
              ? 'ડિસ્ચાર્જ સમરી અને દવાઓની વિગતો દાખલ કરો'
              : 'Provide Your Discharge Summary & Prescription'}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-medium">
            {currentLanguage === 'hi'
              ? 'रिकवरीनेव आपके अस्पताल डिस्चार्ज सारांश, दवाओं, खुराक, आहार और फॉलो-अप को स्कैन करके एक संपूर्ण रिकवरी डैशबोर्ड, रिमाइंडर और सुरक्षा गाइड तैयार करता है।'
              : currentLanguage === 'gu'
              ? 'રીકવરીનેવ તમારા હોસ્પિટલ ડિસ્ચાર્જ દસ્તાવેજો, દવાઓ, ડોઝ, આહાર અને મુલાકાતોનું વિશ્લેષણ કરીને તમારો પર્સનલાઇઝ્ડ ડેશબોર્ડ અને રીમાઇન્ડર તૈયાર કરશે.'
              : 'RecoveryNav analyzes your hospital discharge documents to dynamically generate your personalized recovery dashboard, medication alarms, physical therapy schedule, diet plan, and emergency red flags.'}
          </p>

          {canCancel && onCancel && (
            <div className="pt-2">
              <button
                onClick={onCancel}
                className="text-xs font-semibold underline text-teal-200 hover:text-white"
              >
                ← Return to Current Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Decorative Graphic */}
        <div className="hidden md:flex absolute right-6 -bottom-6 opacity-20 pointer-events-none">
          <FileCheck className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* Main Container */}
      {!extractedData ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Step 1: Choose How to Provide Your Medical Documents
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload a photo/PDF, paste discharge notes, or choose a real hospital template.
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold max-w-md">
            <button onClick={() => setActiveTab('upload')} className={`flex-1 py-2 px-3 rounded-xl transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Upload Documents</button>
            <button onClick={() => setActiveTab('paste')} className={`flex-1 py-2 px-3 rounded-xl transition-all ${activeTab === 'paste' ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>Paste Text</button>
          </div>

          {/* Upload multiple source documents */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-teal-500 transition-colors relative">
                <input type="file" accept="image/*,application/pdf" multiple onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-inner"><Upload className="w-7 h-7" /></div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Upload all recovery documents</p>
                    <p className="text-xs text-slate-500">Discharge summary, prescriptions/medications, diet instructions, exercise/physiotherapy, and follow-up papers. JPG, PNG, PDF • Max 25MB each.</p>
                  </div>
                </div>
              </div>
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file) => (
                    <div key={`${file.name}-${file.size}`} className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0"><FileText className="w-4 h-4 text-teal-600 shrink-0" /><span className="font-semibold text-teal-900 dark:text-teal-200 truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span></div>
                      <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white font-bold text-[10px] shrink-0">Ready</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-500">{selectedFiles.length} document(s) will be analyzed together into one recovery plan.</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Paste any discharge, medication, dose, diet, exercise, or follow-up instructions:
              </label>
              <textarea
                rows={8}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the text from your discharge summary, prescription, diet sheet, physiotherapy instructions, and follow-up document here..."
                className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono leading-relaxed"
              />
            </div>
          )}

          {analysisError && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing}
              className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-600/25 flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>
                    {analysisStep === 1 && 'Reading medical document & diagnosis...'}
                    {analysisStep === 2 && 'Extracting medication dosages, timings & food relations...'}
                    {analysisStep === 3 && 'Generating therapy plan, diet rules & alarms...'}
                    {analysisStep >= 4 && 'Cross-checking safety conflicts & red flags...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze Document & Build My Recovery Plan</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Step 2: Extracted Blueprint Review */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Extraction Complete
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Clinical Recovery Plan Blueprint
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review your personalized schedule before generating the dashboard and reminder alarms.
              </p>
            </div>

            <button
              onClick={() => setExtractedData(null)}
              className="text-xs font-semibold text-slate-500 hover:text-teal-600"
            >
              Re-analyze Another Document
            </button>
          </div>

          {/* Quick Extracted Summary Header */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-teal-800 dark:text-teal-200">
                {extractedData.hospital_name || 'Hospital Center'}
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                {extractedData.diagnosis || 'Post-Surgical Recovery'}
              </h4>
              {extractedData.surgical_procedure && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Procedure: {extractedData.surgical_procedure}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-center shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                <div className="text-base font-extrabold text-teal-600">
                  {extractedData.medications?.length || 0}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Meds</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                <div className="text-base font-extrabold text-indigo-600">
                  {extractedData.exercises?.length || 0}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Exercises</div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                <div className="text-base font-extrabold text-amber-600">
                  {extractedData.appointments?.length || 0}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Visits</div>
              </div>
            </div>
          </div>

          {/* Detailed Cards Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medications & Reminders */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>Prescribed Medications & Alarms</span>
                </div>
                <span className="text-[10px] text-teal-600 font-semibold">Alarms Armed</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(extractedData.medications || []).map((med, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {med.name} ({med.dosage})
                      </span>
                      <span className="text-[10px] font-semibold text-teal-600 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950">
                        {med.frequency}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{med.food_relation || 'With food'}</span>
                      <span>•</span>
                      <span>{med.timing?.join(', ') || 'Morning, Night'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercises & Precaution Rehab */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Dumbbell className="w-4 h-4 text-indigo-600" />
                <span>Physical Therapy & Activity Limits</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(extractedData.exercises || []).map((ex, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{ex.title}</span>
                      <span className="text-[10px] text-indigo-600">{ex.repetitions}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {ex.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary & Hydration Rules */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span>Diet Plan & Hydration Target</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {extractedData.dietary_instructions || 'No dietary instructions were found in the supplied documents.'}
              </p>
              {extractedData.activity_restrictions && (
                <div className="pt-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                  Restrictions: {extractedData.activity_restrictions}
                </div>
              )}
            </div>

            {/* Red Flag Warning Signs */}
            <div className="p-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Red Flags for Emergency (112)</span>
              </div>
              <ul className="space-y-1 text-[11px] text-red-900 dark:text-red-300 list-disc list-inside">
                {(extractedData.warning_signs || []).slice(0, 4).map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleConfirmAndLaunch}
              className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base shadow-xl shadow-teal-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
            >
              <Check className="w-5 h-5" />
              <span>Launch My Recovery Dashboard with These Documents</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
