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
  { href: "/dashboard/orders", label: "Orders & Tracking", icon: FileText },
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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  React.useEffect(() => setMobileOpen(false), [pathname]);
  if (pathname.startsWith("/dashboard/orders")) return <div className="agreement-container py-8">{children}</div>;
  const current = sidebarItems.find(item => item.href === pathname)?.label || "Workspace";
  const itemLink = (item: typeof sidebarItems[number]) => {
    const Icon = item.icon;
    const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => setMobileOpen(false)} className="premium-workspace-link"><Icon size={18} strokeWidth={1.65}/><span>{item.label}</span>{active && <span className="premium-workspace-dot"/>}</Link>;
  };
  return <div className="premium-workspace">
    <aside className="premium-workspace-nav"><div className="premium-workspace-identity"><span><Building2 size={21} strokeWidth={1.6}/></span><div><strong>Rental OS</strong><small>PROPERTY WORKSPACE</small></div></div><p className="premium-workspace-label">MANAGE YOUR BUSINESS</p><nav aria-label="Workspace navigation">{sidebarItems.map(itemLink)}</nav><div className="premium-workspace-support"><p>Everything in one place.</p><span>Properties. People. Payments.</span><Link href="/guide?tab=rental">Open workspace guide <ChevronRight size={14}/></Link></div></aside>
    <div className="premium-workspace-content"><div className="premium-workspace-toolbar"><div className="flex items-center gap-2 text-xs text-[#86868b]"><span>Workspace</span><ChevronRight size={13}/><strong className="font-medium text-[#1d1d1f]">{current}</strong></div><Link href="/contact" className="text-xs text-[#6e6e73]">Help & support ↗</Link></div><div className="premium-workspace-mobile"><button aria-expanded={mobileOpen} aria-controls="workspace-mobile-links" onClick={() => setMobileOpen(value => !value)}><LayoutDashboard size={17}/>{current}<ChevronRight size={15} className={mobileOpen ? "rotate-90" : ""}/></button>{mobileOpen && <nav id="workspace-mobile-links" aria-label="All workspace pages">{sidebarItems.map(itemLink)}</nav>}</div><div className="premium-workspace-main">{children}</div></div>
  </div>;
}
