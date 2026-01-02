"use client";

import { IReview, IReviewsResponse } from "@/types/review";

interface ReviewListProps {
  reviewsData: IReviewsResponse;
}

// Star Rating Display Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Rating Distribution Bar
function RatingBar({
  rating,
  count,
  total,
}: {
  rating: number;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-400 w-8">
        {rating}★
      </span>
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400 w-8 text-right">
        {count}
      </span>
    </div>
  );
}

// Single Review Card
function ReviewCard({ review }: { review: IReview }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {review.reviewerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
              {review.reviewerName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
          {review.title}
        </h5>
      )}

      {/* Review Comment */}
      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}

export default function ReviewList({ reviewsData }: ReviewListProps) {
  const { reviews, totalReviews, averageRating, ratingDistribution } =
    reviewsData;

  return (
    <div className="space-y-6">
      {/* Reviews Summary Header */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
          Customer Reviews
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <div className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={Math.round(averageRating)} />
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-4">
              Rating Distribution
            </h4>
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={
                  ratingDistribution[rating as keyof typeof ratingDistribution]
                }
                total={totalReviews}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-4xl mb-3">📝</div>
          <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Reviews Yet
          </h4>
          <p className="text-slate-500 dark:text-slate-400">
            Be the first to share your experience with this product!
          </p>
        </div>
      )}
    </div>
  );
}
