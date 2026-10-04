"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, ArrowLeft, Printer, User, Building2,
  FileText, CheckCircle2, AlertTriangle, Phone, MapPin
} from "lucide-react";


export default function TenantPoliceVerificationPage() {
  const [policeStation, setPoliceStation] = useState("Koramangala Police Station, Bengaluru City");
  const [landlordName, setLandlordName] = useState("Rajesh Varma");
  const [landlordPhone, setLandlordPhone] = useState("+91 98450 12345");
  const [propertyAddress, setPropertyAddress] = useState("House No. 128, 5th Main, 4th Block Koramangala, Bengaluru - 560034");

  const [tenantName, setTenantName] = useState("Rohit Kulkarni");
  const [fatherName, setFatherName] = useState("Anand Kulkarni");
  const [dob, setDob] = useState("1998-07-14");
  const [gender, setGender] = useState("Male");
  const [tenantPhone, setTenantPhone] = useState("+91 97654 32109");
  const [aadhaarNumber, setAadhaarNumber] = useState("XXXX-XXXX-8921");
  const [permanentAddress, setPermanentAddress] = useState("Plot 42, Anand Nagar, Kothrud, Pune, Maharashtra - 411038");

  const [employerName, setEmployerName] = useState("Infosys Ltd.");
  const [employerAddress, setEmployerAddress] = useState("Electronics City Phase 1, Hosur Road, Bengaluru - 560100");
  const [designation, setDesignation] = useState("Software Engineer");

  const [ref1Name, setRef1Name] = useState("Amit Joshi (Colleague)");
  const [ref1Phone, setRef1Phone] = useState("+91 99887 66554");

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
              <span className="text-slate-800 font-semibold">Police Verification Form</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span>Tenant Police Verification Form Generator</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                Official Undertaking
              </span>
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs sm:text-sm font-bold hover:bg-purple-700 shadow-md shadow-purple-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Form</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>Police Station & Property</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Local Police Station</label>
              <input
                type="text"
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Landlord Name</label>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Landlord Phone</label>
                <input
                  type="text"
                  value={landlordPhone}
                  onChange={(e) => setLandlordPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rented Premises Address</label>
              <textarea
                rows={2}
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Tenant Info */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Tenant Information</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tenant Name</label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Father&apos;s Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">DOB</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Home Address</label>
                <textarea
                  rows={2}
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Employment / Study */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Employment / College</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company / College</label>
                  <input
                    type="text"
                    value={employerName}
                    onChange={(e) => setEmployerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Printable Form */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 print:hidden px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Official Police Verification Format</span>
              <span>Submit to Local Station</span>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans">
              {/* Form Title */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide">
                  Tenant Information & Police Verification Form
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  To: The Station House Officer (SHO), <strong>{policeStation}</strong>
                </p>
              </div>

              {/* Photo Box */}
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="space-y-1 text-xs">
                  <p>Sir / Madam,</p>
                  <p className="text-slate-700">
                    I, <strong>{landlordName}</strong> (Contact: {landlordPhone}), hereby furnish the particulars of the tenant residing at my premises <strong>{propertyAddress}</strong> for verification and official records:
                  </p>
                </div>
                <div className="w-24 h-28 border-2 border-dashed border-slate-400 bg-slate-50 flex flex-col items-center justify-center text-[10px] text-slate-400 text-center p-1 shrink-0 rounded-lg">
                  <span>Affix Recent Passport Photo</span>
                </div>
              </div>

              {/* Particulars Table */}
              <table className="w-full border border-slate-300 mb-6 text-xs">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 bg-slate-50 font-bold w-1/3 border-r border-slate-300">Full Name of Tenant:</td>
                    <td className="p-2 font-semibold">{tenantName}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Father&apos;s / Guardian Name:</td>
                    <td className="p-2">{fatherName}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">DOB & Gender:</td>
                    <td className="p-2">{dob} | {gender}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Mobile & Aadhaar:</td>
                    <td className="p-2">{tenantPhone} | Aadhaar: {aadhaarNumber}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Permanent Address:</td>
                    <td className="p-2">{permanentAddress}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Occupation / Employer:</td>
                    <td className="p-2">{designation} at {employerName} ({employerAddress})</td>
                  </tr>
                  <tr>
                    <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Emergency Reference:</td>
                    <td className="p-2">{ref1Name} ({ref1Phone})</td>
                  </tr>
                </tbody>
              </table>

              {/* Declarations */}
              <div className="space-y-2 text-[11px] text-slate-600 mb-8 leading-tight">
                <p>
                  <strong>Tenant Declaration:</strong> I hereby declare that the particulars given above are true and correct to the best of my knowledge and belief. I have no criminal record nor have any criminal proceedings pending against me in any court of law in India.
                </p>
                <p>
                  <strong>Owner Declaration:</strong> I have verified the original Aadhaar and ID proof of the tenant before inducting them into the tenancy.
                </p>
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">Signature of Tenant</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">Signature of Landlord</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400"></div>
                  <div className="text-[10px] text-slate-500 mt-1">Police Station Seal & Signature</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 shadow-md shadow-purple-600/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Verification Form</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
