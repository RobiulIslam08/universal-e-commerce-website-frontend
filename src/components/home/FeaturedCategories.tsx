"use client";

import React from "react";
import Link from "next/link";
import SectionTitle from "@/components/common/SectionTitle";
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  ShoppingBag,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: Smartphone,
    color: "from-blue-500 to-blue-600",
    items: "2,340+",
  },
  {
    id: 2,
    name: "Computers",
    icon: Laptop,
    color: "from-purple-500 to-purple-600",
    items: "1,850+",
  },
  {
    id: 3,
    name: "Audio",
    icon: Headphones,
    color: "from-pink-500 to-pink-600",
    items: "980+",
  },
  {
    id: 4,
    name: "Watches",
    icon: Watch,
    color: "from-green-500 to-green-600",
    items: "1,240+",
  },
  {
    id: 5,
    name: "Cameras",
    icon: Camera,
    color: "from-orange-500 to-orange-600",
    items: "760+",
  },
  {
    id: 6,
    name: "Fashion",
    icon: ShoppingBag,
    color: "from-red-500 to-red-600",
    items: "3,120+",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12">
      <SectionTitle
        title="Shop by Category"
        subtitle="Browse through your favorite categories"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Link
              key={category.id}
              href={`/category/${category.name.toLowerCase()}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-center font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-center text-sm text-gray-500">
                  {category.items} items
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
