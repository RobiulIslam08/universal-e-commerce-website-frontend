/**
 * Stripe Configuration and Utilities
 *
 * This file contains the Stripe client initialization and helper functions
 * for processing payments in the e-commerce application.
 */

import { loadStripe, Stripe } from "@stripe/stripe-js";

// Singleton instance of Stripe
let stripePromise: Promise<Stripe | null>;

/**
 * Get Stripe.js instance
 * Lazily loads Stripe.js only when needed
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error("Stripe publishable key is not defined");
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
};

/**
 * Format amount for Stripe
 * Stripe expects amounts in cents/smallest currency unit
 * @param amount - Amount in standard currency format (e.g., 10.99)
 * @returns Amount in cents (e.g., 1099)
 */
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Format amount for display
 * Convert cents to standard currency format
 * @param amount - Amount in cents (e.g., 1099)
 * @returns Amount in standard format (e.g., 10.99)
 */
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
