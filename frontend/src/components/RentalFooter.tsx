"use client";
import Link from "next/link";
import { ProductSwitcher } from "./ProductSwitcher";
import { useStorefrontCopy } from "@/lib/storefront-copy";

const groups = [
  { title: "Property & living", links: [["/properties", "Browse properties"], ["/properties?type=PG", "PG & Hostels"], ["/properties?type=CO_LIVING", "Co-Living"], ["/list-your-property", "List a property"]] },
  { title: "Rental OS", links: [["/dashboard", "Owner dashboard"], ["/tenant", "Tenant portal"], ["/guide?tab=rental", "Help & guide"], ["/contact?portal=rental", "Contact us"]] },
  { title: "Rental tools", links: [["/tools/rent-receipt-generator", "Rent receipts"], ["/tools/electricity-bill-calculator", "Electricity calculator"], ["/tools/tenant-police-verification-form-generator", "Tenant verification form"], ["/tools/move-out-settlement-calculator", "Deposit settlement"]] },
];

export default function RentalFooter() {
  const tr = useStorefrontCopy();
  return <footer className="bg-[#eeeee8] border-t border-[#deded5] text-[#252821] px-5 py-12"><div className="max-w-7xl mx-auto">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-9"><div><Link href="/rental" className="text-2xl font-semibold tracking-tight">eRentKarar<span className="text-[#286655]">.</span></Link><p className="text-sm leading-relaxed text-[#696963] my-5">{tr("Rental properties, PGs & co-living")}</p><ProductSwitcher rental /></div>{groups.map(group => <nav key={group.title} aria-label={tr(group.title)}><h3 className="font-semibold mb-5">{tr(group.title)}</h3><div className="flex flex-col gap-3 text-sm text-[#696963]">{group.links.map(([href,title]) => <Link key={href} href={href} className="hover:text-[#286655]">{tr(title)}</Link>)}</div></nav>)}</div>
    <div className="border-t border-[#d7d7ce] mt-10 pt-5 flex flex-wrap justify-between gap-3 text-xs text-[#696963]"><span>© {new Date().getFullYear()} eRentKarar</span><Link href="/">{tr("Rental Agreement")} ↗</Link></div>
  </div></footer>;
}
