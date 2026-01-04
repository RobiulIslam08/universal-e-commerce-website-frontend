/**
 * Navigation Menu Component
 * Desktop navigation menu with all main links and category dropdown
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION } from "@/constants/navigation";
import CategoryNavigation from "@/components/category/CategoryNavigation";

export default function NavigationMenu() {
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" || pathname === "/en" || pathname === "/bn";

  return (
    <nav
      className={`hidden lg:block shadow-sm transition-all duration-300 ${
        isHomePage
          ? "bg-rose-800/50 backdrop-blur-lg border-b border-white/20"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="w-full px-6">
        <div className="flex items-center justify-between">
          {/* Category Navigation - Left Side with Scroll */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <div className={`${isHomePage ? "text-white" : "text-gray-700"}`}>
              <CategoryNavigation isHomePage={isHomePage} />
            </div>
          </div>

          {/* Main Navigation Links - Right Side */}
          <ul className="flex items-center gap-0.5 ml-4">
            {MAIN_NAVIGATION.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`px-5 py-3.5 transition-all duration-200 text-sm font-semibold whitespace-nowrap block relative group ${
                    isHomePage
                      ? "text-white hover:bg-white/20 active:bg-white/30"
                      : "text-gray-700 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                      isHomePage ? "bg-white" : "bg-rose-600"
                    }`}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
