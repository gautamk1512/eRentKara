"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck, FileText, CheckCircle2, Stamp, Sparkles,
  ArrowRight, Calculator, Truck, Scale, Building2, Store,
  AlertTriangle, RefreshCw, XCircle, Award, HelpCircle,
  FileCheck, ChevronRight, Moon, Sun, Lock
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RentAgreementPricingPage() {
  const { t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [deposit, setDeposit] = useState(30000);
  const [durationMonths, setDurationMonths] = useState(11);
  const [includeESign, setIncludeESign] = useState(true);
  const [includeNotary, setIncludeNotary] = useState(false);
  const [includeCourier, setIncludeCourier] = useState(false);
  const [includeKioskAssist, setIncludeKioskAssist] = useState(false);

  // Initialize theme from preference
  useEffect(() => {
    const isDark = localStorage.getItem("erk_theme") === "dark";
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("erk_theme", next ? "dark" : "light");
  };

  // Gujarat Stamp Duty statutory calculation
  // Formula: Under Article 30, Gujarat Stamp Act
  // Duration <= 11/12 months: Fixed ₹300
  // Duration > 12 months: 0.5% to 1.0% of average annual rent + deposit fraction
  const calculateGovtDuty = () => {
    if (durationMonths <= 11) {
      return 300;
    }
    const annualRent = monthlyRent * 12;
    const consideration = annualRent + (deposit * 0.1);
    const calculated = Math.round(consideration * 0.005);
    return Math.max(300, calculated);
  };

  const govtDuty = calculateGovtDuty();
  const eStampServiceFee = 110; // CRA / SHCIL gateway fee
  const eSignFee = includeESign ? 98 : 0; // ₹49 owner + ₹49 tenant
  const platformFee = 199;
  const notaryFee = includeNotary ? 249 : 0;
  const courierFee = includeCourier ? 149 : 0;
  const kioskFee = includeKioskAssist ? 99 : 0;

  const taxableServices = platformFee + eStampServiceFee + eSignFee + notaryFee + courierFee + kioskFee;
  const gst = Math.round(taxableServices * 0.18);
  const grandTotal = govtDuty + taxableServices + gst;

  const products = [
    {
      id: "draft",
      badge: "Self-Service",
      title: "1. Rent Agreement Draft",
      price: "₹149",
      desc: "Instant lawyer-approved legal draft with standard Gujarat clauses. Self-print on your own stamp paper.",
      features: [
        "Instant PDF & Word Document",
        "Statutory Gujarat Tenancy Clauses",
        "Police Verification & Society NOC Template",
        "Free 30-Day Edit Window"
      ],
      href: "/rent-agreement/create?mode=OWNER&product=DRAFT",
      highlight: false
    },
    {
      id: "estamp",
      badge: "Govt Certified",
      title: "2. Agreement + Gujarat eStamp",
      price: "₹449 + Stamp",
      desc: "Deed merged with official Gujarat Government non-judicial e-Stamp certificate from authorized CRA.",
      features: [
        "Government Non-Judicial e-Stamp Certificate",
        "Official GRAS Unique Certificate Number",
        "Merged High-Res Executive Legal PDF",
        "QR Code Verification Enabled"
      ],
      href: "/rent-agreement/create?mode=OWNER&product=ESTAMP",
      highlight: false
    },
    {
      id: "full_digital",
      badge: "Most Popular",
      title: "3. eStamp + Dual Aadhaar eSign",
      price: "₹599 + Stamp",
      desc: "100% paperless execution. Official Gujarat e-Stamp plus CCA-compliant Aadhaar OTP eSign for Owner & Tenant.",
      features: [
        "Gujarat State e-Stamp Certificate Included",
        "Dual Aadhaar OTP eSign (Owner + Tenant)",
        "IT Act 2000 & Section 65B Audit Trail",
        "SHA-256 Tamper-Proof Cryptographic Hash",
        "Legal Validity in Any Indian Court"
      ],
      href: "/rent-agreement/create?mode=OWNER&product=FULL_DIGITAL",
      highlight: true
    },
    {
      id: "notary",
      badge: "Legal Attested",
      title: "4. Digital Deed + Notary Attestation",
      price: "₹849 + Stamp",
      desc: "Complete digital deed with authorized advocate notary attestation and registered notary entry stamp.",
      features: [
        "Everything in Tier 3 (eStamp + Aadhaar eSign)",
        "Verified State Notary Advocate Review",
        "Digital Notary Seal & Serial Log Entry",
        "Priority 2-Hour Turnaround"
      ],
      href: "/rent-agreement/create?mode=OWNER&product=NOTARY",
      highlight: false
    },
    {
      id: "kiosk",
      badge: "Walk-in Assisted",
      title: "5. Assisted Kiosk / Shop Agreement",
      price: "₹349 + Stamp",
      desc: "Visit your local cybercafe or CSC partner. The operator assists data entry; parties sign independently.",
      features: [
        "Assisted Data Entry by Authorized Center",
        "Zero-Risk: Independent Owner & Tenant OTP",
        "Document Scanning & Photo Upload",
        "Instant Physical Printout Provided"
      ],
      href: "/shop/dashboard",
      highlight: false
    },
    {
      id: "ai_renew",
      badge: "AI Powered",
      title: "6. AI Agreement Renewal",
      price: "₹399 + Stamp",
      desc: "Upload previous year's agreement. Our AI/OCR extracts rent and terms, updates dates, and creates a fresh deed.",
      features: [
        "Instant PDF/Image OCR Extraction",
        "1-Click Rent & Security Deposit Revision",
        "Preserves Historical Tenure Clauses",
        "New Gujarat e-Stamp & Digital Signatures"
      ],
      href: "/rent-agreement/old-agreement",
      highlight: false
    },
    {
      id: "advocate",
      badge: "High-Value Custom",
      title: "7. Custom Advocate Agreement",
      price: "₹1,499",
      desc: "Tailored for luxury properties, commercial shops, or complex leases. Drafted directly by a senior property advocate.",
      features: [
        "Commercial & High-Value Residential Leases",
        "1-on-1 Consultation with Advocate",
        "Custom Indemnity & Arbitration Clauses",
        "Lock-In & Escalation Governance"
      ],
      href: "/rent-agreement/create?mode=OWNER&product=ADVOCATE",
      highlight: false
    },
    {
      id: "cancel",
      badge: "Tenancy Exit",
      title: "8. Mutual Agreement Cancellation",
      price: "₹349",
      desc: "Legally close an ongoing lease deed. Documents security deposit refund, property handover, and zero-liability.",
      features: [
        "Mutual Vacating & Surrender Deed",
        "Deposit Settlement & Utility Clearance Log",
        "Dual-Party Aadhaar eSign Confirmation",
        "Prevents Future Dispute or Arrears Claims"
      ],
      href: "/rent-agreement/create?product=CANCEL",
      highlight: false
    },
    {
      id: "notice",
      badge: "Legal Action",
      title: "9. Legal Notice to Vacate / Default",
      price: "₹699",
      desc: "Formal advocate-drafted statutory legal notice for unpaid rent arrears, breach of agreement terms, or eviction.",
      features: [
        "Drafted on Advocate Letterhead",
        "Statutory 15-Day / 30-Day Notice Period",
        "Dispatched via Registered AD & Digital Copy",
        "Pre-requisite for Eviction Proceedings"
      ],
      href: "/rent-agreement/create?product=LEGAL_NOTICE",
      highlight: false
    },
    {
      id: "courier",
      badge: "Physical Bond",
      title: "10. Doorstep Speed Post Delivery",
      price: "₹149",
      desc: "Receive your executed deed printed on official government watermarked bond paper, delivered right to your door.",
      features: [
        "Printed on 100 GSM Bond Legal Paper",
        "Hard-Bound Presentation Folder",
        "Dispatched via Speed Post / Blue Dart",
        "Live Real-Time Tracking Link Provided"
      ],
      href: "/rent-agreement/create?product=COURIER",
      highlight: false
    }
  ];

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

      {/* Hero Header */}
      <section className="py-14 sm:py-20 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 mb-5">
          <Scale className="w-3.5 h-3.5" />
          <span>{t("pricing.badge", "Statutory Gujarat Stamp Act 1958 & Article 30 Compliant")}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
          {t("pricing.title", "Transparent, Zero-Hidden-Fee")} <br />
          <span className="text-[#0071e3]">{t("pricing.title_highlight", "Rent Agreement Pricing")}</span>
        </h1>
        <p className={`text-base sm:text-lg max-w-2xl mx-auto ${darkMode ? "text-[#86868b]" : "text-[#86868b]"}`}>
          {t("pricing.subtitle", "From self-service drafts to full digital Aadhaar eSign, official Gujarat CRA e-Stamping, and doorstep physical bond delivery.")}
        </p>
      </section>

      {/* Section 44: Interactive Transparent Fee Breakdown Calculator */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className={`rounded-3xl p-6 sm:p-10 border transition-all ${
          darkMode ? "bg-[#1c1c1e] border-white/10 shadow-2xl" : "bg-white border-black/[0.08] shadow-lg"
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-black/[0.08] dark:border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0071e3] uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>{t("pricing.calc_badge", "Statutory Fee Estimator")}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mt-1">{t("pricing.calc_heading", "Live Transparent Gujarat Stamp Duty & Service Calculator")}</h2>
              <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? "text-[#86868b]" : "text-[#86868b]"}`}>
                {t("pricing.calc_sub", "Backend verified calculation with itemized breakdown per Gujarat Revenue Department rules.")}
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] font-bold text-sm shrink-0 self-start md:self-auto">
              Gujarat (GJ) State
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Left Inputs */}
            <div className="lg:col-span-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-2">{t("pricing.calc_monthly_rent", "Monthly Rent (₹)")}</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                    darkMode
                      ? "bg-[#2c2c2e] border-white/10 text-white focus:border-[#0071e3]"
                      : "bg-[#f5f5f7] border-black/10 text-black focus:border-[#0071e3]"
                  }`}
                  min={1000}
                  step={500}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-2">{t("pricing.calc_deposit", "Security Deposit (₹)")}</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                      darkMode
                        ? "bg-[#2c2c2e] border-white/10 text-white focus:border-[#0071e3]"
                        : "bg-[#f5f5f7] border-black/10 text-black focus:border-[#0071e3]"
                    }`}
                    min={0}
                    step={1000}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2">{t("pricing.calc_duration", "Agreement Duration (Months)")}</label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                      darkMode
                        ? "bg-[#2c2c2e] border-white/10 text-white focus:border-[#0071e3]"
                        : "bg-[#f5f5f7] border-black/10 text-black focus:border-[#0071e3]"
                    }`}
                  >
                    <option value={11}>11 Months (Standard)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                  </select>
                </div>
              </div>

              {/* Service Add-ons checkboxes */}
              <div className="pt-2 space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#86868b]">{t("pricing.calc_optional_services", "Optional Service Add-ons")}</span>
                <label className="flex items-center justify-between p-3 rounded-xl border border-black/[0.06] dark:border-white/10 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={includeESign}
                      onChange={(e) => setIncludeESign(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0071e3]"
                    />
                    <span className="text-xs font-medium">{t("pricing.addon_esign", "Dual Aadhaar OTP eSign (Owner + Tenant) - ₹98")}</span>
                  </div>
                  <span className="text-xs font-bold text-[#0071e3]">₹98</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-black/[0.06] dark:border-white/10 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={includeNotary}
                      onChange={(e) => setIncludeNotary(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0071e3]"
                    />
                    <span className="text-xs font-medium">{t("pricing.addon_notary", "State Notary Advocate Attestation - ₹249")}</span>
                  </div>
                  <span className="text-xs font-bold text-[#0071e3]">₹249</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-black/[0.06] dark:border-white/10 cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={includeCourier}
                      onChange={(e) => setIncludeCourier(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0071e3]"
                    />
                    <span className="text-xs font-medium">{t("pricing.addon_courier", "Doorstep Speed Post Delivery (Bond Paper) - ₹149")}</span>
                  </div>
                  <span className="text-xs font-bold text-[#0071e3]">₹149</span>
                </label>
              </div>
            </div>

            {/* Right Itemized Breakdown (Point 20 & 44 Requirement) */}
            <div className={`lg:col-span-6 rounded-2xl p-6 flex flex-col justify-between ${
              darkMode ? "bg-[#252528]" : "bg-[#f5f5f7]"
            }`}>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#86868b] mb-4">
                  {t("pricing.breakdown", "Itemized Transparent Checkout Bill")}
                </h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span>{t("pricing.govt_duty", "1. Gujarat Govt Stamp Duty (Statutory Article 30)")}</span>
                    <span className="font-semibold">₹{govtDuty.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t("pricing.provider_fee", "2. eStamp CRA / SHCIL Provider Gateway Fee")}</span>
                    <span className="font-semibold">₹{eStampServiceFee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t("pricing.addon_esign", "3. Aadhaar eSign (Owner + Tenant)")}</span>
                    <span className="font-semibold">{includeESign ? `₹${eSignFee}` : "₹0"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t("pricing.platform_fee", "4. Platform Legal Technology & Archival Fee")}</span>
                    <span className="font-semibold">₹{platformFee}</span>
                  </div>
                  {includeNotary && (
                    <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400">
                      <span>5. State Notary Advocate Attestation</span>
                      <span className="font-semibold">₹{notaryFee}</span>
                    </div>
                  )}
                  {includeCourier && (
                    <div className="flex justify-between items-center text-teal-600 dark:text-teal-400">
                      <span>6. Doorstep Speed Post Physical Dispatch</span>
                      <span className="font-semibold">₹{courierFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[#86868b] pt-1">
                    <span>7. GST (18%)</span>
                    <span className="font-medium">₹{gst}</span>
                  </div>
                </div>

                <div className="my-5 border-t border-black/10 dark:border-white/10" />

                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#86868b]">{t("pricing.grand_total", "Total Payable")}</span>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      ✓ No Hidden Charges • 100% Refund Guarantee
                    </div>
                  </div>
                  <span className="text-3xl font-extrabold text-[#0071e3]">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/rent-agreement/create"
                  className="w-full apple-btn-primary !py-3.5 !rounded-2xl text-center flex items-center justify-center gap-2 text-sm font-bold shadow-md hover:scale-[1.01] transition-transform"
                >
                  <span>{t("pricing.cta_create", "Start Official Agreement Now")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-center text-[#86868b] mt-2.5">
                  Calculated dynamically via eRentKarar statutory engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 45: 10 eDrafter-Style Product Layers */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            10 Purpose-Built Legal Product Layers
          </h2>
          <p className={`text-sm sm:text-base ${darkMode ? "text-[#86868b]" : "text-[#86868b]"}`}>
            Choose the exact package tailored for your tenancy situation — from self-drafting to advocate advisory and legal notices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className={`rounded-3xl p-6 sm:p-7 border flex flex-col justify-between relative transition-all duration-200 hover:-translate-y-1 ${
                prod.highlight
                  ? "border-[#0071e3] ring-2 ring-[#0071e3]/20 shadow-xl " + (darkMode ? "bg-[#1c1c1e]" : "bg-white")
                  : darkMode
                  ? "bg-[#18181b] border-white/10 hover:border-white/20"
                  : "bg-white border-black/[0.08] hover:border-black/20 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    prod.highlight
                      ? "bg-[#0071e3] text-white"
                      : "bg-[#0071e3]/10 text-[#0071e3]"
                  }`}>
                    {prod.badge}
                  </span>
                  <span className="text-lg font-black text-[#1d1d1f] dark:text-white">
                    {prod.price}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight mb-2">{prod.title}</h3>
                <p className={`text-xs leading-relaxed mb-6 ${darkMode ? "text-[#a1a1a6]" : "text-[#6e6e73]"}`}>
                  {prod.desc}
                </p>

                <div className="space-y-2.5 mb-8">
                  {prod.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={prod.href}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  prod.highlight
                    ? "bg-[#0071e3] text-white hover:bg-[#0077ed]"
                    : darkMode
                    ? "bg-[#2c2c2e] text-white hover:bg-[#3a3a3c]"
                    : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                }`}
              >
                <span>Select Package</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-16 border-t ${darkMode ? "bg-[#121214] border-white/10" : "bg-white border-black/[0.06]"}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-[#86868b] mt-1">Everything you need to know about Gujarat e-Stamping and Aadhaar eSign legalities</p>
          </div>

          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-[#1c1c1e] border-white/10" : "bg-[#f5f5f7] border-black/[0.06]"}`}>
              <h3 className="font-bold text-sm mb-1.5">Is a digital Aadhaar eSigned agreement legally valid in Gujarat courts?</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Yes. Under Section 10A of the Information Technology Act 2000 and Section 65B of the Indian Evidence Act, Aadhaar OTP-based electronic signatures provided by CCA-licensed certifying authorities hold equal legal standing to physical ink signatures.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-[#1c1c1e] border-white/10" : "bg-[#f5f5f7] border-black/[0.06]"}`}>
              <h3 className="font-bold text-sm mb-1.5">Why does Gujarat require a ₹300 stamp duty for 11-month rent agreements?</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Under Article 30 of Schedule I of the Gujarat Stamp Act, residential tenancy agreements where the term does not exceed 11 months carry a statutory non-judicial stamp duty of ₹300. Agreements with terms exceeding 12 months require fractional consideration duty and mandatory sub-registrar registration.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-[#1c1c1e] border-white/10" : "bg-[#f5f5f7] border-black/[0.06]"}`}>
              <h3 className="font-bold text-sm mb-1.5">Can our local cybercafe or Xerox shop sign the agreement for us?</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Strictly NO. Kiosks and shop operators only assist in typing details and scanning documents. Under UIDAI and CCA security compliance, Owner and Tenant must each independently verify their own mobile OTP and perform their own Aadhaar eSign.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
