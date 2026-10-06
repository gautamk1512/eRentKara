"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  Truck,
  Download,
  Eye,
  AlertCircle,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Building2,
  Calendar,
  IndianRupee,
  User,
  ExternalLink,
  Edit3,
  Loader2,
  Package,
} from "lucide-react";
import { downloadDocument } from "@/lib/documentDownload";
import { api } from "@/lib/api";

const PROGRESS_STEPS = [
  { id: 1, label: "Order Placed" },
  { id: 2, label: "Payment Confirmed" },
  { id: 3, label: "Documents Received" },
  { id: 4, label: "Agreement Processing" },
  { id: 5, label: "Final Agreement Ready" },
  { id: 6, label: "Delivery" },
  { id: 7, label: "Completed" },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Correction modal state
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState("");
  const [submittingCorrection, setSubmittingCorrection] = useState(false);
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  const loadOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.getAgreementOrder(orderNumber);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError(res.error || "Order not found.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load order tracking details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason.trim()) return;
    setSubmittingCorrection(true);
    try {
      const res = await api.requestOrderCorrection(orderNumber, correctionReason);
      if (res.success) {
        setCorrectionSuccess(true);
        setTimeout(() => {
          setShowCorrectionModal(false);
          setCorrectionSuccess(false);
          setCorrectionReason("");
          loadOrder();
        }, 1500);
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit correction request.");
    } finally {
      setSubmittingCorrection(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs text-slate-500 font-medium">Loading agreement order #{orderNumber}...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <Link
          href="/dashboard/agreements"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agreements</span>
        </Link>
        <div className="bg-white rounded-3xl p-8 border border-red-200 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Order Not Found</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {error || `We could not locate an agreement order with number ${orderNumber}.`}
          </p>
          <button
            onClick={() => router.push("/dashboard/agreements")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  const cv = order.customer_view || {};
  const currentStep = cv.progress_step || 1;
  const isHardCopy = order.delivery_type === "HARD_COPY";
  const tracking = cv.tracking;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/agreements"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Agreements</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-400">Order Ref: {order.order_number}</span>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Rental Agreement</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-slate-900">Order #{order.order_number}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {order.agreement_details?.property_title || "Residential Rental Agreement"}
            </h1>
            <p className="text-xs text-slate-500">
              Created on {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{cv.status_title || "Processing"}</span>
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Payment: Paid (₹{Number(order.total_amount).toLocaleString("en-IN")})</span>
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
              {isHardCopy ? <Truck className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
              <span>{cv.delivery_label || "Soft Copy (Digital)"}</span>
            </span>
          </div>
        </div>

        {/* Section 12: Visual Progress Tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Fulfilment Progress</span>
            <span className="text-slate-500 font-medium">{cv.expected_completion_text || "Expected completion within 7 days."}</span>
          </div>

          <div className="hidden md:grid grid-cols-7 gap-2">
            {PROGRESS_STEPS.map((step) => {
              const isPassed = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center text-center space-y-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      isPassed
                        ? "bg-emerald-600 text-white"
                        : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <span
                    className={`text-[10px] font-semibold leading-tight ${
                      isPassed ? "text-emerald-700" : isCurrent ? "text-blue-700 font-bold" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Stepper Summary */}
          <div className="md:hidden p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {currentStep}
              </div>
              <span className="font-bold text-blue-900">{cv.status_title || "In Progress"}</span>
            </div>
            <span className="text-[11px] text-blue-700">Step {currentStep} of 7</span>
          </div>
        </div>

        {/* Section 15: Friendly Status Message Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{cv.status_message || "Your agreement is being processed."}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Our team verifies your documents and coordinates agreement preparation with a legal partner in your city.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {cv.is_ready_for_download && order.download_url ? (
              <button
                onClick={() => downloadDocument(order.download_url, `${order.order_number}.pdf`).catch(err => setError(err.message))}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            ) : null}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={() => setShowCorrectionModal(true)}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Request Correction</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4">
        <h2 className="font-bold text-slate-900">Your submitted documents</h2>
        {order.correction_reason && <p className="rounded-xl bg-amber-50 p-3 text-amber-800">Correction required: {order.correction_reason}</p>}
        <div className="grid sm:grid-cols-3 gap-3">{order.documents?.map((doc: any) => <div key={doc.id} className="border rounded-xl p-4 space-y-2"><p className="text-sm font-semibold">{doc.document_type_display}</p><p className="text-xs text-slate-500 break-all">{doc.file_name}</p><p className="text-xs font-semibold">{doc.status_display}</p>{doc.validation_notes && <p className="text-xs text-slate-500">{doc.validation_notes}</p>}<button className="text-sm text-blue-600 underline" onClick={() => downloadDocument(doc.file_url, doc.file_name).catch(err => setError(err.message))}>Download</button>{doc.status === "INVALID" && <label className="block text-sm">Replace document<input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" className="block w-full text-xs mt-2" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const form = new FormData(); form.append("document_type", doc.document_type); form.append("file", file); try { await api.uploadAgreementDocument(order.agreement, form); window.location.reload(); } catch (err: any) { setError(err.message); } }} /></label>}</div>)}</div>
      </section>

      {/* Grid: Agreement Summary & Delivery Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Contract Details */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Contract & Financial Terms</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Submitted details</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Monthly Rent</span>
              <span className="font-bold text-slate-900 text-sm">
                ₹{Number(order.agreement_details?.monthly_rent || 0).toLocaleString("en-IN")}/mo
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Security Deposit</span>
              <span className="font-bold text-slate-900 text-sm">
                ₹{Number(order.agreement_details?.security_deposit || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Agreement Term</span>
              <span className="font-bold text-slate-900">
                {order.agreement_details?.duration_months || 11} Months
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Start Date</span>
              <span className="font-bold text-slate-900">
                {order.agreement_details?.start_date || "—"}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Landlord:</span>
              <span className="font-bold text-slate-900">{order.agreement_details?.owner_name || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Tenant:</span>
              <span className="font-bold text-slate-900">{order.agreement_details?.tenant_name || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" /> Property:</span>
              <span className="font-medium text-slate-800 truncate max-w-[200px]">
                {order.agreement_details?.property_address || order.agreement_details?.property_city || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Delivery & Courier Tracking (Section 19) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span>Delivery Details</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700">
              {isHardCopy ? "Physical Courier" : "Digital Soft Copy"}
            </span>
          </div>

          {isHardCopy ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Courier Provider</span>
                  <span className="font-bold text-slate-900">{tracking?.courier_provider || "Speed Post / India Post"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Tracking Number</span>
                  <span className="font-mono font-bold text-purple-800 select-all">
                    {tracking?.tracking_number || "Dispatched on booking"}
                  </span>
                </div>
                {tracking?.expected_delivery_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">Expected Delivery</span>
                    <span className="font-bold text-emerald-700">{tracking.expected_delivery_date}</span>
                  </div>
                )}
              </div>

              {tracking?.tracking_number ? (
                <a
                  href={`https://www.indiapost.gov.in/_layouts/15/dpt.cpt.tracking/trackconsignment.aspx`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Track Shipment Online</span>
                </a>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-[11px] text-slate-500">
                  Tracking number will appear here automatically as soon as dispatched from hub.
                </div>
              )}

              <div className="text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">Delivery Address:</span>
                <p className="leading-relaxed">
                  {order.recipient_name} ({order.recipient_phone})<br />
                  {order.delivery_address}, {order.delivery_city}, {order.delivery_state} - {order.delivery_pincode}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Digital Soft Copy Included</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your completed agreement PDF will be available here after our admin team approves the final document.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Final PDF integrity hash recorded</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Prepared by an assigned legal partner</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reviewed by our admin team before delivery</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 31: Immutable Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Order Timeline & Activity Log</span>
        </h3>

        {order.timeline_events && order.timeline_events.length > 0 ? (
          <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {order.timeline_events.map((evt: any) => (
              <div key={evt.id} className="relative space-y-0.5">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{evt.action?.replace(/_/g, " ")}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(evt.created_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {evt.notes && <p className="text-slate-500 text-[11px]">{evt.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-xs text-center py-4">No milestone recorded yet.</p>
        )}
      </div>

      {/* Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Request Correction</h3>
              <button
                type="button"
                onClick={() => setShowCorrectionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {correctionSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correction request submitted successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-xs">
                <p className="text-slate-500">
                  Please specify what needs to be changed in your rental agreement details. Our fulfilment team will review and update it prior to final execution.
                </p>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Correction Details / Instructions</label>
                  <textarea
                    rows={4}
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    placeholder="e.g. Please correct tenant surname spelling from Shaah to Shah..."
                    required
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-4 py-2 border rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCorrection || !correctionReason.trim()}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {submittingCorrection ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
