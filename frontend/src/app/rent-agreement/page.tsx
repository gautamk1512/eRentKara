"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  UserCheck,
  Building2,
  ShieldCheck,
  QrCode,
  HelpCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  Search,
  Check,
  Sun,
  Moon,
  Languages,
  Stamp,
} from "lucide-react";
import { api } from "@/lib/api";

export default function RentAgreementLandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"EN" | "GU">("EN");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Stamp Duty Calculator state
  const [calcRent, setCalcRent] = useState<number>(15000);
  const [calcDeposit, setCalcDeposit] = useState<number>(30000);
  const [calcDuration, setCalcDuration] = useState<number>(11);
  const [calcType, setCalcType] = useState<string>("RESIDENTIAL");
  const [dutyResult, setDutyResult] = useState<any>(null);
  const [calcLoading, setCalcLoading] = useState<boolean>(false);

  // Quick Verification & Invite Token inputs
  const [verifyToken, setVerifyToken] = useState("");
  const [inviteToken, setInviteToken] = useState("");

  // Calculate duty on param changes
  useEffect(() => {
    let isMounted = true;
    setCalcLoading(true);
    api.calculateDuty({
      rent: calcRent,
      deposit: calcDeposit,
      duration: calcDuration,
      state: "GJ",
      agreement_type: calcType,
    })
      .then((res: any) => {
        if (isMounted && res.data) {
          setDutyResult(res.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          const stamp = calcDuration < 12 ? 300 : Math.max(300, (calcRent * 12 + calcDeposit * 0.1) * 0.0025);
          const reg = calcDuration < 12 ? 0 : 1000;
          setDutyResult({
            government_stamp_duty: stamp,
            registration_fee: reg,
            registration_required: calcDuration >= 12,
            provider_charges: 100,
            platform_charges: 299,
            total_payable: stamp + reg + 100 + 299,
            source_reference: "Gujarat Stamp Act 1958 Schedule I Article 30",
          });
        }
      })
      .finally(() => {
        if (isMounted) setCalcLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [calcRent, calcDeposit, calcDuration, calcType]);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyToken.trim()) {
      router.push(`/rent-agreement/verify/${verifyToken.trim()}`);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteToken.trim()) {
      router.push(`/rent-agreement/invite/${inviteToken.trim()}`);
    }
  };

  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isLight ? "bg-[#f5f5f7] text-[#1d1d1f]" : "bg-slate-950 text-slate-100"
      }`}
    >
      {/* Top Gujarat Legal Notice Banner */}
      <div
        className={`border-b px-4 py-2.5 text-center text-xs flex flex-wrap items-center justify-center gap-2 ${
          isLight ? "bg-white border-black/[0.06] text-[#6e6e73]" : "bg-slate-900 border-slate-800 text-slate-400"
        }`}
      >
        <div className="flex items-center gap-1.5 font-semibold text-[#0071e3]">
          <ShieldCheck className="h-4 w-4" />
          <span>
            {lang === "EN"
              ? "Official Gujarat e-Stamping & Registered Tenancy Framework"
              : "ગુજરાત ઇ-સ્ટેમ્પિંગ અને રજિસ્ટર્ડ ભાડા કરાર પ્લેટફોર્મ"}
          </span>
        </div>
        <span className="hidden sm:inline text-black/20 dark:text-white/20">|</span>
        <span className="hidden sm:inline">
          {lang === "EN"
            ? "Compliant with Gujarat Stamp Act 1958 & Model Tenancy Act"
            : "ગુજરાત સ્ટેમ્પ એક્ટ ૧૯૫૮ અને મોડેલ ટેનન્સી એક્ટ મુજબ માન્ય"}
        </span>

        <div className="flex items-center gap-2 ml-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition ${
              isLight
                ? "border-black/[0.08] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.05]"
                : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {isLight ? <Moon className="h-3 w-3 text-[#0071e3]" /> : <Sun className="h-3 w-3 text-amber-400" />}
            <span>{isLight ? "Dark" : "Light"}</span>
          </button>

          {/* Lang Toggle */}
          <button
            onClick={() => setLang(lang === "EN" ? "GU" : "EN")}
            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border transition ${
              isLight
                ? "border-[#0071e3]/30 bg-[#0071e3]/10 text-[#0071e3]"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
            }`}
          >
            <Languages className="h-3 w-3" />
            <span>{lang === "EN" ? "ગુજરાતી" : "English"}</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold border backdrop-blur mb-3 ${
              isLight
                ? "bg-white border-black/[0.08] text-[#0071e3] shadow-xs"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{lang === "EN" ? "100% Digital • Aadhaar eSign • Same Day eStamp" : "૧૦૦% ડિજિટલ • આધાર eSign • સરકારી ઈ-સ્ટેમ્પ"}</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {lang === "EN" ? (
              <>
                Gujarat Legal <span className="text-[#0071e3]">E-Rent Agreement</span> & eStamp
              </>
            ) : (
              <>
                ગુજરાત ડિજિટલ <span className="text-[#0071e3]">ભાડા કરાર (E-Rent Agreement)</span>
              </>
            )}
          </h1>

          <p className={`mx-auto mt-4 max-w-2xl text-sm sm:text-base ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
            {lang === "EN"
              ? "Draft, verify identity, e-Stamp, and digitally sign government-valid rental deeds from anywhere in Ahmedabad, Surat, Vadodara, Rajkot and across Gujarat."
              : "અમદાવાદ, સુરત, વડોદરા, રાજકોટ અને સમગ્ર ગુજરાત માટે કાયદેસર સરકારી ઈ-સ્ટેમ્પ અને આધાર ડિજિટલ સહી સાથે માન્ય ભાડા કરાર."}
          </p>
        </div>

        {/* 4 PRIMARY CTA CARDS */}
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Owner Self Service */}
          <Link
            href="/rent-agreement/create?mode=OWNER"
            className={`group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm ${
              isLight
                ? "bg-white border-black/[0.08] hover:border-[#0071e3] hover:shadow-md"
                : "bg-slate-900/60 border-slate-800 hover:border-cyan-500 hover:bg-slate-900"
            }`}
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0071e3] text-white shadow-xs">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-[#0071e3] transition">
                {lang === "EN" ? "I'm an Owner" : "હું મકાનમાલિક છું"}
              </h3>
              <p className={`mt-1.5 text-xs leading-relaxed ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Create agreement, set rent terms, and invite your tenant to review & sign."
                  : "નવો ભાડા કરાર બનાવો, શરતો નક્કી કરો અને ભાડૂતને સહી માટે આમંત્રિત કરો."}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-semibold text-[#0071e3]">
              <span>{lang === "EN" ? "Start as Owner" : "શરૂ કરો"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Tenant Self Service */}
          <Link
            href="/rent-agreement/create?mode=TENANT"
            className={`group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm ${
              isLight
                ? "bg-white border-black/[0.08] hover:border-emerald-600 hover:shadow-md"
                : "bg-slate-900/60 border-slate-800 hover:border-emerald-500 hover:bg-slate-900"
            }`}
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-emerald-600 transition">
                {lang === "EN" ? "I'm a Tenant" : "હું ભાડૂત છું"}
              </h3>
              <p className={`mt-1.5 text-xs leading-relaxed ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Draft lease agreement for your rental stay and invite your landlord to approve."
                  : "તમારા ભાડાના મકાન માટે કરાર ડ્રાફ્ટ કરો અને મકાનમાલિકને મંજૂરી માટે મોકલો."}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>{lang === "EN" ? "Start as Tenant" : "શરૂ કરો"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: Assisted / Shop Service */}
          <Link
            href="/rent-agreement/create?mode=SHOP"
            className={`group relative flex flex-col justify-between rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm ${
              isLight
                ? "bg-white border-black/[0.08] hover:border-amber-600 hover:shadow-md"
                : "bg-slate-900/60 border-slate-800 hover:border-amber-500 hover:bg-slate-900"
            }`}
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-xs">
                <PhoneCall className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold group-hover:text-amber-600 transition">
                {lang === "EN" ? "Shop Assisted" : "સેવા કેન્દ્ર સહાય"}
              </h3>
              <p className={`mt-1.5 text-xs leading-relaxed ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Assisted service by authorized Seva Kendra kiosk operators across Gujarat."
                  : "ઓનલાઈન ફોર્મ ભરવામાં મુશ્કેલી? અધિકૃત સેવા કેન્દ્ર દ્વારા સહાયિત સેવા મેળવો."}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>{lang === "EN" ? "Assisted Kiosk Mode" : "સહાયિત સેવા"}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 4: Invitation Review & Sign */}
          <div
            className={`flex flex-col justify-between rounded-3xl border p-6 shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold">
                {lang === "EN" ? "Received Invite?" : "આમંત્રણ મળ્યું છે?"}
              </h3>
              <p className={`mt-1.5 text-xs leading-relaxed ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Enter the token received on SMS or email to review, verify & eSign."
                  : "તમારા ફોન અથવા ઈમેલ પર આવેલ આમંત્રણ કોડ દાખલ કરો."}
              </p>
            </div>
            <form onSubmit={handleInviteSubmit} className="mt-6">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Invite token..."
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-indigo-600 ${
                    isLight
                      ? "bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f]"
                      : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-xs"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* STATUTORY STAMP DUTY CALCULATOR SECTION */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className={`rounded-3xl border p-6 sm:p-8 shadow-sm ${
            isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/70 border-slate-800"
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#0071e3] text-xs font-semibold uppercase tracking-wider">
                <Calculator className="h-4 w-4" />
                <span>
                  {lang === "EN" ? "Gujarat Stamp Duty & Fee Calculator" : "ગુજરાત સ્ટેમ્પ ડ્યૂટી કેલ્ક્યુલેટર"}
                </span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {lang === "EN" ? "Statutory Government Charges Breakdown" : "સત્તાવાર સરકારી ફી અને વિગતો"}
              </h2>
            </div>
            <div
              className={`text-xs px-3 py-1.5 rounded-full border self-start sm:self-center ${
                isLight ? "bg-[#f5f5f7] border-black/[0.06] text-[#86868b]" : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {lang === "EN" ? "Article 30, Gujarat Stamp Act 1958" : "કલમ ૩૦, ગુજરાત સ્ટેમ્પ એક્ટ ૧૯૫૮"}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Input Controls */}
            <div className="space-y-4 lg:col-span-7 text-xs">
              <div>
                <label className="block font-medium mb-1">
                  {lang === "EN" ? "Monthly Rent (₹)" : "માસિક ભાડું (₹)"}
                </label>
                <input
                  type="number"
                  value={calcRent}
                  onChange={(e) => setCalcRent(Number(e.target.value))}
                  className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                    isLight ? "bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    {lang === "EN" ? "Security Deposit (₹)" : "સિક્યોરિટી ડિપોઝિટ (₹)"}
                  </label>
                  <input
                    type="number"
                    value={calcDeposit}
                    onChange={(e) => setCalcDeposit(Number(e.target.value))}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    {lang === "EN" ? "Duration (Months)" : "સમયગાળો (મહિના)"}
                  </label>
                  <select
                    value={calcDuration}
                    onChange={(e) => setCalcDuration(Number(e.target.value))}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#0071e3] ${
                      isLight ? "bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  >
                    <option value={11}>11 Months (Standard)</option>
                    <option value={12}>12 Months (Reg. Required)</option>
                    <option value={24}>24 Months (2 Years)</option>
                    <option value={36}>36 Months (3 Years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  {lang === "EN" ? "Property Usage" : "મિલકતનો ઉપયોગ"}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcType("RESIDENTIAL")}
                    className={`rounded-xl border py-2.5 text-xs font-semibold transition ${
                      calcType === "RESIDENTIAL"
                        ? "border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]"
                        : isLight
                        ? "border-black/[0.08] bg-[#f5f5f7] text-[#86868b]"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    {lang === "EN" ? "Residential Flat / House" : "રહેણાંક ફ્લેટ / મકાન"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcType("COMMERCIAL")}
                    className={`rounded-xl border py-2.5 text-xs font-semibold transition ${
                      calcType === "COMMERCIAL"
                        ? "border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]"
                        : isLight
                        ? "border-black/[0.08] bg-[#f5f5f7] text-[#86868b]"
                        : "border-slate-800 bg-slate-950 text-slate-400"
                    }`}
                  >
                    {lang === "EN" ? "Commercial Office / Shop" : "દુકાન / ઑફિસ (કોમર્શિયલ)"}
                  </button>
                </div>
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div
              className={`rounded-2xl border p-5 lg:col-span-5 flex flex-col justify-between ${
                isLight ? "bg-[#f5f5f7] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}
            >
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#86868b]">
                  {lang === "EN" ? "Estimated Payable Breakdown" : "ચૂકવવાપાત્ર ફી વિભાજન"}
                </h4>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#86868b]">{lang === "EN" ? "Govt. Stamp Duty (e-Stamp)" : "સરકારી સ્ટેમ્પ ડ્યૂટી"}:</span>
                    <span className="font-semibold">
                      ₹{dutyResult?.government_stamp_duty?.toLocaleString() || "300"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#86868b]">{lang === "EN" ? "Sub-Registrar Reg. Fee" : "રજિસ્ટ્રાર ફી"}:</span>
                    <span className="font-semibold">
                      {dutyResult?.registration_required
                        ? `₹${dutyResult?.registration_fee?.toLocaleString() || "1,000"}`
                        : "₹0 (Exempt < 12m)"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#86868b]">{lang === "EN" ? "e-Stamp Procurement" : "ઈ-સ્ટેમ્પ ચાર્જ"}:</span>
                    <span className="font-semibold">₹{dutyResult?.provider_charges || 100}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#86868b]">{lang === "EN" ? "Platform & eSign Processing" : "પ્લેટફોર્મ અને આધાર સહી"}:</span>
                    <span className="font-semibold">₹{dutyResult?.platform_charges || 299}</span>
                  </div>

                  <div className="border-t border-black/[0.08] dark:border-slate-800 pt-3 flex justify-between text-sm font-bold text-[#0071e3]">
                    <span>{lang === "EN" ? "Total Estimated Fee" : "કુલ અંદાજિત રકમ"}:</span>
                    <span className="text-base text-[#1d1d1f] dark:text-white">
                      ₹{dutyResult?.total_payable?.toLocaleString() || "699"}
                    </span>
                  </div>
                </div>

                {dutyResult?.registration_required && (
                  <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-800 dark:text-amber-300">
                    {lang === "EN"
                      ? "Notice: Leases of 12+ months require mandatory registration under Section 17 of the Registration Act."
                      : "સૂચના: ૧૨ કે તેથી વધુ મહિનાના ભાડા કરાર માટે કલમ ૧૭ મુજબ સબ-રજિસ્ટ્રાર નોંધણી ફરજિયાત છે."}
                  </div>
                )}
              </div>

              <Link
                href={`/rent-agreement/create?mode=OWNER&rent=${calcRent}&duration=${calcDuration}`}
                className="mt-6 block w-full rounded-xl bg-[#0071e3] hover:bg-[#0077ed] py-2.5 text-center text-xs font-semibold text-white shadow-xs transition"
              >
                {lang === "EN" ? "Create This Agreement Now" : "આ કરાર હવે બનાવો"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PUBLIC QR VERIFICATION BAR */}
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border p-6 shadow-sm ${
            isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/40 border-slate-800"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0071e3]/10 text-[#0071e3]">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">
                {lang === "EN" ? "Verify Any Issued Agreement" : "ઈ-ભાડા કરારની સત્યતા ચકાસો"}
              </h3>
              <p className={`text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {lang === "EN"
                  ? "Enter Agreement ID or scan document QR code to verify tamper-proof SHA-256 hash."
                  : "ડોક્યુમેન્ટ પરનો QR કોડ સ્કેન કરો અથવા કરાર નંબર નાખીને અધિકૃતતા તપાસો."}
              </p>
            </div>
          </div>
          <form onSubmit={handleVerifySubmit} className="flex w-full sm:w-auto gap-2">
            <input
              type="text"
              placeholder="e.g. AGR-GJ-2026-..."
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              className={`w-full sm:w-60 rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#0071e3] ${
                isLight ? "bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
              }`}
            />
            <button
              type="submit"
              className="rounded-xl bg-[#0071e3] hover:bg-[#0077ed] px-4 py-2 text-xs font-semibold text-white shadow-xs transition"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
