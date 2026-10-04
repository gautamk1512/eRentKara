"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calculator, ArrowLeft, Printer, IndianRupee,
  CheckCircle2, AlertTriangle, Building2, User, FileText
} from "lucide-react";


export default function MoveOutSettlementCalculatorPage() {
  const [tenantName, setTenantName] = useState("Vikas Mehta");
  const [ownerName, setOwnerName] = useState("Anand Swaroop");
  const [propertyAddress, setPropertyAddress] = useState("Flat 201, Maple Woods, Hinjewadi Phase 1, Pune");
  const [depositPaid, setDepositPaid] = useState<number>(60000);
  const [monthlyRent, setMonthlyRent] = useState<number>(20000);

  // Deductions
  const [paintingCharge, setPaintingCharge] = useState<number>(6000);
  const [cleaningCharge, setCleaningCharge] = useState<number>(1500);
  const [unpaidElectricity, setUnpaidElectricity] = useState<number>(1850);
  const [unpaidWaterMaintenance, setUnpaidWaterMaintenance] = useState<number>(800);
  const [repairDamages, setRepairDamages] = useState<number>(1200);
  const [noticeShortfallDays, setNoticeShortfallDays] = useState<number>(0);
  const [tenantUpi, setTenantUpi] = useState("vikas.mehta@okhdfcbank");

  const dailyRent = monthlyRent / 30;
  const noticeShortfallDeduction = noticeShortfallDays * dailyRent;

  const totalDeductions =
    paintingCharge +
    cleaningCharge +
    unpaidElectricity +
    unpaidWaterMaintenance +
    repairDamages +
    noticeShortfallDeduction;

  const netRefund = Math.max(0, depositPaid - totalDeductions);

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
              <Link href="/tools" className="hover:text-emerald-600 transition flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Free Rental Tools</span>
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Deposit Settlement Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span>Move-Out & Security Deposit Settlement</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                100% Transparent
              </span>
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-rose-600 text-white text-xs sm:text-sm font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Settlement Voucher</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Calculator className="w-5 h-5 text-rose-600" />
              <span>Deposit & Deduction Items</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deposit Paid (₹)</label>
                <input
                  type="number"
                  value={depositPaid || ""}
                  onChange={(e) => setDepositPaid(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={monthlyRent || ""}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
                />
              </div>
            </div>

            {/* Deductions breakdown */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Itemized Deductions</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Painting / Whitewash (₹)</label>
                  <input
                    type="number"
                    value={paintingCharge || ""}
                    onChange={(e) => setPaintingCharge(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Deep Cleaning Fee (₹)</label>
                  <input
                    type="number"
                    value={cleaningCharge || ""}
                    onChange={(e) => setCleaningCharge(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Electricity Dues (₹)</label>
                  <input
                    type="number"
                    value={unpaidElectricity || ""}
                    onChange={(e) => setUnpaidElectricity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Water / Maintenance (₹)</label>
                  <input
                    type="number"
                    value={unpaidWaterMaintenance || ""}
                    onChange={(e) => setUnpaidWaterMaintenance(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Repairs / Damages (₹)</label>
                  <input
                    type="number"
                    value={repairDamages || ""}
                    onChange={(e) => setRepairDamages(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Notice Shortfall (Days)</label>
                  <input
                    type="number"
                    value={noticeShortfallDays || ""}
                    onChange={(e) => setNoticeShortfallDays(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="e.g. 10 days"
                  />
                </div>
              </div>
            </div>

            {/* Tenant Refund Destination */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tenant UPI / Bank Account for Refund</label>
              <input
                type="text"
                value={tenantUpi}
                onChange={(e) => setTenantUpi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Printable Voucher */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 print:hidden px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Settlement Voucher & Clearance</span>
              <span>No-Dues Agreement</span>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0 text-xs sm:text-sm text-slate-900 leading-relaxed font-sans">
              <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  Security Deposit Settlement & No-Dues Voucher
                </h2>
                <p className="text-xs text-slate-500 mt-1">{propertyAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Vacating Tenant:</span>
                  <div className="font-bold text-slate-900">{tenantName}</div>
                </div>
                <div>
                  <span className="text-slate-500">Property Owner / Landlord:</span>
                  <div className="font-bold text-slate-900">{ownerName}</div>
                </div>
              </div>

              {/* Settlement Accounting Table */}
              <table className="w-full border border-slate-200 mb-6 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-600">
                    <th className="text-left p-2.5">Accounting Head</th>
                    <th className="text-right p-2.5">Credit / (Debit) Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="font-semibold bg-emerald-50/50">
                    <td className="p-2.5 text-emerald-900">Original Security Deposit Received</td>
                    <td className="p-2.5 text-right font-mono text-emerald-700 font-bold">+₹{depositPaid.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-700">Painting & Touch-up Charge</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">-₹{paintingCharge.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-700">Deep Cleaning Fee</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">-₹{cleaningCharge.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-700">Final Electricity Meter Bill</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">-₹{unpaidElectricity.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-700">Water / Society Maintenance Dues</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">-₹{unpaidWaterMaintenance.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-700">Damage / Fixture Repair</td>
                    <td className="p-2.5 text-right font-mono text-rose-600">-₹{repairDamages.toLocaleString("en-IN")}</td>
                  </tr>
                  {noticeShortfallDays > 0 && (
                    <tr>
                      <td className="p-2.5 text-slate-700">Notice Period Shortfall ({noticeShortfallDays} days @ ₹{Math.round(dailyRent)}/day)</td>
                      <td className="p-2.5 text-right font-mono text-rose-600">-₹{Math.round(noticeShortfallDeduction).toLocaleString("en-IN")}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-slate-900 bg-slate-50 font-bold text-slate-900 text-sm">
                    <td className="p-3">Total Deductions Applied:</td>
                    <td className="p-3 text-right font-mono text-rose-700">-₹{Math.round(totalDeductions).toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
              </table>

              {/* Net Refund Highlight */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 flex items-center justify-between mb-6 shadow-md">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Net Refund Payable to Tenant</div>
                  <div className="text-[11px] text-emerald-100">Destination: {tenantUpi}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono">₹{Math.round(netRefund).toLocaleString("en-IN")}</div>
                  <div className="text-[10px] text-emerald-200">Full & Final Settlement</div>
                </div>
              </div>

              {/* Clearance statement */}
              <p className="text-[11px] text-slate-500 italic mb-8">
                Both parties acknowledge that all keys, gate passes, and appliances have been returned in satisfactory condition. Upon receipt of ₹{Math.round(netRefund).toLocaleString("en-IN")}, neither party shall have any further claims against each other.
              </p>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">Tenant Acceptance Signature</div>
                </div>
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">Owner / Landlord Signature</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 shadow-md shadow-rose-600/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Settlement Voucher</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
