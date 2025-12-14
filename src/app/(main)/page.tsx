// Home page - Display all products from all categories

"use client";
import HeroCarousel from "@/components/home/HeroCarousel";
// import ProductCard from "@/components/common/ProductCard";
// import { products, categories } from "@/constants/products";
// import { Badge } from "@/components/ui/badge";
import MyProduct from "./components/MyProduct";

export default function Home() {
  return (
    <div className="w-full bg-linear-to-b from-gray-50 to-gray-100 min-h-screen">
      <HeroCarousel />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-20 md:-mt-16 relative z-10 space-y-12 pb-16">
       

        {/* My Added Product */}
        <MyProduct />
       

       
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
