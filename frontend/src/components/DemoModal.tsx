"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar, CheckCircle2, X, Sparkles, Building2,
  User, Phone, Mail, MapPin, Bed, ArrowRight, ShieldCheck,
  Zap, Clock
} from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: string;
}

export default function DemoModal({ isOpen, onClose, defaultRole = "PG / Hostel Owner" }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState<"SCHEDULE" | "INSTANT">("SCHEDULE");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(defaultRole);
  const [bedCount, setBedCount] = useState("20 - 50 Beds");
  const [city, setCity] = useState("Bengaluru");
  const [preferredDate, setPreferredDate] = useState("2026-03-30");
  const [preferredTime, setPreferredTime] = useState("04:00 PM");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleLaunchInstantDemo = (targetUrl: string) => {
    // Set a quick demo token in localStorage
    localStorage.setItem("erk_token", "demo_token_xyz");
    localStorage.setItem("erk_user", JSON.stringify({
      first_name: "Demo",
      last_name: "User",
      email: "demo@erentkarar.com",
      role: activeTab === "INSTANT" ? "OWNER" : "TENANT"
    }));
    window.location.href = targetUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">
        
        {/* Top Decorative Magic UI Glow Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500" />

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-start justify-between border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Experience eRentKarar</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Book a Product Demo / Free Trial
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              See how eRentKarar automates rent collection, legal agreements, and PG operations.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs (Schedule 1-on-1 vs Instant Sandbox) */}
        <div className="px-6 sm:px-8 pt-4">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("SCHEDULE")}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === "SCHEDULE"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule 1-on-1 Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("INSTANT")}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1.5 ${
                activeTab === "INSTANT"
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Instant Interactive Sandbox</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">Demo Scheduled Successfully!</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name || "Customer"}</strong>. Our product specialist will call you at <strong>{phone}</strong> on <strong>{preferredDate} at {preferredTime}</strong> with a live customized walkthrough.
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold max-w-sm mx-auto">
                💬 We also sent confirmation details to your WhatsApp!
              </div>
              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={() => handleLaunchInstantDemo("/dashboard")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md"
                >
                  Explore Demo Dashboard Now →
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : activeTab === "SCHEDULE" ? (
            /* Tab 1: Schedule Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">I am a *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PG / Hostel Owner">PG / Hostel Owner</option>
                    <option value="Flat / Apartment Landlord">Flat / Apartment Landlord</option>
                    <option value="Co-Living Space Operator">Co-Living Space Operator</option>
                    <option value="Commercial Shop Owner">Commercial Shop Owner</option>
                    <option value="Kiosk / Documentation Center">Kiosk / Documentation Partner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Beds / Units Managed</label>
                  <select
                    value={bedCount}
                    onChange={(e) => setBedCount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1 - 10 Units / Beds">1 - 10 Units / Beds</option>
                    <option value="11 - 50 Beds">11 - 50 Beds</option>
                    <option value="51 - 150 Beds">51 - 150 Beds</option>
                    <option value="150+ Beds (Multi-Building)">150+ Beds (Multi-Building)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Special Requirements (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need auto UPI billing & mess menu setup for 45-bed boys PG"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
                >
                  <span>{submitting ? "Booking Your Demo..." : "Confirm Free 1-on-1 Product Demo"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  🔒 Zero spam guarantee. A dedicated product specialist will walk you through the system.
                </p>
              </div>
            </form>
          ) : (
            /* Tab 2: Instant Sandbox Direct Launch */
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Try Interactive Sandbox Instantly</h4>
                <p className="text-xs text-slate-500">
                  No signup or credit card required. Experience live pre-populated mock data right now.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Owner Portal Sandbox */}
                <button
                  onClick={() => handleLaunchInstantDemo("/dashboard")}
                  className="group p-4 rounded-2xl border-2 border-teal-200 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-50 text-left transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900">Owner Dashboard Sandbox</span>
                    <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Explore occupancy graphs, 32 occupied beds, automated UPI invoices, mess menus, and staff roles.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                    Launch Owner Mode →
                  </span>
                </button>

                {/* Tenant Portal Sandbox */}
                <button
                  onClick={() => handleLaunchInstantDemo("/tenant")}
                  className="group p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-left transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Tenant Mobile Portal</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-slate-600">
                    See how tenants view room assignments, pay monthly rent dues via UPI, and raise complaints.
                  </p>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Launch Tenant Mode →
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
