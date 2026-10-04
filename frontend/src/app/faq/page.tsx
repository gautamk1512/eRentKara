"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, Building2, IndianRupee, FileText, Shield, Sparkles, Users } from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    icon: Building2,
    faqs: [
      { q: "How do I create an account on eRentKarar?", a: "Click 'Register', choose Owner or Tenant, fill your details, and you're in. No credit card required for the free plan." },
      { q: "What types of properties can I manage?", a: "PGs, hostels, co-living, flats, apartments, rooms, studios, 1/2/3BHK, dormitories, and student housing." },
      { q: "How do I add rooms and beds?", a: "Go to Dashboard → Properties → Select Property → Add Building → Add Floor → Add Room → Add Bed. You can set room type, sharing, and rent for each." },
      { q: "Can I manage multiple properties?", a: "Yes! Free plan supports 1 property. Pro supports up to 5. Business plan supports unlimited properties across multiple cities." },
    ],
  },
  {
    title: "Billing & Payments",
    icon: IndianRupee,
    faqs: [
      { q: "How does rent collection work?", a: "Generate monthly invoices automatically. Tenants pay via UPI, cards, or net banking through Razorpay. You get instant confirmation and receipts." },
      { q: "Can I add electricity charges?", a: "Yes. Support sub-meter readings per room. Enter previous and current readings, set rate per unit, and it auto-calculates in the invoice." },
      { q: "What about late fees?", a: "Configure grace period and late fee percentage in settings. Late fees are auto-applied after the grace period on overdue invoices." },
      { q: "Are payments secure?", a: "All payments are processed through Razorpay with PCI-DSS compliance. We never store card data. Payment status is verified server-side via webhooks." },
    ],
  },
  {
    title: "Agreements & Legal",
    icon: FileText,
    faqs: [
      { q: "Does eRentKarar create legal rental agreements?", a: "We generate agreement drafts with state-compliant templates. These should be reviewed by legal counsel before use. eSign is via Leegality." },
      { q: "Is stamp duty included?", a: "We calculate stamp duty based on state-wise rules (KA, MH, DL, TN, TG, GJ, UP, etc.). Digital stamping is available through our eSign provider." },
      { q: "Can I use my own agreement template?", a: "Business plan users can upload and configure custom agreement templates with variable placeholders." },
    ],
  },
  {
    title: "Security & Privacy",
    icon: Shield,
    faqs: [
      { q: "How is my data protected?", a: "256-bit encryption, private document storage with signed URLs, RBAC, organization isolation, CSRF/XSS protection, and comprehensive audit logging." },
      { q: "Can other organizations see my data?", a: "No. Strict multi-tenant isolation ensures your data is scoped to your organization. IDOR protection is enforced on every API endpoint." },
      { q: "How are KYC documents stored?", a: "In encrypted private cloud storage. Access requires signed URLs with expiration. Every document access is logged for audit." },
    ],
  },
  {
    title: "AI & Automation",
    icon: Sparkles,
    faqs: [
      { q: "What can Ekrar AI do?", a: "Answer business questions in Hindi/English about rent, vacancies, agreements, KYC, complaints, and collections. It can also prepare actions like sending reminders — with your confirmation." },
      { q: "Does AI have direct database access?", a: "No. Ekrar AI uses authorized tool functions only. It never queries the database directly. Every interaction is logged and audited." },
      { q: "Is AI included in free plan?", a: "Yes! 20 queries/month on Starter. 200 on Pro. Unlimited on Business." },
    ],
  },
];

export default function FAQPage() {
  const [searchQ, setSearchQ] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(["Getting Started-0"]));

  const toggleItem = (key: string) => {
    setOpenItems((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Apple light style */}
      <section className="bg-[#f5f5f7] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]">
            Frequently Asked{" "}
            <span className="text-[#0071e3]">Questions</span>
          </h1>
          <p className="text-lg text-[#86868b]">Everything you need to know about eRentKarar</p>
          <div className="max-w-md mx-auto flex items-center px-4 py-3 bg-white border border-[rgba(0,0,0,0.08)] rounded-full shadow-sm mt-6">
            <Search className="w-4 h-4 text-[#86868b] mr-3" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="bg-transparent text-sm outline-none w-full text-[#1d1d1f] placeholder-[#86868b]"
            />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 space-y-6">
        {faqCategories.map((cat) => {
          const CatIcon = cat.icon;
          const filteredFaqs = searchQ ? cat.faqs.filter((f) => f.q.toLowerCase().includes(searchQ.toLowerCase()) || f.a.toLowerCase().includes(searchQ.toLowerCase())) : cat.faqs;
          if (filteredFaqs.length === 0) return null;
          return (
            <div key={cat.title} className="bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-[#f5f5f7] border-b border-[rgba(0,0,0,0.06)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-[rgba(0,0,0,0.08)]">
                  <CatIcon className="w-4 h-4 text-[#0071e3]" />
                </div>
                <h2 className="text-sm font-semibold text-[#1d1d1f]">{cat.title}</h2>
              </div>
              {filteredFaqs.map((faq, i) => {
                const key = `${cat.title}-${i}`;
                const isOpen = openItems.has(key);
                return (
                  <div key={i} className="border-b border-[rgba(0,0,0,0.04)] last:border-0">
                    <button onClick={() => toggleItem(key)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#f5f5f7]/50 transition">
                      <span className="text-sm font-medium text-[#1d1d1f] pr-4">{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#86868b] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#86868b] shrink-0" />}
                    </button>
                    {isOpen && <div className="px-6 pb-4"><p className="text-sm text-[#86868b] leading-relaxed">{faq.a}</p></div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>
    </div>
  );
}
