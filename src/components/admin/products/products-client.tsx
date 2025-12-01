"use client";

import { useState, useMemo } from "react";
import ProductsTable from "@/components/admin/products/products-table";
import ProductsFilters from "@/components/admin/products/products-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { categories } from "@/constants/products";
import { Product } from "@/types/product";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && product.inStock) ||
        (stockFilter === "outOfStock" && !product.inStock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [searchTerm, selectedCategory, stockFilter, initialProducts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all your products
          </p>
        </div>
        <Link href="/admin/products/add">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            ➕ Add Product
          </Button>
        </Link>
      </div>

      <ProductsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        categories={categories}
      />

      <ProductsTable products={filteredProducts} />
    </div>
  );
}
