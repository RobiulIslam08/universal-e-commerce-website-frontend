/**
 * Stripe Payment Intent API Route
 *
 * Creates a payment intent for processing card payments
 * Endpoint: POST /api/payment/create-intent
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CreatePaymentIntentRequest } from "@/types/payment";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body: CreatePaymentIntentRequest = await request.json();

    const {
      amount,
      currency = "usd",
      customerEmail,
      customerName,
      shippingAddress,
      items,
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    let customer: Stripe.Customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        address: {
          line1: shippingAddress.line1,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        },
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerEmail,
        customerName,
        itemsCount: items.length.toString(),
        orderId: `ORD-${Date.now()}`, // Generate order ID
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items),
      },
      description: `Order payment for ${customerName}`,
      receipt_email: customerEmail,
    });

    console.log("✅ Payment Intent created:", paymentIntent.id);
    console.log("📧 Customer:", customerEmail);
    console.log("💰 Amount:", amount);

    // Return client secret
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
