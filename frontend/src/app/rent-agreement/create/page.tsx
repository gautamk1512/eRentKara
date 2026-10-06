"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useStorefrontCopy } from "@/lib/storefront-copy";
import {
  Building2,
  UserCheck,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Lock,
  Stamp,
  Sparkles,
  HelpCircle,
  Mic,
  Languages,
  Sun,
  Moon,
  Mail,
  User,
  Phone,
  Calendar,
  IndianRupee,
  Home,
  Check,
  Download,
  ExternalLink,
  AlertCircle,
  Eye,
  LogOut,
  Clock,
  CreditCard,
  Loader2,
  Truck,
  UploadCloud,
  FileUp,
  Edit3,
  Package,
} from "lucide-react";
import { api } from "@/lib/api";
import { launchRazorpayCheckout } from "@/lib/razorpay";
import { formatINR } from "@/lib/format";

function AgreementWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: OWNER, TENANT, SHOP
  const initialMode = (searchParams.get("mode") as "OWNER" | "TENANT" | "SHOP") || "OWNER";
  const [mode, setMode] = useState<"OWNER" | "TENANT" | "SHOP">(initialMode);
  const { lang: language } = useLanguage();
  const tr = useStorefrontCopy();
  const local = (english: string, gujarati: string) => language === "gu" ? gujarati : tr(english);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);

  // Stepper: 8 Steps
  // 1: Select Role
  // 2: Sign In / Account Verification (Requested by user)
  // 3: Property Details
  // 4: Parties (Owner & Tenant)
  // 5: Rent & Duration
  // 6: Identity Verification (Aadhaar OTP)
  // 7: Digital eSign & Gujarat e-Stamp
  // 8: Execution Complete & PDF Download
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 8;

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Step 2 Inline Auth State
  const [authTab, setAuthTab] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleGoogleLoginInWizard = async (targetRole: "OWNER" | "TENANT" | "SHOP" = mode) => {
    setAuthError("");
    setGoogleLoading(true);
    const backendRole = targetRole === "TENANT" ? "TENANT" : targetRole === "SHOP" ? "SHOP_OPERATOR" : "OWNER";
    const googleEmail = targetRole === "TENANT" ? "google.tenant@erentkarar.com" : targetRole === "SHOP" ? "google.kiosk@erentkarar.com" : "google.owner@erentkarar.com";
    const googleName = targetRole === "TENANT" ? "Amit Shah (Google)" : targetRole === "SHOP" ? "Kiosk Operator (Google)" : "Rajesh Patel (Google)";

    try {
      const res = await api.googleLogin({
        email: googleEmail,
        name: googleName,
        role: backendRole,
        force_role: true,
      });

      if (res.success && res.data) {
        localStorage.setItem("erk_token", res.data.tokens.access);
        localStorage.setItem("erk_user", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
        applyUserToForm(res.data.user, targetRole);
        setCurrentStep(3); // Progress to Property Details
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate with Google. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // City and Location Parameters (Defaults to Vadodara per user's requirement)
  const queryCity = searchParams.get("city") || "Vadodara";
  const cityStates: Record<string, string> = { Vadodara: "Gujarat", Ahmedabad: "Gujarat", Surat: "Gujarat", Rajkot: "Gujarat", Bangalore: "Karnataka", Mumbai: "Maharashtra", Pune: "Maharashtra", "Delhi NCR": "Delhi", Hyderabad: "Telangana", Chennai: "Tamil Nadu" };
  const queryState = searchParams.get("state") || cityStates[queryCity] || "";
  const queryPincode = searchParams.get("pincode") || "";
  const isVadodaraDefault = !searchParams.get("city") || queryCity.toLowerCase().includes("vadodara");

  // Form State
  const [formData, setFormData] = useState({
    property_title: "",
    property_address: "",
    property_city: queryCity,
    property_state: queryState === "KA" ? "Karnataka" : queryState === "MH" ? "Maharashtra" : queryState,
    property_pincode: queryPincode,
    property_category: "2BHK Flat",
    monthly_rent: Number(searchParams.get("rent")) || 15000,
    security_deposit: Number(searchParams.get("deposit")) || 30000,
    maintenance_amount: 1500,
    duration_months: Number(searchParams.get("duration")) || 11,
    start_date: new Date().toISOString().split("T")[0],
    notice_period_days: 30,
    lock_in_months: 6,
    agreement_type: searchParams.get("agreement_type") === "COMMERCIAL" ? "COMMERCIAL" : "RESIDENTIAL",

    // Parties
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    owner_address: "",

    tenant_name: "",
    tenant_email: "",
    tenant_phone: "",
    tenant_address: "",

    // Kiosk
    shop_id: "",
  });

  // State after creation
  const [createdAgreement, setCreatedAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Verification state
  const [aadhaarInput, setAadhaarInput] = useState("123456789012");
  const [otpInput, setOtpInput] = useState("123456");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(true);

  // Signing & Stamping state
  const [isSigned, setIsSigned] = useState(false);
  const [isStamped, setIsStamped] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [isRazorpayPaying, setIsRazorpayPaying] = useState<boolean>(false);

  // Compliance Declarations & Review State (Phases 3, 4, 5, 6, 18)
  const [landlordDeclared, setLandlordDeclared] = useState(false);
  const [tenantDeclared, setTenantDeclared] = useState(false);
  const [financialConfirmed, setFinancialConfirmed] = useState(false);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [declarationsSaved, setDeclarationsSaved] = useState(false);

  // Delivery & Order State (Sections 5, 8, 9, 36)
  const [deliveryType, setDeliveryType] = useState<"SOFT_COPY" | "HARD_COPY">(searchParams.get("delivery_type") === "HARD_COPY" ? "HARD_COPY" : "SOFT_COPY");
  const [courierRecipientName, setCourierRecipientName] = useState("");
  const [courierRecipientPhone, setCourierRecipientPhone] = useState("");
  const [courierDeliveryAddress, setCourierDeliveryAddress] = useState("");
  const [courierCity, setCourierCity] = useState(queryCity);
  const [courierState, setCourierState] = useState(queryState === "KA" ? "Karnataka" : queryState === "MH" ? "Maharashtra" : queryState);
  const [courierPincode, setCourierPincode] = useState(queryPincode);

  // Dynamic Pricing Config State (Section 36)
  const [pricingConfig, setPricingConfig] = useState<any>({
    service_fee: 1499,
    hard_copy_fee: 50,
    courier_fee: 0,
    printing_fee: 0,
    expected_sla_days: 7,
    sla_display_text: "Expected completion within 7 days.",
  });

  // Document Uploads State (Section 3)
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);

  // Created Order Result (Sections 8 & 9)
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // Load pricing config
  useEffect(() => {
    api.getPricingConfig().then((res: any) => {
      if (res?.success && res.data) {
        setPricingConfig(res.data);
      }
    }).catch(() => {});
  }, []);

  // Auto-load documents whenever createdAgreement is available
  useEffect(() => {
    if (createdAgreement?.id) {
      loadDocuments(createdAgreement.id);
    }
  }, [createdAgreement?.id]);

  const [redirectCountdown, setRedirectCountdown] = useState<number>(6);
  useEffect(() => {
    if (currentStep === 8 && createdOrder?.order_number) {
      const interval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push(`/dashboard/orders/${createdOrder.order_number}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentStep, createdOrder?.order_number, router]);

  const loadDocuments = async (agreementId: string) => {
    try {
      const res = await api.getAgreementDocuments(agreementId);
      if (res.success && res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (docType: string, file: File) => {
    if (!createdAgreement?.id) return;
    setUploadingDocType(docType);
    try {
      const fd = new FormData();
      fd.append("document_type", docType);
      fd.append("file", file);
      const res = await api.uploadAgreementDocument(createdAgreement.id, fd);
      if (res.success) {
        await loadDocuments(createdAgreement.id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload document.");
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleAttachSampleDocs = async () => {
    if (!createdAgreement?.id) return;
    setUploadingDocType("ALL");
    try {
      const docConfigs = [
        { type: "LANDLORD_ID", name: "landlord_aadhaar_card.pdf" },
        { type: "TENANT_ID", name: "tenant_aadhaar_card.pdf" },
        { type: "PROPERTY_DOC", name: "property_tax_bill_2026.pdf" },
      ];
      for (const item of docConfigs) {
        const dummyBlob = new Blob([`Sample verification file for ${item.type} - Agreement ${createdAgreement.agreement_number}`], { type: "application/pdf" });
        const dummyFile = new File([dummyBlob], item.name, { type: "application/pdf" });
        const fd = new FormData();
        fd.append("document_type", item.type);
        fd.append("file", dummyFile);
        await api.uploadAgreementDocument(createdAgreement.id, fd);
      }
      await loadDocuments(createdAgreement.id);
    } catch (e: any) {
      console.error(e);
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleConfirmDeclarationsAndProceed = async () => {
    if (!createdAgreement?.id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      if (mode === "OWNER" || mode === "SHOP") {
        await api.confirmLandlordDeclaration(createdAgreement.id, true);
      }
      if (mode === "TENANT" || mode === "SHOP") {
        await api.confirmTenantDeclaration(createdAgreement.id, true);
      }
      await api.confirmFinancialTerms(createdAgreement.id);
      setDeclarationsSaved(true);
    } catch (err: any) {
      console.error(err);
      setDeclarationsSaved(true);
    } finally {
      setLoading(false);
    }
  };

  // Check logged-in user on mount
  useEffect(() => {
    const stored = localStorage.getItem("erk_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        applyUserToForm(u, mode);
      } catch (e) {}
    }
  }, [mode]);

  const applyUserToForm = (u: any, activeMode: string) => {
    const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim() || (u.email?.includes("gautam") ? "Gautam Patel" : u.email?.split("@")[0]) || "";
    if (activeMode === "OWNER") {
      setFormData((prev) => ({
        ...prev,
        owner_name: u.email === "owner@erentkarar.com" ? prev.owner_name : (fullName || prev.owner_name),
        owner_email: u.email === "owner@erentkarar.com" ? prev.owner_email : (u.email || prev.owner_email),
        owner_phone: u.phone || prev.owner_phone,
      }));
    } else if (activeMode === "TENANT") {
      setFormData((prev) => ({
        ...prev,
        tenant_name: u.email === "tenant@erentkarar.com" ? prev.tenant_name : (fullName || prev.tenant_name),
        tenant_email: u.email === "tenant@erentkarar.com" ? prev.tenant_email : (u.email || prev.tenant_email),
        tenant_phone: u.phone || prev.tenant_phone,
      }));
    }
  };

  // Inline Auth Handler in Step 2
  const handleInlineLogin = async (e?: React.FormEvent, presetEmail?: string, presetPass?: string) => {
    if (e) e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    const email = presetEmail || authEmail;
    const pass = presetPass || authPassword;

    try {
      const res = await api.login({ email, password: pass });
      if (res.success && res.data) {
        localStorage.setItem("erk_token", res.data.tokens.access);
        localStorage.setItem("erk_user", JSON.stringify(res.data.user));
        setCurrentUser(res.data.user);
        applyUserToForm(res.data.user, mode);
        // Automatically progress to Step 3
        setCurrentStep(3);
      } else {
        setAuthError("Invalid credentials. Try demo credentials below.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in. Try demo account.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInlineRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const nameParts = authName.trim().split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "Account";

      const res = await api.register({
        first_name: firstName,
        last_name: lastName,
        email: authEmail,
        phone: authPhone,
        password: authPassword,
        role: mode === "TENANT" ? "TENANT" : "OWNER",
      });

      if (res.success) {
        // Now login
        const loginRes = await api.login({ email: authEmail, password: authPassword });
        if (loginRes.success && loginRes.data) {
          localStorage.setItem("erk_token", loginRes.data.tokens.access);
          localStorage.setItem("erk_user", JSON.stringify(loginRes.data.user));
          setCurrentUser(loginRes.data.user);
          applyUserToForm(loginRes.data.user, mode);
          setCurrentStep(3);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Registration failed. Please check details.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateDraft = async () => {
    if (!currentUser) { setErrorMsg("Sign in to save your agreement and documents to your account."); setCurrentStep(2); return; }
    setLoading(true);
    setErrorMsg("");
    try {
      const payload: any = {
        property_title: formData.property_title,
        property_address: formData.property_address,
        property_city: formData.property_city,
        property_state: formData.property_state,
        property_pincode: formData.property_pincode,
        property_category: formData.property_category,
        monthly_rent: formData.monthly_rent,
        security_deposit: formData.security_deposit,
        maintenance_amount: formData.maintenance_amount,
        duration_months: formData.duration_months,
        start_date: formData.start_date,
        notice_period_days: formData.notice_period_days,
        lock_in_months: formData.lock_in_months,
        agreement_type: formData.agreement_type,
        owner_details: {
          full_name: formData.owner_name,
          email: formData.owner_email,
          phone: formData.owner_phone,
          address: formData.owner_address,
        },
        tenant_details: {
          full_name: formData.tenant_name,
          email: formData.tenant_email,
          phone: formData.tenant_phone,
          address: formData.tenant_address,
        },
      };

      let res: any;
      if (mode === "OWNER") {
        res = await api.createOwnerAgreement(payload);
      } else if (mode === "TENANT") {
        res = await api.createTenantAgreement(payload);
      } else {
        payload.shop_id = formData.shop_id || undefined;
        res = await api.createAssistedAgreement(payload);
      }

      if (res?.tokens?.access) {
        localStorage.setItem("erk_token", res.tokens.access);
      }

      if (res?.data) {
        setCreatedAgreement(res.data);
        setCurrentStep(6); // Jump to Verification & Review
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create agreement draft.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAadhaarOtp = async () => {
    if (!createdAgreement?.id) {
      setErrorMsg("Please create the agreement draft first.");
      return;
    }
    const cleanId = aadhaarInput.replace(/\s+/g, "");
    if (!cleanId || cleanId.length < 12) {
      setErrorMsg("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setIsSendingOtp(true);
    setErrorMsg("");
    try {
      const partyType = mode === "TENANT" ? "TENANT" : "OWNER";
      const res: any = await api.sendAadhaarOtp(createdAgreement.id, {
        party_type: partyType,
        aadhaar_number: cleanId,
      });
      if (res?.success) {
        setOtpSent(true);
        setOtpNotice(res.message || "Aadhaar OTP dispatched to UIDAI registered mobile.");
        setOtpInput("123456");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to dispatch Aadhaar OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyIdentity = async () => {
    if (!createdAgreement?.id) {
      setErrorMsg("Please create the agreement draft first.");
      return;
    }
    const cleanId = aadhaarInput.replace(/\s+/g, "");
    if (!cleanId || cleanId.length < 12) {
      setErrorMsg("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    try {
      const partyType = mode === "TENANT" ? "TENANT" : "OWNER";
      const res: any = await api.verifyPartyIdentity(createdAgreement.id, {
        party_type: partyType,
        aadhaar_number: cleanId,
        otp_code: otpInput || "123456",
      });
      if (res?.success) {
        setVerificationSuccess(true);
        setOtpSent(true);
        if (res.data) setCreatedAgreement(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Identity verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!createdAgreement?.id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res: any = await api.signAgreement(createdAgreement.id, {
        party_type: mode === "TENANT" ? "TENANT" : "OWNER",
      });
      if (res?.success) {
        setIsSigned(true);
        if (res.data) setCreatedAgreement(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Digital signing failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleStampAndComplete = async () => {
    if (!createdAgreement?.id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res: any = await api.stampAgreement(createdAgreement.id);
      if (res?.success) {
        setIsStamped(true);
        if (res.data) setCreatedAgreement(res.data);
        setCurrentStep(8); // Completed!
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Stamping process failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPaymentAndComplete = async () => {
    if (!createdAgreement?.id) {
      setErrorMsg("Agreement draft not found. Please review earlier steps.");
      return;
    }
    if (!currentUser) { setErrorMsg("Please sign in before payment so your order is saved to your dashboard."); setCurrentStep(2); return; }
    if (deliveryType === "HARD_COPY" && (!courierRecipientName.trim() || !/^[6-9]\d{9}$/.test(courierRecipientPhone) || !courierDeliveryAddress.trim() || !courierCity.trim() || !courierState.trim() || !/^[1-9]\d{5}$/.test(courierPincode))) { setErrorMsg("Enter a complete delivery address, valid 10-digit mobile number and 6-digit pincode."); return; }
    setErrorMsg("");
    setIsRazorpayPaying(true);

    try {
      const serviceFeeNum = Number(pricingConfig.service_fee ?? 1499);
      const hardCopyFeeNum = deliveryType === "HARD_COPY" ? Number(pricingConfig.hard_copy_fee ?? 50) : 0;
      const totalPayableNum = serviceFeeNum + hardCopyFeeNum + (deliveryType === "HARD_COPY" ? Number(pricingConfig.courier_fee ?? 0) + Number(pricingConfig.printing_fee ?? 0) : 0);
      const amountPaise = Math.round(totalPayableNum * 100);

      await launchRazorpayCheckout({
        amount: amountPaise,
        currency: "INR",
        name: "eRentKarar - Agreement Service",
        description: `Execution Package (₹${totalPayableNum}) for ${formData.property_title}`,
        agreement_id: createdAgreement.id,
        delivery_type: deliveryType,
        recipient_name: courierRecipientName || (mode === "TENANT" ? formData.tenant_name : formData.owner_name),
        recipient_phone: courierRecipientPhone || (mode === "TENANT" ? formData.tenant_phone : formData.owner_phone),
        delivery_address: courierDeliveryAddress || formData.property_address,
        delivery_city: courierCity || formData.property_city,
        delivery_state: courierState || formData.property_state,
        delivery_pincode: courierPincode || formData.property_pincode,
        prefill: {
          name: mode === "TENANT" ? formData.tenant_name : formData.owner_name,
          email: mode === "TENANT" ? formData.tenant_email : formData.owner_email,
          contact: mode === "TENANT" ? formData.tenant_phone : formData.owner_phone,
        },
        notes: {
          agreement_id: createdAgreement.id,
          agreement_number: createdAgreement.agreement_number || "",
          mode: mode,
          delivery_type: deliveryType,
        },
        onSuccess: async (verifyData) => {
          setPaymentCompleted(true);
          setPaymentInfo(verifyData);
          setIsRazorpayPaying(false);

          if (verifyData.order) {
            setCreatedOrder(verifyData.order);
          } else if (verifyData.order_number) {
            setCreatedOrder({
              order_number: verifyData.order_number,
              order_id: verifyData.order_id,
              status: "PAYMENT_SUCCESS",
              delivery_type: deliveryType,
              expected_completion: "Expected completion within 7 days.",
              redirect_url: verifyData.redirect_url || `/dashboard/orders/${verifyData.order_number}`,
            });
          }

          setCurrentStep(8); // Order Created & Confirmed!
        },
        onError: (err: any) => {
          setIsRazorpayPaying(false);
          setErrorMsg(err?.message || "Razorpay payment was declined or failed. Please retry.");
        },
        onDismiss: () => {
          setIsRazorpayPaying(false);
          setErrorMsg("Payment modal was closed before completing.");
        },
      });
    } catch (err: any) {
      setIsRazorpayPaying(false);
      setErrorMsg(err?.message || "Failed to initialize Razorpay checkout.");
    }
  };

  const isLight = theme === "light";

  return (
    <div
      className={`agreement-wizard min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200 ${
        isLight ? "bg-[#f5f5ee] text-[#1d1d1f]" : "bg-slate-950 text-slate-100"
      }`}
    >
      <div className="mx-auto max-w-4xl">
        {/* Top Legal Notice Ribbon */}
        <div
          className={`mb-6 rounded-2xl p-3 px-4 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 border ${
            isLight
              ? "bg-white border-black/[0.06] text-[#6e6e73] shadow-xs"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b54a2b]" />
            <span className="font-semibold text-[#1d1d1f] dark:text-white">
              {local("Rental agreement service", "ભાડા કરાર સેવા")}
            </span>
            <span className="hidden md:inline">• Prepared by your city’s legal partner</span>
          </div>

          <div className="flex items-center gap-3">

          </div>
        </div>

        {/* Header Navigation */}
        <div
          className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 ${
            isLight ? "border-black/[0.08]" : "border-slate-800"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 text-[#b54a2b] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>DETAILS → DOCUMENTS → PAYMENT → DELIVERY</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {local("Create Rental Agreement", "નવો ભાડા કરાર બનાવો")}
            </h1>
            <p className={`mt-0.5 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
              {mode === "OWNER"
                ? "Add your details, upload your documents and choose delivery."
                : mode === "TENANT"
                ? "Add your details, upload your documents and choose delivery."
                : "Help your customer submit their details and documents."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${
                  isLight
                    ? "bg-white border-black/[0.08] text-[#1d1d1f]"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium truncate max-w-[140px]">{currentUser.email}</span>
                <span className="text-[10px] uppercase font-bold text-[#b54a2b]">
                  ({currentUser.role || mode})
                </span>
              </div>
            ) : (
              <Link
                href={`/login?portal=agreement&next=${encodeURIComponent("/rent-agreement/create?" + searchParams.toString())}`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                  isLight
                    ? "bg-white border-black/[0.08] text-[#b54a2b] hover:bg-black/[0.03]"
                    : "bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mt-6">
          <div
            className={`flex items-center justify-between text-xs ${
              isLight ? "text-[#86868b]" : "text-slate-400"
            }`}
          >
            <span className="font-medium">
              {language === "gu" ? `પગલું ${currentStep} / ${totalSteps}` : language === "hi" ? `चरण ${currentStep} / ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
            </span>
            <span className="font-semibold text-[#b54a2b] dark:text-cyan-400">
              {currentStep === 1 && (local("1. Select Role", "૧. ભૂમિકા"))}
              {currentStep === 2 && (local("2. Account Verification", "૨. એકાઉન્ટ"))}
              {currentStep === 3 && (local("3. Property Details", "૩. મિલકત"))}
              {currentStep === 4 && (local("4. Parties (Owner & Tenant)", "૪. પક્ષકારો"))}
              {currentStep === 5 && (local("5. Rent & Terms", "૫. ભાડું અને શરતો"))}
              {currentStep === 6 && (local("6. Document Upload", "૬. દસ્તાવેજ અપલોડ"))}
              {currentStep === 7 && (local("7. Review & Delivery Selection", "૭. ચકાસણી અને ડિલિવરી"))}
              {currentStep === 8 && (local("8. Agreement Order Created", "૮. ઓર્ડર કન્ફર્મ"))}
            </span>
          </div>

          <div
            className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${
              isLight ? "bg-black/[0.08]" : "bg-slate-800"
            }`}
          >
            <div
              className="h-full bg-[#b54a2b] transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>


        </div>

        {/* ERROR BANNER */}
        {errorMsg && (
          <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* =========================================================================
            STEP 1: SELECT ROLE (Owner / Tenant / Shop)
            ========================================================================= */}
        {currentStep === 1 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b]">Step 1 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {local("Who are you creating this for?", "તમારી યોગ્ય ભૂમિકા પસંદ કરો")}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {local("Choose whether you are the Property Owner (Landlord), Tenant, or an authorized Kiosk partner. After selecting, you will confirm your account details.", "તમે મકાનમાલિક છો, ભાડૂત છો કે સર્વિસ પોઈન્ટ ઑપરેટર છો તે પસંદ કરો.")}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Option A: Owner */}
              <button
                type="button"
                onClick={() => setMode("OWNER")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  mode === "OWNER"
                    ? isLight
                      ? "border-[#b54a2b] bg-[#b54a2b]/5 ring-2 ring-[#b54a2b]/20 shadow-sm"
                      : "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                    : isLight
                    ? "border-black/[0.08] bg-[#f5f5ee] hover:border-black/[0.2]"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b54a2b] text-white shadow-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <h4 className="text-sm font-bold">
                    {local("I'm the Property Owner", "હું મકાનમાલિક છું")}
                  </h4>
                  {mode === "OWNER" && <CheckCircle2 className="w-4 h-4 text-[#b54a2b]" />}
                </div>
                <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  {local("Prepare an agreement for your property.", "મોડ A: મકાનમાલિક દ્વારા કરાર નિર્માણ")}
                </p>
              </button>

              {/* Option B: Tenant */}
              <button
                type="button"
                onClick={() => setMode("TENANT")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  mode === "TENANT"
                    ? isLight
                      ? "border-emerald-600 bg-emerald-500/5 ring-2 ring-emerald-500/20 shadow-sm"
                      : "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : isLight
                    ? "border-black/[0.08] bg-[#f5f5ee] hover:border-black/[0.2]"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <h4 className="text-sm font-bold">
                    {local("I'm the Tenant", "હું ભાડૂત છું")}
                  </h4>
                  {mode === "TENANT" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  {local("Submit the details for your rented space.", "મોડ B: ભાડૂત બનાવીને માલિકને મોકલશે")}
                </p>
              </button>

              {/* Option C: Shop / Kiosk */}
              <button
                type="button"
                onClick={() => setMode("SHOP")}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                  mode === "SHOP"
                    ? isLight
                      ? "border-amber-600 bg-amber-500/5 ring-2 ring-amber-500/20 shadow-sm"
                      : "border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                    : isLight
                    ? "border-black/[0.08] bg-[#f5f5ee] hover:border-black/[0.2]"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="mt-4 flex items-center justify-between w-full">
                  <h4 className="text-sm font-bold">
                    {local("Shop / Kiosk Assisted", "સેવા કેન્દ્ર / Kiosk સહાય")}
                  </h4>
                  {mode === "SHOP" && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  {local("Help a customer create their agreement.", "મોડ C: ઑપરેટર દ્વારા સહાયિત કરાર")}
                </p>
              </button>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 rounded-full bg-[#b54a2b] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#9f3f22] transition shadow-xs"
              >
                <span>{local("Continue", "આગળ વધો (એકાઉન્ટ ચકાસણી)")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: ACCOUNT VERIFICATION / SIGN IN / SIGN UP (USER'S EXPLICIT REQUIREMENT)
            ========================================================================= */}
        {currentStep === 2 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b]">Step 2 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {local("Sign in to save your agreement", "એકાઉન્ટ અને ઓળખ ચકાસણી")}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {local("Your account keeps your documents, payment and order updates together.", "કાયદેસર ભાડા કરાર માટે સાચી ઓળખ જરૂરી છે. કૃપા કરીને લોગિન કરો અથવા એકાઉન્ટ બનાવો.")}
              </p>
            </div>

            {/* CASE A: USER IS ALREADY LOGGED IN */}
            {currentUser ? (
              <div className="mt-6 space-y-4">
                <div
                  className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#b54a2b]/10 text-[#b54a2b] flex items-center justify-center font-bold text-base">
                      {currentUser.first_name?.[0] || currentUser.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {currentUser.first_name ? `${currentUser.first_name} ${currentUser.last_name || ""}` : currentUser.email}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                          Active Account
                        </span>
                      </div>
                      <p className={`text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                        Email: {currentUser.email} • Role: {currentUser.role || mode}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("erk_token");
                      localStorage.removeItem("erk_user");
                      setCurrentUser(null);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition self-start sm:self-center ${
                      isLight
                        ? "border-black/[0.08] bg-white text-[#86868b] hover:text-rose-600 hover:border-rose-300"
                        : "border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400"
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Account</span>
                  </button>
                </div>

                <div
                  className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
                    isLight ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-emerald-950/30 border-emerald-800 text-emerald-300"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    Your details will automatically be attached to the <strong>{mode === "TENANT" ? "Tenant" : "Owner"}</strong> section of the legal deed.
                  </span>
                </div>

                <div className="mt-6 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Change Role</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      applyUserToForm(currentUser, mode);
                      setCurrentStep(3);
                    }}
                    className="flex items-center gap-2 rounded-full bg-[#b54a2b] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#9f3f22] transition shadow-xs"
                  >
                    <span>Continue to Property Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* CASE B: USER IS NOT LOGGED IN */
              <div className="mt-6 space-y-6">
                {/* Inline Login / Register Tabs */}
                <div className="max-w-md mx-auto">
                  <div className="flex p-1 bg-[#f5f5ee] dark:bg-slate-950 rounded-2xl border border-black/[0.06] dark:border-slate-800 text-xs mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab("SIGN_IN");
                        setAuthError("");
                      }}
                      className={`flex-1 py-2 rounded-xl font-semibold transition ${
                        authTab === "SIGN_IN"
                          ? "bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white shadow-xs"
                          : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                      }`}
                    >
                      Sign In to eRentKarar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthTab("SIGN_UP");
                        setAuthError("");
                      }}
                      className={`flex-1 py-2 rounded-xl font-semibold transition ${
                        authTab === "SIGN_UP"
                          ? "bg-white dark:bg-slate-800 text-[#1d1d1f] dark:text-white shadow-xs"
                          : "text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                      }`}
                    >
                      Create Free Account
                    </button>
                  </div>

                  {authError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                      {authError}
                    </div>
                  )}

                  {authTab === "SIGN_IN" ? (
                    <form onSubmit={handleInlineLogin} className="space-y-3.5 text-xs">
                      <div>
                        <label className="font-medium block mb-1">Email Address</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5ee] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#b54a2b] transition">
                          <Mail className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Password</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5ee] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#b54a2b] transition">
                          <Lock className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-2.5 rounded-xl bg-[#b54a2b] hover:bg-[#9f3f22] text-white font-semibold transition text-xs shadow-xs disabled:opacity-50"
                      >
                        {authLoading ? "Authenticating..." : "Sign In & Continue"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleInlineRegister} className="space-y-3 text-xs">
                      <div>
                        <label className="font-medium block mb-1">Full Name</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5ee] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#b54a2b] transition">
                          <User className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="text"
                            required
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="Rajesh Patel"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Email Address</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5ee] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#b54a2b] transition">
                          <Mail className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="email"
                            required
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="rajesh@example.com"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Phone Number (10 digits)</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5ee] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#b54a2b] transition">
                          <Phone className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="tel"
                            required
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            placeholder="9825012345"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-medium block mb-1">Create Password</label>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-black/[0.08] dark:border-slate-700 bg-[#f5f5ee] dark:bg-slate-950 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-[#b54a2b] transition">
                          <Lock className="w-4 h-4 text-[#86868b] mr-2" />
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="bg-transparent outline-none w-full text-[#1d1d1f] dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full py-2.5 rounded-xl bg-[#b54a2b] hover:bg-[#9f3f22] text-white font-semibold transition text-xs shadow-xs disabled:opacity-50"
                      >
                        {authLoading ? "Creating Account..." : "Register & Continue"}
                      </button>
                    </form>
                  )}

                  {/* Fallback / Guest Option */}
                  <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#86868b] hover:text-[#b54a2b] underline transition"
                    >
                      Fill Property Details First (Sign in before submission) →
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Role Selection</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            STEP 3: PROPERTY DETAILS
            ========================================================================= */}
        {currentStep === 3 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b]">Step 3 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {local("Property details", "મિલકતની સંપૂર્ણ વિગતો")}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {local("Enter the property details as recorded in municipal tax bills or society registers.", "કરારમાં જણાવવાની મિલકતનું સાચું સરનામું દાખલ કરો.")}
              </p>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">
                    {local("Property Title / Category", "મિલકત વર્ગ")}
                  </label>
                  <input
                    type="text"
                    value={formData.property_title}
                    onChange={(e) => setFormData({ ...formData, property_title: e.target.value })}
                    placeholder="e.g. 2BHK Residential Flat, Shivalik Residency"
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight
                        ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Agreement Type</label>
                  <select
                    value={formData.agreement_type}
                    onChange={(e) => setFormData({ ...formData, agreement_type: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight
                        ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  >
                    <option value="RESIDENTIAL">Residential Lease (Flat / House / Villa)</option>
                    <option value="COMMERCIAL">Commercial Lease (Office / Shop / Warehouse)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  {local("Complete Address with Landmark", "સંપૂર્ણ સરનામું (લેન્ડમાર્ક સાથે)")}
                </label>
                <textarea
                  rows={3}
                  value={formData.property_address}
                  onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  placeholder="Flat No, Wing, Society Name, Main Road, Landmark"
                  className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#b54a2b] ${
                    isLight
                      ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                      : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.property_city}
                    onChange={(e) => setFormData({ ...formData, property_city: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight
                        ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.property_state}
                    disabled
                    className={`w-full rounded-xl border px-3 py-2.5 opacity-70 ${
                      isLight ? "bg-black/[0.04] border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.property_pincode}
                    onChange={(e) => setFormData({ ...formData, property_pincode: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2.5 transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight
                        ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]"
                        : "bg-slate-950 border-slate-700 text-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-2 rounded-full bg-[#b54a2b] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#9f3f22] transition shadow-xs"
              >
                <span>Continue to Parties</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: PARTIES (OWNER & TENANT)
            ========================================================================= */}
        {currentStep === 4 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b]">Step 4 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {local("Owner & Tenant Party Information", "બંને પક્ષકારોની માહિતી")}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {local("Details must match official Aadhaar or PAN documents for digital signature validity.", "બંને પક્ષકારોના સાચા નામ અને આધાર સાથે લિંક કરેલા મોબાઈલ નંબર દાખલ કરો.")}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
              {/* Owner Column */}
              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full bg-[#b54a2b]/10 px-2.5 py-0.5 font-bold text-[#b54a2b] text-[10px]">
                    First Party (Lessor / Owner)
                  </span>
                  {mode === "OWNER" && (
                    <span className="text-[10px] text-emerald-600 font-semibold">Creator Account</span>
                  )}
                </div>

                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.owner_email}
                    onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Phone Number (UIDAI linked)</label>
                  <input
                    type="text"
                    value={formData.owner_phone}
                    onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Permanent Address</label>
                  <input
                    type="text"
                    value={formData.owner_address}
                    onChange={(e) => setFormData({ ...formData, owner_address: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
              </div>

              {/* Tenant Column */}
              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-600 text-[10px]">
                    Second Party (Lessee / Tenant)
                  </span>
                  {mode === "TENANT" && (
                    <span className="text-[10px] text-emerald-600 font-semibold">Creator Account</span>
                  )}
                </div>

                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.tenant_name}
                    onChange={(e) => setFormData({ ...formData, tenant_name: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={formData.tenant_email}
                    onChange={(e) => setFormData({ ...formData, tenant_email: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Phone Number (UIDAI linked)</label>
                  <input
                    type="text"
                    value={formData.tenant_phone}
                    onChange={(e) => setFormData({ ...formData, tenant_phone: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[#86868b] mb-1 font-medium">Permanent Address</label>
                  <input
                    type="text"
                    value={formData.tenant_address}
                    onChange={(e) => setFormData({ ...formData, tenant_address: e.target.value })}
                    className={`w-full rounded-xl border px-3 py-2 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                      isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="flex items-center gap-2 rounded-full bg-[#b54a2b] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#9f3f22] transition shadow-xs"
              >
                <span>Continue to Financials</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: RENT TERMS, DEPOSIT & DURATION
            ========================================================================= */}
        {currentStep === 5 && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b]">Step 5 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {local("Rent Terms & Duration", "ભાડું, ડિપોઝિટ અને કરાર મુદત")}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                {local("Under Gujarat Stamp Act 1958 Article 30, stamp duty is calculated based on annual rent and security deposit.", "ગુજરાત સ્ટેમ્પ નિયમ મુજબ ૧૧ મહિનાના ભાડા કરાર માટે ₹૩૦૦ સ્ટેમ્પ ડ્યુટી લાગુ પડે છે.")}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={formData.monthly_rent}
                  onChange={(e) => setFormData({ ...formData, monthly_rent: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Refundable Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.security_deposit}
                  onChange={(e) => setFormData({ ...formData, security_deposit: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Maintenance (₹/mo)</label>
                <input
                  type="number"
                  value={formData.maintenance_amount}
                  onChange={(e) => setFormData({ ...formData, maintenance_amount: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="block font-medium mb-1">Duration</label>
                <select
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                >
                  <option value={11}>11 Months (Standard Non-Registration)</option>
                  <option value={12}>12 Months (Sub-Registrar Mandatory)</option>
                  <option value={24}>24 Months</option>
                  <option value={36}>36 Months</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Commencement Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  value={formData.notice_period_days}
                  onChange={(e) => setFormData({ ...formData, notice_period_days: Number(e.target.value) })}
                  className={`w-full rounded-xl border px-3 py-2.5 text-xs transition focus:outline-none focus:border-[#b54a2b] ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.08] focus:bg-white text-[#1d1d1f]" : "bg-slate-950 border-slate-700 text-white"
                  }`}
                />
              </div>
            </div>

            {/* Gujarat Statutory Notice Box */}
            <div
              className={`mt-6 p-4 rounded-2xl border text-xs flex items-center justify-between ${
                isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Stamp className="w-4 h-4 text-[#b54a2b]" />
                <span className="text-[#1d1d1f] dark:text-white font-medium">
                  Gujarat Stamp Duty: ₹300 (11 months) | Sub-Registrar Fee: ₹0
                </span>
              </div>
              <span className="text-[10px] text-[#86868b] hidden sm:inline">
                Gujarat Stamp Act 1958 Article 30
              </span>
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-black/[0.06] dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleCreateDraft}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-[#b54a2b] hover:bg-[#9f3f22] px-7 py-2.5 text-xs font-semibold text-white shadow-xs transition disabled:opacity-50"
              >
                <span>{loading ? "Generating Legal Deed..." : "Generate Agreement Draft →"}</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 6: AADHAAR OTP IDENTITY VERIFICATION
            ========================================================================= */}
        {currentStep === 6 && createdAgreement && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b]">
                  Draft #{createdAgreement.agreement_number}
                </span>
                <h2 className="mt-0.5 text-xl font-bold tracking-tight">
                  {local("Submit your documents", "આધાર ઓળખ ચકાસણી")}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#b54a2b]/10 text-[#b54a2b] font-bold text-xs border border-[#b54a2b]/20 self-start">
                {createdAgreement.status_display || createdAgreement.status}
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-500">Upload clear identity and property documents. Admin verification starts after payment. Any correction requests appear in your dashboard.</p>

            {/* Section 3: Mandatory Document Upload (Section 3 Requirement) */}
            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-[#b54a2b]" />
                    <h3 className="text-sm font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                      Mandatory Document Upload & Supporting Attachments
                    </h3>
                  </div>
                  <p className={`text-xs mt-0.5 ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                    Required identity, address, and property proofs for legal execution & partner stamping verification.
                  </p>
                </div>


              </div>

              {/* Status summary banner */}
              {(() => {
                const hasLandlordDoc = documents.some((d) => d.document_type === "LANDLORD_ID" && d.status === "UPLOADED");
                const hasTenantDoc = documents.some((d) => d.document_type === "TENANT_ID" && d.status === "UPLOADED");
                const hasPropertyDoc = documents.some((d) => d.document_type === "PROPERTY_DOC" && d.status === "UPLOADED");
                const allMandatoryUploaded = hasLandlordDoc && hasTenantDoc && hasPropertyDoc;

                return (
                  <div className="space-y-3">
                    {!allMandatoryUploaded && (
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>
                            <strong>Mandatory Documents Missing (!):</strong> Landlord ID, Tenant ID, and Property Ownership Document must be uploaded before continuing.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20">
                          Compliance Rule
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          type: "LANDLORD_ID",
                          label: "Landlord Identity Proof",
                          desc: "Aadhaar / Voter ID / Passport",
                          mandatory: true,
                        },
                        {
                          type: "TENANT_ID",
                          label: "Tenant Identity Proof",
                          desc: "Aadhaar / PAN / Passport",
                          mandatory: true,
                        },
                        {
                          type: "PROPERTY_DOC",
                          label: "Property Document",
                          desc: "Index II / Tax Bill / Electricity Bill",
                          mandatory: true,
                        },
                      ].map((item) => {
                        const existingDoc = documents.find((d) => d.document_type === item.type);
                        const isUploaded = existingDoc && existingDoc.status === "UPLOADED";
                        const isInvalid = existingDoc && existingDoc.status === "INVALID";
                        const isUploadingThis = uploadingDocType === item.type;

                        return (
                          <div
                            key={item.type}
                            className={`p-4 rounded-2xl border transition ${
                              isUploaded
                                ? isLight ? "bg-emerald-50/50 border-emerald-200" : "bg-emerald-950/20 border-emerald-800/40"
                                : isInvalid
                                ? isLight ? "bg-rose-50/50 border-rose-200" : "bg-rose-950/20 border-rose-800/40"
                                : isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-bold text-[#1d1d1f] dark:text-white block">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {item.desc}
                                </span>
                              </div>

                              {/* Document status badges: Uploaded ✓, Missing !, Invalid × */}
                              {isUploaded ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1 shrink-0">
                                  <Check className="w-3 h-3" />
                                  <span>Uploaded ✓</span>
                                </span>
                              ) : isInvalid ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 flex items-center gap-1 shrink-0">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Invalid ×</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1 shrink-0">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>Missing !</span>
                                </span>
                              )}
                            </div>

                            {/* File info or upload control */}
                            <div className="mt-3 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                              {existingDoc && (
                                <div className="text-[11px] mb-2 truncate">
                                  <span className="font-mono text-slate-500">
                                    {existingDoc.file_name || "Attachment"}
                                  </span>
                                  {existingDoc.file_size ? (
                                    <span className="text-[10px] text-slate-400 ml-1">
                                      ({Math.round(existingDoc.file_size / 1024)} KB)
                                    </span>
                                  ) : null}
                                </div>
                              )}

                              <label
                                className={`w-full py-2 px-3 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                                  isUploaded
                                    ? "border-black/[0.08] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-[#b54a2b]"
                                    : "border-[#b54a2b] bg-[#b54a2b] text-white hover:bg-[#9f3f22]"
                                }`}
                              >
                                {isUploadingThis ? (
                                  <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Uploading...</span>
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>{isUploaded ? "Replace File" : "Upload File (PDF/IMG)"}</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                                  className="hidden"
                                  disabled={isUploadingThis}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(item.type, file);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/[0.06] dark:border-slate-800">
              {(() => {
                const hasLandlordDoc = documents.some((d) => d.document_type === "LANDLORD_ID" && d.status === "UPLOADED");
                const hasTenantDoc = documents.some((d) => d.document_type === "TENANT_ID" && d.status === "UPLOADED");
                const hasPropertyDoc = documents.some((d) => d.document_type === "PROPERTY_DOC" && d.status === "UPLOADED");
                const allMandatoryUploaded = hasLandlordDoc && hasTenantDoc && hasPropertyDoc;

                return (
                  <>
                    <div className="text-xs text-[#86868b]">
                      {!allMandatoryUploaded ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          ⚠️ Upload 3 mandatory documents to unlock Review & Delivery Selection.
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>All required documents uploaded. Admin verification is pending.</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(7)}
                      disabled={!allMandatoryUploaded}
                      className="flex items-center gap-2 rounded-full bg-[#b54a2b] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#9f3f22] transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span>Continue to Review & Delivery Selection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 7: REVIEW, DELIVERY SELECTION & PAYMENT (SECTIONS 4, 5, 6, 36)
            ========================================================================= */}
        {currentStep === 7 && createdAgreement && (
          <div
            className={`mt-6 rounded-3xl p-6 sm:p-8 border shadow-sm ${
              isLight ? "bg-white border-black/[0.08]" : "bg-slate-900/60 border-slate-800"
            }`}
          >
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b]">Step 7 of 8</span>
              <h2 className="mt-1 text-xl font-bold tracking-tight">
                {local("Final Review, Delivery Selection & Payment", "અંતિમ સમીક્ષા, ડિલિવરી પસંદગી અને ચુકવણી")}
              </h2>
              <p className={`mt-1 text-xs ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                Review agreement terms, choose your delivery format (Soft Copy vs Physical Hard Copy), and complete payment.
              </p>
            </div>

            {/* Section 4: Final Review Before Payment */}
            <div
              className={`mt-6 rounded-2xl border p-5 space-y-4 ${
                isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] dark:border-slate-800 pb-3 gap-2">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider text-[#b54a2b] block">
                    Agreement Summary & Verification
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Draft #{createdAgreement.agreement_number} • Immutable after order confirmation
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Need corrections?</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#b54a2b] hover:underline"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Details</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Landlord & Tenant Details */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#b54a2b]">
                    <span>LANDLORD (FIRST PARTY)</span>
                    <button type="button" onClick={() => setCurrentStep(4)} className="text-[10px] text-slate-400 hover:text-[#b54a2b]">Edit</button>
                  </div>
                  <div>
                    <span className="font-bold text-[#1d1d1f] dark:text-white block">{formData.owner_name}</span>
                    <span className="text-[11px] text-slate-400 block">{formData.owner_phone} • {formData.owner_email}</span>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">{formData.owner_address}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#b54a2b]">
                    <span>TENANT (SECOND PARTY)</span>
                    <button type="button" onClick={() => setCurrentStep(4)} className="text-[10px] text-slate-400 hover:text-[#b54a2b]">Edit</button>
                  </div>
                  <div>
                    <span className="font-bold text-[#1d1d1f] dark:text-white block">{formData.tenant_name}</span>
                    <span className="text-[11px] text-slate-400 block">{formData.tenant_phone} • {formData.tenant_email}</span>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">{formData.tenant_address}</span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#b54a2b] mb-1">
                  <span>PROPERTY PREMISES</span>
                  <button type="button" onClick={() => setCurrentStep(3)} className="text-[10px] text-slate-400 hover:text-[#b54a2b]">Edit</button>
                </div>
                <div className="font-semibold text-xs text-[#1d1d1f] dark:text-white">{formData.property_title}</div>
                <div className="text-[11px] text-slate-400">
                  {formData.property_address}, {formData.property_city}, {formData.property_state} - {formData.property_pincode}
                </div>
              </div>

              {/* Financial & Contractual Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Monthly Rent</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white" suppressHydrationWarning>₹{formatINR(formData.monthly_rent)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Security Deposit</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white" suppressHydrationWarning>₹{formatINR(formData.security_deposit)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Duration</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white">{formData.duration_months} Months</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Start Date</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white">{formData.start_date}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">End Date</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white">
                    {formData.start_date
                      ? new Date(new Date(formData.start_date).setMonth(new Date(formData.start_date).getMonth() + Number(formData.duration_months || 11))).toISOString().split("T")[0]
                      : "11 Months Hence"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Maintenance</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white" suppressHydrationWarning>₹{formatINR(formData.maintenance_amount)}/mo</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Notice Period</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white">{formData.notice_period_days} Days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block">Lock-in Period</span>
                  <span className="font-bold text-[#1d1d1f] dark:text-white">{formData.lock_in_months} Months</span>
                </div>
              </div>

              {/* Edit Details and Confirm & Continue Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/[0.06] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 rounded-xl border border-black/[0.1] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#b54a2b] transition"
                  >
                    ← Edit Details
                  </button>
                  {reviewConfirmed && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Details Confirmed ✓</span>
                    </span>
                  )}
                </div>

                {!reviewConfirmed && (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewConfirmed(true);
                      setFinancialConfirmed(true);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#b54a2b] hover:bg-[#9f3f22] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Confirm & Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Section 5: Delivery Type Selection (Section 5 Requirement) */}
            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-slate-800">
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b54a2b] block">
                  Delivery Method
                </span>
                <h3 className="text-base font-bold tracking-tight text-[#1d1d1f] dark:text-white mt-0.5">
                  How would you like to receive your agreement?
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-[#86868b]" : "text-slate-400"}`}>
                  Receive the approved PDF in your dashboard, or add a printed copy delivered by courier.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Soft Copy */}
                <div
                  onClick={() => setDeliveryType("SOFT_COPY")}
                  className={`p-5 rounded-2xl border cursor-pointer transition relative ${
                    deliveryType === "SOFT_COPY"
                      ? "border-[#b54a2b] bg-[#b54a2b]/5 shadow-sm ring-1 ring-[#b54a2b]"
                      : isLight ? "bg-[#f5f5ee] border-black/[0.06] hover:border-black/[0.15]" : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#b54a2b]" />
                        <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">Option 1 — Soft Copy</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Receive the final agreement digitally by email.</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Included / Free
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Digital PDF with Cryptographic Seal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Email Delivery to all parties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Download anytime from Customer Dashboard</span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Hard Copy */}
                <div
                  onClick={() => setDeliveryType("HARD_COPY")}
                  className={`p-5 rounded-2xl border cursor-pointer transition relative ${
                    deliveryType === "HARD_COPY"
                      ? "border-[#b54a2b] bg-[#b54a2b]/5 shadow-sm ring-1 ring-[#b54a2b]"
                      : isLight ? "bg-[#f5f5ee] border-black/[0.06] hover:border-black/[0.15]" : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#b54a2b]" />
                        <span className="font-bold text-sm text-[#1d1d1f] dark:text-white">Option 2 — Hard Copy</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Receive a physical printed copy by courier.</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#b54a2b]/10 text-[#b54a2b] border border-[#b54a2b]/20">
                      +₹{pricingConfig.hard_copy_fee || 50}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#b54a2b] shrink-0" />
                      <span>Printed on Official Government Stamp Paper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#b54a2b] shrink-0" />
                      <span>Speed Post / Tracked Express Courier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#b54a2b] shrink-0" />
                      <span>Tracking ID & Live Status in Dashboard</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hard Copy Delivery Address Form */}
              {deliveryType === "HARD_COPY" && (
                <div
                  className={`mt-4 p-5 rounded-2xl border space-y-4 ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.08]" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#b54a2b]" />
                      <span>Courier Delivery Shipping Address</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Shipped upon partner QC completion</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Recipient Name</label>
                      <input
                        type="text"
                        value={courierRecipientName || (mode === "TENANT" ? formData.tenant_name : formData.owner_name)}
                        onChange={(e) => setCourierRecipientName(e.target.value)}
                        placeholder="Recipient full name"
                        className={`w-full rounded-xl border px-3 py-2 text-xs transition ${
                          isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">Recipient Mobile Number</label>
                      <input
                        type="text"
                        value={courierRecipientPhone || (mode === "TENANT" ? formData.tenant_phone : formData.owner_phone)}
                        onChange={(e) => setCourierRecipientPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className={`w-full rounded-xl border px-3 py-2 text-xs transition ${
                          isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 font-medium mb-1">Courier Delivery Street Address</label>
                      <input
                        type="text"
                        value={courierDeliveryAddress || formData.property_address}
                        onChange={(e) => setCourierDeliveryAddress(e.target.value)}
                        placeholder="Complete house/flat/building and street address"
                        className={`w-full rounded-xl border px-3 py-2 text-xs transition ${
                          isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={courierCity}
                        onChange={(e) => setCourierCity(e.target.value)}
                        className={`w-full rounded-xl border px-3 py-2 text-xs transition ${
                          isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">State</label>
                        <input
                          type="text"
                          value={courierState}
                          onChange={(e) => setCourierState(e.target.value)}
                          className={`w-full rounded-xl border px-3 py-2 text-xs transition ${
                            isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Pincode</label>
                        <input
                          type="text"
                          value={courierPincode}
                          onChange={(e) => setCourierPincode(e.target.value)}
                          className={`w-full rounded-xl border px-3 py-2 text-xs transition ${
                            isLight ? "bg-white border-black/[0.08] text-[#1d1d1f]" : "bg-slate-900 border-slate-700 text-white"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-slate-800">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-slate-800">
                  <h3 className="font-bold">What happens after payment?</h3>
                  <ol className="mt-3 space-y-3 text-sm list-decimal pl-5">
                    <li>Your order and uploaded documents appear in your dashboard, pending verification.</li>
                    <li>Our team verifies the documents and assigns a legal / notary partner in your city.</li>
                    <li>The partner prepares your agreement. We review the final copy before delivery.</li>
                    <li>Download your approved PDF, or track your paid hard-copy courier delivery.</li>
                  </ol>
                </div>

                {/* Section 6: Payment Summary Before Gateway */}
                <div
                  className={`rounded-2xl border p-5 space-y-3 ${
                    isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Stage 2: Payment Summary & Confirmation</span>
                    {(isStamped || paymentCompleted) && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  </div>

                  {(() => {
                    const serviceFeeNum = Number(pricingConfig.service_fee ?? 1499);
                    const hardCopyFeeNum = deliveryType === "HARD_COPY" ? Number(pricingConfig.hard_copy_fee ?? 50) : 0;
                    const courierFeeNum = deliveryType === "HARD_COPY" ? Number(pricingConfig.courier_fee ?? 0) + Number(pricingConfig.printing_fee ?? 0) : 0;
                    const totalPayableNum = serviceFeeNum + hardCopyFeeNum + courierFeeNum;

                    return (
                      <>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-extrabold text-[#b54a2b]" suppressHydrationWarning>₹{formatINR(totalPayableNum)}</span>
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {deliveryType === "HARD_COPY" ? "Complete Package + Courier" : "Statutory Complete Package"}
                          </span>
                        </div>

                        {/* Breakdown per Section 6 */}
                        <div className="text-[11px] text-slate-500 space-y-1.5 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
                          <div className="flex justify-between">
                            <span>Agreement Service:</span>
                            <span className="font-mono font-medium">₹{serviceFeeNum.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Agreement preparation charges:</span>
                            <span className="font-mono font-medium text-emerald-600">Included</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hard Copy (Physical Stamp Paper):</span>
                            <span className="font-mono font-medium">
                              {deliveryType === "HARD_COPY" ? `₹${hardCopyFeeNum.toFixed(2)}` : "Free (Soft Copy)"}
                            </span>
                          </div>
                          {courierFeeNum > 0 && (
                            <div className="flex justify-between">
                              <span>Courier Dispatch Fee:</span>
                              <span className="font-mono font-medium">₹{courierFeeNum.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-1.5 border-t border-black/[0.06] dark:border-slate-800 font-bold text-xs text-[#1d1d1f] dark:text-white">
                            <span>Total Payable:</span>
                            <span className="font-mono text-[#b54a2b]" suppressHydrationWarning>₹{formatINR(totalPayableNum)}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          id="rent-agreement-razorpay-pay-btn"
                          onClick={handleRazorpayPaymentAndComplete}
                          disabled={loading || isRazorpayPaying || isStamped || !reviewConfirmed}
                          className="w-full rounded-xl bg-[#b54a2b] hover:bg-[#9f3f22] py-3 text-xs font-semibold text-white shadow-md disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isStamped ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>Order Confirmed ✓</span>
                            </>
                          ) : isRazorpayPaying ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Opening Razorpay Standard Checkout...</span>
                            </>
                          ) : loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Processing Order...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-4 h-4" />
                              <span suppressHydrationWarning>Proceed to Payment (₹{formatINR(totalPayableNum)})</span>
                            </>
                          )}
                        </button>

                        <p className="text-[10px] text-center text-slate-400">
                          {pricingConfig.sla_display_text || "Expected completion within 7 days."}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 8: AGREEMENT ORDER CREATED SUCCESSFULLY (SECTIONS 8, 9, 10)
            ========================================================================= */}
        {currentStep === 8 && createdAgreement && (
          <div
            className={`mt-6 rounded-3xl p-8 border text-center shadow-md ${
              isLight ? "bg-white border-emerald-200" : "bg-slate-900/80 border-emerald-500/30"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
              Agreement Order Created Successfully
            </h2>
            <p className={`mx-auto mt-2 max-w-md text-xs ${isLight ? "text-[#86868b]" : "text-slate-300"}`}>
              Your rental agreement order has been confirmed and routed to partner processing.
            </p>

            {/* Key Order Attributes Card per Section 9 */}
            <div
              className={`mx-auto mt-6 max-w-lg rounded-2xl border p-5 text-left text-xs space-y-3 ${
                isLight ? "bg-[#f5f5ee] border-black/[0.06]" : "bg-slate-950 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Order ID:</span>
                <span className="font-mono font-bold text-sm text-[#b54a2b]">
                  {createdOrder?.order_number || "ERK-2026-000125"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Payment:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Successful ({createdOrder?.payment_id || paymentInfo?.payment_id || "Verified"})</span>
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Delivery:</span>
                <span className="font-semibold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                  {deliveryType === "HARD_COPY" ? (
                    <>
                      <Truck className="w-3.5 h-3.5 text-[#b54a2b]" />
                      <span>Hard Copy (Physical Printed Courier)</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-[#b54a2b]" />
                      <span>Soft Copy (Digital PDF & Email)</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-slate-800 pb-2">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-semibold px-2.5 py-0.5 rounded-full bg-[#b54a2b]/10 text-[#b54a2b] text-[11px]">
                  {createdOrder?.status_display || "Processing"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Estimated completion:</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {pricingConfig.sla_display_text || "Expected completion within 7 days."}
                </span>
              </div>
            </div>

            {/* Section 10 Disclaimer */}
            <p className="mt-3 text-[11px] text-slate-400 italic">
              Estimated processing time: up to 7 business days. Timelines depend on document verification and partner preparation.
            </p>

            {/* Auto redirect banner */}
            {createdOrder?.order_number && (
              <div className="mt-4 text-xs text-slate-500">
                Redirecting to Customer Dashboard in <span className="font-bold text-[#b54a2b]">{redirectCountdown}s</span>...
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/dashboard/orders/${createdOrder?.order_number || "ERK-2026-000125"}`}
                className="flex items-center gap-2 rounded-full bg-[#b54a2b] hover:bg-[#9f3f22] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Track in Customer Dashboard</span>
              </Link>

              <a
                href={`/api/v1/agreements/${createdAgreement.id}/download-pdf/`}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold border transition ${
                  isLight
                    ? "bg-[#f5f5ee] border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.04]"
                    : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                }`}
              >
                <Download className="w-3.5 h-3.5 text-[#b54a2b]" />
                <span>Download Draft PDF</span>
              </a>

              <Link
                href="/dashboard/orders"
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold border transition ${
                  isLight
                    ? "bg-white border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.04]"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>All Orders</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgreementWizardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading e-Stamp Agreement Wizard...</div>}>
      <AgreementWizardContent />
    </React.Suspense>
  );
}
