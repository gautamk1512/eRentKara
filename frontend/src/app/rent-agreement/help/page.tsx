"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mic, MicOff, Volume2, ArrowRight, ArrowLeft, CheckCircle2,
  Sparkles, ShieldCheck, User, Building, DollarSign, Calendar,
  MapPin, HelpCircle, Moon, Sun, RefreshCw
} from "lucide-react";

export default function VoiceAssistedHelpPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [currentLang, setCurrentLang] = useState<"en" | "gu" | "hi">("gu");
  const [stepIndex, setStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  // Form responses collected one-by-one
  const [answers, setAnswers] = useState({
    owner_name: "",
    monthly_rent: "12000",
    security_deposit: "24000",
    property_address: "",
    tenant_name: "",
    duration_months: "11"
  });

  useEffect(() => {
    const isDark = localStorage.getItem("erk_theme") === "dark";
    setDarkMode(isDark);
    const savedLang = (localStorage.getItem("erk_lang") as "en" | "gu" | "hi") || "gu";
    setCurrentLang(savedLang);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("erk_theme", next ? "dark" : "light");
  };

  // Questions configuration in 3 languages (Point 32 requirement)
  const questions = [
    {
      key: "owner_name",
      icon: User,
      title: {
        en: "What is the Property Owner's Full Name?",
        gu: "મકાન / મિલકતના માલિકનું પૂરું નામ શું છે?",
        hi: "मकान / प्रॉपर्टी मालिक का पूरा नाम क्या है?"
      },
      helper: {
        en: "Enter the legal name as written in electricity bill or property tax receipt.",
        gu: "લાઈટ બિલ અથવા વેરા બિલમાં જે નામ હોય તે જ લખો.",
        hi: "बिजली बिल या टैक्स रसीद के अनुसार सही नाम दर्ज करें।"
      },
      placeholder: {
        en: "e.g. Rajeshbhai Patel",
        gu: "દા.ત. રાજેશભાઈ પટેલ",
        hi: "उदा. राजेशभाई पटेल"
      },
      type: "text"
    },
    {
      key: "monthly_rent",
      icon: DollarSign,
      title: {
        en: "What is the agreed Monthly Rent amount (₹)?",
        gu: "દર મહિને નક્કી થયેલ ભાડું કેટલું છે (₹)?",
        hi: "तय किया गया मासिक किराया कितना है (₹)?"
      },
      helper: {
        en: "State the monthly rental sum payable by the 5th of each English calendar month.",
        gu: "દર મહિને ચૂકવવાપાત્ર ભાડાની રકમ જણાવો.",
        hi: "हर महीने देय किराये की राशि दर्ज करें।"
      },
      placeholder: {
        en: "e.g. 15000",
        gu: "દા.ત. 15000",
        hi: "उदा. 15000"
      },
      type: "number"
    },
    {
      key: "security_deposit",
      icon: DollarSign,
      title: {
        en: "What is the refundable Security Deposit amount (₹)?",
        gu: "પરત મળવાપાત્ર સિક્યોરિટી ડિપોઝિટ કેટલી છે (₹)?",
        hi: "रिफंडेबल सिक्योरिटी डिपॉजिट कितनी है (₹)?"
      },
      helper: {
        en: "Typically 1 to 2 months' rent, refundable when vacating the property.",
        gu: "સામાન્ય રીતે ૧ કે ૨ મહિનાનું ભાડું, મકાન ખાલી કરતી વખતે પરત મળવાપાત્ર.",
        hi: "आमतौर पर 1 या 2 महीने का किराया, मकान खाली करते समय वापसी योग्य।"
      },
      placeholder: {
        en: "e.g. 30000",
        gu: "દા.ત. 30000",
        hi: "उदा. 30000"
      },
      type: "number"
    },
    {
      key: "property_address",
      icon: MapPin,
      title: {
        en: "Where is the rented property situated?",
        gu: "ભાડે આપેલ મિલકત / મકાનનું સરનામું શું છે?",
        hi: "किराये पर दी जाने वाली प्रॉपर्टी का पता क्या है?"
      },
      helper: {
        en: "Include Flat/House No., Society Name, Area, and City in Gujarat.",
        gu: "ફ્લેટ/મકાન નંબર, સોસાયટીનું નામ, વિસ્તાર અને શહેર લખો.",
        hi: "फ्लैट/मकान नंबर, सोसाइटी का नाम, इलाका और शहर दर्ज करें।"
      },
      placeholder: {
        en: "e.g. Flat 302, Gokul Heights, Vastrapur, Ahmedabad",
        gu: "દા.ત. ફ્લેટ ૩૦૨, ગોકુલ હાઇટ્સ, વસ્ત્રાપુર, અમદાવાદ",
        hi: "उदा. फ्लैट 302, गोकुल हाइट्स, वस्त्रापुर, अहमदाबाद"
      },
      type: "text"
    },
    {
      key: "tenant_name",
      icon: User,
      title: {
        en: "What is the Tenant's Full Name?",
        gu: "ભાડુઆતનું પૂરું નામ શું છે?",
        hi: "किरायेदार का पूरा नाम क्या है?"
      },
      helper: {
        en: "Enter the tenant's legal name matching their Aadhaar card.",
        gu: "ભાડુઆતના આધાર કાર્ડ મુજબનું સાચું નામ લખો.",
        hi: "किरायेदार के आधार कार्ड के अनुसार नाम दर्ज करें।"
      },
      placeholder: {
        en: "e.g. Vikrambhai Shah",
        gu: "દા.ત. વિક્રમભાઈ શાહ",
        hi: "उदा. विक्रमभाई शाह"
      },
      type: "text"
    },
    {
      key: "duration_months",
      icon: Calendar,
      title: {
        en: "Agreement Duration in Months?",
        gu: "ભાડા કરારનો સમયગાળો કેટલા મહિના રાખવો છે?",
        hi: "एग्रीमेंट की अवधि कितने महीने रखनी है?"
      },
      helper: {
        en: "11 months is standard under Gujarat Stamp Act Article 30.",
        gu: "ગુજરાત સ્ટેમ્પ એક્ટ મુજબ ૧૧ મહિનાનો સમયગાળો સૌથી માન્ય છે.",
        hi: "गुजरात स्टाम्प एक्ट के तहत 11 महीने सबसे प्रचलित और मान्य है।"
      },
      placeholder: {
        en: "11",
        gu: "11",
        hi: "11"
      },
      type: "number"
    }
  ];

  const currentQ = questions[stepIndex];

  // Speech Recognition integration (Web Speech API)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === "gu" ? "gu-IN" : currentLang === "hi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError("");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          // If expecting number, strip words
          if (currentQ.type === "number") {
            const numeric = transcript.replace(/\D/g, "");
            setAnswers((prev) => ({ ...prev, [currentQ.key]: numeric || transcript }));
          } else {
            setAnswers((prev) => ({ ...prev, [currentQ.key]: transcript }));
          }
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechError("Could not capture speech. Please try speaking again or type.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setSpeechError("Speech service initialization error. Please type directly.");
    }
  };

  const handleNext = () => {
    if (stepIndex < questions.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleFinishAndCreate = () => {
    const draftData = {
      owner_name: answers.owner_name || "Owner",
      tenant_name: answers.tenant_name || "Tenant",
      monthly_rent: Number(answers.monthly_rent) || 12000,
      security_deposit: Number(answers.security_deposit) || 24000,
      property_address: answers.property_address || "Gujarat",
      city: "Ahmedabad",
      state: "GJ",
      duration_months: Number(answers.duration_months) || 11,
      mode: "OWNER",
      agreement_type: "RESIDENTIAL"
    };

    sessionStorage.setItem("erk_voice_prefill", JSON.stringify(draftData));
    router.push("/rent-agreement/create?mode=OWNER&type=residential&source=voice_assist");
  };

  const isLastStep = stepIndex === questions.length - 1;
  const progressPercent = Math.round(((stepIndex + 1) / questions.length) * 100);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#000000] text-[#f5f5f7]" : "bg-[#f5f5f7] text-[#1d1d1f]"} font-sans transition-colors duration-200`}>

      {/* Floating Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center border ${
            darkMode
              ? "bg-[#1d1d1f] text-amber-400 border-white/20 hover:bg-[#2c2c2e]"
              : "bg-white text-slate-700 border-black/10 hover:bg-slate-50"
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/rent-agreement"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868b] hover:text-[#0071e3] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Assistant</span>
          </Link>

          {/* In-page Trilingual Language Picker */}
          <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-full text-xs font-medium border border-black/[0.06] dark:border-white/10">
            <button
              onClick={() => setCurrentLang("gu")}
              className={`px-3 py-1 rounded-full transition ${currentLang === "gu" ? "bg-[#0071e3] text-white font-bold" : "text-[#86868b]"}`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => setCurrentLang("hi")}
              className={`px-3 py-1 rounded-full transition ${currentLang === "hi" ? "bg-[#0071e3] text-white font-bold" : "text-[#86868b]"}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setCurrentLang("en")}
              className={`px-3 py-1 rounded-full transition ${currentLang === "en" ? "bg-[#0071e3] text-white font-bold" : "text-[#86868b]"}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-bold text-[#86868b] mb-2">
            <span>Question {stepIndex + 1} of {questions.length}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#0071e3] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Question Card (Section 32 Simple Mode) */}
        <div className={`rounded-3xl p-6 sm:p-10 border transition-all ${
          darkMode ? "bg-[#1c1c1e] border-white/10 shadow-2xl" : "bg-white border-black/[0.08] shadow-lg"
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center mb-6">
            <currentQ.icon className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {currentQ.title[currentLang]}
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] mb-8">
            {currentQ.helper[currentLang]}
          </p>

          {/* Interactive Voice + Text Input */}
          <div className="space-y-4 mb-8">
            <div className="relative flex items-center">
              <input
                type={currentQ.type}
                value={(answers as any)[currentQ.key]}
                onChange={(e) =>
                  setAnswers({ ...answers, [currentQ.key]: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    isLastStep ? handleFinishAndCreate() : handleNext();
                  }
                }}
                placeholder={currentQ.placeholder[currentLang]}
                autoFocus
                className={`w-full px-5 py-4 pr-14 rounded-2xl border text-base font-semibold transition ${
                  darkMode
                    ? "bg-[#2c2c2e] border-white/10 text-white focus:border-[#0071e3]"
                    : "bg-[#f5f5f7] border-black/10 text-black focus:border-[#0071e3]"
                }`}
              />

              {/* Microphone Button (Speech to Text) */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title="Speak your answer"
                className={`absolute right-3 p-2.5 rounded-xl transition ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-black/5 dark:bg-white/10 text-[#86868b] hover:text-[#0071e3]"
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>

            {isListening && (
              <p className="text-xs text-rose-500 font-semibold animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                <span>Listening... Please speak clearly in {currentLang === "gu" ? "Gujarati" : currentLang === "hi" ? "Hindi" : "English"}</span>
              </p>
            )}

            {speechError && (
              <p className="text-xs text-amber-500 font-medium">
                {speechError}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-black/[0.08] dark:border-white/10">
            <button
              onClick={handlePrev}
              disabled={stepIndex === 0}
              className={`px-5 py-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                stepIndex === 0
                  ? "opacity-40 cursor-not-allowed text-[#86868b]"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {isLastStep ? (
              <button
                onClick={handleFinishAndCreate}
                className="apple-btn-primary !py-3 !px-6 !rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] transition"
              >
                <span>Generate Official Agreement</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="apple-btn-primary !py-3 !px-6 !rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:scale-[1.02] transition"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Answer Summary */}
        <div className="mt-8 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06] text-xs text-[#86868b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0071e3]" />
            <span>Answers automatically adapt to standard legal deed clauses.</span>
          </div>
          <span className="font-semibold">Step {stepIndex + 1}/6</span>
        </div>
      </div>
    </div>
  );
}
