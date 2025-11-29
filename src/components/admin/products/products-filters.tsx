"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Category } from "@/types/product"
import { Card } from "@/components/ui/card"

interface ProductsFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  stockFilter: string
  setStockFilter: (filter: string) => void
  categories: Category[]
}

export default function ProductsFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  stockFilter,
  setStockFilter,
  categories,
}: ProductsFiltersProps) {
  return (
    <Card className="border-border p-4 space-y-4 md:space-y-0 md:flex gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search by product name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-input border-border"
        />
      </div>

      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="bg-input border-border w-full md:w-[200px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={stockFilter} onValueChange={setStockFilter}>
        <SelectTrigger className="bg-input border-border w-full md:w-[150px]">
          <SelectValue placeholder="Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Items</SelectItem>
          <SelectItem value="inStock">In Stock</SelectItem>
          <SelectItem value="outOfStock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  )
}
