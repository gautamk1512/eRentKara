"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText, IndianRupee, Zap, ShieldCheck, UserCheck,
  Calculator, Receipt, Building2, ArrowRight, Sparkles,
  Search, CheckCircle2, Clock, Download, Printer
} from "lucide-react";

const toolsList = [
  {
    id: "rent-receipt-generator",
    title: "Rent Receipt Generator",
    description: "Generate free, HRA tax-exempt rent receipts with revenue stamp simulation, landlord PAN, and instant print/PDF export.",
    category: "Tax & Finance",
    badge: "Most Popular",
    icon: Receipt,
    href: "/tools/rent-receipt-generator",
    popularFor: "HRA Exemption, IT Returns, Proof of Payment",
  },
  {
    id: "rent-agreement-generator",
    title: "11-Month Rental Agreement Generator",
    description: "Draft legally-formatted Indian rental agreements compliant with the Model Tenancy Act with state-wise stamp duty estimates.",
    category: "Legal & Contracts",
    badge: "MTA 2021 Ready",
    icon: FileText,
    href: "/agreement/create?type=residential",
    popularFor: "House Rental, Flat Lease, PG Tenancy",
  },
  {
    id: "electricity-bill-calculator",
    title: "Electricity Sub-Meter Calculator",
    description: "Calculate accurate tenant electricity share using sub-meter start/end readings, state DISCOM slab rates, or fixed unit rates.",
    category: "Utility Billing",
    badge: "Dispute Free",
    icon: Zap,
    href: "/tools/electricity-bill-calculator",
    popularFor: "PG Rooms, Shared Flats, Commercial Submeters",
  },
  {
    id: "tenant-police-verification-form-generator",
    title: "Police Verification Form Generator",
    description: "Fill and print standardized tenant police verification forms acceptable across Delhi, Bengaluru, Mumbai, UP, and Pune police portals.",
    category: "KYC & Compliance",
    badge: "Mandatory in India",
    icon: ShieldCheck,
    href: "/tools/tenant-police-verification-form-generator",
    popularFor: "Landlord Compliance, Local Police Station Submission",
  },
  {
    id: "tenant-kyc-admission-form-generator",
    title: "PG / Hostel Admission Form Generator",
    description: "Create comprehensive student & working professional admission forms with guardian details, ID proof, and mess rules.",
    category: "Onboarding",
    badge: "PG Essential",
    icon: UserCheck,
    href: "/tools/tenant-kyc-admission-form-generator",
    popularFor: "PG Intake, Student Hostels, Co-living Onboarding",
  },
  {
    id: "move-out-settlement-calculator",
    title: "Move-Out & Security Deposit Settlement",
    description: "Calculate exact deposit refunds after transparent itemized deductions for painting, electricity dues, and notice period shortfall.",
    category: "Financial Settlement",
    badge: "100% Transparent",
    icon: Calculator,
    href: "/tools/move-out-settlement-calculator",
    popularFor: "Vacating Tenant, Deposit Refund, Deductions",
  },
  {
    id: "pg-hostel-revenue-break-even-calculator",
    title: "PG / Hostel Revenue & Break-Even Tool",
    description: "Model bed occupancy, food expenses, staff salaries, building lease costs, and discover your profit margin and break-even occupancy rate.",
    category: "Owner Profitability",
    badge: "Business Planning",
    icon: IndianRupee,
    href: "/tools/pg-hostel-revenue-break-even-calculator",
    popularFor: "PG Feasibility, Capacity Planning, ROI Estimation",
  },
  {
    id: "deposit-receipt-generator",
    title: "Security Deposit Receipt Generator",
    description: "Generate official signed acknowledgment receipts for advance security deposits with refund terms and conditions.",
    category: "Tax & Finance",
    badge: "Quick Receipt",
    icon: CheckCircle2,
    href: "/tools/deposit-receipt-generator",
    popularFor: "Advance Token, Security Deposit Acknowledgment",
  },
];

export default function ToolsHubPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Tax & Finance", "Legal & Contracts", "Utility Billing", "KYC & Compliance", "Onboarding", "Owner Profitability"];

  const filteredTools = toolsList.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase()) ||
      tool.popularFor.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Hero Header - Apple Subdued Light */}
      <section className="bg-[#f5f5f7] pt-20 pb-20 px-4 sm:px-6 lg:px-8 border-b border-black/[0.06] text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-black/[0.08] text-[#1d1d1f] text-[11px] font-medium shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
            <span>100% Free Utilities for Indian Landlords & Tenants</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]">
            Rental Tools & <span className="text-[#0071e3]">Generators</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#86868b] leading-relaxed">
            Generate HRA rent receipts, legally compliant rent deeds, electricity sub-meter breakdowns, police verification forms, and deposit refund settlements instantly.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative pt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] mt-2" />
            <input
              type="text"
              placeholder="Search tools (e.g. rent receipt, electricity, agreement)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-black/[0.08] text-[#1d1d1f] placeholder:text-[#86868b] text-xs focus:outline-none focus:border-[#0071e3] transition shadow-xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCategory === cat
                    ? "bg-[#1d1d1f] text-white shadow-xs"
                    : "bg-white text-[#86868b] hover:text-[#1d1d1f] border border-black/[0.06]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group apple-card p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-black/[0.05] text-[#1d1d1f]">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors mb-2">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-[#86868b] leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] mt-2">
                  <div className="text-[11px] text-[#86868b] mb-3 truncate">
                    <span className="font-medium text-[#1d1d1f]">Best for: </span>
                    {tool.popularFor}
                  </div>

                  <div className="flex items-center text-xs font-semibold text-[#0071e3] group-hover:underline space-x-1">
                    <span>Launch Free Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 bg-[#f5f5f7] rounded-3xl border border-black/[0.06] max-w-lg mx-auto">
            <Calculator className="w-10 h-10 text-[#86868b] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#1d1d1f]">No matching tools found</h3>
            <p className="text-xs text-[#86868b] mt-1">Try another search keyword or reset category filter.</p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory("All"); }}
              className="mt-4 px-4 py-2 rounded-full bg-[#1d1d1f] text-white text-xs font-medium hover:bg-black transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-[#1d1d1f] text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-[#f5f5f7]">Want to Automate Everything?</h3>
            <p className="text-xs text-[#86868b] max-w-xl">
              eRentKarar offers automated rent collection via UPI, auto-generated monthly invoices, digital e-Sign agreements, and Ekrar AI property management.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/register"
              className="apple-btn-primary px-6 py-3 text-xs"
            >
              Create Free Account
            </Link>
            <Link
              href="/pricing"
              className="apple-btn-secondary px-6 py-3 text-xs !bg-white/10 !text-white !border-white/20 hover:!bg-white/20"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
