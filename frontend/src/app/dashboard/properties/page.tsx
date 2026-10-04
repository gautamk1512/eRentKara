"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Building2, Plus, MapPin, Eye, EyeOff, Bed, Users,
  CheckCircle2, ShieldCheck, AlertTriangle, MoreVertical,
  Search, Filter, ArrowRight, Sparkles
} from "lucide-react";

export default function DashboardPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const res = await api.getProperties();
      const list = Array.isArray(res) ? res : res?.data || res?.results || [];
      setProperties(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (p: any) => {
    if (p.verification_status !== "VERIFIED") {
      alert(`Cannot publish yet. This property is currently "${p.verification_status === "PENDING" ? "Pending Admin Approval" : "Rejected"}". Our Admin team must review and approve it before it can go live.`);
      return;
    }
    try {
      await api.togglePublishProperty(p.id);
      loadProperties();
    } catch (e: any) {
      alert(e.message || "Failed to update publish state");
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900">Properties</h1>
          <p className="text-xs text-slate-500">Manage your PGs, hostels, flats, and co-living properties</p>
        </div>
        <Link
          href="/list-your-property"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ List New Property</span>
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-emerald-500 transition">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text" placeholder="Search properties by name or city..."
            value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
            className="bg-transparent text-xs outline-none w-full text-slate-800"
          />
        </div>
      </div>

      {/* Property Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-64 border border-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900">No properties yet</h3>
          <p className="text-xs text-slate-500">List your first PG, hostel, flat, or rental to start receiving tenant leads.</p>
          <Link
            href="/list-your-property"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-md hover:bg-emerald-700 transition"
          >
            <Plus className="w-4 h-4" /> List Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const coverImg = p.images?.find((img: any) => img.is_cover)?.image_url || p.images?.[0]?.image_url ||
              "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80";
            const totalBeds = p.total_beds || 0;
            const occupiedBeds = p.occupied_beds || 0;
            const occupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
            const isApproved = p.verification_status === "VERIFIED";
            const isPending = p.verification_status === "PENDING" || !p.verification_status;
            const isRejected = p.verification_status === "REJECTED";

            return (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between">
                <div>
                  <div className="relative h-44 bg-slate-100">
                    <img src={coverImg} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                        {p.property_type?.replace("_", " ")}
                      </span>
                      {isApproved && (
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3 h-3" /> Approved & Listed
                        </span>
                      )}
                      {isPending && (
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Pending Admin Approval
                        </span>
                      )}
                      {isRejected && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                          ❌ Rejected
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => togglePublish(p)}
                      title={!isApproved ? "Property must be approved by Admin before publishing" : "Toggle Marketplace Visibility"}
                      className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition ${
                        !isApproved
                          ? "bg-slate-900/80 text-amber-300 border border-amber-400/40 cursor-not-allowed"
                          : p.is_published
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {!isApproved ? (
                        <><EyeOff className="w-3 h-3" /> Locked</>
                      ) : p.is_published ? (
                        <><Eye className="w-3 h-3" /> Live on Web</>
                      ) : (
                        <><EyeOff className="w-3 h-3" /> Hidden Draft</>
                      )}
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{p.title}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" /> {p.locality}, {p.city}
                      </p>
                    </div>

                    {/* Status Alert Banner */}
                    {isPending && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Under Admin Review</strong>
                          <span>Your listing request is in the Admin verification queue. Once approved, it will be published to the marketplace.</span>
                        </div>
                      </div>
                    )}

                    {isRejected && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-800 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Listing Rejected</strong>
                          <span>{p.ownership_verification_notes || "Please verify your ownership documents and property details."}</span>
                        </div>
                      </div>
                    )}

                    {isApproved && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-800 flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved & Active
                        </span>
                        <Link
                          href={`/properties/${p.slug}`}
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5 text-[10px]"
                        >
                          View Marketplace <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}

                    {/* Beds & Rent */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="bg-slate-50 rounded-xl py-2 border border-slate-100">
                        <p className="text-xs font-black text-slate-900">{totalBeds}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Beds</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl py-2 border border-emerald-100">
                        <p className="text-xs font-black text-emerald-700">{occupiedBeds}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">Occupied</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl py-2 border border-slate-100">
                        <p className="text-xs font-black text-slate-900">₹{Number(p.monthly_rent_starting).toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Rent/mo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/dashboard/properties/${p.id}`}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>Manage Units & Beds</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
