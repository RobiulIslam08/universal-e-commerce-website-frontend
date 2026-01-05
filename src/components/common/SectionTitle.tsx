import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-2">
        <div className="h-[3px] w-12 bg-linear-to-r from-transparent to-rose-500"></div>
        <div className="h-[3px] w-16 bg-rose-500 rounded-full"></div>
        <div className="h-[3px] w-12 bg-linear-to-l from-transparent to-rose-500"></div>
      </div>
      {subtitle && (
        <p className="text-gray-600 mt-3 text-sm sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}
