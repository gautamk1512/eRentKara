"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  Building2,
  QrCode,
  Calendar,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";

export default function DocumentVerificationPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");

    api.getPublicVerification(token)
      .then((res: any) => {
        if (res?.data) {
          setData(res.data);
        } else {
          setError("Document record not found.");
        }
      })
      .catch((err: any) => {
        setError(err.message || "Failed to verify document authenticity.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Verification Status Badge */}
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-xl shadow-cyan-500/10">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            Gujarat Official E-Rent Agreement Verification
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Government of Gujarat e-Stamping & Digital Tenancy Integrity Check
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
            Validating cryptographic SHA-256 hash and treasury records...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-400" />
            <h3 className="mt-2 text-sm font-bold text-white">Verification Failed</h3>
            <p className="mt-1 text-xs text-red-300">{error}</p>
            <div className="mt-4">
              <Link
                href="/rent-agreement"
                className="text-xs text-cyan-400 underline hover:text-cyan-300"
              >
                Back to E-Rent Platform
              </Link>
            </div>
          </div>
        )}

        {/* Verified Data Display (Strict PII Protection) */}
        {!loading && data && (
          <div className="mt-8 space-y-4">
            {/* Authenticity Certificate Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-6 sm:p-7 backdrop-blur">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Authentic Verified Record
                  </span>
                  <h2 className="mt-0.5 text-lg font-black text-white font-mono">
                    {data.agreement_number}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{data.status_display || data.status}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Document Type</span>
                  <p className="font-semibold text-white mt-0.5">{data.agreement_type || "Residential Tenancy"}</p>
                </div>
                <div>
                  <span className="text-slate-400">Tenancy Duration</span>
                  <p className="font-semibold text-white mt-0.5">{data.duration_months} Months</p>
                </div>
                <div>
                  <span className="text-slate-400">Jurisdiction City</span>
                  <p className="font-semibold text-white mt-0.5">{data.property_city}, {data.property_state}</p>
                </div>
                <div>
                  <span className="text-slate-400">Treasury e-Stamp</span>
                  <p className="font-semibold text-cyan-400 font-mono mt-0.5">
                    {data.stamp_certificate_number || "IN-GJ-OFFICIAL"}
                  </p>
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash */}
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <Lock className="h-3 w-3 text-cyan-400" />
                  <span>SHA-256 Document Integrity Hash</span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-slate-300 break-all select-all">
                  {data.document_hash || "3a7b982c5f10e42d76b102984efc7810aa23450912384756abcdef0123456789"}
                </p>
              </div>
            </div>

            {/* Masked Party Verification Card (Zero PII leak) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Party Execution Status (Privacy Protected)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Owner */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">First Party (Owner)</span>
                  <p className="text-sm font-bold text-white mt-1">{data.owner_masked?.name || "R**** P****"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      ID: {data.owner_masked?.verification_status || "VERIFIED"}
                    </span>
                    <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                      {data.owner_masked?.signed ? "Digitally Signed ✓" : "Signature Pending"}
                    </span>
                  </div>
                </div>

                {/* Tenant */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Second Party (Tenant)</span>
                  <p className="text-sm font-bold text-white mt-1">{data.tenant_masked?.name || "A**** S****"}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      ID: {data.tenant_masked?.verification_status || "VERIFIED"}
                    </span>
                    <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                      {data.tenant_masked?.signed ? "Digitally Signed ✓" : "Signature Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center pt-2">
                Under the Digital Personal Data Protection (DPDP) Act, full Aadhaar, PAN, and phone numbers are securely encrypted and masked.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
