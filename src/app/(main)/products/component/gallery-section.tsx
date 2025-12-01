
"use client";
import { useState } from "react";
import { Heart, Share2, TrendingUp, Users, Flame } from "lucide-react";

interface GallerySectionProps {
  images: string[];
  badge?: string;
  soldCount?: number;
  isTrending?: boolean;
}

export default function GallerySection({
  images,
  badge,
  soldCount = 0,
  isTrending = false,
}: GallerySectionProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateY(${
                (mousePosition.x - 0.5) * 10
              }deg) rotateX(${(mousePosition.y - 0.5) * -10}deg) scale(1.02)`
            : "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)",
        }}
      >
        {/* Premium Glass Card */}
        <div className="relative aspect-square bg-linear-to-br from-white/70 via-rose-50/60 to-purple-50/70 dark:from-slate-900/70 dark:via-rose-950/50 dark:to-purple-950/60 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden group">
          {/* Top Status Bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-20">
            {/* Badge */}
            {badge && (
              <div className="relative">
                <div
                  className="absolute inset-0 bg-linear-to-r from-rose-500 to-pink-600 rounded-full blur-md opacity-70"
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                />
                <div className="relative px-5 py-2.5 bg-linear-to-r from-rose-500 to-pink-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-xl flex items-center gap-2">
                  <Flame
                    className="w-4 h-4"
                    style={{ animation: "bounce 1s ease-in-out infinite" }}
                  />
                  {badge}
                </div>
              </div>
            )}

            {/* Action Icons */}
            <div className="flex gap-2">
              <button className="relative group/btn p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/50 dark:border-slate-700/50">
                <Heart className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover/btn:text-rose-500 transition-all" />
              </button>
              <button className="relative group/btn p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-white/50 dark:border-slate-700/50">
                <Share2 className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover/btn:text-blue-500 transition-all" />
              </button>
            </div>
          </div>

          {/* Main Product Image */}
          <div className="flex items-center justify-center h-full relative">
            <div
              className="relative text-[14rem] sm:text-[18rem] lg:text-[20rem] select-none filter drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-all duration-700"
              style={{
                transform: `scale(${isHovered ? 1.1 : 1}) rotateZ(${
                  isHovered ? 5 : 0
                }deg)`,
                animation: "float 6s ease-in-out infinite",
              }}
            >
              {images[activeImage]}
            </div>
          </div>

          {/* Bottom Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-rose-500/20 via-purple-500/10 to-transparent blur-xl pointer-events-none" />
        </div>

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
                } backdrop-blur-xl`}
              >
                <span className="text-4xl lg:text-5xl">{img}</span>
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
