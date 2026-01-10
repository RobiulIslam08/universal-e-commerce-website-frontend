import {
  ICategory,
  ICategoryWithCount,
  ICategoryTree,
  ICategoryStats,
} from "@/types/category";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

export interface CategoryResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get all categories (flat list)
export const getAllCategories = async (): Promise<ICategory[]> => {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const response: CategoryResponse<ICategory[]> = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Get category tree (hierarchical)
export const getCategoryTree = async (): Promise<ICategoryTree[]> => {
  try {
    const res = await fetch(`${API_URL}/categories/tree`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch category tree");
    }

    const response: CategoryResponse<ICategoryTree[]> = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return [];
  }
};

// Get root categories (top-level)
export const getRootCategories = async (): Promise<ICategoryWithCount[]> => {
  try {
    const res = await fetch(`${API_URL}/categories/root`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch root categories");
    }

    const response: CategoryResponse<ICategoryWithCount[]> = await res.json();
    ;
    return response.data;
  } catch (error) {
    console.error("Error fetching root categories:", error);
    return [];
  }
};

// Get single category by slug with subcategories
export const getCategoryBySlug = async (
  slug: string
): Promise<ICategoryWithCount | null> => {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch category");
    }

    const response: CategoryResponse<ICategoryWithCount> = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
};

// Get subcategories of a category
export const getSubCategories = async (
  slug: string
): Promise<ICategoryWithCount[]> => {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}/subcategories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch subcategories");
    }

    const response: CategoryResponse<ICategoryWithCount[]> = await res.json();
    
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

// Get category statistics
export const getCategoryStats = async (): Promise<ICategoryStats | null> => {
  try {
    const res = await fetch(`${API_URL}/categories/stats`, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!res.ok) {
      throw new Error("Failed to fetch category stats");
    }

    const response: CategoryResponse<ICategoryStats> = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return null;
  }
};

// Create category (admin)
export const createCategory = async (
  data: Partial<ICategory>
): Promise<ICategory | null> => {
  try {
    const res = await fetch(`${API_URL}/categories/create-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create category");
    }

    const response: CategoryResponse<ICategory> = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

// Update category (admin)
export const updateCategory = async (
  slug: string,
  data: Partial<ICategory>
): Promise<ICategory | null> => {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update category");
    }

    const response: CategoryResponse<ICategory> = await res.json();
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
};

// Delete category (admin)
export const deleteCategory = async (slug: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete category");
    }

    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};
