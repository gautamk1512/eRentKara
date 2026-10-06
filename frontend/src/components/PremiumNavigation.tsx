"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Building2, ChevronDown, FileText, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { ThemeToggle } from "@/context/ThemeContext";
import { ProductSwitcher, StorefrontLanguage } from "./ProductSwitcher";
import { useStorefrontCopy } from "@/lib/storefront-copy";

export default function PremiumNavigation({ rental }: { rental: boolean }) {
  const pathname = usePathname();
  const tr = useStorefrontCopy();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{first_name?: string; role?: string} | null>(null);
  const header = useRef<HTMLElement>(null);
  const links = rental ? [["/properties","Explore Stays"],["/list-your-property","List a property"],["/contact?portal=rental","Contact us"]] : [["/#how-it-works","How it works"],["/#delivery","Simple pricing"],["/partner/register","Become a partner"],["/contact?portal=agreement","Contact us"]];
  const services = rental ? [["/tools","Tools"],["/pricing","Simple pricing"],["/login?role=KIOSK","Kiosk portal"],["/properties?type=PG","PG & Hostels"],["/properties?type=CO_LIVING","Co-Living"],["/dashboard","Owner dashboard"],["/tenant","Tenant portal"],["/guide?tab=rental","Help & guide"],["/features","Features"],["/solutions","Solutions"],["/promotions","Offers"]] : [["/dashboard/orders","Track order"],["/partner/login","Partner sign in"],["/rent-agreement-ai","Agreement AI"],["/rent-agreement/create?agreement_type=RESIDENTIAL","Residential"],["/rent-agreement/create?agreement_type=COMMERCIAL","Commercial"],["/rent-agreement/renew","Renew agreement"],["/rent-agreement/old-agreement","Existing agreement"],["/guide?tab=agreement","Help & guide"],["/rent-agreement/help","Agreement help"]];
  useEffect(() => {
    setOpen(false);
    header.current?.querySelectorAll("details[open]").forEach(element => element.removeAttribute("open"));
    try { const saved = localStorage.getItem("erk_user"); setUser(saved ? JSON.parse(saved) : null); } catch { setUser(null); }
  }, [pathname]);
  useEffect(() => {
    const dismiss = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event instanceof MouseEvent && header.current?.contains(event.target as Node)) return;
      header.current?.querySelectorAll("details[open]").forEach(element => element.removeAttribute("open"));
      if (event instanceof KeyboardEvent) setOpen(false);
    };
    document.addEventListener("click", dismiss); document.addEventListener("keydown", dismiss);
    return () => { document.removeEventListener("click", dismiss); document.removeEventListener("keydown", dismiss); };
  }, []);
  const dashboard = user?.role === "LEGAL_PARTNER" ? "/partner/agreements" : user?.role === "SHOP_OPERATOR" ? "/shop/dashboard" : !rental ? "/dashboard/orders" : user?.role === "TENANT" ? "/tenant" : "/dashboard";
  const logout = () => { localStorage.removeItem("erk_token");localStorage.removeItem("erk_user");setUser(null);window.location.href = rental ? "/rental" : "/"; };
  const navigate = () => { setOpen(false);header.current?.querySelectorAll("details[open]").forEach(element => element.removeAttribute("open")); };

  return <header ref={header} className="premium-nav">
    <div className="premium-nav-row">
      <Link href={rental ? "/rental" : "/"} className="premium-nav-brand" aria-label="eRentKarar home"><span>{rental ? <Building2 size={20} strokeWidth={1.6}/> : <FileText size={20} strokeWidth={1.6}/>}</span><div>eRentKarar<small>{rental ? "Rental OS" : tr("Rental Agreement")}</small></div></Link>
      <div className="premium-nav-switch"><ProductSwitcher rental={rental}/></div>
      <nav aria-label="Main navigation" className="premium-nav-links">{links.map(([href,title]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{tr(title)}</Link>)}<details className="premium-nav-more"><summary>{tr("More")}<ChevronDown size={12}/></summary><div className="premium-nav-dropdown">{services.map(([href,title]) => <Link key={href} href={href} onClick={navigate}>{tr(title)}<ArrowUpRight size={13}/></Link>)}</div></details></nav>
      <div className="premium-nav-actions"><ThemeToggle/><StorefrontLanguage/>{user ? <details className="premium-nav-more premium-nav-account"><summary aria-label="Account"><LayoutDashboard size={18}/><span>{user.first_name || tr("Dashboard")}</span></summary><div className="premium-nav-dropdown"><Link href={dashboard}>{tr("Dashboard")}<ArrowUpRight size={14}/></Link><button onClick={logout}>{tr("Sign out")}<LogOut size={14}/></button></div></details> : <Link className="premium-nav-signin" href={rental ? "/login?portal=rental" : "/login?portal=agreement"}>{tr("Sign in")}</Link>}<Link className="premium-nav-cta" href={rental ? "/start-managing-free" : "/rent-agreement/create"}>{tr(rental ? "Get started" : "Create agreement")}<ArrowUpRight size={14}/></Link><button className="premium-nav-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="premium-mobile-nav" onClick={() => setOpen(value => !value)}>{open ? <X size={21}/> : <Menu size={21}/>}</button></div>
    </div>
    <div className="premium-nav-mobile-switch"><ProductSwitcher rental={rental}/></div>
    {open && <nav className="premium-nav-mobile" id="premium-mobile-nav" aria-label="Mobile navigation">{[...links,...services].map(([href,title]) => <Link key={href} href={href} onClick={navigate}>{tr(title)}<ArrowUpRight size={15}/></Link>)}<Link href={rental ? "/login?portal=rental" : "/login?portal=agreement"} onClick={navigate}>{tr("Sign in")}<ArrowUpRight size={15}/></Link><Link href={rental ? "/start-managing-free" : "/rent-agreement/create"} className="premium-primary" onClick={navigate}>{tr(rental ? "Get started" : "Create agreement")}<ArrowUpRight size={16}/></Link></nav>}
  </header>;
}
