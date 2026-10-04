"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  FileText, Search, Plus, Calendar, User, Building2,
  CheckCircle2, Clock, AlertTriangle, Send, Download,
  Eye, PenLine, ArrowRight, ShieldCheck, IndianRupee,
  Stamp
} from "lucide-react";

const statusConfig: Record<string, { color: string; label: string }> = {
  DRAFT: { color: "bg-slate-100 text-slate-600", label: "Draft" },
  PENDING_OWNER_APPROVAL: { color: "bg-amber-100 text-amber-700", label: "Owner Review" },
  PENDING_TENANT_SIGN: { color: "bg-blue-100 text-blue-700", label: "Tenant Sign" },
  PENDING_OWNER_SIGN: { color: "bg-indigo-100 text-indigo-700", label: "Owner Sign" },
  STAMPING: { color: "bg-purple-100 text-purple-700", label: "Stamping" },
  SIGNED: { color: "bg-emerald-100 text-emerald-700", label: "Signed" },
  COMPLETED: { color: "bg-emerald-100 text-emerald-700", label: "Completed" },
  EXPIRED: { color: "bg-red-100 text-red-700", label: "Expired" },
  CANCELLED: { color: "bg-slate-100 text-slate-500", label: "Cancelled" },
};

export default function DashboardAgreementsPage() {
  const [agreements, setAgreements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    try {
      const res = await api.getAgreements();
      if (res.success) setAgreements(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSendESign = async (id: string) => {
    try {
      await api.sendForESign(id);
      loadAgreements();
    } catch (e) { console.error(e); }
  };

  const filtered = agreements.filter((a) =>
    a.tenant_name?.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.property_title?.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Rental Agreements</h1>
          <p className="text-xs text-slate-500">Draft, sign, and manage state-compliant rental agreements</p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Draft Agreement</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-emerald-500 transition">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input type="text" placeholder="Search by tenant name or property..."
          value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
          className="bg-transparent text-xs outline-none w-full text-slate-800" />
      </div>

      {/* Info Banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-start gap-3">
        <Stamp className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-violet-800">State-Compliant Agreement Engine</p>
          <p className="text-[10px] text-violet-600 mt-0.5">Stamp duty calculated automatically for KA, MH, DL, TN, TG, GJ, UP, and more. eSign via Leegality API.</p>
        </div>
      </div>

      {/* Agreement List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">No agreements yet</h3>
          <p className="text-xs text-slate-500">Draft your first rental agreement from a tenancy record.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const sc = statusConfig[a.status] || { color: "bg-slate-100 text-slate-500", label: a.status };
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">Agreement #{a.id?.slice(-6)}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {a.tenant_name || "—"}</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {a.property_title || "—"}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.start_date || "—"} to {a.end_date || "—"}</span>
                        <span className="flex items-center gap-1"><IndianRupee className="w-3 h-3" /> ₹{Number(a.monthly_rent || 0).toLocaleString("en-IN")}/mo</span>
                      </div>
                      {a.stamp_duty_amount && (
                        <div className="mt-1.5 text-[10px] text-violet-600 font-medium flex items-center gap-1">
                          <Stamp className="w-3 h-3" />
                          Stamp Duty: ₹{Number(a.stamp_duty_amount).toLocaleString("en-IN")} ({a.state_code || "—"})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {a.status === "DRAFT" && (
                      <button onClick={() => handleSendESign(a.id)}
                        className="px-3 py-1.5 bg-violet-600 text-white border border-violet-600 rounded-lg text-[10px] font-bold hover:bg-violet-700 transition flex items-center gap-1">
                        <Send className="w-3 h-3" /> Send for eSign
                      </button>
                    )}
                    {(a.status === "SIGNED" || a.status === "COMPLETED") && (
                      <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition flex items-center gap-1">
                        <Download className="w-3 h-3" /> Download PDF
                      </button>
                    )}
                    <button className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-100 transition flex items-center gap-1">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
