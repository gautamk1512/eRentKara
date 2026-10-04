"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2, Mail, Phone, MapPin, Send, MessageSquare,
  Clock, ArrowRight, CheckCircle2, Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "", type: "general",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[rgba(0,0,0,0.08)] shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#34a853] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d1d1f]">Message Sent!</h2>
          <p className="text-sm text-[#86868b]">We&apos;ll get back to you within 24 hours. Check your email for a confirmation.</p>
          <Link href="/" className="apple-btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-xs">
            <span>Back to Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Apple light style */}
      <section className="bg-[#f5f5f7] pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1d1d1f]">
            Get in <span className="text-[#0071e3]">Touch</span>
          </h1>
          <p className="text-lg text-[#86868b]">Questions about eRentKarar? Want a demo? Need support? We&apos;re here to help.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Cards */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email Us", value: "hello@erentkarar.com", subtitle: "For general enquiries", link: "mailto:hello@erentkarar.com" },
              { icon: Phone, title: "Call Us", value: "+91 80XX XXX XXX", subtitle: "Mon-Sat, 10am-7pm IST", link: "tel:+918000000000" },
              { icon: MessageSquare, title: "WhatsApp", value: "Chat with Sales", subtitle: "Quick response within 2 hours", link: "https://wa.me/918000000000?text=Hi%20eRentKarar" },
              { icon: MapPin, title: "Office", value: "Bengaluru, Karnataka", subtitle: "India", link: "#" },
            ].map((c, i) => {
              const CIcon = c.icon;
              return (
                <a key={i} href={c.link} className="block bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] p-5 shadow-sm hover:shadow-md hover:border-[rgba(0,0,0,0.16)] transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center group-hover:bg-[#0071e3] group-hover:text-white transition-all duration-300">
                      <CIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#86868b]">{c.title}</p>
                      <p className="text-sm font-semibold text-[#1d1d1f]">{c.value}</p>
                      <p className="text-[10px] text-[#86868b]">{c.subtitle}</p>
                    </div>
                  </div>
                </a>
              );
            })}

            <div className="bg-[#f5f5f7] rounded-2xl border border-[rgba(0,0,0,0.06)] p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#1d1d1f]">
                <Clock className="w-4 h-4 text-[#0071e3]" />
                <span className="text-xs font-semibold">Typical Response Time</span>
              </div>
              <p className="text-xs text-[#86868b]">Email: within 24 hours</p>
              <p className="text-xs text-[#86868b]">WhatsApp: within 2 hours</p>
              <p className="text-xs text-[#86868b]">Phone: immediate (business hours)</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[rgba(0,0,0,0.08)] shadow-lg shadow-black/[0.04] p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#1d1d1f]">Send Us a Message</h2>
              <p className="text-xs text-[#86868b] mt-1">Fill out the form and our team will respond promptly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Enquiry Type */}
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "general", label: "General" },
                  { value: "demo", label: "Book Demo" },
                  { value: "sales", label: "Sales" },
                  { value: "support", label: "Support" },
                  { value: "partnership", label: "Partnership" },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: t.value })}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                      formData.type === t.value
                        ? "bg-[#0071e3] text-white border-[#0071e3]"
                        : "bg-[#f5f5f7] text-[#1d1d1f] border-[rgba(0,0,0,0.08)] hover:bg-[#e8e8ed]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1d1d1f] mb-1.5 block">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name" className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition placeholder:text-[#86868b]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1d1d1f] mb-1.5 block">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com" className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition placeholder:text-[#86868b]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1d1d1f] mb-1.5 block">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210" className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition placeholder:text-[#86868b]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1d1d1f] mb-1.5 block">Subject</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?" className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition placeholder:text-[#86868b]" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1d1d1f] mb-1.5 block">Message *</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your requirements, number of properties, tenants, etc." className="w-full px-4 py-2.5 bg-[#f5f5f7] border border-[rgba(0,0,0,0.08)] rounded-xl text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition resize-none placeholder:text-[#86868b]" />
              </div>

              <button type="submit" className="apple-btn-primary w-full sm:w-auto px-8 py-3 text-sm flex items-center justify-center space-x-2 active:scale-[0.98]">
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
