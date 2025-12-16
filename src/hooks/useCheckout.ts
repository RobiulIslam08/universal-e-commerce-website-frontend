"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/features/cartSlice";
import { CartProduct } from "@/redux/features/cartSlice";
import { CART_CONSTANTS } from "@/constants/cart";

const { TAX_RATE } = CART_CONSTANTS;

interface CheckoutData {
  products: CartProduct[];
  isBuyNowMode: boolean;
  subtotal: number;
  totalSavings: number;
  tax: number;
  shipping: number;
  total: number;
}

export function useCheckout(): CheckoutData {
  const searchParams = useSearchParams();
  const cartProducts = useAppSelector(orderedProductsSelector);

  // Check if it's buy now mode from URL
  const buyNowProductId = searchParams.get("buyNow");
  const isBuyNowMode = !!buyNowProductId;

  // Get the products to show in checkout
  const products = useMemo(() => {
    if (buyNowProductId) {
      // Find the product in cart by ID
      const buyNowProduct = cartProducts.find((p) => p._id === buyNowProductId);
      if (buyNowProduct) {
        // Return only this product with quantity 1
        return [{ ...buyNowProduct, orderQuantity: 1 }];
      }
      return [];
    }
    return cartProducts;
  }, [buyNowProductId, cartProducts]);

  // Calculate totals
  const { subtotal, totalSavings } = useMemo(() => {
    let sub = 0;
    let savings = 0;

    products.forEach((item) => {
      const currentPrice = item.offerPrice || item.price;
      const originalPrice = item.strikePrice || item.price;
      sub += currentPrice * item.orderQuantity;
      savings += (originalPrice - currentPrice) * item.orderQuantity;
    });

    return { subtotal: sub, totalSavings: savings };
  }, [products]);

  const tax = Math.round(subtotal * TAX_RATE);

  // Simple shipping logic - can be enhanced later
  const shipping = subtotal > 500 ? 0 : subtotal > 0 ? 50 : 0;

  const total = subtotal + shipping + tax;

  return {
    products,
    isBuyNowMode,
    subtotal,
    totalSavings,
    tax,
    shipping,
    total,
  };
}
