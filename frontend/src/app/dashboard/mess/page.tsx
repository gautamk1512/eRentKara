"use client";

import React, { useState } from "react";
import { Utensils, Calendar, CheckCircle2, X, ChevronLeft, ChevronRight } from "lucide-react";

const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const mealTypes = ["Breakfast","Lunch","Dinner"];

const sampleMenu: Record<string,Record<string,string>> = {
  Mon: { Breakfast: "Poha, Chai", Lunch: "Rice, Dal, Sabzi, Roti", Dinner: "Chapati, Paneer Curry" },
  Tue: { Breakfast: "Upma, Coffee", Lunch: "Rice, Rajma, Salad", Dinner: "Rice, Sambar, Papad" },
  Wed: { Breakfast: "Idli Sambar", Lunch: "Biryani, Raita", Dinner: "Roti, Mixed Veg" },
  Thu: { Breakfast: "Paratha, Curd", Lunch: "Rice, Chole, Roti", Dinner: "Dosa, Chutney" },
  Fri: { Breakfast: "Bread Omelette", Lunch: "Rice, Fish Curry / Paneer", Dinner: "Noodles, Manchurian" },
  Sat: { Breakfast: "Puri Bhaji", Lunch: "Pulao, Kadhi", Dinner: "Roti, Dal Fry" },
  Sun: { Breakfast: "Aloo Paratha", Lunch: "Special Thali", Dinner: "Light Meal / Khichdi" },
};

export default function DashboardMessPage() {
  const [activeDay, setActiveDay] = useState(weekDays[new Date().getDay() === 0 ? 6 : new Date().getDay()-1]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-xl font-black text-slate-900">Mess & Food Management</h1><p className="text-xs text-slate-500">Weekly menu, meal attendance, and mess billing</p></div>
        <button className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 shrink-0"><Utensils className="w-4 h-4"/><span>Edit Menu</span></button>
      </div>

      {/* Weekly Menu */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex gap-1 p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          {weekDays.map(d=>(
            <button key={d} onClick={()=>setActiveDay(d)} className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${activeDay===d?"bg-orange-600 text-white":"text-slate-600 hover:bg-slate-100"}`}>{d}</button>
          ))}
        </div>
        <div className="p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">{activeDay}&apos;s Menu</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mealTypes.map(meal=>(
              <div key={meal} className="bg-orange-50 rounded-xl border border-orange-200 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-600"/>
                  <span className="text-xs font-bold text-orange-800">{meal}</span>
                </div>
                <p className="text-xs text-slate-700">{sampleMenu[activeDay]?.[meal]||"Menu not set"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-black text-emerald-600">85%</p>
          <p className="text-xs text-slate-500">Breakfast Attendance</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-black text-orange-600">92%</p>
          <p className="text-xs text-slate-500">Lunch Attendance</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-black text-teal-600">78%</p>
          <p className="text-xs text-slate-500">Dinner Attendance</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
        <p className="font-bold">Coming Soon: Meal Opt-out, Per-Tenant Billing, Vendor Management, and Feedback</p>
        <p className="text-[10px] text-amber-600 mt-1">These features are part of Phase 5 and will be enabled with the next update.</p>
      </div>
    </div>
  );
}
