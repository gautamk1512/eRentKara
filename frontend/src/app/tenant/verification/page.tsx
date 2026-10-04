"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Lock,
  User,
  BadgeCheck,
  AlertCircle,
  FileText,
  KeyRound,
  RefreshCw,
  Home,
} from "lucide-react";
import { api } from "@/lib/api";

export default function TenantVerificationPage() {
  // Mobile verification state
  const [phone, setPhone] = useState("9898012345");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileStep, setMobileStep] = useState<"INPUT" | "OTP" | "VERIFIED">("INPUT");
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");

  // Aadhaar verification state
  const [aadhaarRaw, setAadhaarRaw] = useState("999988886666");
  const [tenantName, setTenantName] = useState("Amit Patel");
  const [consentGiven, setConsentGiven] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarRef, setAadhaarRef] = useState("");
  const [maskedAadhaar, setMaskedAadhaar] = useState("");
  const [aadhaarStep, setAadhaarStep] = useState<"INPUT" | "OTP" | "VERIFIED">("INPUT");
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [aadhaarError, setAadhaarError] = useState("");

  // Mobile Handlers
  const handleSendMobileOtp = async () => {
    if (phone.length < 10) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setMobileLoading(true);
    setMobileError("");
    try {
      const res: any = await api.verifyStandaloneMobile({ phone });
      if (res.success) {
        setMobileStep("OTP");
      } else {
        setMobileError(res.message || "Failed to send mobile OTP.");
      }
    } catch (err: any) {
      setMobileError(err.message || "Error contacting mobile gateway.");
    } finally {
      setMobileLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    if (mobileOtp !== "123456" && mobileOtp.length < 4) {
      setMobileError("Please enter test mobile code 123456.");
      return;
    }
    setMobileLoading(true);
    setMobileError("");
    try {
      const res: any = await api.verifyStandaloneMobile({ phone, otp: mobileOtp });
      if (res.success && res.mobile_verified) {
        setMobileStep("VERIFIED");
      } else {
        setMobileError(res.message || "Invalid mobile OTP.");
      }
    } catch (err: any) {
      setMobileError(err.message || "Failed to verify mobile OTP.");
    } finally {
      setMobileLoading(false);
    }
  };

  // Aadhaar Handlers
  const handleStartAadhaar = async () => {
    const clean = aadhaarRaw.replace(/\D/g, "");
    if (clean.length !== 12) {
      setAadhaarError("Please enter a 12-digit Aadhaar number.");
      return;
    }
    if (!consentGiven) {
      setAadhaarError("Explicit consent is required for Aadhaar e-KYC.");
      return;
    }
    setAadhaarLoading(true);
    setAadhaarError("");
    try {
      const res: any = await api.startAadhaarVerification({
        aadhaar_number: clean,
        consent_given: true,
        full_name: tenantName,
        phone,
        purpose: "Tenant e-KYC & Police Verification compliance for Gujarat E-Rent Agreement",
      });
      if (res.success) {
        setAadhaarRef(res.verification_reference);
        setMaskedAadhaar(res.masked_aadhaar);
        setAadhaarStep("OTP");
      } else {
        setAadhaarError(res.message || "Failed to initiate Aadhaar verification.");
      }
    } catch (err: any) {
      setAadhaarError(err.message || "Aadhaar gateway error.");
    } finally {
      setAadhaarLoading(false);
    }
  };

  const handleVerifyAadhaarOtp = async () => {
    if (!aadhaarOtp || aadhaarOtp.length < 4) {
      setAadhaarError("Please enter test OTP 123456.");
      return;
    }
    setAadhaarLoading(true);
    setAadhaarError("");
    try {
      const res: any = await api.verifyAadhaarOtp({
        verification_reference: aadhaarRef,
        otp_code: aadhaarOtp,
      });
      if (res.success && res.verified) {
        setAadhaarStep("VERIFIED");
      } else {
        setAadhaarError(res.message || "Invalid Aadhaar OTP.");
      }
    } catch (err: any) {
      setAadhaarError(err.message || "Failed to verify Aadhaar OTP.");
    } finally {
      setAadhaarLoading(false);
    }
  };

  const isFullyVerified = mobileStep === "VERIFIED" && aadhaarStep === "VERIFIED";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Sandbox Notice Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              SANDBOX / TEST MODE
            </span>
            <span>Simulated UIDAI authentication test environment for development.</span>
          </div>
          <span className="text-amber-800 font-bold">Use test code 123456</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              Tenant Onboarding & Police Verification
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Tenant Identity Verification
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Verify your mobile number and UIDAI Aadhaar identity before reviewing or signing agreements.
            </p>
          </div>

          {/* Twin Verification Indicators */}
          <div className="flex gap-2">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${mobileStep === "VERIFIED" ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-slate-200 text-slate-400"}`}>
              <CheckCircle2 className="w-4 h-4" />
              Mobile: {mobileStep === "VERIFIED" ? "✓ Verified" : "Pending"}
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${aadhaarStep === "VERIFIED" ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-400"}`}>
              <ShieldCheck className="w-4 h-4" />
              Aadhaar: {aadhaarStep === "VERIFIED" ? "✓ Verified" : "Pending"}
            </div>
          </div>
        </div>

        {/* Dual Rails Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Rail 1: Mobile Phone Verification */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Channel 1: Mobile Verification</h2>
                  <p className="text-xs text-slate-500">Fast SMS OTP Authentication</p>
                </div>
              </div>
              {mobileStep === "VERIFIED" && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>

            {mobileError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs mb-4">
                {mobileError}
              </div>
            )}

            {mobileStep === "INPUT" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tenant Mobile Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9898012345"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendMobileOtp}
                  disabled={mobileLoading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  {mobileLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Send Mobile SMS OTP"}
                </button>
              </div>
            )}

            {mobileStep === "OTP" && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-xs">
                  Simulated Mobile OTP: <code>123456</code>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter SMS OTP
                  </label>
                  <input
                    type="text"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center font-mono tracking-widest text-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyMobileOtp}
                  disabled={mobileLoading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  {mobileLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify Mobile Number"}
                </button>
              </div>
            )}

            {mobileStep === "VERIFIED" && (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-emerald-900">Mobile Successfully Verified</div>
                <div className="text-xs text-emerald-700 mt-1">Phone: {phone}</div>
              </div>
            )}
          </div>

          {/* Rail 2: Aadhaar e-KYC Verification */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Channel 2: Aadhaar e-KYC</h2>
                  <p className="text-xs text-slate-500">Statutory UIDAI Sandbox Identity</p>
                </div>
              </div>
              {aadhaarStep === "VERIFIED" && (
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>

            {aadhaarError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs mb-4">
                {aadhaarError}
              </div>
            )}

            {aadhaarStep === "INPUT" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tenant Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Amit Patel"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    12-Digit Aadhaar Number
                  </label>
                  <input
                    type="text"
                    value={aadhaarRaw}
                    onChange={(e) => setAadhaarRaw(e.target.value)}
                    placeholder="999988886666"
                    maxLength={12}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-blue-100 bg-blue-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 text-blue-600 rounded"
                  />
                  <span className="text-[11px] text-slate-700 leading-tight">
                    <strong>I consent to Aadhaar-based identity authentication/e-KYC for this service.</strong>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleStartAadhaar}
                  disabled={!consentGiven || aadhaarLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {aadhaarLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Request Aadhaar OTP"}
                </button>
              </div>
            )}

            {aadhaarStep === "OTP" && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-xs">
                  Sandbox Aadhaar OTP: <code>123456</code> (Masked: {maskedAadhaar})
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter Aadhaar OTP
                  </label>
                  <input
                    type="text"
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-center font-mono tracking-widest text-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyAadhaarOtp}
                  disabled={aadhaarLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  {aadhaarLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify Aadhaar Identity"}
                </button>
              </div>
            )}

            {aadhaarStep === "VERIFIED" && (
              <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-blue-900">Aadhaar Identity Verified</div>
                <div className="text-xs text-blue-700 mt-1">Masked: {maskedAadhaar}</div>
              </div>
            )}
          </div>
        </div>

        {/* Ready Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Counterparty Agreement Review</h3>
            <p className="text-xs text-slate-500">
              {isFullyVerified
                ? "Your identity is verified. You are authorized to review and eSign agreements."
                : "Complete both Mobile and Aadhaar e-KYC verification above to proceed with eSign authorization."}
            </p>
          </div>
          <Link
            href="/rent-agreement/create?mode=TENANT"
            className={`px-6 py-3 rounded-xl text-white font-semibold text-xs flex items-center gap-2 transition ${isFullyVerified ? "bg-purple-600 hover:bg-purple-700 shadow-md" : "bg-slate-400 pointer-events-none"}`}
          >
            Review Agreement as Tenant
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
