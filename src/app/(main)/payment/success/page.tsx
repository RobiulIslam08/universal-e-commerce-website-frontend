/**
 * Payment Success Page
 *
 * Displays payment confirmation and order details
 * Shows user their payment history
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, CreditCard, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaymentRecord } from "@/types/payment";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  const [paymentDetails, setPaymentDetails] = useState<PaymentRecord | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (paymentIntentId) {
      fetchPaymentDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentIntentId]);
const fetchPaymentDetails = async () => {
    try {
      // ⚠️ ভুল ছিল: fetch(`/api/payment/confirm`, ...)
      // ✅ সঠিক: নতুন তৈরি করা details রাউট
      const response = await fetch(`/api/payment/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentDetails(result.payment);
      } else {
        console.error("Failed to load payment details:", result.error);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">Payment details not found</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-green-950/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="p-6 mb-6 bg-white dark:bg-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h2 className="text-xl font-semibold mb-1">Order Confirmed</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Order ID: {paymentDetails.orderId || paymentIntentId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${paymentDetails.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                {paymentDetails.currency}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {paymentDetails.userEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(paymentDetails.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Method
                  </p>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {paymentDetails.paymentMethod || "Card Payment"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {paymentDetails.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/payment/history">
            <Button className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white">
              View Payment History
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Info Message */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            📧 A confirmation email has been sent to{" "}
            <span className="font-semibold">{paymentDetails.userEmail}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
