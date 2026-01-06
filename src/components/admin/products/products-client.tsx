// "use client";

// import { useState, useMemo } from "react";
// import ProductsTable from "@/components/admin/products/products-table";
// import ProductsFilters from "@/components/admin/products/products-filters";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { categories } from "@/constants/products";
// import { IProduct } from "@/types/product";
// import { getAllProducts } from "@/services/product";

// interface ProductsClientProps {
//   initialProducts: IProduct[];
// }

// export default function ProductsClient({
//   initialProducts,
// }: ProductsClientProps) {
//   const [products, setProducts] = useState<IProduct[]>(initialProducts);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [stockFilter, setStockFilter] = useState("all");

//   const handleProductsChange = async () => {
//     try {
//       const res = await getAllProducts();
//       const updatedProducts = Array.isArray(res) ? res : res?.data || [];
//       setProducts(updatedProducts);
//     } catch (error) {
//       console.error("Error refreshing products:", error);
//     }
//   };

//   const filteredProducts = useMemo(() => {
//     return products.filter((product) => {
//       const matchesSearch =
//         product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCategory =
//         selectedCategory === "all" || product.category === selectedCategory;
//       const matchesStock =
//         stockFilter === "all" ||
//         (stockFilter === "inStock" && product.stockQuantity > 0) ||
//         (stockFilter === "outOfStock" &&
//           (!product.stockQuantity || product.stockQuantity <= 0));

//       return matchesSearch && matchesCategory && matchesStock;
//     });
//   }, [searchTerm, selectedCategory, stockFilter, products]);

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-balance">Products</h1>
//           <p className="text-muted-foreground text-sm mt-1">
//             Manage all your products
//           </p>
//         </div>
//         <Link href="/admin/products/add">
//           <Button className="gap-2 bg-primary hover:bg-primary/90">
//             ➕ Add Product
//           </Button>
//         </Link>
//       </div>

//       <ProductsFilters
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedCategory={selectedCategory}
//         setSelectedCategory={setSelectedCategory}
//         stockFilter={stockFilter}
//         setStockFilter={setStockFilter}
//         categories={categories}
//       />

//       <ProductsTable
//         products={filteredProducts}
//         onProductsChange={handleProductsChange}
//       />
//     </div>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import ProductsTable from "@/components/admin/products/products-table";
import ProductsFilters from "@/components/admin/products/products-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IProduct } from "@/types/product";
import { ICategoryTree } from "@/types/category";
import { getAllProducts } from "@/services/product";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface ProductsClientProps {
  initialProducts: IProduct[];
  categories: ICategoryTree[];
}

export default function ProductsClient({
  initialProducts,
  categories,
}: ProductsClientProps) {
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Refresh Products
  const handleProductsChange = async () => {
    try {
      const res = await getAllProducts("limit=10000");
      const updatedProducts = Array.isArray(res) ? res : res?.data || [];
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Logic
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category Logic
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      // 3. SubCategory Logic
      const matchesSubCategory =
        selectedSubCategory === "all" || product.subCategory === selectedSubCategory;

      // 4. Stock Logic
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && product.stockQuantity > 0) ||
        (stockFilter === "outOfStock" &&
          (!product.stockQuantity || product.stockQuantity <= 0));

      return matchesSearch && matchesCategory && matchesSubCategory && matchesStock;
    });
  }, [searchTerm, selectedCategory, selectedSubCategory, stockFilter, products]);

  // Pagination Logic (Client Side)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Reset pagination when filters change
  useMemo(() => {
    setCurrentPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedSubCategory, stockFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-balance">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all your products ({filteredProducts.length} items)
          </p>
        </div>
        <Link href="/admin/products/add">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            ➕ Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ProductsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        categories={categories}
      />

      {/* Table */}
      <div className="space-y-4">
        <ProductsTable
          products={paginatedProducts}
          onProductsChange={handleProductsChange}
        />

        {/* Pagination Controls */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}