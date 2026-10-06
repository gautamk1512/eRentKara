"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumPageHeader, PremiumEmptyState } from "@/components/PremiumUI";
import {
  FileText,
  Search,
  Plus,
  Calendar,
  User,
  Building2,
  CheckCircle2,
  Clock,
  Truck,
  Mail,
  ArrowRight,
  Eye,
  Loader2,
  Package,
} from "lucide-react";
import { api } from "@/lib/api";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    loadOrders();
  }, [searchQ]);

  const loadOrders = async () => {
    try {
      const res = await api.getAgreementOrders(searchQ);
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <PremiumPageHeader eyebrow="AGREEMENT WORKSPACE" title="My agreements" description="Your documents, payment and delivery updates. Together."><Link href="/rent-agreement/create" className="premium-primary"><Plus size={16}/>New agreement</Link></PremiumPageHeader>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error} <Link href="/login?next=/dashboard/orders" className="underline">Sign in</Link></p>}

      {/* Search Input */}
      <div className="flex items-center px-4 py-2.5 bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 transition shadow-xs">
        <Search className="w-4 h-4 text-slate-400 mr-2" />
        <input
          type="text"
          aria-label="Search agreement orders" placeholder="Search orders, properties or recipients"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          className="bg-transparent text-xs outline-none w-full text-slate-800"
        />
      </div>

      {/* Orders List Table / Cards */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-24 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <PremiumEmptyState icon={Package} title="Your agreements will live here." description="Once you submit an agreement, follow its document review, preparation and delivery from this workspace." href="/rent-agreement/create" action="Create your first agreement" />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const cv = o.customer_view || {};
            const isHardCopy = o.delivery_type === "HARD_COPY";
            return (
              <div
                key={o.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 font-mono">{o.order_number}</span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {cv.status_title || o.status}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          {isHardCopy ? <Truck className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                          <span>{cv.delivery_label || o.delivery_type}</span>
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                        {o.agreement_title || "Residential Tenancy Agreement"}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Expected: within 7 days
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          ₹{Number(o.total_amount).toLocaleString("en-IN")} (Paid)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={`/dashboard/orders/${o.order_number}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
