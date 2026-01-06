// "use client"

// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import type { Category } from "@/types/product"
// import { Card } from "@/components/ui/card"

// interface ProductsFiltersProps {
//   searchTerm: string
//   setSearchTerm: (term: string) => void
//   selectedCategory: string
//   setSelectedCategory: (category: string) => void
//   stockFilter: string
//   setStockFilter: (filter: string) => void
//   categories: Category[]
// }

// export default function ProductsFilters({
//   searchTerm,
//   setSearchTerm,
//   selectedCategory,
//   setSelectedCategory,
//   stockFilter,
//   setStockFilter,
//   categories,
// }: ProductsFiltersProps) {
//   return (
//     <Card className="border-border p-4 space-y-4 md:space-y-0 md:flex gap-4">
//       <div className="flex-1">
//         <Input
//           placeholder="Search by product name or SKU..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="bg-input border-border"
//         />
//       </div>

//       <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//         <SelectTrigger className="bg-input border-border w-full md:w-[200px]">
//           <SelectValue placeholder="Category" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Categories</SelectItem>
//           {categories.map((cat) => (
//             <SelectItem key={cat.id} value={cat.slug}>
//               {cat.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       <Select value={stockFilter} onValueChange={setStockFilter}>
//         <SelectTrigger className="bg-input border-border w-full md:w-[150px]">
//           <SelectValue placeholder="Stock" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="all">All Items</SelectItem>
//           <SelectItem value="inStock">In Stock</SelectItem>
//           <SelectItem value="outOfStock">Out of Stock</SelectItem>
//         </SelectContent>
//       </Select>
//     </Card>
//   )
// }


"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategoryTree } from "@/types/category"; 
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProductsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  stockFilter: string;
  setStockFilter: (filter: string) => void;
  categories: ICategoryTree[];
}

export default function ProductsFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  stockFilter,
  setStockFilter,
  categories,
}: ProductsFiltersProps) {

  // ১. বর্তমান ক্যাটাগরি খুঁজে বের করা
  const currentCategory = categories.find((c) => c.slug === selectedCategory);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setStockFilter("all");
  };

  return (
    <Card className="border-border p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
      <div className="lg:col-span-1">
        <Input
          placeholder="Search name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-input border-border"
        />
      </div>

      {/* Category Select */}
      <Select 
        value={selectedCategory} 
        onValueChange={(val) => {
            setSelectedCategory(val);
            setSelectedSubCategory("all");
        }}
      >
        <SelectTrigger className="bg-input border-border">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat._id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* SubCategory Select - FIXED */}
      <Select 
        value={selectedSubCategory} 
        onValueChange={setSelectedSubCategory}
        // 👇 এখানে children চেক করা হচ্ছে
        disabled={selectedCategory === "all" || !currentCategory?.children?.length}
      >
        <SelectTrigger className="bg-input border-border">
          <SelectValue placeholder="Subcategory" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subcategories</SelectItem>
          {/* 👇 এখানে children ম্যাপ করা হচ্ছে */}
          {currentCategory?.children?.map((sub) => (
            <SelectItem key={sub._id || sub.slug} value={sub.slug}>
              {sub.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={stockFilter} onValueChange={setStockFilter}>
        <SelectTrigger className="bg-input border-border">
          <SelectValue placeholder="Stock Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="inStock">In Stock</SelectItem>
          <SelectItem value="outOfStock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>

      <Button 
        variant="outline" 
        onClick={handleClearFilters}
        className="gap-2"
      >
        <X className="w-4 h-4" /> Clear
      </Button>
    </Card>
  );
}