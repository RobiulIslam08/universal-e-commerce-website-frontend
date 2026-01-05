// Home page - Display all products from all categories

import DynamicHeroCarousel from "@/components/home/DynamicHeroCarousel";

import ElectronicsSection from "@/components/home/ElectronicsSection";
import MenSection from "@/components/home/MenSection";
import WomenSection from "@/components/home/WomenSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default async function Home() {
  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <DynamicHeroCarousel />

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
