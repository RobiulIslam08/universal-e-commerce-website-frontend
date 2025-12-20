/**
 * Stripe Payment Form Component
 *
 * This component handles the Stripe payment form with card elements
 */

"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
}

export function StripePaymentForm({
  clientSecret,
  onSuccess,
  onError,
  amount,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        console.error("Payment error:", error);
        onError(error.message || "Payment failed");
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        onSuccess(paymentIntent.id);
        toast.success("Payment successful!");
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Payment processing failed";
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
        <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
          Card Information
        </label>
        <div className="p-4 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Your payment information is secure and encrypted
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-6 text-lg font-semibold disabled:opacity-50"
      >
        {processing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </div>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
        <Image
          src="https://img.shields.io/badge/Secured%20by-Stripe-008CDD?style=flat&logo=stripe"
          alt="Secured by Stripe"
          width={150}
          height={24}
          className="h-6"
        />
      </div>
    </form>
  );
}
