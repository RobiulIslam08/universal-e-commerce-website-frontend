"use client";

import { IProduct } from "@/types/product";
import Image from "next/image";
import { Package } from "lucide-react";

interface BestSellersSidebarProps {
  products: IProduct[];
}

export default function BestSellersSidebar({
  products,
}: BestSellersSidebarProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4 bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold">Best Sellers</h3>
      </div>

      <div className="space-y-3">
        {products.slice(0, 5).map((product) => (
          <a
            key={product._id || product.id}
            href={`/products/${product.slug}`}
            className="flex gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border hover:shadow-md transition-all group"
          >
            <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded shrink-0 overflow-hidden">
              {product.image || (product.images && product.images[0]) ? (
                <Image
                  src={product.image || product.images[0]}
                  alt={product.title}
                  fill
                  className="object-contain p-1 group-hover:scale-110 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {product.title}
              </h4>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-primary">
                  ${product.price}
                </span>
                {product.strikePrice && product.strikePrice > product.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.strikePrice}
                  </span>
                )}
              </div>

              {product.rating && product.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-amber-500">★</span>
                  <span className="text-xs text-muted-foreground">
                    {product.rating.toFixed(1)}
                  </span>
                  {product.reviewCount && (
                    <span className="text-xs text-muted-foreground">
                      ({product.reviewCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
