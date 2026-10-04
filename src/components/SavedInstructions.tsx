import React, { useEffect, useState } from 'react';
import { Bookmark, FileText, Trash2 } from 'lucide-react';
import { Language, User } from '../types';
import { SavedInstruction, deleteSavedInstruction, loadSavedInstructions } from './PersonalizedRecoveryPlan';

interface SavedInstructionsProps {
  user: User;
  currentLanguage: Language;
}

export const SavedInstructions: React.FC<SavedInstructionsProps> = ({ user, currentLanguage }) => {
  const [items, setItems] = useState<SavedInstruction[]>([]);
  const text = (en: string, hi: string, gu: string) => currentLanguage === 'hi' ? hi : currentLanguage === 'gu' ? gu : en;

  useEffect(() => {
    setItems(loadSavedInstructions(user.id));
  }, [user.id]);

  const remove = (id: string) => {
    deleteSavedInstruction(user.id, id);
    setItems(loadSavedInstructions(user.id));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-teal-600 text-white shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5" />
          {text('Your Saved Instructions', 'आपके सहेजे गए निर्देश', 'તમારી સાચવેલી સૂચનાઓ')}
        </div>
        <h2 className="text-2xl font-bold mt-3">{text('Saved Instructions', 'सहेजे गए निर्देश', 'સાચવેલ સૂચનાઓ')}</h2>
        <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl">
          {text('Only instructions you explicitly save from your personalized recovery plan appear here.', 'यहाँ केवल वे निर्देश दिखाई देते हैं जिन्हें आपने अपनी व्यक्तिगत रिकवरी योजना से स्वयं सहेजा है।', 'અહીં ફક્ત તમારી વ્યક્તિગત રિકવરી યોજનામાંથી તમે સાચવેલી સૂચનાઓ જ દેખાશે.')}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-center">
          <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="font-bold text-slate-900 dark:text-white mt-3">{text('No saved instructions yet', 'अभी कोई निर्देश सहेजा नहीं गया', 'હજુ કોઈ સૂચના સાચવવામાં આવી નથી')}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{text('Open Personalized Recovery Planning and use the save icon on an instruction.', 'व्यक्तिगत रिकवरी योजना खोलें और किसी निर्देश पर सेव आइकन दबाएँ।', 'વ્યક્તિગત રિકવરી આયોજન ખોલો અને કોઈ સૂચના પર સેવ આઇકન દબાવો.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <article key={item.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600"><FileText className="w-4 h-4" /></div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{item.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.category} · {item.source}</p>
                  </div>
                </div>
                <button onClick={() => remove(item.id)} className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title={text('Remove', 'हटाएँ', 'દૂર કરો')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-4">{item.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
