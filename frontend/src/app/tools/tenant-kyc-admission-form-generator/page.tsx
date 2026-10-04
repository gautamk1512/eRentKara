"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck, ArrowLeft, Printer, Building2, User,
  Utensils, Phone, Calendar, ShieldCheck, HeartPulse
} from "lucide-react";


export default function TenantKycAdmissionPage() {
  const [pgName, setPgName] = useState("Stanza Living / Sri Balaji Luxury PG");
  const [pgAddress, setPgAddress] = useState("Plot 15, Near Wipro Gate 5, Electronic City Phase 1, Bengaluru");
  
  const [tenantName, setTenantName] = useState("Sneha Patil");
  const [dob, setDob] = useState("2001-05-18");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [mobile, setMobile] = useState("+91 91234 56789");
  const [email, setEmail] = useState("sneha.patil@gmail.com");
  const [permanentAddress, setPermanentAddress] = useState("Flat 104, Sai Heritage, Shivaji Nagar, Belagavi, Karnataka");

  const [parentName, setParentName] = useState("Ganesh Patil (Father)");
  const [parentPhone, setParentPhone] = useState("+91 94481 23456");

  const [institution, setInstitution] = useState("PES University / Infosys Trainee");
  const [roomBed, setRoomBed] = useState("Room 304 — Bed B (Double Sharing)");
  const [checkInDate, setCheckInDate] = useState("2026-04-01");
  const [monthlyRent, setMonthlyRent] = useState<number>(10500);
  const [securityDeposit, setSecurityDeposit] = useState<number>(15000);
  const [messPreference, setMessPreference] = useState("Pure Veg (Breakfast + Dinner)");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link href="/tools" className="hover:text-[#0071e3] transition flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Free Rental Tools</span>
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">PG / Hostel Admission Form</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span>PG & Hostel Admission Form Generator</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                KYC & Onboarding
              </span>
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-teal-600 text-white text-xs sm:text-sm font-bold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Admission Slip</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <UserCheck className="w-5 h-5 text-teal-600" />
              <span>Resident & PG Details</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">PG / Hostel Name</label>
              <input
                type="text"
                value={pgName}
                onChange={(e) => setPgName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resident Full Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resident Phone</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DOB</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Parent / Guardian Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Phone (Emergency)</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Room & Pricing Allocation</div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room & Bed No.</label>
                <input
                  type="text"
                  value={roomBed}
                  onChange={(e) => setRoomBed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={monthlyRent || ""}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deposit Paid (₹)</label>
                  <input
                    type="number"
                    value={securityDeposit || ""}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mess Food Preference</label>
                <select
                  value={messPreference}
                  onChange={(e) => setMessPreference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="Pure Veg (Breakfast + Dinner)">Pure Veg (Breakfast + Dinner)</option>
                  <option value="Veg + Non-Veg (3 Meals/Day)">Veg + Non-Veg (3 Meals/Day)</option>
                  <option value="Jain Food (No Onion/Garlic)">Jain Food (No Onion/Garlic)</option>
                  <option value="No Food / Room Only">No Food / Room Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Printable Admission Form */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 print:hidden px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Official PG Admission Form</span>
              <span>Resident Onboarding Record</span>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans">
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">{pgName}</h2>
                <p className="text-xs text-slate-500 mt-1">{pgAddress}</p>
                <div className="mt-2 inline-block px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 rounded-full font-bold text-xs uppercase tracking-wider">
                  Resident Admission & Hostel Record
                </div>
              </div>

              {/* Photo Box */}
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="space-y-1 text-xs">
                  <p><strong>Resident Reg ID:</strong> ERK-PG-7842</p>
                  <p><strong>Check-in Date:</strong> {checkInDate}</p>
                  <p><strong>Allocated Room/Bed:</strong> <span className="text-teal-700 font-bold">{roomBed}</span></p>
                </div>
                <div className="w-24 h-28 border-2 border-dashed border-slate-400 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 text-center p-1 shrink-0 rounded-lg">
                  <span>Photo</span>
                </div>
              </div>

              {/* Details Grid */}
              <table className="w-full border border-slate-300 mb-6 text-xs">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold w-1/3 border-r border-slate-300">Full Name:</td>
                    <td className="p-2.5 font-bold text-slate-900">{tenantName}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">DOB & Blood Group:</td>
                    <td className="p-2.5">{dob} | Blood Group: <strong className="text-rose-600">{bloodGroup}</strong></td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Contact & Email:</td>
                    <td className="p-2.5">{mobile} | {email}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Parent / Guardian:</td>
                    <td className="p-2.5 font-semibold text-rose-800">{parentName} — Ph: {parentPhone}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">College / Employer:</td>
                    <td className="p-2.5">{institution}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Monthly Rent:</td>
                    <td className="p-2.5 font-bold">₹{monthlyRent.toLocaleString("en-IN")}/month (Payable before 5th)</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Deposit Received:</td>
                    <td className="p-2.5 font-bold text-emerald-700">₹{securityDeposit.toLocaleString("en-IN")} (Refundable)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Mess / Food Plan:</td>
                    <td className="p-2.5 font-medium">{messPreference}</td>
                  </tr>
                </tbody>
              </table>

              {/* Rules Undertaking */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1 mb-8">
                <div className="font-bold text-slate-900 uppercase">Rules & Code of Conduct:</div>
                <p>1. Main gate closes at 10:30 PM. Late entry requires prior warden notification.</p>
                <p>2. Non-resident visitors are permitted only in the lobby area between 9 AM to 8 PM.</p>
                <p>3. One month notice period is strictly mandatory before vacating the PG.</p>
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">Signature of Resident</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">Warden / PG Manager Signature</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 shadow-md shadow-teal-600/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Admission Slip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
