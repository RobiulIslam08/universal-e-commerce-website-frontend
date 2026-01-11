"use client";

import { useState, useCallback } from "react";
import { IProduct } from "@/types/product";
import { IReviewsResponse } from "@/types/review";
import { getReviewsByProductId } from "@/services/review";
import ProductDetailsTabs from "./ProductDetailsTabs";
import ReviewList from "./ReviewList";

interface ProductContentProps {
  product: IProduct;
  productId: string;
  initialReviewsData?: IReviewsResponse;
}

export default function ProductContent({
  product,
  productId,
  initialReviewsData,
}: ProductContentProps) {
  const [reviewsData, setReviewsData] = useState<IReviewsResponse>(
    initialReviewsData || {
      reviews: [],
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  );
  const [isLoading, setIsLoading] = useState(false);

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

  const handleReviewSubmitted = () => {
    fetchReviews();
  };

  return (
    <>
      {/* Tabs Section - Product Overview, Technical Specifications, Review Form */}
      <div className="mt-8 sm:mt-10 lg:mt-12">
        <ProductDetailsTabs
          product={product}
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>

      {/* Reviews List Section - Full Width Below Tabs */}
      <div className="mt-10 sm:mt-12 lg:mt-16 pt-8 sm:pt-10 lg:pt-12 border-t border-rose-100 dark:border-rose-900/50">
        {isLoading ? (
          <div className="p-6 sm:p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <svg
                className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-rose-500"
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
              <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Loading reviews...
              </span>
            </div>
          </div>
        ) : (
          <ReviewList reviewsData={reviewsData} />
        )}
      </div>
    </>
  );
}
