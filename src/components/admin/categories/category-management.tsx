"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2, FolderTree } from "lucide-react";
import { ICategoryWithCount } from "@/types/category";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<ICategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ICategoryWithCount | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentCategory: "",
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && !editingCategory
        ? { slug: generateSlug(value) }
        : {}),
    }));
  };

  // Open dialog for creating new category
  const openCreateDialog = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      parentCategory: "",
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing category
  const openEditDialog = (category: ICategoryWithCount) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      parentCategory: category.parentCategory || "",
    });
    setIsDialogOpen(true);
  };

  // Create or update category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error("Name and slug are required");
      return;
    }

    setSubmitting(true);

    try {
      const url = editingCategory
        ? `${API_URL}/categories/${editingCategory.slug}`
        : `${API_URL}/categories/create-category`;

      const method = editingCategory ? "PATCH" : "POST";

      const payload = {
        name: formData.name,
        slug: formData.slug,
        parentCategory: formData.parentCategory || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingCategory
            ? "Category updated successfully"
            : "Category created successfully"
        );
        setIsDialogOpen(false);
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories/${slug}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  // Get all categories that can be parents (all categories except the one being edited)
  const availableParentCategories = categories.filter(
    (cat) => cat.slug !== editingCategory?.slug
  );

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="w-5 h-5" />
                Categories ({categories.length})
              </CardTitle>
              <CardDescription>
                Manage your product categories and subcategories
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderTree className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">No categories yet</p>
              <p className="text-muted-foreground mb-4">
                Create your first category to get started
              </p>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.parentCategory || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.slug)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category information"
                : "Add a new category or subcategory to your store"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Help Box */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📖 How Categories Work
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • <strong>Root Category</strong>: Leave Parent as
                  &quot;None&quot; (e.g., Electronics, Fashion)
                </li>
                <li>
                  • <strong>Subcategory</strong>: Select a parent (e.g., Mobile
                  under Electronics)
                </li>
                <li>
                  • <strong>Nested</strong>: Select any category as parent
                  (e.g., iPhone under Mobile)
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Category Name <span className="text-destructive">*</span>
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Electronics, Mobile, iPhone"
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Slug <span className="text-destructive">*</span>
                </label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., electronics, mobile, iphone"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from name (lowercase with hyphens)
                </p>
              </div>

              {/* Parent Category */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Parent Category{" "}
                  <span className="text-muted-foreground text-xs">
                    (Optional - Select for Subcategory)
                  </span>
                </label>
                <Select
                  value={formData.parentCategory || "__none__"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      parentCategory: value === "__none__" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None - This will be a Root Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">
                      <span className="font-semibold">
                        📁 None - Root Category
                      </span>
                    </SelectItem>

                    {availableParentCategories.length > 0 && (
                      <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1">
                          Available Parents
                        </div>
                        {availableParentCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat.slug}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>

                {/* Help Text */}
                <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    <strong>💡 Example:</strong>
                  </p>
                  <ul className="text-xs text-amber-800 dark:text-amber-300 mt-1 space-y-0.5">
                    <li>
                      • <strong>None:</strong> Electronics (Root)
                    </li>
                    <li>
                      • <strong>Parent: Electronics</strong> → Mobile, Desktop,
                      AC
                    </li>
                    <li>
                      • <strong>Parent: Mobile</strong> → iPhone, Android,
                      Samsung
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingCategory ? "Updating..." : "Creating..."}
                  </>
                ) : editingCategory ? (
                  "Update Category"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
