"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  FileCheck2,
  Lock,
  Search,
  UserCheck,
  Building,
  Info,
  BadgeCheck,
} from "lucide-react";

export default function VerificationHubPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* Top Banner: Sandbox Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs md:text-sm text-amber-800 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              SANDBOX / TEST MODE
            </span>
            <span>
              Simulated UIDAI authentication test environment for development. Not a real government verification.
            </span>
          </div>
          <span className="hidden md:inline text-amber-700/80">Test OTP: 123456</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Digital Identity & e-KYC Verification
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Aadhaar & Mobile Verification Portal
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl text-sm md:text-base">
              Secure, UIDAI sandbox-compliant identity authentication for Gujarat E-Rent Agreements.
              Separate verification streams for mobile phone authentication and Aadhaar e-KYC credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/verification/status"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition shadow-sm"
            >
              <Search className="w-4 h-4 text-slate-400" />
              Check Status
            </Link>
            <Link
              href="/verification/aadhaar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-500/20"
            >
              Start Aadhaar e-KYC
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Core Distinction: Mobile vs Aadhaar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            Important Architectural Distinction
          </div>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            In compliance with statutory requirements and UIDAI circulars, mobile number verification and Aadhaar
            identity authentication operate through completely independent rails. Ordinary mobile OTP verification does
            NOT constitute government Aadhaar e-KYC verification.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Mobile Rail */}
            <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Mobile Phone Verification</h3>
                    <p className="text-xs text-slate-500">SMS OTP Authentication</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-3 h-3" />
                  Mobile: ✓ Verified
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Validates contact reachable via 6-digit SMS OTP</li>
                <li>Used for real-time agreement lifecycle notifications</li>
                <li>Does not certify legal legal identity under Aadhaar Act</li>
              </ul>
            </div>

            {/* Aadhaar Rail */}
            <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/40 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Aadhaar Identity / e-KYC</h3>
                    <p className="text-xs text-slate-500">UIDAI Gateway Authentication</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  <ShieldCheck className="w-3 h-3" />
                  Aadhaar/KYC: ✓ Verified
                </span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Cryptographic citizen identity verification via UIDAI OTP</li>
                <li>Requires explicit statutory user consent timestamp</li>
                <li>Enables legally binding digital e-Sign & e-Stamp execution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Portals Grid */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Dedicated Role Portals</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* General Citizen e-KYC */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Citizen Aadhaar e-KYC</h3>
              <p className="text-xs text-slate-500 mb-4">
                4-step guided verification with masked Aadhaar, explicit consent capture, and sandbox OTP simulation.
              </p>
              <div className="text-[11px] font-medium text-slate-400 mb-6 space-y-1">
                <div>• Format: XXXX-XXXX-1234 (Masked)</div>
                <div>• Session: 600 seconds TTL</div>
                <div>• UIDAI Sandbox Test Code: 123456</div>
              </div>
            </div>
            <Link
              href="/verification/aadhaar"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition"
            >
              Start Verification Flow
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Owner Portal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Property Owner Portal</h3>
              <p className="text-xs text-slate-500 mb-4">
                Verify landlord credentials before drafting rental deeds, executing e-stamping, and issuing invites.
              </p>
              <div className="text-[11px] font-medium text-slate-400 mb-6 space-y-1">
                <div>• Property ownership validation</div>
                <div>• Mobile + Aadhaar twin verification</div>
                <div>• Direct link to Agreement creation</div>
              </div>
            </div>
            <Link
              href="/owner/verification"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition"
            >
              Owner Verification
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tenant Portal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Tenant Portal</h3>
              <p className="text-xs text-slate-500 mb-4">
                Verify tenant identity for police verification compliance and Aadhaar counterparty e-signature.
              </p>
              <div className="text-[11px] font-medium text-slate-400 mb-6 space-y-1">
                <div>• Tenant KYC & police verification data</div>
                <div>• Counterparty review & eSign readiness</div>
                <div>• Secure audit certificate download</div>
              </div>
            </div>
            <Link
              href="/tenant/verification"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs hover:bg-purple-700 transition"
            >
              Tenant Verification
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Security & Safeguards Footer Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold">UIDAI Statutory Safeguards & Privacy Rules</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div>
              <span className="font-semibold text-white block mb-1">No Raw OTP Storage</span>
              Aadhaar OTPs are processed in-flight for authentication and immediately discarded. They are never written to
              databases or persistent application logs.
            </div>
            <div>
              <span className="font-semibold text-white block mb-1">Strict Masking Protection</span>
              Full 12-digit Aadhaar numbers are never stored unmasked. Only truncated representations
              (e.g., XXXX-XXXX-1234) are recorded for audit compliance.
            </div>
            <div>
              <span className="font-semibold text-white block mb-1">Explicit Consent Archival</span>
              Every transaction logs cryptographic consent timestamps, purpose versions, and IP audit trails under the IT
              Act 2000.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
