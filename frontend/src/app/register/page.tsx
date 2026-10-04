"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2, ArrowRight, Mail, Lock, Phone,
  Gift, CheckCircle2, Eye, EyeOff, Sparkles,
  ShieldCheck, UserCheck, ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";

function RegisterContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "";

  const [step, setStep] = useState<"role" | "form">("role");
  const [role, setRole] = useState<"OWNER" | "TENANT">("OWNER");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [referralCode, setReferralCode] = useState(refCode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleGoogleRegister = async (chosenRole: "OWNER" | "TENANT" = role) => {
    setError("");
    setGoogleLoading(true);
    const targetEmail = email || (chosenRole === "OWNER" ? "new.owner.google@erentkarar.com" : "new.tenant.google@erentkarar.com");
    const targetName = firstName ? `${firstName} ${lastName}`.trim() : (chosenRole === "OWNER" ? "Google Landlord" : "Google Tenant");

    try {
      const res = await api.googleLogin({
        email: targetEmail,
        name: targetName,
        role: chosenRole,
        force_role: true,
      });

      if (res.success && res.data) {
        localStorage.setItem("erk_token", res.data.tokens.access);
        localStorage.setItem("erk_user", JSON.stringify(res.data.user));
        setSuccess(true);
        setTimeout(() => {
          if (chosenRole === "TENANT") {
            window.location.href = "/tenant";
          } else {
            window.location.href = "/dashboard";
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to register with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const validate = () => {
    if (!firstName.trim()) return "First name is required";
    if (!email.trim()) return "Email is required";
    if (!phone.trim() || phone.length < 10) return "Valid phone number is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    if (role === "OWNER" && !orgName.trim()) return "Organization name is required for owners";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    try {
      const res = await api.register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
        role,
        organization_name: role === "OWNER" ? orgName : undefined,
        referral_code: referralCode || undefined,
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/[0.08] shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d1d1f]">Welcome to eRentKarar</h2>
          <p className="text-sm text-[#86868b]">
            Your account has been created successfully. Redirecting to sign in...
          </p>
          <div className="w-12 h-1 bg-[#0071e3] rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 font-sans py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-black/[0.08] shadow-xl overflow-hidden">
        {/* Header - Apple Dark Obsidian */}
        <div className="bg-[#1d1d1f] px-8 py-6 text-white border-b border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#f5f5f7]">Create Your Account</h1>
              <p className="text-xs text-[#86868b]">India&apos;s Rental OS & Agreement Platform</p>
            </div>
          </div>
          {/* Progress steps */}
          <div className="flex items-center space-x-2 mt-4">
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition ${step === "role" ? "bg-white text-[#1d1d1f]" : "bg-white/10 text-[#86868b]"}`}>
              <span>1</span>
              <span>Account Type</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#86868b]" />
            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition ${step === "form" ? "bg-white text-[#1d1d1f]" : "bg-white/10 text-[#86868b]"}`}>
              <span>2</span>
              <span>Details</span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {step === "role" ? (
            <div className="space-y-5">
              <p className="text-sm font-semibold text-[#1d1d1f]">Choose your primary role:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Owner Card */}
                <button
                  type="button"
                  onClick={() => { setRole("OWNER"); setStep("form"); }}
                  className="group text-left p-5 rounded-2xl border border-black/[0.08] hover:border-[#0071e3] hover:shadow-md bg-white transition-all duration-200 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center group-hover:scale-105 transition">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1d1d1f]">Property Owner / Manager</h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Manage PG, hostel, flat, or co-living stays. Collect rent online, draft stamped deeds, and track vacancies.
                  </p>
                  <div className="flex items-center text-xs font-semibold text-[#0071e3] pt-1">
                    <span>Select Owner</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
                  </div>
                </button>

                {/* Tenant Card */}
                <button
                  type="button"
                  onClick={() => { setRole("TENANT"); setStep("form"); }}
                  className="group text-left p-5 rounded-2xl border border-black/[0.08] hover:border-[#0071e3] hover:shadow-md bg-white transition-all duration-200 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] text-[#0071e3] flex items-center justify-center group-hover:scale-105 transition">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-[#1d1d1f]">Tenant / Renter</h3>
                  <p className="text-xs text-[#86868b] leading-relaxed">
                    Explore verified PGs and flats, sign Aadhaar agreements, track rental payments, and download rent receipts.
                  </p>
                  <div className="flex items-center text-xs font-semibold text-[#0071e3] pt-1">
                    <span>Select Tenant</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
                  </div>
                </button>
              </div>

              {/* Google 1-Click Fast Registration */}
              <div className="pt-2">
                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/[0.08]" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase">
                    <span className="bg-white px-2 text-[#86868b] font-medium">Or Sign Up With Google</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={googleLoading}
                    onClick={() => handleGoogleRegister("OWNER")}
                    className="py-2.5 px-3 bg-white hover:bg-neutral-50 border border-black/[0.12] rounded-xl text-xs font-semibold text-[#1d1d1f] transition shadow-2xs flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                    </svg>
                    <span className="truncate">Google as Owner</span>
                  </button>

                  <button
                    type="button"
                    disabled={googleLoading}
                    onClick={() => handleGoogleRegister("TENANT")}
                    className="py-2.5 px-3 bg-white hover:bg-neutral-50 border border-black/[0.12] rounded-xl text-xs font-semibold text-[#1d1d1f] transition shadow-2xs flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                    </svg>
                    <span className="truncate">Google as Tenant</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-black/[0.06]">
                <p className="text-xs text-[#86868b]">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#0071e3] font-medium hover:underline">Sign In</Link>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.08]">
                  {role === "OWNER" ? <Building2 className="w-3.5 h-3.5 text-[#0071e3]" /> : <UserCheck className="w-3.5 h-3.5 text-[#0071e3]" />}
                  <span>{role === "OWNER" ? "Property Owner" : "Tenant"}</span>
                </div>
                <button type="button" onClick={() => setStep("role")} className="text-xs text-[#86868b] hover:text-[#0071e3] font-normal">Change role</button>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">{error}</div>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">First Name *</label>
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                    placeholder="Gautam" className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl text-xs text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:bg-white transition" />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder="Kumar" className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl text-xs text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:bg-white transition" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">Email Address *</label>
                <div className="flex items-center px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl focus-within:border-[#0071e3] focus-within:bg-white transition">
                  <Mail className="w-4 h-4 text-[#86868b] mr-2 shrink-0" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" className="bg-transparent text-xs outline-none w-full text-[#1d1d1f]" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">Phone Number *</label>
                <div className="flex items-center px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl focus-within:border-[#0071e3] focus-within:bg-white transition">
                  <Phone className="w-4 h-4 text-[#86868b] mr-2 shrink-0" />
                  <span className="text-xs text-[#86868b] mr-1.5 font-medium">+91</span>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210" className="bg-transparent text-xs outline-none w-full text-[#1d1d1f]" />
                </div>
              </div>

              {/* Org Name (Owner only) */}
              {role === "OWNER" && (
                <div>
                  <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">Organization / Property Name *</label>
                  <div className="flex items-center px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl focus-within:border-[#0071e3] focus-within:bg-white transition">
                    <Building2 className="w-4 h-4 text-[#86868b] mr-2 shrink-0" />
                    <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)}
                      placeholder="e.g. Sunrise PG, ABC Residency" className="bg-transparent text-xs outline-none w-full text-[#1d1d1f]" />
                  </div>
                </div>
              )}

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">Password *</label>
                  <div className="flex items-center px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl focus-within:border-[#0071e3] focus-within:bg-white transition">
                    <Lock className="w-4 h-4 text-[#86868b] mr-2 shrink-0" />
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min 8 chars" className="bg-transparent text-xs outline-none w-full text-[#1d1d1f]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#86868b] hover:text-[#1d1d1f] ml-1">
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">Confirm Password *</label>
                  <div className="flex items-center px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl focus-within:border-[#0071e3] focus-within:bg-white transition">
                    <Lock className="w-4 h-4 text-[#86868b] mr-2 shrink-0" />
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter" className="bg-transparent text-xs outline-none w-full text-[#1d1d1f]" />
                  </div>
                </div>
              </div>

              {/* Referral Code */}
              <div>
                <label className="text-xs font-medium text-[#1d1d1f] mb-1.5 block">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-[#0071e3]" />
                    Referral Code (optional)
                  </span>
                </label>
                <input type="text" value={referralCode} onChange={e => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GAUTAM123" className="w-full px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl text-xs text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:bg-white transition font-mono tracking-wider" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-medium rounded-full text-xs transition duration-200 shadow-xs flex items-center justify-center space-x-2 active:scale-[0.98]"
              >
                <span>{loading ? "Creating Account..." : "Create Account & Get Started"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-[#86868b] pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-[#0071e3]" /> Encrypted</span>
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure Auth</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#0071e3]" /> AI Copilot</span>
              </div>

              <div className="text-center pt-2 border-t border-black/[0.06]">
                <p className="text-xs text-[#86868b]">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#0071e3] font-medium hover:underline">Sign In</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading...</div>}>
      <RegisterContent />
    </React.Suspense>
  );
}
