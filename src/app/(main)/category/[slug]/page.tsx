import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/services/category";
import { IProduct } from "@/types/product";
import Image from "next/image";
import ProductCard from "@/components/common/ProductCard";
import FilterSidebar from "@/components/category/FilterSidebar";
// import BestSellersSidebar from "@/components/category/BestSellersSidebar";
import Pagination from "@/components/category/Pagination";
import { Package, AlertCircle } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    subCategory?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
    searchTerm?: string;
  }>;
};

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | Universal E-Commerce",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${category.name} | Universal E-Commerce`,
    description:
      category.description ||
      `Browse our collection of ${category.name} products`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;

  // Fetch category details with subcategories
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Build query string for products API
  const queryParams = new URLSearchParams();

  // Always filter by category slug
  if (filters.subCategory) {
    // If subcategory is selected, fetch products from that subcategory
    queryParams.set("subCategory", filters.subCategory);
  } else {
    // Otherwise, fetch all products from this category
    queryParams.set("category", slug);
  }

  if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
  if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
  if (filters.searchTerm) queryParams.set("searchTerm", filters.searchTerm);

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

  // Fetch products
  const productsResponse = await fetch(
    `${API_URL}/products?${queryParams.toString()}`,
    {
      next: { revalidate: 60 }, // Cache for 1 minute
    }
  );

  let products: IProduct[] = [];
  let meta = {
    page: 1,
    limit: 12,
    total: 0,
    totalPage: 0,
  };

  if (productsResponse.ok) {
    const data = await productsResponse.json();
    products = data.data || [];
    meta = data.meta || meta;
  }

  // Fetch best seller products
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
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <FilterSidebar category={category} />
          {/* <BestSellersSidebar products={bestSellers} /> */}
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {filters.subCategory
                    ? category.subCategories?.find(
                        (sub) => sub.slug === filters.subCategory
                      )?.name || category.name
                    : category.name}
                </h1>
                {category.description && (
                  <p className="text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

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
              <p className="text-muted-foreground max-w-md">
                {filters.searchTerm
                  ? `We couldn't find any products matching "${filters.searchTerm}". Try adjusting your search or filters.`
                  : "There are currently no products in this category. Please check back later."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id || product.slug}
                    product={product}
                    _id={product._id}
                    slug={product.slug}
                    title={product.title}
                    price={`$${product.price}`}
                    strike={
                      product.strikePrice && product.strikePrice > product.price
                        ? `$${product.strikePrice}`
                        : undefined
                    }
                    badge={product.badge}
                    image={
                      product.image || (product.images && product.images[0]) ? (
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
        </main>
      </div>
    </div>
  );
}
