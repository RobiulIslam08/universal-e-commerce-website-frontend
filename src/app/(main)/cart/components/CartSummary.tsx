// components/cart/CartSummary.tsx
"use client";

import {
  CreditCard,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

// Shadcn Components
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Constants
import { CART_CONSTANTS } from "@/constants/cart";

const { CURRENCY, FREE_SHIPPING_THRESHOLD, TAX_RATE_PERCENT } = CART_CONSTANTS;

// Types
interface CartSummaryProps {
  subtotal: number;
  savings: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode: string;
  appliedCoupon: string | null;
  setCouponCode: (code: string) => void;
  applyCoupon: () => void;
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
  discount,
  shipping,
  tax,
  total,
  couponCode,
  appliedCoupon,
  setCouponCode,
  applyCoupon,
  handleCheckout,
  isCheckoutDisabled,
}: CartSummaryProps) {
  const shippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );
  const amountForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

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
          {appliedCoupon && (
            <SummaryRow
              label={`Discount (${appliedCoupon})`}
              value={`-${discount.toFixed(2)}`}
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

        {/* Coupon Code */}
        <div className="mb-6">
          <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
            <Tag className="w-4 h-4 text-rose-600" />
            Apply Coupon
          </h4>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                disabled={!!appliedCoupon}
                className="pr-20"
              />
              {appliedCoupon && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-bold">Applied!</span>
                </div>
              )}
            </div>
            {!appliedCoupon && (
              <Button
                onClick={applyCoupon}
                className="bg-rose-600 hover:bg-rose-700"
                disabled={couponCode.length === 0}
              >
                Apply
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Try code:{" "}
            <span className="font-extrabold text-rose-600 dark:text-rose-400">
              SAVE10
            </span>
          </p>
        </div>

        {/* Free Shipping Progress */}
        {shipping > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                Add {CURRENCY}
                {amountForFreeShipping.toFixed(2)} more for FREE shipping!
              </span>
            </div>
            <div className="h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 bg-rose-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

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
