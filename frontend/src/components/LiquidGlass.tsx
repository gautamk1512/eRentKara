"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Liquid Glass Component Library
 * Reference: rdev/liquid-glass-react & radix-ui/themes
 * Provides Apple-style liquid glass refraction, specular highlight bevels,
 * chromatic ambient orbs, and Radix theme color harmonies.
 */

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "jade" | "teal" | "amber" | "dark";
  glow?: boolean;
  interactive?: boolean;
  className?: string;
}

export function LiquidGlassCard({
  children,
  variant = "default",
  glow = false,
  interactive = false,
  className = "",
  ...props
}: LiquidGlassCardProps) {
  const variantStyles = {
    default: "liquid-glass text-slate-800",
    jade: "liquid-glass-jade text-emerald-950",
    teal: "liquid-glass-teal text-teal-950",
    amber: "liquid-glass-amber text-amber-950",
    dark: "liquid-glass-dark text-white",
  };

  return (
    <div
      className={`group relative rounded-3xl overflow-hidden transition-all duration-300 transform-gpu ${variantStyles[variant]} ${
        glow ? "shadow-2xl" : "shadow-lg"
      } ${interactive ? "hover:-translate-y-1 hover:shadow-xl" : ""} ${className}`}
      {...props}
    >
      {/* Specular Glare / Liquid Refraction Sheen - Pure CSS GPU Accelerated */}
      {interactive && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: "radial-gradient(circle 280px at 50% 30%, rgba(255, 255, 255, 0.4), transparent 70%)",
          }}
        />
      )}

      {/* Surface Gloss Edge Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "jade" | "teal" | "amber" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LiquidGlassButton({
  children,
  variant = "jade",
  size = "md",
  className = "",
  ...props
}: LiquidGlassButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-xl",
    md: "px-5 py-2.5 text-xs sm:text-sm rounded-2xl",
    lg: "px-7 py-3.5 text-sm sm:text-base rounded-2xl",
  };

  const variantStyles = {
    jade: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/35",
    teal: "bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-600/25 border border-teal-400/40 hover:shadow-xl hover:shadow-teal-500/35",
    amber: "bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 border border-amber-300/60 hover:shadow-xl hover:shadow-amber-400/35",
    ghost: "liquid-glass text-slate-800 border border-white/60 hover:bg-white/80 shadow-sm",
    dark: "bg-slate-900/90 text-white border border-white/15 backdrop-blur-xl shadow-lg hover:bg-slate-800",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.025, y: -1 }}
      whileTap={{ scale: 0.975 }}
      className={`relative inline-flex items-center justify-center font-bold tracking-tight overflow-hidden transition-all duration-200 cursor-pointer ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...(props as any)}
    >
      {/* Specular Linear Light Sweep on Hover */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
      <span className="relative z-10 flex items-center space-x-2">{children}</span>
    </motion.button>
  );
}

/**
 * Liquid Ambient Background Orbs
 * Lightweight, GPU-composited ambient gradients that do NOT cause lag
 */
export function LiquidOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient Gradient 1: Radix Sapphire / Navy & Jade */}
      <div
        className="absolute top-10 left-[15%] w-[480px] h-[480px] rounded-full bg-gradient-to-br from-indigo-500/15 via-teal-400/12 to-transparent blur-2xl transform-gpu"
      />

      {/* Ambient Gradient 2: Radix Teal / Cyan */}
      <div
        className="absolute top-40 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-teal-400/15 via-cyan-400/10 to-indigo-400/8 blur-2xl transform-gpu"
      />

      {/* Ambient Gradient 3: Warm Stamp Amber */}
      <div
        className="absolute bottom-20 left-[35%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber-400/12 via-emerald-400/8 to-transparent blur-2xl transform-gpu"
      />
    </div>
  );
}

/**
 * Radix-styled Status Pill
 */
interface RadixBadgeProps {
  children: React.ReactNode;
  color?: "jade" | "teal" | "amber" | "iris" | "slate";
  size?: "sm" | "md";
  className?: string;
  pulse?: boolean;
}

export function RadixBadge({
  children,
  color = "jade",
  size = "md",
  className = "",
  pulse = false,
}: RadixBadgeProps) {
  const colorStyles = {
    jade: "bg-[#e6f7ef] text-[#167961] border-[#a0dcc1] shadow-xs",
    teal: "bg-[#e0f8f5] text-[#067a6d] border-[#8ee3d8] shadow-xs",
    amber: "bg-[#fff7c2] text-[#ab6400] border-[#f7d34a] shadow-xs",
    iris: "bg-[#f0f0fb] text-[#4848bb] border-[#c1c1f0] shadow-xs",
    slate: "bg-[#f1f3f5] text-[#11181c] border-[#dfe2e6] shadow-xs",
  };

  const dotColors = {
    jade: "bg-[#29a383]",
    teal: "bg-[#12a594]",
    amber: "bg-[#ffba18]",
    iris: "bg-[#5b5bd6]",
    slate: "bg-[#889096]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
  };

  return (
    <span
      className={`inline-flex items-center space-x-1.5 rounded-full font-bold uppercase tracking-wider border backdrop-blur-xs ${colorStyles[color]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[color]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[color]}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
