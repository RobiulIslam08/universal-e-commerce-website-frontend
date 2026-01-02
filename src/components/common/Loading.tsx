import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white dark:bg-slate-900">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        
        {/* Inner Spinning Ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-rose-600 rounded-full border-t-transparent animate-spin"></div>
        
        {/* Optional: Brand Icon in Middle */}
        {/* <div className="absolute">
           <YourLogo className="w-6 h-6 text-rose-600" />
        </div> */}
      </div>
      
      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        Loading products...
      </p>
    </div>
  );
}