"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  ClipboardCheck, Search, Plus, Phone, Mail, Calendar,
  MapPin, Building2, User, ArrowRight, Clock, CheckCircle2,
  XCircle, MessageSquare, Eye, ChevronDown, Filter, Star
} from "lucide-react";

const statusConfig: Record<string, { color: string; label: string }> = {
  NEW: { color: "bg-blue-100 text-blue-700", label: "New" },
  CONTACTED: { color: "bg-indigo-100 text-indigo-700", label: "Contacted" },
  INTERESTED: { color: "bg-amber-100 text-amber-700", label: "Interested" },
  VISIT_SCHEDULED: { color: "bg-purple-100 text-purple-700", label: "Visit Scheduled" },
  VISITED: { color: "bg-teal-100 text-teal-700", label: "Visited" },
  NEGOTIATION: { color: "bg-orange-100 text-orange-700", label: "Negotiation" },
  BOOKED: { color: "bg-emerald-100 text-emerald-700", label: "Booked" },
  LOST: { color: "bg-red-100 text-red-700", label: "Lost" },
  CONVERTED: { color: "bg-emerald-100 text-emerald-700", label: "Converted" },
};

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [visitModal, setVisitModal] = useState<string | null>(null);
  const [visitDate, setVisitDate] = useState("");

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const res = await api.getLeads();
      if (res.success) setLeads(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleScheduleVisit = async (leadId: string) => {
    if (!visitDate) return;
    try {
      await api.scheduleVisit(leadId, visitDate);
      setVisitModal(null);
      setVisitDate("");
      loadLeads();
    } catch (e) { console.error(e); }
  };

  const filtered = leads.filter((l) => {
    const matchSearch = l.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      l.phone?.includes(searchQ) || l.email?.toLowerCase().includes(searchQ.toLowerCase());
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Pipeline stats
  const pipelineStats = Object.entries(statusConfig).map(([key, config]) => ({
    key, label: config.label, count: leads.filter((l) => l.status === key).length, color: config.color,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Leads & CRM</h1>
          <p className="text-xs text-slate-500">Track enquiries, schedule visits, and convert tenants</p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Pipeline Overview */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        <button onClick={() => setStatusFilter("ALL")}
          className={`px-3 py-2 rounded-xl text-xs font-bold border shrink-0 transition ${
            statusFilter === "ALL" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
          }`}
        >
          All ({leads.length})
        </button>
        {pipelineStats.filter((s) => s.count > 0).map((s) => (
          <button key={s.key} onClick={() => setStatusFilter(s.key)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border shrink-0 transition ${
              statusFilter === s.key ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-emerald-500 transition">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input type="text" placeholder="Search by name, phone, or email..."
          value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
          className="bg-transparent text-xs outline-none w-full text-slate-800" />
      </div>

      {/* Lead Cards */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">No leads found</h3>
          <p className="text-xs text-slate-500">Leads will appear when tenants enquire about your properties.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => {
            const sc = statusConfig[l.status] || { color: "bg-slate-100 text-slate-500", label: l.status };
            return (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
                      {(l.name || "L")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">{l.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.color}`}>{sc.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-500">
                        {l.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {l.phone}</span>}
                        {l.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {l.email}</span>}
                        {l.property_title && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {l.property_title}</span>}
                        {l.source && <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {l.source}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setVisitModal(l.id)}
                      className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold hover:bg-purple-100 transition flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" /> Schedule Visit
                    </button>
                    <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Follow Up
                    </button>
                  </div>
                </div>

                {/* Visit scheduling modal (inline) */}
                {visitModal === l.id && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-end gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-purple-800 mb-1 block">Visit Date & Time</label>
                      <input type="datetime-local" value={visitDate} onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-xs outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleScheduleVisit(l.id)} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg text-xs hover:bg-purple-700 transition">Confirm</button>
                      <button onClick={() => setVisitModal(null)} className="px-4 py-2 bg-white text-slate-600 border border-slate-200 font-bold rounded-lg text-xs hover:bg-slate-50 transition">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
