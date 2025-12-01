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
    }

    const res = await fetch(
      `${backendUrl}/products${query ? `?${query}` : ""}`,
      {
        next: {
          tags: ["PRODUCT"],
        },
      }
    );
    const data = await res.json();
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
    }

    const res = await fetch(`${backendUrl}/products/${productId}`, {
      next: {
        tags: ["PRODUCT"],
      },
    });
    const data = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Error(error.message);
    }
    return Error("Something went wrong");
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

    const response = await fetch(`${backendUrl}/products/${productId}`, {
      method: "PATCH",
      headers: {
        Authorization: accessToken ? `${accessToken}` : "",
      },
      body: productData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update product");
    }

    revalidateTag("PRODUCT", "default");

    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Error(error.message);
    }
    return Error("Something went wrong");
  }
};
