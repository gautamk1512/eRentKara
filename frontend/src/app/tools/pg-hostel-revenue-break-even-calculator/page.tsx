"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IndianRupee, ArrowLeft, Printer, TrendingUp,
  Building2, Users, PieChart, Sparkles, CheckCircle2
} from "lucide-react";


export default function PgHostelRevenueCalculatorPage() {
  const [totalBeds, setTotalBeds] = useState<number>(60);
  const [occupancyRate, setOccupancyRate] = useState<number>(85); // 85%
  const [avgRentPerBed, setAvgRentPerBed] = useState<number>(9500);

  // Operating Costs
  const [buildingLeaseRent, setBuildingLeaseRent] = useState<number>(180000);
  const [foodCostPerTenant, setFoodCostPerTenant] = useState<number>(2500);
  const [staffSalaries, setStaffSalaries] = useState<number>(45000); // 1 manager, 1 cook, 1 housekeeping
  const [electricityWaterBill, setElectricityWaterBill] = useState<number>(35000);
  const [internetMaintenance, setInternetMaintenance] = useState<number>(12000);

  // Calculations
  const occupiedBeds = Math.round((totalBeds * occupancyRate) / 100);
  const grossMonthlyRevenue = occupiedBeds * avgRentPerBed;
  const totalFoodCost = occupiedBeds * foodCostPerTenant;

  const totalFixedCosts = buildingLeaseRent + staffSalaries + internetMaintenance;
  const totalVariableCosts = totalFoodCost + electricityWaterBill;
  const totalMonthlyExpenses = totalFixedCosts + totalVariableCosts;

  const netMonthlyProfit = grossMonthlyRevenue - totalMonthlyExpenses;
  const annualProfit = netMonthlyProfit * 12;
  const profitMargin = grossMonthlyRevenue > 0 ? (netMonthlyProfit / grossMonthlyRevenue) * 100 : 0;

  // Break-even occupied beds needed
  // revenue per bed = avgRentPerBed - foodCostPerTenant (contribution margin per bed)
  const contributionPerBed = avgRentPerBed - foodCostPerTenant;
  const fixedOverheads = buildingLeaseRent + staffSalaries + electricityWaterBill + internetMaintenance;
  const breakEvenBeds = contributionPerBed > 0 ? Math.ceil(fixedOverheads / contributionPerBed) : totalBeds;
  const breakEvenOccupancy = Math.min(100, Math.round((breakEvenBeds / totalBeds) * 100));

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
              <span className="text-slate-800 font-semibold">PG Revenue & Break-Even Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center space-x-2">
              <span>PG & Hostel Business Feasibility Calculator</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                ROI & Profit Modeler
              </span>
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Feasibility Report</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 print:p-0 print:max-w-none print:block">
        {/* Left Inputs */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Property Capacity & Rent</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Bed Capacity</label>
                <input
                  type="number"
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Avg Rent / Bed (₹)</label>
                <input
                  type="number"
                  value={avgRentPerBed}
                  onChange={(e) => setAvgRentPerBed(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Occupancy Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                <span>Occupancy Rate ({occupancyRate}%)</span>
                <span className="font-bold text-emerald-600 font-mono">{occupiedBeds} of {totalBeds} Beds Filled</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={occupancyRate}
                onChange={(e) => setOccupancyRate(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Operating Costs */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Operating Expenses</div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Building Lease / Rent (₹/mo)</label>
                <input
                  type="number"
                  value={buildingLeaseRent}
                  onChange={(e) => setBuildingLeaseRent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Food / Tenant (₹/mo)</label>
                  <input
                    type="number"
                    value={foodCostPerTenant}
                    onChange={(e) => setFoodCostPerTenant(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Staff Payroll (₹/mo)</label>
                  <input
                    type="number"
                    value={staffSalaries}
                    onChange={(e) => setStaffSalaries(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Power + Water (₹/mo)</label>
                  <input
                    type="number"
                    value={electricityWaterBill}
                    onChange={(e) => setElectricityWaterBill(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">WiFi + Misc (₹/mo)</label>
                  <input
                    type="number"
                    value={internetMaintenance}
                    onChange={(e) => setInternetMaintenance(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Financial Report */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 print:hidden px-1">
              <span className="font-semibold uppercase tracking-wider text-slate-700">Financial Summary & Metrics</span>
              <span>Based on {occupancyRate}% Occupancy</span>
            </div>

            <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 sm:p-10 shadow-lg relative print:border-none print:shadow-none print:p-0 text-slate-900 font-sans">
              <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    PG Profit & Feasibility Analysis
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {totalBeds} Beds Capacity • {occupiedBeds} Beds Occupied ({occupancyRate}%)
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${profitMargin >= 20 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {profitMargin.toFixed(1)}% Net Margin
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Gross Monthly Rent</div>
                  <div className="text-base sm:text-lg font-black font-mono text-slate-900 mt-1">
                    ₹{grossMonthlyRevenue.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                  <div className="text-[10px] uppercase font-bold text-rose-600">Total Monthly Cost</div>
                  <div className="text-base sm:text-lg font-black font-mono text-rose-800 mt-1">
                    ₹{totalMonthlyExpenses.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Net Monthly Profit</div>
                  <div className={`text-base sm:text-lg font-black font-mono mt-1 ${netMonthlyProfit >= 0 ? "text-emerald-800" : "text-rose-600"}`}>
                    ₹{netMonthlyProfit.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <table className="w-full border border-slate-200 mb-6 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider">
                    <th className="text-left p-2.5">Category</th>
                    <th className="text-right p-2.5">Monthly Amount</th>
                    <th className="text-right p-2.5">% Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-800">Building Lease / Rent</td>
                    <td className="p-2.5 text-right font-mono font-medium">₹{buildingLeaseRent.toLocaleString("en-IN")}</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">{((buildingLeaseRent / (grossMonthlyRevenue || 1)) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-800">Mess / Grocery / Food ({occupiedBeds} tenants)</td>
                    <td className="p-2.5 text-right font-mono font-medium">₹{totalFoodCost.toLocaleString("en-IN")}</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">{((totalFoodCost / (grossMonthlyRevenue || 1)) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-800">Staff Salaries & Housekeeping</td>
                    <td className="p-2.5 text-right font-mono font-medium">₹{staffSalaries.toLocaleString("en-IN")}</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">{((staffSalaries / (grossMonthlyRevenue || 1)) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-800">Electricity, Water & Maintenance</td>
                    <td className="p-2.5 text-right font-mono font-medium">₹{(electricityWaterBill + internetMaintenance).toLocaleString("en-IN")}</td>
                    <td className="p-2.5 text-right font-mono text-slate-500">{(((electricityWaterBill + internetMaintenance) / (grossMonthlyRevenue || 1)) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold border-t-2 border-slate-900 text-sm">
                    <td className="p-3">Annualized Net Take-Home:</td>
                    <td colSpan={2} className="p-3 text-right font-mono text-emerald-800 text-base">
                      ₹{annualProfit.toLocaleString("en-IN")} / year
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Break-even Insight Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between text-xs text-blue-900">
                <div className="space-y-0.5">
                  <div className="font-bold flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Break-Even Occupancy Threshold:</span>
                  </div>
                  <p className="text-[11px] text-blue-700">
                    You need minimum <strong>{breakEvenBeds} occupied beds ({breakEvenOccupancy}%)</strong> each month to cover all fixed costs.
                  </p>
                </div>
                <div className="text-xl font-black font-mono text-blue-800 shrink-0">
                  {breakEvenOccupancy}%
                </div>
              </div>
            </div>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Feasibility Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
