"use client";

import React from "react";
import { UserPlus, Phone, Mail, Building2, Shield, Calendar, Clock } from "lucide-react";

const sampleStaff = [
  { name: "Ravi Kumar", role: "Property Manager", phone: "+91 98765 43210", property: "Starlight Co-Living", shift: "9AM - 6PM", status: "ACTIVE" },
  { name: "Priya S", role: "Receptionist", phone: "+91 87654 32109", property: "Greenfield PG", shift: "8AM - 4PM", status: "ACTIVE" },
  { name: "Suresh M", role: "Maintenance Staff", phone: "+91 76543 21098", property: "All Properties", shift: "10AM - 7PM", status: "ACTIVE" },
  { name: "Meena D", role: "Housekeeping", phone: "+91 65432 10987", property: "Metro Heights Studio", shift: "6AM - 2PM", status: "ON_LEAVE" },
];

export default function DashboardStaffPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-xl font-black text-slate-900">Staff Management</h1><p className="text-xs text-slate-500">Manage staff, assign roles, and track attendance</p></div>
        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 shrink-0"><UserPlus className="w-4 h-4"/><span>Add Staff</span></button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-2">Staff Member</div><div>Role</div><div>Property</div><div>Shift</div><div>Status</div>
        </div>
        {sampleStaff.map((s,i)=>(
          <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-3 px-5 py-4 border-b border-slate-100 hover:bg-slate-50/50 transition items-center">
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">{s.name[0]}</div>
              <div><p className="text-xs font-bold text-slate-900">{s.name}</p><p className="text-[10px] text-slate-500">{s.phone}</p></div>
            </div>
            <div><span className="text-xs text-slate-700 font-medium">{s.role}</span></div>
            <div><span className="text-xs text-slate-700 flex items-center gap-1"><Building2 className="w-3 h-3"/>{s.property}</span></div>
            <div><span className="text-xs text-slate-600 flex items-center gap-1"><Clock className="w-3 h-3"/>{s.shift}</span></div>
            <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.status==="ACTIVE"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{s.status==="ACTIVE"?"Active":"On Leave"}</span></div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-xs text-indigo-800">
        <p className="font-bold">Coming Soon: Attendance Tracking, Salary Management, Task Assignment, and Activity Logs</p>
        <p className="text-[10px] text-indigo-600 mt-1">Phase 5 staff module enhancements.</p>
      </div>
    </div>
  );
}
