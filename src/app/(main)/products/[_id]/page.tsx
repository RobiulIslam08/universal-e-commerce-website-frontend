import { notFound } from "next/navigation";
// import { getProductByslug } from "@/lib/data";
import GallerySection from "../component/gallery-section";
import DetailsSection from "../component/details-section";
import ProductContent from "../component/ProductContent";

import { getSingleProduct } from "@/services/product";
import { getReviewsByProductId } from "@/services/review";

// Type for params
type Props = {
  params: Promise<{ _id: string }>; // ✅ Now params is a Promise
};

// Metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { _id } = await params; // ✅ Await params
  const res = await getSingleProduct(_id);
  const product = res?.data;

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
    };
  }

  return {
    title: `${product.title} | Luxe Market`,
    description: product.shortDescription || product.longDescription || "",
    openGraph: {
      title: product.title,
      description: product.shortDescription || product.longDescription || "",
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

// Main Page Component
export default async function ProductPage({ params }: Props) {
  const { _id } = await params; // ✅ Await params

  const res = await getSingleProduct(_id);
  console.log("API Response structure:", {
    hasData: !!res?.data,
    hasSuccess: "success" in (res || {}),
    keys: Object.keys(res || {}),
  });

  const product = res?.data;

  if (!product) {
    console.error("⚠️ Product not found for ID:", _id);
    console.error(
      "Backend URL being used:",
      process.env.NEXT_PUBLIC_BACKEND_URL
    );
    notFound();
  }

  // Fetch reviews for this product
  const reviewsRes = await getReviewsByProductId(_id);
  const reviewsData = reviewsRes?.data;

  // Ensure required fields exist
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : [];

  const productData = {
    ...product,
    specifications,
    shippingAndReturns: product.shippingAndReturns || {
      shippingWeight: "N/A",
      deliveryTime: "N/A",
      returnPolicy: "N/A",
    },
    warranty: product.warranty || {
      duration: "N/A",
      coverage: "N/A",
    },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-rose-50 via-background to-background dark:from-rose-950/30 dark:via-background dark:to-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left: Visual Experience */}
          <GallerySection images={productImages} badge={product.badge} />

          {/* Right: Smart Details & Actions */}
          <DetailsSection product={productData} />
        </div>

        {/* Product Details Tabs & Reviews Section */}
        <ProductContent
          product={productData}
          productId={_id}
          initialReviewsData={reviewsData}
        />
      </div>
    </main>
  );
}

// ✅ Generate static params from API
export async function generateStaticParams() {
  try {
    const { getAllProducts } = await import("@/services/product");
    const res = await getAllProducts();

    if (res?.data && Array.isArray(res.data)) {
      return res.data
        .filter((product: { _id: string }) => product._id)
        .map((product: { _id: string }) => ({
          _id: product._id,
        }));
    }
  } catch (error) {
    console.error("Failed to generate static params:", error);
  }

  // Return empty array if API fails
  return [];
}
