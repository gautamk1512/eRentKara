"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Wrench, Search, Plus, AlertTriangle, CheckCircle2,
  Clock, User, Building2, Calendar, Camera, MessageSquare,
  ArrowRight, Filter, ChevronDown
} from "lucide-react";

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  OPEN: { color: "bg-red-100 text-red-700", label: "Open", icon: AlertTriangle },
  ASSIGNED: { color: "bg-blue-100 text-blue-700", label: "Assigned", icon: User },
  IN_PROGRESS: { color: "bg-amber-100 text-amber-700", label: "In Progress", icon: Clock },
  WAITING: { color: "bg-purple-100 text-purple-700", label: "Waiting", icon: Clock },
  RESOLVED: { color: "bg-emerald-100 text-emerald-700", label: "Resolved", icon: CheckCircle2 },
  CLOSED: { color: "bg-slate-100 text-slate-500", label: "Closed", icon: CheckCircle2 },
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export default function DashboardComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => { loadComplaints(); }, []);

  const loadComplaints = async () => {
    try {
      const res = await api.getComplaints();
      if (res.success) setComplaints(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateComplaintStatus(id, status);
      loadComplaints();
    } catch (e) { console.error(e); }
  };

  const statuses = ["ALL", "OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  const filtered = complaints.filter((c) => {
    const matchSearch = c.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
      c.tenant_name?.toLowerCase().includes(searchQ.toLowerCase());
    const matchStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCount = complaints.filter((c) => c.status === "OPEN").length;
  const inProgressCount = complaints.filter((c) => ["ASSIGNED", "IN_PROGRESS", "WAITING"].includes(c.status)).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Complaints & Maintenance</h1>
          <p className="text-xs text-slate-500">Track issues, assign staff, and resolve tenant complaints</p>
        </div>
        <div className="flex gap-3 text-xs">
          {openCount > 0 && (
            <span className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {openCount} Open
            </span>
          )}
          {inProgressCount > 0 && (
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {inProgressCount} In Progress
            </span>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {statuses.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border shrink-0 transition ${
              statusFilter === s ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
            }`}>
            {s === "ALL" ? `All (${complaints.length})` : `${s.replace("_", " ")} (${complaints.filter((c) => c.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-emerald-500 transition">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input type="text" placeholder="Search complaints..."
          value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
          className="bg-transparent text-xs outline-none w-full text-slate-800" />
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">No complaints</h3>
          <p className="text-xs text-slate-500">All quiet! Complaints from tenants will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const sc = statusConfig[c.status] || { color: "bg-slate-100 text-slate-500", label: c.status, icon: Clock };
            const StatusIcon = sc.icon;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      c.status === "OPEN" ? "bg-red-100 text-red-600" :
                      c.status === "RESOLVED" || c.status === "CLOSED" ? "bg-emerald-100 text-emerald-600" :
                      "bg-amber-100 text-amber-600"
                    }`}>
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">{c.title || c.category || "Complaint"}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.color}`}>
                          {sc.label}
                        </span>
                        {c.priority && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColors[c.priority] || ""}`}>
                            {c.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {c.tenant_name || "—"}</span>
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {c.property_title || "—"}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {c.status === "OPEN" && (
                      <button onClick={() => handleUpdateStatus(c.id, "ASSIGNED")}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition">
                        Assign
                      </button>
                    )}
                    {c.status === "IN_PROGRESS" && (
                      <button onClick={() => handleUpdateStatus(c.id, "RESOLVED")}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition">
                        Resolve
                      </button>
                    )}
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
