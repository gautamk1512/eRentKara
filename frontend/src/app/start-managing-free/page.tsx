"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  IndianRupee,
  FileText,
  Key,
  Flame,
  ArrowRight,
  Shield,
  Clock,
  QrCode,
  Zap,
  HelpCircle,
  ChevronRight,
  Utensils,
  Eye,
  Lock,
  Headphones,
  Check,
} from "lucide-react";

export default function StartManagingFreePage() {
  const [activeTab, setActiveTab] = useState<"tenant" | "owner" | "team">("owner");

  const personas = [
    {
      id: "owner",
      label: "For Owners & Landlords",
      badge: "100% Free Forever",
      icon: Building2,
      tagline: "PGs, Hostels, Apartments & Independent Houses",
      description:
        "Manage unlimited rooms, beds, automate WhatsApp rent receipts, calculate submeter electricity, and draft legally binding e-Stamp agreements with zero brokerages.",
    },
    {
      id: "tenant",
      label: "For Tenants & Residents",
      badge: "Zero Brokerage",
      icon: UserCheck,
      tagline: "Students, Working Bachelors & Families",
      description:
        "Explore verified stays with no brokerage, pay rent with 1-click UPI, receive automated HRA tax receipts, and raise maintenance tickets directly from your phone.",
    },
    {
      id: "team",
      label: "For Teams & Managers",
      badge: "Multi-Staff RBAC",
      icon: Users,
      tagline: "Property Managers, Wardens & Security Guards",
      description:
        "Role-based staff logins, automated digital gatepass visitor logs, mess & food attendance, technician job tickets, and daily petty cash reconciliation.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1d1d1f] font-sans antialiased pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-black/[0.06] sticky top-[64px] z-30 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-[#86868b]">
            <Link href="/" className="hover:text-[#0071e3] transition">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#1d1d1f]">Start Managing Free</span>
            <span>/</span>
            <span className="text-[#0071e3] font-medium capitalize">{activeTab} Ecosystem</span>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1d1d1f] hover:bg-black text-white text-xs font-bold transition shadow-sm"
          >
            <span>Claim Free Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white via-white to-[#f5f5f7] border-b border-black/[0.06] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Inspired by India's Top Rental OS • 100% Free Lifetime Tier</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1d1d1f] leading-tight">
            One Unified Operating System for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Tenants, Owners & Management Teams
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed">
            Eliminate traditional pen-and-paper registers, chaotic WhatsApp payment screenshots, and delayed lease deeds.
            Choose your persona below to explore tailored features.
          </p>

          {/* Persona Switcher Tabs */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#e8e8ed] border border-black/[0.06] gap-1.5 flex-wrap sm:flex-nowrap justify-center">
              {personas.map((p) => {
                const Icon = p.icon;
                const isActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveTab(p.id as any)}
                    className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white text-[#1d1d1f] shadow-md scale-100"
                        : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-white/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#0071e3]" : "text-[#86868b]"}`} />
                    <span>{p.label}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                        isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-black/[0.06] text-[#86868b]"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Dynamic Persona Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* ======================= 1. OWNER TAB ======================= */}
        {activeTab === "owner" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Persona Hero Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#1d1d1f] via-slate-900 to-[#102a43] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Landlord & PG Cloud Suite</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                  Automate Rent, Track Rooms & Eliminate 100% of Headaches
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Designed specifically for Indian PG owners, hostel wardens, and residential landlords. 
                  No credit card required. Start free forever with your properties.
                </p>
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <Link
                    href="/register?role=OWNER"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg hover:shadow-emerald-500/25"
                  >
                    <span>Start Managing Free as Owner</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/list-your-property"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                  >
                    <span>+ List Vacant Property</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature Grid for Owners */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Smartphone,
                  title: "WhatsApp Rent Collection Reminders",
                  desc: "Send automated WhatsApp dues notices with UPI payment links directly to tenants before the 5th of every month.",
                  highlight: "Zero Manual Calling",
                },
                {
                  icon: Zap,
                  title: "Electricity Submeter Auto-Split",
                  desc: "Input previous and current meter units. Our system calculates per-unit rate and adds it seamlessly to the monthly rent slip.",
                  highlight: "Accurate Utility Billing",
                },
                {
                  icon: Building2,
                  title: "Bed & Room Live Matrix",
                  desc: "Visual occupancy board showing Single, Double, Triple sharing beds. Track vacant beds and upcoming tenant move-outs.",
                  highlight: "Real-time Vacancy",
                },
                {
                  icon: FileText,
                  title: "Legal 11-Month e-Stamp Deeds",
                  desc: "Create statutory lease agreements with Aadhaar eSign under the Model Tenancy Act.",
                  highlight: "Jurisdiction-Aware Engine",
                },
                {
                  icon: ShieldCheck,
                  title: "Tenant Digital KYC & Police Verification",
                  desc: "Collect Aadhaar, PAN, College/Employer ID, and generate pre-filled local police verification declaration forms.",
                  highlight: "Identity Verified KYC",
                },
                {
                  icon: IndianRupee,
                  title: "Direct UPI Bank Settlement",
                  desc: "Receive rent directly in your bank account via dynamic QR code. No middleman hold or high gateway commissions.",
                  highlight: "Instant 0% Fee Payout",
                },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-sm hover:shadow-xl hover:border-black/[0.12] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0071e3] flex items-center justify-center mb-4 border border-blue-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {feat.highlight}
                      </span>
                      <h3 className="text-base font-bold text-[#1d1d1f] mt-2.5 mb-1.5">{feat.title}</h3>
                      <p className="text-xs text-[#86868b] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= 2. TENANT TAB ======================= */}
        {activeTab === "tenant" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Persona Hero Card */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-[#1d1d1f] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Tenant & Resident Experience</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                  Transparent Renting, Instant Rent Receipts & Zero Brokerage
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Say goodbye to arbitrary broker commissions and lost security deposits. Rent directly from verified
                  owners with guaranteed legal agreements.
                </p>
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <Link
                    href="/properties"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-black text-xs sm:text-sm transition shadow-lg hover:shadow-blue-500/25"
                  >
                    <span>Browse Zero Brokerage Stays</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/register?role=TENANT"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                  >
                    <span>Create Free Tenant Account</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature Grid for Tenants */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: QrCode,
                  title: "1-Click UPI & Credit Card Rent",
                  desc: "Pay directly via GPay, PhonePe, Paytm, or Credit Card. Get instant payment confirmations and digital receipts.",
                  highlight: "Cashless & Safe",
                },
                {
                  icon: FileText,
                  title: "Instant HRA Tax Rent Receipts",
                  desc: "Download verified monthly rent receipts with Owner PAN number to easily claim company House Rent Allowance exemptions.",
                  highlight: "Official Tax Proof",
                },
                {
                  icon: Lock,
                  title: "Aadhaar eSign Rent Agreements",
                  desc: "Sign your rental deed securely from your smartphone using Aadhaar OTP. Get your registered PDF deed in minutes.",
                  highlight: "Paperless & Official",
                },
                {
                  icon: Headphones,
                  title: "Digital Maintenance & Issue Tickets",
                  desc: "Plumbing, electrical, or Wi-Fi problem? Click a photo and raise a ticket. Track when the caretaker resolves it.",
                  highlight: "No Verbal Excuses",
                },
                {
                  icon: ShieldCheck,
                  title: "Deposit Refund Tracker",
                  desc: "Clear move-out inspection protocol with documented meter readings ensures your security deposit is returned on time.",
                  highlight: "Deposit Protected",
                },
                {
                  icon: Building2,
                  title: "100% Broker-Free Properties",
                  desc: "Deal directly with property owners and hostel managers. Never pay a single rupee in broker fees or commissions.",
                  highlight: "Save ₹15,000+ Brokerage",
                },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-sm hover:shadow-xl hover:border-black/[0.12] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        {feat.highlight}
                      </span>
                      <h3 className="text-base font-bold text-[#1d1d1f] mt-2.5 mb-1.5">{feat.title}</h3>
                      <p className="text-xs text-[#86868b] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= 3. TEAM TAB ======================= */}
        {activeTab === "team" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Persona Hero Card */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-[#1d1d1f] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" />
                  <span>Operations, Staff & Property Managers</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                  Multi-Staff Operations for Large PGs, Hostels & Portfolios
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Empower caretakers, wardens, guards, and accountants with individual role permissions while you retain
                  centralized owner oversight.
                </p>
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <Link
                    href="/register?role=MANAGER"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg hover:shadow-emerald-500/25"
                  >
                    <span>Onboard Property Team</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/guide?tab=rental"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                  >
                    <span>Read Staff Manual</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature Grid for Teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Key,
                  title: "Role-Based Access Control (RBAC)",
                  desc: "Create custom roles: Manager (full building), Warden (floors & gatepass), Accountant (billing only), Technician (tickets).",
                  highlight: "Granular Privacy",
                },
                {
                  icon: ShieldCheck,
                  title: "Digital Gatepass & Visitor Logs",
                  desc: "Security guards record visitor check-ins with photo & mobile OTP. Curfew alerts for student hostel residents.",
                  highlight: "Hostel Security",
                },
                {
                  icon: Utensils,
                  title: "Mess & Meal Management",
                  desc: "Publish daily breakfast, lunch, and dinner menus. Residents mark leave/absence to minimize food wastage and save kitchen costs.",
                  highlight: "Save Kitchen Expenses",
                },
                {
                  icon: Clock,
                  title: "Staff Attendance & Task Tracking",
                  desc: "Track daily attendance of housekeepers, cooks, and guards. Assign maintenance requests with due dates.",
                  highlight: "Operational Efficiency",
                },
                {
                  icon: IndianRupee,
                  title: "Petty Cash & Expense Log",
                  desc: "Caretakers record daily grocery, diesel generator fuel, and emergency repair expenses with attached receipt photos.",
                  highlight: "Zero Cash Leakage",
                },
                {
                  icon: Eye,
                  title: "Central Audit & Activity Trail",
                  desc: "Super-admins can audit every payment verified, room changed, or receipt downloaded by any staff member in real-time.",
                  highlight: "Fraud Prevention",
                },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-black/[0.06] shadow-sm hover:shadow-xl hover:border-black/[0.12] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 border border-teal-100">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                        {feat.highlight}
                      </span>
                      <h3 className="text-base font-bold text-[#1d1d1f] mt-2.5 mb-1.5">{feat.title}</h3>
                      <p className="text-xs text-[#86868b] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Comparison Section: Old Register Method vs eRentKarar */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-black/[0.06] shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-[#0071e3]">Comparison</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] mt-1">
              Why 10,000+ Indian Owners are Ditching Paper Registers
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-black/[0.08] text-[#86868b] font-semibold">
                  <th className="pb-4 font-bold">Feature</th>
                  <th className="pb-4 font-bold text-rose-600">Old Diary / Excel Method</th>
                  <th className="pb-4 font-bold text-emerald-600">eRentKarar Cloud OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {[
                  ["Rent Reminders", "Manual phone calls & awkward follow-ups", "Automated WhatsApp payment reminders with UPI QR"],
                  ["Electricity Meter", "Manual calculations on notepad with frequent disputes", "Smart sub-meter calculator with automatic invoice addition"],
                  ["Tenant KYC", "Photocopies stored in unorganized folders", "Encrypted digital KYC with instant police verification forms"],
                  ["Rental Agreements", "Physical stamp paper vendors, legal delays", "Government e-Stamp deed delivered online in 15 mins with eSign"],
                  ["Staff Management", "No record of who collected cash or visitor entries", "Multi-user staff app with audit logs & digital gatepass"],
                  ["Software Cost", "Expensive desktop software or per-bed charges", "100% Free Lifetime Tier with zero hidden fees"],
                ].map(([f, oldM, newM], i) => (
                  <tr key={i} className="hover:bg-[#fbfbfd]">
                    <td className="py-4 font-bold text-[#1d1d1f]">{f}</td>
                    <td className="py-4 text-[#86868b] flex items-center gap-1.5">
                      <span className="text-rose-500 font-bold">✕</span> {oldM}
                    </td>
                    <td className="py-4 text-emerald-800 font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" /> {newM}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-8 sm:p-12 text-center shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black mb-3">
            Ready to Experience Effortless Rental Management?
          </h2>
          <p className="text-white/90 text-xs sm:text-sm max-w-xl mx-auto mb-6">
            Join thousands of smart landlords, students, and property managers across India. Free forever.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-white text-slate-900 font-black text-xs sm:text-sm hover:bg-slate-100 transition shadow-md"
            >
              Get Started for Free
            </Link>
            <Link
              href="/promotions"
              className="px-5 py-3 rounded-full bg-black/20 text-white font-bold text-xs sm:text-sm border border-white/30 hover:bg-black/30 transition"
            >
              View Active Offers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
