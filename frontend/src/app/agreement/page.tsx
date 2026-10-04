"use client";

import React from "react";
import Link from "next/link";
import {
  FileText, ShieldCheck, CheckCircle2, ArrowRight,
  Building2, Home, Sparkles, Scale, Stamp, Clock, Check
} from "lucide-react";

export default function AgreementIndexPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-[#f5f5f7] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center border-b border-black/[0.05]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-black/[0.08] text-[11px] font-medium text-[#1d1d1f] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
            <span>State Government Compliant • IT Act 2000</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]">
            Online Rent <span className="text-[#0071e3]">Agreement</span>
          </h1>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
            Legally valid rental deeds with official state e-Stamp, bi-party Aadhaar OTP eSign, and instant PDF download in under 5 minutes.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/agreement/create?type=residential"
              className="apple-btn-primary px-6 py-3 text-sm flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Draft Residential Deed (₹399)</span>
            </Link>
            <Link
              href="/agreement/create?type=commercial"
              className="apple-btn-secondary px-6 py-3 text-sm flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Draft Commercial Lease (₹799)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">
            Why 50,000+ Indians Trust eRentKarar Agreements
          </h2>
          <p className="text-sm text-[#86868b] mt-2">
            No physical stamp paper queues. No lawyer haggling. 100% court admissible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="apple-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
              <Stamp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1d1d1f]">Official State e-Stamp</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Integrated with SHCIL & state treasuries (Karnataka, Maharashtra, Delhi, UP, Tamil Nadu, Telangana and more). Unique verifiable certificate number on every deed.
            </p>
            <ul className="text-xs space-y-2 text-[#1d1d1f] pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0071e3]" /> Non-Judicial Stamp Paper
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0071e3]" /> Verified by GRAS / Treasury
              </li>
            </ul>
          </div>

          <div className="apple-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1d1d1f]">UIDAI Aadhaar OTP eSign</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Sign remotely from phone or computer in 60 seconds. Section 5 of IT Act 2000 grants UIDAI eSign equal status to handwritten physical signatures.
            </p>
            <ul className="text-xs space-y-2 text-[#1d1d1f] pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0071e3]" /> Landlord & Tenant Remote Sign
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0071e3]" /> Cryptographic Audit Trail
              </li>
            </ul>
          </div>

          <div className="apple-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1d1d1f]">Model Tenancy Act (MTA) 2021</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Vetted by High Court advocates with balanced clauses for security deposits, maintenance liabilities, dispute redressal, and notice periods.
            </p>
            <ul className="text-xs space-y-2 text-[#1d1d1f] pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0071e3]" /> Protects Both Parties
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0071e3]" /> Standardized Legal Clauses
              </li>
            </ul>
          </div>
        </div>

        {/* Action Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#1d1d1f] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-[#f5f5f7]">Ready to create your legal deed?</h3>
            <p className="text-xs text-[#86868b] max-w-lg">
              Takes just 3 simple steps: enter details, verify via Aadhaar OTP, and download your stamped agreement.
            </p>
          </div>
          <Link
            href="/agreement/create?type=residential"
            className="apple-btn-primary px-8 py-3 text-sm shrink-0 flex items-center gap-2"
          >
            <span>Start Draft Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
