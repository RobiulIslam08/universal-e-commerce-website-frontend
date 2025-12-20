"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const addProduct = async (productData: FormData) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(`${backendUrl}/products/create-product`, {
      method: "POST",
      headers: {
        Authorization: accessToken ? `${accessToken}` : "",
      },
      body: productData,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error(
        `Server returned non-JSON response: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to add product");
    }

    revalidateTag("PRODUCT", "default");

    return result;
  } catch (error: unknown) {
    console.error("Error adding product:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

export const getAllProducts = async (query?: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error(
        "❌ NEXT_PUBLIC_BACKEND_URL is not set in environment variables!"
      );
      return { success: false, data: [] };
    }

    const res = await fetch(
      `${backendUrl}/products${query ? `?${query}` : ""}`,
      {
        cache: "no-store",
        next: {
          tags: ["PRODUCT"],
        },
      }
    );

    if (!res.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          `Failed to fetch products: ${res.status} ${res.statusText}`
        );
      }
      return { success: false, data: [] };
    }

    const data = await res.json();
    console.log(
      "getAllProducts - Raw API response:",
      JSON.stringify(data).substring(0, 500)
    );
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Error(error.message);
    }
    return Error("Something went wrong");
  }
};

export const getSingleProduct = async (productId: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      console.error(
        "❌ NEXT_PUBLIC_BACKEND_URL is not set in environment variables!"
      );
      throw new Error("Backend URL is not configured");
    }

    const url = `${backendUrl}/products/${productId}`;

    const res = await fetch(url, {
      next: {
        tags: ["PRODUCT"],
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
      return { success: false, data: null };
    }

    const data = await res.json();
    console.log("Product data received:", data);
    return data;
  } catch (error: unknown) {
    console.error("Error in getSingleProduct:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message, data: null };
    }
    return { success: false, error: "Something went wrong", data: null };
  }
};

export const updateProduct = async (
  productId: string,
  productData: FormData
) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log("🔄 Updating product:", productId);

    const response = await fetch(`${backendUrl}/products/${productId}`, {
      method: "PATCH",
      headers: {
        Authorization: accessToken ? `${accessToken}` : "",
      },
      body: productData,
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      throw new Error(
        `Server returned non-JSON response: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update product");
    }

    console.log("✅ Product updated successfully");
    revalidateTag("PRODUCT", "default");

    return result;
  } catch (error: unknown) {
    console.error("❌ Error updating product:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    console.log("🗑️ Deleting product:", productId);

    const response = await fetch(`${backendUrl}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: accessToken ? `${accessToken}` : "",
        "Content-Type": "application/json",
      },
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete product");
      }

      console.log("✅ Product deleted successfully");
      revalidateTag("PRODUCT", "default");

      return result;
    } else {
      // Some APIs return no content (204) on successful delete
      if (response.ok) {
        console.log("✅ Product deleted successfully");
        revalidateTag("PRODUCT", "default");
        return { success: true, message: "Product deleted successfully" };
      } else {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }
    }
  } catch (error: unknown) {
    console.error("❌ Error deleting product:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};
