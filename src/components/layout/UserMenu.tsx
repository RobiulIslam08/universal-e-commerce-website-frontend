/**
 * User Menu Component
 * Handles user authentication display and dropdown menu
 */

"use client";

import { useState, useCallback } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth";

type UserData = {
  userId?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

interface UserMenuProps {
  user: UserData | null;
  variant?: "mobile" | "desktop";
}

export default function UserMenu({ user, variant = "desktop" }: UserMenuProps) {
  const router = useRouter();
  const [userDropdown, setUserDropdown] = useState(false);

  const handleUserDropdownToggle = useCallback(() => {
    setUserDropdown((prev) => !prev);
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      await signOut({ callbackUrl: "/login", redirect: false });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!user) {
    // Logged out user
    if (variant === "mobile") {
      return (
        <Link
          href="/login"
          className="flex sm:hidden flex-col hover:opacity-80 transition text-xs"
        >
          <span className="opacity-80">Sign in</span>
          <span className="font-semibold">Account</span>
        </Link>
      );
    }

    return (
      <Link
        href="/login"
        className="hidden sm:flex flex-col hover:opacity-80 transition text-xs sm:text-sm"
      >
        <span className="opacity-80">Sign in</span>
        <span className="font-semibold">Account</span>
      </Link>
    );
  }

  // Logged in user
  if (variant === "mobile") {
    return (
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
          <div className="fixed right-2 top-[60px] w-48 bg-white text-gray-800 rounded-lg shadow-xl z-9999 border border-gray-200">
            <div className="px-3 py-2 border-b border-gray-200">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
            </div>
            <Link
              href="/payment/history"
              className="block px-3 py-2 hover:bg-rose-100 transition text-sm"
              onClick={() => setUserDropdown(false)}
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
    );
  }

  // Desktop logged in user
  return (
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
        <div className="absolute right-0 top-full mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl z-9999 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
          <Link
            href="/payment/history"
            className="block px-4 py-2 hover:bg-rose-100 transition text-sm"
            onClick={() => setUserDropdown(false)}
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
  );
}
