"use client";

import React from "react";
import Link from "next/link";
import {
  Building2, Shield, FileCheck, CheckCircle2, Lock,
  HeartHandshake, Calculator, FileText, ArrowRight,
  Sparkles, Globe, Award, CheckCircle, ExternalLink, ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#f5f5f7] text-[#86868b] border-t border-[rgba(0,0,0,0.06)] text-sm font-sans overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Main Grid: 5 Rich Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Column 1: Brand & Purpose */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] flex items-center justify-center font-bold shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#1d1d1f]">
                  eRent<span className="text-[#0071e3]">Karar</span>
                </span>
                <span className="ml-1.5 text-[9px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-black/[0.05] text-[#1d1d1f]">
                  India
                </span>
              </div>
            </div>

            <p className="text-xs text-[#86868b] leading-relaxed max-w-sm">
              {t("footer.desc", "India's dual powerhouse for rentals: Official state government e-Stamping & digital rent agreements, plus complete cloud operating software for PG, hostel, and property managers with automated UPI rent collection.")}
            </p>

            {/* Status & Compliance Pill */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white border border-[rgba(0,0,0,0.08)] text-[#1d1d1f] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34a853] animate-pulse" />
                <span>All Systems Operational (99.98%)</span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white border border-[rgba(0,0,0,0.08)] text-[#86868b] font-medium">
                <Shield className="w-3 h-3 text-[#0071e3]" />
                <span>{t("footer.compliance", "Model Tenancy Act 2021 & IT Act 2000 Compliant")}</span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                href="/rent-agreement/create?mode=OWNER&type=residential"
                className="apple-btn-primary inline-flex items-center space-x-1.5 px-4 py-2 text-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t("nav.create_agreement", "Create Agreement")}</span>
              </Link>
              <Link
                href="/rental"
                className="apple-btn-secondary inline-flex items-center space-x-1.5 px-4 py-2 text-xs"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Explore Rental SaaS</span>
              </Link>
            </div>
          </div>

          {/* Column 2: e-Stamping & Agreement Platform */}
          <div>
            <h4 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>e-Stamp & Agreements</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#86868b]">
              <li>
                <Link href="/agreement/create?type=residential" className="hover:text-[#0071e3] transition">
                  Residential 11-Month Deed
                </Link>
              </li>
              <li>
                <Link href="/agreement/create?type=commercial" className="hover:text-[#0071e3] transition">
                  Commercial Lease Agreement
                </Link>
              </li>
              <li>
                <Link href="/#hero" className="hover:text-[#0071e3] transition">
                  State e-Stamp Verification
                </Link>
              </li>
              <li>
                <Link href="/#hero" className="hover:text-[#0071e3] transition">
                  Aadhaar OTP eSign Portal
                </Link>
              </li>
              <li>
                <Link href="/#kiosk" className="hover:text-[#0071e3] transition">
                  Kiosk Assisted Centers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#0071e3] transition">
                  Legal Validity in India
                </Link>
              </li>
              <li>
                <Link href="/guide?tab=agreement" className="hover:text-[#0071e3] transition font-semibold text-[#0071e3]">
                  Agreement User Manual
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Rental Management SaaS */}
          <div>
            <h4 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Rental Management SaaS</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#86868b]">
              <li>
                <Link href="/dashboard" className="hover:text-[#0071e3] transition font-medium text-[#1d1d1f]">
                  Owner Dashboard & Portal
                </Link>
              </li>
              <li>
                <Link href="/tenant" className="hover:text-[#0071e3] transition font-medium text-[#1d1d1f]">
                  Tenant Portal & UPI Pay
                </Link>
              </li>
              <li>
                <Link href="/rental" className="hover:text-[#0071e3] transition">
                  PG & Hostel Operating OS
                </Link>
              </li>
              <li>
                <Link href="/guide?tab=rental" className="hover:text-emerald-700 transition font-semibold text-emerald-700">
                  Rental OS User Manual
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[#0071e3] transition">
                  Zero Brokerage Marketplace
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-[#0071e3] transition">
                  Electricity Sub-Meter Engine
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#0071e3] transition">
                  Plans & Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Free Rental Tools Hub */}
          <div>
            <h4 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <Calculator className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>8+ Free Rental Tools</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#86868b]">
              <li><Link href="/tools/rent-receipt-generator" className="hover:text-[#0071e3] transition">HRA Rent Receipt Generator</Link></li>
              <li><Link href="/tools/rent-agreement-generator" className="hover:text-[#0071e3] transition">11-Month Agreement Draft</Link></li>
              <li><Link href="/tools/electricity-bill-calculator" className="hover:text-[#0071e3] transition">Electricity Sub-Meter Calc</Link></li>
              <li><Link href="/tools/tenant-police-verification-form-generator" className="hover:text-[#0071e3] transition">Police Verification PDF</Link></li>
              <li><Link href="/tools/tenant-kyc-admission-form-generator" className="hover:text-[#0071e3] transition">PG Admission Form</Link></li>
              <li><Link href="/tools/move-out-settlement-calculator" className="hover:text-[#0071e3] transition">Deposit Refund Settlement</Link></li>
              <li><Link href="/tools" className="text-[#0071e3] font-semibold hover:underline">View All 8+ Free Tools →</Link></li>
            </ul>
          </div>

        </div>

        {/* Trust Badges Bar — Clean Apple Surface */}
        <div className="py-5 px-6 rounded-2xl bg-white border border-[rgba(0,0,0,0.08)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#86868b] mb-8 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center shrink-0 border border-[rgba(0,0,0,0.06)]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#1d1d1f] block">Bank-Grade 256-bit AES</span>
              <span className="text-[11px] text-[#86868b]">End-to-end encrypted document vault</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center shrink-0 border border-[rgba(0,0,0,0.06)]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#1d1d1f] block">Official State e-Stamp</span>
              <span className="text-[11px] text-[#86868b]">Valid non-judicial stamp duty certificates</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center shrink-0 border border-[rgba(0,0,0,0.06)]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[#1d1d1f] block">0% Brokerage Direct Platform</span>
              <span className="text-[11px] text-[#86868b]">100% verified owners & tenants</span>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="pt-6 border-t border-[rgba(0,0,0,0.06)] text-[11px] text-[#86868b] leading-normal flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span>© {new Date().getFullYear()} eRentKarar.com. All rights reserved.</span>
            <span>•</span>
            <span>Crafted with ❤️ in India</span>
          </div>

          <div className="flex flex-wrap gap-4 text-[#86868b]">
            <Link href="/about" className="hover:text-[#0071e3] transition">About Us</Link>
            <Link href="/contact" className="hover:text-[#0071e3] transition">Contact</Link>
            <Link href="/blog" className="hover:text-[#0071e3] transition">Blog</Link>
            <Link href="/faq" className="hover:text-[#0071e3] transition">Terms & Conditions</Link>
            <Link href="/faq" className="hover:text-[#0071e3] transition">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
