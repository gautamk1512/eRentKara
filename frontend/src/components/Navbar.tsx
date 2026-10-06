"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStorefrontCopy } from "@/lib/storefront-copy";
import { ProductSwitcher } from "./ProductSwitcher";
import { usePathname } from "next/navigation";
import {
  Building2, ShieldCheck, LayoutDashboard,
  LogOut, Sparkles, Menu, X, PlusCircle,
  FileText, Search, ChevronDown, User, Globe,
  HelpCircle, Compass, Zap
} from "lucide-react";
import { useLanguage, Language } from "@/context/LanguageContext";

export default function Navbar() {
  const tr = useStorefrontCopy();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formatsDropdownOpen, setFormatsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { lang: currentLang, setLang: handleLangChange, t } = useLanguage();

  const formatsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const isRental = pathname?.startsWith("/rental") ||
                   pathname?.startsWith("/properties") ||
                   pathname?.startsWith("/dashboard") ||
                   pathname?.startsWith("/tenant");

  const isAgreement = !isRental;

  useEffect(() => {
    const stored = localStorage.getItem("erk_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formatsRef.current && !formatsRef.current.contains(event.target as Node)) {
        setFormatsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("erk_token");
    localStorage.removeItem("erk_user");
    setCurrentUser(null);
    window.location.href = "/";
  };

  const handleOpenTrackModal = () => {
    window.dispatchEvent(new CustomEvent("open-track-modal"));
  };

  const langLabel = currentLang === "gu" ? "ગુજરાતી" : currentLang === "hi" ? "हिन्दी" : "English";
  const langShort = currentLang === "gu" ? "ગુ" : currentLang === "hi" ? "हि" : "EN";

  return (
    <header className="sticky top-0 z-50 font-sans">
      {/* Primary Clean Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-black/[0.07] shadow-[0_1px_4px_rgba(0,0,0,0.03)] relative z-40">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-[58px] items-center gap-3">

            {/* Left: Brand Logo + Mode Capsule Switcher */}
            <div className="flex items-center gap-3.5 shrink-0">
              <Link href={isAgreement ? "/" : "/rental"} className="flex items-center gap-2.5 group shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0f172a] via-[#0071e3] to-[#005bb5] flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold tracking-tight text-[#1d1d1f] leading-none">
                    eRent<span className="text-[#0071e3]">Karar</span>
                  </span>
                  <span className="text-[9px] text-[#86868b] font-medium tracking-wide mt-0.5 hidden sm:block">
                    {isAgreement ? "Legal e-Stamp Portal" : "Rental & PG Cloud OS"}
                  </span>
                </div>
              </Link>

              <div className="hidden sm:block"><ProductSwitcher rental={isRental} /></div>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {isAgreement ? (
                <>
                  {/* AI Agreement Studio Badge Link */}
                  <Link
                    href="/rent-agreement-ai"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#0071e3] bg-[#0071e3]/8 hover:bg-[#0071e3]/15 border border-[#0071e3]/20 transition shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span>AI Agreement</span>
                  </Link>

                  {/* Formats Dropdown */}
                  <div
                    ref={formatsRef}
                    className="relative"
                    onMouseEnter={() => setFormatsDropdownOpen(true)}
                    onMouseLeave={() => setFormatsDropdownOpen(false)}
                  >
                    <button
                      onClick={() => setFormatsDropdownOpen(!formatsDropdownOpen)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition cursor-pointer font-medium"
                    >
                      <span>Formats</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#8e8e93] transition-transform duration-200 ${formatsDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {formatsDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 pt-2 z-50">
                        <div className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] border border-black/[0.07] p-2 space-y-1 backdrop-blur-lg">
                          <Link
                            href="/rent-agreement/create?mode=OWNER&type=residential"
                            className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#f5f5f7] transition"
                            onClick={() => setFormatsDropdownOpen(false)}
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#0071e3] flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-[12px] text-[#1d1d1f]">Residential 11-Month</div>
                              <div className="text-[10.5px] text-[#86868b] leading-tight mt-0.5">Flats, houses & apartments</div>
                            </div>
                          </Link>
                          <Link
                            href="/rent-agreement/create?mode=OWNER&type=commercial"
                            className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#f5f5f7] transition"
                            onClick={() => setFormatsDropdownOpen(false)}
                          >
                            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-[12px] text-[#1d1d1f]">Commercial Lease</div>
                              <div className="text-[10.5px] text-[#86868b] leading-tight mt-0.5">Offices, shops & retail units</div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link href="/rent-agreement/pricing" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">
                    Pricing
                  </Link>

                  <Link href="/partner/register" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">
                    {tr("Become a partner")}
                  </Link>

                  <Link href="/guide?tab=agreement" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">{tr("Manual")}</Link>

                  <Link href="/promotions" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">{tr("Offers")}</Link>

                  {/* Clean Free OS pill */}
                  <Link
                    href="/start-managing-free"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{tr("Free Cloud OS")}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/properties" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">{tr("Explore Stays")}</Link>

                  <Link href="/list-your-property" className="px-2.5 py-1.5 rounded-full text-[13px] font-semibold text-emerald-700 hover:bg-emerald-50 transition">{tr("+ List Free")}</Link>

                  <Link href="/guide?tab=rental" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">{tr("Manual")}</Link>

                  <Link href="/promotions" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">{tr("Offers")}</Link>

                  <Link href="/tools" className="px-2.5 py-1.5 rounded-full text-[13px] text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] transition font-medium">{tr("Tools")}</Link>

                  <Link
                    href="/start-managing-free"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/70 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{tr("Free Cloud OS")}</span>
                  </Link>
                </>
              )}
            </div>

            {/* Right: Actions (Language + Auth Buttons) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Language Selector Dropdown */}
              <div
                ref={langRef}
                className="relative"
                onMouseEnter={() => setLangDropdownOpen(true)}
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-semibold text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] border border-black/[0.06] transition cursor-pointer"
                  title="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-[#6e6e73]" />
                  <span>{langShort}</span>
                  <ChevronDown className="w-3 h-3 text-[#8e8e93]" />
                </button>
                {langDropdownOpen && (
                  <div className="absolute top-full right-0 w-32 pt-2 z-50">
                    <div className="bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-black/[0.07] p-1.5 space-y-0.5">
                      {[
                        { code: "gu" as Language, label: "ગુજરાતી" },
                        { code: "hi" as Language, label: "हिन्दी" },
                        { code: "en" as Language, label: "English" },
                      ].map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { handleLangChange(l.code); setLangDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] transition cursor-pointer flex items-center justify-between ${
                            currentLang === l.code
                              ? "bg-[#0071e3]/10 text-[#0071e3] font-semibold"
                              : "text-[#1d1d1f] hover:bg-[#f5f5f7] font-medium"
                          }`}
                        >
                          <span>{l.label}</span>
                          {currentLang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Auth Actions */}
              <div className="hidden lg:flex items-center gap-2">
                {currentUser ? (
                  <>
                    {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "ADMIN") && (
                      <Link
                        href="/admin/properties"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <Link
                      href={
                        isAgreement
                          ? currentUser.role === "TENANT"
                            ? "/tenant/dashboard"
                            : currentUser.role === "SHOP_ADMIN" || currentUser.role === "SHOP_OPERATOR"
                            ? "/shop/dashboard"
                            : "/owner/dashboard"
                          : currentUser.role === "TENANT"
                          ? "/tenant"
                          : "/dashboard"
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] border border-black/[0.06] transition"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#0071e3]" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-1.5 text-[#86868b] hover:text-rose-600 rounded-full hover:bg-[#f5f5f7] transition cursor-pointer"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : isAgreement ? (
                  <>
                    <button
                      type="button"
                      onClick={handleOpenTrackModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] border border-black/[0.07] transition cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-[#86868b]" />
                      <span>Track</span>
                    </button>
                    <Link
                      href="/login?portal=agreement"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] border border-black/[0.07] transition"
                    >
                      <User className="w-3.5 h-3.5 text-[#86868b]" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/rent-agreement/create"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-[#1d1d1f] text-white hover:bg-black transition shadow-sm hover:scale-[1.02]"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create Agreement</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login?role=TENANT"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-[#424245] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] border border-black/[0.07] transition"
                    >
                      <span>{tr("Tenant Login")}</span>
                    </Link>
                    <Link
                      href="/login?role=OWNER"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-[#1d1d1f] text-white hover:bg-black transition shadow-sm hover:scale-[1.02]"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{tr("Owner Portal")}</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Track / Action + Hamburger */}
              <div className="flex lg:hidden items-center gap-1.5">
                {isAgreement ? (
                  <button
                    onClick={handleOpenTrackModal}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-medium text-[#424245] bg-[#f5f5f7] border border-black/[0.06] cursor-pointer"
                  >
                    <Search className="w-3 h-3 text-[#0071e3]" />
                    <span>Track</span>
                  </button>
                ) : (
                  <Link
                    href="/login?role=OWNER"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-[#1d1d1f] text-white"
                  >{tr("Owner")}</Link>
                )}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] rounded-xl hover:bg-[#f5f5f7] transition"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 text-[#1d1d1f]" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/[0.06] bg-white px-4 pt-3 pb-5 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Language Row */}
            <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Language</span>
              <div className="flex items-center bg-[#f5f5f7] rounded-full p-0.5 border border-black/[0.06]">
                {[
                  { code: "gu" as Language, label: "ગુજરાતી" },
                  { code: "hi" as Language, label: "हिन्दी" },
                  { code: "en" as Language, label: "English" },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLangChange(l.code)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                      currentLang === l.code ? "bg-[#0071e3] text-white shadow-sm" : "text-[#1d1d1f]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pb-3"><ProductSwitcher rental={isRental} onNavigate={() => setMobileMenuOpen(false)} /></div>

            {/* Mobile Links */}
            {isAgreement ? (
              <div className="space-y-1">
                <Link
                  href="/start-managing-free"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-[12px] font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Start Managing Free (Cloud OS)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">FREE</span>
                </Link>
                <Link
                  href="/rent-agreement-ai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-[12px] font-bold text-white bg-[#0071e3] shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Agreement Studio</span>
                  </div>
                  <span className="text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full">LIVE</span>
                </Link>
                <Link href="/rent-agreement/create?mode=OWNER&type=residential" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0071e3]" />
                    <span>Residential Agreement</span>
                  </div>
                  <span className="text-[10px] bg-[#0071e3]/10 text-[#0071e3] font-semibold px-2 py-0.5 rounded-full">₹399</span>
                </Link>
                <Link href="/rent-agreement/create?mode=OWNER&type=commercial" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0071e3]" />
                    <span>Commercial Lease</span>
                  </div>
                  <span className="text-[10px] bg-[#0071e3]/10 text-[#0071e3] font-semibold px-2 py-0.5 rounded-full">₹799</span>
                </Link>
                <Link href="/rent-agreement/pricing" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  Pricing & Stamp
                </Link>
                <Link href="/promotions" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  Offers & Deals
                </Link>
                <Link href="/guide?tab=agreement" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-semibold text-[#0071e3] bg-[#0071e3]/5 hover:bg-[#0071e3]/10">
                  Agreement Manual
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/start-managing-free"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-[12px] font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Start Managing Free (Cloud OS)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">FREE</span>
                </Link>
                <Link href="/properties" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  Explore Stays & PGs
                </Link>
                <Link href="/list-your-property" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                  + List Property (Free)
                </Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  SaaS Pricing
                </Link>
                <Link href="/promotions" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  Offers & Deals
                </Link>
                <Link href="/guide?tab=rental" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                  Rental OS Manual
                </Link>
                <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className="block p-2.5 rounded-xl text-[12px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                  Tools & Calculators
                </Link>
              </div>
            )}

            {/* Mobile Auth */}
            <div className="pt-2.5 border-t border-black/[0.06] space-y-2">
              {isAgreement ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login?portal=agreement" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center rounded-full text-[12px] font-semibold text-[#1d1d1f] bg-[#f5f5f7] border border-black/[0.06]">
                    Sign In
                  </Link>
                  <Link href="/rent-agreement/create" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center rounded-full text-[12px] font-semibold text-white bg-[#1d1d1f]">
                    Create Agreement
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login?role=TENANT" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center rounded-full text-[12px] font-semibold text-[#1d1d1f] bg-[#f5f5f7] border border-black/[0.06]">{tr("Tenant Login")}</Link>
                  <Link href="/login?role=OWNER" onClick={() => setMobileMenuOpen(false)} className="py-2 text-center rounded-full text-[12px] font-semibold text-white bg-[#1d1d1f]">{tr("Owner Portal")}</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="sm:hidden px-4 pb-3"><ProductSwitcher rental={isRental} /></div>
    </header>
  );
}
