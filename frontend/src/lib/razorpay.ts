declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayCheckoutOptions {
  amount: number; // in paise (e.g., 149900 for ₹1,499)
  currency?: string;
  name?: string;
  description?: string;
  agreement_id?: string;
  invoice_id?: string;
  delivery_type?: string;
  recipient_name?: string;
  recipient_phone?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_pincode?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (verifyData: any) => void;
  onError?: (error: any) => void;
  onDismiss?: () => void;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Executes full Razorpay checkout flow:
 * 1. Creates order on backend (POST /api/create-order)
 * 2. Launches Razorpay Standard Web Checkout Modal
 * 3. Handles success, dismissal, and failure
 * 4. Verifies signature on backend (POST /api/verify-payment)
 */
export async function launchRazorpayCheckout(options: RazorpayCheckoutOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    const err = new Error("Failed to load Razorpay SDK. Please check your internet connection.");
    options.onError?.(err);
    throw err;
  }

  // Step 1: Create order on backend
  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  let createRes: any;
  try {
    // Attempt standard route first, then v1 payments route
    const endpoints = ["/api/create-order", `${backendBase}/payments/create-order/`];
    let lastError: any = null;

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(localStorage.getItem("erk_token") ? { Authorization: `Bearer ${localStorage.getItem("erk_token")}` } : {}) },
          body: JSON.stringify({
            amount: options.amount,
            currency: options.currency || "INR",
            receipt: `rcpt_${Date.now().toString(36)}`,
            agreement_id: options.agreement_id,
            invoice_id: options.invoice_id,
            delivery_type: options.delivery_type,
            recipient_name: options.recipient_name,
            recipient_phone: options.recipient_phone,
            delivery_address: options.delivery_address,
            delivery_city: options.delivery_city,
            delivery_state: options.delivery_state,
            delivery_pincode: options.delivery_pincode,
            notes: options.notes || {},
          }),
        });

        if (res.ok) {
          createRes = await res.json();
          break;
        } else {
          const errData = await res.json().catch(() => ({}));
          lastError = new Error(errData?.error || `Failed with status ${res.status}`);
        }
      } catch (e) {
        lastError = e;
      }
    }

    if (!createRes || !createRes.order_id) {
      throw lastError || new Error("Failed to create Razorpay order.");
    }
  } catch (err: any) {
    options.onError?.(err);
    throw err;
  }

  const keyId =
    createRes.key_id ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_TkF3p3IhDpNxpI";

  // Step 2: Open Razorpay Checkout modal
  const rzpOptions = {
    key: keyId,
    amount: createRes.amount,
    currency: createRes.currency || "INR",
    name: options.name || "eRentKarar",
    description: options.description || "Statutory Legal Rent Agreement & Stamping",
    image: "/icon.svg",
    order_id: createRes.order_id,
    prefill: {
      name: options.prefill?.name || "",
      email: options.prefill?.email || "",
      contact: options.prefill?.contact || "",
    },
    notes: {
      agreement_id: options.agreement_id || "",
      invoice_id: options.invoice_id || "",
      ...(options.notes || {}),
    },
    theme: {
      color: "#0071e3",
    },
    modal: {
      ondismiss: function () {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
    },
    handler: async function (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) {
      // Step 3: Verify signature on backend
      try {
        const verifyEndpoints = [
          "/api/verify-payment",
          `${backendBase}/payments/verify-payment/`,
        ];

        let verifyData: any = null;
        let verifyErr: any = null;

        for (const ep of verifyEndpoints) {
          try {
            const vRes = await fetch(ep, {
              method: "POST",
              headers: { "Content-Type": "application/json", ...(localStorage.getItem("erk_token") ? { Authorization: `Bearer ${localStorage.getItem("erk_token")}` } : {}) },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                agreement_id: options.agreement_id,
                invoice_id: options.invoice_id,
                delivery_type: options.delivery_type,
                recipient_name: options.recipient_name,
                recipient_phone: options.recipient_phone,
                delivery_address: options.delivery_address,
                delivery_city: options.delivery_city,
                delivery_state: options.delivery_state,
                delivery_pincode: options.delivery_pincode,
              }),
            });

            if (vRes.ok) {
              verifyData = await vRes.json();
              break;
            } else {
              const errBody = await vRes.json().catch(() => ({}));
              verifyErr = new Error(errBody?.error || "Signature verification rejected.");
            }
          } catch (e) {
            verifyErr = e;
          }
        }

        if (!verifyData || !verifyData.verified) {
          throw verifyErr || new Error("Payment signature verification failed.");
        }

        if (options.onSuccess) {
          options.onSuccess({
            ...verifyData,
            payment_id: response.razorpay_payment_id,
            order_id: response.razorpay_order_id,
          });
        }
      } catch (err: any) {
        if (options.onError) {
          options.onError(err);
        }
      }
    },
  };

  const razorpayInstance = new window.Razorpay(rzpOptions);

  razorpayInstance.on("payment.failed", function (response: any) {
    const errorDetails = response?.error || {};
    const reason = errorDetails.description || errorDetails.reason || "Payment transaction was declined.";
    if (options.onError) {
      options.onError(new Error(reason));
    }
  });

  razorpayInstance.open();
}
