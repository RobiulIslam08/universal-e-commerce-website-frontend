/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import Image from "next/image";
import { Tag, Award, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CART_CONSTANTS } from "@/constants/cart";
import { useMemo } from "react";

const { CURRENCY } = CART_CONSTANTS;

// Props ইন্টারফেস
interface OrderSummaryProps {
  products: any[]; 
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isBuyNowMode?: boolean;
}

export const OrderSummaryCard = ({
  products = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  isBuyNowMode = false,
}: OrderSummaryProps) => {
  
  // সেভিংস ক্যালকুলেশন
  const totalSavings = useMemo(() => {
    return products.reduce((acc, item) => {
      const currentPrice = item.offerPrice || item.price;
      const originalPrice = item.strikePrice || item.price;
      const discount = originalPrice - currentPrice;
      return acc + (discount > 0 ? discount * item.orderQuantity : 0);
    }, 0);
  }, [products]);

  return (
    <Card className="border-rose-200 dark:border-rose-800 shadow-2xl sticky top-24">
      <CardHeader className="bg-linear-to-br from-rose-50 to-white dark:from-slate-800 dark:to-slate-900">
        <CardTitle className="text-slate-900 dark:text-white">
          {isBuyNowMode ? "Buy Now Summary" : "Order Summary"}
        </CardTitle>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {products.length} {products.length === 1 ? "item" : "items"} in your order
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Items List */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {products.map((item, idx) => {
            const currentPrice = item.offerPrice || item.price;
            const originalPrice = item.strikePrice || item.price;
            const discount = originalPrice - currentPrice;
            
            const imageUrl =
              item.images && item.images.length > 0
                ? item.images[0]
                : item.image;

            return (
              <div
                key={item._id || idx}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 relative rounded-md overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-600">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={item.title || "Product"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Qty: <span className="font-medium text-slate-900 dark:text-slate-200">{item.orderQuantity}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right pl-2">
                  <p className="text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {CURRENCY}
                    {(currentPrice * item.orderQuantity).toLocaleString()}
                  </p>
                  {discount > 0 && (
                    <p className="text-[10px] text-red-600 dark:text-red-400 whitespace-nowrap">
                      Save {CURRENCY}
                      {(discount * item.orderQuantity).toFixed(0)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        {/* Pricing Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900 dark:text-slate-200">
              {CURRENCY}{subtotal.toLocaleString()}
            </span>
          </div>

          {totalSavings > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold text-xs">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Total Savings
              </span>
              <span>-{CURRENCY}{totalSavings.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-green-600 dark:text-green-400 font-semibold" : "font-medium text-slate-900 dark:text-slate-200"}>
              {shipping === 0 ? "FREE" : `${CURRENCY}${shipping}`}
            </span>
          </div>

          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Tax (VAT)</span>
            <span className="font-medium text-slate-900 dark:text-slate-200">
              {CURRENCY}{tax}
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />

        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
          <span className="text-2xl font-bold bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {CURRENCY}{total.toLocaleString()}
          </span>
        </div>

        {/* Trust Badges */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Award className="w-3.5 h-3.5 text-rose-600" />
            <span>Trusted by 50,000+ happy customers</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            <span>Order processing takes ~30 minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};