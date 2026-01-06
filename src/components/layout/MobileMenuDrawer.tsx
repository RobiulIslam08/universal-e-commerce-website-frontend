/**
 * Mobile Menu Drawer Component
 * Slide-in menu for mobile devices with navigation options
 */

"use client";

import { X, User, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MAIN_NAVIGATION } from "@/constants/navigation";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";
import { getRootCategories } from "@/services/category";
import { ICategoryWithCount } from "@/types/category";

type UserData = {
  userId?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  user,
}: MobileMenuDrawerProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategoryWithCount[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories when drawer opens
  useEffect(() => {
    const fetchCategories = async () => {
      if (isOpen && categories.length === 0) {
        try {
          setLoadingCategories(true);
          const data = await getRootCategories();
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategories();
  }, [isOpen, categories.length]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      await signOut({ callbackUrl: "/login", redirect: false });
      router.push("/login");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-100 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className="fixed left-0 top-0 h-screen w-80 max-w-[85vw] bg-white z-110 overflow-y-auto overflow-x-hidden shadow-2xl lg:hidden animate-in slide-in-from-left duration-300"
        aria-label="Mobile menu"
      >
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
          {user ? (
            <div className="flex items-center gap-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={20} />
                </div>
              )}
              <div>
                <p className="text-xs text-white/70">Hello,</p>
                <p className="font-semibold text-sm truncate max-w-[180px]">
                  {user.name || "User"}
                </p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 hover:opacity-80 transition"
              onClick={onClose}
            >
              <User size={20} aria-hidden="true" />
              <div>
                <p className="text-xs text-white/70">Hello, sign in</p>
                <p className="font-semibold text-sm">Account & Lists</p>
              </div>
            </Link>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            aria-label="Close menu"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        {/* Categories Section */}
        <div className="border-b border-gray-200">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Categories
            </h2>
            {loadingCategories ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 rounded-lg group"
                    >
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Main Navigation Section */}
        <div className="">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Shop
            </h2>
            <ul className="space-y-1">
              {MAIN_NAVIGATION.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 px-4 text-gray-800 hover:bg-rose-50 hover:text-rose-700 transition-all duration-200 rounded-lg group"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronRight
                      className="w-4 h-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      {user && (
              <li className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 rounded-lg font-medium"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </li>
            )}
      </nav>
    </>
  );
}
