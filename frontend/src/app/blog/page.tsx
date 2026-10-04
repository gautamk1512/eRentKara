"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";

const blogPosts = [
  { slug: "11-month-rental-agreement-guide-india", title: "11-Month Rental Agreement Guide for India (2026)", excerpt: "Everything landlords and tenants need to know about 11-month rental agreements, registration requirements, and state-wise stamp duty rules.", category: "Legal Guide", author: "eRentKarar Team", date: "Sep 20, 2026", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" },
  { slug: "how-to-start-pg-hostel-business-india", title: "How to Start a PG or Hostel Business in India — Complete Guide", excerpt: "Step-by-step guide covering location selection, licensing, room setup, pricing strategy, marketing, and digital management tools.", category: "Business Guide", author: "eRentKarar Team", date: "Sep 15, 2026", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" },
  { slug: "digital-kyc-tenant-verification", title: "Digital KYC for Tenant Verification: Aadhaar, PAN & Document Checklist", excerpt: "How to verify tenants digitally using Aadhaar, PAN, and other government IDs. Best practices for secure document handling and storage.", category: "KYC & Security", author: "eRentKarar Team", date: "Sep 10, 2026", image: "https://images.unsplash.com/photo-1633265486501-0cf524a07213?auto=format&fit=crop&w=800&q=80" },
  { slug: "automated-rent-reminders-whatsapp", title: "Automated Rent Reminders via WhatsApp for PG & Hostel Owners", excerpt: "Set up automatic rent reminders on WhatsApp. Reduce late payments by 60% with timely, professional reminder messages.", category: "Automation", author: "eRentKarar Team", date: "Sep 5, 2026", image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80" },
  { slug: "electricity-billing-sub-meter-pg", title: "Sub-Meter Electricity Billing for PGs: Digital Tracking & Billing Guide", excerpt: "How to track per-room electricity usage with sub-meters and generate accurate utility bills. Eliminate disputes and save costs.", category: "Billing", author: "eRentKarar Team", date: "Sep 1, 2026", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80" },
  { slug: "security-deposit-laws-india-2026", title: "Security Deposit Laws in India (2026): Tenant Rights & Landlord Obligations", excerpt: "Complete guide to security deposit rules, Model Tenancy Act provisions, state-wise limits, refund timelines, and dispute resolution.", category: "Legal Guide", author: "eRentKarar Team", date: "Aug 28, 2026", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Rental <span className="text-emerald-400">Insights</span> & Guides</h1>
          <p className="text-lg text-slate-400">Expert articles on property management, tenant rights, billing, and Indian rental laws</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article key={post.slug} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="h-48 bg-slate-100 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"/>
              </div>
              <div className="p-5 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                  <Tag className="w-3 h-3"/>{post.category}
                </span>
                <h2 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition">{post.title}</h2>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3"/>{post.author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{post.date}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-emerald-600 text-xs font-bold flex items-center gap-1 hover:underline">
                    Read <ArrowRight className="w-3 h-3"/>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
