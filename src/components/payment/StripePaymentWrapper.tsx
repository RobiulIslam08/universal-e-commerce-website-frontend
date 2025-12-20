/**
 * Stripe Payment Wrapper Component
 *
 * Wraps the payment form with Stripe Elements Provider
 */

"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { StripePaymentForm } from "./StripePaymentForm";

interface StripePaymentWrapperProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  amount: number;
}

export function StripePaymentWrapper({
  clientSecret,
  onSuccess,
  onError,
  amount,
}: StripePaymentWrapperProps) {
  const stripePromise = getStripe();

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
        amount={amount}
      />
    </Elements>
  );
}
