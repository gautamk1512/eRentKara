"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { PremiumPageHeader, PremiumEmptyState } from "@/components/PremiumUI";
import { apiRequest } from "@/lib/api";
import { downloadDocument } from "@/lib/documentDownload";

export default function PartnerAgreements() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  async function load() {
    if (!localStorage.getItem("erk_token")) { setError("Sign in with your legal partner account to view assigned agreements."); setLoading(false); return; }
    setLoading(true);
    try { const result = await apiRequest("/agreements/partner-orders/"); setOrders(result.results || result.data || result); }
    catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  async function update(status?: string) {
    if (!selected) return;
    setBusy(true); setError("");
    try {
      if (status) await apiRequest(`/agreements/partner-orders/${selected.id}/progress/`, { method: "PATCH", body: JSON.stringify({ status, notes }) });
      else {
        if (!file) throw new Error("Choose the completed agreement PDF first.");
        const form = new FormData(); form.append("file", file);
        await apiRequest(`/agreements/partner-orders/${selected.id}/upload-final-doc/`, { method: "POST", body: form });
      }
      setSelected(null); setFile(null); setNotes(""); await load();
    } catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="premium-partner-page min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
    <div className="max-w-6xl mx-auto space-y-6">
      <PremiumPageHeader eyebrow="LEGAL PARTNER WORKSPACE" title="Assigned agreements" description="Verified documents in. Carefully prepared agreements out."><Link className="premium-primary" href="/login?portal=partner&next=/partner/agreements">Partner sign in</Link></PremiumPageHeader>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {loading ? <p>Loading assignments…</p> : error ? null : !orders.length ? <PremiumEmptyState icon={FileText} title="Ready for your next assignment." description="Orders assigned to you by our admin will appear here with verified documents and preparation details."/> : <div className="grid md:grid-cols-2 gap-5">{orders.map(order => <article key={order.id} className="rounded-2xl bg-white border p-6 space-y-4">
        <div className="flex justify-between gap-3"><h2 className="font-bold">{order.order_number}</h2><span className="text-xs rounded-full bg-blue-50 px-3 py-1 text-blue-700">{order.status.replaceAll("_", " ")}</span></div>
        <p>{order.agreement_details?.property_title} · {order.agreement_details?.property_city}</p><p className="text-sm text-slate-500">{order.agreement_details?.property_address}</p>
        <p className="text-sm">Rent ₹{order.agreement_details?.monthly_rent} · {order.agreement_details?.duration_months} months · {order.delivery_type === "HARD_COPY" ? "Hard copy requested" : "Soft copy requested"}</p>
        <div className="space-y-2">{order.documents?.map((doc: any) => <button key={doc.id} className="block text-blue-700 underline text-sm" onClick={() => downloadDocument(doc.file_url, doc.file_name).catch(err => setError(err.message))}>{doc.document_type_display} · Download</button>)}</div>
        <button className="rounded-xl bg-blue-600 text-white px-4 py-2" onClick={() => { setSelected(order); setNotes(""); setFile(null); }}>Update / submit agreement</button>
      </article>)}</div>}
      {selected && <section className="rounded-2xl border bg-white p-6 space-y-4"><h2 className="text-xl font-bold">Update {selected.order_number}</h2><label className="block">Progress or correction details<textarea value={notes} onChange={e => setNotes(e.target.value)} className="block border rounded-xl p-3 w-full mt-2" /></label><label className="block">Completed agreement PDF (up to 10 MB)<input type="file" accept="application/pdf" className="block mt-2" onChange={e => setFile(e.target.files?.[0] || null)} /></label><div className="flex flex-wrap gap-3"><button disabled={busy} onClick={() => update("AGREEMENT_PROCESSING")} className="border rounded-xl px-4 py-2">Start processing</button><button disabled={busy || !notes.trim()} onClick={() => update("CORRECTION_REQUIRED")} className="border rounded-xl px-4 py-2">Request correction</button><button disabled={busy || !file} onClick={() => update()} className="bg-blue-600 text-white rounded-xl px-4 py-2">Submit PDF for admin approval</button><button disabled={busy} onClick={() => setSelected(null)}>Close</button></div></section>}
    </div>
  </main>;
}
