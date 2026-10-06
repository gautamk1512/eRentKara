"use client";
import Link from "next/link";
export default function HomepageAgreementCheckout() {
  return <section className="max-w-6xl mx-auto rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 sm:p-12 my-12">
    <p className="text-sm font-semibold text-blue-700">Rental agreements, managed from start to finish</p>
    <h2 className="mt-3 text-3xl font-bold text-slate-900">Submit documents. Track your agreement.</h2>
    <p className="mt-4 max-w-2xl text-slate-600">Fill in your property and rental details, upload identity and property proofs, then pay securely. Our team verifies your documents and assigns a legal partner in your city.</p>
    <div className="grid sm:grid-cols-3 gap-4 mt-8">{[["1", "Submit & pay", "Choose soft copy or add printed delivery before payment."], ["2", "We verify & prepare", "Track pending verification, corrections and agreement preparation."], ["3", "Receive your agreement", "Download the approved PDF or track your hard-copy courier."]].map(([number, title, text]) => <div key={number} className="rounded-2xl bg-white border border-slate-100 p-5"><span className="text-blue-600 font-bold">{number}</span><h3 className="font-bold text-slate-900 mt-2">{title}</h3><p className="text-sm text-slate-500 mt-2">{text}</p></div>)}</div>
    <div className="flex flex-wrap gap-4 mt-8"><Link href="/rent-agreement/create" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">Start your agreement</Link><Link href="/dashboard/orders" className="rounded-xl border px-6 py-3 text-blue-700 font-semibold">Track my orders</Link></div>
  </section>;
}
