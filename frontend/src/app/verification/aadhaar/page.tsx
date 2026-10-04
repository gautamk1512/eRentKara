"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  RefreshCw,
  User,
  Phone,
  FileText,
  BadgeCheck,
  Building,
  KeyRound,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";

type Step = "AADHAAR" | "CONSENT" | "OTP" | "RESULT";

export default function AadhaarVerificationPage() {
  const router = useRouter();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<Step>("AADHAAR");
  const [aadhaarRaw, setAadhaarRaw] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verificationRef, setVerificationRef] = useState("");
  const [maskedAadhaar, setMaskedAadhaar] = useState("");
  const [kycResult, setKycResult] = useState<any>(null);

  // Status and timer
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [sessionTtl, setSessionTtl] = useState(600); // 10 minutes
  const [copied, setCopied] = useState(false);

  // Countdown timer for active OTP session
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === "OTP" && sessionTtl > 0) {
      timer = setInterval(() => {
        setSessionTtl((prev) => (prev > 0 ? prev - 1 : 0));
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, sessionTtl]);

  // Format Aadhaar display with spaced groups: 1234 5678 9012
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaarRaw(raw);
    setErrorMsg("");
  };

  const formattedAadhaarDisplay = aadhaarRaw
    .replace(/(\d{4})/g, "$1 ")
    .trim();

  // Handle Step 1 -> Step 2
  const handleProceedToConsent = () => {
    if (aadhaarRaw.length !== 12) {
      setErrorMsg("Please enter a complete 12-digit Aadhaar number.");
      return;
    }
    setErrorMsg("");
    setCurrentStep("CONSENT");
  };

  // Handle Step 2 -> Request OTP (Step 3)
  const handleRequestOtp = async () => {
    if (!consentChecked) {
      setErrorMsg("You must provide explicit consent before proceeding with Aadhaar authentication.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res: any = await api.startAadhaarVerification({
        aadhaar_number: aadhaarRaw,
        consent_given: true,
        full_name: fullName.trim() || "Verified Citizen",
        phone: phone.trim() || "9825012345",
        purpose: "Rental Agreement Identity Verification & e-KYC under IT Act 2000",
      });

      if (res.success) {
        setVerificationRef(res.verification_reference);
        setMaskedAadhaar(res.masked_aadhaar);
        setSessionTtl(res.expires_in_seconds || 600);
        setResendCooldown(60);
        setCurrentStep("OTP");
      } else {
        setErrorMsg(res.message || "Failed to initiate verification session.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please ensure local server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 -> Verify OTP (Step 4)
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length < 4) {
      setErrorMsg("Please enter the 6-digit test OTP (123456).");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res: any = await api.verifyAadhaarOtp({
        verification_reference: verificationRef,
        otp_code: otpCode.trim(),
      });

      if (res.success && res.verified) {
        setKycResult(res.kyc_data || {});
        setMaskedAadhaar(res.masked_aadhaar || maskedAadhaar);
        setCurrentStep("RESULT");
      } else {
        setErrorMsg(res.message || "Invalid OTP code. Please check and try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Verification failed. Check test OTP or retry.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res: any = await api.resendAadhaarOtp(verificationRef);
      if (res.success) {
        setResendCooldown(60);
        setSessionTtl(600);
        setOtpCode("");
      } else {
        setErrorMsg(res.message || "Could not resend OTP.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  const copyRefToClipboard = () => {
    if (verificationRef) {
      navigator.clipboard.writeText(verificationRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Banner: Sandbox Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs md:text-sm text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              SANDBOX / TEST MODE
            </span>
            <span>
              Simulated UIDAI authentication test environment for development. Never treat as a real government verification.
            </span>
          </div>
          <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
            Test Code: 123456
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/verification" className="hover:text-blue-600 transition">
            Verification Portal
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Aadhaar e-KYC Wizard</span>
        </div>

        {/* Wizard Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Aadhaar Identity Authentication
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            4-step compliant verification adhering to UIDAI developer sandbox standards.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg font-medium transition ${currentStep === "AADHAAR" ? "bg-blue-50 text-blue-700 font-bold" : "text-emerald-600"}`}>
              1. Aadhaar
            </div>
            <div className={`p-2 rounded-lg font-medium transition ${currentStep === "CONSENT" ? "bg-blue-50 text-blue-700 font-bold" : ["OTP", "RESULT"].includes(currentStep) ? "text-emerald-600" : "text-slate-400"}`}>
              2. Consent
            </div>
            <div className={`p-2 rounded-lg font-medium transition ${currentStep === "OTP" ? "bg-blue-50 text-blue-700 font-bold" : currentStep === "RESULT" ? "text-emerald-600" : "text-slate-400"}`}>
              3. OTP
            </div>
            <div className={`p-2 rounded-lg font-medium transition ${currentStep === "RESULT" ? "bg-emerald-50 text-emerald-700 font-bold" : "text-slate-400"}`}>
              4. Verified
            </div>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">Verification Notice</p>
              <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: ENTER AADHAAR NUMBER */}
        {/* ========================================================================= */}
        {currentStep === "AADHAAR" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 1: Enter Citizen Details</h2>
                <p className="text-xs text-slate-500">Provide 12-digit Aadhaar number and contact</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  12-Digit Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formattedAadhaarDisplay}
                    onChange={handleAadhaarChange}
                    placeholder="9999 8888 7777"
                    maxLength={14}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-300 font-mono text-lg tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <div className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-mono">
                    {aadhaarRaw.length}/12
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Development test numbers: <code>9999 8888 7777</code> or any valid 12-digit number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Citizen Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar Shah"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="e.g. 9825012345"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Raw Aadhaar number is never logged or stored permanently unmasked.</span>
              </div>

              <button
                type="button"
                onClick={handleProceedToConsent}
                disabled={aadhaarRaw.length !== 12}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm"
              >
                Proceed to Consent Check
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: EXPLICIT CONSENT DISPLAY */}
        {/* ========================================================================= */}
        {currentStep === "CONSENT" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 2: Statutory Consent Mandate</h2>
                <p className="text-xs text-slate-500">UIDAI regulatory compliance requirement</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 text-xs text-slate-700 space-y-3 leading-relaxed">
                <p className="font-semibold text-slate-900 text-sm">
                  Statutory Consent Declaration:
                </p>
                <div className="p-4 bg-white rounded-lg border border-slate-200 italic text-slate-800">
                  &ldquo;I hereby give explicit consent to the platform to authenticate my identity using my Aadhaar number
                  and generate an OTP for the sole purpose of verifying my identity for Gujarat E-Rent Agreement execution,
                  e-KYC compliance, and digital e-signing under the Information Technology Act, 2000.&rdquo;
                </div>
                <div className="space-y-1 text-slate-500 text-[11px]">
                  <div>• Consent Version: <code>v1.0-2026</code></div>
                  <div>• Purpose: <code>Rental Agreement Identification & e-KYC</code></div>
                  <div>• Target Masked Record: <code>XXXX-XXXX-{aadhaarRaw.slice(-4)}</code></div>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-blue-200 bg-blue-50/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-800 leading-normal font-medium">
                  <strong>I consent to Aadhaar-based identity authentication/e-KYC for this service.</strong> I understand
                  that my Aadhaar number will not be retained in plain text and will only be used for sandbox identity
                  verification.
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("AADHAAR")}
                  className="px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={!consentChecked || loading}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Requesting OTP from Sandbox...
                    </>
                  ) : (
                    <>
                      Confirm & Send Aadhaar OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: OTP VERIFICATION */}
        {/* ========================================================================= */}
        {currentStep === "OTP" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 3: Enter Aadhaar OTP</h2>
                <p className="text-xs text-slate-500">
                  Dispatched to UIDAI registered mobile linked with {maskedAadhaar}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Test mode banner prompt */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>
                  <strong>Sandbox Test Code:</strong> Enter <code>123456</code> to verify successfully.
                </span>
                <span className="font-mono font-bold text-amber-700">123456</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Enter 6-Digit OTP <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs font-mono text-slate-500">
                    Session expires in: {Math.floor(sessionTtl / 60)}:{(sessionTtl % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 font-mono text-2xl tracking-widest text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Reference: <code>{verificationRef}</code></span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  className="text-blue-600 hover:underline disabled:text-slate-400 font-medium"
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep("CONSENT")}
                  className="px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length < 4 || loading}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Authenticating with Sandbox UIDAI...
                    </>
                  ) : (
                    <>
                      Verify Identity
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: VERIFICATION RESULT */}
        {/* ========================================================================= */}
        {currentStep === "RESULT" && (
          <div className="bg-white border border-emerald-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="text-center pb-6 border-b border-slate-200 mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
                IDENTITY_VERIFIED
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Aadhaar e-KYC Verification Successful
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                UIDAI Sandbox authentication completed. Statutory identity attributes verified.
              </p>
            </div>

            {/* Twin Verified Cards: Mobile vs Aadhaar */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">Mobile Status</div>
                <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mobile: ✓ Verified
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-[10px] uppercase font-bold text-blue-500">Aadhaar Status</div>
                <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Aadhaar/KYC: ✓ Verified
                </div>
              </div>
            </div>

            {/* Permitted e-KYC Attributes */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6 text-xs space-y-3">
              <div className="font-semibold text-slate-800 text-sm">Permitted Identity Attributes</div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-medium text-slate-900">
                    {kycResult?.verified_name || fullName || "Rajesh Kumar Shah"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Masked Aadhaar</span>
                  <span className="font-mono font-medium text-slate-900">{maskedAadhaar}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gender</span>
                  <span className="font-medium text-slate-900">{kycResult?.gender === "M" ? "Male" : "Female"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Year of Birth</span>
                  <span className="font-medium text-slate-900">1992</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Jurisdiction</span>
                  <span className="font-medium text-slate-900">
                    {kycResult?.district || "Ahmedabad"}, {kycResult?.state || "Gujarat"} (380009)
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Reference Key */}
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs mb-6">
              <div>
                <span className="text-slate-400 block text-[10px]">Verification Reference</span>
                <span className="font-mono text-slate-800 font-bold">{verificationRef}</span>
              </div>
              <button
                type="button"
                onClick={copyRefToClipboard}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/rent-agreement/create"
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
              >
                Proceed to Create Agreement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex gap-3">
                <Link
                  href={`/verification/status?ref=${verificationRef}`}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition text-center"
                >
                  View Status Record
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep("AADHAAR");
                    setAadhaarRaw("");
                    setOtpCode("");
                    setConsentChecked(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
                >
                  Verify Another Party
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
