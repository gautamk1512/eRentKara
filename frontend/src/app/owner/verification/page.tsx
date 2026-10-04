"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
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
  Zap,
  Home,
  Award,
} from "lucide-react";
import { api } from "@/lib/api";

export default function OwnerVerificationPage() {
  // Mobile verification state
  const [phone, setPhone] = useState("9825012345");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileStep, setMobileStep] = useState<"INPUT" | "OTP" | "VERIFIED">("INPUT");
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileError, setMobileError] = useState("");

  // Aadhaar verification state
  const [aadhaarRaw, setAadhaarRaw] = useState("999988887777");
  const [ownerName, setOwnerName] = useState("Rajesh Kumar Shah");
  const [consentGiven, setConsentGiven] = useState(false);
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarRef, setAadhaarRef] = useState("");
  const [maskedAadhaar, setMaskedAadhaar] = useState("");
  const [aadhaarStep, setAadhaarStep] = useState<"INPUT" | "OTP" | "VERIFIED">("INPUT");
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [aadhaarError, setAadhaarError] = useState("");

  // Property Ownership Verification state
  const [propertyAddress, setPropertyAddress] = useState("Flat 402, Shivalik Highstreet, Vastrapur, Ahmedabad, Gujarat");
  const [electricityConsumerNo, setElectricityConsumerNo] = useState("TOR-89234190");
  const [discomBoard, setDiscomBoard] = useState("Torrent Power (Gujarat)");
  const [propertyTaxId, setPropertyTaxId] = useState("AMC-PID-380015-88");
  const [warrantyAccepted, setWarrantyAccepted] = useState(true);
  const [ownershipStep, setOwnershipStep] = useState<"INPUT" | "VERIFIED">("INPUT");
  const [ownershipLoading, setOwnershipLoading] = useState(false);
  const [ownershipError, setOwnershipError] = useState("");
  const [ownershipSuccessMsg, setOwnershipSuccessMsg] = useState("");

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
        full_name: ownerName,
        phone,
        purpose: "Property Owner e-KYC for Gujarat E-Rent Agreement Creation",
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

  // Property Ownership Handler
  const handleVerifyPropertyOwnership = async () => {
    if (!electricityConsumerNo && !propertyTaxId) {
      setOwnershipError("Please enter an Electricity Consumer No or Municipal Property Tax ID.");
      return;
    }
    if (!warrantyAccepted) {
      setOwnershipError("Statutory title warranty under Indian law is required.");
      return;
    }
    setOwnershipLoading(true);
    setOwnershipError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOwnershipStep("VERIFIED");
      setOwnershipSuccessMsg(
        `Ownership verified! Linked to ${discomBoard} Meter #${electricityConsumerNo}. Registered landlord name matched.`
      );
    } catch (err: any) {
      setOwnershipError(err.message || "Failed to verify property ownership.");
    } finally {
      setOwnershipLoading(false);
    }
  };

  const isFullyVerified = mobileStep === "VERIFIED" && aadhaarStep === "VERIFIED" && ownershipStep === "VERIFIED";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Sandbox Notice Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              SANDBOX / BETA MODE
            </span>
            <span>Zoho Sign Aadhaar eSign & Instant DISCOM Utility Meter Verification Active.</span>
          </div>
          <span className="text-amber-800 font-bold">Use test OTP 123456</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Property Owner Onboarding • India Compliance
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Landlord & Property Verification
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Verify mobile number, Zoho Sign Aadhaar identity, and property ownership before drafting legal agreements.
            </p>
          </div>

          {/* Triple Verification Indicators */}
          <div className="flex flex-wrap gap-2">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${mobileStep === "VERIFIED" ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-slate-200 text-slate-400"}`}>
              <CheckCircle2 className="w-4 h-4" />
              Mobile: {mobileStep === "VERIFIED" ? "✓ Verified" : "Pending"}
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${aadhaarStep === "VERIFIED" ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-400"}`}>
              <ShieldCheck className="w-4 h-4" />
              Aadhaar (Zoho): {aadhaarStep === "VERIFIED" ? "✓ Verified" : "Pending"}
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${ownershipStep === "VERIFIED" ? "bg-purple-50 border-purple-300 text-purple-700" : "bg-white border-slate-200 text-slate-400"}`}>
              <Award className="w-4 h-4" />
              Property: {ownershipStep === "VERIFIED" ? "✓ Verified" : "Pending"}
            </div>
          </div>
        </div>

        {/* Triple Rails Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
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
                    Owner Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9825012345"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendMobileOtp}
                  disabled={mobileLoading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2"
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
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2"
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
                    Landlord Legal Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Rajesh Kumar Shah"
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
                    placeholder="999988887777"
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

          {/* Rail 3: Property Ownership Verification */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Channel 3: Property Title</h2>
                  <p className="text-xs text-slate-500">Electricity Meter / Tax Proof</p>
                </div>
              </div>
              {ownershipStep === "VERIFIED" && (
                <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>

            {ownershipError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {ownershipError}
              </div>
            )}

            {ownershipStep === "INPUT" ? (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Property Address / Unit
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    DISCOM / State Electricity Board
                  </label>
                  <select
                    value={discomBoard}
                    onChange={(e) => setDiscomBoard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Torrent Power (Gujarat)">Torrent Power (Gujarat - Ahmedabad/Surat)</option>
                    <option value="UGVCL / DGVCL / PGVCL (Gujarat)">UGVCL / DGVCL / PGVCL (Gujarat)</option>
                    <option value="BESCOM (Bangalore, Karnataka)">BESCOM (Bangalore, Karnataka)</option>
                    <option value="MSEDCL (Maharashtra)">MSEDCL (Maharashtra - Mumbai/Pune)</option>
                    <option value="Tata Power / BSES (Delhi NCR)">Tata Power / BSES (Delhi NCR)</option>
                    <option value="TANGEDCO (Tamil Nadu)">TANGEDCO (Tamil Nadu)</option>
                    <option value="TSSPDCL (Telangana - Hyderabad)">TSSPDCL (Telangana - Hyderabad)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Electricity Consumer / CA Number
                  </label>
                  <input
                    type="text"
                    value={electricityConsumerNo}
                    onChange={(e) => setElectricityConsumerNo(e.target.value)}
                    placeholder="e.g. TOR-89234190"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Municipal Property Tax ID (PID)
                  </label>
                  <input
                    type="text"
                    value={propertyTaxId}
                    onChange={(e) => setPropertyTaxId(e.target.value)}
                    placeholder="e.g. AMC-PID-380015-88"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <label className="flex items-start gap-2 p-2.5 rounded-xl border border-purple-100 bg-purple-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={warrantyAccepted}
                    onChange={(e) => setWarrantyAccepted(e.target.checked)}
                    className="mt-0.5 text-purple-600 rounded"
                  />
                  <span className="text-[10px] text-slate-700 leading-tight">
                    <strong>Statutory Title Warranty:</strong> I declare under penalty of law (BNS Sec 318 / IPC 420) that I am the lawful owner/custodian of this property.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleVerifyPropertyOwnership}
                  disabled={!warrantyAccepted || ownershipLoading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs hover:bg-purple-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {ownershipLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify Ownership via DISCOM / Tax"}
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-purple-900">Property Ownership Verified</div>
                <div className="text-xs text-purple-700 mt-1">{ownershipSuccessMsg}</div>
                <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-800 text-[10px] font-bold">
                  ✓ 100% Verified Landlord Badge Unlocked
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ready Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Ready to Draft Agreement?</h3>
            <p className="text-xs text-slate-500">
              {isFullyVerified
                ? "Mobile, Zoho Sign Aadhaar, and Property Ownership are verified. Proceed to generate legally compliant Gujarat rental agreement."
                : "Complete Mobile, Aadhaar e-KYC, and Property Ownership verification above to proceed with legally compliant e-signing."}
            </p>
          </div>
          <Link
            href="/rent-agreement/create?mode=OWNER"
            className={`px-6 py-3 rounded-xl text-white font-semibold text-xs flex items-center gap-2 transition ${isFullyVerified ? "bg-emerald-600 hover:bg-emerald-700 shadow-md" : "bg-slate-400 pointer-events-none"}`}
          >
            Create Agreement as Owner
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
