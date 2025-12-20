/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, memo } from "react";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  ChevronRight,
  Globe,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DESKTOP_CATEGORIES,
  LANGUAGE_CODES,
  LANGUAGES,
  MENU_SECTIONS,
  MOBILE_CATEGORIES,
  QUICK_CATEGORIES,
} from "@/constants/navbar";
import { signOut } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/features/cartSlice";

type UserProps = {
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
};

const Navbar = memo(function Navbar({
  session,
}: {
  session: UserProps | null;
}) {
  console.log(session);
  const cartProducts = useAppSelector(orderedProductsSelector);
  const cartCount = cartProducts.reduce((total, product) => total + product.orderQuantity, 0);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("EN");
  const [userDropdown, setUserDropdown] = useState(false);

  const toggleSection = useCallback((section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  }, []);

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleLanguageSelect = useCallback((langCode: any) => {
    setSelectedLanguage(langCode);
    setLanguageDropdown(false);
  }, []);

  const handleLanguageDropdownToggle = useCallback(() => {
    setLanguageDropdown((prev) => !prev);
  }, []);

  const handleUserDropdownToggle = useCallback(() => {
    setUserDropdown((prev) => !prev);
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Main Navbar Header */}
      <div className="bg-rose-500 text-white shadow-md">
        <div className="w-full">
          {/* Mobile & Desktop Header */}
          <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
            {/* Left: Menu Icon & Logo */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Menu button - শুধু mobile এ দেখাবে */}
              <button
                onClick={handleDrawerToggle}
                className="lg:hidden p-2 hover:bg-rose-600 rounded transition"
                aria-label="Open menu"
                aria-expanded={isDrawerOpen}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
              <Link
                href="/"
                className="text-lg sm:text-xl font-bold tracking-tight hover:opacity-90 transition"
              >
                Universel
              </Link>
            </div>

            {/* Desktop: Location Badge */}
            <Link
              href="/location"
              className="hidden md:flex items-center gap-2 hover:opacity-80 transition shrink-0 bg-rose-400 px-3 py-2 rounded"
            >
              <MapPin size={14} className="shrink-0" aria-hidden="true" />
              <div className="text-xs leading-tight">
                <div className="opacity-80">Delivering to</div>
                <div className="font-semibold">Riyadh</div>
              </div>
            </Link>

            {/* Desktop: Search Bar */}
            <form
              className="hidden sm:flex flex-1 max-w-2xl mx-2 md:mx-3"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex w-full rounded-l-lg overflow-hidden">
                <select
                  className="px-2 sm:px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm border-r border-gray-300 hover:bg-gray-200 transition cursor-pointer font-medium"
                  aria-label="Select category"
                >
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Books</option>
                  <option>Home & Kitchen</option>
                </select>
                <input
                  type="search"
                  placeholder="Search Universel"
                  className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 outline-none bg-white placeholder-gray-500"
                  aria-label="Search products"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-400 rounded-r-lg hover:bg-amber-500 text-gray-800 px-3 sm:px-4 py-2 transition-colors flex items-center justify-center shrink-0"
                aria-label="Search"
              >
                <Search size={18} aria-hidden="true" />
              </button>
            </form>

            {/* Right: Account, Orders & Cart */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {/* Language Dropdown - Desktop only */}
              <div className="relative hidden md:block">
                <button
                  onClick={handleLanguageDropdownToggle}
                  className="flex items-center gap-1 px-2 py-2 hover:bg-rose-600 transition rounded text-sm"
                  aria-label="Select language"
                  aria-expanded={languageDropdown}
                  aria-haspopup="true"
                >
                  <Globe size={14} aria-hidden="true" />
                  <span className="font-medium">{selectedLanguage}</span>
                  <ChevronDown size={12} aria-hidden="true" />
                </button>
                {languageDropdown && (
                  <div
                    className="absolute right-0 mt-1 w-28 bg-white text-gray-800 rounded shadow-lg z-50 overflow-hidden"
                    role="menu"
                  >
                    {LANGUAGES.map((lang, idx) => (
                      <button
                        key={LANGUAGE_CODES[idx]}
                        onClick={() =>
                          handleLanguageSelect(LANGUAGE_CODES[idx])
                        }
                        className="block w-full text-left px-3 py-2 hover:bg-rose-100 transition text-xs sm:text-sm"
                        role="menuitem"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Section - Show different content based on session */}
              {session?.user ? (
                // Logged in user - Mobile
                <div className="flex sm:hidden relative">
                  <button
                    onClick={handleUserDropdownToggle}
                    className="flex items-center gap-1 hover:opacity-80 transition"
                    aria-label="User menu"
                    aria-expanded={userDropdown}
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-rose-300 flex items-center justify-center">
                        <User size={16} className="text-gray-700" />
                      </div>
                    )}
                    <ChevronDown size={12} />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50 overflow-hidden">
                      <div className="px-3 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-3 py-2 hover:bg-rose-100 transition text-sm"
                      >
                        Your Account
                      </Link>
                      <Link
                        href="/order"
                        className="block px-3 py-2 hover:bg-rose-100 transition text-sm"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-2 hover:bg-rose-100 transition text-sm flex items-center gap-2 text-red-600"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in - Mobile
                <Link
                  href="/login"
                  className="flex sm:hidden flex-col hover:opacity-80 transition text-xs"
                >
                  <span className="opacity-80">Sign in</span>
                  <span className="font-semibold">Account</span>
                </Link>
              )}

              {/* User Section - Desktop */}
              {session?.user ? (
                <div className="hidden sm:flex relative">
                  <button
                    onClick={handleUserDropdownToggle}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                    aria-label="User menu"
                    aria-expanded={userDropdown}
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center">
                        <User size={18} className="text-gray-700" />
                      </div>
                    )}
                    <div className="flex flex-col text-left">
                      <span className="opacity-80 text-xs">Hello,</span>
                      <span className="font-semibold text-sm truncate max-w-[100px]">
                        {session.user.name?.split(" ")[0] || "User"}
                      </span>
                    </div>
                    <ChevronDown size={12} />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-800 rounded shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 hover:bg-rose-100 transition text-sm"
                      >
                        Your Account
                      </Link>
                      <Link
                        href="/order"
                        className="block px-4 py-2 hover:bg-rose-100 transition text-sm"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 hover:bg-rose-100 transition text-sm flex items-center gap-2 text-red-600 border-t border-gray-200"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in - Desktop
                <Link
                  href="/login"
                  className="hidden sm:flex flex-col hover:opacity-80 transition text-xs sm:text-sm"
                >
                  <span className="opacity-80">Sign in</span>
                  <span className="font-semibold">Account</span>
                </Link>
              )}

              {/* Orders Button - Desktop only (hide when user dropdown is shown) */}
              {!session?.user && (
                <Link
                  href="/order"
                  className="hidden lg:block bg-transparent hover:bg-rose-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition whitespace-nowrap"
                >
                  Orders
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-1 hover:opacity-80 transition relative"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart size={22} aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 bg-rose-300 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form
            className="sm:hidden px-3 pb-3"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex bg-white rounded-sm overflow-hidden">
                <select
                  className="px-2 py-2 text-gray-700 text-xs bg-gray-100 border-r border-gray-300 font-medium"
                  aria-label="Select category"
                >
                  <option>All</option>
                </select>
                <input
                  type="search"
                  placeholder="Search Universel"
                  className="flex-1 px-2 py-2 text-xs text-gray-900 outline-none bg-white placeholder-gray-400 font-medium"
                  aria-label="Search products"
                />
              </div>
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-500 text-gray-800 p-2 rounded transition-colors"
                aria-label="Search"
              >
                <Search size={16} aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="sm:hidden px-3 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {MOBILE_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category
                    .toLowerCase()
                    .replace(/['\s]/g, "-")}`}
                  className="text-white hover:text-rose-200 px-3 py-1 transition text-xs font-semibold whitespace-nowrap border border-gray-300 rounded"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Menu - No background overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={handleDrawerClose}
          aria-hidden="true"
        />
      )}

      {isDrawerOpen && (
        <nav
          className="fixed left-0 top-0 h-screen w-80 bg-white z-40 overflow-y-auto shadow-2xl"
          aria-label="Mobile menu"
        >
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
            {session?.user ? (
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User size={18} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm">Hello,</p>
                  <p className="font-semibold text-sm truncate max-w-[180px]">
                    {session.user.name?.split(" ")[0] || "User"}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <User size={20} aria-hidden="true" />
                <span className="font-medium text-sm">Hello, sign in</span>
              </Link>
            )}
            <button
              onClick={handleDrawerClose}
              className="p-1 hover:bg-gray-800 rounded transition"
              aria-label="Close menu"
            >
              <X size={24} aria-hidden="true" />
            </button>
          </div>

          {/* Menu Sections */}
          <div>
            {MENU_SECTIONS.map((section, idx) => (
              <div key={idx} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-4 py-4 text-gray-900 font-bold hover:bg-gray-50 transition text-left"
                >
                  {section.title}
                  <ChevronRight
                    size={20}
                    className={`transition-transform ${
                      expandedSection === section.title ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedSection === section.title && (
                  <div className="bg-gray-50">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="py-3 px-6 text-gray-700 hover:text-rose-500 cursor-pointer transition flex items-center justify-between border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm">{item.label}</span>
                        {item.hasArrow && (
                          <ChevronRight size={14} className="text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help & Settings */}
          <div className="border-t-2 border-gray-200 p-4 space-y-3">
            <p className="font-bold text-gray-900 mb-4 text-sm">
              Help & Settings
            </p>
            <Link
              href="/account"
              className="block text-xs text-gray-700 hover:text-rose-500 transition"
            >
              Your Account
            </Link>
            <button
              onClick={handleLanguageDropdownToggle}
              className="flex items-center gap-2 text-xs text-gray-700 hover:text-rose-500 transition w-full"
              aria-label="Select language"
            >
              <Globe size={14} aria-hidden="true" />
              <span>{selectedLanguage}</span>
            </button>
            <Link
              href="/help"
              className="block text-xs text-gray-700 hover:text-rose-500 transition"
            >
              Help Center
            </Link>
            {session?.user && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 transition w-full text-left"
              >
                <LogOut size={14} />
                Sign out
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Categories Bar - Desktop */}
      <div className="hidden lg:block bg-rose-400">
        <div className="max-w-full px-6">
          <div className="flex items-stretch">
            {/* Menu button - শুধু desktop এ categories bar এ দেখাবে */}
            <button
              onClick={handleDrawerToggle}
              className="p-2 hover:bg-rose-500 rounded transition text-white flex items-center justify-center"
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            {DESKTOP_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/category/${category
                  .toLowerCase()
                  .replace(/['\s]/g, "-")}`}
                className="text-white hover:bg-rose-500 px-4 py-3 transition text-sm font-semibold whitespace-nowrap"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Categories Grid - Horizontally scrollable */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200">
        <div className="px-3 sm:px-4 py-3">
          <div
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
            role="navigation"
            aria-label="Quick categories"
          >
            {QUICK_CATEGORIES.map((category) => (
              <Link
                key={category.label}
                href={`/category/${category.label
                  .toLowerCase()
                  .replace(/\s/g, "-")}`}
                className="text-center hover:opacity-80 transition shrink-0 w-16"
              >
                <div className="text-2xl mb-1" aria-hidden="true">
                  {category.icon}
                </div>
                <p className="text-xs text-gray-700 font-medium line-clamp-2">
                  {category.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Location & Prime Bar */}
      <div className="lg:hidden bg-blue-50 border-b border-blue-200">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
            <MapPin size={14} className="shrink-0 text-gray-600" />
            <span>
              Delivering to Riyadh -{" "}
              <span className="font-semibold cursor-pointer text-blue-600">
                Update location
              </span>
            </span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors shrink-0 whitespace-nowrap">
            Join Prime
          </button>
        </div>
      </div>

      {/* Add scrollbar hide CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
