"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home, Building2, Shield, CheckCircle2, ArrowRight,
  FileText, Lock, Sparkles, Search, Store,
  Zap, Download, Check, ChevronDown, ChevronUp,
  MapPin, HelpCircle, User, Phone, ShieldCheck,
  CheckCircle, Globe, Award, FileCheck, Users,
  Laptop, ExternalLink, X, Calendar, Stamp, PenLine,
  UserCheck, PhoneCall, QrCode, Calculator, Clock, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiveAutoTicker from "@/components/LiveAutoTicker";
import { useLanguage } from "@/context/LanguageContext";
import MotionVideoTour from "@/components/MotionVideoTour";

export default function LandingPage() {
  const { t } = useLanguage();
  // Toggle between Residential and Commercial
  const [agreementType, setAgreementType] = useState<"RESIDENTIAL" | "COMMERCIAL">("RESIDENTIAL");

  // Document Preview Tab: "AGREEMENT" or "AFFIDAVIT"
  const [docTab, setDocTab] = useState<"AGREEMENT" | "AFFIDAVIT">("AGREEMENT");

  // Agreement Status Tracking Modal
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // Kiosk Modal
  const [kioskModalOpen, setKioskModalOpen] = useState(false);
  const [kioskCity, setKioskCity] = useState("Bengaluru");

  // FAQ open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackingLoading(true);
    setTimeout(() => {
      setTrackingLoading(false);
      setTrackResult({
        id: trackQuery.toUpperCase().startsWith("ERK") ? trackQuery.toUpperCase() : "ERK-AGR-2026-9042",
        type: agreementType === "RESIDENTIAL" ? "Residential 11-Month Tenancy Agreement" : "Commercial Office Lease Agreement",
        parties: "Vikram Malhotra (Landlord) & Aarav Sharma (Tenant)",
        status: "eSign Pending (1 of 2 signed)",
        stampPaper: "₹100 Non-Judicial e-Stamp Paper Generated (Govt of India)",
        date: "27 September 2026",
      });
    }, 500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqsCol1 = [
    {
      q: "Is the digital agreement legally valid in Indian courts?",
      a: "Yes. eRentKarar agreements strictly follow the Registration Act 1908 and Model Tenancy Act 2021. They are affixed with authentic state government non-judicial e-Stamp certificates and executed via Aadhaar OTP eSign under Section 3A of the Information Technology Act 2000.",
    },
    {
      q: "What documents are required for Aadhaar eSign?",
      a: "Both landlord and tenant only need their Aadhaar number and active mobile number linked with Aadhaar to receive the UIDAI OTP. Property address proof (electricity bill or property tax receipt) is used to verify premises details.",
    },
    {
      q: "How long does drafting and delivery take?",
      a: "Drafting takes under 5 minutes online. Once both parties verify details and complete Aadhaar OTP eSign, the stamped and sealed agreement PDF is delivered instantly to email and WhatsApp.",
    },
    {
      q: "Can I generate a Tenancy Affidavit along with the Agreement?",
      a: "Yes. eRentKarar allows you to generate both the standard 11-month Lease Deed and the Notarized Tenancy Undertaking Affidavit (Self-Declaration) required by societies and authorities.",
    },
  ];

  const faqsCol2 = [
    {
      q: "Do you support commercial lease agreements?",
      a: "Yes. We support all commercial spaces including retail shops, corporate offices, warehouses, and showrooms with custom escalation terms, lock-in clauses, and GST invoicing.",
    },
    {
      q: "How do I verify the authenticity of an executed agreement?",
      a: "Every document contains an official e-Stamp certificate number with a verifiable QR code. Anyone can scan the QR or use our 'Check Status' tool to verify the live registry record.",
    },
    {
      q: "What if I need physical assistance or offline printing?",
      a: "You can walk into any of our 150+ authorized eRentKarar partner kiosks located in major hubs for assisted verification, biometric KYC, and instant physical prints.",
    },
    {
      q: "Is my personal data and Aadhaar number safe?",
      a: "We adhere to ISO 27001 standards and UIDAI data protection rules. All Aadhaar numbers are masked, documents are encrypted with AES-256 at rest and in transit, and biometric data is never stored.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans selection:bg-[#0071e3] selection:text-white relative">
      
      {/* =========================================================================
          1. HERO SECTION: Clean Apple Aesthetic (apple.com/in/iphone)
          ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#f5f5f7] via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 space-y-7"
            >
              {/* Minimal Pill Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.08] text-[#1d1d1f] text-xs font-medium tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
                  <span>{t("hero.badge", "Official Government e-Stamp & Rental OS")}</span>
                </div>
                <Link
                  href="/rent-agreement-ai"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 hover:shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span>{t("hero.ai_badge", "AI Real-time Studio Live")}</span>
                  <ArrowRight className="w-3 h-3 text-blue-600" />
                </Link>
              </div>

              {/* Status Notice: Agreement Studio Upgrade & Rental OS Live */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 flex items-start gap-3 text-xs shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-amber-950">We are working on this page — Agreement starts soon!</span>
                    <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Rental OS Live
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Rental OS &amp; PG/Hostel Onboarding is active. Property owners and tenants can start onboarding, add rooms/beds, and collect rent online.
                  </p>
                  <div className="pt-0.5">
                    <Link href="/rental" className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 text-[11px]">
                      <span>Go to Rental OS &amp; Start Onboarding</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main Heading - Apple Precision Typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1d1d1f] tracking-tight leading-[1.08]">
                {t("hero.title_part1", "Rent Agreement.")} <br />
                <span className="text-[#86868b]">{t("hero.title_part2", "Made Simple & Legal.")}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#86868b] leading-relaxed max-w-xl font-normal">
                {t("hero.subtitle", "Create, sign, and execute residential and commercial rent agreements online — fast, secure, Aadhaar eSigned, and 100% legally enforceable across India.")}
              </p>

              {/* Apple Segmented Control: [ Residential ] [ Commercial ] */}
              <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full border border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setAgreementType("RESIDENTIAL")}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    agreementType === "RESIDENTIAL"
                      ? "bg-white text-[#1d1d1f] shadow-xs"
                      : "text-[#86868b] hover:text-[#1d1d1f]"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>{t("hero.residential", "Residential")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAgreementType("COMMERCIAL")}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    agreementType === "COMMERCIAL"
                      ? "bg-white text-[#1d1d1f] shadow-xs"
                      : "text-[#86868b] hover:text-[#1d1d1f]"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{t("hero.commercial", "Commercial")}</span>
                </button>
              </div>

              {/* Two Apple CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/rent-agreement-ai"
                  className="px-6 py-3 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md hover:shadow-lg hover:brightness-105 transition-all inline-flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>{t("hero.cta_ai", "Draft with Rent Agreement AI")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`/rent-agreement/create?mode=OWNER&type=${agreementType.toLowerCase()}`}
                  className="apple-btn-secondary px-5 py-3 text-sm font-medium inline-flex items-center space-x-2"
                >
                  <span>{t("hero.cta_classic", "Classic Form")}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("motion-tour-section");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="apple-btn-secondary px-5 py-3 text-sm font-medium inline-flex items-center space-x-2 cursor-pointer bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Watch Motion Tour</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrackingModalOpen(true)}
                  className="apple-btn-secondary px-5 py-3 text-sm font-medium inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#86868b]" />
                  <span>{t("hero.cta_status", "Check Status")}</span>
                </button>
              </div>

              {/* 4 Feature Checks in a single row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-black/[0.08] text-xs text-[#86868b]">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-[#1d1d1f] shrink-0" />
                  <span className="text-[#1d1d1f] font-medium">{t("hero.feat_online", "100% Online")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#1d1d1f] shrink-0" />
                  <span className="text-[#1d1d1f] font-medium">{t("hero.feat_stamp", "Govt e-Stamp")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-[#1d1d1f] shrink-0" />
                  <span className="text-[#1d1d1f] font-medium">{t("hero.feat_esign", "Aadhaar eSign")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#1d1d1f] shrink-0" />
                  <span className="text-[#1d1d1f] font-medium">{t("hero.feat_pan", "PAN India")}</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Live Real-Time Affidavit & Agreement Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="lg:col-span-6 relative flex flex-col items-center"
            >
              {/* Document Type Switcher Tabs */}
              <div className="w-full max-w-lg mb-3 flex items-center justify-between px-1">
                <div className="inline-flex p-1 bg-[#f5f5f7] rounded-full border border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setDocTab("AGREEMENT")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      docTab === "AGREEMENT"
                        ? "bg-white text-[#1d1d1f] shadow-xs"
                        : "text-[#86868b] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {t("doc.tab_agreement", "11-Month Agreement")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocTab("AFFIDAVIT")}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      docTab === "AFFIDAVIT"
                        ? "bg-white text-[#1d1d1f] shadow-xs"
                        : "text-[#86868b] hover:text-[#1d1d1f]"
                    }`}
                  >
                    {t("doc.tab_affidavit", "Legal Affidavit")}
                  </button>
                </div>

                <div className="text-[11px] text-[#86868b] font-medium flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0071e3] animate-pulse" />
                  <span>Live Preview</span>
                </div>
              </div>

              {/* Authentic Pristine Legal Document Card */}
              <div className="w-full max-w-lg bg-white rounded-2xl border border-black/[0.1] shadow-2xl shadow-black/[0.08] overflow-hidden text-[#1d1d1f]">
                
                {/* Top Official State Header Band - Apple Obsidian with Silver Accent */}
                <div className="bg-[#1d1d1f] text-white p-4 relative border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                        <Award className="w-4 h-4 text-[#f5f5f7]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-white/90 block">
                          GOVERNMENT OF INDIA
                        </span>
                        <span className="text-[8px] text-[#86868b] uppercase tracking-wider block">
                          {docTab === "AGREEMENT" ? "e-Stamp Certificate • Non-Judicial" : "Notarized Affidavit • Sworn Undertaking"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-white font-medium text-[9px] border border-white/15">
                        ₹500 Duty Paid
                      </span>
                      <span className="text-[8px] font-mono text-[#86868b] block mt-1">
                        IN-DL89204189024X
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document Metadata Strip */}
                <div className="bg-[#f5f5f7] border-b border-black/[0.06] px-4 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-mono text-[#86868b]">
                  <div>
                    <span className="text-[8px] text-[#86868b] block uppercase">Reference</span>
                    <span className="font-semibold text-[#1d1d1f]">SUBIN-DL904281</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#86868b] block uppercase">Issued Date</span>
                    <span className="font-semibold text-[#1d1d1f]">27-Sep-2026</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#86868b] block uppercase">First Party</span>
                    <span className="font-semibold text-[#1d1d1f] truncate block">Vikram Malhotra</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#86868b] block uppercase">Second Party</span>
                    <span className="font-semibold text-[#1d1d1f] truncate block">Aarav Sharma</span>
                  </div>
                </div>

                {/* Document Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {docTab === "AGREEMENT" ? (
                    <>
                      {/* Title */}
                      <div className="text-center pb-3 border-b border-black/[0.06]">
                        <h4 className="text-sm font-semibold tracking-wide text-[#1d1d1f] uppercase">
                          {agreementType === "RESIDENTIAL" ? "Residential Rental Agreement" : "Commercial Lease Agreement"}
                        </h4>
                        <span className="text-[10px] text-[#86868b] block mt-0.5">
                          Under the Model Tenancy Act & Indian Registration Act, 1908
                        </span>
                      </div>

                      {/* Parties Summary Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                        <div className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04]">
                          <span className="text-[9px] font-medium text-[#86868b] uppercase block">
                            Lessor / Landlord
                          </span>
                          <span className="font-semibold text-[#1d1d1f] block mt-0.5">Mr. Vikram Malhotra</span>
                          <span className="text-[10px] text-[#86868b]">Koramangala, Bengaluru • KYC Verified</span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04]">
                          <span className="text-[9px] font-medium text-[#86868b] uppercase block">
                            Lessee / Tenant
                          </span>
                          <span className="font-semibold text-[#1d1d1f] block mt-0.5">Mr. Aarav Sharma</span>
                          <span className="text-[10px] text-[#86868b]">Software Engineer • Aadhaar Verified</span>
                        </div>
                      </div>

                      {/* Premises & Rent Terms Box */}
                      <div className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04] text-[11px] space-y-1.5">
                        <div className="flex justify-between items-center font-medium text-[#1d1d1f]">
                          <span>{agreementType === "RESIDENTIAL" ? "Premises: Flat 402, Green View Apts, BLR" : "Premises: Suite 204, Cyber Heights, GGN"}</span>
                          <span className="text-[#0071e3] font-semibold">
                            {agreementType === "RESIDENTIAL" ? "₹28,000 / mo" : "₹75,000 / mo"}
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] text-[#86868b] pt-1 border-t border-black/[0.06]">
                          <span>Tenure: {agreementType === "RESIDENTIAL" ? "11 Months" : "36 Months (3-Yr Lock-in)"}</span>
                          <span>Security Deposit: {agreementType === "RESIDENTIAL" ? "₹84,000" : "₹2,25,000"}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* AFFIDAVIT TAB CONTENT */}
                      <div className="text-center pb-3 border-b border-black/[0.06]">
                        <h4 className="text-sm font-semibold tracking-wide text-[#1d1d1f] uppercase">
                          Affidavit & Tenancy Undertaking
                        </h4>
                        <span className="text-[10px] text-[#86868b] block mt-0.5">
                          Sworn before Notary Public under the Notaries Act, 1952
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04] text-[11px] leading-relaxed text-[#1d1d1f] space-y-2">
                        <p>
                          <strong>I, Aarav Sharma</strong>, S/o K. Sharma, residing at Unit #402, Green View Apartments, Bengaluru, do hereby solemnly affirm and declare on oath:
                        </p>
                        <p className="text-[#86868b] text-[10px]">
                          1. That the leased property shall be used exclusively for peaceful residential occupancy.
                        </p>
                        <p className="text-[#86868b] text-[10px]">
                          2. That I undertake compliance with all society bylaws, electricity consumption, and civic guidelines.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-between text-[10px] text-[#86868b]">
                        <span>Notary Reg No: NOT/2026/KA-8910</span>
                        <span className="font-semibold text-[#1d1d1f]">Attested & Sealed</span>
                      </div>
                    </>
                  )}

                  {/* Verification Footer: Notary Seal, Aadhaar eSign, QR Code */}
                  <div className="pt-3 flex items-center justify-between border-t border-black/[0.08]">
                    {/* Seal & UIDAI verification */}
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full border border-black/[0.2] bg-[#f5f5f7] text-[#1d1d1f] flex flex-col items-center justify-center p-0.5 text-center leading-none shadow-xs">
                        <span className="text-[6px] font-bold uppercase tracking-tight">INDIA</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3] my-0.5" />
                        <span className="text-[5.5px] font-bold uppercase">SEALED</span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-1 text-[#1d1d1f] font-medium text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0071e3]" />
                          <span>Aadhaar OTP eSigned</span>
                        </div>
                        <span className="text-[9px] text-[#86868b] block font-mono">
                          UIDAI Verified: 27-Sep-2026
                        </span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="text-right flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1d1d1f] text-white flex items-center justify-center text-[7px] font-mono font-bold">
                        QR
                      </div>
                      <div className="hidden sm:block text-left">
                        <span className="text-[8px] font-semibold text-[#1d1d1f] uppercase block">
                          Verified
                        </span>
                        <span className="text-[7px] text-[#86868b] font-mono block">
                          erentkarar.com/v/9042
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Quick Action */}
              <div className="mt-4 flex items-center space-x-4 text-xs">
                <Link
                  href="/tools/rent-agreement-generator"
                  className="text-[#0071e3] hover:underline flex items-center space-x-1 font-medium"
                >
                  <span>Open Free 11-Month Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[#86868b]">•</span>
                <Link
                  href="/rent-agreement/create?mode=OWNER&type=residential"
                  className="text-[#1d1d1f] hover:text-[#0071e3] font-medium"
                >
                  Create Legal Deed
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          MOTION VIDEO WALKTHROUGH & INTERACTIVE TOUR SECTION
          ========================================================================= */}
      <section id="motion-tour-section" className="py-6 bg-slate-900/5 border-y border-black/[0.06] scroll-mt-10">
        <MotionVideoTour />
      </section>

      {/* =========================================================================
          2. TRUST BAR: Clean Apple Neutral Strip
          ========================================================================= */}
      <section className="bg-[#f5f5f7] border-y border-black/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="text-center lg:text-left">
              <span className="text-sm font-semibold text-[#1d1d1f] block">
                Trusted by 50,000+ Landlords,
              </span>
              <span className="text-xs text-[#86868b] font-normal">
                Tenants & Property Managers across India
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-black/[0.06]">
                  <ShieldCheck className="w-4 h-4 text-[#1d1d1f]" />
                </div>
                <span className="text-xs font-medium text-[#1d1d1f]">
                  State Treasury<br />e-Stamp Paper
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-black/[0.06]">
                  <Lock className="w-4 h-4 text-[#1d1d1f]" />
                </div>
                <span className="text-xs font-medium text-[#1d1d1f]">
                  Bank-Grade<br />AES-256 Encryption
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-black/[0.06]">
                  <CheckCircle className="w-4 h-4 text-[#1d1d1f]" />
                </div>
                <span className="text-xs font-medium text-[#1d1d1f]">
                  Aadhaar eSign<br />IT Act Valid
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-black/[0.06]">
                  <Globe className="w-4 h-4 text-[#1d1d1f]" />
                </div>
                <span className="text-xs font-medium text-[#1d1d1f]">
                  PAN India<br />28 States Covered
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          DIGITAL E-RENT AGREEMENT PLATFORM: 3 CREATION MODES & ACTION CARDS
          ========================================================================= */}
      <section className="py-16 bg-white border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.08] text-[#1d1d1f] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
              <span>Gujarat & PAN-India Digital e-Rent Platform</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
              Create Your Legal Deed in 3 Simple Modes
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] max-w-2xl mx-auto">
              Choose your role below. Owner and Tenant maintain independent authentication and separate digital signing tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mode A: Owner Self Service */}
            <Link
              href="/rent-agreement/create?mode=OWNER"
              className="group p-6 rounded-3xl bg-[#f5f5f7] border border-black/[0.06] hover:border-[#0071e3] hover:shadow-xl hover:shadow-[#0071e3]/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.08] flex items-center justify-center text-[#0071e3] shadow-xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0071e3]">Mode A • Landlord</span>
                  <h3 className="text-lg font-bold text-[#1d1d1f] mt-0.5 group-hover:text-[#0071e3] transition">
                    I&apos;m an Owner
                  </h3>
                  <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
                    Draft agreement, define rent & covenants, and send a one-time secure link for your tenant to review & sign.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-semibold text-[#0071e3]">
                <span>Create as Owner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Mode B: Tenant Self Service */}
            <Link
              href="/rent-agreement/create?mode=TENANT"
              className="group p-6 rounded-3xl bg-[#f5f5f7] border border-black/[0.06] hover:border-[#34a853] hover:shadow-xl hover:shadow-[#34a853]/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.08] flex items-center justify-center text-[#34a853] shadow-xs group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#34a853]">Mode B • Tenant</span>
                  <h3 className="text-lg font-bold text-[#1d1d1f] mt-0.5 group-hover:text-[#34a853] transition">
                    I&apos;m a Tenant
                  </h3>
                  <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
                    Create your rental deed draft, enter owner contact, and invite your landlord to verify & execute online.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-semibold text-[#34a853]">
                <span>Create as Tenant</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Mode C: Assisted / Kiosk Service */}
            <Link
              href="/rent-agreement/create?mode=SHOP"
              className="group p-6 rounded-3xl bg-[#f5f5f7] border border-black/[0.06] hover:border-[#f59e0b] hover:shadow-xl hover:shadow-[#f59e0b]/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.08] flex items-center justify-center text-[#f59e0b] shadow-xs group-hover:scale-105 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">Mode C • Assisted</span>
                  <h3 className="text-lg font-bold text-[#1d1d1f] mt-0.5 group-hover:text-[#f59e0b] transition">
                    I Need Help / Kiosk
                  </h3>
                  <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
                    Assisted service by authorized Seva Kendra operators across Gujarat. No impersonation; parties sign independently.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-semibold text-[#f59e0b]">
                <span>Assisted Service</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Action 4: Received an Invitation / Verify */}
            <div className="p-6 rounded-3xl bg-white border border-black/[0.08] shadow-md shadow-black/[0.03] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] flex items-center justify-center text-[#1d1d1f] shadow-xs">
                  <QrCode className="w-6 h-6 text-[#0071e3]" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">Action • Sign or Verify</span>
                  <h3 className="text-lg font-bold text-[#1d1d1f] mt-0.5">
                    Have a Token or ID?
                  </h3>
                  <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
                    Received an invitation link from your counterparty or want to verify an issued deed certificate?
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-black/[0.06] space-y-2">
                <Link
                  href="/rent-agreement"
                  className="w-full py-2 px-3 rounded-xl bg-[#1d1d1f] text-white hover:bg-black text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Track & Verify Deed</span>
                </Link>
                <Link
                  href="/rent-agreement"
                  className="w-full py-2 px-3 rounded-xl bg-[#f5f5f7] hover:bg-black/[0.06] text-[#1d1d1f] text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-black/[0.06]"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Stamp Duty Calculator</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. REAL-TIME ACTIVITY STREAM
          ========================================================================= */}
      <LiveAutoTicker />

      {/* =========================================================================
          4. EVERYTHING YOU NEED: Clean Apple Card Grid (Unified, No Rainbow)
          ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-semibold text-[#86868b] tracking-wider uppercase">
              End-to-End Execution
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Everything You Need for a Legal Agreement.
            </h2>
            <p className="text-base text-[#86868b]">
              From digital drafting to notarization, every step is unified and legally compliant.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="apple-card p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                  <Zap className="w-5 h-5 text-[#0071e3]" />
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
                  Instant
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">
                  Fast & Guided
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed mt-1.5">
                  Complete your agreement in minutes with our intelligent, step-by-step drafting wizard.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="apple-card p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                  <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
                  Legally Valid
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">
                  Government Format
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed mt-1.5">
                  Official state format with authentic non-judicial e-stamp paper and Aadhaar eSign support.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="apple-card p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                  <Lock className="w-5 h-5 text-[#0071e3]" />
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
                  Bank-Grade
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">
                  Secure & Private
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed mt-1.5">
                  Your identity documents and agreements are protected by 256-bit encryption and masked Aadhaar.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="apple-card p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f]">
                  <FileText className="w-5 h-5 text-[#0071e3]" />
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f]">
                  Cloud Vault
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1d1d1f]">
                  Manage Online
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed mt-1.5">
                  Access, track, download, and renew all your agreements anytime from a single dashboard.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS: 4 Minimal Apple Steps
          ========================================================================= */}
      <section className="py-20 bg-[#f5f5f7] border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-semibold text-[#86868b] tracking-wider uppercase">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              How It Works
            </h2>
            <p className="text-base text-[#86868b]">
              Get your legally executed rent agreement delivered in four effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                Enter Details
              </h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Fill in property information, landlord and tenant particulars, and tenancy terms online.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                Verify Parties
              </h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Instant identity validation for both parties via secure Aadhaar OTP integration.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                Sign & Stamp
              </h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Official non-judicial state e-stamp paper generated with dual Aadhaar digital signatures.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold flex items-center justify-center">
                4
              </div>
              <h3 className="text-base font-semibold text-[#1d1d1f]">
                Download PDF
              </h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Download the court-ready stamped PDF instantly on your dashboard, email, and WhatsApp.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          6. RESIDENTIAL VS COMMERCIAL: Apple Showcase Cards
          ========================================================================= */}
      <section id="residential" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: Residential Agreement */}
            <div className="apple-card-surface p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-5">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-black/[0.05] text-[#1d1d1f]">
                  Most Popular
                </span>

                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                    Residential Agreement
                  </h3>
                  <p className="text-xs text-[#86868b]">
                    Tailored for apartments, independent houses, PGs, hostels, and shared flats.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#1d1d1f] pt-1">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Houses & Apartments (1BHK, 2BHK, 3BHK+)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>PG / Hostel & Co-Living Room Deeds</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Standard 11-Month Tenancy with MTA Clauses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Optional Tenant Undertaking Affidavit</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link
                    href="/agreement/create?type=residential"
                    className="apple-btn-primary px-6 py-2.5 text-xs font-medium inline-flex items-center space-x-2"
                  >
                    <span>Create Residential Agreement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 h-48 rounded-2xl overflow-hidden border border-black/[0.08]">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                  alt="Modern Residential Property"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 2: Commercial Agreement */}
            <div id="commercial" className="apple-card-surface p-8 sm:p-10 flex flex-col justify-between">
              <div className="space-y-5">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-black/[0.05] text-[#1d1d1f]">
                  Commercial Grade
                </span>

                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                    Commercial Lease Agreement
                  </h3>
                  <p className="text-xs text-[#86868b]">
                    Configured for retail shops, corporate offices, warehouses, and industrial units.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#1d1d1f] pt-1">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Retail Shops & Commercial Showrooms</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Corporate Offices & Coworking Leases</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Multi-Year Tenures (1 to 5 Years) & Lock-in</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>GST Invoicing, Sub-metering & Maintenance</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link
                    href="/agreement/create?type=commercial"
                    className="apple-btn-primary px-6 py-2.5 text-xs font-medium inline-flex items-center space-x-2"
                  >
                    <span>Create Commercial Agreement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 h-48 rounded-2xl overflow-hidden border border-black/[0.08]">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                  alt="Modern Commercial Office"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          7. DUAL PERSONA: Owners vs Tenants
          ========================================================================= */}
      <section className="py-20 bg-[#f5f5f7] border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: Owners */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.06] flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                  Benefits for Owners
                </h3>
                <p className="text-xs text-[#86868b]">
                  Automate compliance, collect rent on time, and protect your assets.
                </p>

                <ul className="space-y-2.5 text-xs text-[#1d1d1f] pt-2">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Manage multiple properties and tenants from one login</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Auto-generate monthly rent invoices with UPI QR codes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Pre-draft renewal agreements with 5-10% escalation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Store legally enforceable e-stamped deeds in secure cloud</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link
                    href="/login?role=OWNER"
                    className="apple-btn-secondary px-5 py-2 text-xs font-medium inline-flex items-center space-x-2"
                  >
                    <span>Start as Owner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Tenants */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.06] flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#1d1d1f]">
                  Benefits for Tenants
                </h3>
                <p className="text-xs text-[#86868b]">
                  Execute your rental lease in minutes without visiting local notary offices.
                </p>

                <ul className="space-y-2.5 text-xs text-[#1d1d1f] pt-2">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Aadhaar OTP eSign from anywhere on phone or laptop</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Instant valid HRA rent receipts for income tax proof</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Pre-filled police tenant verification documentation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Download signed copies anytime on email & WhatsApp</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link
                    href="/login?role=TENANT"
                    className="apple-btn-secondary px-5 py-2 text-xs font-medium inline-flex items-center space-x-2"
                  >
                    <span>Start as Tenant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          8. KIOSK ASSISTANCE
          ========================================================================= */}
      <section id="kiosk" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="apple-card p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-[#f5f5f7] text-[#1d1d1f]">
                  In-Person Service
                </span>
                
                <h3 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                  Kiosk Partner Network
                </h3>

                <p className="text-xs text-[#86868b] leading-relaxed">
                  Need assistance with your documentation? Walk into any of our 150+ verified partner kiosks across Bengaluru, Mumbai, Delhi NCR, and Hyderabad for in-person biometric KYC and instant e-stamp printing.
                </p>

                <ul className="space-y-2 text-xs text-[#1d1d1f]">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Assisted Aadhaar biometric scanning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Physical notary stamping & color printout</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Transparent government fee schedule</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setKioskModalOpen(true)}
                    className="apple-btn-secondary px-5 py-2.5 text-xs font-medium inline-flex items-center space-x-2"
                  >
                    <span>Locate a Nearby Kiosk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 h-64 sm:h-80 rounded-2xl overflow-hidden border border-black/[0.08] relative">
                <img
                  src="/images/kiosk_operator.jpg"
                  alt="eRentKarar Kiosk Assistance"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium px-3.5 py-1 rounded-full">
                  150+ Partner Kiosks Active
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. SIMPLE & TRANSPARENT PRICING: Unified Apple Cards
          ========================================================================= */}
      <section id="pricing" className="py-20 bg-[#f5f5f7] border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-semibold text-[#86868b] tracking-wider uppercase">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Simple, Upfront Pricing.
            </h2>
            <p className="text-base text-[#86868b]">
              No hidden fees, no brokerage commissions. Only transparent state compliance fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Plan 1 */}
            <div className="bg-white rounded-3xl p-8 border border-black/[0.08] flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-medium text-[#86868b] uppercase tracking-wide">
                  Residential
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">
                    Rent Agreement
                  </h3>
                  <div className="mt-3 flex items-baseline space-x-1">
                    <span className="text-3xl font-semibold text-[#1d1d1f]">₹ 999</span>
                    <span className="text-xs text-[#86868b]">/ agreement</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[#1d1d1f] pt-4 border-t border-black/[0.06]">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>State non-judicial e-Stamp paper</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Dual Aadhaar OTP eSignatures</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Instant digital delivery + WhatsApp</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/agreement/create?type=residential"
                  className="apple-btn-secondary w-full block text-center py-2.5 text-xs font-medium"
                >
                  Create Residential Deed
                </Link>
              </div>
            </div>

            {/* Plan 2 - Highlighted */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#0071e3] shadow-lg flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0071e3] text-white text-[10px] font-medium">
                Business Grade
              </div>

              <div className="space-y-4">
                <span className="text-xs font-medium text-[#86868b] uppercase tracking-wide">
                  Commercial
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">
                    Commercial Lease
                  </h3>
                  <div className="mt-3 flex items-baseline space-x-1">
                    <span className="text-3xl font-semibold text-[#1d1d1f]">₹ 1,499</span>
                    <span className="text-xs text-[#86868b]">/ agreement</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-[#1d1d1f] pt-4 border-t border-black/[0.06]">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>High-value e-Stamp duty remitted</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>Custom business & lock-in clauses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-[#0071e3] shrink-0" />
                    <span>GST invoicing + Tenancy Affidavit</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/agreement/create?type=commercial"
                  className="apple-btn-primary w-full block text-center py-2.5 text-xs font-medium"
                >
                  Create Commercial Deed
                </Link>
              </div>
            </div>

            {/* Plan 3 */}
            <div className="bg-white rounded-3xl p-8 border border-black/[0.08] flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-medium text-[#86868b] uppercase tracking-wide">
                  Assistance
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">
                    Kiosk & Support
                  </h3>
                  <p className="text-xs text-[#86868b] mt-2">
                    Walk-in physical service or dedicated phone assistance.
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] text-xs text-[#1d1d1f] space-y-1">
                  <p className="text-[#86868b]">Helpline:</p>
                  <p className="font-semibold text-sm">+91 98765 43210</p>
                  <p className="text-[11px] text-[#86868b]">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/contact"
                  className="apple-btn-secondary w-full block text-center py-2.5 text-xs font-medium"
                >
                  Contact Support
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          10. FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-14 space-y-2">
            <span className="text-xs font-semibold text-[#86868b] tracking-wider uppercase">
              Common Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              Frequently Asked Questions.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            
            {/* Column 1 */}
            <div className="space-y-3">
              {faqsCol1.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-black/[0.08] rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-medium text-xs sm:text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#86868b] shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#86868b] shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#86868b] leading-relaxed border-t border-black/[0.04] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              {faqsCol2.map((faq, idx) => {
                const globalIdx = idx + 4;
                const isOpen = openFaq === globalIdx;
                return (
                  <div
                    key={globalIdx}
                    className="border border-black/[0.08] rounded-2xl overflow-hidden transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(globalIdx)}
                      className="w-full flex items-center justify-between p-4 text-left font-medium text-xs sm:text-sm text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#86868b] shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#86868b] shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-[#86868b] leading-relaxed border-t border-black/[0.04] pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          11. BOTTOM SHOWCASE: Apple Obsidian Banner (No Purple Glow)
          ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-[#000000] text-white p-8 sm:p-14 border border-white/10 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                <Award className="w-3.5 h-3.5 text-[#0071e3]" />
                <span>Legally Enforceable Pan-India</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight text-[#f5f5f7]">
                Create Your Rental Agreement Today.
              </h2>

              <p className="text-sm sm:text-base text-[#86868b] leading-relaxed">
                Join over 50,000 satisfied landlords and tenants across India. Draft, verify, sign with Aadhaar OTP, and receive your court-compliant deed in minutes.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/agreement/create?type=residential"
                  className="apple-btn-primary px-7 py-3 text-sm font-medium inline-flex items-center space-x-2"
                >
                  <span>Start Residential Deed</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/tools/rent-agreement-generator"
                  className="apple-btn-secondary !bg-white/10 !text-white hover:!bg-white/20 !border-white/15 px-6 py-3 text-sm font-medium"
                >
                  <span>Free 11-Month Generator</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          TRACKING MODAL
          ========================================================================= */}
      <AnimatePresence>
        {trackingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-black/[0.08] shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setTrackingModalOpen(false)}
                className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full hover:bg-[#f5f5f7]"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                Check Agreement Status
              </h3>
              <p className="text-xs text-[#86868b] mt-1">
                Enter your Agreement ID (e.g. ERK-AGR-9042) or registered phone number.
              </p>

              <form onSubmit={handleTrackSubmit} className="mt-5 space-y-4">
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="e.g. ERK-AGR-2026-9042 or 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />

                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="apple-btn-primary w-full py-2.5 text-xs font-medium"
                >
                  {trackingLoading ? "Searching registry..." : "Track Status"}
                </button>
              </form>

              {trackResult && (
                <div className="mt-5 p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] text-xs space-y-2">
                  <div className="flex justify-between font-semibold text-[#1d1d1f]">
                    <span>{trackResult.id}</span>
                    <span className="text-[#0071e3]">{trackResult.status}</span>
                  </div>
                  <p className="text-[#86868b]">{trackResult.type}</p>
                  <p className="text-[#1d1d1f] font-medium">{trackResult.parties}</p>
                  <p className="text-[11px] text-[#86868b]">{trackResult.stampPaper}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          KIOSK FINDER MODAL
          ========================================================================= */}
      <AnimatePresence>
        {kioskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-black/[0.08] shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setKioskModalOpen(false)}
                className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full hover:bg-[#f5f5f7]"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-semibold text-[#1d1d1f]">
                Find an Authorized Kiosk
              </h3>
              <p className="text-xs text-[#86868b] mt-1">
                Select your city to find an in-person assistance center.
              </p>

              <div className="mt-5 space-y-4">
                <select
                  value={kioskCity}
                  onChange={(e) => setKioskCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-black/[0.1] text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7]"
                >
                  <option value="Bengaluru">Bengaluru (42 Kiosks)</option>
                  <option value="Mumbai">Mumbai (38 Kiosks)</option>
                  <option value="Delhi NCR">Delhi NCR (45 Kiosks)</option>
                  <option value="Hyderabad">Hyderabad (25 Kiosks)</option>
                  <option value="Pune">Pune (18 Kiosks)</option>
                </select>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-black/[0.04] text-xs">
                    <div className="font-semibold text-[#1d1d1f]">Kiosk #108 — HSR Layout Sector 2</div>
                    <div className="text-[11px] text-[#86868b]">Near BDA Complex • Open 9:30 AM to 7:00 PM</div>
                    <div className="text-[11px] text-[#0071e3] font-medium mt-1">Biometric Aadhaar & Non-Judicial Printing Available</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f5f5f7] border border-black/[0.04] text-xs">
                    <div className="font-semibold text-[#1d1d1f]">Kiosk #142 — Indiranagar 100ft Road</div>
                    <div className="text-[11px] text-[#86868b]">Opposite Metro Pillar #48 • Open 10:00 AM to 7:30 PM</div>
                    <div className="text-[11px] text-[#0071e3] font-medium mt-1">Commercial Deed & Notary Attestation</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
