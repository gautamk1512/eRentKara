"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Tag,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Flame,
  ShieldCheck,
  Building2,
  FileText,
  Clock,
  Gift,
  HelpCircle,
  ExternalLink,
  Percent,
  Zap,
  Users
} from "lucide-react";

export default function PromotionsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCoupon = (code: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const promotions = [
    {
      id: "free-pg-os",
      badge: "🔥 Most Popular • 100% Free Forever",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      title: "100% Free PG & Hostel Cloud Management Software",
      discount: "₹0 / Free",
      regularPrice: "₹1,499/mo value",
      description: "Manage unlimited beds, rooms, WhatsApp rent receipts, utility meter billing, and receive verified tenant inquiries with zero commission.",
      coupon: "FREEPG2026",
      ctaText: "Start Managing Free",
      ctaLink: "/list-your-property",
      features: [
        "Unlimited Buildings, Rooms & Beds tracking",
        "Automated WhatsApp rent reminder invoices",
        "Sub-meter electricity unit calculator",
        "Tenant Aadhaar KYC & admission register",
        "Zero brokerage direct tenant inquiries",
      ],
      icon: Building2,
      accent: "from-emerald-500 to-teal-700",
    },
    {
      id: "stamp-50",
      badge: "⚡ Legal Deal • 50% Off",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      title: "Government e-Stamp & Digital Rent Agreement",
      discount: "Flat 50% Off",
      regularPrice: "Legal Service Fee ₹799 -> ₹399",
      description: "Get state-compliant rental agreements with official government e-Stamp certificate, Aadhaar OTP eSign, and doorstep courier delivery.",
      coupon: "STAMP50",
      ctaText: "Draft Agreement Now",
      ctaLink: "/rent-agreement/create",
      features: [
        "Official State Government e-Stamp Paper",
        "Aadhaar OTP Biometric/Digital eSign (IT Act Sec 3A)",
        "Compliant with Model Tenancy Act 2021",
        "Instant PDF download on Email & WhatsApp",
        "Court-admissible tamper-proof QR certificate",
      ],
      icon: FileText,
      accent: "from-blue-500 to-indigo-700",
    },
    {
      id: "kyc-free",
      badge: "🛡️ Safety First • ₹0 Fee",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      title: "Tenant KYC & Police Verification Generator",
      discount: "100% Free",
      regularPrice: "Advocate draft ₹300 -> ₹0",
      description: "Generate compliant tenant police verification forms with ID verification proofs ready to submit to your local police station.",
      coupon: "FREEKYC",
      ctaText: "Generate Verification Form",
      ctaLink: "/tools/tenant-police-verification-form-generator",
      features: [
        "Pre-formatted for Gujarat, Maharashtra, Karnataka & Delhi",
        "Instant masked ID document verification",
        "Owner undertaking declaration format",
        "Download print-ready high resolution PDF",
        "Zero registration required for generator",
      ],
      icon: ShieldCheck,
      accent: "from-amber-500 to-orange-700",
    },
    {
      id: "referral-500",
      badge: "💰 Cash Reward • Instant UPI",
      badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      title: "Refer a Landlord & Earn ₹500 Cash",
      discount: "₹500 / Referral",
      regularPrice: "Instant Bank / UPI Transfer",
      description: "Know a PG, hostel or flat owner? Share your referral code. When they register and list their property, you get ₹500 credited directly.",
      coupon: "REFER500",
      ctaText: "Get Your Referral Code",
      ctaLink: "/dashboard/referrals",
      features: [
        "Direct UPI bank transfer within 24 hours",
        "No limit on number of landlords referred",
        "Referred owner gets priority listing badge",
        "Real-time referral tracking dashboard",
        "Anti-fraud guaranteed payout ledger",
      ],
      icon: Users,
      accent: "from-purple-500 to-pink-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Launch Offers & Vouchers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            India's Best Rental Offers. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Zero Brokerage. Maximum Savings.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Take advantage of active eRentKarar coupons and promotions. Whether you are listing a PG, drafting a legal lease deed, or onboarding tenants, save thousands today.
          </p>
        </div>
      </section>

      {/* Main Promotions Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promotions.map((promo) => {
            const Icon = promo.icon;
            const isCopied = copiedCode === promo.coupon;

            return (
              <div
                key={promo.id}
                className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition duration-300 shadow-xl relative overflow-hidden group"
              >
                {/* Glow accent */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${promo.accent} opacity-5 blur-3xl group-hover:opacity-10 transition`} />

                <div className="space-y-6 relative z-10">
                  {/* Badge & Discount */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${promo.badgeColor}`}>
                      {promo.badge}
                    </span>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-white block">
                        {promo.discount}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through">
                        {promo.regularPrice}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {promo.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {promo.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    {promo.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Box */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Coupon Code</span>
                        <span className="font-mono text-xs font-black tracking-wider text-amber-400">{promo.coupon}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => copyCoupon(promo.coupon)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-6 relative z-10">
                  <Link
                    href={promo.ctaLink}
                    className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <span>{promo.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo FAQ */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Promotion Terms & Frequently Asked Questions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="space-y-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <strong className="text-white block text-sm font-bold">Is the PG & Hostel software really 100% free?</strong>
              <p className="text-slate-400 leading-relaxed">
                Yes! There are no monthly charges or hidden subscription fees for property owners to list properties, manage rooms, and send WhatsApp rent receipts.
              </p>
            </div>

            <div className="space-y-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <strong className="text-white block text-sm font-bold">How is the 50% discount applied to rent agreements?</strong>
              <p className="text-slate-400 leading-relaxed">
                The discount applies automatically at checkout or when using coupon code STAMP50. You only pay statutory state stamp duty and discounted gateway costs.
              </p>
            </div>

            <div className="space-y-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <strong className="text-white block text-sm font-bold">When is the ₹500 referral bonus credited?</strong>
              <p className="text-slate-400 leading-relaxed">
                As soon as the referred landlord registers their PG or property, the ₹500 payout is verified by Admin and credited straight to your registered UPI ID.
              </p>
            </div>

            <div className="space-y-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <strong className="text-white block text-sm font-bold">Can I use multiple promotions together?</strong>
              <p className="text-slate-400 leading-relaxed">
                Yes, our free management tier and agreement discounts can be utilized simultaneously for all your rental properties.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
