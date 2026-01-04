/**
 * Cart Icon Component
 * Displays shopping cart with item count badge
 */

"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/features/cartSlice";

export default function CartIcon() {
  const cartProducts = useAppSelector(orderedProductsSelector);
  const cartCount = cartProducts.reduce(
    (total, product) => total + product.orderQuantity,
    0
  );

  return (
    <Link
      href="/cart"
      className="flex items-center gap-1 hover:opacity-80 transition relative"
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <ShoppingCart size={22} aria-hidden="true" />
      {cartCount > 0 && (
        <span
          className="absolute -top-2 -right-2 bg-rose-300 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
          aria-hidden="true"
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
}
