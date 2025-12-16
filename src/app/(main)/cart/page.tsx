"use client";
import { useState, useMemo } from "react";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Custom Components
import CartItemCard from "./components/CartItemCard";
import TrustBadges from "./components/TrustBadges";
import CartSummary from "./components/CartSummary";
import ClearCartModal from "./components/ClearCartModal";

// Redux
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  orderedProductsSelector,
  removeProduct,
  incrementOrderQuantity,
  decrementOrderQuantity,
  clearCart,
} from "@/redux/features/cartSlice";

// Constants
import { CART_CONSTANTS } from "@/constants/cart";

const {
  CURRENCY,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  TAX_RATE,
  COUPON_DISCOUNT_RATE,
  VALID_COUPON,
  REMOVE_ANIMATION_DELAY,
  TOAST_DURATION,
} = CART_CONSTANTS;

export default function PremiumCartPage() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(orderedProductsSelector);

  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // State for deselected Items (stores IDs of deselected items)
  const [deselectedItems, setDeselectedItems] = useState<string[]>([]);

  // Derive selectedItems from cartItems and deselectedItems
  const selectedItems = useMemo(() => {
    return cartItems
      .map((item) => item._id)
      .filter((id) => !deselectedItems.includes(id));
  }, [cartItems, deselectedItems]);

  // --- Selection Logic ---
  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < cartItems.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setDeselectedItems([]);
    } else {
      setDeselectedItems(cartItems.map((item) => item._id));
    }
  };

  const handleToggleItem = (id: string, checked: boolean) => {
    if (checked) {
      setDeselectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setDeselectedItems((prev) => [...prev, id]);
    }
  };

  // --- Calculation Logic (only for selected items) ---
  const selectedCartItems = useMemo(() => {
    return cartItems.filter((item) => selectedItems.includes(item._id));
  }, [cartItems, selectedItems]);

  const subtotal = useMemo(
    () =>
      selectedCartItems.reduce(
        (sum, item) =>
          sum + (item.offerPrice || item.price) * item.orderQuantity,
        0
      ),
    [selectedCartItems]
  );

  const savings = useMemo(
    () =>
      selectedCartItems.reduce((sum, item) => {
        const originalPrice = item.strikePrice || item.price;
        const currentPrice = item.offerPrice || item.price;
        return sum + (originalPrice - currentPrice) * item.orderQuantity;
      }, 0),
    [selectedCartItems]
  );

  // Calculate totals
  const discount = appliedCoupon ? subtotal * COUPON_DISCOUNT_RATE : 0;
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + shipping + tax;

  // --- Actions ---
  const updateQuantity = (id: string, action: "increment" | "decrement") => {
    if (action === "increment") {
      dispatch(incrementOrderQuantity(id));
    } else {
      dispatch(decrementOrderQuantity(id));
    }
  };

  const removeItem = (id: string) => {
    const item = cartItems.find((i) => i._id === id);
    setRemovingItem(id);
    setDeselectedItems((prev) => prev.filter((itemId) => itemId !== id));
    setTimeout(() => {
      dispatch(removeProduct(id));
      setRemovingItem(null);
      toast.info("Item Removed", {
        description: `${item?.title} removed from cart`,
        duration: TOAST_DURATION.SHORT,
      });
    }, REMOVE_ANIMATION_DELAY);
  };

  const moveToWishlist = (id: string) => {
    const item = cartItems.find((i) => i._id === id);
    removeItem(id);
    toast.success("Moved to Wishlist!", {
      description: `${item?.title} has been added to your wishlist`,
      duration: TOAST_DURATION.MEDIUM,
    });
  };

  const handleClearCart = () => {
    const itemCount = cartItems.length;
    dispatch(clearCart());
    setDeselectedItems([]);
    setShowClearConfirm(false);
    toast.success("Cart Cleared!", {
      description: `${itemCount} ${
        itemCount === 1 ? "item" : "items"
      } removed from cart`,
      duration: TOAST_DURATION.MEDIUM,
    });
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === VALID_COUPON) {
      setAppliedCoupon(VALID_COUPON);
      toast.success("Coupon Applied!", {
        description: "You saved 10% on your order",
        duration: TOAST_DURATION.MEDIUM,
      });
    } else if (couponCode.trim() !== "") {
      toast.error("Invalid Coupon", {
        description: "Please check the coupon code and try again",
        duration: TOAST_DURATION.MEDIUM,
      });
    }
  };

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      toast.warning("Nothing Selected", {
        description: "Please select at least one item to proceed to checkout.",
        duration: 3000,
      });
      return;
    }
    toast.success("Proceeding to Checkout!", {
      description: `Checking out ${
        selectedCartItems.length
      } items for ${CURRENCY}${total.toFixed(2)}`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-24 h-24 text-slate-300 dark:text-slate-700 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link href="/">
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                {/* Select All Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked as boolean)
                    }
                    className="w-5 h-5 data-[state=indeterminate]:bg-rose-500 data-[state=indeterminate]:text-white data-[state=checked]:bg-rose-600"
                    {...(isIndeterminate && { checked: "indeterminate" })}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-lg font-bold text-slate-900 dark:text-white cursor-pointer"
                  >
                    Select All ({selectedItems.length} / {cartItems.length})
                  </label>
                </div>

                {/* Clear Cart Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
              <Separator />

              {cartItems.map((item) => (
                <CartItemCard
                  key={item._id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  moveToWishlist={moveToWishlist}
                  isRemoving={removingItem === item._id}
                  isSelected={selectedItems.includes(item._id)}
                  onToggleSelection={handleToggleItem}
                />
              ))}

              <Separator />

              {/* Trust Badges for Mobile/Tablet */}
              <div className="block lg:hidden pt-4">
                <TrustBadges />
              </div>
            </div>

            {/* Order Summary (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                <CartSummary
                  subtotal={subtotal}
                  savings={savings}
                  discount={discount}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  couponCode={couponCode}
                  appliedCoupon={appliedCoupon}
                  setCouponCode={setCouponCode}
                  applyCoupon={applyCoupon}
                  handleCheckout={handleCheckout}
                  isCheckoutDisabled={selectedCartItems.length === 0}
                />

                {/* Trust Badges for Desktop */}
                <div className="hidden lg:block">
                  <TrustBadges />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ClearCartModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearCart}
      />
    </div>
  );
}
