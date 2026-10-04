import React, { useState } from 'react';
import { BookOpen, Heart, Shield, Activity, Utensils, Moon, Bookmark, Share2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../locales/translations';

interface HealthLibraryProps {
  currentLanguage: Language;
}

export const HealthLibrary: React.FC<HealthLibraryProps> = ({ currentLanguage }) => {
  const t = translations[currentLanguage];
  const [activeTab, setActiveTab] = useState<'ALL' | 'WOUND' | 'DIET' | 'REST'>('ALL');

  const articles = [
    {
      id: 'art_1',
      title: 'Sternal Precautions & Bone Healing Guide (First 6 Weeks)',
      category: 'WOUND',
      readTime: '4 min read',
      summary:
        'Your sternum (breastbone) is secured with surgical stainless wires and takes 6 to 8 weeks to knit back together. Do not lift anything over 5kg (10 lbs), avoid pushing with arms when rising from a chair, and always hug a pillow when coughing.',
      tips: [
        'Use leg muscles to stand, not your arms pushing against the armrests',
        'Keep elbows tucked close to your ribs',
        'Do not open heavy glass commercial doors by yourself',
      ],
    },
    {
      id: 'art_2',
      title: 'Low-Sodium Heart Healthy Diet & Hydration Balance',
      category: 'DIET',
      readTime: '5 min read',
      summary:
        'Limiting sodium to under 2,000mg daily prevents postoperative fluid retention and relieves blood pressure on your newly grafted bypass arteries.',
      tips: [
        'Replace salt with lemon, garlic, ginger, and cumin',
        'Avoid pickled foods, papads, and processed snacks',
        'Maintain 1.8L to 2.0L of water spaced evenly to prevent dehydration while on Metoprolol',
      ],
    },
    {
      id: 'art_3',
      title: 'Optimal Sleep Positioning & Pill Support',
      category: 'REST',
      readTime: '3 min read',
      summary:
        'Sleeping on your back slightly elevated at 30-45 degrees minimizes pressure on incision sites and prevents morning sternal soreness.',
      tips: [
        'Use 2 supportive pillows behind head and back',
        'Place a pillow under knees to relieve lower back strain',
        'Avoid sleeping directly on your stomach or side for the first month',
      ],
    },
  ];

  const filtered = activeTab === 'ALL' ? articles : articles.filter((a) => a.category === activeTab);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Post-Operative Recovery Library</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {t.featLibraryTitle}
        </h2>
        <p className="text-xs sm:text-sm text-teal-100 max-w-xl">
          Clinical instructions simplified into readable articles to support you and your family caregiver at home.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {(['ALL', 'WOUND', 'DIET', 'REST'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-400 transition-all"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {art.category}
              </span>
              <span>{art.readTime}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {art.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {art.summary}
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                Key Caregiver Tips:
              </span>
              <ul className="list-disc list-inside text-xs text-slate-500 dark:text-slate-400 space-y-1">
                {art.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
