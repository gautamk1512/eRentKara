import { getApiBaseUrl } from "./apiBase";

// Fast client-side cache for instantaneous page transitions
const memoryCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 30000; // 30 seconds

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const isGet = !options.method || options.method.toUpperCase() === "GET";
  const token = typeof window !== "undefined" ? localStorage.getItem("erk_token") : null;
  const cacheKey = `${endpoint}_${token || "anon"}`;

  // Serve from cache if fresh
  if (isGet) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error("Unable to connect to eRentKarar. Please check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const fieldErrors = Object.entries(data?.error?.details || data).filter(([, value]) => Array.isArray(value)).map(([key, value]) => `${key.replace(/_/g, " ")}: ${(value as string[]).join(" ")}`).join(" · ");
    throw new Error(fieldErrors || data?.error?.message || (typeof data?.error === "string" ? data.error : null) || data?.detail || data?.message || `Request failed with status ${res.status}`);
  }

  // Save to cache for GET requests
  if (isGet) {
    memoryCache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL_MS });
  } else {
    // Invalidate related cache on mutations
    memoryCache.clear();
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiRequest("/auth/login/", { method: "POST", body: JSON.stringify(credentials) }),
  googleLogin: (payload: { credential?: string; email?: string; name?: string; role?: string; avatar?: string; google_id?: string; force_role?: boolean }) =>
    apiRequest("/auth/google/", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload: any) =>
    apiRequest("/auth/register/", { method: "POST", body: JSON.stringify(payload) }),
  getMe: () => apiRequest("/auth/me/"),

  // Marketplace
  searchProperties: (params?: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/marketplace/search/${query ? `?${query}` : ""}`);
  },
  getPropertyDetail: (slug: string) => apiRequest(`/marketplace/property/${slug}/`),
  submitEnquiry: (payload: any) =>
    apiRequest("/marketplace/enquire/", { method: "POST", body: JSON.stringify(payload) }),
  getCities: () => apiRequest("/marketplace/cities/"),
  getMarketplaceStats: () => apiRequest("/marketplace/stats/"),
  listPublicProperty: (payload: any) =>
    apiRequest("/marketplace/list-property/", { method: "POST", body: JSON.stringify(payload) }),

  // Bookings
  createBooking: (payload: any) =>
    apiRequest("/bookings/", { method: "POST", body: JSON.stringify(payload) }),

  // Owner & Admin Properties & Units
  getProperties: (params?: { status?: string }) => {
    const q = params?.status ? `?status=${params.status}` : "";
    return apiRequest(`/properties/${q}`);
  },
  createProperty: (payload: any) =>
    apiRequest("/properties/", { method: "POST", body: JSON.stringify(payload) }),
  togglePublishProperty: (id: string) =>
    apiRequest(`/properties/${id}/toggle_publish/`, { method: "POST" }),
  approvePropertyListing: (id: string, notes?: string) =>
    apiRequest(`/properties/${id}/approve/`, { method: "POST", body: JSON.stringify({ notes }) }),
  rejectPropertyListing: (id: string, reason?: string) =>
    apiRequest(`/properties/${id}/reject/`, { method: "POST", body: JSON.stringify({ reason }) }),
  verifyPropertyOwnership: (propertyId: string, payload: any) =>
    apiRequest(`/properties/${propertyId}/verify-ownership/`, { method: "POST", body: JSON.stringify(payload) }),
  updateBedStatus: (bedId: number, status: string) =>
    apiRequest(`/properties/beds/${bedId}/update_status/`, { method: "POST", body: JSON.stringify({ status }) }),

  // Tenancies
  getTenancies: () => apiRequest("/tenants/"),
  getMyStay: () => apiRequest("/tenants/my_stay/"),
  onboardTenant: (tenancyId: string) =>
    apiRequest(`/tenants/${tenancyId}/onboard/`, { method: "POST" }),
  enrollTenant: (payload: any) =>
    apiRequest("/tenants/enroll/", { method: "POST", body: JSON.stringify(payload) }),

  // Invoices & Billing
  getInvoices: () => apiRequest("/invoices/"),
  generateMonthlyInvoices: (month?: number, year?: number) =>
    apiRequest("/invoices/generate_monthly_invoices/", { method: "POST", body: JSON.stringify({ month, year }) }),
  generateReceipt: (invoiceId: string) =>
    apiRequest(`/invoices/${invoiceId}/generate_receipt/`, { method: "POST" }),

  // Payments
  createPaymentOrder: (invoiceId: string, paymentMethod = "UPI") =>
    apiRequest("/payments/create_checkout_order/", { method: "POST", body: JSON.stringify({ invoice_id: invoiceId, payment_method: paymentMethod }) }),
  confirmPayment: (paymentId: string) =>
    apiRequest(`/payments/${paymentId}/confirm_payment/`, { method: "POST" }),
  createRazorpayOrder: (payload: { amount: number; currency?: string; receipt?: string; agreement_id?: string; invoice_id?: string; notes?: any }) =>
    apiRequest("/payments/create-order/", { method: "POST", body: JSON.stringify(payload) }),
  verifyRazorpayPayment: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; agreement_id?: string; invoice_id?: string }) =>
    apiRequest("/payments/verify-payment/", { method: "POST", body: JSON.stringify(payload) }),

  // Agreements & Digital e-Rent Platform
  getAgreements: () => apiRequest("/agreements/"),
  getAgreement: (id: string) => apiRequest(`/agreements/${id}/`),
  createOwnerAgreement: (payload: any) =>
    apiRequest("/agreements/create-owner/", { method: "POST", body: JSON.stringify(payload) }),
  createTenantAgreement: (payload: any) =>
    apiRequest("/agreements/create-tenant/", { method: "POST", body: JSON.stringify(payload) }),
  createAssistedAgreement: (payload: any) =>
    apiRequest("/agreements/create-assisted/", { method: "POST", body: JSON.stringify(payload) }),
  calculateDuty: (params: { rent: number; deposit?: number; duration?: number; state?: string; agreement_type?: string }) => {
    const q = new URLSearchParams({
      rent: String(params.rent || 15000),
      deposit: String(params.deposit || (params.rent || 15000) * 2),
      duration: String(params.duration || 11),
      state: params.state || "GJ",
      agreement_type: params.agreement_type || "RESIDENTIAL",
    }).toString();
    return apiRequest(`/agreements/calculate-duty/?${q}`);
  },
  getAgreementClauses: () => apiRequest("/agreements/clauses/"),
  inviteCounterparty: (id: string, payload: { target_role: string; target_name: string; target_email: string; target_phone: string }) =>
    apiRequest(`/agreements/${id}/invite/`, { method: "POST", body: JSON.stringify(payload) }),
  sendAadhaarOtp: (id: string, payload: { party_type: string; aadhaar_number: string }) =>
    apiRequest(`/agreements/${id}/send-aadhaar-otp/`, { method: "POST", body: JSON.stringify(payload) }),
  verifyPartyIdentity: (id: string, payload: { party_type: string; aadhaar_number: string; otp_code: string }) =>
    apiRequest(`/agreements/${id}/verify-identity/`, { method: "POST", body: JSON.stringify(payload) }),
  verifyMobile: (id: string, payload: { party_type: string; mobile: string; otp_code?: string }) =>
    apiRequest(`/agreements/${id}/mobile-verify/`, { method: "POST", body: JSON.stringify(payload) }),
  reviewAgreement: (id: string, payload: { action: "ACCEPT" | "REQUEST_CHANGES"; notes?: string }) =>
    apiRequest(`/agreements/${id}/review/`, { method: "POST", body: JSON.stringify(payload) }),
  signAgreement: (id: string, payload: { party_type?: string; signature_evidence?: string } = {}) =>
    apiRequest(`/agreements/${id}/sign/`, { method: "POST", body: JSON.stringify(payload) }),
  initiateESign: (id: string) =>
    apiRequest(`/agreements/${id}/initiate-esign/`, { method: "POST" }),
  stampAgreement: (id: string) =>
    apiRequest(`/agreements/${id}/stamp/`, { method: "POST" }),
  getPublicVerification: (token: string) =>
    apiRequest(`/agreements/verify/${token}/`),
  getInvitationDetails: (token: string) =>
    apiRequest(`/agreements/invitations/${token}/`),
  acceptInvitation: (token: string) =>
    apiRequest(`/agreements/invitations/${token}/`, { method: "POST" }),
  getShops: () => apiRequest("/agreements/shops/"),
  getKioskSessions: () => apiRequest("/agreements/kiosk-sessions/"),
  submitAgreementPayment: (id: string, payload: any) =>
    apiRequest(`/agreements/${id}/payment/`, { method: "POST", body: JSON.stringify(payload) }),
  renewAgreement: (id: string, payload: any) =>
    apiRequest(`/agreements/${id}/renew/`, { method: "POST", body: JSON.stringify(payload) }),
  cancelAgreement: (id: string, payload: any) =>
    apiRequest(`/agreements/${id}/cancel-agreement/`, { method: "POST", body: JSON.stringify(payload) }),
  orderCourierDelivery: (id: string, payload: any) =>
    apiRequest(`/agreements/${id}/courier/`, { method: "POST", body: JSON.stringify(payload) }),
  createLegalNotice: (id: string, payload: any) =>
    apiRequest(`/agreements/${id}/legal-notice/`, { method: "POST", body: JSON.stringify(payload) }),
  confirmLandlordDeclaration: (id: string, confirmed = true) =>
    apiRequest(`/agreements/${id}/confirm-landlord-declaration/`, { method: "POST", body: JSON.stringify({ confirmed }) }),
  confirmTenantDeclaration: (id: string, confirmed = true) =>
    apiRequest(`/agreements/${id}/confirm-tenant-declaration/`, { method: "POST", body: JSON.stringify({ confirmed }) }),
  confirmFinancialTerms: (id: string) =>
    apiRequest(`/agreements/${id}/confirm-financial-terms/`, { method: "POST", body: JSON.stringify({ confirmed: true }) }),
  createAmendment: (id: string, payload: any) =>
    apiRequest(`/agreements/${id}/create-amendment/`, { method: "POST", body: JSON.stringify(payload) }),
  verifyDocumentIntegrity: (id: string) =>
    apiRequest(`/agreements/${id}/verify-integrity/`),
  aiDraftAgreement: (prompt: string) =>
    apiRequest("/agreements/ai-draft/", { method: "POST", body: JSON.stringify({ prompt }) }),
  extractOldAgreement: (payload: any) => {
    if (typeof window !== "undefined" && payload instanceof FormData) {
      const token = localStorage.getItem("erk_token");
      return fetch(`${getApiBaseUrl()}/agreements/extract-from-document/`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: payload,
      }).then((r) => r.json());
    }
    return apiRequest("/agreements/extract-from-document/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Legacy agreement endpoints
  draftAgreement: (payload: { tenancy_id: string; state_code?: string }) =>
    apiRequest("/agreements/draft/", { method: "POST", body: JSON.stringify(payload) }),
  sendForESign: (agreementId: string) =>
    apiRequest(`/agreements/${agreementId}/send_for_esign/`, { method: "POST" }),
  getStateRules: (state = "GJ") => apiRequest(`/agreements/state-rules/?state=${state}`),

  // KYC & Standalone Identity Verification
  startAadhaarVerification: (payload: { aadhaar_number: string; consent_given: boolean; full_name?: string; phone?: string; purpose?: string }) =>
    apiRequest("/verification/aadhaar/start/", { method: "POST", body: JSON.stringify(payload) }),
  verifyAadhaarOtp: (payload: { verification_reference: string; otp_code: string }) =>
    apiRequest("/verification/aadhaar/verify-otp/", { method: "POST", body: JSON.stringify(payload) }),
  resendAadhaarOtp: (verification_reference: string) =>
    apiRequest("/verification/aadhaar/resend-otp/", { method: "POST", body: JSON.stringify({ verification_reference }) }),
  getVerificationStatus: (reference: string) =>
    apiRequest(`/verification/status/${reference}/`),
  verifyStandaloneMobile: (payload: { phone: string; otp?: string; verification_reference?: string }) =>
    apiRequest("/verification/mobile/", { method: "POST", body: JSON.stringify(payload) }),
  getMyKYC: () => apiRequest("/kyc/my_kyc/"),
  verifyKYC: (kycId: string, approved: boolean, notes = "") =>
    apiRequest(`/kyc/${kycId}/verify/`, { method: "POST", body: JSON.stringify({ approved, rejection_reason: notes }) }),

  // Leads CRM
  getLeads: () => apiRequest("/leads/"),
  scheduleVisit: (leadId: string, scheduledAt: string) =>
    apiRequest(`/leads/${leadId}/schedule_visit/`, { method: "POST", body: JSON.stringify({ scheduled_at: scheduledAt }) }),

  // Complaints
  getComplaints: () => apiRequest("/complaints/"),
  createComplaint: (payload: any) =>
    apiRequest("/complaints/", { method: "POST", body: JSON.stringify(payload) }),
  updateComplaintStatus: (id: string, status: string, notes = "") =>
    apiRequest(`/complaints/${id}/update_status/`, { method: "POST", body: JSON.stringify({ status, notes }) }),

  // Visitors
  getVisitors: () => apiRequest("/visitors/"),
  createVisitor: (payload: any) =>
    apiRequest("/visitors/", { method: "POST", body: JSON.stringify(payload) }),

  // Mess
  getMessMenu: (propId?: string) =>
    apiRequest(`/mess/menu/${propId ? `?property=${propId}` : ""}`),
  toggleMealOptOut: (mealDate: string, mealType: string) =>
    apiRequest("/mess/attendance/toggle_opt_out/", { method: "POST", body: JSON.stringify({ meal_date: mealDate, meal_type: mealType }) }),

  // Referrals
  getMyReferral: () => apiRequest("/referrals/my-code/"),

  // Dashboard Reports
  getDashboardMetrics: () => apiRequest("/reports/dashboard-metrics/"),

  // Ekrar AI
  askAI: (message: string, conversationId?: string) =>
    apiRequest("/ai/chat/", { method: "POST", body: JSON.stringify({ message, conversation_id: conversationId }) }),
  confirmAIAction: (actionId: string) =>
    apiRequest(`/ai/action/${actionId}/confirm/`, { method: "POST" }),

  // Pricing Configuration
  getPricingConfig: () => apiRequest("/agreements/pricing-config/"),
  updatePricingConfig: (payload: any) =>
    apiRequest("/agreements/pricing-config/", { method: "PUT", body: JSON.stringify(payload) }),

  // Document Uploads (Section 3)
  uploadAgreementDocument: (agreementId: string, formData: FormData) =>
    apiRequest(`/agreements/${agreementId}/upload-document/`, { method: "POST", body: formData }),
  getAgreementDocuments: (agreementId: string) =>
    apiRequest(`/agreements/${agreementId}/documents/`),

  // Agreement Orders & Tracking (Sections 8, 9, 11, 12, 19, 24)
  getAgreementOrders: (search?: string) =>
    apiRequest(`/agreements/orders/${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getAgreementOrder: (orderIdOrNumber: string) =>
    apiRequest(`/agreements/orders/${orderIdOrNumber}/`),
  requestOrderCorrection: (orderIdOrNumber: string, reason: string) =>
    apiRequest(`/agreements/orders/${orderIdOrNumber}/request-correction/`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // Admin Fulfilment & Order Management (Sections 20, 21, 22, 23, 29)
  adminGetAgreementOrders: (params?: { search?: string; status?: string; delivery_type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/agreements/admin-orders/${query ? `?${query}` : ""}`);
  },
  adminUpdateCourier: (orderId: string, payload: { courier_provider?: string; tracking_number?: string; status?: string; expected_delivery_date?: string; delivery_notes?: string }) =>
    apiRequest(`/agreements/admin-orders/${orderId}/update-courier/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  adminAssignPartner: (orderId: string, payload: { partner_id?: string; partner_name?: string; partner_phone?: string; partner_fee?: number; internal_notes?: string }) =>
    apiRequest(`/agreements/admin-orders/${orderId}/assign-partner/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  adminUploadFinalDoc: (orderId: string, formData: FormData) =>
    apiRequest(`/agreements/admin-orders/${orderId}/upload-final-doc/`, {
      method: "POST",
      body: formData,
    }),
  adminQC: (orderId: string, payload: { qc_status: "PASSED" | "FAILED"; qc_notes?: string }) =>
    apiRequest(`/agreements/admin-orders/${orderId}/qc/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export const extractOldAgreement = api.extractOldAgreement;
