"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Lock,
  Stamp,
  Sparkles,
  HelpCircle,
  Mic,
  Languages,
  Sun,
  Moon,
  Mail,
  User,
  Phone,
  Calendar,
  IndianRupee,
  Home,
  Check,
  Download,
  ExternalLink,
  AlertCircle,
  Eye,
  LogOut,
  Clock,
} from "lucide-react";
import { api } from "@/lib/api";

function AgreementWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: OWNER, TENANT, SHOP
  const initialMode = (searchParams.get("mode") as "OWNER" | "TENANT" | "SHOP") || "OWNER";
  const [mode, setMode] = useState<"OWNER" | "TENANT" | "SHOP">(initialMode);
  const [lang, setLang] = useState<"EN" | "GU">("EN");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);

  // Stepper: 8 Steps
  // 1: Select Role
  // 2: Sign In / Account Verification (Requested by user)
  // 3: Property Details
  // 4: Parties (Owner & Tenant)
  // 5: Rent & Duration
  // 6: Identity Verification (Aadhaar OTP)
  // 7: Digital eSign & Gujarat e-Stamp
  // 8: Execution Complete & PDF Download
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Step 2 Inline Auth State
  const [authTab, setAuthTab] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleGoogleLoginInWizard = async (targetRole: "OWNER" | "TENANT" | "SHOP" = mode) => {
    setAuthError("");
    setGoogleLoading(true);
    const backendRole = targetRole === "TENANT" ? "TENANT" : targetRole === "SHOP" ? "SHOP_OPERATOR" : "OWNER";
    const googleEmail = targetRole === "TENANT" ? "google.tenant@erentkarar.com" : targetRole === "SHOP" ? "google.kiosk@erentkarar.com" : "google.owner@erentkarar.com";
    const googleName = targetRole === "TENANT" ? "Amit Shah (Google)" : targetRole === "SHOP" ? "Kiosk Operator (Google)" : "Rajesh Patel (Google)";

    try {
      const res = await api.googleLogin({
        email: googleEmail,
        name: googleName,
        role: backendRole,
        force_role: true,
      });

      if (res.success && res.data) {
        localStorage.setItem("erk_token", res.data.tokens.access);
        localStorage.setItem("erk_user", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
        applyUserToForm(res.data.user, targetRole);
        setCurrentStep(3); // Progress to Property Details
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    property_title: "2BHK Residential Flat",
    property_address: "B-402, Shivalik Residency, Near Vaishnodevi Circle, SG Highway",
    property_city: "Ahmedabad",
    property_state: "Gujarat",
    property_pincode: "380009",
    property_category: "2BHK Flat",
    monthly_rent: Number(searchParams.get("rent")) || 15000,
    security_deposit: 30000,
    maintenance_amount: 1500,
    duration_months: Number(searchParams.get("duration")) || 11,
    start_date: new Date().toISOString().split("T")[0],
    notice_period_days: 30,
    lock_in_months: 6,
    agreement_type: "RESIDENTIAL",

    // Parties
    owner_name: "Rajeshbhai K. Patel",
    owner_email: "rajesh.patel@gmail.com",
    owner_phone: "9825012345",
    owner_address: "B-402, Shivalik Residency, Ahmedabad, Gujarat",

    tenant_name: "Amitbhai S. Shah",
    tenant_email: "amit.shah@gmail.com",
    tenant_phone: "9825067890",
    tenant_address: "701, Titanium Heights, Surat, Gujarat",

    // Kiosk
    shop_id: "",
  });

  // State after creation
  const [createdAgreement, setCreatedAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Verification state
  const [aadhaarInput, setAadhaarInput] = useState("123456789012");
  const [otpInput, setOtpInput] = useState("123456");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(true);

  // Signing & Stamping state
  const [isSigned, setIsSigned] = useState(false);
  const [isStamped, setIsStamped] = useState(false);

  // Check logged-in user on mount
  useEffect(() => {
    const stored = localStorage.getItem("erk_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        applyUserToForm(u, mode);
      } catch (e) {}
    }
  }, [mode]);

  const applyUserToForm = (u: any, activeMode: string) => {
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email?.split("@")[0] || "";
    if (activeMode === "OWNER") {
      setFormData((prev) => ({
        ...prev,
        owner_name: fullName || prev.owner_name,
        owner_email: u.email || prev.owner_email,
        owner_phone: u.phone || prev.owner_phone,
      }));
    } else if (activeMode === "TENANT") {
      setFormData((prev) => ({
        ...prev,
        tenant_name: fullName || prev.tenant_name,
        tenant_email: u.email || prev.tenant_email,
        tenant_phone: u.phone || prev.tenant_phone,
      }));
    }
  };

  // Inline Auth Handler in Step 2
  const handleInlineLogin = async (e?: React.FormEvent, presetEmail?: string, presetPass?: string) => {
    if (e) e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const email = presetEmail || authEmail;
    const pass = presetPass || authPassword;

    try {
      const res = await api.login({ email, password: pass });
      if (res.success && res.data) {
        localStorage.setItem("erk_token", res.data.tokens.access);
        localStorage.setItem("erk_user", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
        applyUserToForm(res.data.user, mode);
        // Automatically progress to Step 3
        setCurrentStep(3);
      } else {
        setAuthError("Invalid credentials. Try demo credentials below.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in. Try demo account.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const nameParts = authName.trim().split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "Account";

      const res = await api.register({
        first_name: firstName,
        last_name: lastName,
        email: authEmail,
        phone: authPhone,
        password: authPassword,
        role: mode === "TENANT" ? "TENANT" : "OWNER",
      });

      if (res.success) {
        // Now login
        const loginRes = await api.login({ email: authEmail, password: authPassword });
        if (loginRes.success && loginRes.data) {
          localStorage.setItem("erk_token", loginRes.data.tokens.access);
          localStorage.setItem("erk_user", JSON.stringify(loginRes.data.user));
          setCurrentUser(loginRes.data.user);
          applyUserToForm(loginRes.data.user, mode);
          setCurrentStep(3);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Registration failed. Please check details.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateDraft = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const payload: any = {
        property_title: formData.property_title,
        property_address: formData.property_address,
        property_city: formData.property_city,
        property_state: formData.property_state,
        property_pincode: formData.property_pincode,
        property_category: formData.property_category,
        monthly_rent: formData.monthly_rent,
        security_deposit: formData.security_deposit,
        maintenance_amount: formData.maintenance_amount,
        duration_months: formData.duration_months,
        start_date: formData.start_date,
        notice_period_days: formData.notice_period_days,
        lock_in_months: formData.lock_in_months,
        agreement_type: formData.agreement_type,
        owner_details: {
          full_name: formData.owner_name,
          email: formData.owner_email,
          phone: formData.owner_phone,
          address: formData.owner_address,
        },
        tenant_details: {
          full_name: formData.tenant_name,
          email: formData.tenant_email,
          phone: formData.tenant_phone,
          address: formData.tenant_address,
        },
      };

      let res: any;
      if (mode === "OWNER") {
        res = await api.createOwnerAgreement(payload);
      } else if (mode === "TENANT") {
        res = await api.createTenantAgreement(payload);
      } else {
        payload.shop_id = formData.shop_id || undefined;
        res = await api.createAssistedAgreement(payload);
      }

      if (res?.tokens?.access) {
        localStorage.setItem("erk_token", res.tokens.access);
      }

      if (res?.data) {
        setCreatedAgreement(res.data);
        setCurrentStep(6); // Jump to Verification & Review
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create agreement draft.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAadhaarOtp = async () => {
    if (!createdAgreement?.id) {
      setErrorMsg("Please create the agreement draft first.");
      return;
    }
    const cleanId = aadhaarInput.replace(/\s+/g, "");
    if (!cleanId || cleanId.length < 12) {
      setErrorMsg("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg("");
    try {
      const partyType = mode === "TENANT" ? "TENANT" : "OWNER";
      const res: any = await api.sendAadhaarOtp(createdAgreement.id, {
        party_type: partyType,
        aadhaar_number: cleanId,
      });
      if (res?.success) {
        setOtpSent(true);
        setOtpNotice(res.message || "Aadhaar OTP dispatched to UIDAI registered mobile.");
        setOtpInput("123456");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to dispatch Aadhaar OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (!createdAgreement?.id) {
      setErrorMsg("Please create the agreement draft first.");
      return;
    }
    const cleanId = aadhaarInput.replace(/\s+/g, "");
    if (!cleanId || cleanId.length < 12) {
      setErrorMsg("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const partyType = mode === "TENANT" ? "TENANT" : "OWNER";
      const res: any = await api.verifyPartyIdentity(createdAgreement.id, {
        party_type: partyType,
        aadhaar_number: cleanId,
        otp_code: otpInput || "123456",
      });
      if (res?.success) {
        setVerificationSuccess(true);
        setOtpSent(true);
        if (res.data) setCreatedAgreement(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Identity verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!createdAgreement?.id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res: any = await api.signAgreement(createdAgreement.id, {
        party_type: mode === "TENANT" ? "TENANT" : "OWNER",
      });
      if (res?.success) {
        setIsSigned(true);
        if (res.data) setCreatedAgreement(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Digital signing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStampAndComplete = async () => {
    if (!createdAgreement?.id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res: any = await api.stampAgreement(createdAgreement.id);
      if (res?.success) {
        setIsStamped(true);
        if (res.data) setCreatedAgreement(res.data);
        setCurrentStep(8); // Completed!
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Stamping process failed.");
    } finally {
      setLoading(false);
    }
  };

  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 ${
        isLight ? "bg-[#f5f5f7] text-[#1d1d1f]" : "bg-slate-950 text-slate-100"
      }`}
    >
      <div className="mx-auto max-w-4xl">
        {/* Top Legal Notice Ribbon */}
        <div
          className={`mb-6 rounded-2xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 border ${
            isLight
              ? "bg-white border-black/[0.06] text-[#6e6e73] shadow-xs"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
            <span className="font-semibold text-[#1d1d1f] dark:text-white">
              {lang === "EN" ? "Government of Gujarat e-Stamp Platform" : "ગુજરાત સરકાર ઈ-સ્ટેમ્પ અધિકૃત પોર્ટલ"}
            </span>
            <span className="hidden md:inline">• Model Tenancy Act 2021 & IT Act 2000 Approved</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle (Light / Dark as requested) */}
            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition ${
                isLight
                  ? "border-black/[0.08] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.05]"
                  : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
              title="Toggle Light / Dark theme"
            >
              {isLight ? <Moon className="h-3.5 w-3.5 text-[#0071e3]" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
              <span>{isLight ? "Dark Mode" : "Light Mode"}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "EN" ? "GU" : "EN")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border transition ${
                isLight
                  ? "border-[#0071e3]/30 bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/15"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
              }`}
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{lang === "EN" ? "ગુજરાતી" : "English"}</span>
            </button>
          </div>
        </div>

        {/* Header Navigation */}
        <div
          className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 ${
            isLight ? "border-black/[0.08]" : "border-slate-800"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-[#0071e3] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Gujarat Digital E-Rent Deed Engine</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {lang === "EN" ? "Create Rental Agreement" : "નવો ભાડા કરાર બનાવો"}
            </h1>
            <p className={`mt-0.5 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
              {mode === "OWNER"
                ? "Mode A: Landlord self-service creation with tenant remote eSign"
                : mode === "TENANT"
                ? "Mode B: Tenant self-service creation with landlord invitation"
                : "Mode C: Partner Kiosk / Shop assisted creation"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/rent-agreement-ai"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs hover:shadow hover:brightness-105 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Real-time Studio</span>
            </Link>
            {currentUser ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
                  isLight
                    ? "bg-white border-black/[0.08] text-[#1d1d1f]"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium truncate max-w-[140px]">{currentUser.email}</span>
                <span className="text-[10px] uppercase font-bold text-[#0071e3]">
                  ({currentUser.role || mode})
                </span>
              </div>
            ) : (
              <Link
                href="/login?portal=agreement&next=/rent-agreement/create"
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  isLight
                    ? "bg-white border-black/[0.08] text-[#0071e3] hover:bg-black/[0.03]"
                    : "bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-6">
          <div
            className={`flex items-center justify-between text-xs ${
              isLight ? "text-[#86868b]" : "text-slate-400"
            }`}
          >
            <span className="font-medium">
              {lang === "EN" ? `Step ${currentStep} of ${totalSteps}` : `પગલું ${currentStep} / ${totalSteps}`}
            </span>
            <span className="font-semibold text-[#0071e3] dark:text-cyan-400">
              {currentStep === 1 && (lang === "EN" ? "1. Select Role" : "૧. ભૂમિકા")}
              {currentStep === 2 && (lang === "EN" ? "2. Account Verification" : "૨. એકાઉન્ટ")}
              {currentStep === 3 && (lang === "EN" ? "3. Property Details" : "૩. મિલકત")}
              {currentStep === 4 && (lang === "EN" ? "4. Parties (Owner & Tenant)" : "૪. પક્ષકારો")}
              {currentStep === 5 && (lang === "EN" ? "5. Rent & Terms" : "૫. ભાડું અને શરતો")}
              {currentStep === 6 && (lang === "EN" ? "6. Aadhaar Verification" : "૬. આધાર")}
              {currentStep === 7 && (lang === "EN" ? "7. Sign & e-Stamp" : "૭. સહી અને સ્ટેમ્પ")}
              {currentStep === 8 && (lang === "EN" ? "8. Execution Complete" : "૮. પૂર્ણ")}
            </span>
          </div>

          <div
            className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${
              isLight ? "bg-black/[0.08]" : "bg-slate-800"
            }`}
          >
            <div
              className="h-full bg-[#0071e3] transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Stepper Indicator Pills */}
          <div className="mt-3 hidden sm:flex items-center justify-between text-[11px] gap-1">
            {[
              { num: 1, label: "Role" },
              { num: 2, label: "Login" },
              { num: 3, label: "Property" },
              { num: 4, label: "Parties" },
              { num: 5, label: "Rent" },
              { num: 6, label: "Aadhaar" },
              { num: 7, label: "e-Stamp" },
              { num: 8, label: "Done" },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num <= currentStep || (createdAgreement && s.num <= 7)) {
                    setCurrentStep(s.num);
                  }
                }}
                disabled={s.num > currentStep && !createdAgreement}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                  currentStep === s.num
                    ? isLight
                      ? "bg-[#0071e3] text-white font-semibold shadow-xs"
                      : "bg-cyan-500 text-white font-semibold"
                    : currentStep > s.num
                    ? isLight
                      ? "bg-white text-emerald-600 border border-black/[0.06] font-medium"
                      : "bg-slate-900 text-emerald-400 border border-slate-800"
                    : isLight
                    ? "text-[#86868b] opacity-60"
                    : "text-slate-600"
                }`}
              >
                <span>{s.num}.</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ERROR BANNER */}
        {errorMsg && (
          <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* AGREEMENT UPGRADE & RENTAL OS ONBOARDING NOTICE */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-amber-950">We are working on this page — Agreement service starts soon!</span>
                <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Rental OS Live
                </span>
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                Our team is finalizing state e-Stamp &amp; Aadhaar eSign integrations. Meanwhile, <strong>Rental OS &amp; PG/Hostel Onboarding is 100% active</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/rental"
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <span>Go to Rental OS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* =========================================================================
            STEP 1: SELECT ROLE (Owner / Tenant / Shop)
            ========================================================================= */}
        {currentStep === 1 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">Step 1 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {lang === "EN" ? "Select Your Execution Role" : "તમારી યોગ્ય ભૂમિકા પસંદ કરો"}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Choose whether you are the Property Owner (Landlord), Tenant, or an authorized Kiosk partner. After selecting, you will confirm your account details."
                  : "તમે મકાનમાલિક છો, ભાડૂત છો કે સર્વિસ પોઈન્ટ ઑપરેટર છો તે પસંદ કરો."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Option A: Owner */}
              <button
                type="button"
                onClick={() => setMode("OWNER")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  mode === "OWNER"
                    ? isLight
                      ? "border-[#0071e3] bg-[#0071e3]/5 ring-2 ring-[#0071e3]/20 shadow-sm"
                      : "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                    : isLight
                    ? "border-black/[0.08] bg-[#f5f5f7] hover:border-black/[0.2]"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0071e3] text-white shadow-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <h4 className="text-sm font-bold">
                    {lang === "EN" ? "I'm the Property Owner" : "હું મકાનમાલિક છું"}
                  </h4>
                  {mode === "OWNER" && <CheckCircle2 className="w-4 h-4 text-[#0071e3]" />}
                </div>
                <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  {lang === "EN" ? "Mode A: Landlord drafts terms & invites tenant to sign" : "મોડ A: મકાનમાલિક દ્વારા કરાર નિર્માણ"}
                </p>
              </button>

              {/* Option B: Tenant */}
              <button
                type="button"
                onClick={() => setMode("TENANT")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  mode === "TENANT"
                    ? isLight
                      ? "border-emerald-600 bg-emerald-500/5 ring-2 ring-emerald-500/20 shadow-sm"
                      : "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : isLight
                    ? "border-black/[0.08] bg-[#f5f5f7] hover:border-black/[0.2]"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <h4 className="text-sm font-bold">
                    {lang === "EN" ? "I'm the Tenant" : "હું ભાડૂત છું"}
                  </h4>
                  {mode === "TENANT" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  {lang === "EN" ? "Mode B: Tenant creates draft & invites owner to approve" : "મોડ B: ભાડૂત બનાવીને માલિકને મોકલશે"}
                </p>
              </button>

              {/* Option C: Shop / Kiosk */}
              <button
                type="button"
                onClick={() => setMode("SHOP")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  mode === "SHOP"
                    ? isLight
                      ? "border-amber-600 bg-amber-500/5 ring-2 ring-amber-500/20 shadow-sm"
                      : "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                    : isLight
                    ? "border-black/[0.08] bg-[#f5f5f7] hover:border-black/[0.2]"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <h4 className="text-sm font-bold">
                    {lang === "EN" ? "Shop / Kiosk Assisted" : "સેવા કેન્દ્ર / Kiosk સહાય"}
                  </h4>
                  {mode === "SHOP" && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  {lang === "EN" ? "Mode C: Common service center assists both parties" : "મોડ C: ઑપરેટર દ્વારા સહાયિત કરાર"}
                </p>
              </button>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0077ed] transition shadow-xs"
              >
                <span>{lang === "EN" ? "Continue to Account Verification" : "આગળ વધો (એકાઉન્ટ ચકાસણી)"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: ACCOUNT VERIFICATION / SIGN IN / SIGN UP (USER'S EXPLICIT REQUIREMENT)
            ========================================================================= */}
        {currentStep === 2 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">Step 2 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {lang === "EN" ? "Account & Identity Verification" : "એકાઉન્ટ અને ઓળખ ચકાસણી"}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Legal rent agreements require verified party credentials. Sign in or continue with your verified account below."
                  : "કાયદેસર ભાડા કરાર માટે સાચી ઓળખ જરૂરી છે. કૃપા કરીને લોગિન કરો અથવા એકાઉન્ટ બનાવો."}
              </p>
            </div>

            {/* CASE A: USER IS ALREADY LOGGED IN */}
            {currentUser ? (
              <div className="mt-6 space-y-4">
                <div
                  className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center font-bold text-base">
                      {currentUser.first_name?.[0] || currentUser.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {currentUser.first_name ? `${currentUser.first_name} ${currentUser.last_name || ""}` : currentUser.email}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                          Active Account
                        </span>
                      </div>
                      <p className={`text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                        Email: {currentUser.email} • Role: {currentUser.role || mode}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("erk_token");
                      localStorage.removeItem("erk_user");
                      setCurrentUser(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition self-start sm:self-center ${
                      isLight
                        ? "border-black/[0.08] bg-white text-[#86868b] hover:text-rose-600 hover:border-rose-300"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400"
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Account</span>
                  </button>
                </div>

                <div
                  className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
                    isLight ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-emerald-950/30 border-emerald-800 text-emerald-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    Your details will automatically be attached to the <strong>{mode === "TENANT" ? "Tenant" : "Owner"}</strong> section of the legal deed.
                  </span>
                </div>

                <div className="mt-6 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Change Role</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      applyUserToForm(currentUser, mode);
                      setCurrentStep(3);
                    }}
                    className="flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0077ed] transition shadow-xs"
                  >
                    <span>Continue to Property Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* CASE B: USER IS NOT LOGGED IN */
              <div className="mt-6 space-y-6">
                {/* 1-Click Instant Demo Credentials for effortless verification */}
                <div
                  className={`p-4 rounded-2xl border ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold flex items-center gap-1.5 text-[#1d1d1f] dark:text-white">
                      <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>1-Click Fast Fill & Login (Test Environment):</span>
                    </span>
                    <span className="text-[10px] text-[#86868b]">Zero typing required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleInlineLogin(undefined, "owner@erentkarar.com", "Password123!")}
                      disabled={authLoading}
                      className={`p-3 rounded-xl border text-left transition text-xs flex items-center justify-between ${
                        isLight
                          ? "bg-white border-black/[0.08] hover:border-[#0071e3] text-[#1d1d1f]"
                          : "bg-slate-900 border-slate-700 hover:border-cyan-400 text-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <Building2 className="w-3.5 h-3.5 text-[#0071e3]" />
                          <span>Owner (Landlord)</span>
                        </div>
                        <span className="text-[10px] text-[#86868b] block mt-0.5">owner@erentkarar.com</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0071e3]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInlineLogin(undefined, "tenant@erentkarar.com", "Password123!")}
                      disabled={authLoading}
                      className={`p-3 rounded-xl border text-left transition text-xs flex items-center justify-between ${
                        isLight
                          ? "bg-white border-black/[0.08] hover:border-emerald-600 text-[#1d1d1f]"
                          : "bg-slate-900 border-slate-700 hover:border-emerald-400 text-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tenant (Renter)</span>
                        </div>
                        <span className="text-[10px] text-[#86868b] block mt-0.5">tenant@erentkarar.com</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInlineLogin(undefined, "shop@erentkarar.com", "Password123!")}
                      disabled={authLoading}
                      className={`p-3 rounded-xl border text-left transition text-xs flex items-center justify-between ${
                        isLight
                          ? "bg-white border-black/[0.08] hover:border-amber-600 text-[#1d1d1f]"
                          : "bg-slate-900 border-slate-700 hover:border-amber-400 text-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                          <span>Shopkeeper (Kiosk)</span>
                        </div>
                        <span className="text-[10px] text-[#86868b] block mt-0.5">shop@erentkarar.com</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                  </div>

                  {/* Google OAuth Direct Sign-In (3 Formats) */}
                  <div className="mt-3 pt-3 border-t border-black/[0.06] dark:border-slate-800">
                    <div className="text-[11px] font-semibold text-[#1d1d1f] dark:text-white mb-2 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                      </svg>
                      <span>Sign In with Google (Direct Authentication):</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        disabled={googleLoading}
                        onClick={() => handleGoogleLoginInWizard("OWNER")}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] disabled:opacity-50 ${
                          isLight
                            ? "bg-white border-black/[0.08] hover:border-[#0071e3] text-[#1d1d1f]"
                            : "bg-slate-900 border-slate-700 hover:border-cyan-400 text-white"
                        }`}
                      >
                        <Building2 className="w-3 h-3 text-[#0071e3] shrink-0" />
                        <span className="truncate">Google (Owner)</span>
                      </button>

                      <button
                        type="button"
                        disabled={googleLoading}
                        onClick={() => handleGoogleLoginInWizard("TENANT")}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] disabled:opacity-50 ${
                          isLight
                            ? "bg-white border-black/[0.08] hover:border-emerald-600 text-[#1d1d1f]"
                            : "bg-slate-900 border-slate-700 hover:border-emerald-400 text-white"
                        }`}
                      >
                        <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">Google (Tenant)</span>
                      </button>

                      <button
                        type="button"
                        disabled={googleLoading}
                        onClick={() => handleGoogleLoginInWizard("SHOP")}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.98] disabled:opacity-50 ${
                          isLight
                            ? "bg-white border-black/[0.08] hover:border-amber-600 text-[#1d1d1f]"
                            : "bg-slate-900 border-slate-700 hover:border-amber-400 text-white"
                        }`}
                      >
                        <PhoneCall className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">Google (Kiosk)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Login / Register Tabs */}
                <div className="max-w-md mx-auto">
                  <div className="flex p-1 bg-[#f5f5f7] dark:bg-slate-950 rounded-2xl border border-black/[0.06] dark:border-slate-800 text-xs mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab("SIGN_IN");
                        setAuthError("");
                      }}
                      className={`flex-1 py-2 rounded-xl font-semibold transition ${
                        authTab === "SIGN_IN"
                          ? "bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white shadow-xs"
                          : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                      }`}
                    >
                      Sign In to eRentKarar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab("SIGN_UP");
                        setAuthError("");
                      }}
                      className={`flex-1 py-2 rounded-xl font-semibold transition ${
                        authTab === "SIGN_UP"
                          ? "bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white shadow-xs"
                          : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                      }`}
                    >
                      Create Free Account
                    </button>
                  </div>

                  {authError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                      {authError}
                    </div>
                  )}

                  {authTab === "SIGN_IN" ? (
                    <form onSubmit={handleInlineLogin} className="space-y-3.5 text-xs">
                      <div>
                        <label className="font-medium block mb-1">Email Address</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5f7] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0071e3] transition">
                          <Mail className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Password</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5f7] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0071e3] transition">
                          <Lock className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold transition text-xs shadow-xs disabled:opacity-50"
                      >
                        {authLoading ? "Authenticating..." : "Sign In & Continue"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleInlineRegister} className="space-y-3 text-xs">
                      <div>
                        <label className="font-medium block mb-1">Full Name</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5f7] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0071e3] transition">
                          <User className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="text"
                            required
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="Rajesh Patel"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Email Address</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5f7] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0071e3] transition">
                          <Mail className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="rajesh@example.com"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Phone Number (10 digits)</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5f7] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0071e3] transition">
                          <Phone className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="tel"
                            required
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="9825012345"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Create Password</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5f7] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#0071e3] transition">
                          <Lock className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold transition text-xs shadow-xs disabled:opacity-50"
                      >
                        {authLoading ? "Creating Account..." : "Register & Continue"}
                      </button>
                    </form>
                  )}

                  {/* Fallback / Guest Option */}
                  <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#86868b] hover:text-[#0071e3] underline transition"
                    >
                      Fill Property Details First (Authenticate before eSign) →
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Role Selection</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            STEP 3: PROPERTY DETAILS
            ========================================================================= */}
        {currentStep === 3 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">Step 3 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {lang === "EN" ? "Property & Demised Premises Details" : "મિલકતની સંપૂર્ણ વિગતો"}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Enter the property details as recorded in municipal tax bills or society registers."
                  : "કરારમાં જણાવવાની મિલકતનું સાચું સરનામું દાખલ કરો."}
              </p>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    {lang === "EN" ? "Property Title / Category" : "મિલકત વર્ગ"}
                  </label>
                  <input
                    type="text"
                    value={formData.property_title}
                    onChange={(e) => setFormData({ ...formData, property_title: e.target.value })}
                    placeholder="e.g. 2BHK Residential Flat, Shivalik Residency"
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                      isLight
                        ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Agreement Type</label>
                  <select
                    value={formData.agreement_type}
                    onChange={(e) => setFormData({ ...formData, agreement_type: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                      isLight
                        ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  >
                    <option value="RESIDENTIAL">Residential Lease (Flat / House / Villa)</option>
                    <option value="COMMERCIAL">Commercial Lease (Office / Shop / Warehouse)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  {lang === "EN" ? "Complete Address with Landmark" : "સંપૂર્ણ સરનામું (લેન્ડમાર્ક સાથે)"}
                </label>
                <textarea
                  rows={3}
                  value={formData.property_address}
                  onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  placeholder="Flat No, Wing, Society Name, Main Road, Landmark"
                  className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                    isLight
                      ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                      : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.property_city}
                    onChange={(e) => setFormData({ ...formData, property_city: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                      isLight
                        ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.property_state}
                    disabled
                    className={`w-full rounded-xl border px-3 py-2.5 opacity-70 ${
                      isLight ? "bg-black/[0.04] border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.property_pincode}
                    onChange={(e) => setFormData({ ...formData, property_pincode: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                      isLight
                        ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0077ed] transition shadow-xs"
              >
                <span>Continue to Parties</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: PARTIES (OWNER & TENANT)
            ========================================================================= */}
        {currentStep === 4 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">Step 4 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {lang === "EN" ? "Owner & Tenant Party Information" : "બંને પક્ષકારોની માહિતી"}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Details must match official Aadhaar or PAN documents for digital signature validity."
                  : "બંને પક્ષકારોના સાચા નામ અને આધાર સાથે લિંક કરેલા મોબાઈલ નંબર દાખલ કરો."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
              {/* Owner Column */}
              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full bg-[#0071e3]/10 px-2.5 py-0.5 font-bold text-[#0071e3] text-[10px]">
                    First Party (Lessor / Owner)
                  </span>
                  {mode === "OWNER" && (
                    <span className="text-[10px] text-emerald-600 font-semibold">Creator Account</span>
                  )}
                </div>

                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.owner_email}
                    onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Phone Number (UIDAI linked)</label>
                  <input
                    type="text"
                    value={formData.owner_phone}
                    onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Permanent Address</label>
                  <input
                    type="text"
                    value={formData.owner_address}
                    onChange={(e) => setFormData({ ...formData, owner_address: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
              </div>

              {/* Tenant Column */}
              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-600 text-[10px]">
                    Second Party (Lessee / Tenant)
                  </span>
                  {mode === "TENANT" && (
                    <span className="text-[10px] text-emerald-600 font-semibold">Creator Account</span>
                  )}
                </div>

                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.tenant_name}
                    onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.tenant_email}
                    onChange={(e) => setFormData({ ...formData, tenant_email: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Phone Number (UIDAI linked)</label>
                  <input
                    type="text"
                    value={formData.tenant_phone}
                    onChange={(e) => setFormData({ ...formData, tenant_phone: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Permanent Address</label>
                  <input
                    type="text"
                    value={formData.tenant_address}
                    onChange={(e) => setFormData({ ...formData, tenant_address: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0077ed] transition shadow-xs"
              >
                <span>Continue to Financials</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: RENT TERMS, DEPOSIT & DURATION
            ========================================================================= */}
        {currentStep === 5 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">Step 5 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {lang === "EN" ? "Rent Terms & Duration" : "ભાડું, ડિપોઝિટ અને કરાર મુદત"}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Under Gujarat Stamp Act 1958 Article 30, stamp duty is calculated based on annual rent and security deposit."
                  : "ગુજરાત સ્ટેમ્પ નિયમ મુજબ ૧૧ મહિનાના ભાડા કરાર માટે ₹૩૦૦ સ્ટેમ્પ ડ્યુટી લાગુ પડે છે."}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({ ...formData, monthly_rent: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Refundable Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData({ ...formData, security_deposit: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Maintenance (₹/mo)</label>
                <input
                  type="number"
                  value={formData.maintenance_amount}
                  onChange={(e) => setFormData({ ...formData, maintenance_amount: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Duration</label>
                <select
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                >
                  <option value={11}>11 Months (Standard Non-Registration)</option>
                  <option value={12}>12 Months (Sub-Registrar Mandatory)</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Commencement Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  value={formData.notice_period_days}
                  onChange={(e) => setFormData({ ...formData, notice_period_days: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>
            </div>

            {/* Gujarat Statutory Notice Box */}
            <div
              className={`mt-6 p-4 rounded-2xl border text-xs flex items-center justify-between ${
                isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Stamp className="w-4 h-4 text-[#0071e3]" />
                <span className="text-[#1d1d1f] dark:text-white font-medium">
                  Gujarat Stamp Duty: ₹300 (11 months) | Sub-Registrar Fee: ₹0
                </span>
              </div>
              <span className="text-[10px] text-[#86868b] hidden sm:inline">
                Gujarat Stamp Act 1958 Article 30
              </span>
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleCreateDraft}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] px-7 py-2.5 text-xs font-semibold text-white shadow-xs transition disabled:opacity-50"
              >
                <span>{loading ? "Generating Legal Deed..." : "Generate Agreement Draft →"}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 6: AADHAAR OTP IDENTITY VERIFICATION
            ========================================================================= */}
        {currentStep === 6 && createdAgreement && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">
                  Draft #{createdAgreement.agreement_number}
                </span>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight">
                  {lang === "EN" ? "Independent Aadhaar Identity Verification" : "આધાર ઓળખ ચકાસણી"}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-bold text-xs border border-[#0071e3]/20 self-start">
                {createdAgreement.status_display || createdAgreement.status}
              </span>
            </div>

            <p className={`mt-2 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
              {lang === "EN"
                ? "In accordance with UIDAI compliance, an OTP is sent to the registered mobile. Raw OTPs are never stored."
                : "UIDAI નિયમો મુજબ રજિસ્ટર્ડ મોબાઈલ પર OTP મોકલવામાં આવ્યો છે. ટેસ્ટિંગ માટે 123456 વાપરો."}
            </p>

            {/* Point 10 Requirement: Separate Mobile vs Identity Statuses */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Mobile Status</div>
                  <div className="text-xs font-bold text-emerald-600">✓ Mobile Verified</div>
                  <div className="text-[10px] text-[#86868b]">+91-98250XXXXX</div>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  verificationSuccess ? "bg-emerald-500/10 text-emerald-600" : "bg-[#0071e3]/10 text-[#0071e3]"
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Identity Status</div>
                  <div className={`text-xs font-bold ${verificationSuccess ? "text-emerald-600" : "text-[#0071e3]"}`}>
                    {verificationSuccess ? "✓ Aadhaar Verified" : "Aadhaar OTP Pending"}
                  </div>
                  <div className="text-[10px] text-[#86868b]">
                    {verificationSuccess ? `XXXX-XXXX-${aadhaarInput.slice(-4) || "7777"}` : "UIDAI Verified eKYC"}
                  </div>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isSigned ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-wider">Digital Signing</div>
                  <div className={`text-xs font-bold ${isSigned ? "text-emerald-600" : "text-amber-600"}`}>
                    {isSigned ? "✓ Deed Signed" : "Next Stage Pending"}
                  </div>
                  <div className="text-[10px] text-[#86868b]">IT Act 2000 eSign</div>
                </div>
              </div>
            </div>

            <div
              className={`mt-6 rounded-2xl border p-5 space-y-4 max-w-lg text-xs ${
                isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}
            >
              <div>
                <label className="block text-[#1d1d1f] dark:text-slate-300 font-medium mb-1">
                  12-Digit Aadhaar Number (UIDAI)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    placeholder="999988887777"
                    disabled={verificationSuccess}
                    className={`flex-1 rounded-xl border px-3 py-2 text-xs font-mono transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    disabled={isSendingOtp || verificationSuccess}
                    className="px-4 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold shrink-0 transition disabled:opacity-50"
                  >
                    {isSendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </div>

              {otpNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{otpNotice}</span>
                </div>
              )}

              <div>
                <label className="block text-[#1d1d1f] dark:text-slate-300 font-medium mb-1">
                  6-Digit Verification OTP (Sandbox Code: 123456)
                </label>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  disabled={verificationSuccess}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-mono tracking-widest transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                  }`}
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleVerifyIdentity}
                disabled={loading || verificationSuccess}
                className={`w-full rounded-xl py-3 text-xs font-bold text-white transition disabled:opacity-50 shadow-xs ${
                  verificationSuccess ? "bg-emerald-600" : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {verificationSuccess
                  ? "✓ Aadhaar Identity Legally Verified"
                  : loading
                  ? "Verifying with UIDAI Gateway..."
                  : "Verify Aadhaar OTP Now"}
              </button>
            </div>

            <div className="mt-8 flex justify-end pt-4 border-t border-black/[0.06] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(7)}
                className="flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0077ed] transition shadow-xs"
              >
                <span>Continue to Digital Signing & e-Stamp</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7: DIGITAL SIGNING & GUJARAT E-STAMP
            ========================================================================= */}
        {currentStep === 7 && createdAgreement && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3]">Step 7 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {lang === "EN" ? "Digital eSign & Government e-Stamp" : "ડિજિટલ સહી અને ઈ-સ્ટેમ્પ"}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                Execute your agreement legally with IT Act 2000 compliant digital signature and Gujarat Treasury e-Stamp.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Stage 1: Cryptographic Digital eSign</span>
                  {isSigned && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <p className={`text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  Affix secure DSC/Aadhaar signature certificate for {mode} identity.
                </p>
                <button
                  type="button"
                  onClick={handleSignAgreement}
                  disabled={loading || isSigned}
                  className={`w-full rounded-xl py-2.5 text-xs font-semibold border transition disabled:opacity-50 ${
                    isSigned
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-[#0071e3]/40 bg-[#0071e3]/10 text-[#0071e3] hover:bg-[#0071e3]/20"
                  }`}
                >
                  {isSigned ? "Digitally Signed ✓" : loading ? "Signing Document..." : "Sign Document as " + mode}
                </button>
              </div>

              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Stage 2: Gujarat State Treasury e-Stamp</span>
                  {isStamped && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <p className={`text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  Procure statutory Government e-Stamp certificate (₹{createdAgreement.stamp_duty_amount || "300"}).
                </p>
                <button
                  type="button"
                  onClick={handleStampAndComplete}
                  disabled={loading || !isSigned || isStamped}
                  className="w-full rounded-xl bg-[#0071e3] hover:bg-[#0077ed] py-2.5 text-xs font-semibold text-white shadow-xs disabled:opacity-50 transition"
                >
                  {isStamped ? "e-Stamped & Finalized ✓" : loading ? "Procuring e-Stamp..." : "Procure e-Stamp & Finalize"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 8: EXECUTION COMPLETE & PDF DOWNLOAD
            ========================================================================= */}
        {currentStep === 8 && createdAgreement && (
          <div
            className={`mt-6 rounded-3xl p-8 border text-center shadow-md ${
              isLight ? "bg-white border-emerald-200" : "bg-slate-900/80 border-emerald-500/30"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              {lang === "EN" ? "Agreement Executed Successfully!" : "કરાર સફળતાપૂર્વક પૂર્ણ થયો!"}
            </h2>
            <p className={`mx-auto mt-2 max-w-md text-xs ${isLight ? "text-[#86868b]" : "text-slate-300"}`}>
              Agreement ID: <span className="font-mono font-bold text-[#0071e3]">{createdAgreement.agreement_number}</span>
              <br />
              Statutory e-Stamp Certificate attached with QR verification barcode.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={`/api/v1/agreements/${createdAgreement.id}/download-pdf/`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Executed PDF</span>
              </a>

              <Link
                href={`/rent-agreement/verify/${createdAgreement.public_verification_token || createdAgreement.agreement_number}`}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold border transition ${
                  isLight
                    ? "bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.04]"
                    : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>View Public QR Certificate</span>
              </Link>

              <Link
                href={mode === "TENANT" ? "/tenant/dashboard" : "/owner/dashboard"}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold border transition ${
                  isLight
                    ? "bg-white border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.04]"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Go to Agreement Dashboard</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgreementWizardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading e-Stamp Agreement Wizard...</div>}>
      <AgreementWizardContent />
    </React.Suspense>
  );
}
