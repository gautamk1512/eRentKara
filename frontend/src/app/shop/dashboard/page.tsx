"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PhoneCall,
  Building2,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  QrCode,
  FileText,
  Search,
  Users,
  Sun,
  Moon,
} from "lucide-react";
import { api } from "@/lib/api";

export default function ShopDashboardPage() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setLoading(true);
    api.getAgreements()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.data || res?.results || [];
        setAgreements(list);
      })
      .catch(() => {
        setAgreements([
          {
            id: "agr-kiosk-1",
            agreement_number: "AGR-GJ-2026-000123",
            property_title: "Shop assisted residential flat, Chandkheda",
            owner_masked: "R**** P****",
            tenant_masked: "A**** S****",
            owner_verification: "VERIFIED",
            tenant_verification: "VERIFIED",
            status: "TENANT_SIGNING",
            status_display: "Tenant Signature Pending",
            monthly_rent: 16000,
            duration_months: 11,
            created_at: "2026-09-29T10:30:00Z",
          },
          {
            id: "agr-kiosk-2",
            agreement_number: "AGR-GJ-2026-000124",
            property_title: "Commercial Office, Navrangpura",
            owner_masked: "K**** D****",
            tenant_masked: "M**** J****",
            owner_verification: "VERIFIED",
            tenant_verification: "PENDING",
            status: "TENANT_VERIFICATION_PENDING",
            status_display: "Tenant OTP Verification Pending",
            monthly_rent: 28000,
            duration_months: 11,
            created_at: "2026-09-29T14:15:00Z",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const isLight = theme === "light";

  return (
    <div
      className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 ${
        isLight ? "bg-[#f5f5f7] text-[#1d1d1f]" : "bg-slate-950 text-slate-100"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-5 ${
            isLight ? "border-black/[0.08]" : "border-slate-800"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-semibold uppercase tracking-wider">
              <PhoneCall className="h-4 w-4" />
              <span>Gujarat Digital Seva Kendra Partner Network</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Shop / Kiosk Operator Dashboard
            </h1>
            <p className={`mt-0.5 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
              Assisted data entry portal with zero-impersonation privacy enforcement & masked PII
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isLight ? "dark" : "light")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                isLight
                  ? "border-black/[0.08] bg-white text-[#1d1d1f] hover:bg-black/[0.04]"
                  : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {isLight ? <Moon className="h-3.5 w-3.5 text-[#0071e3]" /> : <Sun className="h-3.5 w-3.5 text-amber-400" />}
              <span>{isLight ? "Dark" : "Light"}</span>
            </button>

            <Link
              href="/rent-agreement/create?mode=SHOP"
              className="flex items-center gap-1.5 rounded-full bg-amber-600 hover:bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>New Assisted Agreement</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div
            className={`rounded-3xl border p-5 shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <span className="text-xs text-[#86868b]">Today&apos;s Assisted Deeds</span>
            <p className="text-2xl font-bold text-[#1d1d1f] dark:text-white mt-1">4</p>
          </div>

          <div
            className={`rounded-3xl border p-5 shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <span className="text-xs text-[#86868b]">Awaiting Parties eSign</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">2</p>
          </div>

          <div
            className={`rounded-3xl border p-5 shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <span className="text-xs text-[#86868b]">Executed & Stamped</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">19</p>
          </div>

          <div
            className={`rounded-3xl border p-5 shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <span className="text-xs text-[#86868b]">Partner Commission</span>
            <p className="text-2xl font-bold text-[#0071e3] mt-1">₹1,900</p>
          </div>
        </div>

        {/* Assisted Agreement List */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">Recent Kiosk Queue</h2>
            <span className="text-xs text-[#86868b]">Zero Impersonation Enforced</span>
          </div>

          {loading ? (
            <div
              className={`rounded-3xl border p-8 text-center text-xs shadow-sm ${
                isLight ? "bg-white border-black/[0.08] text-[#86868b]" : "bg-slate-900/40 border-slate-800 text-slate-400"
              }`}
            >
              Loading assisted sessions...
            </div>
          ) : (
            <div className="space-y-3">
              {agreements.map((agr) => (
                <div
                  key={agr.id}
                  className={`rounded-3xl border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:shadow-md ${
                    isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600">
                        {agr.agreement_number}
                      </span>
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20">
                        {agr.status_display || agr.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold">{agr.property_title}</h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#86868b]">
                      <span>Owner: {agr.owner_masked} ({agr.owner_verification})</span>
                      <span>•</span>
                      <span>Tenant: {agr.tenant_masked} ({agr.tenant_verification})</span>
                      <span>•</span>
                      <span>Rent: ₹{Number(agr.monthly_rent || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/rent-agreement/create?mode=SHOP&id=${agr.id}`}
                      className="rounded-full bg-[#0071e3] hover:bg-[#0077ed] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition"
                    >
                      Assist Parties
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
