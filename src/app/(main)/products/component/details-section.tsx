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
      className="flex flex-col gap-6"
    >
      {/* 1. Header & Stock Badge */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {product.title}
        </h1>
        <div className="inline-flex items-center">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
              !isOutOfStock
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            Availability: {!isOutOfStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </motion.div>

      {/* 2. Price Section */}
      <motion.div variants={itemVariants} className="flex items-baseline gap-3">
        <span className="text-3xl md:text-4xl font-bold text-rose-600">
          ${product.price}
        </span>
        {product.strikePrice && (
          <span className="text-lg text-muted-foreground line-through">
            ${product.strikePrice}
          </span>
        )}
      </motion.div>

      {/* 3. Description */}
      <motion.div variants={itemVariants}>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          {product.shortDescription}
        </p>
      </motion.div>

      <motion.hr
        variants={itemVariants}
        className="border-gray-100 dark:border-gray-800"
      />

      {/* 4. Actions Area */}
      <motion.div variants={itemVariants} className="flex flex-col gap-5">
        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Quantity</span>
          <div className="flex items-center border rounded-lg bg-background w-fit">
            <Button
              variant="ghost"
              size="icon"
              disabled={isOutOfStock || quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-9 w-9 hover:bg-transparent hover:text-rose-600"
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              disabled={isOutOfStock || quantity >= product.stockQuantity}
              onClick={() =>
                setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))
              }
              className="h-9 w-9 hover:bg-transparent hover:text-rose-600"
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Add to Cart */}
          <Button
            size="lg"
            variant="outline"
            className="order-2 sm:order-1 h-12 font-semibold text-base border-2 border-gray-200 hover:border-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:border-gray-700 dark:hover:bg-rose-950 transition-colors"
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
                  className="flex items-center gap-2"
                >
                  <Check className="w-5 h-5" /> Added
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Buy Now */}
          <Button
            size="lg"
            className="order-1 sm:order-2 h-12 font-bold text-base bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 dark:shadow-none transition-all duration-300"
            onClick={handleBuy}
            disabled={isOutOfStock}
          >
            <CreditCard className="w-5 h-5 mr-2" /> Buy Now
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
