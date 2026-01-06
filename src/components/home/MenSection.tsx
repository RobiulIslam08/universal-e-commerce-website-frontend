"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import { getAllProducts } from "@/services/product";
import { IProduct } from "@/types/product";
import Image from "next/image";
import SectionTitle from "@/components/common/SectionTitle";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function MenSection() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts("category=Men");
        if (res?.data) {
          // Show only first 12 products
          setProducts(res.data.slice(0, 12));
        } else if (Array.isArray(res)) {
          setProducts(res.slice(0, 12));
        }
      } catch (error) {
        console.error("Failed to fetch men products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading men&apos;s collection...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-linear-to-b from-white to-gray-50">
      <SectionTitle
        title="Men's Collection"
        subtitle="Trending fashion for men"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {products.map((product, index) => {
          const imageUrl =
            product.images && product.images.length > 0
              ? product.images[0]
              : product.image;

          return (
            <ProductCard
              key={product.id || product._id || index}
              _id={product._id}
              product={product}
              category={product.category}
              image={
                imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.title || "Product image"}
                    fill
                    className="object-contain"
                    unoptimized={
                      imageUrl.startsWith("data:") ||
                      imageUrl.startsWith("blob:")
                    }
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )
              }
              title={product.title}
              price={`$${product.price}`}
              strike={
                product.strikePrice ? `$${product.strikePrice}` : undefined
              }
              badge={product.badge}
            />
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/category/men"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700  font-semibold transition-colors group"
        >
          View All Men&apos;s Products
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
