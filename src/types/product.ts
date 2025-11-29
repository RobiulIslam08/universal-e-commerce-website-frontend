export interface Specification {
  key: string; // যেমন: "Material", "Capacity"
  value: string; // যেমন: "100% Cotton", "5.5 Liters"
}

export interface ShippingAndReturns {
  shippingWeight: string; // যেমন: "0.45 kg"
  deliveryTime: string; // যেমন: "2-4 Business Days"
  returnPolicy: string; // যেমন: "30-Day Money-Back Guarantee"
}

export interface Warranty {
  duration: string; // যেমন: "2 Years Limited Warranty"
  coverage: string; // যেমন: "Parts and Labor"
}

export interface Product {
  [x: string]: any;
  // --- Basic Fields (As per your original code) ---
  id: string;
  slug: string;
  title: string;
  price: number;
  strikePrice?: number;
  discount?: string;
  category: string;
  image: string; // (Represents the main image URL/path or Emoji)
  badge?: string;
  rating?: number;
  inStock?: boolean;

  // --- New Admin/E-commerce Specific Fields (Highly Recommended) ---
  subCategory?: string; // যেমন: "Audio", "Apparel"
  subCategorySlug?: string; // যেমন: "audio-gaming", "apparel"
  sku: string; // Stock Keeping Unit (Unique identifier for inventory)
  stockQuantity: number; // Inventory count
  
  shortDescription: string; // Brief one-line summary (for cards/previews)
  longDescription: string; // Detailed description (for product page)
  
  specifications: Specification[]; // Technical details in key-value pairs
  
  // --- Additional E-commerce Tabs Data ---
  media?: string[]; // Array of image/video URLs
  shippingAndReturns: ShippingAndReturns;
  warranty: Warranty;
  tags?: string[]; // For filtering and internal search (যেমন: ["ANC", "wireless", "over-ear"])
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
};