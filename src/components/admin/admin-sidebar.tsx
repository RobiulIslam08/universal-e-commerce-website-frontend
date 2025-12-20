"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Products", href: "/admin/products", icon: "📦" },
    { label: "Carousel", href: "/admin/carousel", icon: "🎠" },
    { label: "Payments", href: "/admin/payments", icon: "💳" },
  ];

  const secondaryItems = [
    { label: "Analytics", href: "/admin/analytics", icon: "📈" },
    { label: "Store Settings", href: "/admin/settings", icon: "⚙️" },
    { label: "Go To Home", href: "/", icon: "🏠" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40 transition-all duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:relative w-64 h-full bg-card border-r border-border/50 transition-transform duration-300 z-50 md:z-0 flex flex-col shadow-lg",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-linear-to-r from-rose-50/50 to-transparent dark:from-rose-950/10 dark:to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-rose-500 flex items-center justify-center shadow-lg shadow-primary/20 text-lg">
              🛒
            </div>
            <div>
              <span className="font-bold text-lg bg-linear-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                Admin
              </span>
              <p className="text-xs text-muted-foreground">Store Manager</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-all duration-300 text-lg"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium",
                    isActive
                      ? "bg-linear-to-r from-primary to-rose-500 text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-foreground hover:bg-linear-to-r hover:from-rose-50/50 hover:to-orange-50/50 dark:hover:from-rose-950/10 dark:hover:to-orange-950/10"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mt-6 mb-3">
            Settings
          </p>
          {secondaryItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium",
                    isActive
                      ? "bg-linear-to-r from-primary to-rose-500 text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-foreground hover:bg-linear-to-r hover:from-rose-50/50 hover:to-orange-50/50 dark:hover:from-rose-950/10 dark:hover:to-orange-950/10"
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 bg-linear-to-t from-rose-50/30 to-transparent dark:from-rose-950/5 dark:to-transparent">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-all duration-300 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-rose-500 flex items-center justify-center text-sm">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Store Owner</p>
              <p className="text-xs text-muted-foreground truncate">
                Admin Account
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
