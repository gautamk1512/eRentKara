"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import Link from "next/link";
import { Building2, Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, FileText, Store } from "lucide-react";
import { api } from "@/lib/api";

import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const portalParam = searchParams.get("portal") || (nextParam?.includes("rent-agreement") || nextParam?.includes("owner") ? "agreement" : "rental");

  const [portal, setPortal] = useState<"agreement" | "rental">(portalParam as any);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [googleRole, setGoogleRole] = useState<"OWNER" | "TENANT" | "SHOP_OPERATOR">("OWNER");

  const handleGoogleLogin = async (selectedRole: "OWNER" | "TENANT" | "SHOP_OPERATOR" = googleRole, customEmail?: string) => {
    setError("");
    setGoogleLoading(true);
    const activePortal = portal;
    const targetEmail = customEmail || googleCustomEmail || (selectedRole === "TENANT" ? "tenant.google@erentkarar.com" : selectedRole === "SHOP_OPERATOR" ? "kiosk.google@erentkarar.com" : "owner.google@erentkarar.com");
    const targetName = targetEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase());

    try {
      const res = await api.googleLogin({
        email: targetEmail,
        name: targetName,
        role: selectedRole,
        force_role: true,
      });

      if (res.success && res.data) {
        localStorage.setItem("erk_token", res.data.tokens.access);
        localStorage.setItem("erk_user", JSON.stringify(res.data.user));

        if (nextParam) {
          window.location.href = nextParam;
          return;
        }

        if (activePortal === "agreement") {
          if (res.data.user.role === "TENANT") {
            window.location.href = "/tenant/dashboard";
          } else if (res.data.user.role === "SHOP_ADMIN" || res.data.user.role === "SHOP_OPERATOR") {
            window.location.href = "/shop/dashboard";
          } else {
            window.location.href = "/owner/dashboard";
          }
        } else {
          if (res.data.user.role === "TENANT") {
            window.location.href = "/tenant";
          } else {
            window.location.href = "/dashboard";
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
      setShowGoogleModal(false);
    }
  };

  const handleLogin = async (e: React.FormEvent, presetEmail?: string, presetPassword?: string, forcePortal?: "agreement" | "rental") => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    const loginEmail = presetEmail || email;
    const loginPass = presetPassword || password;
    const activePortal = forcePortal || portal;

    try {
      const res = await api.login({ email: loginEmail, password: loginPass });
      if (res.success && res.data) {
        localStorage.setItem("erk_token", res.data.tokens.access);
        localStorage.setItem("erk_user", JSON.stringify(res.data.user));

        if (nextParam) {
          window.location.href = nextParam;
          return;
        }

        // Strict Portal & Role Separation
        if (activePortal === "agreement") {
          if (res.data.user.role === "TENANT") {
            window.location.href = "/tenant/dashboard";
          } else if (res.data.user.role === "SHOP_ADMIN" || res.data.user.role === "SHOP_OPERATOR") {
            window.location.href = "/shop/dashboard";
          } else {
            window.location.href = "/owner/dashboard";
          }
        } else {
          // Rental Management Platform (Hostel/PG/Flat ERP)
          if (res.data.user.role === "TENANT") {
            window.location.href = "/tenant";
          } else {
            window.location.href = "/dashboard";
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    handleLogin(null as any, presetEmail, presetPass);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/[0.08] shadow-xl space-y-6">
        {/* Portal Switcher Capsule */}
        <div className="flex p-1 bg-[#f5f5f7] rounded-2xl border border-black/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setPortal("agreement")}
            className={`flex-1 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-1.5 ${
              portal === "agreement"
                ? "bg-white text-[#1d1d1f] shadow-xs"
                : "text-[#86868b] hover:text-[#1d1d1f]"
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${portal === "agreement" ? "text-[#0071e3]" : "text-[#86868b]"}`} />
            <span>Rent Agreement</span>
          </button>
          <button
            type="button"
            onClick={() => setPortal("rental")}
            className={`flex-1 py-2 rounded-xl font-semibold transition flex items-center justify-center gap-1.5 ${
              portal === "rental"
                ? "bg-white text-[#1d1d1f] shadow-xs"
                : "text-[#86868b] hover:text-[#1d1d1f]"
            }`}
          >
            <Building2 className={`w-3.5 h-3.5 ${portal === "rental" ? "text-[#0071e3]" : "text-[#86868b]"}`} />
            <span>Rental OS</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
            {portal === "agreement" ? "Rent Agreement Sign In" : "Rental Management Login"}
          </h1>
          <p className="text-xs text-[#86868b]">
            {portal === "agreement"
              ? "Sign in to review, verify identity, e-Stamp, and sign rental deeds"
              : "Access your hostel, PG, tenant leases & property operations"}
          </p>
        </div>

        {/* 1-Click Fast Demo Credentials Buttons */}
        <div className="bg-[#f5f5f7] border border-black/[0.06] rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center space-x-1.5 text-[#1d1d1f] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>1-Click Demo Accounts ({portal === "agreement" ? "Deed Portal" : "Rental OS"}):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handlePreset("owner@erentkarar.com", "Password123!")}
              className="px-2.5 py-2 bg-white border border-black/[0.08] hover:border-[#0071e3] hover:text-[#0071e3] rounded-xl text-xs font-medium text-[#1d1d1f] transition text-left shadow-2xs"
            >
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0071e3]" />
                <span className="font-semibold truncate">Owner</span>
              </div>
              <span className="text-[10px] text-[#86868b] block font-normal mt-0.5 truncate">owner@erentkarar.com</span>
            </button>

            <button
              onClick={() => handlePreset("tenant@erentkarar.com", "Password123!")}
              className="px-2.5 py-2 bg-white border border-black/[0.08] hover:border-emerald-600 hover:text-emerald-600 rounded-xl text-xs font-medium text-[#1d1d1f] transition text-left shadow-2xs"
            >
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold truncate">Tenant</span>
              </div>
              <span className="text-[10px] text-[#86868b] block font-normal mt-0.5 truncate">tenant@erentkarar.com</span>
            </button>

            <button
              onClick={() => handlePreset("shop@erentkarar.com", "Password123!")}
              className="px-2.5 py-2 bg-white border border-black/[0.08] hover:border-amber-600 hover:text-amber-600 rounded-xl text-xs font-medium text-[#1d1d1f] transition text-left shadow-2xs"
            >
              <div className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold truncate">Shopkeeper</span>
              </div>
              <span className="text-[10px] text-[#86868b] block font-normal mt-0.5 truncate">shop@erentkarar.com</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-[#1d1d1f] block mb-1.5">Email Address</label>
            <div className="flex items-center px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl focus-within:border-[#0071e3] focus-within:bg-white transition">
              <Mail className="w-4 h-4 text-[#86868b] mr-2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-transparent outline-none w-full text-[#1d1d1f] placeholder:text-[#86868b]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-medium text-[#1d1d1f]">Password</label>
              <Link href="/contact" className="text-[11px] text-[#0071e3] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center px-3.5 py-2.5 bg-[#f5f5f7] border border-black/[0.08] rounded-xl focus-within:border-[#0071e3] focus-within:bg-white transition">
              <Lock className="w-4 h-4 text-[#86868b] mr-2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent outline-none w-full text-[#1d1d1f] placeholder:text-[#86868b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 text-white font-medium rounded-full text-xs transition duration-200 shadow-xs flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? "Authenticating..." : "Sign In with Password"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 text-[#86868b] font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In 3-Format Section */}
        <div className="space-y-2.5">
          <div className="flex p-1 bg-[#f5f5f7] rounded-xl border border-black/[0.06] text-[11px]">
            <button
              type="button"
              onClick={() => setGoogleRole("OWNER")}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                googleRole === "OWNER" ? "bg-white text-[#1d1d1f] shadow-2xs" : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              Owner
            </button>
            <button
              type="button"
              onClick={() => setGoogleRole("TENANT")}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                googleRole === "TENANT" ? "bg-white text-[#1d1d1f] shadow-2xs" : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              Tenant
            </button>
            <button
              type="button"
              onClick={() => setGoogleRole("SHOP_OPERATOR")}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition ${
                googleRole === "SHOP_OPERATOR" ? "bg-white text-[#1d1d1f] shadow-2xs" : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              Shop / Kiosk
            </button>
          </div>

          <button
            type="button"
            disabled={googleLoading}
            onClick={() => handleGoogleLogin(googleRole)}
            className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 border border-black/[0.12] rounded-full text-xs font-semibold text-[#1d1d1f] transition duration-200 shadow-2xs flex items-center justify-center space-x-2.5 active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>
              {googleLoading ? "Signing in with Google..." : `Sign in with Google as ${googleRole === "TENANT" ? "Tenant" : googleRole === "SHOP_OPERATOR" ? "Shop" : "Owner"}`}
            </span>
          </button>
        </div>

        <div className="pt-2 border-t border-black/[0.06] text-center text-xs text-[#86868b]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#0071e3] font-medium hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
