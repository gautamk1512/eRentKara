"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, FileText, Building2, Store, Sparkles, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "STAMP" | "ESIGN" | "COMMERCIAL" | "KIOSK" | "POLICE" | "RENEWAL";
  title: string;
  city: string;
  meta: string;
  timeAgo: string;
  badge: string;
  badgeColor: string;
}

const liveActivitiesRow1: ActivityItem[] = [
  {
    id: "ACT-101",
    type: "STAMP",
    title: "₹500 Non-Judicial e-Stamp Issued",
    city: "Bandra West, Mumbai",
    meta: "Residential Tenancy • Govt Stamped",
    timeAgo: "2 mins ago",
    badge: "Verified e-Stamp",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-102",
    type: "ESIGN",
    title: "Dual Aadhaar OTP eSign Completed",
    city: "Whitefield, Bengaluru",
    meta: "Landlord: Vikram M. & Tenant: Aarav S.",
    timeAgo: "4 mins ago",
    badge: "UIDAI eSign",
    badgeColor: "bg-[#0071e3]/15 text-[#2997ff] border-[#0071e3]/30",
  },
  {
    id: "ACT-103",
    type: "COMMERCIAL",
    title: "Commercial Lease Deed Executed",
    city: "Cyber City, Gurugram",
    meta: "1,450 sq.ft Corporate Office • 3-Yr Lock-in",
    timeAgo: "6 mins ago",
    badge: "Commercial",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-104",
    type: "KIOSK",
    title: "Walk-in Deed Printed & Stamped",
    city: "Kiosk #108, HSR Layout, BLR",
    meta: "Assisted In-Person Biometric Kiosk",
    timeAgo: "9 mins ago",
    badge: "Kiosk Certified",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-105",
    type: "POLICE",
    title: "Police Tenant Verification Filed",
    city: "Wakad, Pune",
    meta: "Digital Receipt Generated with Stamp",
    timeAgo: "12 mins ago",
    badge: "Police Intimation",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-106",
    type: "RENEWAL",
    title: "11-Month Tenancy Agreement Renewed",
    city: "Saket, New Delhi",
    meta: "Automatic 5% Escalation Clause Stamped",
    timeAgo: "15 mins ago",
    badge: "Auto-Renewal",
    badgeColor: "bg-[#0071e3]/15 text-[#2997ff] border-[#0071e3]/30",
  },
];

const liveActivitiesRow2: ActivityItem[] = [
  {
    id: "ACT-201",
    type: "ESIGN",
    title: "Biometric e-Signature Affixed",
    city: "Koramangala, Bengaluru",
    meta: "Digital Seal Verification #ERK-8821",
    timeAgo: "3 mins ago",
    badge: "Instant Legal",
    badgeColor: "bg-[#0071e3]/15 text-[#2997ff] border-[#0071e3]/30",
  },
  {
    id: "ACT-202",
    type: "STAMP",
    title: "State Treasury e-Challan Paid",
    city: "Anna Nagar, Chennai",
    meta: "Govt of Tamil Nadu Official Stamp Seal",
    timeAgo: "7 mins ago",
    badge: "Govt Treasury",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-203",
    type: "COMMERCIAL",
    title: "Retail Shop Lease Agreement",
    city: "Connaught Place, New Delhi",
    meta: "Prime Commercial Floor • Notarized",
    timeAgo: "10 mins ago",
    badge: "Commercial Lease",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-204",
    type: "KIOSK",
    title: "Aadhaar eSign Biometric Verification",
    city: "Kiosk #042, Madhapur, HYD",
    meta: "Instant PDF Delivery via WhatsApp",
    timeAgo: "13 mins ago",
    badge: "In-Person Service",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-205",
    type: "STAMP",
    title: "Karnataka e-Stamp Paper Stamped",
    city: "Indiranagar, Bengaluru",
    meta: "SHCIL Certificate IN-KA991823",
    timeAgo: "16 mins ago",
    badge: "SHCIL Stamped",
    badgeColor: "bg-white/10 text-white border-white/15",
  },
  {
    id: "ACT-206",
    type: "RENEWAL",
    title: "Residential Deed Auto-Notarized",
    city: "Salt Lake, Kolkata",
    meta: "11-Month MTA Tenancy Deed",
    timeAgo: "18 mins ago",
    badge: "Auto-Renewal",
    badgeColor: "bg-[#0071e3]/15 text-[#2997ff] border-[#0071e3]/30",
  },
];

export default function LiveAutoTicker() {
  return (
    <section className="relative py-12 bg-[#000000] text-white border-y border-white/[0.08] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0071e3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0071e3]"></span>
            </span>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-sm font-semibold tracking-tight text-[#f5f5f7]">
                  Live Activity Stream
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#d2d2d7] border border-white/10 text-[9px] font-medium tracking-wide">
                  Real Time
                </span>
              </div>
              <p className="text-xs text-[#86868b] mt-0.5">
                State e-stamping, Aadhaar eSigns, and registered agreements across India
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-normal text-[#86868b]">
            <span className="flex items-center space-x-1.5 text-[#d2d2d7]">
              <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
              <span>100% Legal Enforceability</span>
            </span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span className="hidden sm:flex items-center space-x-1.5 text-[#d2d2d7]">
              <Clock className="w-4 h-4 text-[#86868b]" />
              <span>Turnaround: ~5 Mins</span>
            </span>
          </div>
        </div>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative w-full overflow-hidden codehelp-mask-fade-x py-1.5">
        <div className="animate-marquee-h space-x-4">
          {[...liveActivitiesRow1, ...liveActivitiesRow1].map((item, idx) => (
            <div
              key={`row1-${item.id}-${idx}`}
              className="w-[340px] shrink-0 p-4 rounded-2xl bg-[#161617] border border-white/[0.08] transition-all duration-300 hover:border-white/[0.2] cursor-default group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] text-[#86868b] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#86868b]" />
                  <span>{item.timeAgo}</span>
                </span>
              </div>

              <h4 className="text-xs font-semibold text-[#f5f5f7] group-hover:text-white transition-colors line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#86868b] mt-0.5 line-clamp-1">
                {item.city}
              </p>
              <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#86868b]">
                <span className="truncate max-w-[200px]">{item.meta}</span>
                <span className="text-[#2997ff] font-medium">✓ Executed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 */}
      <div className="relative w-full overflow-hidden codehelp-mask-fade-x py-1.5 mt-2">
        <div className="animate-marquee-h-reverse space-x-4">
          {[...liveActivitiesRow2, ...liveActivitiesRow2].map((item, idx) => (
            <div
              key={`row2-${item.id}-${idx}`}
              className="w-[340px] shrink-0 p-4 rounded-2xl bg-[#161617] border border-white/[0.08] transition-all duration-300 hover:border-white/[0.2] cursor-default group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-medium tracking-wide px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] text-[#86868b] flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-[#86868b]" />
                  <span>{item.timeAgo}</span>
                </span>
              </div>

              <h4 className="text-xs font-semibold text-[#f5f5f7] group-hover:text-white transition-colors line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#86868b] mt-0.5 line-clamp-1">
                {item.city}
              </p>
              <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#86868b]">
                <span className="truncate max-w-[200px]">{item.meta}</span>
                <span className="text-[#2997ff] font-medium">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Live Counter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between text-xs text-[#86868b] gap-4">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-white font-semibold text-sm mr-1.5">52,410+</span>
            <span>Agreements Executed</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-semibold text-sm mr-1.5">₹1.8 Cr+</span>
            <span>State Stamp Duty Remitted</span>
          </div>
          <div>
            <span className="text-white font-semibold text-sm mr-1.5">4.9 / 5.0</span>
            <span>Satisfaction Score</span>
          </div>
        </div>

        <div className="text-[11px] text-[#86868b]">
          Verified by State Stamp Authorities
        </div>
      </div>
    </section>
  );
}
