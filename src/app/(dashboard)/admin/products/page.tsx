import { getAllProducts } from "@/services/product";
import { getCategoryTree } from "@/services/category"; 
import ProductsClient from "@/components/admin/products/products-client";

export default async function ProductsPage() {
  // ১. limit বাড়িয়ে দিন যাতে সব প্রোডাক্ট আসে (ক্লায়েন্ট সাইড পেজিনেশনের জন্য)
  const productsRes = await getAllProducts("limit=10000"); 
  const products = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
  console.log(products)

  // ২. ক্যাটাগরি ট্রি ফেচ করা
  const categoriesRes = await getCategoryTree(); 
  // ব্যাকএন্ড রেসপন্স চেক করে ডাটা এক্সট্র্যাক্ট করা
  const categories = categoriesRes || [];


  return <ProductsClient initialProducts={products} categories={categories} />;
}