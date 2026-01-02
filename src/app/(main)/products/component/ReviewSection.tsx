"use client";

import { useState, useEffect, useCallback } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { getReviewsByProductId } from "@/services/review";
import { IReviewsResponse } from "@/types/review";

interface ReviewSectionProps {
  productId: string;
  initialReviewsData?: IReviewsResponse;
}

export default function ReviewSection({
  productId,
  initialReviewsData,
}: ReviewSectionProps) {
  const [reviewsData, setReviewsData] = useState<IReviewsResponse>(
    initialReviewsData || {
      reviews: [],
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  );
  const [isLoading, setIsLoading] = useState(!initialReviewsData);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getReviewsByProductId(productId);
      if (response.success && response.data) {
        setReviewsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!initialReviewsData) {
      fetchReviews();
    }
  }, [initialReviewsData, fetchReviews]);

  const handleReviewSubmitted = () => {
    // Refresh reviews when a new review is submitted
    fetchReviews();
  };

  return (
    <div className="space-y-8">
      {/* Reviews List - Shown first */}
      {isLoading ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-rose-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-slate-600 dark:text-slate-400">
              Loading reviews...
            </span>
          </div>
        </div>
      ) : (
        <ReviewList reviewsData={reviewsData} />
      )}

      {/* Review Form - Shown below reviews */}
      <ReviewForm
        productId={productId}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
