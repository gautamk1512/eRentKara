"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard, Building2, Users, ClipboardCheck, FileText,
  IndianRupee, Wrench, Utensils, Eye, UserPlus, BarChart3,
  Gift, Sparkles, Settings, Bell, ChevronRight, LogOut
} from "lucide-react";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/tenants", label: "Tenants", icon: Users },
  { href: "/dashboard/leads", label: "Leads & CRM", icon: ClipboardCheck },
  { href: "/dashboard/agreements", label: "Agreements", icon: FileText },
  { href: "/dashboard/invoices", label: "Invoices", icon: IndianRupee },
  { href: "/dashboard/complaints", label: "Complaints", icon: Wrench },
  { href: "/dashboard/visitors", label: "Visitors", icon: Eye },
  { href: "/dashboard/mess", label: "Mess & Food", icon: Utensils },
  { href: "/dashboard/staff", label: "Staff", icon: UserPlus },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
  { href: "/dashboard/ai", label: "Ekrar AI", icon: Sparkles },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar — hidden on mobile, shown on md+ */}
      <aside className="hidden md:flex flex-col w-60 bg-slate-900 border-r border-slate-800 shrink-0">
        <div className="px-4 pt-4 pb-3 border-b border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner Portal</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-slate-800">
          <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 flex items-center justify-around py-2 px-1 shadow-lg">
        {[
          { href: "/dashboard", label: "Home", icon: LayoutDashboard },
          { href: "/dashboard/properties", label: "Properties", icon: Building2 },
          { href: "/dashboard/tenants", label: "Tenants", icon: Users },
          { href: "/dashboard/invoices", label: "Billing", icon: IndianRupee },
          { href: "/dashboard/ai", label: "AI", icon: Sparkles },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition ${
                isActive ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
