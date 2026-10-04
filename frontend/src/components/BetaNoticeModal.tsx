"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X, Rocket, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BetaNoticeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the notice in this session
    const dismissed = sessionStorage.getItem("erk_beta_notice_seen");
    if (!dismissed) {
      // Small timeout for smooth entry animation after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-beta-modal", handleOpen);
    return () => window.removeEventListener("open-beta-modal", handleOpen);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("erk_beta_notice_seen", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[rgba(0,0,0,0.08)] relative overflow-hidden"
          >
            {/* Top decorative gradient line — Apple Blue */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0071e3]" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon + Badge */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center shadow-lg shadow-[#0071e3]/25 shrink-0">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] animate-ping" />
                  <span>Public Beta 2.0</span>
                </span>
                <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight mt-0.5">
                  Welcome to eRentKarar
                </h3>
              </div>
            </div>

            {/* Exact notice message requested by user */}
            <div className="p-4 rounded-2xl bg-[#f5f5f7] border border-[rgba(0,0,0,0.06)] mb-5 space-y-2">
              <p className="text-sm font-bold text-[#1d1d1f]">
                Our website has development sections — This is a Beta version.
              </p>
              <p className="text-xs text-[#86868b] leading-relaxed">
                eRentKarar is currently in its active development phase. Modules including India e-Stamp legal drafting, Zoho Sign Aadhaar eSign, and Instant Property Ownership Verification are active in sandbox testing. Stay tuned as we go live!
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-2 mb-6 text-xs font-medium text-[#1d1d1f]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0" />
                <span>e-Stamp & Aadhaar eSign Agreement platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0" />
                <span>Smart Rental & PG Management SaaS</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0" />
                <span>8+ Free Indian Rental Calculators & Tools</span>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="apple-btn-primary w-full py-3 px-5 text-sm flex items-center justify-center space-x-2"
            >
              <span>Explore Platform • Stay Tuned</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
