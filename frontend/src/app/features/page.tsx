"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, Users, IndianRupee, FileText, Shield,
  Sparkles, BarChart3, MessageSquare, Wrench,
  Utensils, UserCheck, ClipboardCheck, Bed, MapPin,
  Bell, Eye, Zap, ArrowRight, CheckCircle2,
  ChevronRight, Globe, Smartphone, Lock
} from "lucide-react";

const modules = [
  {
    id: "property",
    icon: Building2,
    title: "Property & Room Management",
    tagline: "Complete inventory from property to bed",
    features: [
      "Multi-property portfolio management",
      "Building → Floor → Room → Bed hierarchy",
      "Room types: Single, Double, Triple, Studio, 1/2/3BHK, Dormitory",
      "Amenity tagging and rich descriptions",
      "Photo galleries and virtual tour links",
      "Real-time bed availability matrix",
      "Bulk room creation and import",
      "Publish/unpublish to marketplace",
    ],
  },
  {
    id: "tenant",
    icon: UserCheck,
    title: "Tenant Lifecycle Management",
    tagline: "From enquiry to move-out, fully digitized",
    features: [
      "Digital onboarding with document upload",
      "Aadhaar, PAN, Passport, DL, Voter ID KYC",
      "Move-in and move-out workflow",
      "Room/bed assignment with status tracking",
      "Tenant portal for rent, receipts, complaints",
      "Notice period management",
      "Security deposit tracking and settlement",
      "Emergency contact and co-resident records",
    ],
  },
  {
    id: "billing",
    icon: IndianRupee,
    title: "Billing & Rent Collection",
    tagline: "Automated invoicing with online payment",
    features: [
      "Monthly invoice generation (auto/manual)",
      "Rent + electricity + water + maintenance line items",
      "Sub-meter electricity billing per room",
      "UPI, cards, net banking via Razorpay",
      "Late fee calculation and grace period",
      "Digital receipts and payment history",
      "Tenant ledger with running balance",
      "GST-ready architecture",
    ],
  },
  {
    id: "agreements",
    icon: FileText,
    title: "Rental Agreements & eSign",
    tagline: "State-compliant digital agreements",
    features: [
      "Draft agreements from tenant + property data",
      "State-wise stamp duty engine (KA, MH, DL, TN, etc.)",
      "eSign integration via Leegality API",
      "Digital stamping across Indian states/UTs",
      "Version history and audit trail",
      "Secure PDF storage with signed URLs",
      "Agreement expiry reminders",
      "Multi-party signing workflow",
    ],
  },
  {
    id: "leads",
    icon: ClipboardCheck,
    title: "Leads & CRM",
    tagline: "Never lose a lead, convert every enquiry",
    features: [
      "Lead capture from marketplace, WhatsApp, phone",
      "Pipeline stages: New → Contacted → Visited → Booked",
      "Visit scheduling with reminders",
      "Staff assignment and follow-up tracking",
      "Call, WhatsApp, and email activity log",
      "Source attribution (Google, referral, direct)",
      "Lead scoring and conversion analytics",
      "Bulk actions and quick filters",
    ],
  },
  {
    id: "communication",
    icon: MessageSquare,
    title: "WhatsApp, Email & Notifications",
    tagline: "Automated communication across channels",
    features: [
      "WhatsApp Business API integration",
      "Rent reminders, booking confirmations",
      "Customizable message templates",
      "Email with HTML templates and tracking",
      "In-app notification center",
      "SMS-ready architecture",
      "Communication log with delivery status",
      "Retry logic and failure handling",
    ],
  },
  {
    id: "complaints",
    icon: Wrench,
    title: "Complaints & Maintenance",
    tagline: "Track issues from report to resolution",
    features: [
      "Tenant complaint submission with photos",
      "Category-based routing (plumbing, electrical, etc.)",
      "Priority levels: Low, Medium, High, Critical",
      "Staff assignment and vendor tracking",
      "Status tracking: Open → Assigned → Resolved → Closed",
      "Cost and expense logging",
      "Tenant satisfaction confirmation",
      "Maintenance analytics and reports",
    ],
  },
  {
    id: "mess",
    icon: Utensils,
    title: "Mess & Food Management",
    tagline: "For PGs, hostels, and co-living with meals",
    features: [
      "Weekly/monthly mess menu planning",
      "Breakfast, lunch, dinner, special meal slots",
      "Meal attendance and opt-out tracking",
      "Per-tenant mess billing",
      "Mess expense management",
      "Vendor management and payments",
      "Feedback collection",
      "Monthly mess reports and reconciliation",
    ],
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "Ekrar AI Assistant",
    tagline: "Your bilingual rental business co-pilot",
    features: [
      "Ask in Hindi or English: \"किसका rent pending है?\"",
      "Vacancy, collection, occupancy insights",
      "Agreement expiry and KYC status checks",
      "Action preview with confirmation safeguards",
      "Tool-based data access (no direct DB queries)",
      "Organization-scoped, role-aware responses",
      "Complete audit trail of AI interactions",
      "Prompt injection defense architecture",
    ],
  },
];

export default function FeaturesPage() {
  const [activeModule, setActiveModule] = useState("property");
  const active = modules.find((m) => m.id === activeModule)!;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Apple light style */}
      <section className="bg-[#f5f5f7] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 bg-[#0071e3]/8 border border-[#0071e3]/20 text-[#0071e3] px-5 py-2 rounded-full text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>India&apos;s Complete Rental OS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]">
            Every Feature You Need to{" "}
            <span className="text-[#0071e3]">Run Rentals</span>
          </h1>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
            9 integrated modules covering property management, billing, agreements, communication, and AI — built specifically for India.
          </p>
        </div>
      </section>

      {/* Module Selector + Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Scrollable Module Tabs — All use Apple Blue when active */}
        <div className="flex overflow-x-auto gap-2 pb-4 -mx-4 px-4 scrollbar-hide">
          {modules.map((m) => {
            const MIcon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 border ${
                  isActive
                    ? "bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-[#0071e3]/20"
                    : "bg-white text-[#1d1d1f] border-[rgba(0,0,0,0.08)] hover:bg-[#f5f5f7]"
                }`}
              >
                <MIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">{m.title.split(" &")[0].split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Module Detail Card — Unified Apple Blue accent */}
        <div className="mt-6 bg-white rounded-3xl border-2 border-[#0071e3]/30 p-6 sm:p-10 shadow-lg shadow-[#0071e3]/5 transition-all">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center shadow-sm">
                  <active.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1d1d1f]">{active.title}</h2>
                  <p className="text-xs text-[#86868b]">{active.tagline}</p>
                </div>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
                    <span className="text-[#1d1d1f]">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side visual */}
            <div className="w-full md:w-80 bg-[#f5f5f7] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 border border-[rgba(0,0,0,0.06)]">
              <active.icon className="w-16 h-16 text-[#0071e3] opacity-20" />
              <p className="text-xs font-semibold text-[#0071e3]">Module: {active.title}</p>
              <Link href="/register" className="apple-btn-primary px-5 py-2.5 text-xs flex items-center gap-2">
                <span>Try It Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="bg-[#f5f5f7] border-y border-[rgba(0,0,0,0.06)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">Platform Architecture Pillars</h2>
            <p className="text-sm text-[#86868b]">Built with security, compliance, and scale in mind from day one.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: "Multi-Tenant SaaS", desc: "Organization-scoped isolation. Your data never leaks to other businesses." },
              { icon: Lock, title: "RBAC & Security", desc: "12+ roles with granular permissions. IDOR protection on every API." },
              { icon: Globe, title: "India-First", desc: "INR, +91, state stamp duties, Model Tenancy Act compliance, Hindi + English." },
              { icon: Smartphone, title: "Mobile-First", desc: "Every workflow works on mobile. Bottom nav, floating AI, quick actions." },
            ].map((p, i) => {
              const PIcon = p.icon;
              return (
                <div key={i} className="apple-card p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(0,0,0,0.08)] flex items-center justify-center mx-auto">
                    <PIcon className="w-6 h-6 text-[#0071e3]" />
                  </div>
                  <h3 className="font-semibold text-[#1d1d1f] text-sm">{p.title}</h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — Apple style */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">Start Managing Your Properties Today</h2>
          <p className="text-[#86868b] text-sm">Free forever for single-property owners. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="apple-btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm">
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="apple-btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-sm">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
