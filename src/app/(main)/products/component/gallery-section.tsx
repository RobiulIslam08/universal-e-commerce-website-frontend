"use client";
import { useState, useRef } from "react";
import { TrendingUp, Users, ZoomIn, X } from "lucide-react";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Mobile zoom modal state
  const [isMobileZoomOpen, setIsMobileZoomOpen] = useState(false);
  const [mobileZoomPosition, setMobileZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  // Magnifier settings
  const ZOOM_LEVEL = 1.8;
  const LENS_SIZE = 120;

  // Safety check: return early if images array is empty or undefined
  if (!images || images.length === 0) {
    return (
      <div className="sticky top-20 flex items-center justify-center h-96 bg-gray-100 rounded-3xl">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Mobile touch handlers for zoom modal
  const handleMobileImageClick = () => {
    setIsMobileZoomOpen(true);
    setMobileZoomPosition({ x: 50, y: 50 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!e.currentTarget) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    setMobileZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const closeMobileZoom = () => {
    setIsMobileZoomOpen(false);
  };

  return (
    <div className="sticky top-2 md:top-5 lg:top-24">
      {/* Main Product Container */}
      <div className="relative">
        {/* Simple Product Image Container */}
        <div className="relative w-full h-80 sm:h-[400px] lg:h-[500px] bg-white dark:bg-slate-900 rounded-lg   overflow-hidden">
          {/* Main Product Image with Magnifier - Desktop */}
          <div
            ref={imageContainerRef}
            className="hidden lg:flex items-center justify-center h-full relative cursor-crosshair"
            onMouseMove={handleImageMouseMove}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
          >
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <Image
                src={images[activeImage]}
                alt="Product"
                fill
                className="object-contain p-2"
                unoptimized={
                  images[activeImage]?.startsWith("data:") ||
                  images[activeImage]?.startsWith("blob:")
                }
              />
            </div>

            {/* Magnifier Lens (shows on image hover) - Desktop only */}
            {isHovered && (
              <div
                className="absolute pointer-events-none border-2 border-rose-500/50 bg-white/10 rounded-full shadow-lg z-10"
                style={{
                  width: LENS_SIZE,
                  height: LENS_SIZE,
                  left: lensPosition.x,
                  top: lensPosition.y,
                  boxShadow: "0 0 0 3px rgba(244, 63, 94, 0.2)",
                }}
              />
            )}
          </div>

          {/* Mobile Image - Tap to zoom */}
          <div
            className="flex lg:hidden items-center justify-center h-full relative cursor-pointer"
            onClick={handleMobileImageClick}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={images[activeImage]}
                alt="Product"
                fill
                className="object-contain"
                unoptimized={
                  images[activeImage]?.startsWith("data:") ||
                  images[activeImage]?.startsWith("blob:")
                }
              />
            </div>

            {/* Tap to zoom indicator */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-xs rounded">
              <ZoomIn className="w-3 h-3" />
              <span>Tap to zoom</span>
            </div>
          </div>
        </div>

        {/* Zoomed Image Preview (appears on right side - Desktop only) */}
        {isHovered && (
          <div
            className="absolute left-[calc(100%+16px)] top-0 w-[450px] h-[450px] bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 hidden lg:block"
            style={{
              backgroundImage: `url(${images[activeImage]})`,
              backgroundSize: `${ZOOM_LEVEL * 100}%`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Zoom level indicator */}
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
              {ZOOM_LEVEL}x
            </div>
          </div>
        )}

        {/* Mobile Zoom Modal */}
        {isMobileZoomOpen && (
          <div className="fixed inset-0 z-9999 bg-black/95 lg:hidden flex flex-col">
            {/* Close button - Fixed at top with higher visibility */}
            <div className="flex justify-between items-center p-4 pt-6 bg-linear-to-b from-black/80 to-black/50 shadow-lg">
              <div className="flex flex-col gap-1">
                <span className="text-white text-base font-medium">
                  Touch & drag to explore
                </span>
                <span className="text-white/70 text-xs">Pinch to zoom</span>
              </div>
              <button
                onClick={closeMobileZoom}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all shadow-lg border border-white/30"
                aria-label="Close zoom"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Zoomed image area */}
            <div
              className="flex-1 overflow-hidden touch-none"
              onTouchMove={handleTouchMove}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${images[activeImage]})`,
                  backgroundSize: `${ZOOM_LEVEL * 100}%`,
                  backgroundPosition: `${mobileZoomPosition.x}% ${mobileZoomPosition.y}%`,
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>

            {/* Thumbnail selector in modal */}
            <div className="p-3 bg-black/50">
              <div className="flex gap-2 justify-center overflow-x-auto">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-14 h-14 shrink-0 rounded-lg overflow-hidden transition-all ${
                      activeImage === index
                        ? "ring-2 ring-rose-500"
                        : "ring-1 ring-white/30 opacity-60"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-contain bg-white/10 p-1"
                      unoptimized={
                        img?.startsWith("data:") || img?.startsWith("blob:")
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image Thumbnails Grid */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {images.map((img: string, index: number) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden transition-all border ${
                activeImage === index
                  ? "border-rose-500 scale-105"
                  : "border-slate-200 dark:border-slate-700 hover:border-rose-400 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800">
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
            </button>
          ))}
        </div>

        {/* Social Proof */}
        {(soldCount > 0 || isTrending) && (
          <div className="mt-4 flex items-center justify-center gap-3">
            {soldCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  {soldCount >= 1000
                    ? `${(soldCount / 1000).toFixed(1)}K+`
                    : soldCount}{" "}
                  Sold
                </span>
              </div>
            )}
            {isTrending && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-900 dark:text-green-300">
                  Trending
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
