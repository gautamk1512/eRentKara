"use client";
import Link from "next/link";
import { FileText, Building2 } from "lucide-react";
import { useStorefrontCopy } from "@/lib/storefront-copy";
import { useLanguage, Language } from "@/context/LanguageContext";

export function ProductSwitcher({ rental = false, onNavigate }: { rental?: boolean; onNavigate?: () => void }) {
  const tr = useStorefrontCopy();
  return <nav aria-label="Product switch" className="product-switch">
    <Link href="/" aria-current={!rental ? "page" : undefined} onClick={onNavigate}><FileText size={15} /><span>{tr("Rental Agreement")}</span></Link>
    <Link href="/rental" aria-current={rental ? "page" : undefined} onClick={onNavigate}><Building2 size={15} /><span>Rental OS</span></Link>
  </nav>;
}

export function StorefrontLanguage() {
  const { lang, setLang } = useLanguage();
  return <label className="storefront-language"><span className="sr-only">Language / भाषा / ભાષા</span><select aria-label="Language / भाषा / ભાષા" value={lang} onChange={event => setLang(event.target.value as Language)}><option value="en">English</option><option value="hi">हिंदी</option><option value="gu">ગુજરાતી</option></select></label>;
}
