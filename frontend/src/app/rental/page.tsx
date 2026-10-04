"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, Home, Search, ShieldCheck, ArrowRight,
  CheckCircle2, Users, FileText, Lock, Sparkles,
  Bed, Store, Zap, HelpCircle, Star, Play,
  ChevronDown, ChevronUp, DollarSign, Wrench, BarChart3,
  Check, Phone, MapPin, Laptop, CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DemoModal from "@/components/DemoModal";
import { LiquidGlassCard, LiquidGlassButton, LiquidOrbs, RadixBadge } from "@/components/LiquidGlass";
import MotionVideoTour from "@/components/MotionVideoTour";

export default function RentalLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState("PROPERTIES");
  const [selectedCity, setSelectedCity] = useState("Vadodara");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedBudget, setSelectedBudget] = useState("ANY");

  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    { id: "PROPERTIES", label: "Properties", icon: Home },
    { id: "PG_HOSTEL", label: "PG/Hostel", icon: Building2 },
    { id: "CO_LIVING", label: "Co-Living", icon: Users },
    { id: "FLATS_ROOMS", label: "Flats & Rooms", icon: Bed },
  ];

  const propertyTypes = [
    {
      title: "Residential",
      subtitle: "Houses, Apartments, Flats",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80",
      link: "/properties?type=FLAT",
      accent: "#1e40af",
      badge: "1, 2, 3 BHK",
      icon: Home,
    },
    {
      title: "Commercial",
      subtitle: "Offices, Shops, Showrooms",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
      link: "/properties?type=COMMERCIAL",
      accent: "#ab6400",
      badge: "Retail & Work",
      icon: Store,
    },
    {
      title: "PG / Hostel",
      subtitle: "Boys, Girls, Mixed",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=500&q=80",
      link: "/properties?type=PG",
      accent: "#167961",
      badge: "Food & WiFi",
      icon: Building2,
    },
    {
      title: "Co-Living",
      subtitle: "Shared Living Spaces",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80",
      link: "/properties?type=CO_LIVING",
      accent: "#067a6d",
      badge: "Fully Furnished",
      icon: Users,
    },
    {
      title: "Rooms / Beds",
      subtitle: "Single & Multiple Beds",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=500&q=80",
      link: "/properties?type=ROOM",
      accent: "#4848bb",
      badge: "Budget Friendly",
      icon: Bed,
    },
  ];

  const steps = [
    {
      num: 1,
      title: "Register",
      desc: "Create your account as owner or tenant in under 60 seconds.",
    },
    {
      num: 2,
      title: "Add Property",
      desc: "Add buildings, floors, rooms and configure rent & deposits.",
    },
    {
      num: 3,
      title: "KYC & Agreement",
      desc: "Verify identity with Aadhaar KYC and eSign digital lease deed.",
    },
    {
      num: 4,
      title: "Pay & Move In",
      desc: "Pay deposit/rent via UPI and receive instant digital receipt.",
    },
    {
      num: 5,
      title: "Ongoing Support",
      desc: "Manage tickets, maintenance, mess menu & auto accounting.",
    },
  ];

  const faqs = [
    {
      q: "How does eRentKarar Rental SaaS help property owners?",
      a: "eRentKarar automates the entire rental lifecycle for landlords, PG operators, and property managers. It handles automated UPI rent collection with WhatsApp payment links, sub-meter electricity computation, tenant Aadhaar KYC verification, digital lease deeds, and daily mess management from a single cloud dashboard.",
    },
    {
      q: "What documents are required for tenant verification?",
      a: "Tenants only need their Aadhaar card number (for OTP verification) and basic employment or college ID proof. Everything is verified instantly online.",
    },
    {
      q: "How is rent collected and settled?",
      a: "Tenants receive automated WhatsApp reminders with custom UPI payment links (PhonePe, Google Pay, Paytm). Once paid, funds settle directly to the owner's bank account with zero platform deduction, and GST-compliant rent receipts are generated automatically.",
    },
    {
      q: "Can I manage multiple properties and buildings?",
      a: "Yes! eRentKarar is built for multi-property scale. You can manage multiple residential flats, PG hostels across cities, and commercial complexes with custom manager and staff role permissions.",
    },
    {
      q: "Is eSign legally valid for rental agreements?",
      a: "Yes. eRentKarar agreements are backed by state government non-judicial e-stamp papers and Aadhaar OTP eSign, fully enforceable under the IT Act 2000 and Model Tenancy Act.",
    },
    {
      q: "Can I try the platform before subscribing?",
      a: "Absolutely! You can sign up for a free 14-day trial or click 'Watch Demo' to launch an interactive live sandbox walkthrough.",
    },
    {
      q: "What are the brokerage charges?",
      a: "Zero! eRentKarar is a direct owner-to-tenant SaaS platform. There is 0% brokerage on listings, bookings, and agreement drafting.",
    },
    {
      q: "Is there a mobile app for tenants and managers?",
      a: "Yes. eRentKarar provides responsive web and mobile PWA applications for both Android and iOS devices.",
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (selectedCity) queryParams.set("city", selectedCity);
    if (selectedType !== "ALL") queryParams.set("type", selectedType);
    window.location.href = `/properties?${queryParams.toString()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative overflow-hidden">
      
      {/* Magic UI Grid & Glow Background */}
      <div className="absolute inset-0 magic-grid magic-radial-fade opacity-45 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-teal-500/12 via-emerald-500/8 to-transparent blur-3xl pointer-events-none" />

      {/* =========================================================================
          1. HERO SECTION: Liquid Glass & Radix Palette
          ========================================================================= */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-teal-50/40 via-white/80 to-slate-50/90 backdrop-blur-xs">
        {/* Floating Liquid Orbs Background */}
        <LiquidOrbs />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6"
            >
              
              {/* Top Radix Badge & Tour Link */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <RadixBadge color="teal" size="md" pulse>
                  India&apos;s #1 Rental Platform
                </RadixBadge>
                <a
                  href="#video-tour"
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 text-xs font-bold border border-emerald-500/30 transition-all shadow-xs"
                >
                  <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  <span>Watch Video Tour & Demo</span>
                </a>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                India Rental Property Management + Marketplace + PG/Hostel/Co-Living SaaS
              </h1>

              {/* Tagline */}
              <p className="text-lg sm:text-xl font-semibold text-[#0071e3]">
                Find, Book, Manage, All in One Place.
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed max-w-xl">
                eRentKarar is India&apos;s complete rental ecosystem for property owners, tenants, and rental businesses. Manage properties, tenants, rent, agreements, and more — all digitally.
              </p>

              {/* Category Pills: Properties, PG/Hostel, Co-Living, Flats & Rooms */}
              <div className="flex flex-wrap gap-2 pt-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-[#0071e3] text-white shadow-xs"
                          : "bg-white text-[#1d1d1f] border border-black/[0.08] hover:border-black/[0.16]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Search Bar matching Liquid Glass */}
              <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onSubmit={handleSearchSubmit}
                className="p-2 sm:p-2.5 bg-white/95 rounded-2xl border border-black/[0.08] shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-2 max-w-2xl"
              >
                <div className="px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-black/[0.06]">
                  <label className="block text-[9px] font-bold text-[#86868b] uppercase">Select City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs font-semibold text-[#1d1d1f] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="Vadodara">Vadodara (Gujarat)</option>
                    <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
                    <option value="Surat">Surat (Gujarat)</option>
                    <option value="Gandhinagar">Gandhinagar (Gujarat)</option>
                    <option value="Rajkot">Rajkot (Gujarat)</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div className="px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-black/[0.06]">
                  <label className="block text-[9px] font-bold text-[#86868b] uppercase">Property Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full text-xs font-semibold text-[#1d1d1f] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Types</option>
                    <option value="PG">PG / Hostel</option>
                    <option value="CO_LIVING">Co-Living</option>
                    <option value="FLAT">1 / 2 / 3 BHK Flat</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>

                <div className="px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-black/[0.06]">
                  <label className="block text-[9px] font-bold text-[#86868b] uppercase">Budget</label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full text-xs font-semibold text-[#1d1d1f] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="ANY">Any Budget</option>
                    <option value="UNDER_10K">Under ₹10,000</option>
                    <option value="10K_25K">₹10,000 - ₹25,000</option>
                    <option value="25K_50K">₹25,000 - ₹50,000</option>
                    <option value="ABOVE_50K">₹50,000+</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    className="apple-btn-primary w-full py-2.5 px-4 text-xs font-semibold rounded-full flex items-center justify-center space-x-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>
                </div>
              </motion.form>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <motion.div whileHover={{ y: -2 }}>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block">10K+</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Properties Listed</span>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block">50K+</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Happy Tenants</span>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block">5K+</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Verified Owners</span>
                </motion.div>
                <motion.div whileHover={{ y: -2 }}>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 block">100%</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Secure & Trusted</span>
                </motion.div>
              </div>

            </motion.div>

            {/* Right Visual Column: Mobile Phone Mockup + Building with Floating Motion */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-5 relative flex justify-center items-center"
            >
              
              {/* Background Building Image */}
              <div className="absolute right-0 top-0 w-full h-[430px] rounded-3xl overflow-hidden shadow-xl z-0 hidden sm:block">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80"
                  alt="Modern Apartment complex"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/30 to-transparent" />
              </div>

              {/* Floating Mobile App Mockup */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-64 sm:w-72 bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-700/80 backdrop-blur-sm"
              >
                <div className="bg-white rounded-[28px] overflow-hidden p-4 space-y-3">
                  
                  {/* Phone Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-emerald-700 tracking-tight">eRentKarar</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Find Your Perfect Stay</span>
                    <span className="text-xs font-black text-slate-800">Koramangala, Bengaluru</span>
                  </div>

                  {/* Sample Property Mini Card 1 */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <div className="h-20 bg-slate-200 relative">
                      <img
                        src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80"
                        alt="Sunrise PG"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-black">
                        ₹9,000/mo
                      </span>
                    </div>
                    <div className="p-2 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-800 block truncate">Sunrise PG - Boys</span>
                      <span className="text-[8px] text-slate-500 block">3-Sharing • WiFi • Food • AC</span>
                    </div>
                  </div>

                  {/* Sample Property Mini Card 2 */}
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <div className="h-20 bg-slate-200 relative">
                      <img
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80"
                        alt="Skyline Co-Living"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-teal-600 text-white text-[8px] font-black">
                        ₹16,500/mo
                      </span>
                    </div>
                    <div className="p-2 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-800 block truncate">Skyline Co-Living Suites</span>
                      <span className="text-[8px] text-slate-500 block">Private Studio • Gym • Housekeeping</span>
                    </div>
                  </div>

                  <Link
                    href="/properties"
                    className="block text-center py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-[9px] font-bold shadow-sm"
                  >
                    View 240+ Stays Nearby
                  </Link>

                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. 5 CORE SERVICE PILLARS
          ========================================================================= */}
      <section className="bg-white/90 backdrop-blur-md border-y border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            
            <motion.div whileHover={{ y: -4 }} className="text-center sm:text-left space-y-2 p-3 rounded-2xl bg-white/60 border border-emerald-100/80 shadow-xs border-t-2 border-t-[#29a383]">
              <div className="w-10 h-10 rounded-xl bg-[#e6f7ef] text-[#167961] border border-[#a0dcc1]/60 flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
                <Home className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-slate-900">Rental Management</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Complete property and tenant management in one place.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="text-center sm:text-left space-y-2 p-3 rounded-2xl bg-white/60 border border-teal-100/80 shadow-xs border-t-2 border-t-[#12a594]">
              <div className="w-10 h-10 rounded-xl bg-[#e0f8f5] text-[#067a6d] border border-[#8ee3d8]/60 flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-slate-900">Online Rent Collection</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Digital payments, automated reminders, easy tracking.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="text-center sm:text-left space-y-2 p-3 rounded-2xl bg-white/60 border border-emerald-100/80 shadow-xs border-t-2 border-t-[#29a383]">
              <div className="w-10 h-10 rounded-xl bg-[#e6f7ef] text-[#167961] border border-[#a0dcc1]/60 flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-slate-900">KYC & eSign</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Verify tenants and sign agreements online.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="text-center sm:text-left space-y-2 p-3 rounded-2xl bg-white/60 border border-amber-100/80 shadow-xs border-t-2 border-t-[#ffba18]">
              <div className="w-10 h-10 rounded-xl bg-[#fff7c2] text-[#ab6400] border border-[#f7d34a]/60 flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-slate-900">Maintenance & Complaints</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Handle issues, track progress, keep tenants happy.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="text-center sm:text-left space-y-2 p-3 rounded-2xl bg-white/60 border border-indigo-100/80 shadow-xs border-t-2 border-t-[#5b5bd6]">
              <div className="w-10 h-10 rounded-xl bg-[#f0f0fb] text-[#4848bb] border border-[#c1c1f0]/60 flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-slate-900">Reports & Accounting</h4>
              <p className="text-[11px] text-slate-600 leading-snug">
                Get insights with detailed reports and analytics.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2.5 MOTION VIDEO TOUR & PRODUCT DEMO
          ========================================================================= */}
      <div id="video-tour" className="relative z-10 py-6 bg-slate-900/5">
        <MotionVideoTour />
      </div>

      {/* =========================================================================
          3. EXPLORE PROPERTY TYPES (5 Cards)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Property Types
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From single rooms to full buildings — we manage all types of rental properties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {propertyTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <div
                    style={{ borderTopColor: type.accent }}
                    className="liquid-glass rounded-3xl p-0 overflow-hidden h-full flex flex-col justify-between border border-slate-200/90 border-t-4 shadow-md transition-all group"
                  >
                    <Link
                      href={type.link}
                      className="flex flex-col justify-between h-full"
                    >
                      <div className="h-36 overflow-hidden relative bg-slate-900">
                        <img
                          src={type.image}
                          alt={type.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // If image fails to load, gracefully fallback to stylish gradient
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                        
                        {/* Badge Tag */}
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-[9px] shadow-xs">
                          {type.badge}
                        </span>

                        {/* Bottom title on image */}
                        <div className="absolute bottom-2.5 left-3 flex items-center space-x-1.5 text-white">
                          <Icon className="w-4 h-4 text-emerald-300 drop-shadow-xs" />
                          <span className="font-black text-xs drop-shadow-xs">
                            {type.title}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-slate-900">{type.title}</h3>
                          <span className="text-[10px] font-bold text-slate-400">Verified</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">{type.subtitle}</p>
                        <div className="pt-2 flex items-center text-xs font-bold text-teal-600 group-hover:text-emerald-700">
                          <span>Explore Properties</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS: 5 Steps
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Get started in minutes and manage everything from one dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((st) => (
              <motion.div
                key={st.num}
                whileHover={{ y: -4 }}
                className="space-y-3 text-center sm:text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-600/30 mx-auto sm:mx-0">
                  {st.num}
                </div>
                <h3 className="text-sm font-black text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. DUAL PERSONA: For Property Owners & For Tenants
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* For Property Owners */}
            <motion.div
              whileHover={{ y: -5 }}
              className="liquid-glass rounded-3xl p-8 border border-slate-200/90 border-t-4 border-t-[#29a383] shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#e6f7ef] text-[#167961] border border-[#a0dcc1] text-[10px] font-black uppercase tracking-wider">
                  For Property Owners
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Manage Your Properties with Ease
                </h3>

                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-1">
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#167961] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>List & manage multiple properties & rooms</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#167961] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Track rent payments, invoices & expenses</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#167961] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Manage tenants & staff with role permissions</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#167961] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Handle maintenance & complaints smoothly</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e6f7ef] text-[#167961] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Get detailed reports & profit accounting</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/login?role=OWNER"
                  className="radix-btn-jade liquid-reflection inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs transition"
                >
                  <span>Owner Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* For Tenants */}
            <motion.div
              whileHover={{ y: -5 }}
              className="liquid-glass rounded-3xl p-8 border border-slate-200/90 border-t-4 border-t-[#12a594] shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#e0f8f5] text-[#067a6d] border border-[#8ee3d8] text-[10px] font-black uppercase tracking-wider">
                  For Tenants
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Find Your Perfect Stay
                </h3>

                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-1">
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e0f8f5] text-[#067a6d] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Search verified properties & listings</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e0f8f5] text-[#067a6d] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Book & pay online with 0% brokerage</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e0f8f5] text-[#067a6d] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Submit Aadhaar KYC and eSign agreement</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e0f8f5] text-[#067a6d] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Download receipts & track payments</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#e0f8f5] text-[#067a6d] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Raise complaints & get quick support</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/login?role=TENANT"
                  className="radix-btn-teal liquid-reflection inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs transition"
                >
                  <span>Tenant Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. KIOSK LOGIN SECTIONS
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Kiosk 1: For Shops */}
            <motion.div whileHover={{ y: -4 }} className="liquid-glass rounded-3xl p-7 sm:p-8 border border-slate-200 border-t-4 border-t-[#ffba18] space-y-4 shadow-md">
              <span className="inline-block px-3 py-1 rounded-full bg-[#fff7c2] text-[#ab6400] border border-[#f7d34a] text-[10px] font-black uppercase tracking-wider">
                Retail & Documentation
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Kiosk Login for Shops
              </h3>
              <p className="text-xs text-slate-500">
                Manage Rentals & Agreements at Your Shop
              </p>

              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Quick tenant registration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Agreement generation & e-stamp</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>eSign & document upload</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Print receipts & invoices</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/login?role=KIOSK"
                  className="radix-btn-amber liquid-reflection inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition"
                >
                  <span>Kiosk Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Kiosk 2: For Minimum Brokerage */}
            <motion.div whileHover={{ y: -4 }} className="liquid-glass rounded-3xl p-7 sm:p-8 border border-slate-200 border-t-4 border-t-[#12a594] space-y-4 shadow-md">
              <span className="inline-block px-3 py-1 rounded-full bg-[#e0f8f5] text-[#067a6d] border border-[#8ee3d8] text-[10px] font-black uppercase tracking-wider">
                Partner Network
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Kiosk Login for Minimum Brokerage
              </h3>
              <p className="text-xs text-slate-500">
                Low Brokerage • High Convenience
              </p>

              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Manage properties & tenants</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Digital agreement & eSign</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Track commission earnings</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Easy dashboard access</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/login?role=KIOSK"
                  className="radix-btn-teal liquid-reflection inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs transition"
                >
                  <span>Kiosk Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          7. SECURE, COMPLIANT & TRUSTED
          ========================================================================= */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-black text-slate-900">Secure, Compliant & Trusted</h3>
            <p className="text-xs text-slate-500">Your data, your privacy. We follow industry best practices to keep your information safe.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
              <span className="text-xs font-bold text-slate-900 block">KYC Verification</span>
              <span className="text-[10px] text-slate-500">Verified identity for all parties</span>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
              <Lock className="w-6 h-6 text-teal-600 mx-auto" />
              <span className="text-xs font-bold text-slate-900 block">Data Encryption</span>
              <span className="text-[10px] text-slate-500">Bank-grade security standards</span>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
              <CreditCard className="w-6 h-6 text-emerald-600 mx-auto" />
              <span className="text-xs font-bold text-slate-900 block">Secure Payments</span>
              <span className="text-[10px] text-slate-500">Encrypted UPI & card processing</span>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-1 shadow-xs">
              <CheckCircle2 className="w-6 h-6 text-amber-500 mx-auto" />
              <span className="text-xs font-bold text-slate-900 block">Legal Compliance</span>
              <span className="text-[10px] text-slate-500">As per Indian rental laws</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. READY TO GET STARTED BANNER
          ========================================================================= */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-emerald-900/40"
          >
            <div className="relative z-10 max-w-2xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ready to get started?
              </h2>
              <p className="text-sm text-emerald-200/90 leading-relaxed">
                Join thousands of property owners and tenants who trust eRentKarar across India.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    className="radix-btn-jade liquid-reflection px-6 py-3 rounded-xl font-bold text-xs transition block"
                  >
                    Get Started Free →
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="radix-btn-glass px-6 py-3 rounded-xl font-bold text-xs transition flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Watch Demo</span>
                </motion.button>
              </div>

              <div className="flex items-center space-x-8 pt-4 border-t border-white/10 text-xs font-mono">
                <div><span className="font-bold text-lg block">10K+</span> Properties</div>
                <div><span className="font-bold text-lg block">50K+</span> Tenants</div>
                <div><span className="font-bold text-lg block">5K+</span> Owners</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          9. WHAT OUR USERS SAY (TESTIMONIALS)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What Our Users Say</h2>
            <p className="text-xs text-slate-500 mt-1">Real people. Real experiences. Trusted by thousands across India.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 italic">
                &ldquo;eRentKarar made my PG search so easy. The process was fast and support team is amazing!&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  RS
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Rohit Sharma</span>
                  <span className="text-[10px] text-slate-500">Tenant • Bengaluru</span>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 italic">
                &ldquo;Managing my 42-bed PG has never been easier. Automatic UPI rent collection saves me 15 hours every month.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  SP
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Sneha Patel</span>
                  <span className="text-[10px] text-slate-500">PG Owner • Pune</span>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 italic">
                &ldquo;The kiosk system is perfect for my documentation shop. I can draft agreements and verify KYC quickly for walk-ins.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                  AM
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Arjun Mehta</span>
                  <span className="text-[10px] text-slate-500">Kiosk Partner • Delhi NCR</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          10. FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 space-y-2">
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Find answers to common questions about our rental ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-slate-900 hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        defaultRole="PG / Hostel Owner"
      />

    </div>
  );
}
