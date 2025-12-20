"use client";

import { ICarouselSlide } from "@/types/carousel";
import Image from "next/image";

interface SlidePreviewProps {
  slide: ICarouselSlide;
}

export default function SlidePreview({ slide }: SlidePreviewProps) {
  return (
    <div
      className={`relative w-full h-32 sm:h-40 rounded-lg overflow-hidden ${slide.bgColor}`}
    >
      {slide.image && (
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover opacity-50 mix-blend-overlay"
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white drop-shadow-lg px-4">
          <h3 className="text-lg sm:text-xl font-bold truncate max-w-xs">
            {slide.title}
          </h3>
          <p className="text-sm sm:text-base truncate max-w-xs">
            {slide.subtitle}
          </p>
          <div className="mt-2 inline-block bg-white text-gray-900 rounded-lg px-3 py-1.5 shadow-lg">
            <div className="text-sm sm:text-base font-bold text-rose-600">
              {slide.badge}
            </div>
            <div className="text-xs text-gray-600">{slide.badgeSubtext}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
