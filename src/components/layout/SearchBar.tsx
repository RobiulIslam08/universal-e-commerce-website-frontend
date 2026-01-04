/**
 * Search Bar Component
 * Handles product search functionality for both desktop and mobile
 */

"use client";

import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
}

export default function SearchBar({ variant = "desktop" }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" || pathname === "/en" || pathname === "/bn";
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search করার সময় general products page এ নিয়ে যাবে with searchTerm
      router.push(
        `/products?searchTerm=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
    }
  };

  if (variant === "mobile") {
    return (
      <form
        className="sm:hidden px-3 pb-3"
        role="search"
        onSubmit={handleSearch}
      >
        <div className="flex gap-2 items-center">
          <div
            className={`flex-1 flex rounded-lg overflow-hidden ${
              isHomePage
                ? "bg-white/30 backdrop-blur-md border border-white/40"
                : "bg-gray-100 border border-gray-300"
            }`}
          >
            <input
              type="search"
              placeholder="Search Universel"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 px-2 py-2 text-xs outline-none font-medium ${
                isHomePage
                  ? "bg-transparent text-white placeholder-white/90"
                  : "bg-transparent text-gray-900 placeholder-gray-500"
              }`}
              aria-label="Search products"
            />
          </div>
          <button
            type="submit"
            className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-lg transition-colors shadow-md"
            aria-label="Search"
          >
            <Search size={16} aria-hidden="true" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      className="hidden sm:flex flex-1 max-w-2xl mx-2 md:mx-3"
      role="search"
      onSubmit={handleSearch}
    >
      <div
        className={`flex w-full rounded-l-lg overflow-hidden ${
          isHomePage
            ? "bg-white/30 backdrop-blur-md border border-white/40"
            : "bg-gray-100 border border-gray-300"
        }`}
      >
        <input
          type="search"
          placeholder="Search Universel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm outline-none ${
            isHomePage
              ? "bg-transparent text-white placeholder-white/90"
              : "bg-transparent text-gray-900 placeholder-gray-500"
          }`}
          aria-label="Search products"
        />
      </div>
      <button
        type="submit"
        className="bg-rose-500 rounded-r-lg hover:bg-rose-600 text-white px-3 sm:px-4 py-2 transition-colors flex items-center justify-center shrink-0 shadow-md"
        aria-label="Search"
      >
        <Search size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
