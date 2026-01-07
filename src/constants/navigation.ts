/**
 * Navigation Configuration
 * Central location for all navigation menu items
 */

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

export interface CategoryItem {
  label: string;
  href: string;
  subcategories?: { label: string; href: string }[];
}

// Main Navigation Links
export const MAIN_NAVIGATION: NavigationItem[] = [
 
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
   
];

// Mobile Quick Categories with Icons
export const MOBILE_QUICK_CATEGORIES: CategoryItem[] = [
  {
    label: "Women",
    href: "/category/women",
  },
  {
    label: "Men",
    href: "/category/men",
  },
  {
    label: "Accessories",
    href: "/category/accessories",
  },
  {
    label: "Electronics",
    href: "/category/electronics",
  },
  {
    label: "Home",
    href: "/category/home",
  },
];

// Help & Account Links
export const HELP_LINKS: NavigationItem[] = [
  {
    label: "Payment History",
    href: "/payment/history",
  },
 
];
