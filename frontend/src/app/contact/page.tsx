"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Headphones, FileCheck2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
export default function ContactPage() {
  const params = useSearchParams();
  const rental = params.get("portal") === "rental";
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false), [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      await apiRequest("/auth/contact/", { method: "POST", body: JSON.stringify({ ...values, product: rental ? "rental" : "agreement" }) }); setDone(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to submit your request."); }
    finally { setBusy(false); }
  }
  return <div className="partner-access contact-access"><section className="partner-intro"><span className="portal-eyebrow"><Headphones size={16}/>{rental ? "RENTAL OS SUPPORT" : "RENTAL AGREEMENT SUPPORT"}</span><h1>A little help.<br/>A clear next step.</h1><p>Tell us what you need. Our team will review your request and reply using the contact details you provide.</p><div className="partner-benefits"><div><FileCheck2 size={22}/><div><strong>{rental ? "Properties, PGs & co-living" : "Documents, orders & delivery"}</strong><p>{rental ? "Get help with your property listings, tenants and management workspace." : "Ask about your agreement, uploaded documents or delivery status."}</p></div></div></div>{!rental && <Link className="portal-text-link" href="/partner/register">Want to work with us? Become a partner<ArrowUpRight size={16}/></Link>}</section><section className="portal-form-card">{done ? <div className="portal-success" role="status"><CheckCircle2 size={44}/><h2>Request received.</h2><p>Your enquiry is saved with our support team. We will review it and contact you.</p><Link className="premium-primary" href={rental ? "/rental" : "/"}>Back to {rental ? "Rental OS" : "Rental Agreement"}<ArrowUpRight size={16}/></Link></div> : <><span className="portal-step">LET’S MAKE IT SIMPLE</span><h2>Contact us</h2><p className="portal-form-description">All fields marked * are required.</p><form className="portal-form" onSubmit={submit}><div className="portal-field-grid">{[["name","Full name","text"],["email","Email address","email"],["phone","Phone number (optional)","tel"],["subject","What do you need help with?","text"]].map(([name,label,type]) => <label key={name} className="portal-field"><span>{label}{name !== "phone" && " *"}</span><input name={name} type={type} maxLength={name === "phone" ? 20 : name === "name" ? 150 : 200} required={name !== "phone"}/></label>)}</div><label className="portal-field"><span>Your question *</span><textarea name="message" required rows={6} maxLength={5000} placeholder="Include your order reference if you have one. Please do not include identity documents or passwords."/></label>{error && <p role="alert" className="portal-error">{error}</p>}<button type="submit" disabled={busy} className="premium-primary portal-submit">{busy ? "Submitting…" : "Submit enquiry"}<ArrowUpRight size={17}/></button></form></>}</section></div>;
}
