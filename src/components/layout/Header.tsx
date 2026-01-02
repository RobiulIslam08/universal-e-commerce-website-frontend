"use client";

import { useState, useCallback, memo } from "react";
import { Search, ShoppingCart, User, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { signOut } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";
import { orderedProductsSelector } from "@/redux/features/cartSlice";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";

// ✅ ১. ইউজারের টাইপ ডেফিনিশন (Flat Structure)
type UserData = {
  userId?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

const Navbar = memo(function Navbar({
  user, // ✅ session এর বদলে সরাসরি user প্রপস গ্রহণ করছি
}: {
  user: UserData | null;
}) {
  console.log("User Data in Navbar:", user);
  const router = useRouter();
  const cartProducts = useAppSelector(orderedProductsSelector);
  const cartCount = cartProducts.reduce(
    (total, product) => total + product.orderQuantity,
    0
  );

  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUserDropdownToggle = useCallback(() => {
    setUserDropdown((prev) => !prev);
  }, []);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/products?searchTerm=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
    }
  };

  // ✅ ২. handleSignOut ফাংশন আপডেট করুন
  const handleSignOut = async () => {
    try {
      // (ক) ম্যানুয়াল কুকি রিমুভ করুন (Server Action)
      await logoutUser();

      // (খ) NextAuth সেশন ক্লিয়ার করুন
      // callbackUrl দিলে সাইনআউট এর পর লগইন পেজে নিয়ে যাবে
      await signOut({ callbackUrl: "/login", redirect: false });

      // (গ) পেজ রিফ্রেশ বা রিডাইরেক্ট করে নিশ্চিত করুন যেন UI আপডেট হয়
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // ✅ Logout হ্যান্ডলার: যেহেতু আপনার ম্যানুয়াল কুকি আছে, তাই signOut এর সাথে কুকি ক্লিয়ার করার লজিক লাগতে পারে।
  // আপাতত next-auth এর signOut ব্যবহার করা হচ্ছে।
  // (ডুপ্লিকেট ফাংশনটি সরানো হয়েছে)

  return (
    <div className="w-full bg-white">
      {/* Main Navbar Header */}
      <div className="bg-rose-500 text-white shadow-md">
        <div className="w-full">
          {/* Mobile & Desktop Header */}
          <div className="px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-3">
            {/* Left: Menu Icon & Logo */}
            <div className="flex items-center gap-2 shrink-0">
              {/* TODO: পরে implement করবো - Mobile Menu Icon */}
              {/*
              <button
                onClick={handleDrawerToggle}
                className="lg:hidden p-2 hover:bg-rose-600 rounded transition"
                aria-label="Open menu"
                aria-expanded={isDrawerOpen}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
              */}

              <Link href="/">
                <Image
                  src="/main-logo.png"
                  alt="Universel website logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </Link>
              <Link
                href="/"
                className="text-lg sm:text-xl font-bold tracking-tight hover:opacity-90 transition "
              >
                Universel
              </Link>
            </div>

            {/* Desktop: Search Bar */}
            <form
              className="hidden sm:flex flex-1 max-w-2xl mx-2 md:mx-3"
              role="search"
              onSubmit={handleSearch}
            >
              <div className="flex w-full rounded-l-lg overflow-hidden">
                <select
                  className="px-2 sm:px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm border-r border-gray-300 hover:bg-gray-200 transition cursor-pointer font-medium"
                  aria-label="Select category"
                >
                  <option>All</option>

                  {/* পরে implement করবো */}
                  {/* <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Books</option>
                  <option>Home & Kitchen</option> */}
                </select>
                <input
                  type="search"
                  placeholder="Search Universel"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
              {/* User Section - Logic Updated based on 'user' prop */}
              {user ? (
                // ✅ Logged IN User - Mobile
                <div className="flex sm:hidden relative">
                  <button
                    onClick={handleUserDropdownToggle}
                    className="flex items-center gap-1 hover:opacity-80 transition"
                    aria-label="User menu"
                    aria-expanded={userDropdown}
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
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
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/payment/history"
                        className="block px-3 py-2 hover:bg-rose-100 transition text-sm"
                      >
                        Payment History
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 hover:bg-rose-100 transition text-sm flex items-center gap-2 text-red-600"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // ✅ Logged OUT User - Mobile
                <Link
                  href="/login"
                  className="flex sm:hidden flex-col hover:opacity-80 transition text-xs"
                >
                  <span className="opacity-80">Sign in</span>
                  <span className="font-semibold">Account</span>
                </Link>
              )}

              {/* User Section - Desktop */}
              {user ? (
                // ✅ Logged IN User - Desktop
                <div className="hidden sm:flex relative">
                  <button
                    onClick={handleUserDropdownToggle}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                    aria-label="User menu"
                    aria-expanded={userDropdown}
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
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
                        {user.name?.split(" ")[0] || "User"}
                      </span>
                    </div>
                    <ChevronDown size={12} />
                  </button>

                  {userDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-800 rounded shadow-lg z-60 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/payment/history"
                        className="block px-4 py-2 hover:bg-rose-100 transition text-sm"
                      >
                        Payment History
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-rose-100 transition text-sm flex items-center gap-2 text-red-600 border-t border-gray-200"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // ✅ Logged OUT User - Desktop
                <Link
                  href="/login"
                  className="hidden sm:flex flex-col hover:opacity-80 transition text-xs sm:text-sm"
                >
                  <span className="opacity-80">Sign in</span>
                  <span className="font-semibold">Account</span>
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
            onSubmit={handleSearch}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* TODO: পরে implement করবো - Mobile Categories */}
          {/*
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
          */}
        </div>
      </div>

      {/* TODO: পরে implement করবো - Drawer Menu, Categories Bar, Mobile Categories Grid, Mobile Prime Bar */}
      {/*
      {/* Drawer Menu */}
      {/* isDrawerOpen && (
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
      {/*    <div className="bg-gray-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
            {/* ✅ Drawer Menu তে User চেক */}
      {/*      {user ? (
              <div className="flex items-center gap-2">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
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
                    {user.name?.split(" ")[0] || "User"}
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
      {/*    <div>
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
      {/*    <div className="border-t-2 border-gray-200 p-4 space-y-3">
            <p className="font-bold text-gray-900 mb-4 text-sm">
              Help & Settings
            </p>
            <Link
              href="/payment/history"
              className="block text-xs text-gray-700 hover:text-rose-500 transition"
            >
             Payment History
            </Link>
            <Link
              href="/help"
              className="block text-xs text-gray-700 hover:text-rose-500 transition"
            >
              Help Center
            </Link>
            {user && (
              <button
                onClick={handleSignOut}
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
      {/*  <div className="hidden lg:block bg-rose-400">
        <div className="max-w-full px-6">
          <div className="flex items-stretch">
            {/* Menu button */}
      {/*      <button
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
      {/*  <div className="lg:hidden bg-gray-50 border-b border-gray-200">
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
      {/*  <div className="lg:hidden bg-blue-50 border-b border-blue-200">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors shrink-0 whitespace-nowrap">
            Join Prime
          </button>
        </div>
      </div>
      */}

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
