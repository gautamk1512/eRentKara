"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Gift, Copy, Share2, CheckCircle2, Users, IndianRupee, Link as LinkIcon, MessageSquare, Mail } from "lucide-react";

export default function DashboardReferralsPage() {
  const [referral, setReferral] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => { try { const res = await api.getMyReferral(); if (res.success) setReferral(res.data); } catch(e){} })();
  }, []);

  const refUrl = referral?.code ? `https://erentkarar.com/register?ref=${referral.code}` : "";
  const handleCopy = () => { navigator.clipboard.writeText(refUrl); setCopied(true); setTimeout(()=>setCopied(false), 2000); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div><h1 className="text-xl font-black text-slate-900">Referral Program</h1><p className="text-xs text-slate-500">Invite other property owners and earn rewards</p></div>

      {/* Referral Code Card */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4"><Gift className="w-8 h-8"/><div><h2 className="text-lg font-black">Your Referral Code</h2><p className="text-xs text-amber-100">Share with other property owners to earn credits</p></div></div>
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <code className="text-2xl font-black tracking-widest flex-1 text-center sm:text-left">{referral?.code || "LOADING..."}</code>
          <button onClick={handleCopy} className="px-5 py-2.5 bg-white text-amber-700 font-bold rounded-xl text-xs hover:bg-amber-50 transition flex items-center gap-2">
            {copied ? <><CheckCircle2 className="w-4 h-4"/>Copied!</> : <><Copy className="w-4 h-4"/>Copy Code</>}
          </button>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <input type="text" readOnly value={refUrl} className="flex-1 px-4 py-2 bg-white/10 rounded-xl text-xs font-mono text-white/80 outline-none w-full"/>
          <div className="flex gap-2">
            <a href={`https://wa.me/?text=Join%20eRentKarar%20with%20my%20code%20${referral?.code}%20-%20${encodeURIComponent(refUrl)}`} target="_blank" rel="noopener" className="px-3 py-2 bg-green-600 text-white font-bold rounded-xl text-xs hover:bg-green-700 transition flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5"/>WhatsApp</a>
            <a href={`mailto:?subject=Join%20eRentKarar&body=Use%20my%20referral%20code%20${referral?.code}%20at%20${refUrl}`} className="px-3 py-2 bg-white/20 text-white font-bold rounded-xl text-xs hover:bg-white/30 transition flex items-center gap-1"><Mail className="w-3.5 h-3.5"/>Email</a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Clicks", value: referral?.total_clicks || 0, icon: LinkIcon },
          { label: "Registrations", value: referral?.registrations || 0, icon: Users },
          { label: "Qualified", value: referral?.qualified || 0, icon: CheckCircle2 },
          { label: "Rewards Earned", value: `₹${referral?.rewards || 0}`, icon: IndianRupee },
        ].map((s,i)=>{
          const SIcon = s.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
              <SIcon className="w-5 h-5 text-amber-600 mx-auto mb-2"/>
              <p className="text-xl font-black text-slate-900">{s.value}</p>
              <p className="text-[10px] text-slate-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">How Referrals Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: "1", text: "Share your unique code or link" },
            { step: "2", text: "Owner registers using your code" },
            { step: "3", text: "They create an organization & add a property" },
            { step: "4", text: "Both of you earn platform credits!" },
          ].map((s,i)=>(
            <div key={i} className="flex items-start gap-3 text-xs">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">{s.step}</div>
              <p className="text-slate-600 pt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
