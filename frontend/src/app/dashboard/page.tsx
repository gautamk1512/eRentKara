"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, Users, IndianRupee, FileText, CheckCircle2, 
  AlertCircle, Sparkles, Plus, RefreshCw, Send, Download, 
  Wrench, Utensils, Share2, Eye, EyeOff, Bot, Calendar,
  X, Bed as BedIcon, User
} from "lucide-react";
import { api } from "@/lib/api";

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [tenancies, setTenancies] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [referral, setReferral] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Enroll Student / Tenant Modal State
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    tenant_name: "",
    tenant_email: "",
    tenant_phone: "",
    property_id: "",
    bed_id: "",
    start_date: new Date().toISOString().split("T")[0],
    monthly_rent: "",
    security_deposit_paid: "",
    college_company: "",
    food_opt_in: true,
  });
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState("");

  // eSign Draft state
  const [selectedTenancyForAgreement, setSelectedTenancyForAgreement] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("GJ");
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    // Check if user is logged in, or auto-login with demo owner for instant access
    const token = localStorage.getItem("erk_token");
    if (!token) {
      api.login({ email: "owner@erentkarar.com", password: "Password123!" })
        .then((res) => {
          if (res.success && res.data) {
            localStorage.setItem("erk_token", res.data.tokens.access);
            localStorage.setItem("erk_user", JSON.stringify(res.data.user));
            loadAllData();
          } else {
            window.location.href = "/login?next=/dashboard";
          }
        })
        .catch(() => {
          window.location.href = "/login?next=/dashboard";
        });
      return;
    }
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes, tRes, iRes, aRes, lRes, cRes, rRes] = await Promise.all([
        api.getDashboardMetrics().catch(() => ({ success: false })),
        api.getProperties().catch(() => ({ success: false, data: [] })),
        api.getTenancies().catch(() => ({ success: false, data: [] })),
        api.getInvoices().catch(() => ({ success: false, data: [] })),
        api.getAgreements().catch(() => ({ success: false, data: [] })),
        api.getLeads().catch(() => ({ success: false, data: [] })),
        api.getComplaints().catch(() => ({ success: false, data: [] })),
        api.getMyReferral().catch(() => ({ success: false })),
      ]);

      if (mRes.success) setMetrics(mRes.data);
      if (pRes.data) setProperties(Array.isArray(pRes.data) ? pRes.data : pRes.data.results || []);
      if (tRes.data) setTenancies(Array.isArray(tRes.data) ? tRes.data : tRes.data.results || []);
      if (iRes.data) setInvoices(Array.isArray(iRes.data) ? iRes.data : iRes.data.results || []);
      if (aRes.data) setAgreements(Array.isArray(aRes.data) ? aRes.data : aRes.data.results || []);
      if (lRes.data) setLeads(Array.isArray(lRes.data) ? lRes.data : lRes.data.results || []);
      if (cRes.data) setComplaints(Array.isArray(cRes.data) ? cRes.data : cRes.data.results || []);
      if (rRes.success) setReferral(rRes.data);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBedStatus = async (bedId: number, currentStatus: string) => {
    const nextStatus = currentStatus === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE";
    try {
      await api.updateBedStatus(bedId, nextStatus);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleTogglePublish = async (prop: any) => {
    if (prop.verification_status !== "VERIFIED") {
      alert(`Cannot publish yet. This property is currently "${prop.verification_status === "PENDING" ? "Pending Admin Approval" : "Rejected"}". Our Admin team must review and approve it before it can go live.`);
      return;
    }
    try {
      await api.togglePublishProperty(prop.id);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleGenerateInvoices = async () => {
    try {
      const res = await api.generateMonthlyInvoices();
      alert(res.message);
      loadAllData();
    } catch (err: any) {
      alert("Error generating invoices: " + err.message);
    }
  };

  const handleDraftAgreement = async () => {
    if (!selectedTenancyForAgreement) {
      alert("Please select a tenant for agreement drafting.");
      return;
    }
    try {
      const res = await api.draftAgreement({
        tenancy_id: selectedTenancyForAgreement,
        state_code: selectedStateCode,
      });
      alert("Agreement draft generated successfully with state stamp duty calculation!");
      loadAllData();
    } catch (err: any) {
      alert("Error drafting agreement: " + err.message);
    }
  };

  const handleSendESign = async (agrId: string) => {
    try {
      const res = await api.sendForESign(agrId);
      alert(res.message);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleSignAgreement = async (agrId: string) => {
    try {
      const res = await api.signAgreement(agrId);
      alert(res.message);
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleResolveComplaint = async (cId: string) => {
    try {
      await api.updateComplaintStatus(cId, "RESOLVED", "Technician repaired and verified.");
      alert("Complaint marked as Resolved!");
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.property_id || !enrollForm.tenant_email || !enrollForm.start_date) {
      alert("Please select a property, enter student email, and select start date.");
      return;
    }
    setEnrollSubmitting(true);
    setEnrollSuccessMessage("");
    try {
      const res = await api.enrollTenant({
        property: enrollForm.property_id,
        bed: enrollForm.bed_id ? Number(enrollForm.bed_id) : undefined,
        tenant_name: enrollForm.tenant_name,
        tenant_email: enrollForm.tenant_email,
        tenant_phone: enrollForm.tenant_phone,
        start_date: enrollForm.start_date,
        monthly_rent: enrollForm.monthly_rent ? Number(enrollForm.monthly_rent) : undefined,
        security_deposit_paid: enrollForm.security_deposit_paid ? Number(enrollForm.security_deposit_paid) : 0,
      });
      if (res.success) {
        setEnrollSuccessMessage(res.message || "Student / Tenant enrolled successfully!");
        loadAllData();
        setTimeout(() => {
          setEnrollModalOpen(false);
          setEnrollSuccessMessage("");
          setEnrollForm({
            tenant_name: "",
            tenant_email: "",
            tenant_phone: "",
            property_id: "",
            bed_id: "",
            start_date: new Date().toISOString().split("T")[0],
            monthly_rent: "",
            security_deposit_paid: "",
            college_company: "",
            food_opt_in: true,
          });
        }, 1500);
      } else {
        alert(res.error?.message || "Failed to enroll tenant.");
      }
    } catch (err: any) {
      alert("Enrollment failed: " + err.message);
    } finally {
      setEnrollSubmitting(false);
    }
  };

  // Compute available beds for selected property
  const selectedPropertyObj = properties.find((p) => p.id === enrollForm.property_id);
  const availableBeds: { id: number; label: string; rent: number; deposit: number }[] = [];
  if (selectedPropertyObj?.buildings) {
    selectedPropertyObj.buildings.forEach((bldg: any) => {
      bldg.floors?.forEach((fl: any) => {
        fl.rooms?.forEach((rm: any) => {
          rm.beds?.forEach((bd: any) => {
            if (bd.status === "AVAILABLE") {
              availableBeds.push({
                id: bd.id,
                label: `Room ${rm.room_number} (${rm.room_type}) • Bed ${bd.bed_identifier} — ₹${Number(bd.rent_amount).toLocaleString("en-IN")}/mo`,
                rent: Number(bd.rent_amount),
                deposit: Number(bd.deposit_amount),
              });
            }
          });
        });
      });
    });
  }

  const summary = metrics?.summary || {
    total_properties: 3,
    total_rooms: 4,
    total_beds: 5,
    occupied_beds: 1,
    vacant_beds: 4,
    occupancy_rate: 20.0,
    total_billed: 14650,
    total_collected: 14000,
    total_pending: 14650,
    new_leads: 1,
    open_complaints: 1,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Dashboard Topbar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {metrics?.organization?.name || "Gujarat Royal Stays & Co-Living Group"}
              </span>
              <span className="text-xs text-slate-400">
                {metrics?.organization?.city ? `${metrics.organization.city}, ${metrics.organization.state || "GJ"}` : "Vadodara, Gujarat"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
              Owner Operating Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateInvoices}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate Monthly Invoices</span>
            </button>
            <button
              onClick={loadAllData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto text-xs font-semibold scrollbar-none">
          {[
            { id: "overview", label: "KPI Overview" },
            { id: "properties", label: `Properties & Beds (${summary.total_beds})` },
            { id: "tenancies", label: `Active Tenants (${tenancies.length})` },
            { id: "agreements", label: `Agreements & eSign (${agreements.length})` },
            { id: "invoices", label: `Invoices & Rent (${invoices.length})` },
            { id: "leads", label: `Leads CRM (${leads.length})` },
            { id: "complaints", label: `Complaints (${complaints.length})` },
            { id: "referrals", label: "Refer & Earn" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 transition shrink-0 ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 font-bold bg-slate-800/50"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Occupancy</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{summary.occupancy_rate}%</span>
            <span className="text-[11px] text-slate-500">{summary.occupied_beds} / {summary.total_beds} Beds Filled</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Properties</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{summary.total_properties}</span>
            <span className="text-[11px] text-slate-500">{summary.total_rooms} Managed Rooms</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Monthly Invoiced</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">₹{Number(summary.total_billed).toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-slate-500">Current Rent Roll</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Collected</span>
            <span className="text-2xl font-black text-emerald-700 block mt-1">₹{Number(summary.total_collected).toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-emerald-600 font-medium">Reconciled to Bank</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Rent</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">₹{Number(summary.total_pending).toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-slate-500">Due this month</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">New Leads</span>
            <span className="text-2xl font-black text-sky-600 block mt-1">{summary.new_leads}</span>
            <span className="text-[11px] text-slate-500">{summary.open_complaints} Open Complaints</span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions Bar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Quick Operations</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setActiveTab("tenancies");
                      setEnrollModalOpen(true);
                    }}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition text-center col-span-2 sm:col-span-1"
                  >
                    <Plus className="w-5 h-5 mx-auto mb-1 text-white" />
                    <span>+ Enroll Student</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("properties")}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl border border-slate-200 transition text-center"
                  >
                    <Building2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span>Manage Inventory</span>
                  </button>
                  <button
                    onClick={handleGenerateInvoices}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl border border-slate-200 transition text-center"
                  >
                    <IndianRupee className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span>Monthly Rent Roll</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("agreements")}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl border border-slate-200 transition text-center"
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span>Draft Agreement</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="p-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl border border-slate-200 transition text-center"
                  >
                    <Users className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    <span>Marketplace Leads</span>
                  </button>
                </div>
              </div>

              {/* Recent Pending Invoices */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Pending Rent Collection Roll</h3>
                  <button onClick={() => setActiveTab("invoices")} className="text-xs text-emerald-600 font-bold hover:underline">
                    View All Invoices
                  </button>
                </div>

                <div className="space-y-2">
                  {invoices.slice(0, 3).map((inv: any) => (
                    <div key={inv.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{inv.tenant_name || inv.tenant_email}</span>
                        <span className="text-[11px] text-slate-500 block">{inv.property_title} • Room {inv.room_number || "201"}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900">₹{Number(inv.total_amount).toLocaleString("en-IN")}</span>
                        <span className={`block text-[10px] font-bold uppercase ${inv.status === "PAID" ? "text-emerald-600" : "text-amber-600"}`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ekrar AI Live Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl space-y-4 border border-emerald-800">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Bot className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase tracking-wider">Ekrar AI Live Analytics</span>
                </div>
                <h4 className="font-black text-lg text-white">Ask your rental business questions in Hindi or English</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Query real occupancy, pending dues, or prepare WhatsApp reminder blasts with strict confirmation safeguards.
                </p>
                <div className="pt-2">
                  <Link
                    href="#ai"
                    onClick={() => {
                      const btn = document.querySelector("button:has(.animate-pulse)") as HTMLButtonElement;
                      if (btn) btn.click();
                    }}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open Ekrar AI Assistant</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPERTIES & BEDS INVENTORY */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Property & Room Inventory Hierarchy</h2>
                <p className="text-xs text-slate-500">Live control of rooms and bed statuses to prevent double-booking across Gujarat</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/list-your-property"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ List Property in Gujarat</span>
                </Link>
              </div>
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-medium shrink-0">Filter City:</span>
              {["All", "Vadodara", "Ahmedabad", "Surat", "Bengaluru"].map((c) => {
                const count = c === "All" ? properties.length : properties.filter((p) => p.city === c).length;
                if (c !== "All" && count === 0) return null;
                return (
                  <button
                    key={c}
                    onClick={() => setCityFilter(c)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                      cityFilter === c
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    {c} ({count})
                  </button>
                );
              })}
            </div>

            {properties
              .filter((p) => cityFilter === "All" || p.city === cityFilter)
              .map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                      {p.verification_status === "VERIFIED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Admin Approved & Listed
                        </span>
                      )}
                      {(p.verification_status === "PENDING" || !p.verification_status) && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          ⏳ Pending Admin Approval
                        </span>
                      )}
                      {p.verification_status === "REJECTED" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                          ❌ Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{p.locality}, {p.city} • Starting ₹{Number(p.monthly_rent_starting).toLocaleString("en-IN")}/mo</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublish(p)}
                      title={p.verification_status !== "VERIFIED" ? "Listing must be approved by Admin before publishing" : "Toggle Marketplace Visibility"}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        p.verification_status !== "VERIFIED"
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                          : p.is_published
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {p.verification_status !== "VERIFIED" ? (
                        <><EyeOff className="w-3.5 h-3.5 text-amber-500" /> Awaiting Approval</>
                      ) : p.is_published ? (
                        <><Eye className="w-3.5 h-3.5" /> Marketplace Live</>
                      ) : (
                        <><EyeOff className="w-3.5 h-3.5" /> Draft Hidden</>
                      )}
                    </button>
                    {p.verification_status === "VERIFIED" ? (
                      <Link
                        href={`/properties/${p.slug}`}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1"
                      >
                        View Live Listing
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/properties/${p.id}`}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
                      >
                        Manage
                      </Link>
                    )}
                  </div>
                </div>

                {/* Status Notice Banner for Pending / Rejected */}
                {(p.verification_status === "PENDING" || !p.verification_status) && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Under Admin Review</strong>
                      <span>Your property details and request have been submitted to the Admin Panel. Once approved, the listing will be published on the live marketplace for prospective tenants.</span>
                    </div>
                  </div>
                )}
                {p.verification_status === "REJECTED" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Listing Rejected</strong>
                      <span>{p.ownership_verification_notes || "Please check property details and re-apply."}</span>
                    </div>
                  </div>
                )}

                {/* Buildings / Floors / Rooms Tree */}
                <div className="space-y-4">
                  {p.buildings?.map((bldg: any) => (
                    <div key={bldg.id} className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{bldg.name}</h4>

                      {bldg.floors?.map((fl: any) => (
                        <div key={fl.id} className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-200">
                          <span className="text-xs font-bold text-slate-700">{fl.name}</span>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {fl.rooms?.map((rm: any) => (
                              <div key={rm.id} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                                  <span>Room {rm.room_number}</span>
                                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">
                                    {rm.room_type}
                                  </span>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                  {rm.beds?.map((bd: any) => (
                                    <div
                                      key={bd.id}
                                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs border border-slate-100"
                                    >
                                      <div>
                                        <span className="font-bold text-slate-800">{bd.bed_identifier}</span>
                                        <span className="block text-[10px] text-slate-400">
                                          ₹{Number(bd.rent_amount).toLocaleString("en-IN")}/mo
                                        </span>
                                      </div>

                                      <button
                                        onClick={() => handleToggleBedStatus(bd.id, bd.status)}
                                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition ${
                                          bd.status === "AVAILABLE"
                                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                            : bd.status === "OCCUPIED"
                                            ? "bg-slate-200 text-slate-700 cursor-not-allowed"
                                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                        }`}
                                      >
                                        {bd.status}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: ACTIVE TENANCIES */}
        {activeTab === "tenancies" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Active Tenant & Student Records</h2>
                <p className="text-xs text-slate-500">Manage enrolled students, room & bed allocations, and rent contracts</p>
              </div>
              <button
                onClick={() => setEnrollModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Enroll Student / Tenant</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Tenant</th>
                    <th className="p-3">Property & Room</th>
                    <th className="p-3">Monthly Rent</th>
                    <th className="p-3">Deposit Paid</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenancies.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">
                        {t.tenant_details?.email}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {t.tenant_details?.phone_number || "9123456789"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800">{t.property_title}</span>
                        <span className="block text-[10px] text-slate-500">Room {t.room_number || "201"} • {t.bed_identifier || "Bed A"}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">₹{Number(t.monthly_rent).toLocaleString("en-IN")}</td>
                      <td className="p-3 text-slate-600">₹{Number(t.security_deposit_paid).toLocaleString("en-IN")}</td>
                      <td className="p-3 text-slate-500">{t.start_date}</td>
                      <td className="p-3">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: AGREEMENTS & ESIGN */}
        {activeTab === "agreements" && (
          <div className="space-y-6">
            {/* Agreement Generator Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>State Rental Agreement & eSign Engine</span>
              </h2>
              <p className="text-xs text-slate-500">
                Draft legal agreements compliant with Indian state stamp duty regulations (Karnataka, Maharashtra, Delhi, etc.)
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <select
                  value={selectedTenancyForAgreement}
                  onChange={(e) => setSelectedTenancyForAgreement(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  <option value="">Select Active Tenant...</option>
                  {tenancies.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tenant_details?.email} ({t.property_title})
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStateCode}
                  onChange={(e) => setSelectedStateCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none font-semibold"
                >
                  <option value="GJ">Gujarat (Stamp Duty: ₹300 - Gujarat Stamp Act)</option>
                  <option value="MH">Maharashtra (Stamp Duty: ₹500)</option>
                  <option value="KA">Karnataka (Stamp Duty: ₹100)</option>
                  <option value="DL">Delhi NCR (Stamp Duty: ₹100)</option>
                  <option value="TN">Tamil Nadu (Stamp Duty: ₹100)</option>
                  <option value="TS">Telangana (Stamp Duty: ₹100)</option>
                </select>

                <button
                  onClick={handleDraftAgreement}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Generate Legal Draft
                </button>
              </div>
            </div>

            {/* Agreements Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Executed & Pending Agreements</h3>

              <div className="space-y-3">
                {agreements.length === 0 ? (
                  <p className="text-xs text-slate-400">No agreements generated yet. Select a tenant above to draft one.</p>
                ) : (
                  agreements.map((a) => (
                    <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{a.agreement_number}</span>
                        <span className="text-[11px] text-slate-500 block">
                          State: {a.state_code} • Stamp Duty: ₹{a.stamp_duty_amount} • Fee: ₹{a.total_agreement_fee}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Status: <b className="uppercase text-emerald-700">{a.status}</b>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {a.status === "DRAFT" && (
                          <button
                            onClick={() => handleSendESign(a.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                          >
                            Dispatch for eSign
                          </button>
                        )}

                        {a.status === "PENDING_TENANT_SIGN" && (
                          <button
                            onClick={() => handleSignAgreement(a.id)}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition"
                          >
                            Sign as Landlord
                          </button>
                        )}

                        {a.final_pdf && (
                          <a
                            href={a.final_pdf}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs flex items-center gap-1 hover:bg-slate-800"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: INVOICES & BILLING */}
        {activeTab === "invoices" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Monthly Rent Invoices & Receipts</h2>
                <p className="text-xs text-slate-500">Itemized invoices with base rent, maintenance, and sub-meter electricity</p>
              </div>
              <button
                onClick={handleGenerateInvoices}
                className="px-3.5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition"
              >
                + Run Current Month Invoices
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Tenant & Property</th>
                    <th className="p-3">Period</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Paid Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{inv.invoice_number}</td>
                      <td className="p-3 font-medium text-slate-700">
                        {inv.tenant_name || inv.tenant_email}
                        <span className="text-[10px] text-slate-400 block">{inv.property_title}</span>
                      </td>
                      <td className="p-3 text-slate-600">{inv.billing_month}/{inv.billing_year}</td>
                      <td className="p-3 font-bold text-slate-900">₹{Number(inv.total_amount).toLocaleString("en-IN")}</td>
                      <td className="p-3 font-bold text-emerald-700">₹{Number(inv.paid_amount).toLocaleString("en-IN")}</td>
                      <td className="p-3">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          inv.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={async () => {
                            const res = await api.generateReceipt(inv.id);
                            if (res.receipt_url) window.open(res.receipt_url, "_blank");
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-[11px] flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: LEADS CRM */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Inbound Marketplace Leads</h2>
            <div className="space-y-3">
              {leads.map((ld) => (
                <div key={ld.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{ld.name}</span>
                    <span className="text-slate-500 block text-[11px]">Phone: {ld.phone} • Email: {ld.email || "N/A"}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Property: {ld.property_title} • Notes: {ld.notes || "None"}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-sky-100 text-sky-800">
                    {ld.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Maintenance Tickets Queue</h2>
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {c.urgency}
                      </span>
                    </div>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      Category: {c.category} • {c.property_title} (Room {c.room_number || "201"})
                    </span>
                    <p className="text-slate-600 mt-1 text-[11px]">{c.description}</p>
                  </div>

                  {c.status !== "RESOLVED" && c.status !== "CLOSED" ? (
                    <button
                      onClick={() => handleResolveComplaint(c.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-1 rounded">
                      Resolved
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: REFERRALS */}
        {activeTab === "referrals" && referral && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6 max-w-2xl mx-auto text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Refer Landlords & Earn Credits</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Share your unique link with other PG owners or landlords. Receive ₹500 subscription credits for every verified onboarding!
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-700 font-bold">{referral.referral_url}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(referral.referral_url);
                  alert("Referral link copied to clipboard!");
                }}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs"
              >
                Copy Link
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Total Clicks</span>
                <span className="font-bold text-lg text-slate-800">{referral.total_clicks}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Signups</span>
                <span className="font-bold text-lg text-slate-800">{referral.total_signups}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Earned</span>
                <span className="font-bold text-lg text-emerald-600">₹{referral.total_rewards_earned || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* ENROLL STUDENT / TENANT MODAL */}
        {enrollModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Enroll Student / Resident</h3>
                    <p className="text-[11px] text-slate-500">PG & Hostel Admission Allotment</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {enrollSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{enrollSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
                {/* 1. Student / Resident Information */}
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">1. Student / Resident Info</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={enrollForm.tenant_name}
                        onChange={(e) => setEnrollForm({ ...enrollForm, tenant_name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Mobile Number (+91) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={enrollForm.tenant_phone}
                        onChange={(e) => setEnrollForm({ ...enrollForm, tenant_phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. aarav.sharma@gmail.com"
                        value={enrollForm.tenant_email}
                        onChange={(e) => setEnrollForm({ ...enrollForm, tenant_email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">College / Work Institution</label>
                      <input
                        type="text"
                        placeholder="e.g. MSU Baroda / Parul Univ"
                        value={enrollForm.college_company}
                        onChange={(e) => setEnrollForm({ ...enrollForm, college_company: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Property & Room Allocation */}
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="font-bold text-[11px] text-slate-400 uppercase tracking-wider block">2. Property & Bed Allocation</span>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Select Property / PG *</label>
                    <select
                      required
                      value={enrollForm.property_id}
                      onChange={(e) => {
                        setEnrollForm({
                          ...enrollForm,
                          property_id: e.target.value,
                          bed_id: "",
                          monthly_rent: "",
                          security_deposit_paid: "",
                        });
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                    >
                      <option value="">Choose Property...</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.locality}, {p.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  {enrollForm.property_id && (
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Select Available Bed</label>
                      <select
                        value={enrollForm.bed_id}
                        onChange={(e) => {
                          const chosenId = e.target.value;
                          const bdObj = availableBeds.find((b) => b.id.toString() === chosenId);
                          setEnrollForm({
                            ...enrollForm,
                            bed_id: chosenId,
                            monthly_rent: bdObj ? bdObj.rent.toString() : enrollForm.monthly_rent,
                            security_deposit_paid: bdObj ? bdObj.deposit.toString() : enrollForm.security_deposit_paid,
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                      >
                        <option value="">Select Bed (or assign later)...</option>
                        {availableBeds.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                      {availableBeds.length === 0 && (
                        <span className="text-[10px] text-amber-600 block mt-1">
                          No vacant beds configured for this property. You can still enroll the resident.
                        </span>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Monthly Rent (₹) *</label>
                      <input
                        type="number"
                        required
                        placeholder="8500"
                        value={enrollForm.monthly_rent}
                        onChange={(e) => setEnrollForm({ ...enrollForm, monthly_rent: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Deposit Paid (₹)</label>
                      <input
                        type="number"
                        placeholder="17000"
                        value={enrollForm.security_deposit_paid}
                        onChange={(e) => setEnrollForm({ ...enrollForm, security_deposit_paid: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Admission Date *</label>
                      <input
                        type="date"
                        required
                        value={enrollForm.start_date}
                        onChange={(e) => setEnrollForm({ ...enrollForm, start_date: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEnrollModalOpen(false)}
                    className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={enrollSubmitting}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {enrollSubmitting ? (
                      <span>Enrolling...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Enroll</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
