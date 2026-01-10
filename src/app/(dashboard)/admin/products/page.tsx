// import { getAllProducts } from "@/services/product";
// import { getCategoryTree } from "@/services/category"; 
// import ProductsClient from "@/components/admin/products/products-client";

// export default async function ProductsPage() {
//   // ১. limit বাড়িয়ে দিন যাতে সব প্রোডাক্ট আসে (ক্লায়েন্ট সাইড পেজিনেশনের জন্য)
//   const productsRes = await getAllProducts("limit=1000"); 
//   const products = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
//   console.log(products)

//   // ২. ক্যাটাগরি ট্রি ফেচ করা
//   const categoriesRes = await getCategoryTree(); 
//   // ব্যাকএন্ড রেসপন্স চেক করে ডাটা এক্সট্র্যাক্ট করা
//   const categories = categoriesRes || [];


//   return <ProductsClient initialProducts={products} categories={categories} />;
// }

import { getAllProducts } from "@/services/product";
import { getCategoryTree } from "@/services/category"; 
import ProductsClient from "@/components/admin/products/products-client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // URL থেকে ফিল্টারগুলো নেওয়া হচ্ছে
  const query = {
    page: (params.page as string) || "1",
    limit: (params.limit as string) || "10",
    searchTerm: (params.searchTerm as string) || "",
    category: (params.category as string) || "",
    subCategory: (params.subCategory as string) || "",
    //  stock: params.stock || "",
     stock: (Array.isArray(params.stock) ? params.stock[0] : params.stock) || "",
  
  };

  const [productsRes, categoriesRes] = await Promise.all([
    getAllProducts(query),
    getCategoryTree(),
  ]);

  const products = productsRes?.data || [];
  const meta = productsRes?.meta || { page: 1, total: 0, totalPage: 1 };
  const categories = categoriesRes || [];

  return (
    <ProductsClient 
      initialProducts={products} 
      categories={categories} 
      meta={meta} 
    />
  );
}