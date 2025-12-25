/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import Stripe from "stripe";

// আপনার .env.local ফাইলে STRIPE_SECRET_KEY থাকতে হবে
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover", // অথবা আপনার ভার্সন
});

export async function POST(req: Request) {
  try {
    const { amount, currency, customerName, customerEmail, shippingAddress } =
      await req.json();

    // ১. পেমেন্ট ইনটেন্ট তৈরি করা
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // USD to Cents
      currency: currency || "usd",
      automatic_payment_methods: { enabled: true },
      description: `Payment by ${customerName} (${customerEmail})`,
      shipping: {
        name: customerName,
        address: shippingAddress,
      },
      metadata: {
        customer_email: customerEmail,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error("Stripe Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
