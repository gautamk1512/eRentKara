"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Plus,
  Send,
  Eye,
  ShieldCheck,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { api } from "@/lib/api";

export default function OwnerDashboardPage() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"ALL" | "AWAITING_TENANT" | "AWAITING_SIGNATURE" | "COMPLETED">("ALL");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setLoading(true);
    api.getAgreements()
      .then((res: any) => {
        const list = Array.isArray(res) ? res : res?.data || res?.results || [];
        setAgreements(list);
      })
      .catch(() => {
        // Fallback items
        setAgreements([
          {
            id: "agr-1",
            agreement_number: "AGR-GJ-2026-9B41E",
            property_title: "2BHK Shivalik Residency, SG Highway",
            tenant_name: "Amitbhai Shah",
            monthly_rent: "15000.00",
            duration_months: 11,
            status: "COMPLETED",
            status_display: "Completed & Legally Executed",
            stamp_status: "ISSUED",
            stamp_duty_amount: "300.00",
            created_at: "2026-09-28T10:00:00Z",
            public_verification_token: "9b41e8c7-4321",
          },
          {
            id: "agr-2",
            agreement_number: "AGR-GJ-2026-F18A0",
            property_title: "3BHK Bodakdev Flat",
            tenant_name: "Ketan Dave",
            monthly_rent: "22000.00",
            duration_months: 11,
            status: "INVITATION_SENT",
            status_display: "Invitation Sent to Tenant",
            stamp_status: "NOT_REQUESTED",
            stamp_duty_amount: "300.00",
            created_at: "2026-09-29T08:30:00Z",
            public_verification_token: "f18a091b-1234",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = agreements.filter((agr) => {
    if (tab === "AWAITING_TENANT") return agr.status?.includes("TENANT") || agr.status?.includes("INVITATION");
    if (tab === "AWAITING_SIGNATURE") return agr.status?.includes("SIGN") || agr.status === "REVIEW_PENDING";
    if (tab === "COMPLETED") return agr.status === "COMPLETED" || agr.status === "STAMPED";
    return true;
  });

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
            <div className="flex items-center gap-2 text-[#0071e3] text-xs font-semibold uppercase tracking-wider">
              <Building2 className="h-4 w-4" />
              <span>Rent Agreement • Owner Management Portal</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Owner Dashboard & Rental Agreements
            </h1>
            <p className={`mt-0.5 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
              Manage Gujarat official deeds, tenant eSign invitations, and treasury e-Stamps
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
              href="/rent-agreement/create?mode=OWNER"
              className="flex items-center gap-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] px-5 py-2 text-xs font-semibold text-white shadow-xs transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Agreement</span>
            </Link>
          </div>
        </div>

        {/* Tab Filters */}
        <div
          className={`mt-6 flex flex-wrap gap-2 border-b pb-3 ${
            isLight ? "border-black/[0.06]" : "border-slate-800/80"
          }`}
        >
          {[
            { id: "ALL", label: "All Agreements" },
            { id: "AWAITING_TENANT", label: "Awaiting Tenant" },
            { id: "AWAITING_SIGNATURE", label: "Awaiting Signature" },
            { id: "COMPLETED", label: "Completed Deeds" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                tab === t.id
                  ? isLight
                    ? "bg-[#0071e3] text-white shadow-xs"
                    : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : isLight
                  ? "bg-white text-[#86868b] border border-black/[0.08] hover:text-[#1d1d1f]"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Agreement Cards Grid */}
        <div className="mt-6">
          {loading ? (
            <div
              className={`rounded-3xl border p-8 text-center text-xs shadow-sm ${
                isLight ? "bg-white border-black/[0.08] text-[#86868b]" : "bg-slate-900/40 border-slate-800 text-slate-400"
              }`}
            >
              Loading your agreements...
            </div>
          ) : filtered.length === 0 ? (
            <div
              className={`rounded-3xl border p-12 text-center shadow-sm ${
                isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/40 border-slate-800"
              }`}
            >
              <FileText className="mx-auto h-8 w-8 text-[#86868b]" />
              <p className="mt-2 text-sm font-semibold">No agreements in this category</p>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-500"}`}>
                Create an agreement to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {filtered.map((agr) => (
                <div
                  key={agr.id}
                  className={`rounded-3xl border p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                    isLight
                      ? "bg-white border-black/[0.08]"
                      : "bg-slate-900/60 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0071e3]">
                        {agr.agreement_number}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          agr.status === "COMPLETED"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "border-[#0071e3]/30 bg-[#0071e3]/10 text-[#0071e3]"
                        }`}
                      >
                        {agr.status_display || agr.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold">
                      {agr.property_title || "Residential Demised Premises"}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className={`p-3 rounded-2xl ${isLight ? "bg-[#f5f5f7]" : "bg-slate-950"}`}>
                        <span className="text-[10px] text-[#86868b] uppercase block">Tenant</span>
                        <span className="font-semibold block mt-0.5">{agr.tenant_name || "Unassigned"}</span>
                      </div>
                      <div className={`p-3 rounded-2xl ${isLight ? "bg-[#f5f5f7]" : "bg-slate-950"}`}>
                        <span className="text-[10px] text-[#86868b] uppercase block">Monthly Rent</span>
                        <span className="font-semibold block mt-0.5">₹{Number(agr.monthly_rent || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`mt-5 pt-4 border-t flex items-center justify-between gap-2 text-xs ${
                      isLight ? "border-black/[0.06]" : "border-slate-800"
                    }`}
                  >
                    <Link
                      href={`/rent-agreement/verify/${agr.public_verification_token || agr.agreement_number}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition ${
                        isLight
                          ? "border-black/[0.08] bg-[#f5f5f7] text-[#1d1d1f] hover:bg-black/[0.04]"
                          : "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5 text-[#0071e3]" />
                      <span>Verify Status</span>
                    </Link>

                    {agr.status === "COMPLETED" ? (
                      <a
                        href={`/api/v1/agreements/${agr.id}/download-pdf/`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] px-4 py-1.5 font-semibold text-white shadow-xs transition"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <Link
                        href={`/rent-agreement/create?mode=OWNER&id=${agr.id}`}
                        className="flex items-center gap-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] px-4 py-1.5 font-semibold text-white shadow-xs transition"
                      >
                        <span>Continue Process</span>
                      </Link>
                    )}
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
