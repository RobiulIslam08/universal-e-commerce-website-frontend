"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const getBackendUrl = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  }
  return backendUrl;
};

const getAuthHeader = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? `${accessToken}` : "";
};

// Get all carousel slides
export const getAllCarouselSlides = async () => {
  try {
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/carousel`, {
      cache: "no-store",
      next: {
        tags: ["CAROUSEL"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error fetching carousel slides:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message, data: [] };
    }
    return { success: false, message: "Something went wrong", data: [] };
  }
};

// Get active carousel slides (for frontend display)
export const getActiveCarouselSlides = async () => {
  try {
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/carousel/active`, {
      cache: "no-store",
      next: {
        tags: ["CAROUSEL"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error fetching active carousel slides:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message, data: [] };
    }
    return { success: false, message: "Something went wrong", data: [] };
  }
};

// Get single carousel slide
export const getSingleCarouselSlide = async (slideId: string) => {
  try {
    const backendUrl = getBackendUrl();

    const res = await fetch(`${backendUrl}/carousel/${slideId}`, {
      next: {
        tags: ["CAROUSEL"],
      },
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Error fetching carousel slide:", error);
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
};

// Add new carousel slide
export const addCarouselSlide = async (slideData: FormData) => {
  try {
    const backendUrl = getBackendUrl();
    const authHeader = await getAuthHeader();

    const response = await fetch(`${backendUrl}/carousel`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: slideData,
    });

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
      throw new Error(result.message || "Failed to add carousel slide");
    }

    revalidateTag("CAROUSEL", "default");
    return result;
  } catch (error: unknown) {
    console.error("Error adding carousel slide:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

// Update carousel slide
export const updateCarouselSlide = async (
  slideId: string,
  slideData: FormData
) => {
  try {
    const backendUrl = getBackendUrl();
    const authHeader = await getAuthHeader();

    const response = await fetch(`${backendUrl}/carousel/${slideId}`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
      },
      body: slideData,
    });

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
      throw new Error(result.message || "Failed to update carousel slide");
    }

    revalidateTag("CAROUSEL", "default");
    return result;
  } catch (error: unknown) {
    console.error("Error updating carousel slide:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

// Delete carousel slide
export const deleteCarouselSlide = async (slideId: string) => {
  try {
    const backendUrl = getBackendUrl();
    const authHeader = await getAuthHeader();

    const response = await fetch(`${backendUrl}/carousel/${slideId}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete carousel slide");
    }

    revalidateTag("CAROUSEL", "default");
    return result;
  } catch (error: unknown) {
    console.error("Error deleting carousel slide:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

// Reorder carousel slides
export const reorderCarouselSlides = async (
  slides: { id: string; order: number }[]
) => {
  try {
    const backendUrl = getBackendUrl();
    const authHeader = await getAuthHeader();

    const response = await fetch(`${backendUrl}/carousel/reorder`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slides }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to reorder carousel slides");
    }

    revalidateTag("CAROUSEL", "default");
    return result;
  } catch (error: unknown) {
    console.error("Error reordering carousel slides:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

// Toggle slide active status
export const toggleCarouselSlideStatus = async (
  slideId: string,
  isActive: boolean
) => {
  try {
    const backendUrl = getBackendUrl();
    const authHeader = await getAuthHeader();

    const response = await fetch(`${backendUrl}/carousel/${slideId}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to toggle slide status");
    }

    revalidateTag("CAROUSEL", "default");
    return result;
  } catch (error: unknown) {
    console.error("Error toggling slide status:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};
