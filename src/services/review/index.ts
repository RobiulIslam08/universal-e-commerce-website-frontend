"use server";

import { revalidateTag } from "next/cache";
import { IReviewFormData, IReviewsResponse, IReview } from "@/types/review";

const getBackendUrl = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  }
  return backendUrl;
};

// Create a new review (public)
export const createReview = async (reviewData: IReviewFormData) => {
  try {
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit review");
    }

    revalidateTag("REVIEWS", "default");

    return result;
  } catch (error: unknown) {
    console.error("Error creating review:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

// Get all reviews for a specific product (public)
export const getReviewsByProductId = async (
  productId: string
): Promise<{ success: boolean; data: IReviewsResponse }> => {
  try {
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/reviews/product/${productId}`, {
      cache: "no-store",
      next: {
        tags: ["REVIEWS"],
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch reviews: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        data: {
          reviews: [],
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      };
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      data: {
        reviews: [],
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      },
    };
  }
};

// Get all reviews (admin)
export const getAllReviews = async (): Promise<{
  success: boolean;
  data: IReview[];
}> => {
  try {
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/reviews/admin/all`, {
      cache: "no-store",
      next: {
        tags: ["REVIEWS"],
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch all reviews: ${response.status} ${response.statusText}`
      );
      return { success: false, data: [] };
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.error("Error fetching all reviews:", error);
    return { success: false, data: [] };
  }
};

// Get pending reviews (admin)
export const getPendingReviews = async (): Promise<{
  success: boolean;
  data: IReview[];
}> => {
  try {
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/reviews/admin/pending`, {
      cache: "no-store",
      next: {
        tags: ["REVIEWS"],
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch pending reviews: ${response.status} ${response.statusText}`
      );
      return { success: false, data: [] };
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.error("Error fetching pending reviews:", error);
    return { success: false, data: [] };
  }
};

// Toggle review approval (admin)
export const toggleReviewApproval = async (reviewId: string) => {
  try {
    const backendUrl = getBackendUrl();

    const response = await fetch(
      `${backendUrl}/reviews/admin/toggle-approval/${reviewId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to toggle review approval");
    }

    revalidateTag("REVIEWS", "default");

    return result;
  } catch (error: unknown) {
    console.error("Error toggling review approval:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

// Delete review (admin)
export const deleteReview = async (reviewId: string) => {
  try {
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete review");
    }

    revalidateTag("REVIEWS", "default");

    return result;
  } catch (error: unknown) {
    console.error("Error deleting review:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong");
  }
};

// Get single review by ID
export const getSingleReview = async (reviewId: string) => {
  try {
    const backendUrl = getBackendUrl();

    const response = await fetch(`${backendUrl}/reviews/${reviewId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch review: ${response.status} ${response.statusText}`
      );
      return { success: false, data: null };
    }

    const result = await response.json();
    return result;
  } catch (error: unknown) {
    console.error("Error fetching review:", error);
    return { success: false, data: null };
  }
};
