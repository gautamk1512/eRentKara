"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Building2, FileText, ArrowRight, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlatformSwitcherNudge() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const isRental =
    pathname?.startsWith("/rental") ||
    pathname?.startsWith("/properties") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/tenant");

  useEffect(() => {
    // Initial reveal after 4 seconds of landing
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Re-nudge every 60 seconds (1 minute interval requested by user)
    const intervalTimer = setInterval(() => {
      setVisible(true);
      setMinimized(false);
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [pathname]);

  const targetPath = isRental ? "/" : "/rental";
  const targetLabel = isRental ? "e-Stamp Rent Agreement" : "Rental Management Cloud OS";
  const targetDesc = isRental
    ? "Need an authentic Government e-Stamp Rent Agreement with Aadhaar eSign?"
    : "Looking to Manage PGs, Hostels, Rooms or Find Tenants with Zero Brokerage?";
  const Icon = isRental ? FileText : Building2;

  const handleSwitch = () => {
    router.push(targetPath);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-96 font-sans pointer-events-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={handleSwitch}
          className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-900/95 text-white p-4 shadow-2xl border border-emerald-500/40 backdrop-blur-xl hover:border-emerald-400 transition-all duration-300"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition" />

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            title="Dismiss reminder"
            className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition z-20 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-start gap-3 relative z-10">
            {/* Animated Moving Hand Pointer Cursor */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Icon className="w-5 h-5" />
              </div>

              {/* Hand Cursor with continuous gliding/tapping animation */}
              <motion.div
                animate={{
                  x: [0, 8, 0],
                  y: [0, -4, 0],
                  rotate: [-5, 8, -5],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 -right-2 text-2xl select-none filter drop-shadow-md pointer-events-none"
              >
                👉
              </motion.div>
            </div>

            {/* Context Text */}
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  Quick Switcher
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-snug">
                {targetDesc}
              </p>
              
              <div className="mt-2.5 flex items-center gap-1.5 text-xs font-black text-emerald-400 group-hover:text-emerald-300 transition">
                <span>Click here to Switch to {targetLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
