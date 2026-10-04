"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileText, Building2, ShieldCheck, CheckCircle2,
  Users, Key, Smartphone, Stamp, Sparkles, ArrowRight,
  Search, BookOpen, AlertCircle, HelpCircle, Download,
  Printer, Bot, Check, ChevronDown, ChevronRight,
  ExternalLink, Bed, Wrench, IndianRupee, Layers, Eye
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function GuideContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") === "rental" ? "rental" : "agreement";
  
  const [activeTab, setActiveTab] = useState<"agreement" | "rental">(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "agr-ch1": true,
    "agr-ch2": true,
    "agr-ch3": true,
    "rent-ch1": true,
    "rent-ch2": true,
    "rent-ch3": true,
  });

  const { t, lang } = useLanguage();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "rental" || tabParam === "agreement") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tab: "agreement" | "rental") => {
    setActiveTab(tab);
    router.replace(`/guide?tab=${tab}`);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1d1d1f] font-sans antialiased pb-24">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-black/[0.06] sticky top-[64px] z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-[#86868b]">
            <Link href="/" className="hover:text-[#0071e3] transition">Home</Link>
            <span>/</span>
            <span className="font-semibold text-[#1d1d1f]">User Manual & Knowledge Base</span>
            <span>/</span>
            <span className="text-[#0071e3] font-medium uppercase tracking-wider text-[11px]">
              {activeTab === "agreement" ? "Rent Agreement Manual" : "Rental Management OS Manual"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/[0.1] hover:border-black/[0.2] bg-white text-xs font-semibold text-[#1d1d1f] transition shadow-2xs hover:bg-[#f5f5f7]"
            >
              <Printer className="w-3.5 h-3.5 text-[#86868b]" />
              <span>Print / Save PDF</span>
            </button>
            <Link
              href={activeTab === "agreement" ? "/rent-agreement-ai" : "/dashboard"}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-bold transition shadow-xs"
            >
              <span>{activeTab === "agreement" ? "Open Agreement Studio" : "Open Owner Dashboard"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Banner with Modern Capsule Switcher */}
      <section className="bg-gradient-to-b from-white to-[#f5f5f7] border-b border-black/[0.06] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-xs font-bold border border-[#0071e3]/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>eRentKarar Operational Knowledge Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1d1d1f] max-w-3xl mx-auto leading-tight">
            Comprehensive User Manual & Workflow Guides
          </h1>

          <p className="text-sm sm:text-base text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            Step-by-step instructions for registering accounts, drafting legal rent agreements with state stamp duty, and running end-to-end PG, hostel & co-living property operations.
          </p>

          {/* Primary Two-Sided Tab Switcher */}
          <div className="pt-2 flex justify-center">
            <div className="p-1.5 bg-black/[0.05] rounded-2xl inline-flex gap-1 border border-black/[0.06] shadow-inner max-w-xl w-full">
              <button
                type="button"
                onClick={() => switchTab("agreement")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === "agreement"
                    ? "bg-white text-[#1d1d1f] shadow-sm border border-black/[0.06]"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTab === "agreement" ? "text-[#0071e3]" : "text-[#86868b]"}`} />
                <span>1. Rent Agreement Manual</span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("rental")}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                  activeTab === "rental"
                    ? "bg-white text-[#1d1d1f] shadow-sm border border-black/[0.06]"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                <Building2 className={`w-4 h-4 ${activeTab === "rental" ? "text-emerald-600" : "text-[#86868b]"}`} />
                <span>2. Rental Management OS Manual</span>
              </button>
            </div>
          </div>

          {/* Search Input Filter */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#86868b] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder={activeTab === "agreement" ? "Search agreement topics (e.g. stamp duty, eSign, Aadhaar, Gujarat, commercial)..." : "Search rental OS topics (e.g. add bed, Vadodara listing, UPI rent roll, complaints)..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/[0.1] rounded-2xl text-xs sm:text-sm text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none focus:border-[#0071e3] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-xs text-[#86868b] hover:text-[#1d1d1f]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* ========================================================= */}
        {/* TAB 1: RENT AGREEMENT USER MANUAL */}
        {/* ========================================================= */}
        {activeTab === "agreement" && (
          <div className="space-y-12">
            {/* Quick Overview Ribbon */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0071e3] uppercase tracking-wider">Official Legal Deed Engine</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f]">Rent Agreement User Manual</h2>
                <p className="text-xs sm:text-sm text-[#515154] max-w-2xl leading-relaxed">
                  Learn how to prepare, e-Stamp, sign, and execute 100% legally enforceable residential and commercial rent deeds in 5 minutes under the Model Tenancy Act 2021 and Indian Stamp Acts.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                <Link
                  href="/rent-agreement-ai"
                  className="px-4 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Launch Rent Agreement AI</span>
                </Link>
                <Link
                  href="/rent-agreement/pricing"
                  className="px-4 py-2.5 bg-white border border-black/[0.1] hover:border-black/[0.2] text-[#1d1d1f] rounded-xl text-xs font-bold transition"
                >
                  <span>Stamp Duty Rates</span>
                </Link>
              </div>
            </div>

            {/* Quick Process Infographic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Select Deed Type", desc: "Choose Residential 11-Month, Commercial Lease, or Tenancy Affidavit.", icon: FileText, color: "text-[#0071e3]" },
                { step: "02", title: "Enter Parties & Rent", desc: "Fill Landlord, Tenant KYC, monthly rent, and security deposit terms.", icon: Users, color: "text-indigo-600" },
                { step: "03", title: "State e-Stamp Duty", desc: "Auto-computed for Gujarat (₹300), Maharashtra (₹500), Karnataka (₹100), etc.", icon: Stamp, color: "text-amber-600" },
                { step: "04", title: "Aadhaar eSign & PDF", desc: "Instant remote OTP signing and download with tamper-proof QR code.", icon: ShieldCheck, color: "text-emerald-600" },
              ].map((card) => {
                const IconComponent = card.icon;
                return (
                  <div key={card.step} className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-black/[0.15]">{card.step}</span>
                      <IconComponent className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <h3 className="font-bold text-sm text-[#1d1d1f]">{card.title}</h3>
                    <p className="text-xs text-[#86868b] leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Step-by-Step Detailed Chapters */}
            <div className="space-y-6">
              {/* CHAPTER 1: Account Registration & Roles */}
              <div className="bg-white rounded-3xl border border-black/[0.08] shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection("agr-ch1")}
                  className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-[#fbfbfd] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071e3] font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f]">Chapter 1: Registration, Login & Role Setup</h3>
                      <p className="text-xs text-[#86868b]">How to register as Landlord, Tenant, or CSC Shopkeeper</p>
                    </div>
                  </div>
                  {expandedSections["agr-ch1"] ? <ChevronDown className="w-5 h-5 text-[#86868b]" /> : <ChevronRight className="w-5 h-5 text-[#86868b]" />}
                </button>

                {expandedSections["agr-ch1"] && (
                  <div className="p-6 pt-0 border-t border-black/[0.06] space-y-6 text-xs sm:text-sm text-[#424245] leading-relaxed">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      {/* Owner Role */}
                      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#0071e3]" />
                          <h4 className="font-bold text-[#1d1d1f]">Property Owner / Landlord</h4>
                        </div>
                        <p className="text-xs text-[#86868b]">
                          Create residential or commercial deeds, request security deposits, invite tenants to eSign, and track signature timestamps.
                        </p>
                        <div className="pt-2 text-[11px] font-semibold text-[#0071e3]">
                          URL: <Link href="/register?role=OWNER" className="underline">/register</Link> or 1-Click Demo
                        </div>
                      </div>

                      {/* Tenant Role */}
                      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-[#1d1d1f]">Tenant / Resident</h4>
                        </div>
                        <p className="text-xs text-[#86868b]">
                          Review drafted terms on mobile, verify Aadhaar with OTP, sign agreements remotely, and download authentic certified deed PDFs.
                        </p>
                        <div className="pt-2 text-[11px] font-semibold text-emerald-600">
                          URL: <Link href="/login?portal=agreement" className="underline">/login</Link> or SMS link
                        </div>
                      </div>

                      {/* Shopkeeper Kiosk */}
                      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <Stamp className="w-4 h-4 text-amber-600" />
                          <h4 className="font-bold text-[#1d1d1f]">Shopkeeper / CSC Kiosk</h4>
                        </div>
                        <p className="text-xs text-[#86868b]">
                          For cyber cafes, Xerox centers, and CSC agents assisting walk-in customers with drafting, local e-Stamping, and printing.
                        </p>
                        <div className="pt-2 text-[11px] font-semibold text-amber-600">
                          URL: <Link href="/shop/dashboard" className="underline">/shop/dashboard</Link>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 block text-xs sm:text-sm">1-Click Fast Demo Credentials:</span>
                        <p className="text-xs text-amber-800 mt-0.5">
                          On the login page (<Link href="/login" className="underline font-semibold">/login</Link>), click the <strong>"1-Click Demo Accounts"</strong> buttons to instantly sign in as an Owner (<code>owner@erentkarar.com</code>), Tenant (<code>tenant@erentkarar.com</code>), or Shopkeeper without manual password entry.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CHAPTER 2: Creating Rent Agreement Step-by-Step */}
              <div className="bg-white rounded-3xl border border-black/[0.08] shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection("agr-ch2")}
                  className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-[#fbfbfd] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071e3] font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f]">Chapter 2: Step-by-Step Agreement Generation</h3>
                      <p className="text-xs text-[#86868b]">How to use the AI Real-time Studio & classic forms</p>
                    </div>
                  </div>
                  {expandedSections["agr-ch2"] ? <ChevronDown className="w-5 h-5 text-[#86868b]" /> : <ChevronRight className="w-5 h-5 text-[#86868b]" />}
                </button>

                {expandedSections["agr-ch2"] && (
                  <div className="p-6 pt-0 border-t border-black/[0.06] space-y-6 text-xs sm:text-sm text-[#424245] leading-relaxed">
                    <div className="space-y-4 pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">Launch Rent Agreement AI Studio (<Link href="/rent-agreement-ai" className="text-[#0071e3] hover:underline">/rent-agreement-ai</Link>)</h4>
                          <p className="text-xs text-[#86868b] mt-0.5">
                            Our AI studio renders a live legal document side-by-side that updates in real-time as you type. Alternatively, use the classic wizard on the homepage (<Link href="/" className="text-[#0071e3] hover:underline">Home</Link>).
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">Choose Agreement Format</h4>
                          <ul className="list-disc pl-5 text-xs text-[#86868b] mt-1 space-y-1">
                            <li><strong>Residential 11-Month Deed:</strong> For flats, independent houses, villas, and apartments. Standard 11-month format avoids mandatory sub-registrar physical registration under Transfer of Property Act.</li>
                            <li><strong>Commercial Lease Deed:</strong> For offices, retail shops, showrooms, and industrial warehouses with customized GST, lock-in, and renewal clauses.</li>
                            <li><strong>Tenancy Affidavit:</strong> Sworn declaration format required for society NOC and local police tenant verification.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">Enter Landlord & Tenant Details</h4>
                          <p className="text-xs text-[#86868b] mt-0.5">
                            Enter legal names matching official government IDs (Aadhaar or PAN). Add mobile numbers and emails so both parties can receive digital signing links.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-xs font-bold shrink-0">4</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">Specify Property, Rent & Deposit Terms</h4>
                          <p className="text-xs text-[#86868b] mt-0.5">
                            Provide complete property address, electricity consumer number (e.g. MGVCL in Vadodara, BESCOM in Bengaluru), monthly rent amount, security deposit amount, notice period (e.g. 1 month), and lock-in period.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#0071e3] text-white flex items-center justify-center text-xs font-bold shrink-0">5</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">State Stamp Duty Selection</h4>
                          <p className="text-xs text-[#86868b] mt-0.5">
                            Select the state where the property is located. The system calculates statutory stamp duty automatically:
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-black/[0.06]">
                              <span className="font-bold text-[#1d1d1f] block">Gujarat (GJ)</span>
                              <span className="text-[#0071e3] font-semibold">₹300 Base Stamp</span>
                            </div>
                            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-black/[0.06]">
                              <span className="font-bold text-[#1d1d1f] block">Maharashtra (MH)</span>
                              <span className="text-[#0071e3] font-semibold">₹500 Base Stamp</span>
                            </div>
                            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-black/[0.06]">
                              <span className="font-bold text-[#1d1d1f] block">Karnataka (KA)</span>
                              <span className="text-[#0071e3] font-semibold">₹100 Base Stamp</span>
                            </div>
                            <div className="p-2.5 bg-[#f5f5f7] rounded-xl border border-black/[0.06]">
                              <span className="font-bold text-[#1d1d1f] block">Delhi NCR (DL)</span>
                              <span className="text-[#0071e3] font-semibold">₹100 Base Stamp</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CHAPTER 3: Digital Signing, eSign & Verification */}
              <div className="bg-white rounded-3xl border border-black/[0.08] shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection("agr-ch3")}
                  className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-[#fbfbfd] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0071e3] font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f]">Chapter 3: Aadhaar eSign, Verification & Certificate</h3>
                      <p className="text-xs text-[#86868b]">How digital signatures, QR codes, and legal audit certificates work</p>
                    </div>
                  </div>
                  {expandedSections["agr-ch3"] ? <ChevronDown className="w-5 h-5 text-[#86868b]" /> : <ChevronRight className="w-5 h-5 text-[#86868b]" />}
                </button>

                {expandedSections["agr-ch3"] && (
                  <div className="p-6 pt-0 border-t border-black/[0.06] space-y-4 text-xs sm:text-sm text-[#424245] leading-relaxed">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#0071e3]" />
                          <h4 className="font-bold text-[#1d1d1f]">Remote Mobile eSigning</h4>
                        </div>
                        <p className="text-xs text-[#86868b]">
                          The landlord and tenant do not need to be in the same city. The system sends a unique, encrypted signature link to the tenant via WhatsApp and email. Both parties review the deed on mobile and authorize via OTP.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-[#1d1d1f]">Section 65B Audit Certificate</h4>
                        </div>
                        <p className="text-xs text-[#86868b]">
                          Every finalized agreement includes a cryptographically sealed Audit Trail Certificate with IP addresses, timestamps, and a dynamic QR code. Anyone can verify the authenticity by scanning the QR or visiting <Link href="/verify" className="text-[#0071e3] underline">/verify</Link>.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                      <h4 className="font-bold text-xs text-[#0071e3] uppercase">AI Old Agreement Renewal (<Link href="/rent-agreement/old-agreement" className="underline">/rent-agreement/old-agreement</Link>)</h4>
                      <p className="text-xs text-[#515154]">
                        Already have an existing paper rent agreement? Upload a photo or PDF of your old agreement. Our AI will automatically OCR and extract names, property address, and previous rent terms, allowing you to renew your lease for the next 11 months with 1 click.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RENTAL MANAGEMENT OS USER MANUAL */}
        {/* ========================================================= */}
        {activeTab === "rental" && (
          <div className="space-y-12">
            {/* Quick Overview Ribbon */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Cloud Property ERP & Co-Living System</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f]">Rental & Hostel Management Manual</h2>
                <p className="text-xs sm:text-sm text-[#515154] max-w-2xl leading-relaxed">
                  Operate your PG, student hostel, flat rental, or co-living facility. Manage room and bed hierarchy, list stays across Gujarat and Vadodara, automate UPI rent invoicing, and resolve tenant complaints.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
                <Link
                  href="/dashboard"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Open Owner Dashboard</span>
                </Link>
                <Link
                  href="/list-your-property"
                  className="px-4 py-2.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold transition"
                >
                  <span>+ List Property in Gujarat</span>
                </Link>
              </div>
            </div>

            {/* Quick Process Infographic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "01", title: "Add Property & Beds", desc: "Define Building → Floor → Room → Bed hierarchy (Single, Double, Triple sharing).", icon: Layers, color: "text-emerald-600" },
                { step: "02", title: "Marketplace Listing", desc: "Publish on Gujarat & Vadodara live marketplace with instant search discoverability.", icon: Eye, color: "text-blue-600" },
                { step: "03", title: "Digital Check-In & KYC", desc: "Assign beds, collect advance security deposits, and link tenant agreements.", icon: Users, color: "text-indigo-600" },
                { step: "04", title: "Auto Invoicing & UPI", desc: "Run monthly rent rolls on 1st of month. Send automated WhatsApp payment QR codes.", icon: IndianRupee, color: "text-amber-600" },
              ].map((card) => {
                const IconComponent = card.icon;
                return (
                  <div key={card.step} className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-black/[0.15]">{card.step}</span>
                      <IconComponent className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <h3 className="font-bold text-sm text-[#1d1d1f]">{card.title}</h3>
                    <p className="text-xs text-[#86868b] leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Step-by-Step Detailed Chapters */}
            <div className="space-y-6">
              {/* CHAPTER 1: Organization & Property Setup */}
              <div className="bg-white rounded-3xl border border-black/[0.08] shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection("rent-ch1")}
                  className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-[#fbfbfd] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f]">Chapter 1: Owner Organization & Listing Setup</h3>
                      <p className="text-xs text-[#86868b]">How to register your business and list properties in Vadodara and Gujarat</p>
                    </div>
                  </div>
                  {expandedSections["rent-ch1"] ? <ChevronDown className="w-5 h-5 text-[#86868b]" /> : <ChevronRight className="w-5 h-5 text-[#86868b]" />}
                </button>

                {expandedSections["rent-ch1"] && (
                  <div className="p-6 pt-0 border-t border-black/[0.06] space-y-6 text-xs sm:text-sm text-[#424245] leading-relaxed">
                    <div className="space-y-4 pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">Register as Property Owner (<Link href="/register?role=OWNER" className="text-emerald-700 hover:underline">/register</Link>)</h4>
                          <p className="text-xs text-[#86868b] mt-0.5">
                            Select <strong>Property Owner / Landlord</strong> role. Enter your Organization Name (e.g. <em>Gujarat Royal Stays & Co-Living Group</em>), phone, and email.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">List Your Property Publicly (<Link href="/list-your-property" className="text-emerald-700 hover:underline">/list-your-property</Link>)</h4>
                          <p className="text-xs text-[#86868b] mt-0.5">
                            Any landlord or PG operator in Gujarat can publish a listing with:
                          </p>
                          <ul className="list-disc pl-5 text-xs text-[#86868b] mt-1 space-y-1">
                            <li><strong>City:</strong> Defaulted to Vadodara, Ahmedabad, Surat, Rajkot, or Gandhinagar.</li>
                            <li><strong>Locality:</strong> Alkapuri, Gotri, Sayajigunj, Fatehgunj, Manjalpur, Vasna Road, Akota, Karelibaug, etc.</li>
                            <li><strong>Property Type:</strong> PG / Hostel, Co-Living, Flat / Apartment, or Independent House.</li>
                            <li><strong>Beds & Monthly Rent:</strong> Starting rent per bed, security deposit multiplier, and gender preference (Male, Female, Unisex).</li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                        <div>
                          <h4 className="font-bold text-[#1d1d1f]">Automatic Database Provisioning</h4>
                          <p className="text-xs text-[#86868b] mt-0.5">
                            When you submit a property via <code>/list-your-property</code>, the system automatically writes to the backend database, creates the initial <code>Building</code>, <code>Floor</code>, <code>Rooms</code>, and <code>Beds</code>, and reflects in the live Vadodara search count instantly!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CHAPTER 2: Managing Inventory Hierarchy & Bed Control */}
              <div className="bg-white rounded-3xl border border-black/[0.08] shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection("rent-ch2")}
                  className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-[#fbfbfd] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f]">Chapter 2: Managing Rooms & Co-Living Bed Control</h3>
                      <p className="text-xs text-[#86868b]">How to manage real-time inventory and prevent double-booking</p>
                    </div>
                  </div>
                  {expandedSections["rent-ch2"] ? <ChevronDown className="w-5 h-5 text-[#86868b]" /> : <ChevronRight className="w-5 h-5 text-[#86868b]" />}
                </button>

                {expandedSections["rent-ch2"] && (
                  <div className="p-6 pt-0 border-t border-black/[0.06] space-y-6 text-xs sm:text-sm text-[#424245] leading-relaxed">
                    <p className="pt-4 text-xs sm:text-sm text-[#515154]">
                      On the Owner Operating Dashboard (<Link href="/dashboard" className="text-emerald-700 font-bold underline">/dashboard</Link>), navigate to the <strong>"Properties & Beds"</strong> tab. Here you have full visibility into your structural hierarchy:
                    </p>

                    {/* Hierarchy Diagram Box */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-2 border border-slate-800">
                      <div className="text-emerald-400 font-bold">PROPERTY: Royal Palms Co-Living, Alkapuri, Vadodara</div>
                      <div className="pl-4 text-slate-300">└── BUILDING: Main Wing (3 Floors)</div>
                      <div className="pl-8 text-slate-300">└── FLOOR: 1st Floor</div>
                      <div className="pl-12 text-slate-300">└── ROOM: Room 101 (Double Sharing, Attached Bath, AC)</div>
                      <div className="pl-16 text-emerald-400 font-bold">├── BED 101-A (Rent: ₹8,500/mo) • [AVAILABLE]</div>
                      <div className="pl-16 text-amber-400 font-bold">└── BED 101-B (Rent: ₹8,500/mo) • [MAINTENANCE]</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="font-bold text-emerald-900 text-xs block">🟢 AVAILABLE</span>
                        <p className="text-[11px] text-emerald-800 mt-1">
                          Bed is vacant and visible to prospects on the public marketplace. Ready for instant digital check-in.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                        <span className="font-bold text-amber-900 text-xs block">🟡 MAINTENANCE</span>
                        <p className="text-[11px] text-amber-800 mt-1">
                          Bed is temporarily out of service for painting, deep cleaning, or repairs. Hidden from marketplace bookings.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-300">
                        <span className="font-bold text-slate-900 text-xs block">⚪ OCCUPIED</span>
                        <p className="text-[11px] text-slate-700 mt-1">
                          Locked by an active tenant contract. Linked to monthly billing rolls and maintenance request ticketing.
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#86868b]">
                      <strong>Pro-tip:</strong> Simply click on any bed status badge in the dashboard to toggle between <code>AVAILABLE</code> and <code>MAINTENANCE</code> in real-time.
                    </p>
                  </div>
                )}
              </div>

              {/* CHAPTER 3: Monthly Invoices, UPI Collections & Complaints */}
              <div className="bg-white rounded-3xl border border-black/[0.08] shadow-xs overflow-hidden">
                <button
                  onClick={() => toggleSection("rent-ch3")}
                  className="w-full p-6 text-left flex items-center justify-between bg-white hover:bg-[#fbfbfd] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1d1d1f]">Chapter 3: Monthly Rent Roll, WhatsApp Reminders & CRM</h3>
                      <p className="text-xs text-[#86868b]">Automating rent collections, UPI links, and maintenance tickets</p>
                    </div>
                  </div>
                  {expandedSections["rent-ch3"] ? <ChevronDown className="w-5 h-5 text-[#86868b]" /> : <ChevronRight className="w-5 h-5 text-[#86868b]" />}
                </button>

                {expandedSections["rent-ch3"] && (
                  <div className="p-6 pt-0 border-t border-black/[0.06] space-y-6 text-xs sm:text-sm text-[#424245] leading-relaxed">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {/* Invoicing Roll */}
                      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-4 h-4 text-emerald-600" />
                          <h4 className="font-bold text-[#1d1d1f]">1-Click Monthly Rent Roll</h4>
                        </div>
                        <p className="text-xs text-[#86868b]">
                          On the 1st of every month, click the green <strong>"Generate Monthly Invoices"</strong> button on your topbar. The ERP loops through all active tenants, adds their room rent, utility splits, and society maintenance, generating itemized invoices instantly.
                        </p>
                      </div>

                      {/* Complaint Ticketing */}
                      <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.06] space-y-2">
                        <div className="flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-[#0071e3]" />
                          <h4 className="font-bold text-[#1d1d1f]">Maintenance Ticket Resolution</h4>
                        </div>
                        <p className="text-xs text-[#86868b]">
                          Tenants report plumbing, Wi-Fi, electrical, or mess issues directly from the Tenant Portal (<Link href="/tenant" className="text-[#0071e3] underline">/tenant</Link>). Owners can assign electricians or plumbers and mark tickets as <code>RESOLVED</code> with repair notes.
                        </p>
                      </div>
                    </div>

                    {/* Tenant Mobile Portal */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                      <h4 className="font-bold text-xs text-emerald-800 uppercase">Tenant Self-Service Portal (<Link href="/tenant" className="underline">/tenant</Link>)</h4>
                      <p className="text-xs text-[#515154]">
                        Tenants get a dedicated mobile dashboard to view their room number, download legal rent receipts for HRA tax exemption claims, pay pending rent with dynamic UPI QR codes, and view property house rules.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FAQs & Common Queries Section */}
        <section className="mt-16 pt-12 border-t border-black/[0.08] space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#1d1d1f]">Frequently Asked Operational Questions</h2>
            <p className="text-xs sm:text-sm text-[#86868b]">Clear answers to legal validity, stamp acts, and payment processing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-2">
              <h3 className="font-bold text-xs sm:text-sm text-[#1d1d1f]">Is an 11-month agreement valid without physical sub-registrar visit?</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Yes. Under Section 107 of the Transfer of Property Act 1882, leases of immovable property for any term not exceeding one year (11 months) do not require mandatory registration with the sub-registrar. Executing on statutory e-Stamp paper with Aadhaar OTP eSign provides 100% legal validity in Indian courts.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-2">
              <h3 className="font-bold text-xs sm:text-sm text-[#1d1d1f]">What is the stamp duty in Gujarat for rent agreements?</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Under Article 30 of the Gujarat Stamp Act 1958, standard 11-month residential rent agreements attract a statutory stamp duty of ₹300. eRentKarar procures genuine government e-Stamps with serial numbers directly recognized by the Gujarat State Revenue Department.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-2">
              <h3 className="font-bold text-xs sm:text-sm text-[#1d1d1f]">Can I manage multiple PG hostels across Vadodara & Ahmedabad?</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                Yes! The eRentKarar Rental Cloud OS supports multi-branch organizations. You can add unlimited properties across Alkapuri, Gotri, Sayajigunj, Navrangpura, and SG Highway, managing individual rooms and beds from a single unified owner dashboard.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-black/[0.06] shadow-xs space-y-2">
              <h3 className="font-bold text-xs sm:text-sm text-[#1d1d1f]">How do tenants pay rent?</h3>
              <p className="text-xs text-[#86868b] leading-relaxed">
                When monthly invoices are generated, the system creates dynamic UPI payment QR codes linked directly to your registered bank account. Tenants can pay using Google Pay, PhonePe, Paytm, or BHIM. Receipts are auto-generated upon payment.
              </p>
            </div>
          </div>
        </section>

        {/* Support & Quick Contact CTA */}
        <div className="mt-16 bg-[#1d1d1f] text-white rounded-3xl p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#86868b]">
            <HelpCircle className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Need personalized assistance or customized deployment?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">Have questions or want team onboarding?</h2>
          <p className="text-xs sm:text-sm text-[#a1a1a6] max-w-xl mx-auto">
            Our legal compliance and property onboarding specialists are available 7 days a week to help setup your PG inventory or verify high-value commercial agreements.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Contact Specialist Support
            </Link>
            <Link
              href="/faq"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
            >
              Browse Extended Legal FAQ
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-xs text-[#86868b]">Loading User Manual...</div>}>
      <GuideContent />
    </Suspense>
  );
}
