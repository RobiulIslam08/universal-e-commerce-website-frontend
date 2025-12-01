"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const addProduct = async (productData: FormData) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/create-product`,
      {
        method: "POST",
        headers: {
          Authorization: accessToken ? `${accessToken}` : "",
        },
        body: productData,
      }
    );

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
