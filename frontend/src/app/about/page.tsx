"use client";

import React from "react";
import Link from "next/link";
import {
  Building2, Target, Heart, Shield, Globe, Sparkles,
  Users, IndianRupee, ArrowRight, CheckCircle2,
  Scale, BookOpen, Zap
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Apple light style */}
      <section className="bg-[#f5f5f7] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 bg-[#0071e3]/8 border border-[#0071e3]/20 text-[#0071e3] px-5 py-2 rounded-full text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>About eRentKarar</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]">
            India&apos;s Rental Ecosystem,{" "}
            <span className="text-[#0071e3]">Reimagined</span>
          </h1>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            eRentKarar is building the digital operating system for every landlord, PG owner, hostel operator, and tenant in India.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        <div className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] shadow-lg shadow-black/[0.04] p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#1d1d1f]">Our Mission</h2>
              </div>
              <p className="text-sm text-[#86868b] leading-relaxed">
                India has over 10 million PGs, hostels, and rental properties — most managed on WhatsApp, paper registers, and Excel sheets. Rent disputes, missing receipts, unverified tenants, and legally weak agreements affect millions.
              </p>
              <p className="text-sm text-[#86868b] leading-relaxed">
                eRentKarar exists to fix this. We&apos;re building a complete digital platform that connects property owners with verified tenants, automates rent collection, generates state-compliant legal agreements, and provides AI-powered business intelligence — all in one place.
              </p>
            </div>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#1d1d1f]">Our Values</h2>
              </div>
              <ul className="space-y-3.5">
                {[
                  { icon: Shield, text: "Trust & Transparency — verified listings, clear billing, no hidden fees" },
                  { icon: Scale, text: "Legal Compliance — state-wise stamp duties, Model Tenancy Act ready" },
                  { icon: IndianRupee, text: "India-First — INR, UPI, +91, Hindi/English, regional compliance" },
                  { icon: Zap, text: "Speed & Simplicity — onboard in minutes, not hours" },
                  { icon: BookOpen, text: "Education — blog, guides, and tools for smarter landlords and tenants" },
                ].map((v, i) => {
                  const VIcon = v.icon;
                  return (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#1d1d1f]">
                      <VIcon className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                      <span>{v.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#f5f5f7] border-y border-[rgba(0,0,0,0.06)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "22+", label: "Backend Modules" },
              { value: "120+", label: "API Endpoints" },
              { value: "12", label: "User Roles" },
              { value: "28", label: "Indian States Supported" },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl font-bold text-[#1d1d1f]">{s.value}</p>
                <p className="text-xs font-medium text-[#86868b]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">What eRentKarar Does</h2>
          <p className="text-sm text-[#86868b]">A unified platform replacing 10+ separate tools</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Building2, title: "Rental Marketplace", desc: "Public search and discovery for PGs, hostels, flats, and co-living spaces across Indian cities" },
            { icon: Users, title: "Property Management", desc: "Building → Floor → Room → Bed inventory with availability tracking and status management" },
            { icon: IndianRupee, title: "Automated Billing", desc: "Monthly invoices, sub-meter electricity, UPI/card rent collection, receipts, and ledger" },
            { icon: Shield, title: "Digital KYC", desc: "Aadhaar, PAN, Passport verification with encrypted document vault and access logging" },
            { icon: Scale, title: "Legal Agreements", desc: "State-compliant rental agreements with eSign, digital stamping, and PDF archival" },
            { icon: Sparkles, title: "Ekrar AI", desc: "Bilingual assistant for business queries — ask about rent, vacancies, and agreements in Hindi or English" },
          ].map((f, i) => {
            const FIcon = f.icon;
            return (
              <div key={i} className="apple-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] flex items-center justify-center">
                  <FIcon className="w-5 h-5 text-[#0071e3]" />
                </div>
                <h3 className="font-semibold text-[#1d1d1f] text-sm">{f.title}</h3>
                <p className="text-xs text-[#86868b] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA — Apple style */}
      <section className="bg-[#f5f5f7] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">Join the Rental Revolution</h2>
          <p className="text-[#86868b] text-sm">Whether you manage 1 PG or 100 properties — eRentKarar scales with you.</p>
          <Link href="/register" className="apple-btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm">
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
