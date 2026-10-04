"use client";

import React, { useState } from "react";
import { BarChart3, Download, Calendar, IndianRupee, Users, Building2, Bed, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export default function DashboardReportsPage() {
  const [period, setPeriod] = useState("this_month");

  const reports = [
    { title: "Rent Collection", desc: "Monthly rent collected vs pending vs overdue", icon: IndianRupee, color: "emerald", value: "₹1,85,000", sub: "₹32,500 pending" },
    { title: "Occupancy Rate", desc: "Bed occupancy across all properties", icon: Bed, color: "blue", value: "87%", sub: "26/30 beds occupied" },
    { title: "Lead Conversion", desc: "Enquiries to confirmed bookings", icon: TrendingUp, color: "violet", value: "34%", sub: "12 of 35 leads converted" },
    { title: "Tenant Retention", desc: "Tenants who renewed vs moved out", icon: Users, color: "teal", value: "91%", sub: "2 move-outs this quarter" },
    { title: "Revenue", desc: "Total revenue from all sources", icon: TrendingUp, color: "amber", value: "₹2,15,000", sub: "↑ 12% vs last month" },
    { title: "Expenses", desc: "Maintenance, utilities, and operational costs", icon: TrendingDown, color: "rose", value: "₹48,000", sub: "↓ 5% vs last month" },
  ];

  const colorMap: Record<string,string> = { emerald: "bg-emerald-50 text-emerald-600 border-emerald-200", blue: "bg-blue-50 text-blue-600 border-blue-200", violet: "bg-violet-50 text-violet-600 border-violet-200", teal: "bg-teal-50 text-teal-600 border-teal-200", amber: "bg-amber-50 text-amber-600 border-amber-200", rose: "bg-rose-50 text-rose-600 border-rose-200" };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-xl font-black text-slate-900">Reports & Analytics</h1><p className="text-xs text-slate-500">Business intelligence for your rental portfolio</p></div>
        <div className="flex gap-2">
          <select value={period} onChange={(e)=>setPeriod(e.target.value)} className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none">
            <option value="this_month">This Month</option><option value="last_month">Last Month</option><option value="this_quarter">This Quarter</option><option value="this_year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition flex items-center gap-1.5"><Download className="w-3.5 h-3.5"/>Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r,i)=>{
          const RIcon = r.icon;
          return (
            <div key={i} className={`rounded-2xl border p-5 space-y-3 ${colorMap[r.color]}`}>
              <div className="flex items-center justify-between">
                <RIcon className="w-6 h-6"/>
                <button className="text-[10px] font-bold underline">View Details</button>
              </div>
              <div>
                <p className="text-2xl font-black">{r.value}</p>
                <p className="text-xs font-medium opacity-75 mt-0.5">{r.title}</p>
              </div>
              <p className="text-[10px] opacity-60">{r.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Available Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {["Rent Collection","Pending Dues","Overdue","Occupancy","Vacancy","Revenue","Expense","P&L","Tenant Ledger","Property Performance","Lead Conversion","Agreement Expiry","KYC Pending","Complaint Summary","Referral Activity"].map((name,i)=>(
            <button key={i} className="text-left px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition flex items-center justify-between group">
              <span>{name}</span>
              <Download className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition"/>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
