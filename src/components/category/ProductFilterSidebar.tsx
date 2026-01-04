"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";

interface ProductFilterSidebarProps {
  title?: string;
  showSearch?: boolean;
}

export default function ProductFilterSidebar({
  title = "Filters",
  showSearch = true,
}: ProductFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ]);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Always reset to page 1 when filtering
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ searchTerm: searchTerm || null });
  };

  const handlePriceFilter = () => {
    updateSearchParams({
      minPrice: priceRange[0] > 0 ? priceRange[0].toString() : null,
      maxPrice: priceRange[1] < 10000 ? priceRange[1].toString() : null,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange([0, 10000]);
    router.push(window.location.pathname);
  };

  const hasActiveFilters = searchParams.toString() !== "";

  return (
    <div className="space-y-6 bg-card rounded-lg border p-6 sticky top-4">
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      {/* Search */}
      {showSearch && (
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-semibold">
            Search Products
          </Label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="secondary">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-4 border-t pt-4">
        <Label className="text-sm font-semibold">Price Range</Label>

        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={10000}
            step={100}
            className="mb-4"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1">
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
              Min
            </Label>
            <Input
              id="minPrice"
              type="number"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
              className="mt-1"
            />
          </div>
          <span className="text-muted-foreground mt-6">-</span>
          <div className="flex-1">
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
              Max
            </Label>
            <Input
              id="maxPrice"
              type="number"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="mt-1"
            />
          </div>
        </div>

        <Button onClick={handlePriceFilter} className="w-full" size="sm">
          Apply Price Filter
        </Button>
      </div>

      {/* Sort Options */}
      <div className="space-y-3 border-t pt-4">
        <Label className="text-sm font-semibold">Sort By</Label>
        <RadioGroup
          value={searchParams.get("sortBy") || "createdAt"}
          onValueChange={(value) => updateSearchParams({ sortBy: value })}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="createdAt" id="newest" />
            <Label htmlFor="newest" className="cursor-pointer font-normal">
              Newest First
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-asc" id="price-asc" />
            <Label htmlFor="price-asc" className="cursor-pointer font-normal">
              Price: Low to High
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-desc" id="price-desc" />
            <Label htmlFor="price-desc" className="cursor-pointer font-normal">
              Price: High to Low
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rating" id="rating" />
            <Label htmlFor="rating" className="cursor-pointer font-normal">
              Highest Rated
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
