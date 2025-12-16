"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types/product";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    // Add to cart first, then navigate with buyNow param
    dispatch(addProduct(product));
    router.push(`/checkout?buyNow=${product._id}`);
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    // Add product to cart with quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addProduct(product));
    }

    toast.success(`${quantity} ${product.title} added to cart!`);

    setTimeout(() => setIsAdding(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full"
    >
      {/* 1.Header & Rating */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 w-fit px-3 py-1 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span>Premium Selection</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1]">
          {product.title}
        </h1>

        <div className="flex items-center gap-4 text-sm">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center bg-rose-100/50 dark:bg-rose-900/30 px-3 py-1 rounded-lg cursor-help">
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-current"
                            : "opacity-40"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-bold text-foreground">
                    {product.rating}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-rose-50 text-rose-900 border-rose-200">
                {" "}
                Based on 124 verified reviews{" "}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              product.stockQuantity > 0
                ? "text-green-600 bg-green-50 dark:bg-green-900/20"
                : "text-red-500 bg-red-50"
            }`}
          >
            {product.stockQuantity > 0
              ? `In Stock (${product.stockQuantity} available)`
              : "Out of Stock"}
          </span>
        </div>
      </motion.div>

      {/* 2. Price & Short Desc */}
      <motion.div variants={itemVariants} className="mt-8 space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          {product.shortDescription}
        </p>

        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-black text-primary">
            ${product.price}
          </span>
          {product.strikePrice && (
            <span className="text-2xl text-muted-foreground line-through decoration-rose-300 decoration-2">
              ${product.strikePrice}
            </span>
          )}
        </div>
      </motion.div>

      {/* 3. Smart Actions (Quantity & Add to Cart) */}
      <motion.div
        variants={itemVariants}
        className="mt-12 flex flex-col sm:flex-row gap-5 max-w-xl"
      >
        {/* Quantity Design */}
        <div className="flex items-center justify-between border border-rose-200 dark:border-rose-800 rounded-2xl bg-white/50 dark:bg-card/50 p-1 shadow-sm w-full sm:w-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="hover:bg-rose-100 text-rose-700 rounded-xl h-10 w-10"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-bold text-xl w-12 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))
            }
            className="hover:bg-rose-100 text-rose-700 rounded-xl h-10 w-10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Add to Cart Button with Micro-interaction */}
        <div className="flex-1 relative z-10">
          <Button
            size="lg"
            className={`w-full h-[54px] text-lg font-bold rounded-2xl shadow-[0_8px_30px_-10px_rgba(225,29,72,0.4)] transition-all duration-500 ${
              isAdding
                ? "bg-green-500 hover:bg-green-600 w-[54px] rounded-full ml-auto"
                : "bg-primary hover:bg-primary/90 hover:scale-[1.02] hover:shadow-[0_15px_30px_-10px_rgba(225,29,72,0.5)]"
            } overflow-hidden relative`}
            onClick={handleAddToCart}
            disabled={!product.stockQuantity || product.stockQuantity <= 0}
          >
            {/* Button Content Animation */}
            <motion.div
              initial={false}
              animate={{ y: isAdding ? -50 : 0, opacity: isAdding ? 0 : 1 }}
              className="flex items-center justify-center absolute inset-0"
            >
              <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
            </motion.div>

            {/* Success State Animation */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: isAdding ? 0 : 50, opacity: isAdding ? 1 : 0 }}
              className="flex items-center justify-center absolute inset-0 text-white"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </Button>
        </div>

        {/* Buy Button */}
        <Button
          size="lg"
          variant="outline"
          className="h-[54px] px-8 text-lg font-bold rounded-2xl border-2 border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300"
          onClick={handleBuy}
          disabled={!product.stockQuantity || product.stockQuantity <= 0}
        >
          Buy
        </Button>
      </motion.div>
    </motion.div>
  );
}
