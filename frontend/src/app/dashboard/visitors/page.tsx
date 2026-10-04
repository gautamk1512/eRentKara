"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Eye, Search, Plus, User, Clock, Phone, Calendar, Building2, CheckCircle2, LogIn, LogOut as LogOutIcon } from "lucide-react";

export default function DashboardVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await api.getVisitors(); if (res.success) setVisitors(res.data || []); } catch (e) { console.error(e); } finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-xl font-black text-slate-900">Visitor Management</h1><p className="text-xs text-slate-500">Track visitor entries and exits across your properties</p></div>
        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 shrink-0"><Plus className="w-4 h-4" /><span>Log Visitor</span></button>
      </div>
      {loading ? <div className="space-y-3 animate-pulse">{[1,2,3].map(n=><div key={n} className="h-20 bg-white rounded-2xl border border-slate-200"/>)}</div>
      : visitors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4"><Eye className="w-12 h-12 text-slate-300 mx-auto"/><h3 className="font-bold text-lg text-slate-900">No visitors logged</h3><p className="text-xs text-slate-500">Visitor entries will appear here when logged by security or tenants.</p></div>
      ) : (
        <div className="space-y-3">{visitors.map((v,i) => (
          <div key={v.id||i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold shrink-0">{(v.visitor_name||"V")[0]}</div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">{v.visitor_name}</p>
                  <div className="flex flex-wrap gap-3 mt-0.5 text-[10px] text-slate-500">
                    {v.visitor_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{v.visitor_phone}</span>}
                    <span className="flex items-center gap-1"><User className="w-3 h-3"/>Visiting: {v.tenant_name||"—"}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{v.entry_time ? new Date(v.entry_time).toLocaleString("en-IN"):"-"}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {v.exit_time ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1"><LogOutIcon className="w-3 h-3"/>Exited</span>
                 : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1"><LogIn className="w-3 h-3"/>Inside</span>}
              </div>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
