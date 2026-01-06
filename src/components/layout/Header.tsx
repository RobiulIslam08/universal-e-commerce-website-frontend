"use client";

import { useState, memo } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import CartIcon from "./CartIcon";
import NavigationMenu from "./NavigationMenu";
import MobileMenuDrawer from "./MobileMenuDrawer";

// User type definition
type UserData = {
  userId?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

const Navbar = memo(function Navbar({ user }: { user: UserData | null }) {
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" || pathname === "/en" || pathname === "/bn";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        user={user}
      />

      <div
        className={`w-full ${
          isHomePage
            ? "absolute top-0 left-0 right-0 z-40"
            : "bg-white shadow-sm"
        }`}
      >
        {/* Main Navbar Header */}
        <div
          className={`relative z-50  transition-all duration-300 ${
            isHomePage
              ? "bg-slate-500/60  border-b border-white/20 text-white"
              : "bg-white text-gray-900 border-b border-gray-200 "
          }`}
        >
          <div className="w-full">
            {/* Mobile & Desktop Header */}
            <div className="px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-3">
              {/* Left: Logo */}
              <div className="flex items-center gap-2 shrink-0">
                <Logo size="md" showText={true} />
              </div>

              {/* Desktop: Search Bar */}
              <SearchBar variant="desktop" />

              {/* Right: Account, Cart & Menu Icon */}
              <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                {/* User Menu - Mobile */}
                <UserMenu user={user} variant="mobile" />

                {/* User Menu - Desktop */}
                <UserMenu user={user} variant="desktop" />

                {/* Cart Icon */}
                <CartIcon />

                {/* Mobile Menu Icon */}
                <button
                  onClick={handleMenuToggle}
                  className={`lg:hidden p-2 rounded transition ${
                    isHomePage
                      ? "hover:bg-white/20 text-white"
                      : "hover:bg-rose-50 text-rose-600"
                  }`}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X size={20} aria-hidden="true" />
                  ) : (
                    <Menu size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <SearchBar variant="mobile" />
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <NavigationMenu />
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
