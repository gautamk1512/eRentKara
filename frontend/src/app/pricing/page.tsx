"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check, X, Sparkles, Building2, Zap, Crown, Rocket,
  Shield, Users, MessageSquare, BarChart3, FileText,
  ArrowRight, HelpCircle, ChevronDown, ChevronUp,
  Star, IndianRupee, Gift
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Starter",
    tagline: "Perfect for single PG owners",
    price: 0,
    priceLabel: "Free Forever",
    icon: Zap,
    popular: false,
    limits: {
      properties: 1, rooms: 10, beds: 30, tenants: 30,
      staff: 2, whatsapp: 50, ai: 20, storage: "500 MB",
    },
    features: [
      { text: "Property & room management", included: true },
      { text: "Tenant onboarding & KYC", included: true },
      { text: "Rent invoicing & collection", included: true },
      { text: "Basic complaint management", included: true },
      { text: "Marketplace listing (1 property)", included: true },
      { text: "Ekrar AI assistant (20 queries/mo)", included: true },
      { text: "Email notifications", included: true },
      { text: "WhatsApp reminders (50/mo)", included: true },
      { text: "Rental agreement drafting", included: false },
      { text: "eSign & digital stamping", included: false },
      { text: "Advanced reports & analytics", included: false },
      { text: "Staff roles & permissions", included: false },
      { text: "Mess management", included: false },
      { text: "Referral rewards", included: false },
    ],
  },
  {
    id: "pro",
    name: "Professional",
    tagline: "For growing PG & hostel businesses",
    price: 999,
    priceLabel: "₹999/mo",
    icon: Rocket,
    popular: true,
    limits: {
      properties: 5, rooms: 100, beds: 400, tenants: 400,
      staff: 10, whatsapp: 500, ai: 200, storage: "5 GB",
    },
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Up to 5 properties", included: true },
      { text: "Rental agreement engine", included: true },
      { text: "eSign integration (Leegality)", included: true },
      { text: "State-wise stamp duty calculation", included: true },
      { text: "Advanced billing & utilities", included: true },
      { text: "WhatsApp automation (500/mo)", included: true },
      { text: "Ekrar AI assistant (200 queries/mo)", included: true },
      { text: "Staff management & roles", included: true },
      { text: "Visitor management", included: true },
      { text: "Mess & food management", included: true },
      { text: "Reports & CSV/PDF export", included: true },
      { text: "Referral system & rewards", included: true },
      { text: "Priority email support", included: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    tagline: "For multi-property operators & chains",
    price: 2499,
    priceLabel: "₹2,499/mo",
    icon: Crown,
    popular: false,
    limits: {
      properties: "Unlimited", rooms: "Unlimited", beds: "Unlimited", tenants: "Unlimited",
      staff: "Unlimited", whatsapp: 2000, ai: "Unlimited", storage: "50 GB",
    },
    features: [
      { text: "Everything in Professional", included: true },
      { text: "Unlimited properties & rooms", included: true },
      { text: "Multi-city operations", included: true },
      { text: "Custom agreement templates", included: true },
      { text: "Owner mini-website / subdomain", included: true },
      { text: "WhatsApp Business API (2000/mo)", included: true },
      { text: "Unlimited Ekrar AI queries", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Bulk operations & imports", included: true },
      { text: "API access", included: true },
      { text: "Custom branding", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Phone & WhatsApp support", included: true },
      { text: "SLA guarantee", included: true },
    ],
  },
];

const faqs = [
  { q: "Is eRentKarar really free to start?", a: "Yes! Our Starter plan is free forever with up to 1 property, 10 rooms, and 30 tenants. No credit card required. Upgrade only when you grow." },
  { q: "Can I switch plans anytime?", a: "Absolutely. Upgrade or downgrade your plan anytime. Changes take effect immediately. No lock-in contracts." },
  { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and wallets via Razorpay. All payments are processed securely in INR." },
  { q: "Is my data safe?", a: "Yes. All data is encrypted at rest and in transit with 256-bit encryption. KYC documents are stored in private buckets with signed URLs and access logging." },
  { q: "Do you support state-specific rental agreements?", a: "Yes. Our agreement engine supports state-wise stamp duty calculations for Karnataka, Maharashtra, Delhi, Tamil Nadu, Telangana, Gujarat, and more. Templates are configurable per state." },
  { q: "Can I manage both PGs and apartments?", a: "Yes. eRentKarar supports PGs, hostels, co-living, flats, apartments, rooms, and any residential rental property in India." },
  { q: "What is Ekrar AI?", a: "Ekrar AI is our built-in bilingual assistant that answers business questions in Hindi or English. Ask about pending rent, vacant rooms, expiring agreements, and more. It never has direct database access — it uses authorized tool functions for security." },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const getPrice = (basePrice: number) => {
    if (basePrice === 0) return "Free";
    const finalPrice = annual ? Math.round(basePrice * 10) : basePrice;
    return `₹${finalPrice.toLocaleString("en-IN")}`;
  };

  const getPeriod = (basePrice: number) => {
    if (basePrice === 0) return "forever";
    return annual ? "/year" : "/month";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Apple light style */}
      <section className="bg-[#f5f5f7] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center space-x-2 bg-[#0071e3]/8 border border-[#0071e3]/20 text-[#0071e3] px-5 py-2 rounded-full text-xs font-semibold">
            <Gift className="w-3.5 h-3.5" />
            <span>Early Access — Start Free, No Credit Card</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]">
            Simple, Transparent{" "}
            <span className="text-[#0071e3]">Pricing</span>
          </h1>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
            From a single PG to a multi-city rental chain — pay only for what you use. No hidden charges.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-sm font-medium ${!annual ? "text-[#1d1d1f]" : "text-[#86868b]"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${annual ? "bg-[#0071e3]" : "bg-[#d1d1d6]"}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${annual ? "left-8" : "left-1"}`} />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-[#1d1d1f]" : "text-[#86868b]"}`}>
              Annual <span className="text-[#0071e3] text-xs font-semibold ml-1">Save 17%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl border-2 ${
                  plan.popular
                    ? "border-[#0071e3] shadow-xl shadow-[#0071e3]/10 scale-[1.02]"
                    : "border-[rgba(0,0,0,0.08)] shadow-lg shadow-black/[0.04]"
                } p-6 sm:p-8 flex flex-col transition-all hover:shadow-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0071e3] text-white text-[10px] font-semibold px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${plan.popular ? "bg-[#0071e3]" : "bg-[#1d1d1f]"} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1d1d1f] text-lg">{plan.name}</h3>
                      <p className="text-[11px] text-[#86868b]">{plan.tagline}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-4xl font-bold text-[#1d1d1f]">{getPrice(plan.price)}</span>
                    <span className="text-sm text-[#86868b] ml-1">{getPeriod(plan.price)}</span>
                  </div>

                  {/* Limits Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[rgba(0,0,0,0.06)]">
                    {Object.entries(plan.limits).map(([key, val]) => (
                      <div key={key} className="bg-[#f5f5f7] rounded-xl px-3 py-2">
                        <p className="text-xs text-[#86868b] capitalize">{key.replace(/_/g, " ")}</p>
                        <p className="text-sm font-semibold text-[#1d1d1f]">{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 pt-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs">
                        {f.included ? (
                          <Check className="w-4 h-4 text-[#34a853] shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-[#d1d1d6] shrink-0 mt-0.5" />
                        )}
                        <span className={f.included ? "text-[#1d1d1f]" : "text-[#86868b]"}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/register"
                  className={`mt-6 w-full py-3 font-semibold rounded-full text-sm transition flex items-center justify-center space-x-2 active:scale-[0.98] ${
                    plan.popular
                      ? "apple-btn-primary"
                      : "apple-btn-secondary"
                  }`}
                >
                  <span>{plan.price === 0 ? "Start Free" : "Get Started"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="bg-[#f5f5f7] border-y border-[rgba(0,0,0,0.06)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">Everything You Need to Run a Rental Business</h2>
            <p className="text-sm text-[#86868b] mt-2 max-w-xl mx-auto">All features across all modules — property, tenant, billing, agreements, communication, and AI.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Building2, title: "Property Management", desc: "Properties, buildings, floors, rooms, beds with drag-drop inventory" },
              { icon: Users, title: "Tenant Lifecycle", desc: "Onboarding, KYC, move-in, stay management, move-out, deposit settlement" },
              { icon: IndianRupee, title: "Billing & Payments", desc: "Invoices, UPI/card collection, receipts, late fees, ledger, GST-ready" },
              { icon: FileText, title: "Agreements & eSign", desc: "State-compliant templates, stamp duty, Leegality eSign, PDF storage" },
              { icon: MessageSquare, title: "Communication", desc: "WhatsApp, email, SMS, in-app notifications, templates, delivery tracking" },
              { icon: Sparkles, title: "Ekrar AI Assistant", desc: "Bilingual (Hindi/English) AI for business questions, actions with confirmation" },
              { icon: Shield, title: "Security & Compliance", desc: "RBAC, IDOR protection, encrypted KYC vault, audit logs, tenant isolation" },
              { icon: BarChart3, title: "Reports & Analytics", desc: "Revenue, occupancy, lead conversion, tenant ledger, export PDF/CSV/Excel" },
              { icon: Gift, title: "Referral & Growth", desc: "Referral codes, reward tracking, anti-fraud, campaign management" },
            ].map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} className="apple-card p-5 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[rgba(0,0,0,0.08)] flex items-center justify-center">
                    <FIcon className="w-4.5 h-4.5 text-[#0071e3]" />
                  </div>
                  <h3 className="font-semibold text-[#1d1d1f] text-sm">{f.title}</h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] overflow-hidden transition">
              <button
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium text-[#1d1d1f] pr-4">{faq.q}</span>
                {openFAQ === i ? (
                  <ChevronUp className="w-4 h-4 text-[#86868b] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#86868b] shrink-0" />
                )}
              </button>
              {openFAQ === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-[#86868b] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA — Apple style */}
      <section className="bg-[#f5f5f7] py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">Ready to Digitize Your Rental Business?</h2>
          <p className="text-[#86868b] text-sm">Join thousands of Indian property owners managing rent, tenants, and agreements on eRentKarar.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="apple-btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm">
              <span>Start Free Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="apple-btn-secondary inline-flex items-center gap-2 px-8 py-3.5 text-sm">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
