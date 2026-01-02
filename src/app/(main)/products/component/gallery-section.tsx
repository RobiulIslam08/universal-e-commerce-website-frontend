"use client";
import { useState, useRef } from "react";
import { TrendingUp, Users } from "lucide-react";
import Image from "next/image";

interface GallerySectionProps {
  images: string[];
  badge?: string;
  soldCount?: number;
  isTrending?: boolean;
}

export default function GallerySection({
  images,

  soldCount = 0,
  isTrending = false,
}: GallerySectionProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Magnifier settings
  const ZOOM_LEVEL = 2.5;
  const LENS_SIZE = 150;

  // Safety check: return early if images array is empty or undefined
  if (!images || images.length === 0) {
    return (
      <div className="sticky top-20 flex items-center justify-center h-96 bg-gray-100 rounded-3xl">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  // Handle magnifier mouse move
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate lens position (centered on cursor)
    const lensX = Math.max(
      0,
      Math.min(x - LENS_SIZE / 2, rect.width - LENS_SIZE)
    );
    const lensY = Math.max(
      0,
      Math.min(y - LENS_SIZE / 2, rect.height - LENS_SIZE)
    );

    setLensPosition({ x: lensX, y: lensY });

    // Calculate zoom position as percentage
    const zoomX = (x / rect.width) * 100;
    const zoomY = (y / rect.height) * 100;
    setZoomPosition({ x: zoomX, y: zoomY });
  };

  const handleImageMouseEnter = () => {
    setIsHovered(true);
  };

  const handleImageMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="sticky top-20">
      {/* Morphing Background Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-rose-500/30 via-purple-500/30 to-blue-500/30 rounded-full blur-3xl transition-transform duration-300"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${
              mousePosition.y * 30
            }px)`,
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-br from-cyan-500/30 via-pink-500/30 to-orange-500/30 rounded-full blur-3xl transition-transform duration-300"
          style={{
            transform: `translate(-${mousePosition.x * 40}px, -${
              mousePosition.y * 40
            }px)`,
            animation: "pulse 4s ease-in-out infinite 1s",
          }}
        />
      </div>

      {/* Main Product Container */}
      <div
        className="relative transition-transform duration-300"
        onMouseMove={handleMouseMove}
      >
        {/* Premium Glass Card */}
        <div className="relative aspect-square bg-linear-to-br from-white/70 via-rose-50/60 to-purple-50/70 dark:from-slate-900/70 dark:via-rose-950/50 dark:to-purple-950/60 backdrop-blur-3xl rounded-sm border overflow-hidden group">
          {/* Main Product Image with Magnifier */}
          <div
            ref={imageContainerRef}
            className="flex items-center justify-center h-full relative cursor-crosshair"
            onMouseMove={handleImageMouseMove}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
          >
            <div className="relative w-full h-full flex items-center justify-center p-8 transition-all duration-700">
              <Image
                src={images[activeImage]}
                alt="Product"
                fill
                className="object-contain filter drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
                unoptimized={
                  images[activeImage]?.startsWith("data:") ||
                  images[activeImage]?.startsWith("blob:")
                }
              />
            </div>

            {/* Magnifier Lens (shows on image hover) */}
            {isHovered && (
              <div
                className="absolute pointer-events-none border-2 border-rose-500/50 bg-white/10 backdrop-blur-sm rounded-full shadow-lg z-10"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensPosition.x,
                  top: lensPosition.y,
                  boxShadow:
                    "0 0 0 3px rgba(244, 63, 94, 0.2), 0 8px 32px rgba(0, 0, 0, 0.15)",
                }}
              />
            )}
          </div>

          {/* Bottom Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-rose-500/20 via-purple-500/10 to-transparent blur-xl pointer-events-none" />
        </div>

        {/* Zoomed Image Preview (appears on right side like Daraz) */}
        {isHovered && (
          <div
            className="absolute left-[calc(100%+16px)] top-0 w-[500px] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 hidden lg:block"
            style={{
              backgroundImage: `url(${images[activeImage]})`,
              backgroundSize: `${ZOOM_LEVEL * 100}%`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Zoom level indicator */}
            <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 text-white text-xs font-medium rounded-full">
              {ZOOM_LEVEL}x Zoom
            </div>
          </div>
        )}

        {/* Image Thumbnails Grid */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {images.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                activeImage === index
                  ? "ring-4 ring-rose-500 shadow-2xl scale-105"
                  : "ring-2 ring-slate-200 dark:ring-slate-800 hover:ring-rose-400 hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`w-full h-full flex items-center justify-center bg-linear-to-br ${
                  activeImage === index
                    ? "from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950"
                    : "from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800"
                } backdrop-blur-xl relative`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-2"
                  unoptimized={
                    img?.startsWith("data:") || img?.startsWith("blob:")
                  }
                />
              </div>

              {activeImage === index && (
                <div
                  className="absolute top-2 right-2 w-3 h-3 bg-linear-to-br from-rose-500 to-pink-600 rounded-full shadow-lg"
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          {soldCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full border border-slate-200 dark:border-slate-800 shadow-lg">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {soldCount >= 1000
                  ? `${(soldCount / 1000).toFixed(1)}K+`
                  : soldCount}
                + Sold
              </span>
            </div>
          )}
          {isTrending && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full border border-slate-200 dark:border-slate-800 shadow-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                #1 Trending
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
