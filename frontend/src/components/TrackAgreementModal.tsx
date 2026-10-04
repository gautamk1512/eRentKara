"use client";

import React, { useState, useEffect } from "react";
import {
  Search, X, ShieldCheck, CheckCircle2, Clock,
  FileText, Download, ArrowRight, Stamp, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackAgreementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-track-modal", handleOpen);
    return () => window.removeEventListener("open-track-modal", handleOpen);
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    setTimeout(() => {
      setLoading(false);
      const cleanQ = query.trim().toUpperCase();
      setResult({
        id: cleanQ.startsWith("ERK") ? cleanQ : `ERK-AGR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        type: "Residential 11-Month Tenancy Deed",
        state: "Karnataka (SHCIL e-Stamp Paper)",
        stampCertificate: "IN-KA8829104928172V",
        stampDuty: "₹100 Non-Judicial",
        createdOn: "28 Sep 2026, 02:45 PM",
        landlord: "Vikram Malhotra",
        tenant: "Aarav Sharma",
        property: "Flat 402, Green View, Indiranagar, Bengaluru",
        rent: "₹28,000 / month",
        status: "READY_FOR_DOWNLOAD",
        statusText: "Executed & Govt e-Stamped",
        steps: [
          { label: "Deed Terms Drafted", completed: true, date: "28 Sep, 02:45 PM" },
          { label: "Govt Treasury e-Stamp Affixed", completed: true, date: "28 Sep, 02:48 PM" },
          { label: "Landlord Aadhaar OTP eSign", completed: true, date: "28 Sep, 02:51 PM" },
          { label: "Tenant Aadhaar OTP eSign", completed: true, date: "28 Sep, 02:54 PM" },
          { label: "Official Sealed PDF Ready", completed: true, date: "28 Sep, 02:55 PM" },
        ],
      });
    }, 600);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResult(null);
    setSearched(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in font-sans">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Apple Dark Obsidian */}
        <div className="bg-[#1d1d1f] text-white px-6 py-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-[#0071e3] flex items-center justify-center text-white shadow-sm">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#f5f5f7]">Track Rent Agreement Status</h3>
              <p className="text-[11px] text-[#86868b]">Live registry verification across 28 Indian States</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#86868b] hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-6 bg-[#fbfbfd] border-b border-black/[0.06]">
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="block text-xs font-semibold text-[#1d1d1f]">
              Enter Deed Reference ID, Registered Mobile, or Certificate No.
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. ERK-AGR-2026-9042 or 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/[0.1] rounded-full text-xs text-[#1d1d1f] outline-none focus:border-[#0071e3] transition uppercase placeholder:normal-case shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="apple-btn-primary px-5 py-2.5 text-xs shrink-0 flex items-center space-x-1.5"
              >
                <span>{loading ? "Searching..." : "Track Deed"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#86868b]">
              <span>Sample ID:</span>
              <button
                type="button"
                onClick={() => setQuery("ERK-AGR-2026-9042")}
                className="text-[#0071e3] hover:underline font-mono"
              >
                ERK-AGR-2026-9042
              </button>
            </div>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#0071e3] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-[#86868b]">Querying state e-stamping repository & UIDAI audit logs...</p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6 animate-in fade-in">
              {/* Status Header Badge */}
              <div className="p-4 rounded-2xl bg-[#0071e3]/8 border border-[#0071e3]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#86868b]">
                    Agreement Record #{result.id}
                  </span>
                  <h4 className="text-sm font-bold text-[#1d1d1f] mt-0.5">{result.type}</h4>
                </div>
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#0071e3] text-white text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{result.statusText}</span>
                </div>
              </div>

              {/* Parties and Property Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.04]">
                  <span className="text-[10px] text-[#86868b] uppercase tracking-wider block">First Party (Landlord)</span>
                  <p className="font-semibold text-[#1d1d1f] mt-0.5">{result.landlord}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.04]">
                  <span className="text-[10px] text-[#86868b] uppercase tracking-wider block">Second Party (Tenant)</span>
                  <p className="font-semibold text-[#1d1d1f] mt-0.5">{result.tenant}</p>
                </div>
                <div className="col-span-2 p-3.5 rounded-2xl bg-[#f5f5f7] border border-black/[0.04]">
                  <span className="text-[10px] text-[#86868b] uppercase tracking-wider block">Premises & Monthly Rent</span>
                  <p className="font-semibold text-[#1d1d1f] mt-0.5">{result.property} • {result.rent}</p>
                </div>
              </div>

              {/* State e-Stamp Verification details */}
              <div className="p-4 rounded-2xl bg-white border border-black/[0.08] shadow-2xs space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#1d1d1f] font-semibold">
                    <Stamp className="w-4 h-4 text-[#0071e3]" />
                    <span>State e-Stamp Certificate</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0071e3] bg-[#0071e3]/10 px-2 py-0.5 rounded-full">
                    {result.stampCertificate}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#86868b] pt-1 border-t border-black/[0.06]">
                  <span>Jurisdiction: {result.state}</span>
                  <span>Duty: {result.stampDuty}</span>
                </div>
              </div>

              {/* Execution Timeline Steps */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wider">Execution Milestones</h5>
                <div className="space-y-2">
                  {result.steps.map((st: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-[#f5f5f7]">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0071e3]" />
                        <span className="font-medium text-[#1d1d1f]">{st.label}</span>
                      </div>
                      <span className="text-[10px] text-[#86868b] font-mono">{st.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download CTA */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => alert(`Downloading official stamped PDF for deed ${result.id}...`)}
                  className="apple-btn-primary flex-1 py-3 text-xs flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Stamped Agreement PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="apple-btn-secondary px-5 py-3 text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!loading && !result && !searched && (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1d1d1f]">Instant Real-Time Deed Verification</h4>
              <p className="text-xs text-[#86868b] max-w-sm mx-auto">
                Track your active agreement status, view landlord and tenant signatures, and retrieve your legally stamped PDF.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
