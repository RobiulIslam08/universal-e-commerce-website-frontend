"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRootCategories } from "@/services/category";
import { ICategoryWithCount } from "@/types/category";

interface CategoryNavigationProps {
  isHomePage?: boolean;
}

export default function CategoryNavigation({
  isHomePage = false,
}: CategoryNavigationProps) {
  const [categories, setCategories] = useState<ICategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getRootCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-10 w-20 animate-pulse rounded ${
              isHomePage ? "bg-white/20" : "bg-muted"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <ul className="flex items-center gap-0.5">
      {categories.map((category) => (
        <li key={category._id}>
          <Link
            href={`/category/${category.slug}`}
            className={`px-5 py-3.5 transition-all duration-200 text-sm font-semibold whitespace-nowrap block relative group ${
              isHomePage
                ? "text-white hover:bg-white/20 active:bg-white/30"
                : "text-gray-700 hover:text-rose-600 hover:bg-rose-50"
            }`}
          >
            {category.name}
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                isHomePage ? "bg-white" : "bg-rose-600"
              }`}
            ></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
