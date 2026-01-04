// components/cart/CartSummary.tsx
"use client";

import { CreditCard, ArrowRight, ShieldCheck } from "lucide-react";

// Shadcn Components
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Constants
import { CART_CONSTANTS } from "@/constants/cart";

const { CURRENCY, TAX_RATE_PERCENT } = CART_CONSTANTS;

// Types
interface CartSummaryProps {
  subtotal: number;
  savings: number;
  shipping: number;
  tax: number;
  total: number;
  handleCheckout: () => void;
  isCheckoutDisabled: boolean;
}

// Helper for summary rows
const SummaryRow = ({
  label,
  value,
  isTotal = false,
  isDiscount = false,
}: {
  label: string;
  value: string | number;
  isTotal?: boolean;
  isDiscount?: boolean;
}) => (
  <div
    className={`flex justify-between items-center ${
      isTotal
        ? "pt-4 border-t border-dashed border-slate-200 dark:border-slate-700"
        : ""
    }`}
  >
    <span
      className={`${
        isTotal ? "text-xl font-bold" : "text-sm font-medium"
      } text-slate-900 dark:text-white`}
    >
      {label}
    </span>
    <span
      className={`${
        isTotal
          ? "text-2xl font-extrabold text-rose-600 dark:text-rose-400"
          : isDiscount
          ? "text-green-600 dark:text-green-400 font-bold"
          : "font-semibold text-slate-900 dark:text-white"
      }`}
    >
      {typeof value === "number" ? `${CURRENCY}${value.toFixed(2)}` : value}
    </span>
  </div>
);

export default function CartSummary({
  subtotal,
  savings,
  shipping,
  tax,
  total,
  handleCheckout,
  isCheckoutDisabled,
}: CartSummaryProps) {
  return (
    <Card className="shadow-2xl border-rose-200 dark:border-rose-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-rose-600" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Price Breakdown */}
        <div className="space-y-3 mb-6">
          <SummaryRow label="Subtotal" value={subtotal} />
          {savings > 0 && (
            <SummaryRow
              label="Total Savings"
              value={`-${savings.toFixed(2)}`}
              isDiscount
            />
          )}
          <SummaryRow
            label="Shipping"
            value={shipping === 0 ? "FREE" : shipping}
          />
          <SummaryRow label={`Tax (${TAX_RATE_PERCENT}%)`} value={tax} />
          <SummaryRow label="Total" value={total} isTotal />
        </div>

        <Separator className="my-6" />

        {/* Checkout Button */}
        <Link href="/checkout">
          <Button
            onClick={handleCheckout}
            disabled={isCheckoutDisabled}
            size="lg"
            className="w-full bg-rose-600 hover:bg-rose-700 font-extrabold text-lg"
          >
            Proceed to Checkout <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </Link>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3 h-3 text-green-600" />
          <span className="font-semibold">Secure SSL Encrypted Payment</span>
        </div>
      </CardContent>
    </Card>
  );
}
