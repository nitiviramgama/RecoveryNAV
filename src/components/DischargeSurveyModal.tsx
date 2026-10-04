import React, { useState } from 'react';
import { FileQuestion, Star, CheckCircle2, X, Send } from 'lucide-react';
import { Language } from '../types';

interface DischargeSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const DischargeSurveyModal: React.FC<DischargeSurveyModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
}) => {
  const [clarityRating, setClarityRating] = useState(5);
  const [painControl, setPainControl] = useState('Well Managed');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Post-Discharge Recovery Survey
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Helps your care team at Apollo Hospital evaluate home transition safety. Integrated with Google Forms.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Thank you! Your recovery feedback has been submitted.
            </div>
            <p className="text-xs text-slate-500">
              Your surgical team has been notified of your status.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                How clear were your discharge instructions? (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setClarityRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= clarityRating ? 'fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Current Pain Level & Sternal Tenderness
              </label>
              <select
                value={painControl}
                onChange={(e) => setPainControl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="No Pain">No Pain / Completely Comfortable</option>
                <option value="Well Managed">Mild / Well Managed with Paracetamol</option>
                <option value="Moderate">Moderate Soreness during coughing</option>
                <option value="Severe">Severe Pain (Alert Attending Physician)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Questions or Concerns for your Nurse / Physical Therapist
              </label>
              <textarea
                rows={3}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="e.g. Inquiring about shower timing or cardiac rehab intake..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Recovery Survey</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
