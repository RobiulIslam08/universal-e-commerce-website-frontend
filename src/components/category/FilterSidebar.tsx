"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ICategoryWithCount } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Filter, Minus, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
  category: ICategoryWithCount;
}

export default function FilterSidebar({ category }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Logic Remains 100% Same ---
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || ""
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ]);

  const currentSubCategory = searchParams.get("subCategory");

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSubCategoryChange = (subCategorySlug: string) => {
    if (subCategorySlug === "all") {
      updateSearchParams({ subCategory: null });
    } else {
      updateSearchParams({ subCategory: subCategorySlug });
    }
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
    router.push(`/category/${category.slug}`);
  };

  const hasActiveFilters = searchParams.toString() !== "";

  // --- Updated Design Structure ---
  return (
    <aside className="w-full h-fit bg-white border p-4 lg:w-72 sticky top-20 self-start">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Showing {category.productCount} results in {category.name}
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2"
          >
            Clear All
          </Button>
        )}
      </div>

      <Separator className="mb-4" />

      {/* Search Input - Always Visible */}
      <div className="mb-6">
        <form onSubmit={handleSearchSubmit} className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-10 h-10 bg-muted/30 border-transparent focus:bg-background focus:border-input transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
            aria-label="Search"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Collapsible Filters Section */}
      <Accordion
        type="multiple"
        defaultValue={["categories", "price", "sort"]}
        className="space-y-4"
      >
        {/* 1. Subcategories */}
        {category.subCategories && category.subCategories.length > 0 && (
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-2 hover:no-underline text-sm font-semibold">
              Categories
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={currentSubCategory || "all"}
                onValueChange={handleSubCategoryChange}
                className="mt-2 space-y-1"
              >
                {/* All Option */}
                <Label
                  className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer transition-colors text-sm ${
                    !currentSubCategory || currentSubCategory === "all"
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="all" id="all" className="hidden" />
                    <span>All Products</span>
                  </div>
                  <span className="text-xs opacity-70">
                    {category.productCount}
                  </span>
                </Label>

                {/* Subcategory List */}
                {category.subCategories.map((subCat) => (
                  <Label
                    key={subCat.slug}
                    className={`flex items-center justify-between px-2 py-2 rounded-md cursor-pointer transition-colors text-sm ${
                      currentSubCategory === subCat.slug
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value={subCat.slug}
                        id={subCat.slug}
                        className="hidden"
                      />
                      <span>{subCat.name}</span>
                    </div>
                    <span className="text-xs opacity-70">
                      {subCat.productCount}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 2. Price Range */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline text-sm font-semibold">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              max={10000}
              step={100}
              className="mb-6"
            />
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="pl-8 h-9 text-sm"
                />
              </div>
              <Minus className="w-3 h-3 text-muted-foreground" />
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  $
                </span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>
            <Button
              onClick={handlePriceFilter}
              className="w-full h-9 text-xs font-medium"
              variant="secondary"
            >
              Apply Filter
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* 3. Sort Options */}
        <AccordionItem value="sort" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline text-sm font-semibold">
            Sort By
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={searchParams.get("sortBy") || "createdAt"}
              onValueChange={(value) => updateSearchParams({ sortBy: value })}
              className="space-y-2 mt-2"
            >
              {[
                // { id: "createdAt", label: "Newest Arrivals" },
                { id: "price-asc", label: "Price: Low to High" },
                { id: "price-desc", label: "Price: High to Low" },
                // { id: "rating", label: "Top Rated" },
              ].map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="text-sm font-normal cursor-pointer text-muted-foreground peer-aria-checked:text-foreground peer-aria-checked:font-medium"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
