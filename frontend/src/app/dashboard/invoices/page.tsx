"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  IndianRupee, Search, Plus, Calendar, User, Building2,
  CheckCircle2, Clock, AlertTriangle, Download, Eye,
  ArrowRight, Zap, Receipt, Filter
} from "lucide-react";

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-600",
  ISSUED: "bg-blue-100 text-blue-700",
  PARTIALLY_PAID: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

export default function DashboardInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    try {
      const res = await api.getInvoices();
      const list = Array.isArray(res) ? res : res?.data || res?.results || [];
      setInvoices(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleGenerateMonthly = async () => {
    setGenerating(true);
    try {
      const now = new Date();
      await api.generateMonthlyInvoices(now.getMonth() + 1, now.getFullYear());
      loadInvoices();
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const handleGenerateReceipt = async (invoiceId: string) => {
    try { await api.generateReceipt(invoiceId); } catch (e) { console.error(e); }
  };

  const statuses = ["ALL", "ISSUED", "PAID", "OVERDUE", "PARTIALLY_PAID", "DRAFT"];
  const filtered = invoices.filter((inv) => {
    const matchSearch = inv.tenant_name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      inv.invoice_number?.toLowerCase().includes(searchQ.toLowerCase());
    const matchStatus = statusFilter === "ALL" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary stats
  const totalAmount = invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
  const paidAmount = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + Number(i.total_amount || 0), 0);
  const overdueAmount = invoices.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + Number(i.total_amount || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Invoices & Billing</h1>
          <p className="text-xs text-slate-500">Generate invoices, track payments, and download receipts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGenerateMonthly} disabled={generating}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-2 shrink-0">
            <Zap className="w-4 h-4" />
            <span>{generating ? "Generating..." : "Generate Monthly"}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Total Invoiced</p>
          <p className="text-2xl font-black text-slate-900">₹{totalAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
          <p className="text-xs text-emerald-600 mb-1">Collected</p>
          <p className="text-2xl font-black text-emerald-700">₹{paidAmount.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-red-50 rounded-2xl border border-red-200 p-4">
          <p className="text-xs text-red-600 mb-1">Overdue</p>
          <p className="text-2xl font-black text-red-700">₹{overdueAmount.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-emerald-500 transition">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input type="text" placeholder="Search by tenant or invoice number..."
            value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            className="bg-transparent text-xs outline-none w-full text-slate-800" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border shrink-0 transition ${
                statusFilter === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
              }`}>
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => <div key={n} className="h-20 bg-white rounded-2xl border border-slate-200" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <IndianRupee className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">No invoices found</h3>
          <p className="text-xs text-slate-500">Click &quot;Generate Monthly&quot; to create invoices for active tenants.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => (
            <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    inv.status === "PAID" ? "bg-emerald-100 text-emerald-600" :
                    inv.status === "OVERDUE" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">₹{Number(inv.total_amount || 0).toLocaleString("en-IN")}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[inv.status] || "bg-slate-100 text-slate-500"}`}>
                        {inv.status?.replace("_", " ")}
                      </span>
                      {inv.invoice_number && <span className="text-[10px] text-slate-400 font-mono">{inv.invoice_number}</span>}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {inv.tenant_name || "—"}</span>
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {inv.property_title || "—"}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {inv.billing_month}/{inv.billing_year}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {inv.status === "PAID" && (
                    <button onClick={() => handleGenerateReceipt(inv.id)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition flex items-center gap-1">
                      <Receipt className="w-3 h-3" /> Receipt
                    </button>
                  )}
                  <button className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-100 transition flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
