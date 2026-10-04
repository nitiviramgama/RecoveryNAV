import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Volume2,
  Mic,
  Bot,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { Language, User, Medication, PhysicalTherapyExercise } from '../types';
import { translations } from '../locales/translations';
import { askRecoveryAIAssistant, textToSpeechAudio } from '../services/geminiClient';
import { voiceAssistant } from '../services/voiceAssistant';

interface AskAIAssistantProps {
  user: User;
  currentLanguage: Language;
  medications: Medication[];
  exercises: PhysicalTherapyExercise[];
}

export const AskAIAssistant: React.FC<AskAIAssistantProps> = ({
  user,
  currentLanguage,
  medications,
  exercises,
}) => {
  const t = translations[currentLanguage];

  const getGreeting = (lang: Language, name: string) => {
    const firstName = name.split(' ')[0] || 'Patient';
    if (lang === 'hi') {
      return `नमस्ते ${firstName} जी! मैं आपका रिकवरी AI असिस्टेंट हूँ। आपकी सर्जरी के बाद दवाओं, फिजियोथेरेपी व्यायाम या आहार के बारे में कोई भी प्रश्न पूछें।`;
    }
    if (lang === 'gu') {
      return `નમસ્તે ${firstName}બેન! હું તમારો રિકવરી AI આસિસ્ટન્ટ છું. તમારી સર્જરી પછીની દવાઓ, કસરતો અથવા સાવચેતી વિશે કોઈ પણ સવાલ પૂછી શકો છો.`;
    }
    return `Hello ${firstName}! I am your RecoveryNav AI assistant. Feel free to ask me anything about your post-op medications, sternal precautions, spirometer exercises, or follow-up schedule.`;
  };

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    {
      role: 'model',
      content: getGreeting(currentLanguage, user.full_name),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically update conversation when language switches
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [{ role: 'model', content: getGreeting(currentLanguage, user.full_name) }];
      }
      const transitionNotice =
        currentLanguage === 'hi'
          ? '🇮🇳 [भाषा बदलकर हिन्दी कर दी गई है। अब हमारी बातचीत पूरी तरह हिन्दी में जारी रहेगी।]'
          : currentLanguage === 'gu'
          ? '🇮🇳 [ભાષા બદલીને ગુજરાતી કરવામાં આવી છે. હવે આપણી વાતચીત સંપૂર્ણ ગુજરાતીમાં ચાલુ રહેશે.]'
          : '🇬🇧 [Language switched to English. Our conversation will continue in English.]';
      return [...prev, { role: 'model', content: transitionNotice }];
    });
  }, [currentLanguage, user.full_name]);

  const suggestedQuestions = {
    en: [
      'Can I take Aspirin with my morning food?',
      'How many times per hour should I use the spirometer?',
      'When can I resume lifting heavy items?',
      'What are the warning signs of wound infection?',
    ],
    hi: [
      'क्या मैं एस्पिरिन नाश्ते के बाद ले सकती हूँ?',
      'स्पाइरोमीटर व्यायाम दिन में कितनी बार करना चाहिए?',
      'वजन उठाना कब से शुरू कर सकते हैं?',
      'घाव में इन्फेक्शन के क्या लक्षण होते हैं?',
    ],
    gu: [
      'શું હું એસ્પિરિન સવારના નાસ્તા સાથે લઈ શકું?',
      'સ્પાઇરોમીટર શ્વાસની કસરત કેટલી વાર કરવી જોઈએ?',
      'ભારે વજન ક્યારે ઉઠાવી શકાશે?',
      'ટાંકામાં ઇન્ફેક્શનના લક્ષણો કયા છે?',
    ],
  }[currentLanguage] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: query.trim() }];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const reply = await askRecoveryAIAssistant({
        messages: newMessages,
        userContext: {
          patientName: user.full_name,
          mrn: user.mrn,
          medications: medications.map((m) => `${m.name} ${m.dosage} (${m.frequency})`),
          exercises: exercises.map((e) => e.title),
        },
        language: currentLanguage,
      });

      setMessages([...newMessages, { role: 'model', content: reply }]);
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTTS = async (text: string) => {
    await voiceAssistant.speak(text);
  };

  return (
    <div className="h-[750px] max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              {t.featAskAITitle}
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-medium">
                Gemini 3.8
              </span>
            </h3>
            <p className="text-xs text-teal-100">
              {currentLanguage === 'hi'
                ? 'हिन्दी, गुजराती और अंग्रेजी में व्यक्तिगत रिकवरी मार्गदर्शन'
                : currentLanguage === 'gu'
                ? 'ગુજરાતી, હિન્દી અને અંગ્રેજીમાં વ્યક્તિગત રિકવરી માર્ગદર્શન'
                : 'Personalized post-hospital guidance in English, Hindi & Gujarati'}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: 'model',
                content:
                  currentLanguage === 'hi'
                    ? 'चैट रीसेट कर दी गई है। आप अपनी रिकवरी के बारे में क्या पूछना चाहते हैं?'
                    : currentLanguage === 'gu'
                    ? 'ચેટ રીસેટ કરવામાં આવી છે. તમે તમારી રિકવરી વિશે શું જાણવા માંગો છો?'
                    : 'Chat history cleared. How can I support your recovery journey today?',
              },
            ])
          }
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title={currentLanguage === 'hi' ? 'चैट साफ़ करें' : currentLanguage === 'gu' ? 'ચેટ સાફ કરો' : 'Clear Chat'}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-teal-500" />
          {currentLanguage === 'hi' ? 'सुझाव:' : currentLanguage === 'gu' ? 'સૂચન:' : 'Try:'}
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-teal-500 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m, index) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-sm shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">RecoveryNav AI</span>
                    <button
                      onClick={() => handlePlayTTS(m.content)}
                      className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>
                        {currentLanguage === 'hi' ? 'ऑडियो सुनें' : currentLanguage === 'gu' ? 'ઑડિઓ સાંભળો' : 'Listen'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>
                {currentLanguage === 'hi'
                  ? 'रिकवरी और दवा निर्देशों का विश्लेषण किया जा रहा है...'
                  : currentLanguage === 'gu'
                  ? 'રિકવરી અને દવાની સૂચનાઓનું વિશ્લેષણ કરવામાં આવી રહ્યું છે...'
                  : 'Analyzing medical recovery instructions...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={() => voiceAssistant.startListening()}
          className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition-colors"
          title="Speak your question"
        >
          <Mic className="w-5 h-5 animate-pulse" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.askHealthPrompt}
          className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white rounded-2xl border border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white shadow-md shadow-teal-600/20 transition-all active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
