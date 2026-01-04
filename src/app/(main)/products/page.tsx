import { getAllProducts } from "@/services/product";
import ProductCard from "@/components/common/ProductCard";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

// Force dynamic rendering for search functionality
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    searchTerm?: string;
    category?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { searchTerm } = await searchParams;

  return {
    title: searchTerm
      ? `Search: "${searchTerm}" | Universel E-Commerce`
      : "All Products | Universel E-Commerce",
    description: searchTerm
      ? `Find products matching "${searchTerm}"`
      : "Browse our entire collection of products",
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const { searchTerm, category, page } = await searchParams;

  // Build query string for backend
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("searchTerm", searchTerm);
  
  if (category) queryParams.append("category", category);
  if (page) queryParams.append("page", page);

  // Fetch products from backend
  const res = await getAllProducts(queryParams.toString());
  const products: IProduct[] = res?.data || [];
  console.log(products)
  const meta = res?.meta;
 

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-rose-500 transition">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 dark:text-gray-200">
              {searchTerm ? `Search Results` : "All Products"}
            </span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
            {searchTerm ? (
              <>
                Search results for {" "}
                <span className="text-rose-500">&quot;{searchTerm}&quot;</span>
              </>
            ) : (
              "All Products"
            )}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {meta?.total || products.length}{" "}
            {(meta?.total || products.length) === 1 ? "product" : "products"}{" "}
            found
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              No products found
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm
                ? `We couldn't find any products matching "${searchTerm}"`
                : "No products available at the moment"}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id || product.slug}
                  slug={product.slug}
                  _id={product._id}
                  title={product.title}
                  price={`$${product.price}`}
                  strike={
                    product.strikePrice ? `$${product.strikePrice}` : undefined
                  }
                  badge={product.badge}
                  product={product}
                  image={
                    product.images?.[0] || product.image ? (
                      <Image
                        src={product.images?.[0] || product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )
                  }
                />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPage > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/products?${new URLSearchParams({
                        ...(searchTerm && { searchTerm }),
                        ...(category && { category }),
                        page: pageNum.toString(),
                      }).toString()}`}
                      className={`px-4 py-2 rounded-lg transition ${
                        pageNum === meta.page
                          ? "bg-rose-500 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
