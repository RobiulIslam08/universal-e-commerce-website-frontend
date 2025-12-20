import { getActiveCarouselSlides } from "@/services/carousel";
import { ICarouselSlide } from "@/types/carousel";
import HeroCarousel from "@/components/home/HeroCarousel";

export default async function DynamicHeroCarousel() {
  let slides: ICarouselSlide[] = [];

  try {
    const res = await getActiveCarouselSlides();
    slides = Array.isArray(res) ? res : res?.data || [];

    // Sort by order
    slides = slides.sort((a, b) => a.order - b.order);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch carousel slides:", error);
    }
  }

  // If no slides from API, HeroCarousel will use its default slides
  return <HeroCarousel apiSlides={slides.length > 0 ? slides : undefined} />;
}
