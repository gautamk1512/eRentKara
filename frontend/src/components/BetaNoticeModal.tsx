"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles, X, Rocket, ShieldCheck, ArrowRight,
  Building2, Home, CheckCircle2, Clock, Zap, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BetaNoticeModal() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Check if current page is an agreement-related page or the home agreement portal
  const isAgreementPage =
    pathname === "/" ||
    pathname?.startsWith("/agreement") ||
    pathname?.startsWith("/rent-agreement") ||
    pathname?.startsWith("/rent-agreement-ai");

  useEffect(() => {
    // Only auto-trigger if explicitly not on the active rent-agreement flow
    // and if not dismissed in current session
    if (isAgreementPage && pathname !== "/rent-agreement" && !pathname?.startsWith("/rent-agreement/create")) {
      const dismissed = sessionStorage.getItem("erk_agreement_notice_seen");
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname, isAgreementPage]);

  // Global event listener to trigger modal from any button
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-beta-modal", handleOpen);
    window.addEventListener("open-agreement-notice-modal", handleOpen);
    return () => {
      window.removeEventListener("open-beta-modal", handleOpen);
      window.removeEventListener("open-agreement-notice-modal", handleOpen);
    };
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("erk_agreement_notice_seen", "true");
    setIsOpen(false);
  };

  const handleGoToRentalOS = () => {
    handleClose();
    router.push("/rental");
  };

  const handleGoToMarketplace = () => {
    handleClose();
    router.push("/properties");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden text-slate-900 dark:text-white"
          >
            {/* Top decorative gradient bar — Amber to Emerald */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Status Pill & Icon */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-extrabold uppercase tracking-wider">
                    <AlertCircle className="w-3 h-3" />
                    <span>Agreement Studio Upgrading</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-extrabold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Rental OS Live</span>
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1 leading-snug">
                  We are working on this page — Agreement starts soon!
                </h3>
              </div>
            </div>

            {/* Main Highlight Card: Rental OS Onboarding is Live */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/60 mb-5 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                <Rocket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Rental OS & PG/Hostel Onboarding is LIVE!</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                We are currently finalizing the state government e-Stamp certificate integration. <strong>Digital Agreement drafting will start very soon!</strong>
              </p>
              <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                Meanwhile, <strong>Rental OS Onboarding is 100% active</strong>. Property owners and managers can start onboarding properties and tenants right now:
              </p>
              
              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>List PGs, Hostels & Flats</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Sub-meter electricity billing</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>WhatsApp UPI payment links</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Tenant KYC & Admission</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="button"
                onClick={handleGoToRentalOS}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Go to Rental OS &amp; Start Onboarding →</span>
              </motion.button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGoToMarketplace}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Home className="w-3.5 h-3.5 text-[#0071e3]" />
                  <span>Explore Stays</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium text-xs transition cursor-pointer"
                >
                  <span>Continue Preview</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
