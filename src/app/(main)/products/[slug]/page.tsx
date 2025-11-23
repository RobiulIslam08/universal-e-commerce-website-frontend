import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data"; 
import GallerySection from "../component/gallery-section";
import DetailsSection from "../component/details-section";
import SmartSpecs from "../component/smart-specs";
import Link from "next/link";

// Type for params
type Props = {
  params: Promise<{ slug: string }>; // ✅ Now params is a Promise
};

// Metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { slug } = await params; // ✅ Await params
  const product = getProductBySlug(slug);
  
  if (!product) {
    return { 
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist."
    };
  }
  
  return {
    title: `${product.title} | Luxe Market`,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

// Main Page Component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params; // ✅ Await params
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-rose-50 via-background to-background dark:from-rose-950/30 dark:via-background dark:to-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground/80 animate-fade-in capitalize">
        <Link href="/">          <span className="hover:text-rose-600 transition-colors cursor-pointer">Home</span>
</Link>
          <span className="mx-2">/</span>
          <span className="hover:text-rose-600 transition-colors cursor-pointer">
            {product?.category}
          </span>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">
            {product?.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
          {/* Left: Visual Experience */}
          <GallerySection images={[product.image]} badge={product.badge} />

          {/* Right: Smart Details & Actions */}
          <div className="space-y-10">
            <DetailsSection product={product} />
            
            {/* Smart Accordion for Specs/Shipping */}
            <div className="pt-6 border-t border-rose-100 dark:border-rose-900/50">
              <SmartSpecs product={product} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ✅ Optional: Generate static params for better performance
export async function generateStaticParams() {
  const { products } = await import("@/constants/products");
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}