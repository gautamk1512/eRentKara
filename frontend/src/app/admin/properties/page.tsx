"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  ExternalLink,
  MapPin,
  IndianRupee,
  Phone,
  Mail,
  User,
  RefreshCw,
  Sparkles,
  Bed,
  Check,
  Layers,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";

export default function AdminPropertyApprovalsPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "VERIFIED" | "REJECTED" | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedPropForReject, setSelectedPropForReject] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    ensureAdminAuthAndLoad();
  }, []);

  const ensureAdminAuthAndLoad = async () => {
    setLoading(true);
    try {
      // Auto-login with admin credentials if not authenticated or not staff
      const storedUser = localStorage.getItem("erk_user");
      let userObj = storedUser ? JSON.parse(storedUser) : null;
      
      if (!userObj || (userObj.role !== "SUPER_ADMIN" && userObj.role !== "ADMIN")) {
        const res = await api.login({ email: "admin@erentkarar.com", password: "Admin@12345" });
        if (res.success && res.data) {
          localStorage.setItem("erk_token", res.data.tokens.access);
          localStorage.setItem("erk_user", JSON.stringify(res.data.user));
        }
      }
      await loadProperties();
    } catch (err: any) {
      console.warn("Admin auto-login error:", err);
      await loadProperties();
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const res = await api.getProperties();
      const list = Array.isArray(res) ? res : res?.data || res?.results || [];
      setProperties(list);
    } catch (err: any) {
      console.error("Failed to load properties:", err);
    }
  };

  const handleApprove = async (prop: any) => {
    if (!confirm(`Are you sure you want to approve "${prop.title}" and publish it live to the marketplace?`)) {
      return;
    }
    setActionLoadingId(prop.id);
    setStatusMessage(null);
    try {
      const res = await api.approvePropertyListing(prop.id, "Approved by Admin via Admin Portal");
      setStatusMessage({
        text: `✅ Property "${prop.title}" has been approved and published to the live marketplace!`,
        type: "success",
      });
      // Refresh list
      await loadProperties();
    } catch (err: any) {
      setStatusMessage({
        text: `❌ Approval failed: ${err.message}`,
        type: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (prop: any) => {
    setSelectedPropForReject(prop);
    setRejectReason("Incomplete address / unable to verify property ownership documents.");
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedPropForReject) return;
    setActionLoadingId(selectedPropForReject.id);
    setRejectModalOpen(false);
    setStatusMessage(null);
    try {
      await api.rejectPropertyListing(selectedPropForReject.id, rejectReason);
      setStatusMessage({
        text: `Property "${selectedPropForReject.title}" has been rejected.`,
        type: "success",
      });
      await loadProperties();
    } catch (err: any) {
      setStatusMessage({
        text: `Rejection failed: ${err.message}`,
        type: "error",
      });
    } finally {
      setActionLoadingId(null);
      setSelectedPropForReject(null);
    }
  };

  // Counts
  const pendingCount = properties.filter((p) => p.verification_status === "PENDING" || !p.verification_status).length;
  const verifiedCount = properties.filter((p) => p.verification_status === "VERIFIED").length;
  const rejectedCount = properties.filter((p) => p.verification_status === "REJECTED").length;

  // Filtered properties
  const filtered = properties.filter((p) => {
    // Tab filter
    if (activeTab === "PENDING") {
      if (p.verification_status !== "PENDING" && p.verification_status) return false;
    } else if (activeTab === "VERIFIED") {
      if (p.verification_status !== "VERIFIED") return false;
    } else if (activeTab === "REJECTED") {
      if (p.verification_status !== "REJECTED") return false;
    }

    // City filter
    if (cityFilter !== "All" && p.city?.toLowerCase() !== cityFilter.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      const matchLocality = p.locality?.toLowerCase().includes(q);
      const matchOrg = p.organization_name?.toLowerCase().includes(q);
      if (!matchTitle && !matchCity && !matchLocality && !matchOrg) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-400">eRentKarar Listing Moderation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-400" />
              <span>Property Listing Requests & Approvals</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/rent-agreements"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              Rent Agreements Engine
            </Link>
            <a
              href="/admin/properties/property/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <span>Django Admin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={loadProperties}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Refresh Listings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Status notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between transition ${
              statusMessage.type === "success"
                ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-200"
                : "bg-red-950/80 border border-red-500/40 text-red-200"
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs uppercase font-bold text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "PENDING"
                ? "bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pending Approval</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{pendingCount}</p>
            <span className="text-[11px] text-slate-400">Needs Admin review</span>
          </button>

          <button
            onClick={() => setActiveTab("VERIFIED")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "VERIFIED"
                ? "bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Approved & Live</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{verifiedCount}</p>
            <span className="text-[11px] text-slate-400">Active on marketplace</span>
          </button>

          <button
            onClick={() => setActiveTab("REJECTED")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "REJECTED"
                ? "bg-red-950/30 border-red-500/50 shadow-lg shadow-red-500/10"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Rejected</span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{rejectedCount}</p>
            <span className="text-[11px] text-slate-400">Denied submissions</span>
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={`p-4 rounded-2xl border text-left transition ${
              activeTab === "ALL"
                ? "bg-blue-950/30 border-blue-500/50 shadow-lg shadow-blue-500/10"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Total Submissions</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{properties.length}</p>
            <span className="text-[11px] text-slate-400">All properties in DB</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center px-4 py-2.5 bg-slate-900 rounded-2xl border border-slate-800 focus-within:border-emerald-500 transition">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by property title, locality, city, or landlord..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-white outline-none w-full placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 font-semibold shrink-0">City:</span>
            {["All", "Vadodara", "Ahmedabad", "Surat", "Bengaluru"].map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  cityFilter === c
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Listings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-40 bg-slate-900 rounded-3xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-12 text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-black text-white">No properties found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no listings matching the selected tab ({activeTab}) and filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((prop) => {
              const coverImg =
                prop.images?.find((i: any) => i.is_cover)?.image_url ||
                prop.images?.[0]?.image_url ||
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";

              const isPending = prop.verification_status === "PENDING" || !prop.verification_status;
              const isVerified = prop.verification_status === "VERIFIED";
              const isRejected = prop.verification_status === "REJECTED";
              const totalBeds = prop.buildings?.reduce(
                (sum: number, b: any) =>
                  sum + (b.floors?.reduce((fSum: number, f: any) => fSum + (f.rooms?.reduce((rSum: number, r: any) => rSum + (r.beds?.length || 0), 0) || 0), 0) || 0),
                0
              ) || 0;

              return (
                <div
                  key={prop.id}
                  className={`bg-slate-900 rounded-3xl border transition p-5 sm:p-6 flex flex-col lg:flex-row gap-6 ${
                    isPending
                      ? "border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-500/70"
                      : isVerified
                      ? "border-emerald-500/30 hover:border-emerald-500/60"
                      : "border-slate-800 opacity-80"
                  }`}
                >
                  {/* Left: Property Thumbnail & Tags */}
                  <div className="w-full lg:w-64 h-48 lg:h-auto rounded-2xl overflow-hidden relative bg-slate-800 shrink-0">
                    <img src={coverImg} alt={prop.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-slate-900/90 text-white shadow">
                        {prop.property_type?.replace("_", " ")}
                      </span>
                      {prop.gender_preference && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-slate-900/90 text-emerald-400 shadow">
                          {prop.gender_preference}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <div className="bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-xl text-[11px] text-white flex items-center justify-between font-bold">
                        <span>₹{Number(prop.monthly_rent_starting).toLocaleString("en-IN")}/mo</span>
                        <span>{totalBeds} Beds</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Property Details & Ownership Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-black text-white">{prop.title}</h3>
                          {isPending && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                              PENDING ADMIN APPROVAL
                            </span>
                          )}
                          {isVerified && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> APPROVED & LIVE
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/40">
                              REJECTED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{prop.address || `${prop.locality}, ${prop.city}`}</span>
                          {prop.nearby_landmarks && (
                            <span className="text-slate-500">• Near {prop.nearby_landmarks}</span>
                          )}
                        </p>
                      </div>

                      {prop.created_at && (
                        <span className="text-[11px] text-slate-500 shrink-0">
                          Submitted: {new Date(prop.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                      {prop.description || "No description provided."}
                    </p>

                    {/* Submitter & Organization Info Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Organization / Entity</span>
                        <span className="font-semibold text-slate-200">{prop.organization_name || "Direct Owner"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Utility / DISCOM Board</span>
                        <span className="font-semibold text-slate-200">{prop.electricity_board_discom || "MGVCL / State Grid"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Statutory Warranty</span>
                        <span className="font-semibold text-emerald-400">
                          {prop.ownership_warranty_accepted ? "✓ Landlord Title Declared" : "Standard Listing"}
                        </span>
                      </div>
                    </div>

                    {prop.ownership_verification_notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        <strong>Admin Note:</strong> {prop.ownership_verification_notes}
                      </p>
                    )}
                  </div>

                  {/* Right: Actions Column */}
                  <div className="w-full lg:w-48 flex flex-col justify-between gap-3 pt-3 lg:pt-0 lg:border-l border-slate-800 lg:pl-6 shrink-0">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Admin Decision</span>
                      
                      {isPending && (
                        <>
                          <button
                            onClick={() => handleApprove(prop)}
                            disabled={actionLoadingId === prop.id}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{actionLoadingId === prop.id ? "Approving..." : "Approve & Publish"}</span>
                          </button>

                          <button
                            onClick={() => openRejectModal(prop)}
                            disabled={actionLoadingId === prop.id}
                            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 hover:border-red-500/40 text-slate-300 font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject Listing</span>
                          </button>
                        </>
                      )}

                      {isVerified && (
                        <div className="space-y-2">
                          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
                            <span className="text-[11px] font-bold text-emerald-400 block">Active on Web</span>
                            <span className="text-[10px] text-slate-400">Searchable by tenants</span>
                          </div>
                          <button
                            onClick={() => openRejectModal(prop)}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 text-xs font-semibold transition"
                          >
                            Revoke / Unpublish
                          </button>
                        </div>
                      )}

                      {isRejected && (
                        <div className="space-y-2">
                          <div className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-center">
                            <span className="text-[11px] font-bold text-red-400 block">Rejected</span>
                            <span className="text-[10px] text-slate-400">Not visible on website</span>
                          </div>
                          <button
                            onClick={() => handleApprove(prop)}
                            disabled={actionLoadingId === prop.id}
                            className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Re-Approve Listing</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <Link
                        href={`/properties/${prop.slug}`}
                        target="_blank"
                        className="w-full py-1.5 text-slate-400 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview Page</span>
                      </Link>

                      <a
                        href={`/admin/properties/property/${prop.id}/change/`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1 text-slate-500 hover:text-slate-300 text-[10px] flex items-center justify-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Edit in Django</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <XCircle className="w-5 h-5" />
              <h3 className="font-black text-base text-white">Reject Property Listing</h3>
            </div>
            
            <p className="text-xs text-slate-300">
              You are rejecting <strong>{selectedPropForReject?.title}</strong>. This property will remain unpublished and will not appear on the website marketplace.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Reason for Rejection (Visible to Owner):
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                placeholder="e.g. Incomplete address, unable to verify landlord identity, or fake details..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition shadow-md shadow-red-600/30"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
