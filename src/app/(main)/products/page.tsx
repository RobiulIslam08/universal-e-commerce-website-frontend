import { getAllProducts } from "@/services/product";
import ProductCard from "@/components/common/ProductCard";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
// import BestSellersSidebar from "@/components/category/BestSellersSidebar";
import ProductFilterSidebar from "@/components/category/ProductFilterSidebar";
import Pagination from "@/components/category/Pagination";
import { Package, AlertCircle } from "lucide-react";

// Force dynamic rendering for search functionality
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    searchTerm?: string;
    category?: string;
    subCategory?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
};

// const API_URL =  process.env.NEXT_PUBLIC_BACKEND_URL 

export async function generateMetadata({ searchParams }: Props) {
  const { searchTerm, category } = await searchParams;

  return {
    title: searchTerm
      ? `Search: "${searchTerm}" | Universel E-Commerce`
      : category
      ? `${category} Products | Universel E-Commerce`
      : "All Products | Universel E-Commerce",
    description: searchTerm
      ? `Find products matching "${searchTerm}"`
      : "Browse our entire collection of products",
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const filters = await searchParams;

  // Build query string for backend with all filters
  const queryParams = new URLSearchParams();

  if (filters.searchTerm) queryParams.append("searchTerm", filters.searchTerm);
  if (filters.category) queryParams.append("category", filters.category);
  if (filters.subCategory) queryParams.append("category", filters.subCategory);
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);

  // Handle sorting
  if (filters.sortBy) {
    if (filters.sortBy === "price-asc") {
      queryParams.set("sortBy", "price");
      queryParams.set("sortOrder", "asc");
    } else if (filters.sortBy === "price-desc") {
      queryParams.set("sortBy", "price");
      queryParams.set("sortOrder", "desc");
    } else if (filters.sortBy === "rating") {
      queryParams.set("sortBy", "rating");
      queryParams.set("sortOrder", "desc");
    } else {
      queryParams.set("sortBy", filters.sortBy);
      queryParams.set("sortOrder", filters.sortOrder || "desc");
    }
  } else {
    queryParams.set("sortBy", "createdAt");
    queryParams.set("sortOrder", "desc");
  }

  queryParams.set("page", filters.page || "1");
  queryParams.set("limit", filters.limit || "12");

  // Convert URLSearchParams to object
  const query: Record<string, string | number> = {};
  queryParams.forEach((value, key) => {
    query[key] = value;
  });

  // Fetch products from backend
  const res = await getAllProducts(query);
  const products: IProduct[] = res?.data || [];
  const meta = res?.meta || {
    page: 1,
    limit: 12,
    total: 0,
    totalPage: 0,
  };

  // Fetch best sellers
  // const bestSellersResponse = await fetch(
  //   `${API_URL}/products/best-sellers?limit=5`,
  //   {
  //     next: { revalidate: 300 }, // Cache for 5 minutes
  //   }
  // );

  // let bestSellers: IProduct[] = [];
  // if (bestSellersResponse.ok) {
  //   const data = await bestSellersResponse.json();
  //   bestSellers = data.data || [];
  // }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <ProductFilterSidebar title="Search Filters" />
            {/* <BestSellersSidebar products={bestSellers} /> */}
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Breadcrumb & Header */}
            <div className="mb-8">
              <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Link href="/" className="hover:text-rose-500 transition">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800 dark:text-gray-200">
                  {filters.searchTerm ? `Search Results` : "All Products"}
                </span>
              </nav>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {filters.searchTerm ? (
                  <>
                    Search results for{" "}
                    <span className="text-rose-500">
                      &quot;{filters.searchTerm}&quot;
                    </span>
                  </>
                ) : (
                  "All Products"
                )}
              </h1>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {products.length} of {meta.total} products
                </p>

                {filters.searchTerm && (
                  <p className="text-sm text-muted-foreground">
                    Search results for:{" "}
                    <span className="font-semibold">
                      &quot;{filters.searchTerm}&quot;
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-lg">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  {filters.searchTerm ? (
                    <AlertCircle className="w-10 h-10 text-muted-foreground" />
                  ) : (
                    <Package className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                  {filters.searchTerm
                    ? "No results found"
                    : "No products available"}
                </h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  {filters.searchTerm
                    ? `We couldn't find any products matching "${filters.searchTerm}". Try adjusting your search or filters.`
                    : "There are currently no products available. Please check back later."}
                </p>
                <Link
                  href="/"
                  className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition font-medium"
                >
                  Back to Home
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id || product.id || product.slug}
                      slug={product.slug}
                      _id={product._id}
                      title={product.title}
                      price={`$${product.price}`}
                      strike={
                        product.strikePrice &&
                        product.strikePrice > product.price
                          ? `$${product.strikePrice}`
                          : undefined
                      }
                      badge={product.badge}
                      product={product}
                      image={
                        product.image ||
                        (product.images && product.images[0]) ? (
                          <Image
                            src={product.image || product.images[0]}
                            alt={product.title}
                            fill
                            className="object-contain p-4"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination meta={meta} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
