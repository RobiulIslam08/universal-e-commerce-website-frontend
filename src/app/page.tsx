// Home page - Display all products from all categories

"use client";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProductCard from "@/components/common/ProductCard";
import { products, categories } from "@/constants/products";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="w-full bg-linear-to-b from-gray-50 to-gray-100 min-h-screen">
      <HeroCarousel />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-20 md:-mt-16 relative z-10 space-y-12 pb-16">
        {/* Categories Quick Links */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-center p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <p className="text-xs font-semibold text-gray-800 text-center">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* All Products Grid */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Our Products
            </h2>
            <Badge className="bg-rose-600 text-white text-sm px-4 py-2">
              {products.length} Products
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                image={product.image}
                title={product.title}
                price={`SAR ${product.price}`}
                strike={
                  product.strikePrice ? `SAR ${product.strikePrice}` : undefined
                }
                badge={product.badge}
              />
            ))}
          </div>
        </div>

        {/* Featured Categories with Products */}
        {categories.slice(0, 4).map((category) => {
          const categoryProducts = products.filter(
            (p) => p.category === category.slug
          );
          if (categoryProducts.length === 0) return null;

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.name}
                </h2>
                <Badge className="bg-blue-600 text-white">
                  {categoryProducts.length} items
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {categoryProducts.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    image={product.image}
                    title={product.title}
                    price={`SAR ${product.price}`}
                    strike={
                      product.strikePrice
                        ? `SAR ${product.strikePrice}`
                        : undefined
                    }
                    badge={product.badge}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
