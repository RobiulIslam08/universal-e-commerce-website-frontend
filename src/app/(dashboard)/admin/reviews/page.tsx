"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { IReview } from "@/types/review";
import {
  getAllReviews,
  deleteReview,
  toggleReviewApproval,
} from "@/services/review";

// Star Rating Display Component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${
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

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await getAllReviews();
      if (response.success && response.data) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    if (filter === "approved") return review.isApproved;
    if (filter === "pending") return !review.isApproved;
    return true;
  });

  // Handle delete review
  const handleDelete = (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    startTransition(async () => {
      try {
        await deleteReview(reviewId);
        setActionMessage({
          type: "success",
          text: "Review deleted successfully",
        });
        fetchReviews();
        setTimeout(() => setActionMessage(null), 3000);
      } catch (error) {
        setActionMessage({
          type: "error",
          text:
            error instanceof Error ? error.message : "Failed to delete review",
        });
        setTimeout(() => setActionMessage(null), 3000);
      }
    });
  };

  // Handle toggle approval
  const handleToggleApproval = (reviewId: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleReviewApproval(reviewId);
        setActionMessage({
          type: "success",
          text: `Review ${
            currentStatus ? "disapproved" : "approved"
          } successfully`,
        });
        fetchReviews();
        setTimeout(() => setActionMessage(null), 3000);
      } catch (error) {
        setActionMessage({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "Failed to update review status",
        });
        setTimeout(() => setActionMessage(null), 3000);
      }
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get product info
  const getProductInfo = (review: IReview) => {
    if (typeof review.productId === "object" && review.productId !== null) {
      return {
        title: review.productId.title || "Unknown Product",
        image: review.productId.images?.[0] || null,
      };
    }
    return { title: "Unknown Product", image: null };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          📝 Reviews Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage customer reviews, approve or delete reviews
        </p>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            actionMessage.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Reviews
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {reviews.length}
              </p>
            </div>
            <span className="text-4xl">📊</span>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Approved
              </p>
              <p className="text-3xl font-bold text-green-600">
                {reviews.filter((r) => r.isApproved).length}
              </p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {reviews.filter((r) => !r.isApproved).length}
              </p>
            </div>
            <span className="text-4xl">⏳</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "approved", "pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
              filter === tab
                ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {tab}
            <span className="ml-2 text-sm">
              (
              {tab === "all"
                ? reviews.length
                : tab === "approved"
                ? reviews.filter((r) => r.isApproved).length
                : reviews.filter((r) => !r.isApproved).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-rose-500"
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
            <span className="text-slate-600 dark:text-slate-400 text-lg">
              Loading reviews...
            </span>
          </div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No Reviews Found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {filter === "all"
              ? "There are no reviews yet"
              : `There are no ${filter} reviews`}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Reviewer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Review
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredReviews.map((review) => {
                  const productInfo = getProductInfo(review);
                  return (
                    <tr
                      key={review._id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {productInfo.image ? (
                            <Image
                              src={productInfo.image}
                              alt={productInfo.title}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl">
                              📦
                            </div>
                          )}
                          <span className="font-medium text-slate-800 dark:text-slate-200 max-w-[150px] truncate">
                            {productInfo.title}
                          </span>
                        </div>
                      </td>

                      {/* Reviewer */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {review.reviewerName}
                          </p>
                          {review.reviewerEmail && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {review.reviewerEmail}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">
                        <StarRating rating={review.rating} />
                      </td>

                      {/* Review */}
                      <td className="px-6 py-4 max-w-[250px]">
                        {review.title && (
                          <p className="font-medium text-slate-800 dark:text-slate-200 mb-1 truncate">
                            {review.title}
                          </p>
                        )}
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {review.comment}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            review.isApproved
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {review.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(review.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleToggleApproval(
                                review._id,
                                review.isApproved
                              )
                            }
                            disabled={isPending}
                            className={`p-2 rounded-lg transition-all ${
                              review.isApproved
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                                : "bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50"
                            } disabled:opacity-50`}
                            title={review.isApproved ? "Disapprove" : "Approve"}
                          >
                            {review.isApproved ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5"/>
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            disabled={isPending}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
