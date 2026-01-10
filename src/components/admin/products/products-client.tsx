// "use client";

// import { useState, useMemo } from "react";
// import ProductsTable from "@/components/admin/products/products-table";
// import ProductsFilters from "@/components/admin/products/products-filters";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { IProduct } from "@/types/product";
// import { ICategoryTree } from "@/types/category";
// import { getAllProducts } from "@/services/product";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";

// interface ProductsClientProps {
//   initialProducts: IProduct[];
//   categories: ICategoryTree[];
// }

// export default function ProductsClient({
//   initialProducts,
//   categories,
// }: ProductsClientProps) {
//   const [products, setProducts] = useState<IProduct[]>(initialProducts);

//   // Filter States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedSubCategory, setSelectedSubCategory] = useState("all");
//   const [stockFilter, setStockFilter] = useState("all");

//   // Pagination States
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Refresh Products
//   const handleProductsChange = async () => {
//     try {
//       const res = await getAllProducts("limit=1000");
//       const updatedProducts = Array.isArray(res) ? res : res?.data || [];
//       setProducts(updatedProducts);
//     } catch (error) {
//       console.error("Error refreshing products:", error);
//     }
//   };

//   // Filter Logic
//   const filteredProducts = useMemo(() => {
//     return products.filter((product) => {
//       // 1. Search Logic
//       const matchesSearch =
//         product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

//       // 2. Category Logic
//       const matchesCategory =
//         selectedCategory === "all" || product.category === selectedCategory;

//       // 3. SubCategory Logic
//       const matchesSubCategory =
//         selectedSubCategory === "all" || product.subCategory === selectedSubCategory;

//       // 4. Stock Logic
//       const matchesStock =
//         stockFilter === "all" ||
//         (stockFilter === "inStock" && product.stockQuantity > 0) ||
//         (stockFilter === "outOfStock" &&
//           (!product.stockQuantity || product.stockQuantity <= 0));

//       return matchesSearch && matchesCategory && matchesSubCategory && matchesStock;
//     });
//   }, [searchTerm, selectedCategory, selectedSubCategory, stockFilter, products]);

//   // Pagination Logic (Client Side)
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

//   const paginatedProducts = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredProducts, currentPage]);

//   // Reset pagination when filters change
//   useMemo(() => {
//     setCurrentPage(1);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchTerm, selectedCategory, selectedSubCategory, stockFilter]);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-balance">Products</h1>
//           <p className="text-muted-foreground text-sm mt-1">
//             Manage all your products ({filteredProducts.length} items)
//           </p>
//         </div>
//         <Link href="/admin/products/add">
//           <Button className="gap-2 bg-primary hover:bg-primary/90">
//             ➕ Add Product
//           </Button>
//         </Link>
//       </div>

//       {/* Filters */}
//       <ProductsFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//         selectedSubCategory={selectedSubCategory}
//         setSelectedSubCategory={setSelectedSubCategory}
//         stockFilter={stockFilter}
//         setStockFilter={setStockFilter}
//         categories={categories}
//       />

//       {/* Table */}
//       <div className="space-y-4">
//         <ProductsTable
//           products={paginatedProducts}
//           onProductsChange={handleProductsChange}
//         />

//         {/* Pagination Controls */}
//         {filteredProducts.length > 0 && (
//           <div className="flex items-center justify-between px-2">
//             <div className="text-sm text-muted-foreground">
//               Page {currentPage} of {totalPages}
//             </div>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setCurrentPage(1)}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronsLeft className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setCurrentPage(totalPages)}
//                 disabled={currentPage === totalPages}
//               >
//                 <ChevronsRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductsTable from "@/components/admin/products/products-table";
import ProductsFilters from "@/components/admin/products/products-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IProduct } from "@/types/product";
import { ICategoryTree } from "@/types/category";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface ProductsClientProps {
  initialProducts: IProduct[];
  categories: ICategoryTree[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export default function ProductsClient({
  initialProducts,
  categories,
  meta,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL আপডেট করার ফাংশন
  const updateQuery = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key); // 'all' সিলেক্ট করলে URL থেকে প্যারামিটার মুছে যাবে
      }
    });

    // যখনই কোনো ফিল্টার চেঞ্জ হবে, পেজ ১-এ নিয়ে যাবে
    if (!newParams.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Total {meta.total} products found
          </p>
        </div>
        <Link href="/admin/products/add">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            ➕ Add Product
          </Button>
        </Link>
      </div>

      <ProductsFilters
        searchTerm={searchParams.get("searchTerm") || ""}
        setSearchTerm={(val) => updateQuery({ searchTerm: val })}
        selectedCategory={searchParams.get("category") || "all"}
        setSelectedCategory={(val) => {
          updateQuery({ category: val, subCategory: "all" });
        }}
        selectedSubCategory={searchParams.get("subCategory") || "all"}
        setSelectedSubCategory={(val) => updateQuery({ subCategory: val })}
        stockFilter={searchParams.get("stock") || "all"}
        setStockFilter={(val) => updateQuery({ stock: val })}
        categories={categories}
      />

      <div className="space-y-4">
        <ProductsTable
          products={initialProducts}
          onProductsChange={() => router.refresh()}
        />

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-2 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPage}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuery({ page: "1" })}
              disabled={meta.page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuery({ page: String(meta.page - 1) })}
              disabled={meta.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuery({ page: String(meta.page + 1) })}
              disabled={meta.page >= meta.totalPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuery({ page: String(meta.totalPage) })}
              disabled={meta.page >= meta.totalPage}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
