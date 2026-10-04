import React, { useState } from 'react';
import {
  Heart,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  FileBadge,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Mic,
  Pill,
  Activity,
} from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../locales/translations';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  currentUser: User;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenVoiceAssistant: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  currentUser,
  currentLanguage,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  onOpenVoiceAssistant,
}) => {
  const t = translations[currentLanguage];

  // Form Fields allowing user to enter or edit their exact details
  const [fullName, setFullName] = useState(currentUser.full_name || 'Niti Viramgama');
  const [email, setEmail] = useState(currentUser.email || 'NitiViramgama@gmail.com');
  const [mrn, setMrn] = useState(currentUser.mrn || 'MRN-7849201');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98250 12345');
  const [password, setPassword] = useState('••••••••');
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  ];

  // Multilingual content for Login screen
  const loginCopy = {
    en: {
      home: 'Home',
      howItWorks: 'How It Works',
      features: 'Features',
      about: 'About',
      voiceAssistant: 'Voice Assistant',
      aiRecoveryBadge: 'AI-Assisted Recovery Support',
      heroDescription:
        'Turn complex hospital discharge instructions into a clear, personalized and easy-to-follow recovery plan with smart medication schedules, physical therapy tracking, and voice support.',
      heroSubNote: 'Designed to help patients understand and organize their recovery instructions.',
      medsToday: '3 Medicines Today',
      tasksToday: '4 Therapy Tasks',
      cardTitle: 'Patient & Caregiver Sign In',
      cardSubtitle: 'Enter your name and details below to personalize your recovery plan.',
      demoTab: 'Niti Viramgama (Sample)',
      customTab: 'Custom Patient Entry',
      googleBtn: 'Continue with Google',
      orDivider: 'or enter patient details',
      nameLabel: 'Patient Full Name',
      namePlaceholder: 'e.g. Niti Viramgama',
      emailLabel: 'Email Address',
      emailPlaceholder: 'e.g. NitiViramgama@gmail.com',
      mrnLabel: 'Hospital MRN',
      phoneLabel: 'Phone Number',
      pinLabel: 'Security PIN / Password',
      entering: 'Entering RecoveryNav...',
      enterBtn: (name: string) => `Enter as ${name || 'Patient'}`,
      encryptedSession: (name: string) => `Encrypted Session • Ready for ${name || 'Patient'}`,
    },
    hi: {
      home: 'होम',
      howItWorks: 'यह कैसे काम करता है',
      features: 'सुविधाएं',
      about: 'हमारे बारे में',
      voiceAssistant: 'वॉयस असिस्टेंट',
      aiRecoveryBadge: 'AI-सहायित रिकवरी सहायता',
      heroDescription:
        'अस्पताल के जटिल डिस्चार्ज निर्देशों को एक स्पष्ट, व्यक्तिगत और पालन करने में आसान रिकवरी योजना में बदलें—स्मार्ट दवा कार्यक्रम, फिजियोथेरेपी ट्रैकिंग और वॉयस सहायता के साथ।',
      heroSubNote: 'मरीजों को अपने डिस्चार्ज निर्देशों को समझने और व्यवस्थित करने में मदद करने के लिए डिज़ाइन किया गया।',
      medsToday: 'आज 3 दवाएं',
      tasksToday: 'आज 4 थेरेपी कार्य',
      cardTitle: 'रोगी एवं देखभालकर्ता साइन इन',
      cardSubtitle: 'अपनी व्यक्तिगत रिकवरी योजना शुरू करने के लिए नीचे अपना नाम और विवरण दर्ज करें।',
      demoTab: 'नीति वीरमगामा (नमूना)',
      customTab: 'नया मरीज / अपना विवरण भरें',
      googleBtn: 'गूगल (Google) के साथ आगे बढ़ें',
      orDivider: 'या नीचे मरीज का विवरण दर्ज करें',
      nameLabel: 'मरीज का पूरा नाम',
      namePlaceholder: 'उदा. नीति वीरमगामा',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'उदा. NitiViramgama@gmail.com',
      mrnLabel: 'अस्पताल MRN नंबर',
      phoneLabel: 'फ़ोन नंबर',
      pinLabel: 'सुरक्षा पिन / पासवर्ड',
      entering: 'रिकवरीनेव शुरू हो रहा है...',
      enterBtn: (name: string) => `${name || 'मरीज'} के रूप में प्रवेश करें`,
      encryptedSession: (name: string) => `एन्क्रिप्टेड सत्र • ${name || 'मरीज'} के लिए तैयार`,
    },
    gu: {
      home: 'હોમ',
      howItWorks: 'આ કેવી રીતે કાર્ય કરે છે',
      features: 'સેવાઓ',
      about: 'અમારા વિશે',
      voiceAssistant: 'વોઇસ આસિસ્ટન્ટ',
      aiRecoveryBadge: 'AI-સહાયિત રિકવરી માર્ગદર્શન',
      heroDescription:
        'હોસ્પિટલ ડિસ્ચાર્જના અટપટા સૂચનોને સ્પષ્ટ, વ્યક્તિગત અને સરળ રિકવરી પ્લાનમાં ફેરવો—સ્માર્ટ દવાનું સમયપત્રક, ફિઝિયોથેરાપી ટ્રેકિંગ અને વોઇસ સહાય સાથે.',
      heroSubNote: 'દર્દીઓને તેમના ડિસ્ચાર્જ સૂચનો સમજવા અને દિનચર્યા ગોઠવવા માટે રચાયેલ.',
      medsToday: 'આજે 3 દવાઓ',
      tasksToday: 'આજે 4 થેરાપી કાર્યો',
      cardTitle: 'દર્દી અને સંભાળકર્તા લૉગ ઇન',
      cardSubtitle: 'તમારા અંગત રિકવરી પ્લાનની શરૂઆત કરવા માટે નીચે તમારું નામ અને વિગતો દાખલ કરો.',
      demoTab: 'નીતિ વીરમગામા (નમૂનો)',
      customTab: 'નવા દર્દી / પોતાની વિગત ભરો',
      googleBtn: 'Google સાથે આગળ વધો',
      orDivider: 'અથવા નીચે દર્દીની વિગતો દાખલ કરો',
      nameLabel: 'દર્દીનું પૂરું નામ',
      namePlaceholder: 'દા.ત. નીતિ વીરમગામા',
      emailLabel: 'ઇમેઇલ સરનામું',
      emailPlaceholder: 'દા.ત. NitiViramgama@gmail.com',
      mrnLabel: 'હોસ્પિટલ MRN નંબર',
      phoneLabel: 'ફોન નંબર',
      pinLabel: 'સિક્યુરિટી પિન / પાસવર્ડ',
      entering: 'રીકવરીનેવ શરૂ થઈ રહ્યું છે...',
      enterBtn: (name: string) => `${name || 'દર્દી'} તરીકે પ્રવેશ કરો`,
      encryptedSession: (name: string) => `એન્ક્રિપ્ટેડ સત્ર • ${name || 'દર્દી'} માટે તૈયાર`,
    },
  }[currentLanguage] || {
    home: 'Home',
    howItWorks: 'How It Works',
    features: 'Features',
    about: 'About',
    voiceAssistant: 'Voice Assistant',
    aiRecoveryBadge: 'AI-Assisted Recovery Support',
    heroDescription:
      'Turn complex hospital discharge instructions into a clear, personalized and easy-to-follow recovery plan with smart medication schedules, physical therapy tracking, and voice support.',
    heroSubNote: 'Designed to help patients understand and organize their recovery instructions.',
    medsToday: '3 Medicines Today',
    tasksToday: '4 Therapy Tasks',
    cardTitle: 'Patient & Caregiver Sign In',
    cardSubtitle: 'Enter your name and details below to personalize your recovery plan.',
    demoTab: 'Niti Viramgama (Sample)',
    customTab: 'Custom Patient Entry',
    googleBtn: 'Continue with Google',
    orDivider: 'or enter patient details',
    nameLabel: 'Patient Full Name',
    namePlaceholder: 'e.g. Niti Viramgama',
    emailLabel: 'Email Address',
    emailPlaceholder: 'e.g. NitiViramgama@gmail.com',
    mrnLabel: 'Hospital MRN',
    phoneLabel: 'Phone Number',
    pinLabel: 'Security PIN / Password',
    entering: 'Entering RecoveryNav...',
    enterBtn: (name: string) => `Enter as ${name || 'Patient'}`,
    encryptedSession: (name: string) => `Encrypted Session • Ready for ${name || 'Patient'}`,
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const validName = fullName.trim() || 'Patient';
    const validEmail = email.trim() || 'patient@example.com';
    const validMrn = mrn.trim() || `MRN-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const validPhone = phone.trim() || '+91 98250 12345';

    const updatedUser: User = {
      ...currentUser,
      id: `usr_${validName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      full_name: validName,
      email: validEmail,
      mrn: validMrn,
      phone: validPhone,
      is_verified: true,
    };

    setTimeout(() => {
      setIsLoading(false);
      onLogin(updatedUser);
    }, 350);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    const updatedUser: User = {
      ...currentUser,
      full_name: fullName.trim() || 'Niti Viramgama',
      email: email.trim() || 'NitiViramgama@gmail.com',
      mrn: mrn.trim() || 'MRN-7849201',
      phone: phone.trim() || '+91 98250 12345',
      is_verified: true,
    };

    setTimeout(() => {
      setIsLoading(false);
      onLogin(updatedUser);
    }, 300);
  };

  const handleResetForCustomEntry = () => {
    setIsNewPatient(true);
    setFullName('');
    setEmail('');
    setMrn('');
    setPhone('');
    setPassword('');
  };

  const handleLoadDemoPatient = () => {
    setIsNewPatient(false);
    setFullName('Niti Viramgama');
    setEmail('NitiViramgama@gmail.com');
    setMrn('MRN-7849201');
    setPhone('+91 98250 12345');
    setPassword('••••••••');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Recovery<span className="text-teal-600 dark:text-teal-400">Nav</span>
            </span>
          </div>
        </div>

        {/* Center Links (Localized) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <span className="text-teal-600 dark:text-teal-400 cursor-pointer">{loginCopy.home}</span>
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">{loginCopy.howItWorks}</span>
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">{loginCopy.features}</span>
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">{loginCopy.about}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Voice Assistant Mic */}
          <button
            onClick={onOpenVoiceAssistant}
            title={t.voiceAssistantTitle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/70 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-medium text-xs sm:text-sm transition-all"
          >
            <Mic className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">{loginCopy.voiceAssistant}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{languages.find((l) => l.code === currentLanguage)?.label.split(' ')[0]}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between ${
                      currentLanguage === lang.code
                        ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>
                      {lang.flag} {lang.label}
                    </span>
                    {currentLanguage === lang.code && <span className="text-teal-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </nav>

      {/* Main Split Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Hero Section */}
        <div className="flex-1 max-w-xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loginCopy.aiRecoveryBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t.tagline}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            {loginCopy.heroDescription}
          </p>

          <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{loginCopy.heroSubNote}</span>
          </div>

          {/* Live Preview Card */}
          <div className="hidden sm:block p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md max-w-md mx-auto lg:mx-0 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                {t.recoveryDashboard}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {t.goodMorning}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-500">{t.recoveryProgress}</span>
                <span className="text-sm font-extrabold text-teal-600">72%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-teal-600 w-[72%] rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>{loginCopy.medsToday}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>{loginCopy.tasksToday}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Interactive Patient Sign In & Details Entry */}
        <div className="w-full max-w-md">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-600/20">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {loginCopy.cardTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {loginCopy.cardSubtitle}
              </p>
            </div>

            {/* Quick Demo Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs">
              <button
                type="button"
                onClick={handleLoadDemoPatient}
                className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-colors ${
                  !isNewPatient
                    ? 'bg-white dark:bg-slate-900 text-teal-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {loginCopy.demoTab}
              </button>
              <button
                type="button"
                onClick={handleResetForCustomEntry}
                className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition-colors ${
                  isNewPatient
                    ? 'bg-white dark:bg-slate-900 text-teal-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {loginCopy.customTab}
              </button>
            </div>

            {/* Official Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{loginCopy.googleBtn}</span>
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span>{loginCopy.orDivider}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Dynamic Patient Input Form */}
            <form onSubmit={handleSignIn} className="space-y-3 text-xs">
              {/* Full Name */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {loginCopy.nameLabel}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={loginCopy.namePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {loginCopy.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder={loginCopy.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Grid: MRN & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {loginCopy.mrnLabel}
                  </label>
                  <div className="relative">
                    <FileBadge className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="MRN-7849201"
                      value={mrn}
                      onChange={(e) => setMrn(e.target.value)}
                      className="w-full pl-9 pr-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    {loginCopy.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="+91 98250 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Password / PIN */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {loginCopy.pinLabel}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>
              </div>

              {/* Dynamic Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>
                  {isLoading
                    ? loginCopy.entering
                    : loginCopy.enterBtn(fullName.trim())}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-1 text-center">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>{loginCopy.encryptedSession(fullName.split(' ')[0])}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
