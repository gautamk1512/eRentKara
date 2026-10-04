"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText, ShieldCheck, CheckCircle2, ArrowRight,
  ArrowLeft, Building2, Home, User, Check,
  Lock, Download, Printer, Award, HelpCircle
} from "lucide-react";

function CreateAgreementContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "commercial" ? "COMMERCIAL" : "RESIDENTIAL";

  const [step, setStep] = useState(1);
  const [agreementType, setAgreementType] = useState<"RESIDENTIAL" | "COMMERCIAL">(initialType);

  // Form State
  const [formData, setFormData] = useState({
    // Property
    propertyAddress: "Flat 402, Green View Apartments, 12th Cross, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    propertyCategory: "2BHK Apartment",
    monthlyRent: "28000",
    securityDeposit: "84000",
    maintenanceCharge: "2500",
    lockInMonths: "6",
    noticePeriodDays: "30",

    // Landlord (First Party)
    landlordName: "Vikram Malhotra",
    landlordPhone: "+91 98765 43210",
    landlordEmail: "vikram.m@example.com",
    landlordAadhaar: "4589 1234 5678",
    landlordPan: "ABCDE1234F",

    // Tenant (Second Party)
    tenantName: "Aarav Sharma",
    tenantPhone: "+91 98123 45678",
    tenantEmail: "aarav.sharma@example.com",
    tenantAadhaar: "8912 3456 7890",
    tenantPan: "WXYZ9876K",

    // Terms
    agreementStartDate: "2026-10-01",
    tenancyMonths: "11",
    escalationPercent: "5",
    stampPaperAmount: "100",
  });

  const [isSigned, setIsSigned] = useState(false);
  const [signingLoading, setSigningLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifySign = () => {
    setSigningLoading(true);
    setTimeout(() => {
      setSigningLoading(false);
      setIsSigned(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/[0.08]">
          <div>
            <Link href="/" className="text-xs font-medium text-[#0071e3] hover:underline flex items-center space-x-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              Create {agreementType === "RESIDENTIAL" ? "Residential" : "Commercial"} Rent Agreement
            </h1>
            <p className="text-xs text-[#86868b] mt-0.5">
              Official Indian State Government e-Stamp Paper with Aadhaar OTP eSign
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-white text-[#1d1d1f] text-xs font-medium flex items-center space-x-1.5 border border-black/[0.06] shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
              <span>Legally Enforceable</span>
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { n: 1, label: "Property Details" },
            { n: 2, label: "Parties (KYC)" },
            { n: 3, label: "Terms & Rent" },
            { n: 4, label: "e-Stamp & eSign" },
          ].map((s) => (
            <div
              key={s.n}
              onClick={() => s.n < step && setStep(s.n)}
              className={`p-3 rounded-2xl border transition-all text-center ${
                step === s.n
                  ? "bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-blue-500/20"
                  : step > s.n
                  ? "bg-white text-[#1d1d1f] border-black/[0.08] cursor-pointer hover:border-black/[0.16]"
                  : "bg-white/60 text-[#86868b] border-black/[0.04]"
              }`}
            >
              <div className="text-[10px] font-medium uppercase tracking-wider">Step {s.n}</div>
              <div className="text-xs font-semibold truncate">{s.label}</div>
            </div>
          ))}
        </div>

        {/* STEP 1: Property Details */}
        {step === 1 && (
          <div className="apple-card p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-black/[0.06]">
              <h2 className="text-lg font-semibold text-[#1d1d1f]">Step 1: Property Information</h2>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setAgreementType("RESIDENTIAL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    agreementType === "RESIDENTIAL" ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
                  }`}
                >
                  Residential
                </button>
                <button
                  type="button"
                  onClick={() => setAgreementType("COMMERCIAL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    agreementType === "COMMERCIAL" ? "bg-[#1d1d1f] text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
                  }`}
                >
                  Commercial
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">
                  Full Property Address (As per electricity/property tax bill)
                </label>
                <input
                  type="text"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#0071e3] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#0071e3] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">State (for e-Stamp)</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] bg-[#f5f5f7] focus:ring-2 focus:ring-[#0071e3] focus:outline-none"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi NCT</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#0071e3] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Property Category</label>
                <input
                  type="text"
                  value={formData.propertyCategory}
                  onChange={(e) => handleInputChange("propertyCategory", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] focus:ring-2 focus:ring-[#0071e3] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="apple-btn-primary px-6 py-2.5 text-xs font-medium inline-flex items-center space-x-2"
              >
                <span>Continue to Parties (KYC)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Parties KYC */}
        {step === 2 && (
          <div className="apple-card p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-[#1d1d1f] pb-4 border-b border-black/[0.06]">
              Step 2: Landlord & Tenant KYC Details
            </h2>

            {/* Landlord Details */}
            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-3">
              <div className="flex items-center space-x-2 text-[#1d1d1f] font-semibold text-sm">
                <User className="w-4 h-4 text-[#0071e3]" />
                <span>First Party (Landlord / Owner)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.landlordName}
                    onChange={(e) => handleInputChange("landlordName", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-black/[0.1] text-xs text-[#1d1d1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Phone (Aadhaar linked)</label>
                  <input
                    type="text"
                    value={formData.landlordPhone}
                    onChange={(e) => handleInputChange("landlordPhone", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-black/[0.1] text-xs text-[#1d1d1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Aadhaar (Masked)</label>
                  <input
                    type="text"
                    value={formData.landlordAadhaar}
                    onChange={(e) => handleInputChange("landlordAadhaar", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-black/[0.1] text-xs text-[#1d1d1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>
            </div>

            {/* Tenant Details */}
            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04] space-y-3">
              <div className="flex items-center space-x-2 text-[#1d1d1f] font-semibold text-sm">
                <User className="w-4 h-4 text-[#0071e3]" />
                <span>Second Party (Tenant / Resident)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.tenantName}
                    onChange={(e) => handleInputChange("tenantName", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-black/[0.1] text-xs text-[#1d1d1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Phone (Aadhaar linked)</label>
                  <input
                    type="text"
                    value={formData.tenantPhone}
                    onChange={(e) => handleInputChange("tenantPhone", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-black/[0.1] text-xs text-[#1d1d1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#86868b] mb-1">Aadhaar (Masked)</label>
                  <input
                    type="text"
                    value={formData.tenantAadhaar}
                    onChange={(e) => handleInputChange("tenantAadhaar", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-black/[0.1] text-xs text-[#1d1d1f] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="apple-btn-secondary px-5 py-2 text-xs font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="apple-btn-primary px-6 py-2 text-xs font-medium inline-flex items-center space-x-2"
              >
                <span>Continue to Terms & Rent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Terms & Rent */}
        {step === 3 && (
          <div className="apple-card p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-[#1d1d1f] pb-4 border-b border-black/[0.06]">
              Step 3: Rent, Deposit & Tenancy Terms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm font-semibold text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => handleInputChange("securityDeposit", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm font-semibold text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Agreement Start Date</label>
                <input
                  type="date"
                  value={formData.agreementStartDate}
                  onChange={(e) => handleInputChange("agreementStartDate", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Duration (Months)</label>
                <select
                  value={formData.tenancyMonths}
                  onChange={(e) => handleInputChange("tenancyMonths", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] bg-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                >
                  <option value="11">11 Months (Standard Tenancy)</option>
                  <option value="22">22 Months</option>
                  <option value="33">33 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Annual Escalation (%)</label>
                <input
                  type="number"
                  value={formData.escalationPercent}
                  onChange={(e) => handleInputChange("escalationPercent", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  value={formData.noticePeriodDays}
                  onChange={(e) => handleInputChange("noticePeriodDays", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs sm:text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="apple-btn-secondary px-5 py-2 text-xs font-medium"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="apple-btn-primary px-6 py-2 text-xs font-medium inline-flex items-center space-x-2"
              >
                <span>Preview e-Stamp Deed & Sign</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Live e-Stamp Deed & eSign */}
        {step === 4 && (
          <div className="space-y-6">
            
            {/* Deed Document Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/[0.1] shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Top Watermark & State Stamp Header */}
              <div className="p-6 rounded-2xl bg-[#1d1d1f] text-white text-center space-y-2 relative border border-white/10">
                <div className="w-10 h-10 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#d2d2d7] block">
                  GOVERNMENT OF INDIA • NON-JUDICIAL e-STAMP CERTIFICATE
                </span>
                <div className="flex justify-center space-x-6 text-[10px] font-mono text-[#86868b]">
                  <span>Certificate No: IN-KA89042890123L</span>
                  <span>Stamp Duty Paid: ₹{formData.stampPaperAmount}</span>
                  <span>Issued for: Tenancy Agreement</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#1d1d1f] tracking-wide uppercase">
                  {agreementType === "RESIDENTIAL" ? "Residential Rent Agreement" : "Commercial Lease Agreement"}
                </h3>
                <p className="text-xs text-[#86868b] mt-1">
                  Executed under the Registration Act 1908 & Model Tenancy Act
                </p>
              </div>

              {/* Deed Content */}
              <div className="space-y-4 text-xs text-[#1d1d1f] leading-relaxed border-t border-black/[0.06] pt-4">
                <p>
                  THIS AGREEMENT OF RENT is made on this <strong>{new Date().toLocaleDateString("en-IN")}</strong> at <strong>{formData.city}</strong> between:
                </p>
                
                <p className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04]">
                  <strong>1. {formData.landlordName}</strong> (hereinafter called the &ldquo;LESSOR / LANDLORD&rdquo;, which expression shall unless repugnant to the context include his heirs, legal representatives, and assigns) of the ONE PART.
                </p>

                <p className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04]">
                  <strong>2. {formData.tenantName}</strong> (hereinafter called the &ldquo;LESSEE / TENANT&rdquo;, which expression shall unless repugnant to the context include his heirs, legal representatives, and assigns) of the OTHER PART.
                </p>

                <div className="p-4 rounded-xl bg-[#f5f5f7] border border-black/[0.04] space-y-2">
                  <h4 className="font-semibold text-[#1d1d1f]">Key Tenancy Terms:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-[#86868b] text-[11px]">
                    <li><strong className="text-[#1d1d1f]">Premises:</strong> {formData.propertyAddress}, {formData.city}, {formData.state} - {formData.pincode}</li>
                    <li><strong className="text-[#1d1d1f]">Monthly Rent:</strong> ₹{Number(formData.monthlyRent).toLocaleString()} payable on or before 5th of each calendar month.</li>
                    <li><strong className="text-[#1d1d1f]">Security Deposit:</strong> ₹{Number(formData.securityDeposit).toLocaleString()} refundable upon peaceful handover.</li>
                    <li><strong className="text-[#1d1d1f]">Term:</strong> {formData.tenancyMonths} Months commencing from {formData.agreementStartDate}.</li>
                    <li><strong className="text-[#1d1d1f]">Annual Escalation:</strong> {formData.escalationPercent}% upon mutual renewal.</li>
                    <li><strong className="text-[#1d1d1f]">Notice Period:</strong> {formData.noticePeriodDays} days written notice by either party.</li>
                  </ul>
                </div>
              </div>

              {/* eSign Status Bar */}
              <div className="pt-4 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isSigned ? "bg-[#0071e3] text-white" : "bg-[#f5f5f7] text-[#86868b]"}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#1d1d1f] block">
                      {isSigned ? "Aadhaar eSign Completed & Sealed" : "eSign Authentication Pending"}
                    </span>
                    <span className="text-[10px] text-[#86868b]">
                      {isSigned ? "Legally validated with 256-bit Digital Signature" : "Both parties sign securely via Aadhaar OTP"}
                    </span>
                  </div>
                </div>

                {!isSigned ? (
                  <div className="flex items-center space-x-2">
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="apple-btn-primary px-5 py-2 text-xs font-medium"
                      >
                        Send Aadhaar OTP
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className="w-32 px-3 py-1.5 text-xs border border-black/[0.1] rounded-lg text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                        />
                        <button
                          type="button"
                          onClick={handleVerifySign}
                          disabled={signingLoading}
                          className="apple-btn-primary px-4 py-1.5 text-xs font-medium disabled:opacity-50"
                        >
                          {signingLoading ? "Signing..." : "Verify & Sign"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="apple-btn-secondary px-4 py-1.5 text-xs font-medium flex items-center space-x-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Agreement PDF downloaded successfully!")}
                      className="apple-btn-primary px-5 py-1.5 text-xs font-medium flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="apple-btn-secondary px-5 py-2 text-xs font-medium"
              >
                Back to Edit Terms
              </button>
              <Link
                href="/"
                className="apple-btn-primary px-5 py-2 text-xs font-medium"
              >
                Done • Back to Home
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function CreateAgreementPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Agreement Wizard...</div>}>
      <CreateAgreementContent />
    </React.Suspense>
  );
}
