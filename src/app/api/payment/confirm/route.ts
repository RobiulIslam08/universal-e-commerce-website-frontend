/**
 * Payment Confirmation API Route
 *
 * Confirms payment status and saves payment record to backend
 * Endpoint: POST /api/payment/confirm
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if payment was successful
    if (paymentIntent.status === "succeeded") {
      // Prepare payment record for backend database
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      const paymentRecord = {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents to dollars
        currency: paymentIntent.currency.toUpperCase(),
        status: paymentIntent.status,
        paymentMethod: "card", // Since we're using Stripe card payment
        userEmail:
          paymentIntent.receipt_email ||
          paymentIntent.metadata.customerEmail ||
          "",
        userName: paymentIntent.metadata.customerName || "Guest",
        orderId: paymentIntent.metadata.orderId || null,
        shippingAddress: paymentIntent.metadata.shippingAddress
          ? JSON.parse(paymentIntent.metadata.shippingAddress)
          : null,
        items: paymentIntent.metadata.items
          ? JSON.parse(paymentIntent.metadata.items)
          : [],
      };

      console.log("💾 Saving payment to backend:", backendUrl);
      console.log("📦 Payment data:", paymentRecord);

      // Send to backend
      if (backendUrl) {
        try {
          const backendResponse = await fetch(`${backendUrl}/payments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentRecord),
          });

          const backendData = await backendResponse.json();

          if (!backendResponse.ok) {
            console.error("❌ Failed to save payment to backend:", backendData);
          } else {
            console.log(
              "✅ Payment saved to backend successfully:",
              backendData
            );
          }
        } catch (backendError) {
          console.error("❌ Error saving to backend:", backendError);
          // Don't fail the request if backend save fails
        }
      } else {
        console.warn(
          "⚠️ NEXT_PUBLIC_BACKEND_URL not set, skipping backend save"
        );
      }

      return NextResponse.json({
        success: true,
        payment: paymentRecord,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: paymentIntent.status,
        message: "Payment not completed",
      });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);

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
