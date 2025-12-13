import DashboardStats from "@/components/admin/dashboard-stats";
import RecentProducts from "@/components/admin/recent-products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllProducts } from "@/services/product";
import { IProduct } from "@/types/product";

export default async function AdminDashboard() {
  const res = await getAllProducts();
  const products: IProduct[] = Array.isArray(res) ? res : res?.data || [];

  const stats = {
    totalProducts: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    totalValue: products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.stockQuantity || 0),
      0
    ),
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground text-balance">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s what&apos;s happening with your store today
          </p>
        </div>
        <Link href="/admin/products/add">
          <Button className="gap-2 bg-linear-to-r from-primary to-rose-600 hover:from-primary/90 hover:to-rose-700 text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300">
            <span>➕</span>
            Add Product
          </Button>
        </Link>
      </div>

      <DashboardStats stats={stats} />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <h2 className="text-lg font-semibold">Inventory Overview</h2>
        </div>
        <RecentProducts products={products.slice(0, 5)} />
      </div>
    </div>
  );
}
