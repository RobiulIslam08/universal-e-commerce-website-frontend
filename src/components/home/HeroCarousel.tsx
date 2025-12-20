"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ICarouselSlide } from "@/types/carousel";

interface Slide {
  bg: string;
  image?: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeSubtext: string;
  buttonText?: string;
  buttonLink?: string;
}

const defaultSlides: Slide[] = [
  {
    bg: "bg-linear-to-r from-blue-400 to-blue-600",
    title: "Welcome to Universal.sa",
    subtitle: "Shop now and get",
    badge: "20% OFF + SAR 30",
    badgeSubtext: "on First order*",
  },
  {
    bg: "bg-linear-to-r from-purple-400 to-purple-600",
    title: "Free Delivery",
    subtitle: "on First order*",
    badge: "Limited Time",
    badgeSubtext: "Sign up today",
  },
  {
    bg: "bg-linear-to-r from-rose-400 to-rose-600",
    title: "Super Sale",
    subtitle: "Up to 50% OFF",
    badge: "Shop Now",
    badgeSubtext: "Deals expire soon",
  },
];

// Convert API carousel slides to component format
const convertToSlides = (apiSlides: ICarouselSlide[]): Slide[] => {
  return apiSlides.map((slide) => ({
    bg: slide.bgColor,
    image: slide.image,
    title: slide.title,
    subtitle: slide.subtitle,
    badge: slide.badge,
    badgeSubtext: slide.badgeSubtext,
    buttonText: slide.buttonText,
    buttonLink: slide.buttonLink,
  }));
};

interface HeroCarouselProps {
  slides?: Slide[];
  apiSlides?: ICarouselSlide[];
}

export default function HeroCarousel({
  slides: propSlides,
  apiSlides,
}: HeroCarouselProps) {
  // Use API slides if provided, otherwise use prop slides or defaults
  const slides = apiSlides
    ? convertToSlides(apiSlides)
    : propSlides || defaultSlides;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional Carousel"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${slides[current].bg}`}
        >
          {slides[current].image && (
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover opacity-50 mix-blend-overlay"
              priority={current === 0}
            />
          )}
          <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
            <div className="text-center text-white drop-shadow-2xl">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-3 sm:mb-5 tracking-tight"
              >
                {slides[current].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8 font-medium"
              >
                {slides[current].subtitle}
              </motion.p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-block bg-white text-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 transform hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-rose-600">
                  {slides[current].badge}
                </div>
                <div className="text-sm sm:text-base md:text-lg text-gray-600 mt-2">
                  {slides[current].badgeSubtext}
                </div>
              </motion.div>

              {/* CTA Button */}
              {slides[current].buttonText && slides[current].buttonLink && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <Link href={slides[current].buttonLink || "#"}>
                    <Button
                      size="lg"
                      className="bg-white text-rose-600 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {slides[current].buttonText}
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        onClick={prevSlide}
        variant="secondary"
        size="icon"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 rounded-full shadow-2xl z-10 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        onClick={nextSlide}
        variant="secondary"
        size="icon"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 rounded-full shadow-2xl z-10 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              current === idx
                ? "bg-white w-6 sm:w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={current === idx ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}
