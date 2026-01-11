

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
    <div className={`text-center mb-12 ${className}`}>
      {/* --- Modern Title Design --- */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
        <span className="bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white">
          {title}
        </span>
      </h2>

      {/* --- Animated Divider --- */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div className="h-0.5 w-8 sm:w-16 bg-linear-to-r from-transparent to-rose-500 opacity-50"></div>
        <div className="h-2 w-2 bg-rose-500 rounded-full animate-pulse"></div>
        <div className="h-0.5 w-8 sm:w-16 bg-linear-to-l from-transparent to-rose-500 opacity-50"></div>
      </div>

      {/* --- Subtitle --- */}
      {subtitle && (
        <p className="text-slate-500 dark:text-slate-400 mt-5 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
