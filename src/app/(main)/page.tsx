// Home page - Display all products from all categories


import ElectronicsSection from "@/components/home/ElectronicsSection";
import MenSection from "@/components/home/MenSection";
import WomenSection from "@/components/home/WomenSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { HeroBanner } from "@/components/home/HeroBanner";

export default async function Home() {
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      {/* <DynamicHeroCarousel /> */}

      <HeroBanner title="Raining Offers For Hot Summer!" subtitle="25% Off On All Products" image="https://websitedemos.net/brandstore-02/wp-content/uploads/sites/150/2019/12/home-new-bg-free-img.jpg"
      primaryButtonText="SHOP NOW"
  primaryButtonLink="/products"
  secondaryButtonText="FIND MORE"
  secondaryButtonLink="/"
      />

         {/* Featured  Products */}
      <div className="w-full bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FeaturedProducts />
        </div>
      </div>

      {/* Electronics Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ElectronicsSection />
      </div>

      {/* Men's Collection */}
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <MenSection />
        </div>
      </div>

      {/* Women's Collection */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <WomenSection />
      </div>

   

      {/* Why Choose Us */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <WhyChooseUs />
      </div>

      {/* Customer Testimonials */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Testimonials />
      </div>

      {/* Newsletter Section */}
      {/* <NewsletterSection /> */}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
