"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  Phone,
  User,
  Calendar,
  RefreshCw,
  Building,
} from "lucide-react";
import { api } from "@/lib/api";

function StatusContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";

  const [reference, setReference] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusData, setStatusData] = useState<any>(null);

  const fetchStatus = async (refToFetch: string) => {
    if (!refToFetch.trim()) {
      setErrorMsg("Please enter a valid verification reference ID.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res: any = await api.getVerificationStatus(refToFetch.trim());
      if (res.success) {
        setStatusData(res);
      } else {
        setErrorMsg(res.message || "Record not found.");
        setStatusData(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Verification record not found or server error.");
      setStatusData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchStatus(initialRef);
    }
  }, [initialRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(reference);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Top Banner: Sandbox Notice */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              SANDBOX / TEST MODE
            </span>
            <span>Simulated UIDAI test environment for development.</span>
          </div>
          <span className="text-amber-800 font-mono font-bold">UIDAI Developer Sandbox</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/verification" className="hover:text-blue-600 transition">
            Verification Portal
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">Status Inquiry</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Verification Status Lookup
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Query the real-time lifecycle status of any Aadhaar e-KYC or Mobile verification transaction.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter Reference (e.g. UIDAI-SBX-...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !reference.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Querying...
                </>
              ) : (
                <>
                  Query Status
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6 flex items-start gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">Lookup Error</p>
              <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Status Record Display */}
        {statusData && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-6">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Transaction Reference</span>
                <span className="font-mono text-base font-bold text-slate-900">{statusData.verification_reference}</span>
              </div>
              <div>
                {statusData.status === "VERIFIED" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    VERIFIED
                  </span>
                )}
                {statusData.status === "OTP_SENT" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    <Clock className="w-4 h-4 text-amber-600" />
                    OTP_SENT
                  </span>
                )}
                {["FAILED", "EXPIRED", "CANCELLED"].includes(statusData.status) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                    <XCircle className="w-4 h-4 text-red-600" />
                    {statusData.status}
                  </span>
                )}
              </div>
            </div>

            {/* Twin Status Badges: Mobile vs Aadhaar */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Mobile Phone Channel</span>
                  {statusData.mobile_verified ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Pending Verification</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">Aadhaar e-KYC Rail</span>
                  {statusData.identity_verified ? (
                    <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Pending OTP</span>
                  )}
                </div>
              </div>
            </div>

            {/* Masked Attributes */}
            <div className="space-y-3 bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs mb-6">
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Verified Citizen</span>
                  <span className="font-semibold text-slate-900">{statusData.verified_name || "Citizen"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Masked Aadhaar Number</span>
                  <span className="font-mono font-semibold text-slate-900">{statusData.masked_aadhaar}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Initiated At</span>
                  <span className="text-slate-700">
                    {statusData.created_at ? new Date(statusData.created_at).toLocaleString() : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Authenticated At</span>
                  <span className="text-slate-700">
                    {statusData.verified_at ? new Date(statusData.verified_at).toLocaleString() : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/rent-agreement/create"
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition text-center shadow-sm"
              >
                Proceed to Agreement Creation
              </Link>
              <Link
                href="/verification/aadhaar"
                className="py-3 px-5 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition text-center"
              >
                Verify New Aadhaar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerificationStatusLookupPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Status...</div>}>
      <StatusContent />
    </React.Suspense>
  );
}
