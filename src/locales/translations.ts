import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  searchPlaceholder: string;
  heroWelcome: string;
  heroSubtitle: string;
  trustedBadge: string;
  simpleBadge: string;
  aiBadge: string;
  askHealthPrompt: string;
  exploreFeatures: string;
  viewAll: string;
  
  // Navigation
  navHome: string;
  navAskAI: string;
  navSymptomGuide: string;
  navHealthLibrary: string;
  navMedicineInfo: string;
  navUploadReport: string;
  navWellnessHub: string;
  navFindHealthcare: string;
  navEmergencyHelp: string;
  navSaved: string;
  navMyChats: string;
  navSettings: string;
  navDatabaseApi: string;
  navAuditLogs: string;
  
  // Quick Actions & Widgets
  quickActions: string;
  bookmarkedArticles: string;
  viewMyChats: string;
  myReports: string;
  inAnEmergency: string;
  emergencyDesc: string;
  callEmergencyBtn: string;
  quoteRight: string;
  quoteBottom: string;
  smallStepsHeader: string;
  smallStepsSub: string;
  
  // Today's Recovery Widget
  recoveryDashboard: string;
  goodMorning: string;
  recoveryProgress: string;
  keepFollowing: string;
  medicinesCount: string;
  tasksCount: string;
  todaysRecovery: string;
  medicationLabel: string;
  takePrescribed: string;
  lightActivityLabel: string;
  lightActivityDesc: string;
  hydrationLabel: string;
  hydrationDesc: string;
  
  // Core Feature Cards
  featAskAITitle: string;
  featAskAIDesc: string;
  featAskAIAction: string;
  featSymptomTitle: string;
  featSymptomDesc: string;
  featSymptomAction: string;
  featLibraryTitle: string;
  featLibraryDesc: string;
  featLibraryAction: string;
  featMedicineTitle: string;
  featMedicineDesc: string;
  featMedicineAction: string;
  featUploadTitle: string;
  featUploadDesc: string;
  featUploadAction: string;
  featWellnessTitle: string;
  featWellnessDesc: string;
  featWellnessAction: string;
  featFindTitle: string;
  featFindDesc: string;
  featFindAction: string;
  featEmergencyTitle: string;
  featEmergencyDesc: string;
  featEmergencyAction: string;

  // Recovery Sections
  medicationsTitle: string;
  exercisesTitle: string;
  appointmentsTitle: string;
  conflictsTitle: string;
  dischargeSummaryTitle: string;
  logAsTaken: string;
  alreadyTaken: string;
  startExercise: string;
  completeSet: string;
  addToGoogleCalendar: string;
  syncToGoogleTasks: string;
  dischargeSurvey: string;
  
  // Voice Assistant
  voiceAssistantTitle: string;
  voiceListening: string;
  voiceSpeakNow: string;
  voiceCommandsHelp: string;
  voiceCommandNavigate: string;
  voiceCommandMeds: string;
  voiceCommandExercise: string;
  voiceCommandReminder: string;
  voiceAudioFeedback: string;
  voiceAssistantAccessible: string;
  
  // HIPAA & Security
  hipaaCompliant: string;
  encryptionBadge: string;
  maskSensitiveData: string;
  unmaskSensitiveData: string;
  auditTrailTitle: string;
  
  // Offline
  offlineMode: string;
  onlineMode: string;
  offlineMessage: string;
  
  // Common
  save: string;
  cancel: string;
  close: string;
  getStarted: string;
  login: string;
  logout: string;
  darkMode: string;
  lightMode: string;
  language: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "RecoveryNav",
    appSubtitle: "Your Intelligent Post-Hospital Recovery Navigator",
    tagline: "Your Recovery Journey, Simplified.",
    searchPlaceholder: "Search symptoms, medications, exercises, or ask voice assistant...",
    heroWelcome: "Welcome to RecoveryNav",
    heroSubtitle: "Understand your discharge plan. Track medications, physical therapy, and appointments seamlessly.",
    trustedBadge: "Clinical Accuracy",
    simpleBadge: "Simple Explanations",
    aiBadge: "AI-Powered Guidance",
    askHealthPrompt: "Ask anything about your recovery or medication...",
    exploreFeatures: "Recovery & Care Features",
    viewAll: "View All",
    
    navHome: "Home",
    navAskAI: "Ask AI Assistant",
    navSymptomGuide: "Symptom Guide",
    navHealthLibrary: "Personalized Recovery Planning",
    navMedicineInfo: "Medication Manager",
    navUploadReport: "Upload Discharge Report",
    navWellnessHub: "Therapy & Wellness Hub",
    navFindHealthcare: "Find Follow-Up Care",
    navEmergencyHelp: "Emergency Help",
    navSaved: "Saved Instructions",
    navMyChats: "Consultation History",
    navSettings: "Settings & Privacy",
    navDatabaseApi: "Database & API Architecture",
    navAuditLogs: "HIPAA Audit Trail",
    
    quickActions: "Quick Actions",
    bookmarkedArticles: "Saved Instructions",
    viewMyChats: "Consultation History",
    myReports: "Discharge Summaries",
    inAnEmergency: "In an Emergency?",
    emergencyDesc: "If you experience severe chest pain, shortness of breath, or bleeding, seek immediate medical care.",
    callEmergencyBtn: "Call Emergency (112 / 911)",
    quoteRight: "“A healthier you builds a brighter tomorrow.”",
    quoteBottom: "“Health is not just the absence of illness, but a step towards a better life.”",
    smallStepsHeader: "Small Steps, Big Results",
    smallStepsSub: "Take prescribed medicines • Gentle mobility • Hydrate well • Rest & stay positive",
    
    recoveryDashboard: "Recovery Dashboard",
    goodMorning: "Good Morning 👋",
    recoveryProgress: "Recovery Progress",
    keepFollowing: "Keep following your personalized recovery plan",
    medicinesCount: "3 Today",
    tasksCount: "4 Today",
    todaysRecovery: "Today's Recovery",
    medicationLabel: "Medication",
    takePrescribed: "Take prescribed medicine on schedule",
    lightActivityLabel: "Physical Therapy",
    lightActivityDesc: "15 min gentle walking & deep breathing",
    hydrationLabel: "Hydration Target",
    hydrationDesc: "Drink 2.0 Liters of water throughout the day",
    
    featAskAITitle: "Ask AI Assistant",
    featAskAIDesc: "Instant answers regarding your post-surgery instructions, dosages, and safe activities.",
    featAskAIAction: "Start Chatting →",
    featSymptomTitle: "Symptom Guide & Red Flags",
    featSymptomDesc: "Evaluate recovery symptoms, detect warning signs, and know when to notify your doctor.",
    featSymptomAction: "Check Symptoms →",
    featLibraryTitle: "Recovery Library",
    featLibraryDesc: "Clear guides on surgical wound care, diet modifications, and mobility guidelines.",
    featLibraryAction: "Browse Guides →",
    featMedicineTitle: "Medication Tracker",
    featMedicineDesc: "Organize dosage schedules, track taken doses, food instructions, and contraindications.",
    featMedicineAction: "Manage Medicines →",
    featUploadTitle: "Upload Discharge Summary",
    featUploadDesc: "AI OCR scans hospital discharge letters and extracts structured recovery timelines.",
    featUploadAction: "Scan Document →",
    featWellnessTitle: "Physical Therapy Hub",
    featWellnessDesc: "Track daily rehabilitation exercises, breathwork, pain logs, and mobility goals.",
    featWellnessAction: "View Exercises →",
    featFindTitle: "Follow-Up Appointments",
    featFindDesc: "Schedule doctor visits, set reminders, and sync directly with Google Calendar.",
    featFindAction: "View Schedule →",
    featEmergencyTitle: "Emergency & Red Flags",
    featEmergencyDesc: "Direct emergency dialer, warning signs checklist, and instant caregiver SOS notification.",
    featEmergencyAction: "Emergency Protocol →",

    medicationsTitle: "Prescribed Medication Schedule",
    exercisesTitle: "Physical Therapy & Rehabilitation",
    appointmentsTitle: "Doctor Follow-Up Schedule",
    conflictsTitle: "Document Inconsistencies & Safety Alerts",
    dischargeSummaryTitle: "Hospital Discharge Document",
    logAsTaken: "Mark as Taken",
    alreadyTaken: "Completed",
    startExercise: "Start Exercise",
    completeSet: "Mark Completed",
    addToGoogleCalendar: "Add to Google Calendar",
    syncToGoogleTasks: "Sync to Google Tasks",
    dischargeSurvey: "Post-Discharge Survey",
    
    voiceAssistantTitle: "Recovery Voice Assistant",
    voiceListening: "Listening... Speak your command",
    voiceSpeakNow: "Tap mic or say 'Open Medications', 'Take Metoprolol', 'Go to Appointments'",
    voiceCommandsHelp: "Voice Command Guide",
    voiceCommandNavigate: "“Go to medications” • “Show exercises” • “Open scanner”",
    voiceCommandMeds: "“Mark aspirin as taken” • “What medicines do I have tonight?”",
    voiceCommandExercise: "“Start breathing exercise” • “Show my appointments”",
    voiceCommandReminder: "“Set reminder for 8 PM pill” • “Emergency help”",
    voiceAudioFeedback: "Clear Audio Feedback Active",
    voiceAssistantAccessible: "Voice Navigation Ready (EN / HI / GU)",
    
    hipaaCompliant: "HIPAA Compliant & AES-256 Encrypted",
    encryptionBadge: "Sensitive Patient Data Encrypted",
    maskSensitiveData: "Mask PII",
    unmaskSensitiveData: "Reveal PII (PIN Verified)",
    auditTrailTitle: "Real-time Access Audit Trail",
    
    offlineMode: "Offline Mode Active (Cached Data)",
    onlineMode: "Online & Synced",
    offlineMessage: "You are offline. Your medications, exercises, and emergency contacts remain fully accessible.",
    
    save: "Save Changes",
    cancel: "Cancel",
    close: "Close",
    getStarted: "Get Started",
    login: "Login / Sign In",
    logout: "Sign Out",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
  },
  hi: {
    appName: "रिकवरीनेव (RecoveryNav)",
    appSubtitle: "आपका बुद्धिमान अस्पताल डिस्चार्ज रिकवरी साथी",
    tagline: "आपकी स्वस्थ होने की यात्रा, अब और भी आसान।",
    searchPlaceholder: "लक्षण, दवाएं, व्यायाम खोजें या वॉयस असिस्टेंट से पूछें...",
    heroWelcome: "रिकवरीनेव में आपका स्वागत है",
    heroSubtitle: "अपने डिस्चार्ज निर्देशों को समझें। दवाएं, फिजियोथेरेपी व्यायाम और डॉक्टर अपॉइंटमेंट आसानी से ट्रैक करें।",
    trustedBadge: "चिकित्सीय रूप से प्रमाणित",
    simpleBadge: "सरल भाषा में जानकारी",
    aiBadge: "AI-संचालित सहायता",
    askHealthPrompt: "अपनी रिकवरी या दवाओं के बारे में कुछ भी पूछें...",
    exploreFeatures: "उपलब्ध सेवाएं एवं सुविधाएं",
    viewAll: "सभी देखें",
    
    navHome: "होम",
    navAskAI: "AI सहायक से पूछें",
    navSymptomGuide: "लक्षण मार्गदर्शिका",
    navHealthLibrary: "व्यक्तिगत रिकवरी योजना",
    navMedicineInfo: "दवा प्रबंधन",
    navUploadReport: "डिस्चार्ज रिपोर्ट अपलोड करें",
    navWellnessHub: "थेरेपी और वेलनेस हब",
    navFindHealthcare: "फॉलो-अप अपॉइंटमेंट",
    navEmergencyHelp: "आपातकालीन सहायता",
    navSaved: "सहेजे गए निर्देश",
    navMyChats: "परामर्श इतिहास",
    navSettings: "सेटिंग्स और गोपनीयता",
    navDatabaseApi: "डेटाबेस और API आर्किटेक्चर",
    navAuditLogs: "HIPAA ऑडिट लॉग",
    
    quickActions: "त्वरित क्रियाएं",
    bookmarkedArticles: "सहेजे गए निर्देश",
    viewMyChats: "परामर्श इतिहास",
    myReports: "मेरी डिस्चार्ज रिपोर्ट्स",
    inAnEmergency: "क्या यह कोई आपात स्थिति है?",
    emergencyDesc: "यदि आपको सीने में तेज दर्द, सांस लेने में अत्यधिक तकलीफ या रक्तस्राव हो, तो तुरंत आपातकालीन सहायता लें।",
    callEmergencyBtn: "आपातकालीन कॉल (112 पर कॉल करें)",
    quoteRight: "“एक स्वस्थ आप एक बेहतर कल का निर्माण करता है।”",
    quoteBottom: "“स्वास्थ्य केवल बीमारी की अनुपस्थिति नहीं, बल्कि बेहतर जीवन की ओर एक कदम है।”",
    smallStepsHeader: "छोटे कदम, बड़े परिणाम",
    smallStepsSub: "समय पर दवा लें • हल्का व्यायाम करें • पर्याप्त पानी पिएं • सकारात्मक रहें",
    
    recoveryDashboard: "रिकवरी डैशबोर्ड",
    goodMorning: "शुभ प्रभात 👋",
    recoveryProgress: "रिकवरी प्रगति",
    keepFollowing: "अपनी व्यक्तिगत देखभाल योजना का पालन जारी रखें",
    medicinesCount: "आज 3 खुराक",
    tasksCount: "आज 4 कार्य",
    todaysRecovery: "आज की रिकवरी सूची",
    medicationLabel: "दवाएं",
    takePrescribed: "निर्धारित समय पर दवा लें",
    lightActivityLabel: "फिजियोथेरेपी",
    lightActivityDesc: "15 मिनट की धीमी सैर और गहरी सांस का व्यायाम",
    hydrationLabel: "जलयोजन (पानी का लक्ष्य)",
    hydrationDesc: "दिनभर में 2.0 लीटर पानी पिएं",
    
    featAskAITitle: "AI सहायक से पूछें",
    featAskAIDesc: "सर्जरी के बाद के निर्देश, दवाओं की खुराक और सुरक्षित गतिविधियों के बारे में तुरंत उत्तर पाएं।",
    featAskAIAction: "बातचीत शुरू करें →",
    featSymptomTitle: "लक्षण एवं चेतावनी संकेत",
    featSymptomDesc: "लक्षणों का मूल्यांकन करें, खतरे के संकेत पहचानें और डॉक्टर से संपर्क कब करना है जानें।",
    featSymptomAction: "लक्षण जांचें →",
    featLibraryTitle: "स्वास्थ्य पुस्तकालय",
    featLibraryDesc: "घाव की देखभाल, अनुशंसित आहार और गतिशीलता पर स्पष्ट मार्गदर्शन।",
    featLibraryAction: "पुस्तकालय देखें →",
    featMedicineTitle: "दवा ट्रैकर",
    featMedicineDesc: "दवाओं के समय, खुराक, भोजन संबंधी सावधानियां और परस्पर विरोधी प्रभावों की जांच करें।",
    featMedicineAction: "दवाएं प्रबंधित करें →",
    featUploadTitle: "डिस्चार्ज समरी अपलोड",
    featUploadDesc: "AI OCR तकनीक अस्पताल के पर्चों को स्कैन करके स्पष्ट रिकवरी योजना बनाती है।",
    featUploadAction: "दस्तावेज़ स्कैन करें →",
    featWellnessTitle: "फिजियोथेरेपी हब",
    featWellnessDesc: "पुनर्वास व्यायाम, श्वास तकनीक और दैनिक गतिविधि लक्ष्यों को ट्रैक करें।",
    featWellnessAction: "व्यायाम देखें →",
    featFindTitle: "फॉलो-अप अपॉइंटमेंट",
    featFindDesc: "डॉक्टर से मिलने का समय निर्धारित करें और गूगल कैलेंडर के साथ सिंक करें।",
    featFindAction: "शेड्यूल देखें →",
    featEmergencyTitle: "आपातकालीन सहायता",
    featEmergencyDesc: "एक-क्लिक कॉल, चेतावनी संकेत सूची और देखभालकर्ता को तुरंत अलर्ट संदेश।",
    featEmergencyAction: "आपातकालीन गाइड →",

    medicationsTitle: "निर्धारित दवा कार्यक्रम",
    exercisesTitle: "फिजियोथेरेपी और पुनर्वास",
    appointmentsTitle: "डॉक्टर फॉलो-अप कार्यक्रम",
    conflictsTitle: "दस्तावेज़ विसंगतियां और सुरक्षा अलर्ट",
    dischargeSummaryTitle: "अस्पताल डिस्चार्ज सारांश",
    logAsTaken: "दवा ली गई दर्ज करें",
    alreadyTaken: "पूर्ण हुआ",
    startExercise: "व्यायाम शुरू करें",
    completeSet: "पूर्ण चिह्नित करें",
    addToGoogleCalendar: "गूगल कैलेंडर में जोड़ें",
    syncToGoogleTasks: "गूगल टास्क्स में सिंक करें",
    dischargeSurvey: "डिस्चार्ज के बाद का फीडबैक",
    
    voiceAssistantTitle: "वॉयस असिस्टेंट (बोलकर चलाएं)",
    voiceListening: "सुन रहा हूँ... अपना आदेश बोलें",
    voiceSpeakNow: "माइक दबाएं या बोलें 'दवाएं दिखाओ', 'व्यायाम शुरू करो', 'अपॉइंटमेंट खोलो'",
    voiceCommandsHelp: "वॉयस कमांड गाइड",
    voiceCommandNavigate: "“दवाओं पर जाओ” • “व्यायाम दिखाओ” • “स्कैनर खोलो”",
    voiceCommandMeds: "“एस्पिरिन दवा ली गई” • “आज रात की दवाएं क्या हैं?”",
    voiceCommandExercise: "“सांस का व्यायाम शुरू करो” • “अपॉइंटमेंट दिखाओ”",
    voiceCommandReminder: "“शाम की दवा का रिमाइंडर लगाओ” • “आपातकालीन मदद”",
    voiceAudioFeedback: "स्पष्ट ऑडियो फीडबैक चालू है",
    voiceAssistantAccessible: "वॉयस नेविगेशन उपलब्ध (हिंदी / गुजराती / अंग्रेजी)",
    
    hipaaCompliant: "HIPAA अनुपालित और AES-256 एन्क्रिप्टेड",
    encryptionBadge: "संवेदनशील रोगी डेटा सुरक्षित एन्क्रिप्टेड है",
    maskSensitiveData: "डेटा छिपाएं",
    unmaskSensitiveData: "डेटा दिखाएं (PIN सत्यापित)",
    auditTrailTitle: "रीयल-टाइम सुरक्षा ऑडिट ट्रेल",
    
    offlineMode: "ऑफलाइन मोड सक्रिय (कैश डेटा)",
    onlineMode: "ऑनलाइन और सिंक किया गया",
    offlineMessage: "आप ऑफलाइन हैं। आपकी दवाएं, व्यायाम और आपातकालीन संपर्क पूरी तरह सुरक्षित उपलब्ध हैं।",
    
    save: "सहेजें",
    cancel: "रद्द करें",
    close: "बंद करें",
    getStarted: "शुरू करें",
    login: "लॉग इन करें",
    logout: "लॉग आउट",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    language: "भाषा (Language)",
  },
  gu: {
    appName: "રીકવરીનેવ (RecoveryNav)",
    appSubtitle: "તમારો સ્માર્ટ હોસ્પિટલ ડિસ્ચાર્જ રીકવરી ગાઈડ",
    tagline: "તમારી સાજા થવાની સફર, હવે વધુ સરળ.",
    searchPlaceholder: "લક્ષણો, દવાઓ, કસરતો શોધો અથવા વોઇસ આસિસ્ટન્ટને પૂછો...",
    heroWelcome: "રીકવરીનેવ માં આપનું સ્વાગત છે",
    heroSubtitle: "હોસ્પિટલ ડિસ્ચાર્જના સૂચનો સરળતાથી સમજો. દવાઓ, ફિઝિયોથેરાપી કસરતો અને ફોલો-અપ મુલાકાતો સરળતાથી ટ્રેક કરો.",
    trustedBadge: "તબીબી રીતે ચકાસાયેલ",
    simpleBadge: "સરળ ભાષામાં માર્ગદર્શન",
    aiBadge: "AI-આધારિત સપોર્ટ",
    askHealthPrompt: "તમારી તબિયત અથવા દવાઓ વિશે કંઈપણ પૂછો...",
    exploreFeatures: "સેવાઓ અને વિશેષતાઓ",
    viewAll: "બધું જુઓ",
    
    navHome: "હોમ (મુખ્ય પૃષ્ઠ)",
    navAskAI: "AI સહાયકને પૂછો",
    navSymptomGuide: "લક્ષણ માર્ગદર્શિકા",
    navHealthLibrary: "વ્યક્તિગત રિકવરી આયોજન",
    navMedicineInfo: "દવા વ્યવસ્થાપન",
    navUploadReport: "ડિસ્ચાર્જ રિપોર્ટ અપલોડ કરો",
    navWellnessHub: "થેરાપી અને વેલનેસ હબ",
    navFindHealthcare: "ફોલો-અપ મુલાકાત",
    navEmergencyHelp: "ઇમરજન્સી સહાય",
    navSaved: "સાચવેલ સૂચનાઓ",
    navMyChats: "વાતચીત ઇતિહાસ",
    navSettings: "સેટિંગ્સ અને ગોપનીયતા",
    navDatabaseApi: "ડેટાબેઝ અને API આર્કિટેક્ચર",
    navAuditLogs: "HIPAA ઓડિટ લોગ્સ",
    
    quickActions: "ઝડપી ક્રિયાઓ",
    bookmarkedArticles: "સાચવેલ સૂચનાઓ",
    viewMyChats: "પરામર્શ ઇતિહાસ",
    myReports: "મારા ડિસ્ચાર્જ રિપોર્ટ્સ",
    inAnEmergency: "શું કોઈ કટોકટી છે?",
    emergencyDesc: "જો તમને છાતીમાં તીવ્ર દુખાવો, શ્વાસ લેવામાં તકલીફ અથવા રક્તસ્રાવ થાય, તો તરત જ ડૉક્ટરની મદદ લો.",
    callEmergencyBtn: "ઇમરજન્સી કૉલ (112 પર કૉલ કરો)",
    quoteRight: "“તંદુરસ્ત તમે, ઉજ્જવળ આવતીકાલનું નિર્માણ કરો છો.”",
    quoteBottom: "“આરોગ્ય એ માત્ર રોગની ગેરહાજરી નથી, પરંતુ વધુ સારા જીવન તરફનું એક પગલું છે.”",
    smallStepsHeader: "નાના પગલાં, મોટા પરિણામો",
    smallStepsSub: "યોગ્ય સમયે દવા લો • હળવી કસરત કરો • પૂરતું પાણી પીવો • સકારાત્મક રહો",
    
    recoveryDashboard: "રીકવરી ડેશબોર્ડ",
    goodMorning: "શુભ પ્રભાત 👋",
    recoveryProgress: "રીકવરી પ્રગતિ",
    keepFollowing: "તમારા અંગત રિકવરી પ્લાનને અનુસરતા રહો",
    medicinesCount: "આજે 3 દવાઓ",
    tasksCount: "આજે 4 કાર્યો",
    todaysRecovery: "આજની રીકવરી યાદી",
    medicationLabel: "દવાઓ",
    takePrescribed: "સમયસર નિયત દવા લો",
    lightActivityLabel: "ફિઝિયોથેરાપી",
    lightActivityDesc: "15 મિનિટ ધીમું ચાલવું અને ઊંડા શ્વાસની કસરત",
    hydrationLabel: "પાણીનું લક્ષ્ય",
    hydrationDesc: "આખો દિવસ મળીને 2.0 લિટર પાણી પીવો",
    
    featAskAITitle: "AI સહાયકને પૂછો",
    featAskAIDesc: "ઓપરેશન પછીની કાળજી, દવાની માત્રા અને સુરક્ષિત પ્રવૃત્તિઓ અંગે ત્વરિત ઉત્તરો મેળવો.",
    featAskAIAction: "ચેટ શરૂ કરો →",
    featSymptomTitle: "લક્ષણો અને ચેતવણી સંકેતો",
    featSymptomDesc: "લક્ષણોનું મૂલ્યાંકન કરો, ભયજનક ચિહ્નો ઓળખો અને ડૉક્ટરનો ક્યારે સંપર્ક કરવો તે જાણો.",
    featSymptomAction: "લક્ષણો તપાસો →",
    featLibraryTitle: "આરોગ્ય પુસ્તકાલય",
    featLibraryDesc: "ટાંકા/ઘાની કાળજી, પથ્ય આહાર અને હલનચલન અંગે સ્પષ્ટ માર્ગદર્શન મેળવો.",
    featLibraryAction: "પુસ્તકાલય જુઓ →",
    featMedicineTitle: "દવા ટ્રેકર",
    featMedicineDesc: "દવાના સમય, ખોરાક સાથેની સૂચનાઓ અને આડઅસરો વિશે સંપૂર્ણ માહિતી મેળવો.",
    featMedicineAction: "દવાઓ જુઓ →",
    featUploadTitle: "ડિસ્ચાર્જ સમરી સ્કેન",
    featUploadDesc: "AI OCR હોસ્પિટલના કાગળો સ્કેન કરીને ક્રમબદ્ધ રિકવરી સમયરેખા તૈયાર કરે છે.",
    featUploadAction: "દસ્તાવેજ સ્કેન કરો →",
    featWellnessTitle: "ફિઝિયોથેરાપી કેન્દ્ર",
    featWellnessDesc: "પુનર્વસન કસરતો, શ્વાસોચ્છવાસની રીતો અને રોજના લક્ષ્યાંકો ટ્રેક કરો.",
    featWellnessAction: "કસરતો જુઓ →",
    featFindTitle: "ફોલો-અપ મુલાકાતો",
    featFindDesc: "ડૉક્ટર સાથે મુલાકાત ગોઠવો અને ગૂગલ કેલેન્ડર સાથે આપોઆપ જોડો.",
    featFindAction: "સમયપત્રક જુઓ →",
    featEmergencyTitle: "ઇમરજન્સી સહાય",
    featEmergencyDesc: "એક-ક્લિક કટોકટી કૉલ, ભયજનક સંકેતોની યાદી અને પરિવારજનને ત્વરિત SOS સંદેશ.",
    featEmergencyAction: "ઇમરજન્સી ગાઈડ →",

    medicationsTitle: "નિયત દવાનું સમયપત્રક",
    exercisesTitle: "ફિઝિયોથેરાપી અને પુનર્વસન",
    appointmentsTitle: "ડૉક્ટર ફોલો-અપ મુલાકાતો",
    conflictsTitle: "દસ્તાવેજ વિસંગતતા અને સલામતી ચેતવણી",
    dischargeSummaryTitle: "હોસ્પિટલ ડિસ્ચાર્જ સમરી",
    logAsTaken: "દવા લેવાઈ ગઈ",
    alreadyTaken: "પૂર્ણ થયું",
    startExercise: "કસરત શરૂ કરો",
    completeSet: "પૂર્ણ માર્ક કરો",
    addToGoogleCalendar: "ગૂગલ કેલેન્ડરમાં ઉમેરો",
    syncToGoogleTasks: "ગૂગલ ટાસ્ક્સમાં ઉમેરો",
    dischargeSurvey: "ડિસ્ચાર્જ પછીનો પ્રતિસાદ",
    
    voiceAssistantTitle: "વોઇસ આસિસ્ટન્ટ (બોલીને ચલાવો)",
    voiceListening: "સાંભળી રહ્યું છે... તમારો આદેશ બોલો",
    voiceSpeakNow: "માઇક દબાવો અથવા બોલો 'દવાઓ બતાવો', 'કસરત શરૂ કરો', 'એપોઇન્ટમેન્ટ ખોલો'",
    voiceCommandsHelp: "વોઇસ કમાન્ડ માર્ગદર્શિકા",
    voiceCommandNavigate: "“દવાઓ પર જાઓ” • “કસરતો બતાવો” • “સ્કેનર ખોલો”",
    voiceCommandMeds: "“એસ્પિરિન દવા લીધી” • “આજ રાતની દવાઓ કઈ છે?”",
    voiceCommandExercise: "“શ્વાસની કસરત શરૂ કરો” • “એપોઇન્ટમેન્ટ બતાવો”",
    voiceCommandReminder: "“સાંજની દવાનું રીમાઇન્ડર મુકો” • “ઇમરજન્સી મદદ”",
    voiceAudioFeedback: "સ્પષ્ટ ઑડિઓ પ્રતિસાદ સક્રિય છે",
    voiceAssistantAccessible: "વોઇસ નેવિગેશન ઉપલબ્ધ (ગુજરાતી / હિન્દી / અંગ્રેજી)",
    
    hipaaCompliant: "HIPAA અનુપાલિત અને AES-256 એન્ક્રિપ્ટેડ",
    encryptionBadge: "સંવેદનશીલ દર્દી ડેટા સંપૂર્ણ સુરક્ષિત એન્ક્રિપ્ટેડ છે",
    maskSensitiveData: "ડેટા છુપાવો",
    unmaskSensitiveData: "ડેટા બતાવો (PIN ચકાસાયેલ)",
    auditTrailTitle: "રીયલ-ટાઇમ સુરક્ષા ઓડિટ ટ્રેલ",
    
    offlineMode: "ઑફલાઇન મોડ સક્રિય (કેશ્ડ ડેટા)",
    onlineMode: "ઑનલાઇન અને સિંક થયેલ",
    offlineMessage: "તમે ઑફલાઇન છો. તમારી દવાઓ, કસરતો અને ઇમરજન્સી સંપર્કો સંપૂર્ણપણે ઉપલબ્ધ છે.",
    
    save: "સાચવો",
    cancel: "રદ કરો",
    close: "બંધ કરો",
    getStarted: "શરૂ કરો",
    login: "લૉગ ઇન કરો",
    logout: "લૉગ આઉટ",
    darkMode: "ડાર્ક મોડ",
    lightMode: "લાઇટ મોડ",
    language: "ભાષા (Language)",
  }
};
