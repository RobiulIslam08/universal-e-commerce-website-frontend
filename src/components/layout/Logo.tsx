/**
 * Logo Component
 * Reusable logo component for header
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" || pathname === "/en" || pathname === "/bn";

  const sizeClasses = {
    sm: { width: 36, height: 36, text: "text-base" },
    md: { width: 48, height: 48, text: "text-xl" },
    lg: { width: 60, height: 60, text: "text-2xl" },
  };

  const { width, height, text } = sizeClasses[size];

  // Home page এ main-logo.png (white/light), অন্য pages এ logo1.png (black)
  const logoSrc = isHomePage ? "/main-logo.png" : "/logo1.png";

  return (
    <div className="flex items-center gap-2">
      <Link href="/">
        <Image
          src={logoSrc}
          alt="Universel website logo"
          width={width}
          height={height}
          className="object-contain"
          priority
        />
      </Link>
      {showText && (
        <Link
          href="/"
          className={`${text} font-black italic tracking-tighter uppercase leading-none hover:opacity-80 transition-all duration-300 ${
            isHomePage ? "text-white" : "text-slate-900"
          }`}
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Universel
          <span className="text-rose-500 not-italic">.</span>
        </Link>
      )}
    </div>
  );
}
