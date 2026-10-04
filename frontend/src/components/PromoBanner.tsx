"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight, Tag, Gift, Flame } from "lucide-react";

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("erk_promo_dismissed");
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("erk_promo_dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white text-xs font-semibold py-2 px-3 sm:px-6 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left side offer badge & message */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-xs border border-white/25 shrink-0">
            <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
            <span>Launch Offer</span>
          </span>
          <p className="truncate text-slate-100 font-medium">
            <strong className="text-white font-bold">100% Free PG & Hostel Cloud OS</strong> for Owners + <strong className="text-white font-bold">Flat 50% Off</strong> on Legal e-Stamp Delivery!
          </p>
        </div>

        {/* Right side CTA & Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/promotions"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-emerald-800 text-[11px] font-black hover:bg-emerald-50 transition shadow-sm"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Close promotion banner"
            title="Dismiss announcement"
            className="p-1 rounded-full hover:bg-black/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
