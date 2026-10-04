"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, ArrowLeft, Printer, Building2, User,
  IndianRupee, ShieldCheck, FileText
} from "lucide-react";


export default function DepositReceiptGeneratorPage() {
  const [ownerName, setOwnerName] = useState("Kailash Sharma");
  const [tenantName, setTenantName] = useState("Tanvi Singhal");
  const [propertyAddress, setPropertyAddress] = useState("Apt 601, Prestige Falcon City, Kanakapura Road, Bengaluru - 560062");
  const [depositAmount, setDepositAmount] = useState<number>(75000);
  const [paymentDate, setPaymentDate] = useState("2026-03-15");
  const [paymentMode, setPaymentMode] = useState("UPI / IMPS");
  const [transactionRef, setTransactionRef] = useState("IMPS/607519283401");
  const [receiptNumber, setReceiptNumber] = useState("ERK-DEP-2026-0129");

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
              <span className="text-slate-800 font-semibold">Deposit Receipt Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span>Security Deposit Receipt Generator</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Official Acknowledgment
              </span>
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Deposit Receipt</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <span>Deposit Receipt Details</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Landlord / Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tenant Full Name</label>
                <input
                  type="text"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Address</label>
              <textarea
                rows={2}
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deposit Amount (₹)</label>
                <input
                  type="number"
                  value={depositAmount || ""}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
                <input
                  type="text"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Txn / UTR Reference</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Printable Deposit Receipt */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 print:hidden px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Official Deposit Acknowledgment</span>
              <span>Printable Document</span>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0 text-slate-900 font-sans leading-relaxed text-xs sm:text-sm">
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    Security Deposit Receipt
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Official Advance Deposit Acknowledgment</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-700">{receiptNumber}</div>
                  <div className="text-xs text-slate-500 mt-1">Date: {paymentDate}</div>
                </div>
              </div>

              <div className="space-y-4 text-slate-800 text-sm mb-6">
                <p>
                  Received with thanks from <strong>{tenantName}</strong> a sum of{" "}
                  <strong className="text-indigo-900 font-bold">₹{depositAmount.toLocaleString("en-IN")}</strong> via {paymentMode} (Transaction Ref: <span className="font-mono">{transactionRef}</span>).
                </p>

                <p>
                  Towards interest-free refundable security deposit for residential tenancy of property:
                  <br />
                  <span className="inline-block mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium w-full text-slate-900">
                    {propertyAddress}
                  </span>
                </p>
              </div>

              {/* Conditions Box */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs text-indigo-950 space-y-1.5 mb-8">
                <div className="font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Deposit Terms & Refund Conditions:</span>
                </div>
                <p>1. This deposit is interest-free and holds no claim on the property title.</p>
                <p>2. The deposit will be refunded in full upon peaceful handover of premises within 15 days after deducting unpaid rent, utility dues, and painting/repair charges as agreed in the tenancy agreement.</p>
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">{tenantName}</div>
                  <div className="text-slate-500">Tenant (Depositor)</div>
                </div>
                <div>
                  <div className="h-14 border-b border-dashed border-slate-400"></div>
                  <div className="font-bold mt-1">{ownerName}</div>
                  <div className="text-slate-500">Owner / Landlord (Recipient)</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Deposit Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
