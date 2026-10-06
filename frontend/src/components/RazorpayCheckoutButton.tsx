"use client";

import React, { useState } from "react";
import { CreditCard, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { launchRazorpayCheckout } from "@/lib/razorpay";

interface RazorpayCheckoutButtonProps {
  amount: number; // in Rupees (e.g., 1499)
  buttonText?: string;
  className?: string;
  agreementId?: string;
  invoiceId?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
  disabled?: boolean;
}

export default function RazorpayCheckoutButton({
  amount = 1499,
  buttonText,
  className = "",
  agreementId,
  invoiceId,
  prefill,
  onSuccess,
  onError,
  disabled = false,
}: RazorpayCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const amountPaise = Math.round(amount * 100);

  const handlePay = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      await launchRazorpayCheckout({
        amount: amountPaise,
        currency: "INR",
        name: "eRentKarar India",
        description: `Rental Agreement Statutory Fee (₹${amount})`,
        agreement_id: agreementId,
        invoice_id: invoiceId,
        prefill,
        notes: {
          platform: "eRentKarar",
          agreement_id: agreementId || "",
          invoice_id: invoiceId || "",
        },
        onSuccess: (verifyData) => {
          setIsLoading(false);
          setStatusMessage({
            type: "success",
            text: `Payment of ₹${amount} completed & verified! Reference: ${verifyData.payment_id}`,
          });
          if (onSuccess) {
            onSuccess(verifyData);
          }
        },
        onError: (err) => {
          setIsLoading(false);
          setStatusMessage({
            type: "error",
            text: err?.message || "Payment could not be completed. Please try again.",
          });
          if (onError) {
            onError(err);
          }
        },
        onDismiss: () => {
          setIsLoading(false);
          setStatusMessage({
            type: "info",
            text: "Payment checkout was cancelled.",
          });
        },
      });
    } catch (err: any) {
      setIsLoading(false);
      setStatusMessage({
        type: "error",
        text: err?.message || "Unable to initiate Razorpay checkout.",
      });
      if (onError) {
        onError(err);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        id="razorpay-checkout-button"
        onClick={handlePay}
        disabled={disabled || isLoading}
        className={
          className ||
          "w-full flex items-center justify-center gap-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 px-5 text-sm font-semibold shadow-md transition disabled:opacity-50"
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Initiating Razorpay...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>{buttonText || `Pay ₹${amount} with Razorpay`}</span>
          </>
        )}
      </button>

      {statusMessage && (
        <div
          className={`flex items-start gap-2 p-3 rounded-xl text-xs transition ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : statusMessage.type === "error"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-slate-50 text-slate-700 border border-slate-200"
          }`}
        >
          {statusMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
          {statusMessage.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
          {statusMessage.type === "info" && <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />}
          <p>{statusMessage.text}</p>
        </div>
      )}
    </div>
  );
}
