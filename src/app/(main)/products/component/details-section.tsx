"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product";
import { useAppDispatch } from "@/redux/hooks";
import { addProduct } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DetailsSection({ product }: { product: IProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleBuy = () => {
    // Stock validation
    if (!product.stockQuantity || product.stockQuantity <= 0) {
      toast.error("Sorry, this product is out of stock!");
      return;
    }

    if (quantity > product.stockQuantity) {
      toast.error(`Sorry, only ${product.stockQuantity} items left in stock!`);
      return;
    }
    // ১. প্রোডাক্টটি একবার কার্টে অ্যাড করে রাখা (যাতে Checkout পেজ Redux এ খুঁজে পায়)
    dispatch(addProduct(product));

    // ২. URL এ productId এবং সিলেক্ট করা quantity পাঠানো
    router.push(`/checkout?buyNow=${product._id}&quantity=${quantity}`);
  };

  const handleAddToCart = () => {
    // Stock validation
    if (!product.stockQuantity || product.stockQuantity <= 0) {
      toast.error("Sorry, this product is out of stock!");
      return;
    }

    if (quantity > product.stockQuantity) {
      toast.error(`Sorry, only ${product.stockQuantity} items left in stock!`);
      return;
    }

    setIsAdding(true);
    // Add product to cart with quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addProduct(product));
    }
    toast.success(`${quantity} ${product.title} added to cart!`);
    setTimeout(() => setIsAdding(false), 2000);
  };

  const isOutOfStock = !product.stockQuantity || product.stockQuantity <= 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 sm:gap-5 lg:gap-6"
    >
      {/* 1. Header & Stock Badge */}
      <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-[1.1] antialiased"
          style={{
            fontFamily:
              'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {product.title}
        </h1>
        <div className="inline-flex items-center">
          <span
            className={`text-xs sm:text-sm font-bold uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border-2 antialiased ${
              !isOutOfStock
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700"
                : "bg-red-50 text-red-700 border-red-300"
            }`}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            {!isOutOfStock ? "✓ In Stock" : "✗ Out of Stock"}
          </span>
        </div>
      </motion.div>

      {/* 2. Price Section */}
      <motion.div
        variants={itemVariants}
        className="flex items-baseline gap-2 sm:gap-3"
      >
        <span
          className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-rose-600 antialiased tabular-nums"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontFeatureSettings: '"tnum"',
          }}
        >
          ${product.price}
        </span>
        {product.strikePrice && (
          <span
            className="text-lg sm:text-xl font-semibold text-muted-foreground line-through opacity-60 tabular-nums"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            ${product.strikePrice}
          </span>
        )}
      </motion.div>

      {/* 3. Description */}
      <motion.div variants={itemVariants}>
        <p
          className="text-slate-600 dark:text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed font-medium antialiased"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: "1.75",
          }}
        >
          {product.shortDescription}
        </p>
      </motion.div>

      <motion.hr
        variants={itemVariants}
        className="border-gray-100 dark:border-gray-800"
      />

      {/* 4. Actions Area */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-4 sm:gap-5"
      >
        {/* Quantity Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="text-sm sm:text-base font-bold uppercase tracking-wide text-foreground antialiased"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            Quantity
          </span>
          <div className="flex items-center border rounded-lg bg-background w-fit">
            <Button
              variant="ghost"
              size="icon"
              disabled={isOutOfStock || quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-transparent hover:text-rose-600"
            >
              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>
            <span className="w-7 sm:w-8 text-center text-xs sm:text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={isOutOfStock || quantity >= product.stockQuantity}
              onClick={() =>
                setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))
              }
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-transparent hover:text-rose-600"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Button>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
          {/* Add to Cart */}
          <Button
            size="lg"
            variant="outline"
            className="order-2 sm:order-1 h-10 sm:h-11 lg:h-12 font-semibold text-xs sm:text-sm lg:text-base border-2 border-gray-200 hover:border-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:border-gray-700 dark:hover:bg-rose-950 transition-colors antialiased"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.02em",
            }}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isAdding ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" /> Added
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" /> Add to Cart
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Buy Now */}
          <Button
            size="lg"
            className="order-1 sm:order-2 h-10 sm:h-11 lg:h-12 font-bold text-xs sm:text-sm lg:text-base bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 dark:shadow-none transition-all duration-300 antialiased"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.03em",
            }}
            onClick={handleBuy}
            disabled={isOutOfStock}
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" /> Buy
            Now
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
