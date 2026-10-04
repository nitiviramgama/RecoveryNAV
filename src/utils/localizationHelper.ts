import { Language } from '../types';

// Clinical & General dictionary for real-time translation across English, Hindi & Gujarati
export const clinicalTranslations: Record<string, { hi: string; gu: string }> = {
  // Timings
  'All': { hi: 'सभी', gu: 'બધા' },
  'Morning': { hi: 'सुबह', gu: 'સવાર' },
  'Afternoon': { hi: 'दोपहर', gu: 'બપોર' },
  'Evening': { hi: 'शाम', gu: 'સાંજ' },
  'Night': { hi: 'रात', gu: 'રાત' },

  // Food relations
  'After Food': { hi: 'भोजन के बाद', gu: 'જમ્યા પછી' },
  'Before Food': { hi: 'भोजन से पहले', gu: 'જમ્યા પહેલા' },
  'With Food': { hi: 'भोजन के साथ', gu: 'જમવા સાથે' },
  'Empty Stomach': { hi: 'खाली पेट', gu: 'ખાલી પેટે' },
  'Take with full glass of water': { hi: 'पूरे गिलास पानी के साथ लें', gu: 'આખા ગ્લાસ પાણી સાથે લો' },

  // Common Medication Names & Purposes
  'Metoprolol Tartrate': { hi: 'मेटोप्रोलोल टार्ट्रेट', gu: 'મેટોપ્રોલોલ ટારટ્રેટ' },
  'Atorvastatin': { hi: 'एटोरवास्टेटिन', gu: 'એટોરવાસ્ટેટીન' },
  'Aspirin (Ecotrin)': { hi: 'एस्पिरिन (इकोट्रिन)', gu: 'એસ્પિરિન (ઇકોટ્રિન)' },
  'Pantoprazole': { hi: 'पेंटोप्रsingleाजोल', gu: 'પેન્ટોપ્રાઝોલ' },
  'Paracetamol': { hi: 'पैरासिटामोल', gu: 'પેરાસીટામોલ' },
  'Blood pressure & heart rate control (Post-CABG)': {
    hi: 'रक्तचाप और हृदय गति नियंत्रण (सर्जरी पश्चात)',
    gu: 'બ્લડ પ્રેશર અને હૃદયના ધબકારા નિયંત્રણ (સર્જરી પછી)'
  },
  'Bypass graft protection & lipid lowering': {
    hi: 'बाईपास ग्राफ्ट सुरक्षा और कोलेस्ट्रॉल कम करना',
    gu: 'બાયપાસ ગ્રાફ્ટ સુરક્ષા અને કોલેસ્ટ્રોલ નિયંત્રણ'
  },
  'Antiplatelet clot prevention for cardiac bypass': {
    hi: 'हृदय बाईपास के लिए रक्त का थक्का जमने से रोकथाम',
    gu: 'હૃદય બાયપાસ માટે લોહી ગંઠાઈ જતું અટકાવવા'
  },
  'Gastric mucosal protection during antiplatelet therapy': {
    hi: 'दवाओं के दौरान पेट में एसिड और गैस से सुरक्षा',
    gu: 'દવાઓ દરમિયાન પેટમાં ગેસ અને એસિડિટીથી રક્ષણ'
  },
  'Mild incision discomfort & fever control (PRN)': {
    hi: 'हल्के दर्द और बुखार से राहत के लिए (ज़रूरत पड़ने पर)',
    gu: 'હળવા દુખાવા અને તાવના નિયંત્રણ માટે (જરૂર મુજબ)'
  },
  'Twice daily': { hi: 'दिन में दो बार', gu: 'દિવસમાં બે વાર' },
  'Once daily at bedtime': { hi: 'सोते समय दिन में एक बार', gu: 'રાત્રે સૂતી વખતે દિવસમાં એક વાર' },
  'Once daily with breakfast': { hi: 'नाश्ते के साथ दिन में एक बार', gu: 'સવારના નાસ્તા સાથે એક વાર' },
  'Once daily before breakfast': { hi: 'नाश्ते से पहले खाली पेट दिन में एक बार', gu: 'સવારે નાસ્તા પહેલાં ખાલી પેટે' },
  'Every 6-8 hours as needed': { hi: 'ज़रूरत पड़ने पर हर 6-8 घंटे में', gu: 'જરૂર મુજબ દર 6-8 કલાકે' },

  // Precautions
  'Check pulse before taking; hold if pulse < 55 bpm': {
    hi: 'दवा लेने से पहले नाड़ी (पल्स) जांचें; यदि 55 से कम हो तो न लें',
    gu: 'દવા લેતા પહેલાં નાડી તપાસો; જો 55 કરતાં ઓછી હોય તો ન લેશો'
  },
  'Avoid grapefruit juice; report muscle cramps to cardiologist': {
    hi: 'अंगूर का रस न लें; मांसपेशियों में दर्द होने पर डॉक्टर को बताएं',
    gu: 'મોસંબી/ગ્રેપફ્રૂટનો રસ ન લેશો; સ્નાયુમાં દુખાવો થાય તો ડૉક્ટરને જણાવો'
  },
  'Do NOT stop abruptly; take immediately after meals to protect stomach': {
    hi: 'अचानक बंद न करें; पेट की सुरक्षा के लिए भोजन के तुरंत बाद लें',
    gu: 'અચાનક બંધ ન કરશો; પેટની સલામતી માટે જમ્યા પછી તરત જ લો'
  },
  'Take whole, do not crush or chew capsule': {
    hi: 'कैप्सूल पूरा निगलें, चबाएं या तोड़ें नहीं',
    gu: 'કેપ્સ્યુલ આખી ગળી જાઓ, ચાવશો કે તોડશો નહીં'
  },
  'Do not exceed 4,000 mg in 24 hours; avoid other acetaminophen products': {
    hi: '24 घंटे में 4000 मिलीग्राम से अधिक न लें',
    gu: '24 કલાકમાં 4000 મિલિગ્રામથી વધુ ન લેશો'
  },

  // Exercise Titles & Categories
  'Incentive Spirometer Deep Breathing': {
    hi: 'इंसेंटिव स्पाइरोमीटर गहरी सांस का व्यायाम',
    gu: 'ઇન્સેન્ટિવ સ્પાઇરોમીટર ઊંડા શ્વાસની કસરત'
  },
  'Ankle Pumps & Circulatory Activation': {
    hi: 'टखने का व्यायाम (रक्त संचार सक्रियण)',
    gu: 'ઘૂંટીની કસરત (લોહી પરિભ્રમણ સક્રિયતા)'
  },
  'Assisted Sternal-Safe Walking': {
    hi: 'सुरक्षित धीमी सैर (छाती की सुरक्षा के साथ)',
    gu: 'સુરક્ષિત ધીમું ચાલવું (છાતીની કાળજી સાથે)'
  },
  'Seated Shoulder & Gentle Posture Alignment': {
    hi: 'बैठकर कंधे और मुद्रा सीधा करने का व्यायाम',
    gu: 'બેસીને ખભા અને મુદ્રા સીધા કરવાની કસરત'
  },
  'Respiratory Rehabilitation': {
    hi: 'श्वसन पुनर्वास',
    gu: 'શ્વસન પુનર્વસન'
  },
  'Vascular DVT Prevention': {
    hi: 'रक्त के थक्के की रोकथाम (DVT)',
    gu: 'લોહીની ગાંઠ અટકાવવા (DVT રોકથામ)'
  },
  'Aerobic Conditioning': {
    hi: 'कार्डियक अनुकूलन',
    gu: 'હૃદય અનુકૂલન'
  },
  'Postural & Mobility': {
    hi: 'मुद्रा और गतिशीलता',
    gu: 'શરીર સ્થિતિ અને ગતિશીલતા'
  },
  'Lungs & Diaphragm': { hi: 'फेफड़े और डायाफ्राम', gu: 'ફેફસાં અને ડાયાફ્રામ' },
  'Calf Muscles & Lower Leg': { hi: 'पिंडलियां और पैर', gu: 'પિંડીઓ અને પગ' },
  'Cardiovascular Endurance': { hi: 'हृदय और सहनशक्ति', gu: 'હૃદય અને સહનશક્તિ' },
  'Upper Back & Neck': { hi: 'पीठ का ऊपरी हिस्सा और गर्दन', gu: 'પીઠનો ઉપરનો ભાગ અને ગરદન' },

  // Exercise instructions
  'Sit upright. Inhale slowly and deeply through mouthpiece to lift piston indicator. Hold breath for 3-5 seconds, then exhale slowly. Repeat 10 breaths every waking hour.': {
    hi: 'सीधे बैठें। माउथपीस से धीरे-धीरे और गहरी सांस अंदर खींचें ताकि पिस्टन ऊपर उठे। 3-5 सेकंड सांस रोकें, फिर धीरे-धीरे छोड़ें। जागते समय हर घंटे 10 बार दोहराएं।',
    gu: 'ટાટાર બેસો. માઉથપીસ દ્વારા ધીમે ધીમે અને ઊંડો શ્વાસ અંદર લો જેથી પિસ્ટન ઉપર જાય. 3-5 સેકન્ડ શ્વાસ રોકો, પછી ધીમેથી બહાર કાઢો. જાગતા હોવ ત્યારે દર કલાકે 10 વાર કરો.'
  },
  'Point toes downward away from body, then pull toes upward toward shin. Perform in sets of 20 repetitions hourly while resting in bed or chair to prevent blood clots.': {
    hi: 'पैरों के पंजों को नीचे की ओर दबाएं, फिर ऊपर की ओर खींचें। रक्त के थक्कों से बचने के लिए बिस्तर या कुर्सी पर आराम करते समय प्रति घंटे 20 बार दोहराएं।',
    gu: 'પગના અંગૂઠાને શરીરથી દૂર નીચે દબાવો, પછી ઘૂંટણ તરફ ઉપર ખેંચો. લોહી ગંઠાઈ જતું અટકાવવા આરામ કરતી વખતે દર કલાકે 20 વખત પુનરાવર્તન કરો.'
  },
  'Walk gently on flat, even surface with a caregiver nearby. Maintain comfortable conversational breathing without gasping. Stop immediately if lightheaded.': {
    hi: 'समतल सतह पर देखभालकर्ता के साथ धीरे-धीरे चलें। बिना हांफे आरामदायक सांस लेते रहें। चक्कर आने पर तुरंत बैठ जाएं।',
    gu: 'સપાટ જમીન પર સહાયક સાથે ધીમે ધીમે ચાલો. હાંફ્યા વગર સામાન્ય શ્વાસ લેતા રહો. ચક્કર આવે તો તરત જ બેસી જાઓ.'
  },
  'Sit comfortably on a supportive chair. Gently roll shoulders backward in circular motions. Avoid reaching arms behind back or pulling with hands.': {
    hi: 'कुर्सी पर सीधे बैठें। अपने कंधों को धीरे-धीरे पीछे की ओर गोलाकार घुमाएं। हाथों को पीछे ज्यादा न खींचें।',
    gu: 'ખુરશી પર આરામથી બેસો. ખભાને ધીમે ધીમે પાછળ ગોળાકાર ફેરવો. હાથને પાછળ બહુ ખેંચશો નહીં.'
  },

  // Appointments
  'Dr. Vikram Shah': { hi: 'डॉ. विक्रम शाह', gu: 'ડૉ. વિક્રમ શાહ' },
  'Dr. Sunita Patel': { hi: 'डॉ. सुनीता पटेल', gu: 'ડૉ. સુનીતા પટેલ' },
  'Dr. Rajesh Mehta': { hi: 'डॉ. राजेश मेहता', gu: 'ડૉ. રાજેશ મહેતા' },
  'Cardiothoracic Surgery': { hi: 'कार्डियोथोरेसिक सर्जरी', gu: 'કાર્ડિયોથોરેસિક સર્જરી' },
  'Cardiology & Heart Failure': { hi: 'कार्डियोलॉजी और हृदय स्वास्थ्य', gu: 'કાર્ડિયોલોજી અને હૃદય આરોગ્ય' },
  'Cardiac Physical Rehabilitation': { hi: 'कार्डियक फिजिकल रिहैबिलिटेशन', gu: 'કાર્ડિયાક ફિઝિકલ પુનર્વસન' },
  'Sternal incision evaluation, stitch inspection, and postoperative chest X-ray review.': {
    hi: 'छाती के घाव की जांच, टांके देखना और सर्जरी पश्चात चेस्ट एक्स-रे की समीक्षा।',
    gu: 'છાતીના ટાંકાની તપાસ, ઘાનું નિરીક્ષણ અને સર્જરી પછીના એક્સ-રેની ચકાસણી.'
  },
  'Resting ECG, medication titration for Metoprolol, and cardiac recovery telemetry check.': {
    hi: 'ईसीजी जांच, मेटोप्रोलोल दवा की खुराक का समायोजन और हृदय रिकवरी मॉनिटरिंग।',
    gu: 'ઇસીજી તપાસ, મેટોપ્રોલોલ દવાનું એડજસ્ટમેન્ટ અને હૃદય રિકવરી મોનિટરિંગ.'
  },
  'Assessment of ambulatory stamina, 6-minute walk test readiness, and sternal mobility advancement.': {
    hi: 'चलने की क्षमता का मूल्यांकन, 6 मिनट वॉक टेस्ट और छाती की गतिशीलता की जांच।',
    gu: 'ચાલવાની ક્ષમતાનું મૂલ્યાંકન, 6 મિનિટ વૉક ટેસ્ટ અને હલનચલનની પ્રગતિની સમીક્ષા.'
  },

  // General UI Phrases
  'Voice Log Doses': { hi: 'आवाज से दवा दर्ज करें', gu: 'અવાજથી દવા નોંધી લો' },
  'Listening': { hi: 'सुन रहा हूँ...', gu: 'સાંભળી રહ્યું છે...' },
  'Speak Now': { hi: 'अब बोलें', gu: 'હવે બોલો' },
  'Review Caution': { hi: 'सावधानी देखें', gu: 'સાવચેતી જુઓ' },
  'Verified Patient': { hi: 'सत्यापित रोगी', gu: 'ચકાસાયેલ દર્દી' },
  'Hello': { hi: 'नमस्ते', gu: 'નમસ્તે' },
  'Sign Out': { hi: 'साइन आउट', gu: 'સાઇન આઉટ' },
  'Emergency SOS': { hi: 'आपातकालीन सहायता (SOS)', gu: 'કટોકટી સહાય (SOS)' },
  'Take with meals': { hi: 'भोजन के साथ लें', gu: 'જમવાની સાથે લો' },
  'Take on empty stomach': { hi: 'खाली पेट लें', gu: 'ખાલી પેટે લો' },
  'Take with water': { hi: 'पानी के साथ लें', gu: 'પાણી સાથે લો' },
};

/**
 * Translates any clinical or UI text to the selected language if a translation exists.
 */
export function tText(text: string | undefined | null, lang: Language): string {
  if (!text) return '';
  if (lang === 'en') return text;

  // Direct dictionary lookup
  const entry = clinicalTranslations[text.trim()];
  if (entry && entry[lang]) {
    return entry[lang];
  }

  // Partial match replacements (e.g. for timings or frequencies)
  let translated = text;
  Object.keys(clinicalTranslations).forEach((key) => {
    if (text.includes(key)) {
      const match = clinicalTranslations[key];
      if (match && match[lang]) {
        translated = translated.replace(new RegExp(key, 'g'), match[lang]);
      }
    }
  });

  return translated;
}
