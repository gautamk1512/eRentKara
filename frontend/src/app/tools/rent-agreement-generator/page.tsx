"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText, ArrowLeft, Printer, ShieldCheck, Download,
  CheckCircle2, Building2, User, Calendar, IndianRupee,
  Sparkles, PenLine, Award
} from "lucide-react";

const stateStampDuty: Record<string, { duty: string; fee: string; note: string }> = {
  Karnataka: {
    duty: "₹100 to ₹500 e-Stamp Paper",
    fee: "₹200 Registration if notarized",
    note: "11-month agreement requires minimum ₹100 e-stamp. Registered if >11 months.",
  },
  Maharashtra: {
    duty: "0.25% of total rent + deposit",
    fee: "₹1,000 Urban / ₹500 Rural",
    note: "Maharashtra requires compulsory registration on IGR portal even for 11 months.",
  },
  Delhi: {
    duty: "2% of average annual rent",
    fee: "₹1,100 Registration fee",
    note: "11-month rent agreement executed on ₹100 non-judicial e-stamp paper with notary.",
  },
  "Uttar Pradesh": {
    duty: "2% of annual rent + deposit",
    fee: "₹100 e-stamp for <11 months",
    note: "Standard 11-month lease executed on ₹100 e-stamp with 2 witness signatures.",
  },
  "Tamil Nadu": {
    duty: "1% of total rent + deposit",
    fee: "1% registration fee",
    note: "Tamil Nadu Regulation of Rights and Responsibilities of Landlords and Tenants Act.",
  },
  Telangana: {
    duty: "0.5% of total rent",
    fee: "₹500 - ₹1,000",
    note: "Standard non-judicial stamp paper of ₹100 with notarization for 11 months.",
  },
};

export default function RentAgreementGeneratorPage() {
  const [selectedState, setSelectedState] = useState("Karnataka");
  const [landlordName, setLandlordName] = useState("Suresh Kumar");
  const [landlordFather, setLandlordFather] = useState("Late Ram Prasad Kumar");
  const [landlordAddress, setLandlordAddress] = useState("No. 45, 2nd Main, Indiranagar, Bengaluru - 560038");
  
  const [tenantName, setTenantName] = useState("Priya Nair");
  const [tenantFather, setTenantFather] = useState("K. Narayanan Nair");
  const [tenantAddress, setTenantAddress] = useState("House No. 12, MG Road, Ernakulam, Kerala - 682016");

  const [propertyAddress, setPropertyAddress] = useState("Flat No. 302, 3rd Floor, Green Meadows, 5th Cross, HSR Layout Sector 2, Bengaluru, Karnataka - 560102");
  const [monthlyRent, setMonthlyRent] = useState<number>(26000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(80000);
  const [maintenanceAmount, setMaintenanceAmount] = useState<number>(3000);
  const [startDate, setStartDate] = useState("2026-04-01");
  const [noticePeriodDays, setNoticePeriodDays] = useState(30);
  const [lockInMonths, setLockInMonths] = useState(6);
  const [escalationPercent, setEscalationPercent] = useState(7);

  // Compute 11 months end date
  const computeEndDate = (start: string) => {
    try {
      const d = new Date(start);
      d.setMonth(d.getMonth() + 11);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split("T")[0];
    } catch {
      return "2027-02-28";
    }
  };

  const endDate = computeEndDate(startDate);

  const handlePrint = () => {
    window.print();
  };

  const dutyInfo = stateStampDuty[selectedState] || stateStampDuty["Karnataka"];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans">

      {/* Header */}
      <div className="bg-white border-b border-black/[0.08] py-6 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#86868b] mb-1">
              <Link href="/tools" className="hover:text-[#0071e3] transition flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Free Rental Tools</span>
              </Link>
              <span>/</span>
              <span className="text-[#1d1d1f] font-medium">Rental Agreement Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] flex items-center space-x-2.5">
              <span>11-Month Rental Agreement Generator</span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.06]">
                MTA 2021 Compliant
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="apple-btn-primary px-5 py-2.5 text-xs sm:text-sm font-medium inline-flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Agreement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="apple-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <span className="text-[#1d1d1f] font-semibold text-sm flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#0071e3]" />
                <span>Agreement Parameters</span>
              </span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-xl border border-black/[0.1] bg-[#f5f5f7] text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              >
                {Object.keys(stateStampDuty).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Stamp Duty Card */}
            <div className="p-3.5 bg-[#f5f5f7] border border-black/[0.06] rounded-2xl text-xs space-y-1">
              <div className="font-semibold text-[#1d1d1f] flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
                <span>Stamp Duty ({selectedState}): {dutyInfo.duty}</span>
              </div>
              <p className="text-[#86868b] text-[11px] leading-relaxed">{dutyInfo.note}</p>
            </div>

            {/* Landlord Details */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wide">1. Landlord (First Party)</div>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Landlord Legal Name</label>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Father&apos;s / Husband&apos;s Name</label>
                <input
                  type="text"
                  value={landlordFather}
                  onChange={(e) => setLandlordFather(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Permanent Residential Address</label>
                <textarea
                  rows={2}
                  value={landlordAddress}
                  onChange={(e) => setLandlordAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
            </div>

            {/* Tenant Details */}
            <div className="space-y-3 pt-3 border-t border-black/[0.06]">
              <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wide">2. Tenant (Second Party)</div>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Tenant Full Legal Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Father&apos;s / Guardian&apos;s Name</label>
                <input
                  type="text"
                  value={tenantFather}
                  onChange={(e) => setTenantFather(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Permanent Address</label>
                <textarea
                  rows={2}
                  value={tenantAddress}
                  onChange={(e) => setTenantAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>
            </div>

            {/* Financials & Duration */}
            <div className="space-y-3 pt-3 border-t border-black/[0.06]">
              <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wide">3. Commercials & Tenancy Period</div>
              <div>
                <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Rented Premises Description</label>
                <textarea
                  rows={2}
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={monthlyRent || ""}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={securityDeposit || ""}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs font-semibold text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Maintenance (₹/mo)</label>
                  <input
                    type="number"
                    value={maintenanceAmount || ""}
                    onChange={(e) => setMaintenanceAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1d1d1f] mb-1">Commencement Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-black/[0.1] text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-[#1d1d1f] mb-1">Notice (Days)</label>
                  <input
                    type="number"
                    value={noticePeriodDays}
                    onChange={(e) => setNoticePeriodDays(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-black/[0.1] text-center text-xs font-semibold text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#1d1d1f] mb-1">Lock-in (Mo)</label>
                  <input
                    type="number"
                    value={lockInMonths}
                    onChange={(e) => setLockInMonths(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-black/[0.1] text-center text-xs font-semibold text-[#1d1d1f]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#1d1d1f] mb-1">Escalation %</label>
                  <input
                    type="number"
                    value={escalationPercent}
                    onChange={(e) => setEscalationPercent(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-black/[0.1] text-center text-xs font-semibold text-[#1d1d1f]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Printable Legal Agreement */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#86868b] print:hidden px-1">
              <span className="font-semibold uppercase tracking-wide text-[#1d1d1f]">Court-Ready Legal Draft</span>
              <span>11-Month Tenancy Template</span>
            </div>

            <div className="bg-white border border-black/[0.1] rounded-2xl p-8 sm:p-12 shadow-xl relative print:border-none print:shadow-none print:p-0 text-[#1d1d1f] font-serif leading-relaxed text-sm">
              
              {/* E-Stamp paper placeholder slot */}
              <div className="border border-black/[0.1] rounded-xl p-5 text-center text-xs font-sans text-[#86868b] mb-8 bg-[#f5f5f7]">
                <div className="font-semibold uppercase tracking-widest text-[#1d1d1f] text-xs">
                  Government of {selectedState} — Official e-Stamp Certificate Area
                </div>
                <p className="text-[11px] text-[#86868b] mt-1">
                  (Attach Non-Judicial Stamp Paper Certificate Here — Standard Value {dutyInfo.duty})
                </p>
              </div>

              {/* Agreement Title */}
              <div className="text-center mb-8 font-sans">
                <h2 className="text-xl font-bold uppercase tracking-wider text-[#1d1d1f]">
                  Residential Rental Agreement
                </h2>
                <p className="text-xs text-[#86868b] mt-1">
                  This Rent Agreement is made and executed on this{" "}
                  <strong>{new Date(startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>{" "}
                  by and between:
                </p>
              </div>

              {/* Parties */}
              <div className="space-y-4 mb-6 text-xs sm:text-sm">
                <p>
                  <strong>Mr./Mrs. {landlordName}</strong>, S/o or W/o {landlordFather}, residing at {landlordAddress} (hereinafter referred to as the <strong>&quot;LESSOR / FIRST PARTY&quot;</strong>, which expression shall unless repugnant to the context include heirs, legal representatives, and assigns) of the ONE PART.
                </p>
                <div className="text-center font-semibold text-xs uppercase tracking-widest my-2 font-sans text-[#86868b]">
                  — AND —
                </div>
                <p>
                  <strong>Mr./Ms. {tenantName}</strong>, S/o or D/o {tenantFather}, residing permanently at {tenantAddress} (hereinafter referred to as the <strong>&quot;LESSEE / SECOND PARTY&quot;</strong>, which expression shall unless excluded by context include heirs, executors, and assigns) of the OTHER PART.
                </p>
              </div>

              <div className="border-t border-black/[0.08] pt-4 mb-4 text-xs font-sans text-[#86868b] italic">
                WHEREAS the Lessor is the absolute owner of the premises situated at {propertyAddress} (hereinafter referred to as the &quot;SCHEDULE PROPERTY&quot;).
              </div>

              {/* Clauses */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="font-sans font-semibold text-xs uppercase tracking-wider text-[#1d1d1f] mb-2">
                  NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:
                </div>

                <p>
                  <strong>1. DURATION:</strong> This tenancy is granted for an initial term of <strong>11 (Eleven) months</strong> commencing from <strong>{startDate}</strong> and ending on <strong>{endDate}</strong>.
                </p>

                <p>
                  <strong>2. MONTHLY RENT:</strong> The Lessee shall pay to the Lessor a monthly rent of <strong>₹{monthlyRent.toLocaleString("en-IN")}</strong> per month, payable in advance on or before the 5th day of every calendar month. Maintenance of ₹{maintenanceAmount}/month shall be paid {maintenanceAmount > 0 ? "separately" : "inclusive"}.
                </p>

                <p>
                  <strong>3. SECURITY DEPOSIT:</strong> The Lessee has deposited with the Lessor a sum of <strong>₹{securityDeposit.toLocaleString("en-IN")}</strong> as an interest-free refundable security deposit. This deposit shall be refunded upon vacating after deducting unpaid rent, electricity bills, and damages if any.
                </p>

                <p>
                  <strong>4. NOTICE PERIOD:</strong> Either party may terminate this agreement by serving <strong>{noticePeriodDays} days written notice</strong> or rent in lieu thereof.
                </p>

                <p>
                  <strong>5. LOCK-IN PERIOD:</strong> Both parties agree to a minimum lock-in period of <strong>{lockInMonths} months</strong> during which neither party shall terminate without mutual consent.
                </p>

                <p>
                  <strong>6. RENEWAL & ESCALATION:</strong> On expiry of 11 months, if mutually agreed, the tenancy may be renewed with a <strong>{escalationPercent}% increment</strong> on existing rent.
                </p>

                <p>
                  <strong>7. USE OF PREMISES:</strong> The Lessee shall use the schedule property exclusively for peaceful residential purposes and not for any unlawful or commercial activities.
                </p>
              </div>

              {/* Signatures */}
              <div className="mt-12 pt-8 border-t border-black/[0.2] grid grid-cols-2 gap-8 text-xs font-sans">
                <div>
                  <div className="h-16 border-b border-dashed border-black/[0.2] flex items-end pb-1">
                    <span className="text-[10px] text-[#86868b]">Signature</span>
                  </div>
                  <div className="font-semibold text-[#1d1d1f] mt-1">{landlordName}</div>
                  <div className="text-[#86868b]">LESSOR (FIRST PARTY)</div>
                </div>

                <div>
                  <div className="h-16 border-b border-dashed border-black/[0.2] flex items-end pb-1">
                    <span className="text-[10px] text-[#86868b]">Signature</span>
                  </div>
                  <div className="font-semibold text-[#1d1d1f] mt-1">{tenantName}</div>
                  <div className="text-[#86868b]">LESSEE (SECOND PARTY)</div>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-medium text-[#1d1d1f]">WITNESS 1:</div>
                  <div className="text-[11px] text-[#86868b]">Name & Address: ___________________</div>
                  <div className="text-[11px] text-[#86868b] mt-4">Signature: _________________________</div>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-medium text-[#1d1d1f]">WITNESS 2:</div>
                  <div className="text-[11px] text-[#86868b]">Name & Address: ___________________</div>
                  <div className="text-[11px] text-[#86868b] mt-4">Signature: _________________________</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="apple-btn-primary px-6 py-3 text-sm font-medium inline-flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Agreement</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
