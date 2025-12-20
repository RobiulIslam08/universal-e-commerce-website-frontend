interface MenuSection {
  title: string;
  items: MenuItem[];
}
interface MenuItem {
  label: string;
  hasArrow: boolean;
}

type Language = "EN" | "AR" | "FR" | "ES" | "DE" | "BN";

interface QuickCategory {
  icon: string;
  label: string;
}
export const LANGUAGES = [
  "English",
  "العربية",
  "Français",
  "Español",
  "Deutsch",
  "Bangla"
] as const;
export const LANGUAGE_CODES: Language[] = ["EN", "AR", "FR", "ES", "DE","BN"];

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Trending",
    items: [
      { label: "Best Sellers", hasArrow: false },
      { label: "New Releases", hasArrow: false },
      { label: "Movers & Shakers", hasArrow: false },
    ],
  },
  {
    title: "Digital Content & Devices",
    items: [
      { label: "Echo, Alexa & Smart Home", hasArrow: true },
      { label: "Universel Kindle E-readers", hasArrow: true },
      { label: "Universel Home Security", hasArrow: true },
    ],
  },
  {
    title: "Shop by Category",
    items: [
      { label: "Mobiles, Tablets & Accessories", hasArrow: true },
      { label: "Computers & Office Supplies", hasArrow: true },
      { label: "TVs & Electronics", hasArrow: true },
      { label: "Home & Kitchen", hasArrow: true },
    ],
  },
];

export const QUICK_CATEGORIES: QuickCategory[] = [
  { icon: "🎁", label: "Deals" },
  { icon: "📱", label: "Mobiles" },
  { icon: "🛍️", label: "Bazaar" },
  { icon: "👕", label: "Fashion" },
  { icon: "🌍", label: "Global Store" },
  { icon: "🖥️", label: "Electronics" },
  { icon: "🎧", label: "Accessories" },
  { icon: "📚", label: "Books" },
];

export const DESKTOP_CATEGORIES = [
  "Bazaar",
  "Fresh",
  "Today's Deals",
  "Mobile Phones",
  "Prime",
  "Supermarket",
  "Toys & Games",
  "Electronics",
  "Your Universel",
] as const;
export const MOBILE_CATEGORIES = [
  "Bazaar",
  "Fresh",
  "Today's Deals",
  "Mobile Phones",
  "Prime",
  "Supermarket",
  "Toys & Games",
  "Electronics",
  "Your Universel",
] as const;