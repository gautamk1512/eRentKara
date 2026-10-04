"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  Settings,
  Activity,
  Layers,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  DollarSign,
} from "lucide-react";
import { api } from "@/lib/api";

export default function AdminRentAgreementsPage() {
  const [activeTab, setActiveTab] = useState<"RULES" | "PROVIDERS" | "AGREEMENTS">("RULES");

  const legalRules = [
    {
      state: "Gujarat (GJ)",
      type: "Residential Tenancy",
      threshold: "Up to 11 Months",
      duty: "₹300 Fixed",
      reg_fee: "₹0 (Exempt)",
      act: "Gujarat Stamp Act 1958 Article 30",
      status: "ACTIVE",
    },
    {
      state: "Gujarat (GJ)",
      type: "Residential Tenancy",
      threshold: "12 to 60 Months",
      duty: "0.25% of Consideration",
      reg_fee: "₹1,000 Mandatory",
      act: "Registration Act Section 17 & Stamp Act",
      status: "ACTIVE",
    },
    {
      state: "Gujarat (GJ)",
      type: "Commercial Lease",
      threshold: "1 to 120 Months",
      duty: "0.50% of Consideration",
      reg_fee: "₹1,500 Mandatory",
      act: "Revenue Department Notification 2024",
      status: "ACTIVE",
    },
  ];

  const providers = [
    { name: "Government of Gujarat e-Stamping (SHCIL)", type: "eStamp", status: "ONLINE", latency: "140ms" },
    { name: "Leegality / Digio eSign Gateway", type: "eSign", status: "ONLINE", latency: "95ms" },
    { name: "UIDAI Aadhaar OTP Gateway", type: "Identity KYC", status: "ONLINE", latency: "210ms" },
    { name: "Razorpay / Cashfree Statutory Payments", type: "Payment", status: "ONLINE", latency: "110ms" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Scale className="h-4 w-4" />
              <span>Administrative Compliance & Rules Engine</span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              Gujarat Legal Rules & Providers Control Panel
            </h1>
          </div>
          <a
            href="http://localhost:8000/django-admin/agreements/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 sm:mt-0 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white"
          >
            Open Django Admin
          </a>
        </div>

        {/* Tab switch */}
        <div className="mt-6 flex gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("RULES")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold ${
              activeTab === "RULES"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Legal & Stamp Duty Rules
          </button>
          <button
            onClick={() => setActiveTab("PROVIDERS")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold ${
              activeTab === "PROVIDERS"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Provider Adapters & Telemetry
          </button>
        </div>

        {/* Rules Table */}
        {activeTab === "RULES" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Jurisdiction</th>
                  <th className="p-4">Agreement Type</th>
                  <th className="p-4">Threshold</th>
                  <th className="p-4">Stamp Duty</th>
                  <th className="p-4">Registration</th>
                  <th className="p-4">Statutory Act</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {legalRules.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">{r.state}</td>
                    <td className="p-4">{r.type}</td>
                    <td className="p-4">{r.threshold}</td>
                    <td className="p-4 font-semibold text-cyan-400">{r.duty}</td>
                    <td className="p-4">{r.reg_fee}</td>
                    <td className="p-4 text-slate-400">{r.act}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Providers */}
        {activeTab === "PROVIDERS" && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {providers.map((p, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{p.type}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{p.name}</h3>
                  <span className="text-xs text-slate-400">Response Latency: {p.latency}</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
