"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { api } from "@/lib/api";

export default function InvitationResolvePage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [agreement, setAgreement] = useState<any>(null);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");

    api.getInvitationDetails(token)
      .then((res: any) => {
        if (res?.data) {
          setInvitationData(res.data.invitation);
          setAgreement(res.data.agreement);
        } else {
          setError("Invitation details not found.");
        }
      })
      .catch((err: any) => {
        setError(err.message || "Invalid or expired invitation link.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleAccept = async () => {
    // Check if user is logged in
    const userToken = typeof window !== "undefined" ? localStorage.getItem("erk_token") : null;
    if (!userToken) {
      router.push(`/login?next=/rent-agreement/invite/${token}`);
      return;
    }

    setAccepting(true);
    setError("");
    try {
      const res: any = await api.acceptInvitation(token);
      if (res?.success) {
        setAcceptedSuccess(true);
        // Direct to tenant or owner dashboard or agreement review
        setTimeout(() => {
          if (invitationData?.target_role === "TENANT") {
            router.push("/tenant/dashboard");
          } else {
            router.push("/owner/dashboard");
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to accept invitation.");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">
            You're Invited to Sign a Rent Agreement
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Government of Gujarat Compliant Digital E-Rent Deed
          </p>
        </div>

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
            Loading invitation terms...
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
            <h3 className="mt-2 text-sm font-bold text-white">Invitation Unavailable</h3>
            <p className="mt-1 text-xs text-red-300">{error}</p>
          </div>
        )}

        {!loading && invitationData && agreement && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Target Role: {invitationData.target_role}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Invited: {invitationData.target_name}
                </h3>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 font-mono text-xs text-slate-300">
                {agreement.agreement_number}
              </span>
            </div>

            <div className="mt-5 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Premises / Property:</span>
                <span className="font-semibold text-white">{agreement.property_title}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Location City:</span>
                <span className="font-semibold text-white">{agreement.property_city}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Monthly Rent:</span>
                <span className="font-semibold text-white">₹{Number(agreement.monthly_rent).toLocaleString()} / month</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Security Deposit:</span>
                <span className="font-semibold text-white">₹{Number(agreement.security_deposit).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-white">{agreement.duration_months} Months</span>
              </div>
            </div>

            {acceptedSuccess ? (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-xs text-emerald-300 font-bold">
                Invitation Accepted! Redirecting to your dashboard...
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAccept}
                disabled={accepting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
              >
                <span>{accepting ? "Accepting & Linking..." : "Accept & Review Agreement"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
