import React, { useState } from 'react';
import {
  AlertTriangle,
  PhoneCall,
  Send,
  ShieldAlert,
  HeartPulse,
  UserCheck,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales/translations';

interface EmergencyHelpProps {
  user: User;
  currentLanguage: Language;
}

export const EmergencyHelp: React.FC<EmergencyHelpProps> = ({ user, currentLanguage }) => {
  const t = translations[currentLanguage];
  const [copied, setCopied] = useState(false);

  const sosMessage =
    currentLanguage === 'hi'
      ? `आपातकालीन अलर्ट: सर्जरी पश्चात मरीज ${user.full_name} (MRN: ${user.mrn}) को तत्काल चिकित्सकीय सहायता की आवश्यकता है। मुख्य सर्जन: डॉ. विक्रम शाह (अपोलो अस्पताल)। आपातकालीन संपर्क: ${user.emergency_contact.name} (${user.emergency_contact.phone})।`
      : currentLanguage === 'gu'
      ? `કટોકટી ચેતવણી: સર્જરી પછીના દર્દી ${user.full_name} (MRN: ${user.mrn}) ને તાત્કાલિક તબીબી સહાયની જરૂર છે. મુખ્ય સર્જન: ડૉ. વિક્રમ શાહ (એપોલો હોસ્પિટલ). ઇમરજન્સી સંપર્ક: ${user.emergency_contact.name} (${user.emergency_contact.phone}).`
      : `EMERGENCY ALERT: Post-CABG Patient ${user.full_name} (MRN: ${user.mrn}) requires urgent clinical assistance. Attending Surgeon: Dr. Vikram Shah (Apollo Hospital). Emergency Contact: ${user.emergency_contact.name} (${user.emergency_contact.phone}).`;

  const handleCopySOS = () => {
    navigator.clipboard.writeText(sosMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Red Alert Urgent Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-600 text-white shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 backdrop-blur-sm uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>
              {currentLanguage === 'hi'
                ? 'तत्काल आपातकालीन सहायता'
                : currentLanguage === 'gu'
                ? 'ત્વરિત કટોકટી સહાય'
                : 'Immediate Emergency Assistance'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            {currentLanguage === 'hi'
              ? 'जीवन-घातक आपात स्थिति में'
              : currentLanguage === 'gu'
              ? 'જીવન-જોખમી કટોકટીમાં'
              : 'In Life-Threatening Emergencies'}
          </h2>
          <p className="text-xs sm:text-sm text-red-100 max-w-lg">
            {currentLanguage === 'hi'
              ? 'यदि आपको अचानक सीने में तेज जकड़न, बेहोशी, सांस लेने में भारी तकलीफ या अत्यधिक रक्तस्राव हो, तो बिना देर किए तुरंत आपातकालीन सेवा पर कॉल करें।'
              : currentLanguage === 'gu'
              ? 'જો તમને અચાનક છાતીમાં તીવ્ર જકડન, ચક્કર/બેભાન થવું, શ્વાસ લેવામાં તકલીફ અથવા રક્તસ્રાવ થાય, તો વિલંબ કર્યા વિના તરત જ ઇમરજન્સી પર કૉલ કરો.'
              : 'If you have sudden severe chest tightness, collapse, difficulty breathing, or arterial bleeding, do not hesitate. Call emergency responders immediately.'}
          </p>
        </div>

        <a
          href="tel:112"
          className="shrink-0 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-red-600 font-extrabold text-base shadow-xl flex items-center gap-3 transition-transform active:scale-95"
        >
          <PhoneCall className="w-5 h-5 animate-pulse" />
          <span>{currentLanguage === 'hi' ? 'अभी 112 पर कॉल करें' : currentLanguage === 'gu' ? 'હમણાં જ 112 પર કૉલ કરો' : 'Call 112 / 911 Now'}</span>
        </a>
      </div>

      {/* Hospital & Attending Surgeon Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-600 uppercase">
              {currentLanguage === 'hi' ? 'अस्पताल इमरजेंसी वार्ड' : currentLanguage === 'gu' ? 'હોસ્પિટલ ઇમરજન્સી વોર્ડ' : 'Hospital Emergency Room'}
            </span>
            <span className="text-xs text-slate-400">24/7 Hotline</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {currentLanguage === 'hi' ? 'अपोलो हार्ट इमरजेंसी यूनिट' : currentLanguage === 'gu' ? 'એપોલો હાર્ટ ઇમરજન્સી યુનિટ' : 'Apollo Heart Emergency Unit'}
          </h3>
          <p className="text-xs text-slate-500">
            Plot 1A, GIDC Health City, Gandhinagar Highway
          </p>
          <a
            href="tel:+917940001000"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:underline pt-1"
          >
            <PhoneCall className="w-4 h-4" />
            <span>+91 79 4000 1000</span>
          </a>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-600 uppercase">
              {currentLanguage === 'hi' ? 'सर्जन (डॉक्टर)' : currentLanguage === 'gu' ? 'મુખ્ય સર્જન' : 'Attending Surgeon'}
            </span>
            <span className="text-xs text-slate-400">On-Call Team</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {currentLanguage === 'hi' ? 'डॉ. विक्रम शाह, एमडी' : currentLanguage === 'gu' ? 'ડૉ. વિક્રમ શાહ, એમડી' : 'Dr. Vikram Shah, MD (CTVS)'}
          </h3>
          <p className="text-xs text-slate-500">
            {currentLanguage === 'hi' ? 'कार्डियोथोरेसिक सर्जरी पोस्ट-ऑप डेस्क' : currentLanguage === 'gu' ? 'કાર્ડિયોથોરેસિક સર્જરી પોસ્ટ-ઓપ ડેસ્ક' : 'Cardiothoracic Surgery Post-Op Care Desk'}
          </p>
          <a
            href="tel:+917940001234"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 hover:underline pt-1"
          >
            <PhoneCall className="w-4 h-4" />
            <span>+91 79 4000 1234</span>
          </a>
        </div>
      </div>

      {/* Caregiver SOS Dispatch Tool */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentLanguage === 'hi' ? 'देखभालकर्ता के लिए तत्काल SOS संदेश' : currentLanguage === 'gu' ? 'પરિવારજન માટે ત્વરિત SOS સંદેશ' : 'Instant Caregiver SOS Dispatch Text'}
            </h3>
          </div>
          <button
            onClick={handleCopySOS}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>
              {copied
                ? (currentLanguage === 'hi' ? 'संदेश कॉपी हो गया' : currentLanguage === 'gu' ? 'સંદેશ કોપી થયો' : 'Copied to Clipboard')
                : (currentLanguage === 'hi' ? 'SOS संदेश कॉपी करें' : currentLanguage === 'gu' ? 'SOS સંદેશ કોપી કરો' : 'Copy SOS Message')}
            </span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
          {sosMessage}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`sms:${user.emergency_contact.phone}?body=${encodeURIComponent(sosMessage)}`}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>
              {currentLanguage === 'hi'
                ? `SMS भेजें: ${user.emergency_contact.name}`
                : currentLanguage === 'gu'
                ? `SMS મોકલો: ${user.emergency_contact.name}`
                : `Send SMS to ${user.emergency_contact.name}`}
            </span>
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(sosMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2"
          >
            <span>{currentLanguage === 'hi' ? 'व्हाट्सएप से भेजें' : currentLanguage === 'gu' ? 'WhatsApp દ્વારા મોકલો' : 'Send via WhatsApp'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
