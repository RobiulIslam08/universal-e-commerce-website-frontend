import { getAllProducts } from "@/services/product";
import ProductCard from "@/components/common/ProductCard";
import { IProduct } from "@/types/product";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categoryName = decodeURIComponent(slug).replace(/-/g, " ");

  return {
    title: `${
      categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    } | Universal E-Commerce`,
    description: `Browse our collection of ${categoryName}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch products for this category
  // Assuming the backend accepts 'category' query param matching the slug or name
  const res = await getAllProducts(`category=${decodedSlug}`);
  const products: IProduct[] = res?.data || [];

  const categoryName = decodedSlug.replace(/-/g, " ");

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold capitalize mb-2">{categoryName}</h1>
        <p className="text-gray-500">
          Found {products.length} products in {categoryName}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">No products found</h2>
          <p className="text-gray-500">
            We couldn&apos;t find any products in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              title={product.title}
              price={`$${product.price}`}
              strike={
                product.strikePrice ? `$${product.strikePrice}` : undefined
              }
              badge={product.badge}
              image={
                product.image ? (
                  <Image
                    src={product.image}
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
      )}
    </div>
  );
}
