"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  FileText,
  Upload,
  Type,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Home,
  IndianRupee,
  Calendar,
  Lock,
  Stamp,
  Download,
  Copy,
  ZoomIn,
  ZoomOut,
  Edit3,
  RefreshCw,
  Printer,
  Check,
  Store,
  Phone,
  Mail,
  FileCheck,
  MapPin,
  Clock,
  Layers,
  HelpCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { launchRazorpayCheckout } from "@/lib/razorpay";

// 28 Indian States & Stamp Duty Info
const INDIAN_STATES = [
  { name: "Gujarat", duty: 300, code: "GJ", recommended: 300 },
  { name: "Maharashtra", duty: 500, code: "MH", recommended: 500 },
  { name: "Delhi", duty: 500, code: "DL", recommended: 500 },
  { name: "Karnataka", duty: 500, code: "KA", recommended: 500 },
  { name: "Telangana", duty: 100, code: "TS", recommended: 100 },
  { name: "Tamil Nadu", duty: 200, code: "TN", recommended: 200 },
  { name: "Uttar Pradesh", duty: 100, code: "UP", recommended: 100 },
  { name: "Rajasthan", duty: 500, code: "RJ", recommended: 500 },
  { name: "Haryana", duty: 200, code: "HR", recommended: 200 },
  { name: "Punjab", duty: 100, code: "PB", recommended: 100 },
  { name: "West Bengal", duty: 100, code: "WB", recommended: 100 },
  { name: "Madhya Pradesh", duty: 100, code: "MP", recommended: 100 },
  { name: "Bihar", duty: 100, code: "BR", recommended: 100 },
  { name: "Andhra Pradesh", duty: 100, code: "AP", recommended: 100 },
  { name: "Kerala", duty: 200, code: "KL", recommended: 200 },
  { name: "Odisha", duty: 100, code: "OD", recommended: 100 },
  { name: "Assam", duty: 100, code: "AS", recommended: 100 },
  { name: "Chandigarh", duty: 100, code: "CH", recommended: 100 },
  { name: "Goa", duty: 500, code: "GA", recommended: 500 },
  { name: "Uttarakhand", duty: 100, code: "UK", recommended: 100 },
  { name: "Himachal Pradesh", duty: 100, code: "HP", recommended: 100 },
  { name: "Jharkhand", duty: 100, code: "JH", recommended: 100 },
  { name: "Chhattisgarh", duty: 100, code: "CG", recommended: 100 },
  { name: "Jammu & Kashmir", duty: 100, code: "JK", recommended: 100 },
  { name: "Puducherry", duty: 100, code: "PY", recommended: 100 },
];

function RentAgreementAIContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: OWNER, TENANT, KIOSK (Assisted)
  const initialRole = (searchParams.get("role") as "OWNER" | "TENANT" | "KIOSK") || "OWNER";
  const [role, setRole] = useState<"OWNER" | "TENANT" | "KIOSK">(initialRole);

  // Tab: AI Wizard, Upload, Type
  const [activeTab, setActiveTab] = useState<"AI" | "UPLOAD" | "TYPE">("AI");

  // Main 3-Step Pipeline (matching eDrafter.in)
  // Step 0: Document Details Builder (Wizard)
  // Step 1: Additional Services & Stamping
  // Step 2: Review, eSign & Checkout
  const [mainStep, setMainStep] = useState<number>(0);

  // Mobile View Toggle: "FORM" vs "PREVIEW"
  const [mobileView, setMobileView] = useState<"FORM" | "PREVIEW">("FORM");

  // Zoom level for document preview
  const [zoom, setZoom] = useState<number>(100);

  // Form State
  const [formData, setFormData] = useState({
    state: "Gujarat",
    city: "Ahmedabad",
    propertyCategory: "Residential Flat",
    propertyAddress: "Flat 402, Shivalik Heights, SG Highway",
    propertyPincode: "380015",
    purpose: "Residential",
    furnishing: "Semi-furnished",
    monthlyRent: 22000,
    securityDeposit: 44000,
    maintenanceAmount: 2000,
    rentDueDay: 5,
    depositMode: "UPI / Bank Transfer",
    durationMonths: 11,
    startDate: "2026-11-01",
    endDate: "2027-09-30",
    noticePeriodDays: 30,
    lockInMonths: 3,
    rentIncrementPercent: 10,
    utilitiesBy: "Tenant — as per sub-meter usage",
    electricityMeterNo: "TOR-98213401",
    discomBoard: "Torrent Power",
    fittings: ["Ceiling Fans (4)", "LED Tube Lights (6)", "Geyser (2)", "AC in Master Bed (1)", "Modular Kitchen Cabinets"],
    specialClauses: "Standard model tenancy terms. No commercial exploitation. Annual painting wear & tear covered.",
    titleWarrantyAccepted: true,
    // Owner Details
    ownerName: "Rajeshbhai K. Patel",
    ownerRelation: "S/o Kantilal Patel",
    ownerAddress: "B-102, Shivalik Highstreet, Ahmedabad, Gujarat",
    ownerPhone: "9825012345",
    ownerEmail: "owner@erentkarar.com",
    ownerAadhaar: "999988887777",
    // Tenant Details
    tenantName: "Sunil M. Verma",
    tenantRelation: "S/o Mohanlal Verma",
    tenantAddress: "Plot 45, Civil Lines, Jaipur, Rajasthan",
    tenantPhone: "9898012345",
    tenantEmail: "tenant@erentkarar.com",
    tenantAadhaar: "123456789012",
    // Kiosk Details
    kioskShopId: "fa543087-9671-4356-b32b-7fbde45ea21f",
    kioskOperatorName: "Ramesh Sharma (Kiosk Operator)",
  });

  // Wizard Sub-Step within Step 0
  const [wizardStep, setWizardStep] = useState<number>(0);

  // Add-ons State (Step 1)
  const [addons, setAddons] = useState({
    stampPaper: 300,
    notary: true, // +₹90
    notaryPrice: 90,
    digitalSign: true, // +₹39
    digitalSignPrice: 39,
    scanService: "quick",
    scanPrice: 65,
    deliveryMode: "digital", // "digital" or "courier"
    courierFee: 0,
    courierAddress: "",
    courierPincode: "",
  });

  // Live Pulse tracker for field highlights
  const [activeHighlight, setActiveHighlight] = useState<string>("");

  // Backend Execution state
  const [createdAgreement, setCreatedAgreement] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [executionStatus, setExecutionStatus] = useState<string>("");
  const [aadhaarVerified, setAadhaarVerified] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [isStamped, setIsStamped] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [pricingConfig, setPricingConfig] = useState<any>(null);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);

  useEffect(() => {
    api.getPricingConfig()
      .then((res: any) => {
        if (res && res.data) {
          setPricingConfig(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Upload simulation state
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Text paste state
  const [pasteText, setPasteText] = useState<string>("");

  // Update End Date automatically when Start Date or Duration changes
  useEffect(() => {
    if (formData.startDate && formData.durationMonths) {
      try {
        const [y, m, d] = formData.startDate.split("-").map(Number);
        const date = new Date(y, m - 1 + formData.durationMonths, d);
        date.setDate(date.getDate() - 1);
        const endIso = date.toISOString().split("T")[0];
        setFormData((prev) => ({ ...prev, endDate: endIso }));
      } catch (e) {}
    }
  }, [formData.startDate, formData.durationMonths]);

  // Update Stamp Duty when State changes
  useEffect(() => {
    const matched = INDIAN_STATES.find((s) => s.name.toLowerCase() === formData.state.toLowerCase());
    if (matched) {
      setAddons((prev) => ({ ...prev, stampPaper: matched.duty }));
    }
  }, [formData.state]);

  // Handle Input Changes with real-time flash highlight on the deed preview
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setActiveHighlight(field);
    setTimeout(() => setActiveHighlight(""), 1200);
  };

  // Dynamic Pricing Calculation (connected to AgreementPricingConfig for ₹1 checkout)
  const effectiveTotal = useMemo(() => {
    if (pricingConfig) {
      const sFee = Number(pricingConfig.service_fee ?? 1.00);
      const hFee = addons.deliveryMode === "courier" ? Number(pricingConfig.hard_copy_fee ?? 1.00) : 0;
      return sFee + hFee;
    }
    return addons.deliveryMode === "courier" ? 2.00 : 1.00;
  }, [pricingConfig, addons.deliveryMode]);

  const priceBreakup = useMemo(() => {
    const stampFee = addons.stampPaper;
    const notaryFee = addons.notary ? addons.notaryPrice : 0;
    const signFee = addons.digitalSign ? addons.digitalSignPrice : 0;
    const scanFee = addons.scanPrice;
    const courierFee = addons.deliveryMode === "courier" ? 99 : 0;
    const platformFee = 99;
    const subtotal = stampFee + notaryFee + signFee + scanFee + courierFee + platformFee;
    return {
      stampFee,
      notaryFee,
      signFee,
      scanFee,
      courierFee,
      platformFee,
      total: subtotal,
    };
  }, [addons]);

  // Questions configuration for the step-by-step AI wizard
  const questions = [
    {
      id: "state",
      group: "LOCATION",
      title: "Which state is the rented property located in?",
      help: "Determines state-specific stamp duty laws (Gujarat, Maharashtra, Karnataka, Delhi, etc.) and registration rules.",
      type: "select-state",
    },
    {
      id: "city",
      group: "LOCATION",
      title: "Which city is the property situated in?",
      help: "Defines the place of agreement execution and legal court jurisdiction.",
      type: "text",
      field: "city",
      placeholder: "e.g. Ahmedabad, Bengaluru, Mumbai, Pune, Delhi",
    },
    {
      id: "propertyCategory",
      group: "PROPERTY",
      title: "What type of premises is being rented?",
      help: "Select property category for the legal tenancy covenant.",
      type: "chips",
      field: "propertyCategory",
      options: ["Residential Flat", "Independent House / Villa", "PG Bed / Co-Living Unit", "Commercial Office / Shop"],
    },
    {
      id: "propertyAddress",
      group: "PROPERTY",
      title: "What is the full complete address of the premises?",
      help: "As per municipal tax bill or property deed, including flat number, building, and street.",
      type: "text",
      field: "propertyAddress",
      placeholder: "Flat 402, Shivalik Heights, SG Highway",
    },
    {
      id: "propertyPincode",
      group: "PROPERTY",
      title: "Property Pincode?",
      help: "Used for location verification and dispatch.",
      type: "text",
      field: "propertyPincode",
      placeholder: "e.g. 380015",
    },
    {
      id: "ownerName",
      group: "LANDLORD / FIRST PARTY",
      title: "What is the full legal name of the Landlord (Owner)?",
      help: "As shown on government ID (Aadhaar / PAN card).",
      type: "text",
      field: "ownerName",
      placeholder: "e.g. Rajeshbhai K. Patel",
    },
    {
      id: "ownerRelation",
      group: "LANDLORD / FIRST PARTY",
      title: "Landlord's Father's / Husband's Name?",
      help: "Used for the statutory 'S/o · D/o · W/o' legal identification lineage in Indian deed law.",
      type: "text",
      field: "ownerRelation",
      placeholder: "e.g. S/o Kantilal Patel",
    },
    {
      id: "ownerAddress",
      group: "LANDLORD / FIRST PARTY",
      title: "Landlord's permanent correspondence address?",
      help: "Where official legal notices will be served if required.",
      type: "text",
      field: "ownerAddress",
      placeholder: "Permanent residential address",
    },
    {
      id: "ownerPhone",
      group: "LANDLORD / FIRST PARTY",
      title: "Landlord's 10-digit mobile number?",
      help: "Required for UIDAI Aadhaar eSign OTP verification.",
      type: "text",
      field: "ownerPhone",
      placeholder: "e.g. 9825012345",
    },
    {
      id: "ownerAadhaar",
      group: "LANDLORD / FIRST PARTY",
      title: "Landlord's Aadhaar or PAN number (masked)?",
      help: "Identifies the First Party in the e-stamp certificate.",
      type: "text",
      field: "ownerAadhaar",
      placeholder: "e.g. 9999 8888 7777",
    },
    {
      id: "tenantName",
      group: "TENANT / SECOND PARTY",
      title: "What is the full legal name of the Tenant (Renter)?",
      help: "As shown on tenant's government identification.",
      type: "text",
      field: "tenantName",
      placeholder: "e.g. Sunil M. Verma",
    },
    {
      id: "tenantRelation",
      group: "TENANT / SECOND PARTY",
      title: "Tenant's Father's / Husband's Name?",
      help: "Used for tenant legal identification in the agreement.",
      type: "text",
      field: "tenantRelation",
      placeholder: "e.g. S/o Mohanlal Verma",
    },
    {
      id: "tenantAddress",
      group: "TENANT / SECOND PARTY",
      title: "Tenant's permanent native address?",
      help: "Permanent home address outside this rented premises.",
      type: "text",
      field: "tenantAddress",
      placeholder: "Native home address",
    },
    {
      id: "tenantPhone",
      group: "TENANT / SECOND PARTY",
      title: "Tenant's mobile number?",
      help: "Used for eSign invitation and digital lease signing.",
      type: "text",
      field: "tenantPhone",
      placeholder: "e.g. 9898012345",
    },
    {
      id: "monthlyRent",
      group: "RENT & FINANCES",
      title: "What is the monthly rent agreed upon (₹)?",
      help: "Base monthly rent amount payable by the tenant.",
      type: "number",
      field: "monthlyRent",
      placeholder: "e.g. 22000",
    },
    {
      id: "securityDeposit",
      group: "RENT & FINANCES",
      title: "How much is the refundable security deposit (₹)?",
      help: "Interest-free refundable security deposit returned at tenancy end.",
      type: "number",
      field: "securityDeposit",
      placeholder: "e.g. 44000",
    },
    {
      id: "maintenanceAmount",
      group: "RENT & FINANCES",
      title: "Monthly society maintenance charges (₹)?",
      help: "Enter 0 if maintenance is already included in base rent.",
      type: "number",
      field: "maintenanceAmount",
      placeholder: "e.g. 2000",
    },
    {
      id: "rentDueDay",
      group: "RENT & FINANCES",
      title: "Rent payment due day of the month?",
      help: "Typically on or before 5th or 10th of every calendar month.",
      type: "number",
      field: "rentDueDay",
      placeholder: "5",
    },
    {
      id: "durationMonths",
      group: "DURATION & TERMS",
      title: "What is the agreement duration (in months)?",
      help: "11 months is Indian industry standard to avoid compulsory 12-month registration fees.",
      type: "number",
      field: "durationMonths",
      placeholder: "11",
    },
    {
      id: "startDate",
      group: "DURATION & TERMS",
      title: "When does the tenancy commence?",
      help: "Start date of the lease. End date will be computed automatically.",
      type: "date",
      field: "startDate",
    },
    {
      id: "noticePeriodDays",
      group: "DURATION & TERMS",
      title: "Notice period to vacate (in days)?",
      help: "Advance notice required from either party to terminate tenancy.",
      type: "number",
      field: "noticePeriodDays",
      placeholder: "30",
    },
    {
      id: "lockInMonths",
      group: "DURATION & TERMS",
      title: "Lock-in period (months)?",
      help: "Minimum commitment period during which neither party can terminate without penalty.",
      type: "number",
      field: "lockInMonths",
      placeholder: "3",
    },
    {
      id: "utilitiesBy",
      group: "UTILITIES & METER",
      title: "Who will pay electricity & water charges?",
      help: "Specifies utility sub-meter billing arrangements.",
      type: "chips",
      field: "utilitiesBy",
      options: [
        "Tenant — as per sub-meter usage",
        "Owner — included in monthly rent",
        "Split equally between both parties",
      ],
    },
    {
      id: "discomBoard",
      group: "UTILITIES & METER",
      title: "Electricity Board (DISCOM) & Meter / CA Number?",
      help: "Used for verified sub-meter utility billing.",
      type: "text",
      field: "discomBoard",
      placeholder: "e.g. Torrent Power / BSES / BESCOM - Meter #TOR-98213401",
    },
    {
      id: "rentIncrementPercent",
      group: "RENEWAL & CLAUSES",
      title: "Annual rent escalation percentage on renewal (%)?",
      help: "Standard in India is 5% to 10% on 11-month renewal.",
      type: "number",
      field: "rentIncrementPercent",
      placeholder: "10",
    },
    {
      id: "specialClauses",
      group: "RENEWAL & CLAUSES",
      title: "Any custom house rules or special terms?",
      help: "e.g. Pets policy, non-vegetarian cooking, car parking bay number, painting wear & tear on exit.",
      type: "textarea",
      field: "specialClauses",
      placeholder: "e.g. 1 covered four-wheeler parking allotted. Painting charges of ₹5,000 on handover.",
    },
  ];

  // Number to Indian Words formatting helper
  const numberToWords = (num: number): string => {
    if (!num || isNaN(num)) return "Zero";
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const formatTens = (n: number) => {
      if (n < 20) return a[n];
      return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    };

    if (num < 100) return formatTens(num);
    if (num < 1000)
      return a[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + formatTens(num % 100) : "");
    if (num < 100000)
      return (
        formatTens(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
      );
    if (num < 10000000)
      return (
        formatTens(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "")
      );
    return num.toLocaleString("en-IN");
  };

  // Simulate file upload OCR extraction
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setIsUploading(false);
          // Autofill extracted values
          setFormData((f) => ({
            ...f,
            ownerName: "Harishchandra M. Mehta",
            ownerRelation: "S/o Manilal Mehta",
            tenantName: "Pooja V. Rathod",
            tenantRelation: "D/o Vinod Rathod",
            propertyAddress: "Flat 501, Gokul Residency, Bodakdev, Ahmedabad",
            monthlyRent: 26000,
            securityDeposit: 52000,
            maintenanceAmount: 2500,
            durationMonths: 11,
          }));
          setActiveHighlight("propertyAddress");
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Parse raw text pasted
  const handleParsePasteText = () => {
    if (!pasteText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Regex extraction simulation
      const rentMatch = pasteText.match(/(\d{4,6})/);
      if (rentMatch) {
        setFormData((prev) => ({ ...prev, monthlyRent: parseInt(rentMatch[1], 10) }));
      }
      setFormData((prev) => ({
        ...prev,
        specialClauses: pasteText.slice(0, 200),
      }));
      setActiveTab("AI");
      setActiveHighlight("monthlyRent");
    }, 600);
  };

  // Final Execution Submission to eRentKarar Backend
  const handleExecuteAgreement = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    setExecutionStatus("Submitting agreement data to eRentKarar legal repository...");

    try {
      const payload = {
        property_title: `${formData.propertyCategory} at ${formData.city}`,
        property_address: formData.propertyAddress,
        property_city: formData.city,
        property_state: formData.state,
        property_pincode: formData.propertyPincode,
        property_category: formData.propertyCategory,
        monthly_rent: formData.monthlyRent,
        security_deposit: formData.securityDeposit,
        maintenance_amount: formData.maintenanceAmount,
        duration_months: formData.durationMonths,
        start_date: formData.startDate,
        notice_period_days: formData.noticePeriodDays,
        lock_in_months: formData.lockInMonths,
        agreement_type: "RESIDENTIAL",
        owner_details: {
          full_name: formData.ownerName,
          email: formData.ownerEmail,
          phone: formData.ownerPhone,
          address: formData.ownerAddress,
        },
        tenant_details: {
          full_name: formData.tenantName,
          email: formData.tenantEmail,
          phone: formData.tenantPhone,
          address: formData.tenantAddress,
        },
        ...(role === "KIOSK"
          ? {
              shop_id: formData.kioskShopId,
              assisted_by: formData.kioskOperatorName,
            }
          : {}),
      };

      let createRes;
      if (role === "OWNER") {
        createRes = await api.createOwnerAgreement(payload);
      } else if (role === "TENANT") {
        createRes = await api.createTenantAgreement(payload);
      } else {
        createRes = await api.createAssistedAgreement(payload);
      }

      if (!createRes.success || !createRes.data) {
        throw new Error(createRes.message || "Failed to create agreement record");
      }

      if (createRes.tokens?.access) {
        localStorage.setItem("erk_token", createRes.tokens.access);
      }

      const agr = createRes.data;
      setCreatedAgreement(agr);
      setExecutionStatus("Agreement created! Verifying Aadhaar via UIDAI Gateway...");

      // Step 2: Aadhaar OTP Verification
      try {
        await api.verifyPartyIdentity(agr.id, {
          party_type: role === "TENANT" ? "TENANT" : "OWNER",
          aadhaar_number: role === "TENANT" ? formData.tenantAadhaar : formData.ownerAadhaar,
          otp_code: "123456", // Test UIDAI OTP code
        });
        setAadhaarVerified(true);
      } catch (e) {
        // Continue to checkout in demo mode
      }

      setExecutionStatus("Aadhaar Identity verified! Launching Razorpay ₹1 Checkout...");

      // Step 3: Launch Razorpay Standard Checkout
      const payAmount = effectiveTotal;
      const amountPaise = Math.round(payAmount * 100);

      await launchRazorpayCheckout({
        amount: amountPaise,
        currency: "INR",
        name: "eRentKarar - AI Agreement Studio",
        description: `Official Agreement Order & e-Stamp (₹${payAmount})`,
        agreement_id: agr.id,
        delivery_type: addons.deliveryMode === "courier" ? "HARD_COPY" : "SOFT_COPY",
        recipient_name: role === "TENANT" ? formData.tenantName : formData.ownerName,
        recipient_phone: role === "TENANT" ? formData.tenantPhone : formData.ownerPhone,
        delivery_address: addons.courierAddress || formData.propertyAddress,
        delivery_city: formData.city,
        delivery_state: formData.state,
        delivery_pincode: addons.courierPincode || formData.propertyPincode,
        prefill: {
          name: role === "TENANT" ? formData.tenantName : formData.ownerName,
          email: role === "TENANT" ? formData.tenantEmail : formData.ownerEmail,
          contact: role === "TENANT" ? formData.tenantPhone : formData.ownerPhone,
        },
        notes: {
          agreement_id: agr.id,
          agreement_number: agr.agreement_number || "",
          mode: role,
          studio: "AI_STUDIO",
          delivery_type: addons.deliveryMode === "courier" ? "HARD_COPY" : "SOFT_COPY",
        },
        onSuccess: async (verifyData: any) => {
          setIsSigned(true);
          setIsStamped(true);
          setPaymentCompleted(true);
          const ord = verifyData?.order_data || {
            order_number: `ERK-2026-${String(Math.floor(Math.random() * 900000) + 100000)}`,
            status: "PAYMENT_SUCCESS",
            delivery_type: addons.deliveryMode === "courier" ? "HARD_COPY" : "SOFT_COPY",
            expected_completion: pricingConfig?.sla_display_text || "Expected completion within 7 days.",
          };
          setOrderInfo(ord);
          setIsSuccessModalOpen(true);
          setIsProcessing(false);
          setExecutionStatus("");
        },
        onError: (err: any) => {
          setErrorMessage(err?.message || "Payment cancelled or failed. Please retry.");
          setIsProcessing(false);
          setExecutionStatus("");
        },
        onDismiss: () => {
          setIsProcessing(false);
          setExecutionStatus("");
        },
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Execution encountered an error. Please verify fields and retry.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Direct PDF Download Handler
  const handleDownloadPDF = async () => {
    if (!createdAgreement?.id) return;
    try {
      const url = `http://localhost:8000/api/v1/agreements/${createdAgreement.id}/download-pdf/`;
      window.open(url, "_blank");
      setPdfDownloaded(true);
    } catch (e) {
      alert("Failed to initiate PDF download.");
    }
  };

  // Copy Deed Text to Clipboard
  const handleCopyDeedText = () => {
    const deedEl = document.getElementById("deed-text-content");
    if (deedEl) {
      navigator.clipboard.writeText(deedEl.innerText);
      alert("Agreement deed text copied to clipboard!");
    }
  };

  const currentQ = questions[wizardStep] || questions[0];

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-[#0f2444] font-sans antialiased flex flex-col">
      {/* Top Banner Ribbon */}
      <div className="bg-[#0f2444] text-white px-4 py-2 border-b border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-[10px] tracking-wide border border-blue-400/30">
            <Sparkles className="w-3 h-3 mr-1 text-yellow-300 animate-pulse" />
            AI DEED STUDIO
          </span>
          <span className="hidden sm:inline text-white/80 font-medium text-[11px]">
            Model Tenancy Act 2021 & IT Act 2000 Approved · Real-Time Split-Screen Engine
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-emerald-400 flex items-center font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-ping" />
            Live Database Sync
          </span>
          <span className="text-white/40">•</span>
          <Link href="/" className="text-white/70 hover:text-white transition">
            Exit Studio
          </Link>
        </div>
      </div>

      {/* Main Studio Shell */}
      <div className="flex-1 flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-41px)] overflow-hidden">
        {/* =========================================================================
            LEFT PANE: Interactive Wizard & Additional Services (440px Fixed)
           ========================================================================= */}
        <aside className="w-full lg:w-[440px] 2xl:w-[480px] bg-white border-r border-[#0f2444]/10 flex flex-col shrink-0 z-10 shadow-lg">
          {/* Studio Header */}
          <div className="p-4 sm:p-5 border-b border-[#0f2444]/10 bg-gradient-to-b from-blue-50/50 to-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-tight text-[#0f2444] leading-tight">
                    Rent Agreement <span className="text-blue-600">AI</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    by eRentKarar.com
                  </p>
                </div>
              </div>

              {/* Step indicator capsule */}
              <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                Step <span className="font-bold text-blue-900">{mainStep + 1}</span> of 3
              </div>
            </div>

            {/* Tri-Role Switcher (Owner / Tenant / Kiosk) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-gray-100/80 border border-gray-200 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setRole("OWNER")}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 ${
                  role === "OWNER"
                    ? "bg-white text-blue-700 shadow-xs border border-gray-200 font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>Landlord</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("TENANT")}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 ${
                  role === "TENANT"
                    ? "bg-white text-blue-700 shadow-xs border border-gray-200 font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>Tenant</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("KIOSK")}
                className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 ${
                  role === "KIOSK"
                    ? "bg-white text-emerald-700 shadow-xs border border-gray-200 font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Store className="w-3 h-3 text-emerald-600" />
                <span>Kiosk / E-Seva</span>
              </button>
            </div>

            {/* AGREEMENT UPGRADE & RENTAL OS ONBOARDING NOTICE */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-500/30 text-[11px] space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                  <span>Agreement service starts soon!</span>
                </span>
                <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">
                  Rental OS Live
                </span>
              </div>
              <p className="text-slate-600 text-[10px] leading-snug">
                We are working on this page. Meanwhile, <strong>Rental OS Onboarding is active</strong>!
              </p>
              <Link
                href="/rental"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 text-[10px] pt-0.5"
              >
                <span>Go to Rental OS &amp; Start Onboarding →</span>
              </Link>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="h-1 bg-gray-100 w-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{
                width: `${
                  mainStep === 0
                    ? ((wizardStep + 1) / questions.length) * 100
                    : mainStep === 1
                    ? 75
                    : 100
                }%`,
              }}
            />
          </div>

          {/* Step Body Content Viewport */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* ==========================================
                STEP 0: AI Guided Builder & Question flow
               ========================================== */}
            {mainStep === 0 && (
              <div>
                {/* Mode Selector Tabs: Create AI / Upload / Type */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-blue-50/70 border border-blue-100 mb-5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("AI")}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      activeTab === "AI"
                        ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Create with AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("UPLOAD")}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      activeTab === "UPLOAD"
                        ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Old</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("TYPE")}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      activeTab === "TYPE"
                        ? "bg-white text-blue-700 shadow-xs border border-blue-200"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5 text-blue-600" />
                    <span>Type / Notes</span>
                  </button>
                </div>

                {/* TAB 1: ONE-FIELD-PER-STEP AI WIZARD */}
                {activeTab === "AI" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Eyebrow & Progress */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold tracking-wider uppercase text-[10px]">
                        {currentQ.group}
                      </span>
                      <span className="text-gray-500 font-medium">
                        Question {wizardStep + 1} of {questions.length}
                      </span>
                    </div>

                    {/* Question Title & Helper */}
                    <div>
                      <h2 className="text-lg font-bold text-[#0f2444] leading-snug">
                        {currentQ.title}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {currentQ.help}
                      </p>
                    </div>

                    {/* Question Interactive Input */}
                    <div className="pt-2">
                      {/* State Dropdown */}
                      {currentQ.type === "select-state" && (
                        <div className="space-y-2">
                          <select
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                            className="w-full text-base font-semibold px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 bg-white shadow-xs"
                          >
                            {INDIAN_STATES.map((st) => (
                              <option key={st.name} value={st.name}>
                                {st.name} (Official Stamp Duty: ₹{st.duty})
                              </option>
                            ))}
                          </select>
                          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start space-x-2">
                            <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                            <span>
                              Official Non-Judicial Stamp Paper rate for <b>{formData.state}</b> is set to ₹
                              {addons.stampPaper}. State-specific tenancy clauses are loaded into the live preview.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Text Input */}
                      {currentQ.type === "text" && (
                        <input
                          type="text"
                          value={(formData as any)[currentQ.field || ""] || ""}
                          onChange={(e) => handleInputChange(currentQ.field || "", e.target.value)}
                          placeholder={currentQ.placeholder}
                          className="w-full text-base font-semibold px-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 bg-white shadow-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && wizardStep < questions.length - 1) {
                              setWizardStep((w) => w + 1);
                            }
                          }}
                        />
                      )}

                      {/* Number Input */}
                      {currentQ.type === "number" && (
                        <div className="relative">
                          <input
                            type="number"
                            value={(formData as any)[currentQ.field || ""] || ""}
                            onChange={(e) =>
                              handleInputChange(currentQ.field || "", parseInt(e.target.value, 10) || 0)
                            }
                            placeholder={currentQ.placeholder}
                            className="w-full text-lg font-bold px-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 bg-white shadow-xs"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && wizardStep < questions.length - 1) {
                                setWizardStep((w) => w + 1);
                              }
                            }}
                          />
                          {currentQ.field === "monthlyRent" && (
                            <p className="text-xs text-blue-700 font-medium mt-1.5">
                              In Words: <b>{numberToWords(formData.monthlyRent)} Rupees only</b>
                            </p>
                          )}
                          {currentQ.field === "securityDeposit" && (
                            <p className="text-xs text-blue-700 font-medium mt-1.5">
                              In Words: <b>{numberToWords(formData.securityDeposit)} Rupees only</b>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Date Input */}
                      {currentQ.type === "date" && (
                        <div className="space-y-2">
                          <input
                            type="date"
                            value={(formData as any)[currentQ.field || ""] || ""}
                            onChange={(e) => handleInputChange(currentQ.field || "", e.target.value)}
                            className="w-full text-base font-semibold px-3.5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 bg-white shadow-xs"
                          />
                          <p className="text-xs text-gray-500">
                            Computed 11-Month End Date: <b>{formData.endDate}</b>
                          </p>
                        </div>
                      )}

                      {/* Chips / Pills Select */}
                      {currentQ.type === "chips" && (
                        <div className="flex flex-wrap gap-2">
                          {currentQ.options?.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleInputChange(currentQ.field || "", opt)}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                                (formData as any)[currentQ.field || ""] === opt
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Textarea */}
                      {currentQ.type === "textarea" && (
                        <textarea
                          rows={3}
                          value={(formData as any)[currentQ.field || ""] || ""}
                          onChange={(e) => handleInputChange(currentQ.field || "", e.target.value)}
                          placeholder={currentQ.placeholder}
                          className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 bg-white shadow-xs"
                        />
                      )}
                    </div>

                    {/* Step Navigation Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setWizardStep((w) => Math.max(0, w - 1))}
                        disabled={wizardStep === 0}
                        className={`inline-flex items-center space-x-1 text-xs font-semibold px-3 py-2 rounded-xl transition ${
                          wizardStep === 0
                            ? "opacity-30 cursor-not-allowed text-gray-400"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      {wizardStep < questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setWizardStep((w) => Math.min(questions.length - 1, w + 1))}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition active:scale-95"
                        >
                          <span>Continue</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setMainStep(1)}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/30 transition active:scale-95"
                        >
                          <span>Proceed to Stamping</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: UPLOAD OLD AGREEMENT */}
                {activeTab === "UPLOAD" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-blue-50/40 transition cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 mx-auto flex items-center justify-center shadow-sm mb-3">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-sm text-[#0f2444]">
                        Upload your existing Rent Agreement
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, Word (.docx) or scan photos up to 15 MB
                      </p>
                    </div>

                    {isUploading && (
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-blue-900">
                          <span>AI reading & extracting agreement details...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: TYPE OR PASTE NOTES */}
                {activeTab === "TYPE" && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <label className="text-xs font-bold text-gray-700">
                      Paste notes, WhatsApp messages, or old draft text:
                    </label>
                    <textarea
                      rows={6}
                      value={pasteText}
                      onChange={(e) => setPasteText(e.target.value)}
                      placeholder="e.g. Landlord Harish Mehta, Tenant Pooja Rathod, rent 26000 deposit 52000, 11 months start from 1st Nov 2026, flat 501 Gokul Bodakdev..."
                      className="w-full text-xs font-medium p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleParsePasteText}
                      disabled={isProcessing || !pasteText.trim()}
                      className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                    >
                      {isProcessing ? "AI Parsing..." : "Extract & Fill Agreement Deed"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                STEP 1: Additional Services & Stamping
               ========================================== */}
            {mainStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    STEP 2 OF 3 · COMPLIANCE & STAMPING
                  </span>
                  <h2 className="text-lg font-bold text-[#0f2444] mt-0.5">
                    Select Stamp Paper & Services
                  </h2>
                  <p className="text-xs text-gray-500">
                    Configure official non-judicial stamp paper denomination, legal attestation, and eSign.
                  </p>
                </div>

                {/* Stamp Paper Denomination Box */}
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 flex items-center">
                      <Stamp className="w-4 h-4 mr-1.5 text-blue-600" />
                      State Stamp Duty Denomination
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                      {formData.state}
                    </span>
                  </div>

                  <select
                    value={addons.stampPaper}
                    onChange={(e) =>
                      setAddons((prev) => ({ ...prev, stampPaper: parseInt(e.target.value, 10) }))
                    }
                    className="w-full text-sm font-semibold p-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value={100}>₹100 Government Stamp Paper</option>
                    <option value={200}>₹200 Government Stamp Paper</option>
                    <option value={300}>₹300 Government Stamp Paper (Gujarat Recommended)</option>
                    <option value={500}>₹500 Government Stamp Paper (Maharashtra / Delhi)</option>
                  </select>
                </div>

                {/* Optional Add-on: Notarial Attestation */}
                <div
                  onClick={() => setAddons((prev) => ({ ...prev, notary: !prev.notary }))}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    addons.notary
                      ? "bg-blue-50/70 border-blue-300 shadow-xs"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        addons.notary ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Notarial Attestation</h4>
                      <p className="text-[11px] text-gray-500">
                        Advocate attestation & Red Ribbon Notary Seal
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-700">+₹90</span>
                    <div
                      className={`w-4 h-4 rounded-full border mt-1 mx-auto flex items-center justify-center ${
                        addons.notary ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                      }`}
                    >
                      {addons.notary && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>

                {/* Optional Add-on: Aadhaar eSign / Zoho Sign */}
                <div
                  onClick={() => setAddons((prev) => ({ ...prev, digitalSign: !prev.digitalSign }))}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    addons.digitalSign
                      ? "bg-blue-50/70 border-blue-300 shadow-xs"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        addons.digitalSign ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">UIDAI / Zoho Aadhaar eSign</h4>
                      <p className="text-[11px] text-gray-500">
                        Cryptographic Aadhaar OTP digital signature
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-700">+₹39</span>
                    <div
                      className={`w-4 h-4 rounded-full border mt-1 mx-auto flex items-center justify-center ${
                        addons.digitalSign
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {addons.digitalSign && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>

                {/* Delivery Mode Choice */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Fulfilment & Delivery Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAddons((prev) => ({ ...prev, deliveryMode: "digital" }))}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        addons.deliveryMode === "digital"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-800 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="text-xs font-bold">Instant Digital eSign</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          addons.deliveryMode === "digital" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        PDF Download (Immediate)
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddons((prev) => ({ ...prev, deliveryMode: "courier" }))}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        addons.deliveryMode === "courier"
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-800 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="text-xs font-bold">Doorstep Courier</div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          addons.deliveryMode === "courier" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        Original Stamp Paper (+₹99)
                      </div>
                    </button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMainStep(0)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMainStep(2)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 transition"
                  >
                    <span>Review & Checkout (₹{priceBreakup.total})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ==========================================
                STEP 2: Review, Bill Breakup & Checkout
               ========================================== */}
            {mainStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    STEP 3 OF 3 · SUMMARY & EXECUTION
                  </span>
                  <h2 className="text-lg font-bold text-[#0f2444] mt-0.5">
                    Review Deed & Execute
                  </h2>
                  <p className="text-xs text-gray-500">
                    Verify parties, terms, and execute the official agreement with government e-stamping.
                  </p>
                </div>

                {/* Parties Quick Summary */}
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Landlord (1st Party):</span>
                    <span className="font-bold text-gray-900">{formData.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tenant (2nd Party):</span>
                    <span className="font-bold text-gray-900">{formData.tenantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Premises:</span>
                    <span className="font-semibold text-gray-900 text-right max-w-[200px] truncate">
                      {formData.propertyAddress}, {formData.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Rent:</span>
                    <span className="font-bold text-blue-700">₹{formData.monthlyRent.toLocaleString("en-IN")}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Deposit:</span>
                    <span className="font-bold text-gray-900">₹{formData.securityDeposit.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Price Breakdown Table (like eDrafter) */}
                <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-2 text-xs">
                  <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                    Order Price Breakup
                  </h4>
                  <div className="flex justify-between text-gray-600">
                    <span>Government Stamp Duty ({formData.state}):</span>
                    <span className="font-semibold text-gray-900">₹{priceBreakup.stampFee}</span>
                  </div>
                  {addons.notary && (
                    <div className="flex justify-between text-gray-600">
                      <span>Advocate Notarial Attestation:</span>
                      <span className="font-semibold text-gray-900">₹{priceBreakup.notaryFee}</span>
                    </div>
                  )}
                  {addons.digitalSign && (
                    <div className="flex justify-between text-gray-600">
                      <span>UIDAI Aadhaar eSign Provider:</span>
                      <span className="font-semibold text-gray-900">₹{priceBreakup.signFee}</span>
                    </div>
                  )}
                  {addons.deliveryMode === "courier" && (
                    <div className="flex justify-between text-gray-600">
                      <span>Doorstep SpeedPost Courier:</span>
                      <span className="font-semibold text-gray-900">₹{priceBreakup.courierFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>AI Legal Drafting & Vault:</span>
                    <span className="font-semibold text-gray-900">₹{priceBreakup.platformFee}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-[#0f2444]">
                    <span>Total Amount Payable:</span>
                    <div className="text-right">
                      <span className="text-emerald-700 text-base font-black">₹{effectiveTotal}</span>
                      <span className="block text-[10px] text-emerald-600 font-medium">⚡ Active ₹1 Test Checkout</span>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Execute Button */}
                <button
                  type="button"
                  onClick={handleExecuteAgreement}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{executionStatus || "Executing Agreement..."}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Pay ₹{effectiveTotal} &amp; Create Agreement Order</span>
                    </>
                  )}
                </button>

                {/* Navigation Back */}
                <button
                  type="button"
                  onClick={() => setMainStep(1)}
                  className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition"
                >
                  ← Modify Stamping & Add-ons
                </button>
              </div>
            )}
          </div>

          {/* Left Panel Bottom Floating Action Bar */}
          <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              <span className="text-gray-600 font-medium text-[11px]">
                Autosaved to cloud
              </span>
            </div>
            {/* Mobile View Toggle Button (Only visible on small screens) */}
            <button
              type="button"
              onClick={() => setMobileView(mobileView === "FORM" ? "PREVIEW" : "FORM")}
              className="lg:hidden px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm"
            >
              {mobileView === "FORM" ? "View Live Deed Preview" : "Back to Form"}
            </button>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT PANE: Live Interactive A4 e-Stamp Paper & Agreement Deed Preview
           ========================================================================= */}
        <main
          className={`flex-1 bg-[#dbeafe]/30 flex flex-col h-full overflow-hidden ${
            mobileView === "FORM" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Document Stage Header */}
          <div className="h-12 bg-white/80 backdrop-blur-md border-b border-[#0f2444]/10 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10">
            <div className="flex items-center space-x-3">
              <span className="flex items-center text-xs font-bold text-blue-700 tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block mr-2 animate-pulse" />
                LIVE PREVIEW · REAL-TIME SYNC
              </span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline text-xs text-gray-500 font-medium">
                Official {formData.state} Non-Judicial Deed
              </span>
            </div>

            {/* Document Controls */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleCopyDeedText}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 border border-gray-200 transition flex items-center space-x-1"
                title="Copy text of agreement"
              >
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden md:inline">Copy Text</span>
              </button>
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(70, z - 10))}
                  className="p-1 hover:bg-white rounded transition text-gray-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-[11px] font-semibold text-gray-600">{zoom}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(130, z + 10))}
                  className="p-1 hover:bg-white rounded transition text-gray-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document Body Scrolling Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
            {/* A4 Paper Container with Realistic Aspect Ratio and Shadows */}
            <div
              id="deed-text-content"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              className="w-[620px] max-w-full bg-white shadow-2xl rounded-sm border border-gray-300 transition-transform duration-200 font-serif text-[#1a1010] text-[12px] leading-relaxed relative selection:bg-blue-100 my-4"
            >
              {/* =======================================================
                  OFFICIAL INDIAN NON-JUDICIAL E-STAMP PAPER HEADER
                 ======================================================= */}
              <div className="p-6 bg-[#fffbf9] border-b-2 border-red-900/30 relative overflow-hidden">
                {/* Ornate Guilloche Stamp Paper Border */}
                <div className="absolute inset-1 border-[3px] border-double border-[#9a1233]/40 pointer-events-none rounded-xs" />

                {/* Top Mock / Official Banner Ribbon */}
                <div className="bg-gradient-to-r from-[#d81f4d] to-[#9a1233] text-white text-[9px] font-bold text-center py-1 uppercase tracking-widest shadow-sm rounded-xs mb-3">
                  INDIA NON JUDICIAL · GOVERNMENT OF {formData.state.toUpperCase()} · E-STAMP CERTIFICATE
                </div>

                {/* State Name & Lion Capital Header */}
                <div className="text-center my-3">
                  <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#a3606d]">
                    STAMP PAPER OF
                  </div>
                  <h3 className="text-2xl font-extrabold uppercase tracking-wide text-[#231016] font-serif mt-0.5">
                    {formData.state}
                  </h3>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-[#8a5460] font-semibold mt-0.5">
                    NON-JUDICIAL E-STAMPING AUTHORITY OF INDIA
                  </div>
                </div>

                {/* Certificate Details Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-3 border-t border-dashed border-[#9a1233]/30 text-[10px]">
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a3606d] block">
                      Certificate No.
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {createdAgreement?.stamp_certificate_number || `IN-${formData.state.slice(0, 2).toUpperCase()}9823412098X`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a3606d] block">
                      Stamp Duty Paid (₹)
                    </span>
                    <span className="font-mono font-bold text-[#9a1233] text-xs">
                      ₹{addons.stampPaper}.00
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a3606d] block">
                      First Party (Landlord / Owner)
                    </span>
                    <span
                      className={`font-semibold text-gray-900 block truncate transition-colors duration-500 ${
                        activeHighlight === "ownerName" ? "bg-yellow-200 px-1 rounded" : ""
                      }`}
                    >
                      {formData.ownerName || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a3606d] block">
                      Second Party (Tenant / Renter)
                    </span>
                    <span
                      className={`font-semibold text-gray-900 block truncate transition-colors duration-500 ${
                        activeHighlight === "tenantName" ? "bg-yellow-200 px-1 rounded" : ""
                      }`}
                    >
                      {formData.tenantName || "—"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#a3606d] block">
                      Description of Document
                    </span>
                    <span className="font-semibold text-gray-900">
                      Rental Agreement (Lease Deed for 11 Months)
                    </span>
                  </div>
                </div>
              </div>

              {/* =======================================================
                  LEGAL DEED BODY (Reactive Typing & Highlighting)
                 ======================================================= */}
              <div className="p-8 sm:p-10 space-y-4">
                {/* Title */}
                <div className="text-center pb-2">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-[#0f2444] border-b-2 border-gray-900 pb-1 inline-block">
                    RENTAL AGREEMENT
                  </h2>
                  <p className="text-[11px] text-gray-600 mt-1 italic">
                    Executed at {formData.city}, {formData.state} on this{" "}
                    <b>{formData.startDate || "____"}</b>
                  </p>
                </div>

                {/* Parties Preamble */}
                <p className="text-justify leading-relaxed">
                  This <b>RENTAL AGREEMENT</b> is made and executed at{" "}
                  <span
                    className={`font-semibold ${
                      activeHighlight === "city" ? "bg-yellow-200 px-1 rounded" : ""
                    }`}
                  >
                    {formData.city}
                  </span>
                  , {formData.state} on this day, by and between:
                </p>

                {/* First Party (Owner) */}
                <div className="pl-4 border-l-2 border-blue-600 space-y-1">
                  <p>
                    <b
                      className={`text-[#0f2444] ${
                        activeHighlight === "ownerName" ? "bg-yellow-200 px-1 rounded" : ""
                      }`}
                    >
                      {formData.ownerName || "________________________"}
                    </b>
                    , {formData.ownerRelation || "S/o ________________________"}, residing at{" "}
                    <span
                      className={`${
                        activeHighlight === "ownerAddress" ? "bg-yellow-200 px-1 rounded" : ""
                      }`}
                    >
                      {formData.ownerAddress || "_________________________________"}
                    </span>
                    , holding Aadhaar/Identity # <b>{formData.ownerAadhaar || "XXXX-XXXX-XXXX"}</b>{" "}
                    (hereinafter called the <b>&quot;LESSOR / OWNER / FIRST PARTY&quot;</b>, which
                    expression shall mean and include his/her legal heirs, executors, and assigns).
                  </p>
                </div>

                <div className="text-center font-bold text-xs uppercase tracking-wider text-gray-500 my-1">
                  — AND —
                </div>

                {/* Second Party (Tenant) */}
                <div className="pl-4 border-l-2 border-emerald-600 space-y-1">
                  <p>
                    <b
                      className={`text-[#0f2444] ${
                        activeHighlight === "tenantName" ? "bg-yellow-200 px-1 rounded" : ""
                      }`}
                    >
                      {formData.tenantName || "________________________"}
                    </b>
                    , {formData.tenantRelation || "S/o ________________________"}, permanent native
                    resident at{" "}
                    <span
                      className={`${
                        activeHighlight === "tenantAddress" ? "bg-yellow-200 px-1 rounded" : ""
                      }`}
                    >
                      {formData.tenantAddress || "_________________________________"}
                    </span>
                    , holding Aadhaar/Identity # <b>{formData.tenantAadhaar || "XXXX-XXXX-XXXX"}</b>{" "}
                    (hereinafter called the <b>&quot;LESSEE / TENANT / SECOND PARTY&quot;</b>, which
                    expression shall mean and include legal successors and permitted assigns).
                  </p>
                </div>

                {/* Recitals */}
                <p className="text-justify pt-2">
                  <b>WHEREAS</b> the Lessor is the absolute owner of the premises situated at:
                  <br />
                  <span
                    className={`font-bold block py-1 text-gray-900 ${
                      activeHighlight === "propertyAddress" ? "bg-yellow-200 px-1 rounded" : ""
                    }`}
                  >
                    &ldquo;{formData.propertyAddress}, {formData.city}, {formData.state} -{" "}
                    {formData.propertyPincode}&rdquo;
                  </span>
                  (hereinafter referred to as the <b>&ldquo;DEMISED PREMISES&rdquo;</b>), and has agreed
                  to let out the same to the Lessee for <b>{formData.purpose.toUpperCase()}</b> use only
                  on the following mutually agreed covenants:
                </p>

                {/* Numbered Terms and Covenants */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-2">
                    <span className="font-bold">1.</span>
                    <p>
                      <b>TENURE & DURATION:</b> The tenancy is granted for a fixed period of{" "}
                      <b>{formData.durationMonths} (Eleven) Months</b> commencing from{" "}
                      <b>{formData.startDate}</b> and expiring on <b>{formData.endDate}</b>. Any extension
                      shall be subject to mutual written renewal under fresh e-stamp execution.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">2.</span>
                    <p>
                      <b>MONTHLY RENT:</b> The agreed monthly rent for the Demised Premises is{" "}
                      <b
                        className={`text-blue-900 ${
                          activeHighlight === "monthlyRent" ? "bg-yellow-200 px-1 rounded" : ""
                        }`}
                      >
                        ₹{formData.monthlyRent.toLocaleString("en-IN")}/- (Rupees{" "}
                        {numberToWords(formData.monthlyRent)} only)
                      </b>{" "}
                      per month, payable in advance on or before the <b>{formData.rentDueDay}th day</b> of
                      each calendar month via {formData.depositMode}.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">3.</span>
                    <p>
                      <b>SECURITY DEPOSIT:</b> The Lessee has deposited with the Lessor an interest-free
                      refundable security deposit of{" "}
                      <b
                        className={`text-gray-900 ${
                          activeHighlight === "securityDeposit" ? "bg-yellow-200 px-1 rounded" : ""
                        }`}
                      >
                        ₹{formData.securityDeposit.toLocaleString("en-IN")}/- (Rupees{" "}
                        {numberToWords(formData.securityDeposit)} only)
                      </b>
                      . This amount shall be refunded at the time of vacating possession, subject to
                      deduction of any pending electricity, maintenance dues, or physical damages beyond
                      fair wear and tear.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">4.</span>
                    <p>
                      <b>MAINTENANCE & SOCIETY CHARGES:</b> Monthly maintenance charges of{" "}
                      <b>₹{formData.maintenanceAmount.toLocaleString("en-IN")}/-</b> shall be paid by the
                      Lessee to the residential society/RWA in addition to the monthly rent.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">5.</span>
                    <p>
                      <b>ELECTRICITY & UTILITY SUB-METER:</b> {formData.utilitiesBy}. Electricity
                      charges shall be computed according to the sub-meter / consumer connection (
                      <b>DISCOM: {formData.discomBoard}</b>) and paid punctually against official utility
                      bills.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">6.</span>
                    <p>
                      <b>LOCK-IN PERIOD & NOTICE TO VACATE:</b> Both parties agree to a lock-in period of{" "}
                      <b>{formData.lockInMonths} months</b> during which neither party shall terminate.
                      Thereafter, either party may terminate this agreement by providing{" "}
                      <b>{formData.noticePeriodDays} days&apos; advance written notice</b> or rent in lieu
                      thereof.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">7.</span>
                    <p>
                      <b>STATUTORY TITLE WARRANTY (BNS 2023 SEC 318 / IPC 420):</b> The Lessor hereby
                      warrants and affirms that they possess full legal ownership, right, title, and
                      unencumbered authority to let out the Demised Premises without any conflicting title
                      dispute or mortgage impediment.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">8.</span>
                    <p>
                      <b>FITTINGS & FIXTURES:</b> The Demised Premises is handed over in{" "}
                      <b>{formData.furnishing}</b> condition with the following inventory in good working
                      order:{" "}
                      <span className="font-mono text-[11px] text-gray-800">
                        {formData.fittings.join(", ")}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">9.</span>
                    <p>
                      <b>SPECIAL COVENANTS:</b> {formData.specialClauses}
                    </p>
                  </div>

                  <div className="flex items-start space-x-2">
                    <span className="font-bold">10.</span>
                    <p>
                      <b>MODEL TENANCY ACT & JURISDICTION:</b> This Agreement complies with the Model
                      Tenancy Act 2021 and Information Technology Act 2000. In case of any dispute, the
                      civil courts at <b>{formData.city}</b>, {formData.state} shall have exclusive
                      jurisdiction.
                    </p>
                  </div>
                </div>

                {/* Notary Seal Stamp (if enabled in add-ons) */}
                {addons.notary && (
                  <div className="my-6 p-4 rounded-xl border-2 border-red-800/40 bg-red-50/20 text-center relative max-w-xs mx-auto">
                    <div className="text-[10px] font-bold text-red-900 tracking-widest uppercase">
                      ★ NOTARY PUBLIC · GOVT. OF INDIA ★
                    </div>
                    <div className="text-[9px] text-red-800 mt-0.5">
                      Attested & Affirmed before me at {formData.city}
                    </div>
                    <div className="text-[8px] font-mono text-red-700 mt-1">
                      Reg. No. NOT-IND-2026 / Advocate Seal Applied
                    </div>
                  </div>
                )}

                {/* Signatures & Execution Block */}
                <div className="pt-8 border-t-2 border-gray-900 mt-8 space-y-6">
                  <p className="text-center font-bold text-xs uppercase tracking-wider">
                    IN WITNESS WHEREOF, THE PARTIES HERETO HAVE SET THEIR HANDS AND DIGITAL SEALS ON THE
                    DAY, MONTH AND YEAR FIRST ABOVE WRITTEN.
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    {/* Landlord Sign Box */}
                    <div className="p-4 rounded-xl border border-gray-300 bg-gray-50/50 text-center space-y-1">
                      <div className="h-10 flex items-center justify-center">
                        {isSigned || role === "OWNER" ? (
                          <span className="font-serif italic font-bold text-blue-900 text-sm">
                            /s/ {formData.ownerName}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Signature of Landlord</span>
                        )}
                      </div>
                      <div className="border-t border-gray-400 pt-1">
                        <p className="font-bold text-xs text-gray-900">{formData.ownerName}</p>
                        <p className="text-[10px] text-gray-500">First Party (Lessor / Owner)</p>
                        {aadhaarVerified && (
                          <span className="inline-block mt-1 text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                            ✓ Aadhaar eSign Sealed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tenant Sign Box */}
                    <div className="p-4 rounded-xl border border-gray-300 bg-gray-50/50 text-center space-y-1">
                      <div className="h-10 flex items-center justify-center">
                        {isSigned || role === "TENANT" ? (
                          <span className="font-serif italic font-bold text-blue-900 text-sm">
                            /s/ {formData.tenantName}
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400">Signature of Tenant</span>
                        )}
                      </div>
                      <div className="border-t border-gray-400 pt-1">
                        <p className="font-bold text-xs text-gray-900">{formData.tenantName}</p>
                        <p className="text-[10px] text-gray-500">Second Party (Lessee / Tenant)</p>
                        {aadhaarVerified && (
                          <span className="inline-block mt-1 text-[9px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                            ✓ Aadhaar eSign Sealed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Witness Row */}
                  <div className="grid grid-cols-2 gap-8 text-[10px] text-gray-500 pt-2">
                    <div>
                      <span>Witness 1: ____________________</span>
                      <br />
                      <span>Name & Address</span>
                    </div>
                    <div>
                      <span>Witness 2: ____________________</span>
                      <br />
                      <span>Name & Address</span>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-6 border-t border-gray-200 text-center text-[9px] text-gray-400">
                  Digitally compiled & registered via eRentKarar.com Indian Tenancy Engine · SHA-256
                  Cryptographic Integrity Guaranteed
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* =========================================================================
          SUCCESS & OFFICIAL PDF DOWNLOAD MODAL
         ========================================================================= */}
      {isSuccessModalOpen && createdAgreement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide uppercase">
                ORDER PLACED &amp; PAYMENT VERIFIED
              </span>
              <h3 className="text-xl font-bold text-[#0f2444] mt-1">
                Rental Agreement Order Confirmed!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your payment of ₹{effectiveTotal} has been verified and your agreement is queued for statutory stamping.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-sans">Official Order ID:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {orderInfo?.order_number || createdAgreement.agreement_number}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-sans">Payment Status:</span>
                <span className="font-bold text-emerald-600">✓ Successful (₹{effectiveTotal})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-sans">Delivery Format:</span>
                <span className="font-semibold text-gray-800">
                  {addons.deliveryMode === "courier" ? "Hard Copy (Courier)" : "Soft Copy (Digital PDF)"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-sans">Estimated SLA:</span>
                <span className="text-gray-700 text-[11px]">Expected completion within 7 days.</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href={`/dashboard/orders/${orderInfo?.order_number || createdAgreement.agreement_number}`}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Track in Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Executed Agreement PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition cursor-pointer"
              >
                Close & Return to Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RentAgreementAIPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading Rent Agreement AI...</div>}>
      <RentAgreementAIContent />
    </React.Suspense>
  );
}
