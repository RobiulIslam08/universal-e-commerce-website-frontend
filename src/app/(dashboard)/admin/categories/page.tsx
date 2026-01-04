import CategoryManagement from "@/components/admin/categories/category-management";

export const metadata = {
  title: "Category Management | Admin Dashboard",
  description: "Manage product categories and subcategories",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Category Management</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage product categories and subcategories
        </p>
      </div>

      <CategoryManagement />
    </div>
  );
}
