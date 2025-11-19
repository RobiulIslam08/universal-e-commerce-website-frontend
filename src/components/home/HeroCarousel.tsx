"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultSlides = [
  {
    bg: "bg-gradient-to-r from-blue-400 to-blue-600",
    title: "Welcome to Universal.sa",
    subtitle: "Shop now and get",
    badge: "20% OFF + SAR 30",
    badgeSubtext: "on First order*",
  },
  {
    bg: "bg-gradient-to-r from-purple-400 to-purple-600",
    title: "Free Delivery",
    subtitle: "on First order*",
    badge: "Limited Time",
    badgeSubtext: "Sign up today",
  },
  {
    bg: "bg-gradient-to-r from-rose-400 to-rose-600",
    title: "Super Sale",
    subtitle: "Up to 50% OFF",
    badge: "Shop Now",
    badgeSubtext: "Deals expire soon",
  },
];

export default function HeroCarousel({
  slides = defaultSlides,
}: {
  slides?: typeof defaultSlides;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((s) => (s + 1) % slides.length),
      5000
    );
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden shadow-2xl">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            current === i ? "opacity-100 scale-100" : "opacity-0 scale-105"
          } ${slide.bg}`}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-white drop-shadow-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-3 sm:mb-5 tracking-tight">
                {slide.title}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 font-medium">
                {slide.subtitle}
              </p>
              <div className="inline-block bg-white text-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-rose-600">
                  {slide.badge}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-gray-600 mt-2">
                  {slide.badgeSubtext}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={() =>
          setCurrent((c) => (c - 1 + slides.length) % slides.length)
        }
        variant="secondary"
        size="icon"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-full shadow-2xl z-10 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        variant="secondary"
        size="icon"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 rounded-full shadow-2xl z-10 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition ${
              current === idx ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
