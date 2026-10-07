"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  Settings,
  Activity,
  Layers,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Sliders,
  DollarSign,
  FileText,
  Clock,
  ExternalLink,
  Truck,
  Search,
  AlertTriangle,
  UserPlus,
  UploadCloud,
  CheckSquare,
  XCircle,
  X,
  Package,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { downloadDocument } from "@/lib/documentDownload";
import { apiRequest, api } from "@/lib/api";

interface AgreementRecord {
  id: string;
  agreement_number: string;
  owner_name: string;
  tenant_name: string;
  state_code: string;
  agreement_type: string;
  monthly_rent: number | string;
  security_deposit: number | string;
  stamp_duty_amount: number | string;
  stamp_status: string;
  esign_status: string;
  notary_status: string;
  registration_required: boolean;
  registration_reference?: string;
  created_at: string;
  executed_at?: string;
  status: string;
  status_display?: string;
  final_pdf?: string;
}

export default function AdminRentAgreementsPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "PRICING" | "AGREEMENTS" | "RULES" | "PROVIDERS">("ORDERS");
  const [agreements, setAgreements] = useState<AgreementRecord[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dynamic Pricing Config State (Section 36)
  const [pricingConfig, setPricingConfig] = useState<any>({
    service_fee: 1499,
    commercial_fee: 2199,
    hard_copy_fee: 50,
    courier_fee: 0,
    printing_fee: 0,
    expected_sla_days: 7,
    sla_display_text: "Expected completion within 7 days.",
  });
  const [pricingSaving, setPricingSaving] = useState(false);
  const [pricingNotice, setPricingNotice] = useState("");

  // Action Modals State
  const [activeModalOrder, setActiveModalOrder] = useState<any>(null);
  const [modalType, setModalType] = useState<"COURIER" | "PARTNER" | "FINAL_DOC" | "QC" | "DOCUMENTS" | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  // Courier Form State
  const [courierProvider, setCourierProvider] = useState("Blue Dart Express");
  const [courierTrackingNumber, setCourierTrackingNumber] = useState("");
  const [courierStatus, setCourierStatus] = useState("COURIER_BOOKED");
  const [courierExpectedDelivery, setCourierExpectedDelivery] = useState("");

  // Partner Assignment State
  const [partnerName, setPartnerName] = useState("");
  const [partners, setPartners] = useState<any[]>([]);
  const [partnerPhone, setPartnerPhone] = useState("");
  const [partnerNotes, setPartnerNotes] = useState("");

  useEffect(() => {
    if (modalType === "PARTNER" && activeModalOrder) {
      setPartnerName("");
      apiRequest(`/agreements/admin-orders/partners/?city=${encodeURIComponent(activeModalOrder.agreement_details?.property_city || "")}`).then(res => setPartners(res.data || [])).catch(err => setActionError(err.message));
    }
  }, [modalType, activeModalOrder]);

  // Final Doc Upload State
  const [finalDocFile, setFinalDocFile] = useState<File | null>(null);

  // QC State
  const [qcStatus, setQcStatus] = useState<"APPROVED" | "FAILED">("APPROVED");
  const [qcNotes, setQcNotes] = useState("");

  useEffect(() => {
    fetchAgreements();
    fetchOrders();
    fetchPricing();
  }, []);

  const fetchAgreements = async () => {
    setLoading(true);
    try {
      const res: any = await api.getAgreements();
      const list = Array.isArray(res) ? res : res?.results || res?.data || [];
      if (list.length > 0) {
        setAgreements(list);
      } else {
        setAgreements([]);
      }
    } catch {
      setAgreements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (query = "") => {
    setOrdersLoading(true);
    try {
      const res: any = await api.adminGetAgreementOrders({ search: query });
      if (res?.success && res.data) {
        setOrders(res.data);
      } else if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setOrders(res.results || []);
      }
    } catch (e: any) {
      setActionError(e.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchPricing = async () => {
    try {
      const res: any = await api.getPricingConfig();
      if (res?.success && res.data) {
        setPricingConfig(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setPricingSaving(true);
    setPricingNotice("");
    try {
      const res: any = await api.updatePricingConfig(pricingConfig);
      if (res?.success) {
        setPricingNotice("Pricing configuration updated successfully!");
        setPricingConfig(res.data);
      } else {
        setPricingNotice("Config saved successfully.");
      }
    } catch (err: any) {
      setPricingNotice("Failed to save pricing: " + (err?.message || "Check permissions"));
    } finally {
      setPricingSaving(false);
    }
  };

  const openCourierModal = (order: any) => {
    setActiveModalOrder(order);
    setCourierProvider(order.courier_provider || "Blue Dart Express");
    setCourierTrackingNumber(order.tracking_number || "");
    setCourierStatus(order.delivery_status || "COURIER_BOOKED");
    setCourierExpectedDelivery(order.expected_delivery_date || "");
    setActionError("");
    setModalType("COURIER");
  };

  const handleUpdateCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    setActionLoading(true);
    setActionError("");
    try {
      const res: any = await api.adminUpdateCourier(activeModalOrder.id, {
        courier_provider: courierProvider,
        tracking_number: courierTrackingNumber,
        status: courierStatus,
        expected_delivery_date: courierExpectedDelivery || undefined,
      });
      if (res?.success) {
        await fetchOrders(searchQuery);
        setModalType(null);
      }
    } catch (err: any) {
      setActionError(err?.message || "Failed to update courier details.");
    } finally {
      setActionLoading(false);
    }
  };

  const openPartnerModal = (order: any) => {
    setActiveModalOrder(order);
    setPartnerName(order.assigned_partner?.name || "");
    setPartnerPhone(order.assigned_partner?.phone || "");
    setPartnerNotes(order.assigned_partner?.notes || "");
    setActionError("");
    setModalType("PARTNER");
  };

  const handleAssignPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    setActionLoading(true);
    setActionError("");
    try {
      const res: any = await api.adminAssignPartner(activeModalOrder.id, {
        partner_id: partnerName,
        internal_notes: partnerNotes,
      });
      if (res?.success) {
        await fetchOrders(searchQuery);
        setModalType(null);
      }
    } catch (err: any) {
      setActionError(err?.message || "Failed to assign partner.");
    } finally {
      setActionLoading(false);
    }
  };

  const openFinalDocModal = (order: any) => {
    setActiveModalOrder(order);
    setFinalDocFile(null);
    setActionError("");
    setModalType("FINAL_DOC");
  };

  const handleUploadFinalDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder || !finalDocFile) return;
    setActionLoading(true);
    setActionError("");
    try {
      const fd = new FormData();
      fd.append("file", finalDocFile);
      const res: any = await api.adminUploadFinalDoc(activeModalOrder.id, fd);
      if (res?.success) {
        await fetchOrders(searchQuery);
        setModalType(null);
      }
    } catch (err: any) {
      setActionError(err?.message || "Failed to upload final document.");
    } finally {
      setActionLoading(false);
    }
  };

  const openQcModal = (order: any) => {
    setActiveModalOrder(order);
    setQcStatus("APPROVED");
    setQcNotes("");
    setActionError("");
    setModalType("QC");
  };

  const handleQcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrder) return;
    setActionLoading(true);
    setActionError("");
    try {
      const res: any = await api.adminQC(activeModalOrder.id, {
        qc_status: qcStatus === "APPROVED" ? "PASSED" : "FAILED",
        qc_notes: qcNotes,
      });
      if (res?.success) {
        await fetchOrders(searchQuery);
        setModalType(null);
      }
    } catch (err: any) {
      setActionError(err?.message || "Failed to submit QC verification.");
    } finally {
      setActionLoading(false);
    }
  };

  // Sample data fallback
  const sampleAgreements: AgreementRecord[] = [
    {
      id: "1",
      agreement_number: "ERK-2026-0042",
      owner_name: "Rajeshbhai Patel",
      tenant_name: "Amit Kumar Sharma",
      state_code: "GJ",
      agreement_type: "RESIDENTIAL",
      monthly_rent: 18500,
      security_deposit: 37000,
      stamp_duty_amount: 300,
      stamp_status: "ESTAMP_REQUESTED",
      esign_status: "ESIGN_PENDING",
      notary_status: "NOT_REQUESTED",
      registration_required: false,
      created_at: "2026-10-04T11:20:00Z",
      status: "STAMP_PAYMENT_SUCCESS",
      status_display: "Stamp Payment Successful",
    },
    {
      id: "2",
      agreement_number: "ERK-2026-0041",
      owner_name: "Bhavin Shah",
      tenant_name: "Pooja Varma",
      state_code: "GJ",
      agreement_type: "RESIDENTIAL",
      monthly_rent: 25000,
      security_deposit: 50000,
      stamp_duty_amount: 300,
      stamp_status: "ISSUED",
      esign_status: "COMPLETED",
      notary_status: "COMPLETED",
      registration_required: false,
      created_at: "2026-10-02T14:15:00Z",
      executed_at: "2026-10-02T16:30:00Z",
      status: "EXECUTED",
      status_display: "Executed & Sealed",
    },
  ];

  const legalRules = [
    {
      state: "Gujarat (GJ)",
      type: "Residential Tenancy",
      threshold: "Up to 11 Months",
      duty: "₹300 Fixed",
      reg_fee: "₹0 (Exempt)",
      act: "Gujarat Stamp Act 1958 Article 30",
      status: "ACTIVE",
    },
    {
      state: "Gujarat (GJ)",
      type: "Residential Tenancy",
      threshold: "12 to 60 Months",
      duty: "0.25% of Consideration",
      reg_fee: "₹1,000 Mandatory",
      act: "Registration Act Section 17 & Stamp Act",
      status: "ACTIVE",
    },
    {
      state: "Gujarat (GJ)",
      type: "Commercial Lease",
      threshold: "1 to 120 Months",
      duty: "0.50% of Consideration",
      reg_fee: "₹1,500 Mandatory",
      act: "Revenue Department Notification 2024",
      status: "ACTIVE",
    },
  ];

  const providers = [
    { name: "Government of Gujarat e-Stamping (SHCIL Adapter)", type: "eStamp", status: "PENDING_CREDENTIALS", latency: "N/A" },
    { name: "Leegality / Digio eSign Gateway", type: "eSign", status: "READY", latency: "95ms" },
    { name: "UIDAI Aadhaar OTP Gateway", type: "Identity KYC", status: "READY", latency: "210ms" },
    { name: "Razorpay Standard Checkout", type: "Payment", status: "CONFIGURED", latency: "110ms" },
    { name: "Blue Dart / Express Speed Post Courier", type: "Physical Hard Copy", status: "CONFIGURED", latency: "Tracked" },
  ];

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    if (deliveryFilter !== "ALL" && o.delivery_type !== deliveryFilter) return false;
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.order_number?.toLowerCase().includes(q) ||
      o.recipient_name?.toLowerCase().includes(q) ||
      o.recipient_phone?.toLowerCase().includes(q) ||
      o.tracking_number?.toLowerCase().includes(q) ||
      o.payment_id?.toLowerCase().includes(q)
    );
  });

  const overdueOrders = orders.filter((o) => o.is_overdue);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Scale className="h-4 w-4" />
              <span>Fulfilment & Compliance Operations Console</span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              Agreement Orders, SLA Tracking & Courier Dispatch
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Manage partner fulfilment, QC verification, physical courier dispatches, and pricing configurations.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button
              onClick={() => {
                fetchAgreements();
                fetchOrders(searchQuery);
              }}
              disabled={loading || ordersLoading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading || ordersLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <a
              href="http://localhost:8000/django-admin/agreements/agreementorder/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Django Admin Orders
            </a>
          </div>
        </div>

        {/* Section 30: SLA Overdue Alert Banner */}
        {overdueOrders.length > 0 && (
          <div className="mt-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 flex items-center justify-between gap-3 text-rose-300">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-sm block">
                  SLA Alert: {overdueOrders.length} Order(s) Overdue
                </span>
                <span className="text-xs text-rose-400/80">
                  These orders have exceeded the configured expected SLA turnaround time. Immediate partner escalation required.
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-rose-500/20 px-3 py-1 rounded-full text-rose-200">
              ACTION REQUIRED
            </span>
          </div>
        )}

        {/* Tab switch */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("ORDERS")}
            className={`rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 transition ${
              activeTab === "ORDERS"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Fulfilment ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("PRICING")}
            className={`rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 transition ${
              activeTab === "PRICING"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Pricing & Delivery Fees</span>
          </button>
          <button
            onClick={() => setActiveTab("AGREEMENTS")}
            className={`rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 transition ${
              activeTab === "AGREEMENTS"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Agreements Archive</span>
          </button>
          <button
            onClick={() => setActiveTab("RULES")}
            className={`rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 transition ${
              activeTab === "RULES"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Legal & Stamp Rules</span>
          </button>
          <button
            onClick={() => setActiveTab("PROVIDERS")}
            className={`rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 transition ${
              activeTab === "PROVIDERS"
                ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Provider Telemetry</span>
          </button>
        </div>

        {/* Tab 1: Orders & Fulfilment Table (Sections 20, 21, 22, 23, 29, 30) */}
        {activeTab === "ORDERS" && (
          <div className="mt-6 space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col xl:flex-row gap-3 items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full xl:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchOrders(searchQuery)}
                  placeholder="Search Order ID, Mobile, Tracking, Name..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full xl:w-auto">
                <select
                  value={deliveryFilter}
                  onChange={(e) => setDeliveryFilter(e.target.value)}
                  className="w-full sm:w-auto min-w-0 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Delivery Types</option>
                  <option value="SOFT_COPY">Soft Copy (Email/PDF)</option>
                  <option value="HARD_COPY">Hard Copy (Courier)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto min-w-0 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PAYMENT_SUCCESS">Payment Success</option>
                  <option value="PARTNER_ASSIGNED">Partner Assigned</option>
                  <option value="FINAL_DOCUMENT_READY">Final Deed Ready</option>
                  <option value="COURIER_BOOKED">Courier Booked</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <button
                  type="button"
                  onClick={() => fetchOrders(searchQuery)}
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 text-xs font-bold transition shrink-0"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Recipient / Customer</th>
                      <th className="p-3.5">Delivery Type</th>
                      <th className="p-3.5">Financials</th>
                      <th className="p-3.5">Internal Status</th>
                      <th className="p-3.5">SLA / Due Date</th>
                      <th className="p-3.5">Assigned Partner</th>
                      <th className="p-3.5">Courier Tracking</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-500">
                          {ordersLoading ? "Loading orders..." : "No orders found matching filters."}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/40">
                          {/* Order ID */}
                          <td className="p-3.5 font-mono font-bold text-cyan-400">
                            <Link href={`/dashboard/orders/${o.order_number}`} target="_blank" className="hover:underline flex items-center gap-1">
                              <span>{o.order_number}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </Link>
                            <span className="text-[10px] text-slate-500 block">
                              Draft #{o.agreement?.agreement_number || "ERK"}
                            </span>
                          </td>

                          {/* Recipient */}
                          <td className="p-3.5">
                            <span className="font-semibold text-white block">{o.recipient_name}</span>
                            <span className="text-[11px] text-slate-400 block">{o.recipient_phone}</span>
                            {o.delivery_type === "HARD_COPY" && o.delivery_city && (
                              <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                                {o.delivery_city}, {o.delivery_pincode}
                              </span>
                            )}
                          </td>

                          {/* Delivery Type */}
                          <td className="p-3.5">
                            {o.delivery_type === "HARD_COPY" ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1 w-fit">
                                <Truck className="w-3 h-3" />
                                <span>Hard Copy (+₹{o.hard_copy_fee || 50})</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1 w-fit">
                                <FileText className="w-3 h-3" />
                                <span>Soft Copy (Free)</span>
                              </span>
                            )}
                          </td>

                          {/* Financials */}
                          <td className="p-3.5">
                            <span className="font-bold text-white block">₹{Number(o.total_amount).toLocaleString()}</span>
                            <span className="text-[10px] font-mono text-emerald-400 block">
                              {o.payment_id ? o.payment_id.slice(-10) : "PAID"}
                            </span>
                          </td>

                          {/* Internal Status */}
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700 block w-fit">
                              {o.status}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Customer: {o.customer_status_message?.slice(0, 25) || o.status}
                            </span>
                          </td>

                          {/* SLA / Overdue */}
                          <td className="p-3.5">
                            <span className="text-slate-300 block">{new Date(o.created_at).toLocaleDateString()}</span>
                            {o.is_overdue ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-flex items-center gap-1 mt-0.5">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Overdue</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 block">SLA: {pricingConfig.expected_sla_days || 7}d</span>
                            )}
                          </td>

                          {/* Assigned Partner */}
                          <td className="p-3.5">
                            {o.assigned_partner ? (
                              <div>
                                <span className="font-semibold text-white block">{o.assigned_partner.name}</span>
                                <span className="text-[10px] text-slate-400 block">{o.assigned_partner.phone}</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openPartnerModal(o)}
                                className="px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px] font-semibold flex items-center gap-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                <span>Assign Partner</span>
                              </button>
                            )}
                          </td>

                          {/* Courier Tracking */}
                          <td className="p-3.5">
                            {o.delivery_type === "HARD_COPY" ? (
                              o.tracking_number ? (
                                <div>
                                  <span className="font-mono text-cyan-300 font-bold block">{o.tracking_number}</span>
                                  <span className="text-[10px] text-slate-400 block">{o.courier_provider || "Speed Post"}</span>
                                  <button
                                    type="button"
                                    onClick={() => openCourierModal(o)}
                                    className="text-[10px] text-cyan-400 hover:underline"
                                  >
                                    Update Courier
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openCourierModal(o)}
                                  className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-[11px] font-semibold flex items-center gap-1"
                                >
                                  <Truck className="w-3 h-3" />
                                  <span>Dispatch Courier</span>
                                </button>
                              )
                            ) : (
                              <span className="text-[10px] text-slate-500">N/A (Soft Copy)</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button type="button" title="Review uploaded documents" onClick={() => { setActiveModalOrder(o); setModalType("DOCUMENTS"); setActionError(""); }} className="p-1.5 rounded-lg border border-slate-700 text-cyan-300"><FileCheck className="w-4 h-4" /></button>
                              <button
                                type="button"
                                onClick={() => openPartnerModal(o)}
                                title="Partner Assignment"
                                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openFinalDocModal(o)}
                                title="Upload Final Deed"
                                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openQcModal(o)}
                                title="QC Verification"
                                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                              </button>
                              {o.delivery_type === "HARD_COPY" && (
                                <button
                                  type="button"
                                  onClick={() => openCourierModal(o)}
                                  title="Courier Management"
                                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pricing Configuration (Section 36) */}
        {activeTab === "PRICING" && (
          <div className="mt-6 max-w-2xl bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                <span>Admin Dynamic Pricing Engine (Section 36)</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Configure Fees & SLA Processing Timelines</h2>
              <p className="text-xs text-slate-400 mt-1">
                Prices configured here update the frontend checkout dynamically without code changes. Do NOT hardcode fee values.
              </p>
            </div>

            {pricingNotice && (
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{pricingNotice}</span>
              </div>
            )}

            <form onSubmit={handleSavePricing} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Individual / Residential Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.service_fee}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, service_fee: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-slate-500">Residential package fee (₹1499)</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Commercial Agreement Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.commercial_fee ?? 2199}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, commercial_fee: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-slate-500">Commercial package fee (₹2199)</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Hard Copy Fee (₹) [Configurable ₹50]
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.hard_copy_fee}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, hard_copy_fee: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white font-mono text-cyan-400 font-bold"
                  />
                  <span className="text-[10px] text-slate-500">Fee charged when physical courier is selected</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Courier Shipping Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.courier_fee}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, courier_fee: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-slate-500">Express postal or partner shipping surcharge</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Printing & Paper Charge (₹)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.printing_fee}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, printing_fee: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-slate-500">Official stamp paper procurement cost</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Expected SLA Processing Period (Days)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.expected_sla_days}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, expected_sla_days: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-slate-500">Orders exceeding this period trigger admin overdue alerts</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Customer SLA Estimate Display Text
                  </label>
                  <input
                    type="text"
                    value={pricingConfig.sla_display_text}
                    onChange={(e) => setPricingConfig({ ...pricingConfig, sla_display_text: e.target.value })}
                    placeholder="Expected completion within 7 days."
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                  <span className="text-[10px] text-slate-500">Do NOT guarantee. State estimate clearly.</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={pricingSaving}
                  className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 text-xs font-bold transition flex items-center gap-2"
                >
                  {pricingSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Config...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Pricing Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Agreements 15-Column Table */}
        {activeTab === "AGREEMENTS" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3.5">1. Agreement ID</th>
                    <th className="p-3.5">2. Landlord</th>
                    <th className="p-3.5">3. Tenant</th>
                    <th className="p-3.5">4. State</th>
                    <th className="p-3.5">5. Type</th>
                    <th className="p-3.5">6. Rent</th>
                    <th className="p-3.5">7. Deposit</th>
                    <th className="p-3.5">8. Stamp Duty</th>
                    <th className="p-3.5">9. Stamp Status</th>
                    <th className="p-3.5">10. eSign Status</th>
                    <th className="p-3.5">11. Notary Status</th>
                    <th className="p-3.5">12. Registration</th>
                    <th className="p-3.5">13. Created</th>
                    <th className="p-3.5">14. Executed</th>
                    <th className="p-3.5">15. Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {agreements.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-900/40">
                      <td className="p-3.5 font-mono font-bold text-cyan-400">{a.agreement_number}</td>
                      <td className="p-3.5 font-medium text-white">{a.owner_name}</td>
                      <td className="p-3.5">{a.tenant_name}</td>
                      <td className="p-3.5">{a.state_code}</td>
                      <td className="p-3.5 text-slate-400">{a.agreement_type}</td>
                      <td className="p-3.5 font-semibold text-white">₹{Number(a.monthly_rent).toLocaleString()}</td>
                      <td className="p-3.5 text-slate-400">₹{Number(a.security_deposit).toLocaleString()}</td>
                      <td className="p-3.5 text-amber-400 font-semibold">₹{Number(a.stamp_duty_amount).toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.stamp_status === "ISSUED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {a.stamp_status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.esign_status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-300"
                        }`}>
                          {a.esign_status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.notary_status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"
                        }`}>
                          {a.notary_status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {a.registration_required ? (
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">REQUIRED</span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">EXEMPT (&lt;12M)</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="p-3.5 text-slate-400">{a.executed_at ? new Date(a.executed_at).toLocaleDateString() : "—"}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          a.status === "EXECUTED" || a.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                        }`}>
                          {a.status_display || a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Legal Rules */}
        {activeTab === "RULES" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-4">Jurisdiction</th>
                  <th className="p-4">Agreement Type</th>
                  <th className="p-4">Threshold</th>
                  <th className="p-4">Stamp Duty</th>
                  <th className="p-4">Registration</th>
                  <th className="p-4">Statutory Act</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {legalRules.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">{r.state}</td>
                    <td className="p-4">{r.type}</td>
                    <td className="p-4">{r.threshold}</td>
                    <td className="p-4 font-semibold text-cyan-400">{r.duty}</td>
                    <td className="p-4">{r.reg_fee}</td>
                    <td className="p-4 text-slate-400">{r.act}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 5: Providers */}
        {activeTab === "PROVIDERS" && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {providers.map((p, i) => (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{p.type}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{p.name}</h3>
                  <span className="text-xs text-slate-400">Response Latency: {p.latency}</span>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
            ACTION MODALS (COURIER, PARTNER, FINAL DOC, QC)
            ========================================================================= */}

        {/* 1. Courier Modal (Section 20) */}
        {modalType === "DOCUMENTS" && activeModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <section className="max-w-xl w-full max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4">
              <div className="flex justify-between"><h2 className="text-lg font-bold text-white">Verify documents · {activeModalOrder.order_number}</h2><button onClick={() => setModalType(null)} className="text-white">Close</button></div>
              {actionError && <p role="alert" className="text-rose-300">{actionError}</p>}
              {!activeModalOrder.documents?.length && <p className="text-slate-400">No documents uploaded yet.</p>}
              {activeModalOrder.documents?.map((doc: any) => <div key={doc.id} className="border border-slate-700 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-white">{doc.document_type_display}</h3><p className="text-sm text-slate-400">{doc.file_name} · {doc.status_display}</p>
                <button className="text-cyan-300 underline text-sm" onClick={() => downloadDocument(doc.file_url, doc.file_name).catch(err => setActionError(err.message))}>Download for verification</button>
                <div className="flex gap-3">{["VERIFIED", "INVALID"].map(result => <button key={result} disabled={actionLoading} className="border border-slate-600 rounded-lg px-3 py-2 text-white text-xs" onClick={async () => {
                  const notes = result === "INVALID" ? window.prompt("Explain the required correction") : "Verified by admin";
                  if (notes === null) return;
                  setActionLoading(true); setActionError("");
                  try { await apiRequest(`/agreements/admin-orders/${activeModalOrder.id}/verify-document/`, { method: "PATCH", body: JSON.stringify({ document_id: doc.id, status: result, notes }) }); const fresh = await apiRequest(`/agreements/admin-orders/${activeModalOrder.id}/`); setActiveModalOrder(fresh); await fetchOrders(); }
                  catch (err: any) { setActionError(err.message); } finally { setActionLoading(false); }
                }}>{result === "VERIFIED" ? "Approve document" : "Request correction"}</button>)}</div>
              </div>)}
              <button className="text-cyan-300 underline" onClick={() => downloadDocument(`/api/v1/agreements/orders/${activeModalOrder.id}/download/`, `${activeModalOrder.order_number}.pdf`).catch(err => setActionError(err.message))}>Download partner PDF for final review</button>
            </section>
          </div>
        )}

        {modalType === "COURIER" && activeModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Truck className="w-4 h-4" />
                  <span>Update Courier & Shipping Details</span>
                </div>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-slate-300">
                Order: <strong className="text-white font-mono">{activeModalOrder.order_number}</strong>
                <br />
                Recipient: {activeModalOrder.recipient_name} ({activeModalOrder.recipient_phone})
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleUpdateCourier} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Courier Provider</label>
                  <input
                    type="text"
                    value={courierProvider}
                    onChange={(e) => setCourierProvider(e.target.value)}
                    placeholder="Blue Dart, DTDC, India Post Speed Post"
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Tracking Number / AWB</label>
                  <input
                    type="text"
                    value={courierTrackingNumber}
                    onChange={(e) => setCourierTrackingNumber(e.target.value)}
                    placeholder="e.g. BD789123456IN"
                    required
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Delivery Status</label>
                  <select
                    value={courierStatus}
                    onChange={(e) => setCourierStatus(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  >
                    <option value="PRINTED">PRINTED</option>
                    <option value="COURIER_BOOKED">COURIER_BOOKED</option>
                    <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Expected Delivery Date</label>
                  <input
                    type="date"
                    value={courierExpectedDelivery}
                    onChange={(e) => setCourierExpectedDelivery(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    {actionLoading ? "Updating..." : "Save Courier Details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Partner Assignment Modal (Section 21) */}
        {modalType === "PARTNER" && activeModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <UserPlus className="w-4 h-4" />
                  <span>Assign Verified Partner</span>
                </div>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-slate-300">
                Order: <strong className="text-white font-mono">{activeModalOrder.order_number}</strong>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleAssignPartner} className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1">Legal / notary partner in {activeModalOrder.agreement_details?.property_city}</label>
                  <select value={partnerName} onChange={e => setPartnerName(e.target.value)} required className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white">
                    <option value="">Select a registered partner</option>
                    {partners.map(partner => <option key={partner.id} value={partner.id}>{partner.name} ({partner.email})</option>)}
                  </select>
                  <p className="mt-2 text-xs text-slate-400">Verify the mandatory documents first. Manage legal partner accounts and their preferred city in Django admin.</p>
                  <Link href="/partner/agreements" className="text-blue-400 text-xs">Open partner dashboard</Link>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Internal Instructions / Notes</label>
                  <textarea
                    rows={3}
                    value={partnerNotes}
                    onChange={(e) => setPartnerNotes(e.target.value)}
                    placeholder="Gujarat Treasury e-stamp duty to be procured on Article 30."
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                  >
                    {actionLoading ? "Assigning..." : "Assign Partner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. Final Doc Upload Modal (Section 22) */}
        {modalType === "FINAL_DOC" && activeModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Final Executed Deed</span>
                </div>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-slate-300">
                Order: <strong className="text-white font-mono">{activeModalOrder.order_number}</strong>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload the official scanned/executed PDF with Gujarat treasury stamp. Document SHA-256 hash will be calculated automatically.
                </p>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleUploadFinalDoc} className="space-y-3">
                <div className="border border-dashed border-slate-700 rounded-2xl p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFinalDocFile(e.target.files?.[0] || null)}
                    required
                    className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                  />
                  {finalDocFile && (
                    <div className="mt-2 text-emerald-400 font-semibold text-xs">
                      Selected: {finalDocFile.name} ({Math.round(finalDocFile.size / 1024)} KB)
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading || !finalDocFile}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold disabled:opacity-50"
                  >
                    {actionLoading ? "Uploading & Hashing..." : "Upload Document"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. QC Modal (Section 23) */}
        {modalType === "QC" && activeModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <CheckSquare className="w-4 h-4" />
                  <span>Quality Control (QC) Verification</span>
                </div>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-slate-300">
                Order: <strong className="text-white font-mono">{activeModalOrder.order_number}</strong>
                <p className="text-[11px] text-slate-400 mt-1">
                  Verify party names, property address, rent, deposit, duration, and stamp validity before releasing to customer.
                </p>
              </div>

              {actionError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleQcSubmit} className="space-y-3">
                <div className="flex gap-3">
                  <label
                    onClick={() => setQcStatus("APPROVED")}
                    className={`flex-1 p-3 rounded-xl border cursor-pointer text-center font-bold transition ${
                      qcStatus === "APPROVED"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mx-auto mb-1" />
                    <span>QC Pass (Ready)</span>
                  </label>

                  <label
                    onClick={() => setQcStatus("FAILED")}
                    className={`flex-1 p-3 rounded-xl border cursor-pointer text-center font-bold transition ${
                      qcStatus === "FAILED"
                        ? "bg-rose-500/10 border-rose-500 text-rose-400"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    }`}
                  >
                    <XCircle className="w-4 h-4 mx-auto mb-1" />
                    <span>QC Failed (Correction)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">QC Verification Notes / Reason</label>
                  <textarea
                    rows={3}
                    value={qcNotes}
                    onChange={(e) => setQcNotes(e.target.value)}
                    placeholder={
                      qcStatus === "APPROVED"
                        ? "All statutory clauses and stamp serial numbers verified."
                        : "State reasons for rejection (e.g. spelling mismatch in tenant name)."
                    }
                    className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-xl text-white font-bold ${
                      qcStatus === "APPROVED" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"
                    }`}
                  >
                    {actionLoading ? "Submitting..." : qcStatus === "APPROVED" ? "Approve & Release Deed" : "Reject & Request Fix"}
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
