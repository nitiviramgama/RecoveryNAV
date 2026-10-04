import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  HeartPulse,
  Pill,
  Calendar,
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      badge: 'ABOUT RECOVERYNAV',
      title: 'Making post-hospital recovery easier to navigate.',
      subtitle:
        'Patients often leave hospitals with multiple documents, prescriptions, and instructions. RecoveryNav transforms this information into a structured recovery plan.',
      illustration: 'process',
    },
    {
      badge: 'HOW IT WORKS',
      title: 'From discharge instructions to a clearer recovery journey.',
      subtitle:
        'RecoveryNav organizes information from your hospital documents into a structured recovery experience in 4 simple steps.',
      illustration: 'steps',
    },
    {
      badge: 'CORE FEATURES',
      title: 'Everything you need in one place.',
      subtitle:
        'Designed around the real challenges patients face after leaving the hospital.',
      illustration: 'features',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator Badge */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
            {steps[currentStep].badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {steps[currentStep].title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {steps[currentStep].subtitle}
          </p>
        </div>

        {/* Step Visual Content */}
        <div className="py-4">
          {currentStep === 0 && (
            <div className="p-6 rounded-3xl bg-teal-50/70 dark:bg-slate-800/60 border border-teal-100 dark:border-slate-700 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
                <HeartPulse className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  Recovery Navigator
                </div>
                <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                  Personalized • Multilingual • Voice-Assisted
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            /* 4 Steps matching Screenshot 5 */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-mono font-bold text-teal-600">01</div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Upload</div>
                <p className="text-[10px] text-slate-500">Discharge summary & prescriptions</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-mono font-bold text-teal-600">02</div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Understand</div>
                <p className="text-[10px] text-slate-500">OCR & AI extraction of instructions</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-mono font-bold text-teal-600">03</div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Personalize</div>
                <p className="text-[10px] text-slate-500">Timeline & medication schedules</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-mono font-bold text-teal-600">04</div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">Recover</div>
                <p className="text-[10px] text-slate-500">Track progress & appointments</p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            /* 6 Features matching Screenshot 4 */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <FileText className="w-4 h-4 text-teal-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Smart Document OCR</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-teal-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">AI-Assisted Extraction</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Pill className="w-4 h-4 text-teal-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Medication Tracking</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-teal-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Follow-up Reminders</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Activity className="w-4 h-4 text-teal-600 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Recovery Monitoring</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />
                <div className="text-xs font-bold text-slate-900 dark:text-white">Conflict Detection</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6 bg-teal-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Back
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Get Started Now</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
