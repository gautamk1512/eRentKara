"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles,
  Building2, User, FileText, CheckCircle2, ArrowRight,
  ShieldCheck, Smartphone, MapPin, Zap, Clock, ExternalLink,
  ChevronRight, Laptop, Maximize2, Minimize2, Users, Calendar
} from "lucide-react";

interface StepDetail {
  stepNumber: number;
  title: string;
  badge: string;
  duration: number; // in seconds
  description: string;
  keyPoints: string[];
  mockUiType: "owner_register" | "owner_property" | "owner_billing" | "tenant_search" | "tenant_booking" | "tenant_pay" | "ai_agreement" | "estamp_esign";
}

interface Chapter {
  id: "OWNER" | "TENANT" | "AGREEMENT";
  title: string;
  badge: string;
  icon: any;
  color: string;
  steps: StepDetail[];
}

export default function MotionVideoTour() {
  const [activeChapterId, setActiveChapterId] = useState<"OWNER" | "TENANT" | "AGREEMENT">("OWNER");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const chapters: Record<"OWNER" | "TENANT" | "AGREEMENT", Chapter> = {
    OWNER: {
      id: "OWNER",
      title: "For Property Owners & Landlords",
      badge: "Owner & PG Suite",
      icon: Building2,
      color: "from-emerald-600 to-teal-700",
      steps: [
        {
          stepNumber: 1,
          title: "1-Click Landlord Registration & KYC",
          badge: "Step 1 of 3",
          duration: 7,
          description: "Sign up in 30 seconds with mobile OTP. Verify your phone & organization name to instantly unlock the multi-property management suite.",
          keyPoints: ["Instant Mobile OTP Sign-in", "GST & Organization Profile", "Zero Setup Fees"],
          mockUiType: "owner_register",
        },
        {
          stepNumber: 2,
          title: "Add Property, Rooms & Beds with Live Map",
          badge: "Step 2 of 3",
          duration: 8,
          description: "List your property in Gujarat or across India with exact locality, photo uploads, amenities, and room/bed inventory pricing.",
          keyPoints: ["Automatic Geocoding & Pins", "Room & Floor Hierarchy", "Instant Marketplace Listing"],
          mockUiType: "owner_property",
        },
        {
          stepNumber: 3,
          title: "Automate Rent Invoices & WhatsApp QR",
          badge: "Step 3 of 3",
          duration: 8,
          description: "Generate monthly rent invoices with electricity sub-meter calculations. Tenants receive automated WhatsApp payment links with 0% UPI fees.",
          keyPoints: ["Sub-meter Reading Engine", "WhatsApp Auto-Reminders", "Instant Payment Reconciliation"],
          mockUiType: "owner_billing",
        },
      ],
    },
    TENANT: {
      id: "TENANT",
      title: "For Tenants & Stay Seekers",
      badge: "Tenant Experience",
      icon: User,
      color: "from-blue-600 to-indigo-700",
      steps: [
        {
          stepNumber: 1,
          title: "Explore Verified Stays with Interactive Map",
          badge: "Step 1 of 3",
          duration: 7,
          description: "Search across All India, Vadodara, Ahmedabad, Surat, and top metros. Use interactive price pins, locality filters, and verified tags.",
          keyPoints: ["Zero Brokerage", "Live OpenStreetMap Pins", "Filter by Food, AC & Gender"],
          mockUiType: "tenant_search",
        },
        {
          stepNumber: 2,
          title: "Instant Bed Lock with ₹1,000 Token",
          badge: "Step 2 of 3",
          duration: 8,
          description: "Select your desired room & bed with atomic reservation locking. Schedule a free visit or lock the stay instantly with full refund guarantee.",
          keyPoints: ["Atomic Double-Booking Protection", "Instant Digital Token", "Schedule Free Visits"],
          mockUiType: "tenant_booking",
        },
        {
          stepNumber: 3,
          title: "Tenant App: UPI Pay & Maintenance Tickets",
          badge: "Step 3 of 3",
          duration: 8,
          description: "Access your tenant portal to pay monthly rent via UPI/Credit Card, view digital rent receipts, and raise 1-click maintenance tickets.",
          keyPoints: ["1-Click Rent Payment", "Instant GST / Tax Invoices", "Live Ticket Status Tracking"],
          mockUiType: "tenant_pay",
        },
      ],
    },
    AGREEMENT: {
      id: "AGREEMENT",
      title: "AI Rental Agreement & Legal e-Stamp",
      badge: "Legal e-Stamping",
      icon: FileText,
      color: "from-amber-600 to-rose-700",
      steps: [
        {
          stepNumber: 1,
          title: "AI Real-time Drafting in 3 Minutes",
          badge: "Step 1 of 2",
          duration: 7,
          description: "Describe your rental terms in Gujarati, Hindi, or English. Our legal AI automatically compiles state-compliant clauses with custom lock-in rules.",
          keyPoints: ["Multilingual Voice / Text AI", "State-Specific Tenancy Law", "Custom Escalation & Deposit Rules"],
          mockUiType: "ai_agreement",
        },
        {
          stepNumber: 2,
          title: "Govt e-Stamp & Aadhaar OTP eSign",
          badge: "Step 2 of 2",
          duration: 8,
          description: "Affix authentic non-judicial state e-Stamp paper. Both landlord and tenant sign via secure UIDAI Aadhaar OTP. Download sealed PDF with QR code.",
          keyPoints: ["Official NeSL / Govt e-Stamp", "IT Act 2000 Compliant eSign", "Verifiable Public QR Registry"],
          mockUiType: "estamp_esign",
        },
      ],
    },
  };

  const activeChapter = chapters[activeChapterId];
  const currentStep = activeChapter.steps[currentStepIndex] || activeChapter.steps[0];

  const stepDurationMs = (currentStep.duration * 1000) / playbackSpeed;

  // Ultra-efficient step timer (zero component re-renders during playback)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < activeChapter.steps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        setCurrentStepIndex(0);
      }
    }, stepDurationMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, activeChapterId, stepDurationMs, activeChapter.steps.length]);

  const handleOpenDemoModal = (tab: "SCHEDULE" | "INSTANT") => {
    window.dispatchEvent(new CustomEvent("open-demo-modal", { detail: { tab } }));
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${isExpanded ? "fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl overflow-y-auto p-4 sm:p-8" : ""}`}>
      <div className="bg-slate-950 rounded-3xl sm:rounded-[36px] border border-slate-800 shadow-2xl overflow-hidden text-white relative">
        
        {/* Top Video Header Bar with Live Badge & Controls */}
        <div className="px-5 sm:px-8 py-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f172a] via-[#0071e3] to-[#005bb5] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                  eRentKarar Motion Walkthrough
                </span>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Interactive 4K Tour</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                See how Landlords, Tenants, and Legal Agreements work seamlessly in 2 minutes.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Playback Speed Pill */}
            <button
              type="button"
              onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
              title="Change Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Mute / Audio Waveform Indicator */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title={isMuted ? "Unmute Voiceover" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Free Demo Schedule Button */}
            <button
              type="button"
              onClick={() => handleOpenDemoModal("SCHEDULE")}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Free Live Demo</span>
            </button>
          </div>
        </div>

        {/* Chapter Selection Tabs */}
        <div className="px-5 sm:px-8 pt-4 pb-2 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {(["OWNER", "TENANT", "AGREEMENT"] as const).map((chapId) => {
            const chap = chapters[chapId];
            const Icon = chap.icon;
            const isSelected = activeChapterId === chapId;
            return (
              <button
                key={chapId}
                type="button"
                onClick={() => {
                  setActiveChapterId(chapId);
                  setCurrentStepIndex(0);
                }}
                className={`px-4 py-2 rounded-2xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-white text-slate-950 shadow-md font-extrabold"
                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-700" : "text-slate-400"}`} />
                <span>{chap.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Video Motion Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-8 items-center">
          
          {/* Left: Step Explainer & Narration Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  {currentStep.badge}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeChapter.title}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentStep.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentStep.description}
              </p>
            </div>

            {/* Key Benefits / Highlights */}
            <div className="space-y-2 pt-1">
              {currentStep.keyPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{point}</span>
                </div>
              ))}
            </div>

            {/* Step Navigation Dots & Progress */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  {activeChapter.steps.map((st, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => {
                        setCurrentStepIndex(sIdx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        sIdx === currentStepIndex
                          ? "w-8 bg-emerald-400"
                          : sIdx < currentStepIndex
                          ? "w-3 bg-slate-600"
                          : "w-3 bg-slate-800"
                      }`}
                      title={`Jump to ${st.title}`}
                    />
                  ))}
                </div>

                {/* Play / Pause Toggle */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-bold transition cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Play Tour</span>
                    </>
                  )}
                </button>
              </div>

              {/* Real-time Progress Bar - 120fps GPU Keyframe Animation */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                <div
                  key={`${activeChapterId}-${currentStepIndex}-${isPlaying}-${playbackSpeed}`}
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{
                    width: isPlaying ? "100%" : "0%",
                    transition: isPlaying ? `width ${stepDurationMs}ms linear` : "none",
                  }}
                />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleOpenDemoModal("INSTANT")}
                className="px-4 py-2 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Launch Interactive Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {activeChapterId === "OWNER" ? (
                <Link
                  href="/register?role=owner"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                >
                  <span>+ Register as Landlord</span>
                </Link>
              ) : activeChapterId === "TENANT" ? (
                <Link
                  href="/properties"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                >
                  <span>Explore Stays Map</span>
                </Link>
              ) : (
                <Link
                  href="/rent-agreement-ai"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 border border-slate-700"
                >
                  <span>Draft AI Agreement</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right: Dynamic Animated Motion Screen Simulation */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
              
              {/* Device Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono pl-2">
                    https://erentkarar.com/{activeChapterId === "OWNER" ? "rental" : activeChapterId === "TENANT" ? "properties" : "rent-agreement"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 animate-pulse">
                    LIVE SYSTEM SIMULATION
                  </span>
                </div>
              </div>

              {/* Dynamic Animated UI Screens based on mockUiType */}
              <div className="py-5 flex-1 flex flex-col justify-center">
                
                {/* 1. Owner Registration Mock Screen */}
                {currentStep.mockUiType === "owner_register" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Owner &amp; PG Manager Sign-in</h4>
                          <p className="text-[11px] text-slate-400">Enter phone number to receive instant OTP</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded-md">OTP Sent ✓</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Mobile Phone</span>
                        <span className="text-xs font-mono font-bold text-white">+91 98765 43210</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Business / PG Name</span>
                        <span className="text-xs font-bold text-emerald-400">Royal Stays Co-Living (Vadodara)</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold text-emerald-200">Owner Identity &amp; Bank Account Linked</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">Verified</span>
                    </div>
                  </div>
                )}

                {/* 2. Owner Property & Inventory Screen */}
                {currentStep.mockUiType === "owner_property" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold">New Property Listed</span>
                        <h4 className="text-sm font-bold text-white">Akota Serviced Executive Residency</h4>
                      </div>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
                        Live on Marketplace 📍
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Total Beds</span>
                        <span className="text-sm font-black text-white">24 Beds</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Occupancy</span>
                        <span className="text-sm font-black text-emerald-400">92% Full</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Monthly Rent</span>
                        <span className="text-sm font-black text-white">₹8,500/mo</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Gujarat Location Pin:</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Alkapuri / Akota, Vadodara</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Owner Billing & WhatsApp Screen */}
                {currentStep.mockUiType === "owner_billing" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">Automated WhatsApp Rent Demand</h4>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        0% UPI Gateway
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#075e54]/20 border border-[#128c7e]/40 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-emerald-300 font-bold">
                        <span>💬 WhatsApp to Tenant (Aarav Sharma)</span>
                        <span className="text-[10px]">Just now</span>
                      </div>
                      <p className="text-slate-200 text-[11px] leading-relaxed">
                        &quot;Hi Aarav, your rent invoice for Room 102 (₹8,500 + ₹450 Electricity) is generated. Click below to pay via UPI with instant receipt.&quot;
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="px-3 py-1 bg-emerald-500 text-slate-950 rounded-lg text-[10px] font-black">
                          👉 Pay ₹8,950 via UPI QR
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Live Collection Status:</span>
                      <span className="font-black text-emerald-400">₹2,14,500 / ₹2,20,000 Collected</span>
                    </div>
                  </div>
                )}

                {/* 4. Tenant Search & Map Screen */}
                {currentStep.mockUiType === "tenant_search" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Exploring 22 Verified Stays across India</span>
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        Interactive Map
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Selected City</span>
                        <span className="text-xs font-bold text-emerald-400 block">Vadodara, Gujarat</span>
                        <span className="text-[10px] text-slate-400">Alkapuri, Gotri, Sayajigunj</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Stay Type</span>
                        <span className="text-xs font-bold text-white block">Co-Living &amp; Luxury Flats</span>
                        <span className="text-[10px] text-emerald-400">Food &amp; Wi-Fi Included</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Map Price Pins:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">₹8.5k</span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">₹14k</span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">₹20k</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Tenant Booking Screen */}
                {currentStep.mockUiType === "tenant_booking" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Instant Bed Reservation</h4>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        ₹1,000 Token
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Reserved Bed</span>
                        <span className="font-bold text-white">Room 204 • Bed A (Private AC)</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">Locked for 48h</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
                      <span>✓ 100% Refundable if visit not confirmed</span>
                      <span className="font-black text-emerald-400">Aadhaar eKYC Done</span>
                    </div>
                  </div>
                )}

                {/* 6. Tenant Pay & Maintenance Screen */}
                {currentStep.mockUiType === "tenant_pay" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Tenant Portal &amp; Services</h4>
                      <span className="text-xs text-emerald-400 font-bold">Active Stay</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Current Rent</span>
                        <span className="text-sm font-black text-emerald-400">Paid ✓ (₹8,500)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">Maintenance Ticket</span>
                        <span className="text-xs font-bold text-amber-400">AC Service (Resolved)</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Legal Agreement:</span>
                      <span className="text-emerald-400 font-bold">11-Month Deed Stamped &amp; Active</span>
                    </div>
                  </div>
                )}

                {/* 7. AI Agreement Screen */}
                {currentStep.mockUiType === "ai_agreement" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#0071e3]" />
                        <h4 className="text-sm font-bold text-white">Rent Agreement AI Studio</h4>
                      </div>
                      <span className="text-xs text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded font-bold border border-blue-800/60">
                        Gujarati • Hindi • English
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                      <div className="text-emerald-400 font-bold">&gt; AI Prompt: &quot;11-month lease deed for flat in Alkapuri Vadodara, rent 20k, deposit 60k, 5% annual escalation&quot;</div>
                      <div className="text-slate-400 text-[11px] pt-1">✓ Drafting Residential Tenancy Deed under Model Tenancy Act 2021...</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Clauses Generated:</span>
                      <span className="text-white font-bold">18 State-Compliant Legal Sections</span>
                    </div>
                  </div>
                )}

                {/* 8. e-Stamp & Aadhaar eSign Screen */}
                {currentStep.mockUiType === "estamp_esign" && (
                  <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Government Non-Judicial e-Stamp</h4>
                      <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                        ₹100 / ₹300 Stamp Duty
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Aadhaar eSign Status</span>
                        <span className="font-bold text-emerald-400">Landlord ✓ &amp; Tenant ✓ (UIDAI Verified)</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Sec 3A IT Act</span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
                      <span>📥 Sealed Agreement PDF with QR Code Delivered to WhatsApp</span>
                      <span className="font-bold text-emerald-400">Complete</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Interactive Soundwave & Tour Timeline */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? "h-3 animate-pulse" : "h-1"}`} />
                    <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? "h-2 animate-pulse delay-75" : "h-1"}`} />
                    <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? "h-3.5 animate-pulse delay-150" : "h-1"}`} />
                    <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? "h-1.5 animate-pulse" : "h-1"}`} />
                  </div>
                  <span className="text-[11px] text-slate-300 font-mono">
                    Step {currentStep.stepNumber} of {activeChapter.steps.length} • {activeChapter.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStepIndex(0);
                      setStepProgress(0);
                    }}
                    className="hover:text-white flex items-center gap-1 transition cursor-pointer"
                    title="Replay Step"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Replay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentStepIndex < activeChapter.steps.length - 1) {
                        setCurrentStepIndex((prev) => prev + 1);
                        setStepProgress(0);
                      } else {
                        setCurrentStepIndex(0);
                        setStepProgress(0);
                      }
                    }}
                    className="hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
