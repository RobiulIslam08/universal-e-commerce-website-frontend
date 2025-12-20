import { getAllCarouselSlides } from "@/services/carousel";
import { ICarouselSlide } from "@/types/carousel";
import CarouselClient from "./components/carousel-client";

export default async function CarouselManagement() {
  const res = await getAllCarouselSlides();
  const slides: ICarouselSlide[] = Array.isArray(res) ? res : res?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground text-balance">
            🎠 Carousel Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your homepage hero carousel slides
          </p>
        </div>
      </div>

      <CarouselClient initialSlides={slides} />
    </div>
  );
}
