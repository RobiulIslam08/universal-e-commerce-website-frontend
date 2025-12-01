
"use client";
import { useState, useMemo } from "react";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,

} from "lucide-react";
import { toast } from "sonner";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox"; // ⭐️ New import

// Custom Components
import CartItemCard from "./components/CartItemCard";
import TrustBadges from "./components/TrustBadges";
import CartSummary from "./components/CartSummary";
import ClearCartModal from "./components/ClearCartModal";

// Types (Same as before)
type CartItem = {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  color: string;
  inStock: boolean;
};

// Initial Cart Data (Same as before)
const initialCartItems: CartItem[] = [
  { id: 1, name: "Luxury Wireless Headphones", price: 299, originalPrice: 399, quantity: 1, image: "🎧", color: "Midnight Black", inStock: true },
  { id: 2, name: "Premium Smart Watch", price: 499, originalPrice: 599, quantity: 2, image: "⌚", color: "Space Gray", inStock: true },
  { id: 3, name: "Wireless Keyboard", price: 149, originalPrice: 199, quantity: 1, image: "⌨️", color: "Silver", inStock: true },
];

export default function PremiumCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // ⭐️ New State for Selected Items (stores IDs of selected items)
  const [selectedItems, setSelectedItems] = useState<number[]>(initialCartItems.map(item => item.id));

  // --- Selection Logic ---
  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < cartItems.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? cartItems.map(item => item.id) : []);
  };

  const handleToggleItem = (id: number, checked: boolean) => {
    setSelectedItems(prev => 
      checked ? [...prev, id] : prev.filter(itemId => itemId !== id)
    );
  };

  // --- Calculation Logic (only for selected items) ---
  const selectedCartItems = useMemo(() => {
    return cartItems.filter(item => selectedItems.includes(item.id));
  }, [cartItems, selectedItems]);

  const subtotal = useMemo(() => selectedCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  ), [selectedCartItems]);

  const savings = useMemo(() => selectedCartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0
  ), [selectedCartItems]);
  
  // Rerender totals when selection changes
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  // --- Actions ---
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    setRemovingItem(id);
    setSelectedItems(prev => prev.filter(itemId => itemId !== id)); // Deselect item on removal
    setTimeout(() => {
      setCartItems(cartItems.filter((item) => item.id !== id));
      setRemovingItem(null);
      toast.info("Item Removed", { description: `${item?.name} removed from cart`, duration: 2000 });
    }, 300);
  };

  const moveToWishlist = (id: number) => {
    const item = cartItems.find((i) => i.id === id);
    removeItem(id); // removeItem handles item removal and info toast
    toast.success("Moved to Wishlist!", { description: `${item?.name} has been added to your wishlist`, duration: 3000 });
  };

  const clearCart = () => {
    const itemCount = cartItems.length;
    setCartItems([]);
    setSelectedItems([]);
    setShowClearConfirm(false);
    toast.success("Cart Cleared!", { description: `${itemCount} ${itemCount === 1 ? "item" : "items"} removed from cart`, duration: 3000 });
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon("SAVE10");
      toast.success("Coupon Applied!", { description: "You saved 10% on your order", duration: 3000 });
    } else if (couponCode.trim() !== "") {
      toast.error("Invalid Coupon", { description: "Please check the coupon code and try again", duration: 3000 });
    }
  };
  
  const handleCheckout = () => {
      if (selectedCartItems.length === 0) {
           toast.warning("Nothing Selected", { description: "Please select at least one item to proceed to checkout.", duration: 3000 });
           return;
      }
      // Implement actual checkout logic here
      toast.success("Proceeding to Checkout!", { description: `Checking out ${selectedCartItems.length} items for $${total.toFixed(2)}`, duration: 3000 });
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">

        {/* user */}


        {/* Header */}
        <div className="mb-8 border-b pb-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State (Same as before)
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="w-24 h-24 text-slate-300 dark:text-slate-700 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">Looks like you haven&apos;t added anything yet.</p>
            <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                {/* ⭐️ Select All Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                    className="w-5 h-5 data-[state=indeterminate]:bg-rose-500 data-[state=indeterminate]:text-white data-[state=checked]:bg-rose-600"
                    // Handle indeterminate state for partial selection
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
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  moveToWishlist={moveToWishlist}
                  isRemoving={removingItem === item.id}
                  // ⭐️ New Selection Props
                  isSelected={selectedItems.includes(item.id)}
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
                  handleCheckout={handleCheckout} // ⭐️ Pass checkout handler
                  isCheckoutDisabled={selectedCartItems.length === 0} // ⭐️ Disable checkout if nothing selected
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
        onConfirm={clearCart}
      />
    </div>
  );
}