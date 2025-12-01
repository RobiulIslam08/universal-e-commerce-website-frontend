import { getAllProducts } from "@/services/product";
import ProductsClient from "@/components/admin/products/products-client";

export default async function ProductsPage() {
  const res = await getAllProducts();
  // Handle different response structures (array or object with data property)
  const products = Array.isArray(res) ? res : res?.data || [];

  return <ProductsClient initialProducts={products} />;
}
