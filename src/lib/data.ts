

// ----------------------------------------------------------------------
// Helper Functions (Data Access Layer)
// ----------------------------------------------------------------------

import { products } from "@/constants/products";
import { Product } from "@/types/product";

/**
 * Get all products
 */
export const getAllProducts = (): Product[] => {
  return products;
};

/**
 * Get a single product by its slug
 * @param slug - The unique slug of the product
 */
export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug);
};

/**
 * Get products by main category slug
 * @param categorySlug - The slug of the category (e.g., "electronics")
 */
export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter((product) => product.category === categorySlug);
};

/**
 * Get featured products (those with badges)
 * @param limit - Number of products to return
 */
export const getFeaturedProducts = (limit: number = 4): Product[] => {
  return products.filter((product) => product.badge).slice(0, limit);
};

/**
 * Get related products based on category, excluding the current one
 * @param currentSlug - The slug of the current product to exclude
 * @param categorySlug - The category to fetch from
 * @param limit - Number of products to return
 */
export const getRelatedProducts = (currentSlug: string, categorySlug: string, limit: number = 4): Product[] => {
  return products
    .filter((p) => p.category === categorySlug && p.slug !== currentSlug)
    .slice(0, limit);
};