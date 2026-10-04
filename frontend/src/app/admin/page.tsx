"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  FileText,
  Users,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Database
} from "lucide-react";

export default function AdminPortalHubPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
              eR
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Administration Console
              </span>
              <h1 className="text-xl font-black text-white">eRentKarar Management Suite</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition"
            >
              Owner Dashboard
            </Link>
            <a
              href="http://localhost:8000/admin/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>Django Admin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="space-y-3 text-center sm:text-left">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Control Center
          </span>
          <h2 className="text-3xl font-black text-white">Admin Operations & Verification</h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Review incoming property listing requests from landlords, manage stamp duty legal rules, and moderate platform operations.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Property Listings Moderation */}
          <Link
            href="/admin/properties"
            className="group p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition">
                    Property Listing Approvals
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Primary
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review new PG, hostel, flat, and co-living listing submissions submitted by landlords. Verify property details and approve them to make them live on the public website.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Open Listing Moderation Portal</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Card 2: Rent Agreements & Legal Rules */}
          <Link
            href="/admin/rent-agreements"
            className="group p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition duration-300 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition" />
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition">
                  Rent Agreements & Stamp Duty Rules
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage state-specific stamp duty calculations (Gujarat, Karnataka, Maharashtra), e-Stamping gateway status, and Aadhaar eSign configuration.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
              <span>Open Legal Agreement Console</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>

        {/* Quick Django Admin Shortcut Card */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-slate-400" />
            <div>
              <h4 className="text-sm font-bold text-white">Full Django Administration Backend</h4>
              <p className="text-xs text-slate-400">Direct database model access for users, payments, and system audit logs.</p>
            </div>
          </div>
          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
          >
            <span>Launch Django Admin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>
    </div>
  );
}
