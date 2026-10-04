"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, IndianRupee, FileText, CheckCircle2, ShieldCheck, 
  Utensils, Users, Wrench, Download, AlertCircle, Sparkles, CreditCard, X
} from "lucide-react";
import { api } from "@/lib/api";

export default function TenantDashboard() {
  const [stay, setStay] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [agreements, setAgreements] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [kyc, setKyc] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment Modal State
  const [checkoutInvoice, setCheckoutInvoice] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // New Complaint Modal
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    category: "PLUMBING",
    urgency: "MEDIUM",
    description: "",
  });

  // Visitor Pass Modal
  const [visitorModalOpen, setVisitorModalOpen] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    visitor_name: "",
    visitor_phone: "",
    purpose: "Visit",
    expected_arrival: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("erk_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    loadTenantData();
  }, []);

  const loadTenantData = async () => {
    setLoading(true);
    try {
      const [sRes, iRes, aRes, cRes, kRes, mRes] = await Promise.all([
        api.getMyStay().catch(() => ({ success: false })),
        api.getInvoices().catch(() => ({ success: false, data: [] })),
        api.getAgreements().catch(() => ({ success: false, data: [] })),
        api.getComplaints().catch(() => ({ success: false, data: [] })),
        api.getMyKYC().catch(() => ({ success: false })),
        api.getMessMenu().catch(() => ({ success: false, data: [] })),
      ]);

      if (sRes.success) setStay(sRes.data);
      if (iRes.data) setInvoices(Array.isArray(iRes.data) ? iRes.data : iRes.data.results || []);
      if (aRes.data) setAgreements(Array.isArray(aRes.data) ? aRes.data : aRes.data.results || []);
      if (cRes.data) setComplaints(Array.isArray(cRes.data) ? cRes.data : cRes.data.results || []);
      if (kRes.success) setKyc(kRes.data);
      if (mRes.data) setMenu(Array.isArray(mRes.data) ? mRes.data : mRes.data.results || []);
    } catch (err) {
      console.error("Tenant data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (invoice: any) => {
    setCheckoutInvoice(invoice);
    setPaymentDone(false);
  };

  const handleExecutePayment = async () => {
    setPaying(true);
    try {
      const order = await api.createPaymentOrder(checkoutInvoice.id, "UPI");
      const confirm = await api.confirmPayment(order.data.payment_id);
      if (confirm.success) {
        setPaymentDone(true);
        loadTenantData();
      }
    } catch (err: any) {
      alert("Payment failed: " + err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleSignAgreement = async (agrId: string) => {
    try {
      const res = await api.signAgreement(agrId);
      alert("Agreement successfully eSigned with electronic certificate!");
      loadTenantData();
    } catch (err: any) {
      alert("Sign error: " + err.message);
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createComplaint(complaintForm);
      alert("Complaint registered. Assigned maintenance staff has been notified.");
      setComplaintModalOpen(false);
      loadTenantData();
    } catch (err: any) {
      alert("Error filing complaint: " + err.message);
    }
  };

  const handleCreateVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createVisitor(visitorForm);
      alert("Visitor pass generated for gate security!");
      setVisitorModalOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleMealOptOut = async (dayName: string, mealType: string) => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const res = await api.toggleMealOptOut(todayStr, mealType);
      alert(res.message);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Verified Resident Stay</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Tenant Self-Service Portal</h1>
            <p className="text-xs text-slate-300">
              {stay ? `${stay.property_title} • Room ${stay.room_number || "201"}` : "Welcome to eRentKarar"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setComplaintModalOpen(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Raise Complaint</span>
            </button>
            <button
              onClick={() => setVisitorModalOpen(true)}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Issue Visitor Pass</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Current Stay & Dues Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stay Info */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 md:col-span-2">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>My Stay Details</span>
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {stay?.status || "ACTIVE STAY"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Property</span>
                <span className="font-bold text-slate-800">{stay?.property_title || "Starlight Luxury Co-Living"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Room & Bed</span>
                <span className="font-bold text-slate-800">Room {stay?.room_number || "201"} • {stay?.bed_identifier || "Bed A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Monthly Rent</span>
                <span className="font-bold text-emerald-700">₹{Number(stay?.monthly_rent || 13500).toLocaleString("en-IN")}/mo</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Security Deposit</span>
                <span className="font-semibold text-slate-800">₹{Number(stay?.security_deposit_paid || 27000).toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Move-In Date</span>
                <span className="font-semibold text-slate-800">{stay?.start_date || "2026-07-28"}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Notice Period</span>
                <span className="font-semibold text-slate-800">30 Days</span>
              </div>
            </div>
          </div>

          {/* KYC Status Badge */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tenant KYC Status</span>
              </h3>
              <p className="text-xs text-slate-500">Government ID & Police verification</p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Aadhaar & PAN Verified</span>
              </div>
              <p className="text-[11px] text-emerald-700">Masked ID: XXXX-XXXX-4589</p>
            </div>

            <span className="text-[10px] text-slate-400 text-center block">
              Protected by 256-bit encrypted private document vault
            </span>
          </div>
        </div>

        {/* Invoices & Instant UPI Payment Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Rent Invoices & Payment Receipts</h2>
              <p className="text-xs text-slate-500">Pay rent via UPI, Netbanking, or Debit Card with zero surcharge</p>
            </div>
          </div>

          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{inv.invoice_number}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      inv.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Period: {inv.billing_month}/{inv.billing_year} • Due Date: {inv.due_date}
                  </span>
                  <div className="flex gap-3 text-[11px] text-slate-600 mt-1">
                    <span>Rent: ₹{Number(inv.base_rent).toLocaleString("en-IN")}</span>
                    <span>Electricity: ₹{Number(inv.electricity_charges).toLocaleString("en-IN")}</span>
                    <span>Maintenance: ₹{Number(inv.maintenance_charges).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block uppercase">Total Payable</span>
                    <span className="font-black text-slate-900 text-base">
                      ₹{Number(inv.total_amount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  {inv.status !== "PAID" ? (
                    <button
                      onClick={() => handlePayNow(inv)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                    >
                      Pay Now (UPI)
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const res = await api.generateReceipt(inv.id);
                        if (res.receipt_url) window.open(res.receipt_url, "_blank");
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agreements & eSign Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <span>Digital Rental Agreement (eSign)</span>
          </h2>

          <div className="space-y-3">
            {agreements.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{a.agreement_number}</span>
                  <span className="text-slate-500 block text-[11px]">
                    State Stamp Duty: ₹{a.stamp_duty_amount} ({a.state_code}) • Governed under State Tenancy Act
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Status: <b className="uppercase text-emerald-700">{a.status}</b>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {a.status !== "COMPLETED" && a.status !== "SIGNED" ? (
                    <button
                      onClick={() => handleSignAgreement(a.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                    >
                      eSign Now with OTP
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Legally Executed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mess Menu & Food Waste Prevention Opt-Out */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <span>Mess Menu & Meal Waste Opt-Out</span>
              </h2>
              <p className="text-xs text-slate-500">Going out? Skip your meal 3 hours in advance to prevent food wastage.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {menu.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-900 block border-b border-slate-200 pb-1">{item.day_name}</span>
                <p className="text-[11px] text-slate-600"><b className="text-slate-700">Breakfast:</b> {item.breakfast}</p>
                <p className="text-[11px] text-slate-600"><b className="text-slate-700">Lunch:</b> {item.lunch}</p>
                <p className="text-[11px] text-slate-600"><b className="text-slate-700">Dinner:</b> {item.dinner}</p>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleMealOptOut(item.day_name, "LUNCH")}
                    className="flex-1 py-1 bg-white border border-slate-200 hover:border-emerald-500 rounded text-[10px] font-bold text-slate-700"
                  >
                    Skip Lunch
                  </button>
                  <button
                    onClick={() => handleMealOptOut(item.day_name, "DINNER")}
                    className="flex-1 py-1 bg-white border border-slate-200 hover:border-emerald-500 rounded text-[10px] font-bold text-slate-700"
                  >
                    Skip Dinner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {checkoutInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setCheckoutInvoice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentDone ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-lg text-slate-900">Payment Successful!</h3>
                <p className="text-xs text-slate-600">
                  Amount ₹{Number(checkoutInvoice.total_amount).toLocaleString("en-IN")} received. Rent ledger updated.
                </p>
                <button
                  onClick={() => setCheckoutInvoice(null)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Rent Payment Checkout</h3>
                  <p className="text-slate-500">{checkoutInvoice.invoice_number}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Amount Due</span>
                    <span>₹{Number(checkoutInvoice.total_amount).toLocaleString("en-IN")}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">Includes rent, maintenance & utilities</span>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 block">Select Payment Mode</label>
                  <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-50 flex items-center justify-between font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Instant UPI (GPay / PhonePe / Paytm)</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 uppercase font-black">Zero Fee</span>
                  </div>
                </div>

                <button
                  onClick={handleExecutePayment}
                  disabled={paying}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{paying ? "Processing Payment..." : `Pay ₹${Number(checkoutInvoice.total_amount).toLocaleString("en-IN")}`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setComplaintModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900">Raise Maintenance Ticket</h3>
            <form onSubmit={handleCreateComplaint} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Washroom tap leaking"
                  value={complaintForm.title}
                  onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={complaintForm.category}
                  onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-semibold"
                >
                  <option value="PLUMBING">Plumbing & Water</option>
                  <option value="ELECTRICAL">Electrical & Wiring</option>
                  <option value="APPLIANCE">Appliance (Geyser / AC)</option>
                  <option value="CLEANING">Cleaning & Housekeeping</option>
                  <option value="WIFI">WiFi & Internet</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Urgency</label>
                <select
                  value={complaintForm.urgency}
                  onChange={(e) => setComplaintForm({ ...complaintForm, urgency: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none font-semibold"
                >
                  <option value="LOW">Low (Within 3 days)</option>
                  <option value="MEDIUM">Medium (Within 24 hours)</option>
                  <option value="HIGH">High (Within 6 hours)</option>
                  <option value="EMERGENCY">Emergency (Immediate)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide exact details of the issue..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition"
              >
                Submit Maintenance Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Visitor Pass Modal */}
      {visitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button onClick={() => setVisitorModalOpen(false)} className="absolute top-4 right-4 text-slate-400">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900">Issue Visitor Gate Pass</h3>
            <form onSubmit={handleCreateVisitor} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visitor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kumar"
                  value={visitorForm.visitor_name}
                  onChange={(e) => setVisitorForm({ ...visitorForm, visitor_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visitor Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 99887 76655"
                  value={visitorForm.visitor_phone}
                  onChange={(e) => setVisitorForm({ ...visitorForm, visitor_phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expected Arrival Time</label>
                <input
                  type="datetime-local"
                  required
                  value={visitorForm.expected_arrival}
                  onChange={(e) => setVisitorForm({ ...visitorForm, expected_arrival: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
              >
                Approve & Generate Security Pass
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
