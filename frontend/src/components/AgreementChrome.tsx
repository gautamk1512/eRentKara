"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import PremiumNavigation from "./PremiumNavigation";
import { ProductSwitcher } from "./ProductSwitcher";
import { useStorefrontCopy } from "@/lib/storefront-copy";
import RentalFooter from "./RentalFooter";
import EkrarAIFloatingChat from "./EkrarAIFloatingChat";
import TrackAgreementModal from "./TrackAgreementModal";
import GlobalDemoModalWrapper from "./GlobalDemoModalWrapper";
import { isAgreementRoute } from "@/lib/product-navigation";

export default function AgreementChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const tr = useStorefrontCopy();
  const search = useSearchParams();
  const agreement = isAgreementRoute(path, search.toString());
  const rental = !agreement;
  if (!agreement) return <div className="premium-site-shell"><a href="#page-content" className="agreement-skip">{tr("Skip to content")}</a><PremiumNavigation rental={!!rental} /><main id="page-content" className="flex-1 overflow-x-hidden">{children}</main><RentalFooter /><EkrarAIFloatingChat /><TrackAgreementModal /><GlobalDemoModalWrapper /></div>;
  return <div className="agreement-design min-h-screen flex flex-col">
    <a href="#page-content" className="agreement-skip">{tr("Skip to content")}</a>
    <PremiumNavigation rental={false} />
    <main id="page-content" className="flex-1">{children}</main>
    <footer className="agreement-footer"><div className="agreement-container">
      <div className="grid md:grid-cols-[1.3fr_1fr_1fr] gap-10 pb-10">
        <div><Link href="/" className="text-2xl font-semibold tracking-tight">eRentKarar<span className="text-[#b44a2c]">.</span></Link><p className="mt-4 text-sm text-[#696963] max-w-xs leading-relaxed">{tr("A simpler way to prepare agreements and manage rental properties.")}</p><div className="mt-6"><ProductSwitcher /></div></div>
        {[["Agreements & support", [["/rent-agreement/create?agreement_type=RESIDENTIAL", "Residential"], ["/rent-agreement/create?agreement_type=COMMERCIAL", "Commercial"], ["/dashboard/orders", "My orders"], ["/#partners", "For legal partners"], ["/guide?tab=agreement", "Help & guide"], ["/contact", "Contact us"]]], ["Property & living", [["/rental", "Rental OS"], ["/properties", "Browse properties"], ["/properties?type=PG", "PG & Hostels"], ["/properties?type=CO_LIVING", "Co-Living"], ["/dashboard", "Owner dashboard"], ["/list-your-property", "List a property"]]]].map(([heading, items]) => <nav key={heading as string} aria-label={tr(heading as string)}><h3 className="font-semibold mb-5">{tr(heading as string)}</h3><div className="flex flex-col gap-3 text-sm text-[#696963]">{(items as string[][]).map(([href,label]) => <Link key={href} href={href}>{tr(label)}</Link>)}</div></nav>)}
      </div><div className="border-t border-[#deddd6] pt-5 flex flex-wrap justify-between gap-3 text-xs text-[#77776f]"><span>© {new Date().getFullYear()} eRentKarar</span><span>{tr("Prepared locally. Managed online.")}</span></div>
    </div></footer>
  </div>;
}
