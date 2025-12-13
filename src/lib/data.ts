// // ----------------------------------------------------------------------
// // Helper Functions (Data Access Layer)
// // ----------------------------------------------------------------------

// import { products } from "@/constants/products";
// import { IProduct } from "@/types/product";
// import { getAllProducts as fetchAllProducts } from "@/services/product";

// /**
//  * Get all products
//  */
// export const getAllProducts = async (): Promise<IProduct[]> => {
//   try {
//     const res = await fetchAllProducts();
//     if (res?.data && Array.isArray(res.data)) {
//       return [...res.data, ...products];
//     }
//   } catch (error) {
//     console.error("Failed to fetch products from API", error);
//   }
//   return products;
// };

// /**
//  * Get a single product by its slug
//  * @param slug - The unique slug of the product
//  */
// export const getProductBySlug = async (
//   slug: string
// ): Promise<IProduct | undefined> => {
//   // 1. Try to find in dummy data first (fastest)
//   const dummyProduct = products.find((product) => product.slug === slug);
//   if (dummyProduct) return dummyProduct;

//   // 2. If not found in dummy data, try to fetch from API
//   try {
//     const res = await fetchAllProducts();
//     let apiProducts: IProduct[] = [];

//     if (res?.data && Array.isArray(res.data)) {
//       apiProducts = res.data;
//     } else if (Array.isArray(res)) {
//       apiProducts = res;
//     }

//     const apiProduct = apiProducts.find((p: IProduct) => p.slug === slug);

//     if (apiProduct) {
//       // Ensure required fields exist to prevent crashes
//       if (
//         !apiProduct.specifications ||
//         !Array.isArray(apiProduct.specifications)
//       ) {
//         apiProduct.specifications = [];
//       }
//       if (!apiProduct.shippingAndReturns) {
//         apiProduct.shippingAndReturns = {
//           shippingWeight: "N/A",
//           deliveryTime: "N/A",
//           returnPolicy: "N/A",
//         };
//       }
//       if (!apiProduct.warranty) {
//         apiProduct.warranty = {
//           duration: "N/A",
//           coverage: "N/A",
//         };
//       }
//       // Handle images field if image is missing
//       if (
//         !apiProduct.image &&
//         apiProduct.images &&
//         apiProduct.images.length > 0
//       ) {
//         apiProduct.image = apiProduct.images[0];
//       }
//       return apiProduct;
//     }
//   } catch (error) {
//     console.error("Failed to fetch product by slug from API", error);
//   }

//   return undefined;
// };

// /**
//  * Get products by main category slug
//  * @param categorySlug - The slug of the category (e.g., "electronics")
//  */
// export const getProductsByCategory = (categorySlug: string): IProduct[] => {
//   return products.filter((product) => product.category === categorySlug);
// };

// /**
//  * Get featured products (those with badges)
//  * @param limit - Number of products to return
//  */
// export const getFeaturedProducts = (limit: number = 4): IProduct[] => {
//   return products.filter((product) => product.badge).slice(0, limit);
// };

// /**
//  * Get related products based on category, excluding the current one
//  * @param currentSlug - The slug of the current product to exclude
//  * @param categorySlug - The category to fetch from
//  * @param limit - Number of products to return
//  */
// export const getRelatedProducts = (
//   currentSlug: string,
//   categorySlug: string,
//   limit: number = 4
// ): IProduct[] => {
//   return products
//     .filter((p) => p.category === categorySlug && p.slug !== currentSlug)
//     .slice(0, limit);
// };
