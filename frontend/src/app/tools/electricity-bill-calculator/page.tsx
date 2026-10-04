"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap, ArrowLeft, Printer, Calculator, IndianRupee,
  Building2, Users, CheckCircle2, Info, Share2
} from "lucide-react";


interface StateTariff {
  state: string;
  discom: string;
  fixedRateDefault: number;
  slabs: { upTo: number; rate: number }[];
  fixedCharge: number;
}

const indianTariffs: StateTariff[] = [
  {
    state: "Karnataka",
    discom: "BESCOM (Bengaluru)",
    fixedRateDefault: 10,
    slabs: [
      { upTo: 100, rate: 4.75 },
      { upTo: 9999, rate: 7.00 },
    ],
    fixedCharge: 110,
  },
  {
    state: "Maharashtra",
    discom: "MSEDCL / Adani (Mumbai/Pune)",
    fixedRateDefault: 11,
    slabs: [
      { upTo: 100, rate: 5.88 },
      { upTo: 300, rate: 11.26 },
      { upTo: 9999, rate: 15.72 },
    ],
    fixedCharge: 138,
  },
  {
    state: "Delhi NCR",
    discom: "BSES Yamuna / Rajdhani",
    fixedRateDefault: 9,
    slabs: [
      { upTo: 200, rate: 3.00 },
      { upTo: 400, rate: 4.50 },
      { upTo: 9999, rate: 6.50 },
    ],
    fixedCharge: 100,
  },
  {
    state: "Uttar Pradesh",
    discom: "UPPCL (Noida / Lucknow)",
    fixedRateDefault: 9.5,
    slabs: [
      { upTo: 150, rate: 5.50 },
      { upTo: 300, rate: 6.00 },
      { upTo: 9999, rate: 7.00 },
    ],
    fixedCharge: 110,
  },
  {
    state: "Tamil Nadu",
    discom: "TANGEDCO (Chennai)",
    fixedRateDefault: 9,
    slabs: [
      { upTo: 100, rate: 0.00 },
      { upTo: 200, rate: 2.25 },
      { upTo: 400, rate: 4.50 },
      { upTo: 9999, rate: 6.00 },
    ],
    fixedCharge: 50,
  },
  {
    state: "Gujarat",
    discom: "UGVCL / Torrent (Ahmedabad/Vadodara)",
    fixedRateDefault: 9,
    slabs: [
      { upTo: 100, rate: 3.50 },
      { upTo: 250, rate: 4.70 },
      { upTo: 9999, rate: 5.80 },
    ],
    fixedCharge: 70,
  },
];

export default function ElectricityCalculatorPage() {
  const [previousReading, setPreviousReading] = useState<number>(1420);
  const [currentReading, setCurrentReading] = useState<number>(1685);
  const [calcMode, setCalcMode] = useState<"FIXED" | "SLAB">("FIXED");
  const [selectedStateIndex, setSelectedStateIndex] = useState<number>(0);
  const [customFixedRate, setCustomFixedRate] = useState<number>(10);
  const [fixedMeterCharge, setFixedMeterCharge] = useState<number>(100);
  const [commonAreaShare, setCommonAreaShare] = useState<number>(150);
  const [roommatesCount, setRoommatesCount] = useState<number>(2);
  const [roomNumber, setRoomNumber] = useState("Room 204 (Double Sharing)");
  const [propertyName, setPropertyName] = useState("Greenwood PG & Co-Living");
  const [billingPeriod, setBillingPeriod] = useState("1 Feb 2026 – 28 Feb 2026");

  // Calculations
  const unitsConsumed = Math.max(0, (currentReading || 0) - (previousReading || 0));

  const calculateEnergyCharges = () => {
    if (calcMode === "FIXED") {
      return unitsConsumed * customFixedRate;
    }
    // Slab calculation
    const tariff = indianTariffs[selectedStateIndex];
    let remaining = unitsConsumed;
    let total = 0;
    let prevLimit = 0;

    for (const slab of tariff.slabs) {
      if (remaining <= 0) break;
      const slabUnits = Math.min(remaining, slab.upTo - prevLimit);
      total += slabUnits * slab.rate;
      remaining -= slabUnits;
      prevLimit = slab.upTo;
    }
    return total;
  };

  const energyCharges = calculateEnergyCharges();
  const totalBill = energyCharges + (fixedMeterCharge || 0) + (commonAreaShare || 0);
  const perTenantShare = roommatesCount > 0 ? totalBill / roommatesCount : totalBill;

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
              <span className="text-slate-800 font-semibold">Electricity Bill Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span>PG & Sub-Meter Electricity Calculator</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Dispute-Free
              </span>
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-amber-600 text-white text-xs sm:text-sm font-bold hover:bg-amber-700 shadow-md shadow-amber-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Bill Statement</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Sub-Meter Readings & Rates</span>
            </div>

            {/* Room & Property */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Name</label>
                <input
                  type="text"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Unit</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Meter Readings */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-amber-50/50 border border-amber-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous Reading (kWh)
                </label>
                <input
                  type="number"
                  value={previousReading || ""}
                  onChange={(e) => setPreviousReading(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Reading (kWh)
                </label>
                <input
                  type="number"
                  value={currentReading || ""}
                  onChange={(e) => setCurrentReading(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="col-span-2 pt-2 border-t border-amber-200 flex justify-between items-center text-xs">
                <span className="text-amber-900 font-semibold">Net Units Consumed:</span>
                <span className="text-base font-black text-amber-700 font-mono">
                  {unitsConsumed} Units (kWh)
                </span>
              </div>
            </div>

            {/* Billing Mode: Fixed vs Slab */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Calculation Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCalcMode("FIXED")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    calcMode === "FIXED"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Fixed Commercial PG Rate
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode("SLAB")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    calcMode === "SLAB"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  DISCOM Slab Rates
                </button>
              </div>
            </div>

            {calcMode === "FIXED" ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rate Per Unit (₹/kWh)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={customFixedRate}
                    onChange={(e) => setCustomFixedRate(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Typical Bangalore/Pune/Delhi PG rate: ₹9 - ₹12/unit (includes common power & generator backup).
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select State DISCOM</label>
                <select
                  value={selectedStateIndex}
                  onChange={(e) => setSelectedStateIndex(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {indianTariffs.map((t, idx) => (
                    <option key={t.state} value={idx}>
                      {t.state} — {t.discom}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Additional Charges & Sharing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Meter Fixed Fee (₹)</label>
                <input
                  type="number"
                  value={fixedMeterCharge}
                  onChange={(e) => setFixedMeterCharge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Common Area (₹)</label>
                <input
                  type="number"
                  value={commonAreaShare}
                  onChange={(e) => setCommonAreaShare(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Room Occupants</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={roommatesCount}
                  onChange={(e) => setRoommatesCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Period</label>
              <input
                type="text"
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Printable Invoice Statement */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 print:hidden px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Electricity Share Statement</span>
              <span>Transparent Itemized Breakdown</span>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Electricity Sub-Meter Statement</span>
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-semibold">{propertyName}</p>
                  <p className="text-[11px] text-slate-500">{roomNumber}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-700">Period: {billingPeriod}</div>
                  <div className="text-xs text-slate-500 mt-1">Generated: {new Date().toLocaleDateString("en-IN")}</div>
                </div>
              </div>

              {/* Meter Readings Table */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Meter Log</div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Previous</div>
                    <div className="font-mono font-black text-sm text-slate-800">{previousReading} kWh</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-slate-400 text-[10px] uppercase font-bold">Current</div>
                    <div className="font-mono font-black text-sm text-slate-800">{currentReading} kWh</div>
                  </div>
                  <div className="bg-amber-100 p-2.5 rounded-lg border border-amber-300">
                    <div className="text-amber-800 text-[10px] uppercase font-bold">Consumed</div>
                    <div className="font-mono font-black text-base text-amber-900">{unitsConsumed} kWh</div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown Table */}
              <table className="w-full text-xs text-slate-800 mb-6">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="text-left py-2">Item Description</th>
                    <th className="text-center py-2">Units / Rate</th>
                    <th className="text-right py-2">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-medium">Room Energy Consumption</td>
                    <td className="py-2.5 text-center text-slate-500">
                      {unitsConsumed} units @ ₹{calcMode === "FIXED" ? customFixedRate : "Slab"}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold">
                      ₹{energyCharges.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Sub-Meter Fixed / Service Charge</td>
                    <td className="py-2.5 text-center text-slate-500">Fixed Monthly</td>
                    <td className="py-2.5 text-right font-mono font-bold">
                      ₹{fixedMeterCharge.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Common Area Share (Lift, Pump, Lobby)</td>
                    <td className="py-2.5 text-center text-slate-500">Pro-rata share</td>
                    <td className="py-2.5 text-right font-mono font-bold">
                      ₹{commonAreaShare.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-slate-800 font-bold bg-slate-50">
                    <td className="py-3 px-2 text-slate-900">Total Room Electricity Dues</td>
                    <td className="py-3 text-center text-slate-500 font-normal">
                      Split across {roommatesCount} {roommatesCount > 1 ? "roommates" : "occupant"}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-base text-slate-900">
                      ₹{totalBill.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Per Tenant Highlight */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-100">Your Share Due</div>
                  <div className="text-[11px] text-amber-100">Per occupant ({roommatesCount} sharing)</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono">₹{perTenantShare.toFixed(2)}</div>
                  <div className="text-[10px] text-amber-100">Please pay along with monthly rent</div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                <span>Calculated via eRentKarar Sub-meter Utility System</span>
                <span>Transparent & Dispute-Free</span>
              </div>
            </div>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 shadow-md shadow-amber-600/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill Statement</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
