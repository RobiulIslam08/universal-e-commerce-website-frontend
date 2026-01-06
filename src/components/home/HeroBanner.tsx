"use client"

import Image from "next/image"
import Link from "next/link" // লিংক ব্যবহারের জন্য ইম্পোর্ট করা হলো
import { useState, useEffect } from "react"

interface HeroBannerProps {
  title: string
  subtitle?: string
  image: string
  height?: "small" | "medium" | "large"
  // বাটনগুলোর জন্য নতুন প্রপস
  primaryButtonText?: string
  primaryButtonLink?: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export function HeroBanner({
  title,
  subtitle,
  image,
  height = "large",
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: HeroBannerProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const heightClasses = {
    small: "h-64 md:h-80",
    medium: "h-80 md:h-96",
    large: "h-96 md:h-[500px] lg:h-[700px]",
  }

  return (
    <div className={`relative w-full overflow-hidden ${heightClasses[height]}`}>
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay with a slight gradient to make text pop on the left */}
        <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full container mx-auto flex flex-col justify-center px-4 mt-14 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl text-left text-white">
          
          {/* Title */}
          <h1 className="text-3xl  sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 mb-8 max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Buttons Area */}
          <div className="flex flex-wrap gap-4">
            {/* Primary Button (Solid White) */}
            {primaryButtonText && primaryButtonLink && (
              <Link
                href={primaryButtonLink}
                className="px-8 py-3 bg-white text-gray-900 text-sm md:text-base font-bold uppercase tracking-wide hover:bg-gray-200 transition-colors duration-200"
              >
                {primaryButtonText}
              </Link>
            )}

            {/* Secondary Button (Transparent with Border) */}
            {secondaryButtonText && secondaryButtonLink && (
              <Link
                href={secondaryButtonLink}
                className="px-8 py-3 bg-transparent border-2 border-white text-white text-sm md:text-base font-bold uppercase tracking-wide hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}