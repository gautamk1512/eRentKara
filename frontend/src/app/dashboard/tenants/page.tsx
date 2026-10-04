"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Users, Search, Filter, UserCheck, UserX, Phone, Mail,
  MapPin, Calendar, Bed, Building2, CheckCircle2, Clock,
  AlertTriangle, MoreVertical, ChevronDown, Plus, ArrowRight,
  ShieldCheck, FileText, IndianRupee, Eye
} from "lucide-react";

export default function DashboardTenantsPage() {
  const [tenancies, setTenancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadTenancies();
  }, []);

  const loadTenancies = async () => {
    try {
      const res = await api.getTenancies();
      const list = Array.isArray(res) ? res : res?.data || res?.results || [];
      setTenancies(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ["ALL", "ACTIVE", "NOTICE", "PENDING", "MOVED_OUT"];
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    NOTICE: "bg-amber-100 text-amber-700",
    PENDING: "bg-blue-100 text-blue-700",
    MOVED_OUT: "bg-slate-100 text-slate-500",
    CHECKED_IN: "bg-emerald-100 text-emerald-700",
  };

  const filtered = tenancies.filter((t) => {
    const matchSearch =
      t.tenant_name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.tenant_email?.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.property_title?.toLowerCase().includes(searchQ.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Tenants</h1>
          <p className="text-xs text-slate-500">Manage all your tenants, KYC, agreements, and stays</p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Tenant</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-emerald-500 transition">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input type="text" placeholder="Search by name, email, or property..."
            value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            className="bg-transparent text-xs outline-none w-full text-slate-800" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statuses.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border shrink-0 transition ${
                statusFilter === s
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Tenant Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-white rounded-xl border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">No tenants found</h3>
          <p className="text-xs text-slate-500">Add tenants or convert leads to populate this list.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">Tenant</div>
            <div className="col-span-2">Property</div>
            <div className="col-span-2">Room / Bed</div>
            <div className="col-span-1">Rent</div>
            <div className="col-span-1">KYC</div>
            <div className="col-span-1">Agreement</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Rows */}
          {filtered.map((t, i) => (
            <div key={t.id || i} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-slate-100 hover:bg-slate-50/50 transition items-center">
              {/* Tenant info */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {(t.tenant_name || "T")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{t.tenant_name || "Unknown"}</p>
                  <p className="text-[10px] text-slate-500 truncate">{t.tenant_email || t.tenant_phone || "-"}</p>
                </div>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-slate-700 truncate">{t.property_title || "-"}</p>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-slate-700">{t.room_number || "-"} / {t.bed_label || "-"}</p>
              </div>

              <div className="col-span-1">
                <p className="text-xs font-bold text-slate-900">₹{Number(t.monthly_rent || 0).toLocaleString("en-IN")}</p>
              </div>

              <div className="col-span-1">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.kyc_status === "VERIFIED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {t.kyc_status === "VERIFIED" ? <ShieldCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {t.kyc_status || "Pending"}
                </span>
              </div>

              <div className="col-span-1">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  t.agreement_status === "SIGNED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}>
                  <FileText className="w-3 h-3" />
                  {t.agreement_status || "None"}
                </span>
              </div>

              <div className="col-span-1 flex items-center gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[t.status] || "bg-slate-100 text-slate-500"}`}>
                  {t.status || "—"}
                </span>
              </div>

              <div className="col-span-1 flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
