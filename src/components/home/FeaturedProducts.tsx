"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import { getAllProducts } from "@/services/product";
import { IProduct } from "@/types/product";
import Image from "next/image";
import SectionTitle from "@/components/common/SectionTitle";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        // Assuming the API returns { success: true, data: [...] } or just the array depending on backend
        // Based on addProduct, it seems to return a result object.
        // Let's assume standard response structure.
        if (res?.data) {
          setProducts(res.data);
        } else if (Array.isArray(res)) {
          setProducts(res);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }
  console.log("Products from API:", products);
  console.log("First product _id:", products[0]?._id);
  console.log("First product id:", products[0]?.id);

  return (
    <div className="">
      <SectionTitle title="Featured Products" />

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
    </div>
  );
}
