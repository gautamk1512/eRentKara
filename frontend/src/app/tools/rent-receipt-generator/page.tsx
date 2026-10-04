"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Receipt, Printer, Download, ArrowLeft, ShieldCheck,
  CheckCircle2, Sparkles, Building2, User, IndianRupee, Info,
} from "lucide-react";


// Helper to convert number to Indian Currency Words
function numberToWordsINR(num: number): string {
  if (num === 0) return "Zero Rupees Only";
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const formatLessThanThousand = (n: number) => {
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + " ";
    }
    return str;
  };

  let result = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;

  if (crore > 0) result += formatLessThanThousand(crore) + "Crore ";
  if (lakh > 0) result += formatLessThanThousand(lakh) + "Lakh ";
  if (thousand > 0) result += formatLessThanThousand(thousand) + "Thousand ";
  if (num > 0) result += formatLessThanThousand(num);

  return (result.trim() + " Rupees Only");
}

export default function RentReceiptGeneratorPage() {
  const [tenantName, setTenantName] = useState("Aarav Sharma");
  const [landlordName, setLandlordName] = useState("Vikram Malhotra");
  const [landlordPan, setLandlordPan] = useState("ABCDE1234F");
  const [propertyAddress, setPropertyAddress] = useState("Flat 402, Sunshine Heights, Koramangala 4th Block, Bengaluru, Karnataka - 560034");
  const [rentAmount, setRentAmount] = useState(22000);
  const [rentMonth, setRentMonth] = useState("March 2026");
  const [paymentDate, setPaymentDate] = useState("2026-03-05");
  const [paymentMode, setPaymentMode] = useState("UPI / Bank Transfer");
  const [transactionId, setTransactionId] = useState("UPI/CR/202603058821");
  const [receiptNo, setReceiptNo] = useState("ERK-REC-2026-0038");

  const receiptRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const isPanRequired = (rentAmount * 12 > 100000) || (rentAmount > 8333);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Breadcrumb & Title */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#86868b] mb-1">
              <Link href="/tools" className="hover:text-[#0071e3] transition flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Free Rental Tools</span>
              </Link>
              <span>/</span>
              <span className="text-[#1d1d1f] font-semibold">Rent Receipt Generator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] flex items-center space-x-2">
              <span>HRA Rent Receipt Generator</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] text-[#1d1d1f] border border-black/[0.08]">
                100% Free
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="apple-btn-primary inline-flex items-center space-x-2 px-5 py-2.5 text-xs sm:text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        {/* Left Form (Hidden in print) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Receipt className="w-5 h-5 text-[#0071e3]" />
              <span>Fill Receipt Information</span>
            </div>

            {/* Tenant Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tenant Full Name (As per PAN/Aadhaar)
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Rahul Verma"
              />
            </div>

            {/* Landlord Name & PAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Landlord / Owner Name
                </label>
                <input
                  type="text"
                  value={landlordName}
                  onChange={(e) => setLandlordName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Ramesh Chandra"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Landlord PAN {isPanRequired && <span className="text-rose-500 font-bold">*</span>}
                </label>
                <input
                  type="text"
                  value={landlordPan}
                  onChange={(e) => setLandlordPan(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. ABCDE1234F"
                />
              </div>
            </div>

            {isPanRequired && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start space-x-2">
                <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>HRA Rule:</strong> Income Tax Department requires Landlord PAN if total annual rent exceeds ₹1,00,000 (₹8,333/month).
                </span>
              </div>
            )}

            {/* Property Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rented Property Full Address
              </label>
              <textarea
                rows={2}
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="House No, Flat No, Society, Landmark, City, State, PIN"
              />
            </div>

            {/* Rent Amount & Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  value={rentAmount || ""}
                  onChange={(e) => setRentAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rent Month
                </label>
                <input
                  type="text"
                  value={rentMonth}
                  onChange={(e) => setRentMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. March 2026"
                />
              </div>
            </div>

            {/* Payment Date & Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
                  <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Cash">Cash (With Revenue Stamp)</option>
                </select>
              </div>
            </div>

            {/* Transaction Ref */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Txn ID / Ref No / Cheque No
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. UPI Ref / Cheque No"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Receipt No
                </label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* HRA Tips Card */}
          <div className="bg-[#f5f5f7] border border-black/[0.08] rounded-3xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-[#1d1d1f] font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#0071e3]" />
              <span>HRA Tax Exemption Checklist</span>
            </div>
            <ul className="text-xs text-[#86868b] space-y-1.5 list-disc list-inside">
              <li>Submit this receipt to your HR or employer before 15th January/March.</li>
              <li>Affix a ₹1 Revenue Stamp if paid in cash above ₹5,000.</li>
              <li>Keep bank statements matching the payment dates as supporting proof.</li>
            </ul>
          </div>
        </div>

        {/* Right Printable Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 print:hidden px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Live Printable Preview</span>
              <span>Standard A4 Formatted</span>
            </div>

            {/* Physical Receipt Container */}
            <div
              ref={receiptRef}
              id="printable-receipt"
              className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0 print:m-0"
              style={{ minHeight: "560px" }}
            >
              {/* Header */}
              <div className="border-b-2 border-slate-800 pb-5 mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Rent Receipt
                  </h2>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">
                    Under Section 10(13A) of Income Tax Act 1961
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-700">
                    Receipt No: <span className="text-slate-900">{receiptNo}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Date: <span className="font-semibold text-slate-800">{paymentDate}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
                <p>
                  Received with thanks from Mr. / Ms.{" "}
                  <strong className="underline decoration-slate-400 font-bold text-slate-900">
                    {tenantName || "_______________________"}
                  </strong>
                  , a sum of{" "}
                  <strong className="underline decoration-slate-400 font-bold text-[#0071e3]">
                    ₹{rentAmount.toLocaleString("en-IN")}
                  </strong>{" "}
                  (Rupees{" "}
                  <span className="italic font-medium text-slate-700">
                    {numberToWordsINR(rentAmount)}
                  </span>
                  ).
                </p>

                <p>
                  Towards the monthly residential rent of property situated at:
                  <br />
                  <span className="inline-block mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 w-full">
                    {propertyAddress || "______________________________________________________"}
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed border-slate-300 text-xs">
                  <div>
                    <span className="text-slate-500">For the Period / Month:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{rentMonth}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment Mode & Ref:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                      {paymentMode} {transactionId ? `(${transactionId})` : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Landlord Details & Stamp / Signature Section */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6">
                <div className="space-y-1 text-xs text-slate-700 w-full sm:w-auto">
                  <div className="font-bold text-slate-900 text-sm">{landlordName}</div>
                  <div className="text-slate-500">Landlord / Property Owner</div>
                  {landlordPan && (
                    <div className="font-mono text-xs text-slate-800">
                      <strong>PAN:</strong> {landlordPan}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400 italic pt-2">
                    Verified through eRentKarar Rental Compliance Platform
                  </div>
                </div>

                {/* Simulated Indian Revenue Stamp (Required for cash payments) & Signature */}
                <div className="flex items-center space-x-6 shrink-0">
                  {paymentMode.toLowerCase().includes("cash") && (
                    <div className="w-16 h-20 border-2 border-rose-400 bg-rose-50 rounded flex flex-col items-center justify-center p-1 text-center relative overflow-hidden shadow-inner">
                      <div className="text-[8px] font-bold uppercase tracking-tighter text-rose-800">Revenue</div>
                      <div className="text-xs font-black text-rose-900 my-0.5">₹ 1</div>
                      <div className="text-[7px] text-rose-700">INDIA</div>
                      {/* Stamp Cross Line */}
                      <div className="absolute w-24 h-0.5 bg-rose-600/40 rotate-45" />
                    </div>
                  )}

                  <div className="text-center w-36">
                    <div className="h-14 border-b-2 border-slate-400 border-dashed flex items-end justify-center pb-1">
                      <span className="text-[10px] text-slate-400 italic">Signature across stamp</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 mt-1">Landlord Signature</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print action below */}
            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="apple-btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print or Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
