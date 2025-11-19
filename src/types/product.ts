export interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  strikePrice?: number;
  discount?: string;
  category: string;
  image: string;
  badge?: string;
  rating?: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}
