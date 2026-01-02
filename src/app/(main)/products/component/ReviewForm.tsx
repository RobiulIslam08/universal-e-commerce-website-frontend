"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useTransition } from "react";
import { createReview } from "@/services/review";
import { IReviewFormData } from "@/types/review";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

interface ReviewFormFields {
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  title: string;
  comment: string;
}

export default function ReviewForm({
  productId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormFields>({
    defaultValues: {
      reviewerName: "",
      reviewerEmail: "",
      rating: 5,
      title: "",
      comment: "",
    },
  });

  const onFormSubmit = async (data: ReviewFormFields) => {
    setSubmitStatus("idle");
    setErrorMessage("");

    const reviewData: IReviewFormData = {
      productId,
      reviewerName: data.reviewerName,
      reviewerEmail: data.reviewerEmail || undefined,
      rating: data.rating,
      title: data.title || undefined,
      comment: data.comment,
    };

    startTransition(async () => {
      try {
        await createReview(reviewData);
        setSubmitStatus("success");
        reset();

        // Notify parent to refresh reviews
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 5000);
      } catch (error) {
        setSubmitStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to submit review"
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800"
    >
      <h2 className="text-2xl font-bold mb-6 text-rose-600 dark:text-rose-400">
        Write a Review
      </h2>

      {/* Success Message */}
      {submitStatus === "success" && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
            <span>✓</span>
            Thank you for your review! It has been submitted successfully.
          </p>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === "error" && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 font-semibold flex items-center gap-2">
            <span>✗</span>
            {errorMessage}
          </p>
        </div>
      )}

      {/* Rating */}
      <div className="mb-5">
        <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
          Rating <span className="text-red-500">*</span>
        </label>
        <Controller
          name="rating"
          control={control}
          rules={{ required: true, min: 1, max: 5 }}
          render={({ field }) => (
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => field.onChange(star)}
                  className={`text-3xl transition-all duration-200 hover:scale-110 ${
                    star <= field.value
                      ? "text-yellow-400 drop-shadow-md"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
                {field.value} / 5
              </span>
            </div>
          )}
        />
        {errors.rating && (
          <span className="text-red-500 text-sm mt-1 block">
            Rating is required
          </span>
        )}
      </div>

      {/* Name */}
      <div className="mb-5">
        <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("reviewerName", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Name cannot exceed 100 characters",
            },
          })}
          placeholder="Enter your name"
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
                     bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     transition-all duration-200"
        />
        {errors.reviewerName && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.reviewerName.message}
          </span>
        )}
      </div>

      {/* Email (Optional) */}
      <div className="mb-5">
        <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
          Email <span className="text-slate-400 text-sm">(Optional)</span>
        </label>
        <input
          type="email"
          {...register("reviewerEmail", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          placeholder="your@email.com"
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
                     bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     transition-all duration-200"
        />
        {errors.reviewerEmail && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.reviewerEmail.message}
          </span>
        )}
      </div>

      {/* Review Title (Optional) */}
      <div className="mb-5">
        <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
          Review Title{" "}
          <span className="text-slate-400 text-sm">(Optional)</span>
        </label>
        <input
          type="text"
          {...register("title", {
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
            maxLength: {
              value: 200,
              message: "Title cannot exceed 200 characters",
            },
          })}
          placeholder="Summarize your review"
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
                     bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     transition-all duration-200"
        />
        {errors.title && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("comment", {
            required: "Review comment is required",
            minLength: {
              value: 10,
              message: "Comment must be at least 10 characters",
            },
            maxLength: {
              value: 1000,
              message: "Comment cannot exceed 1000 characters",
            },
          })}
          placeholder="Share your experience with this product..."
          rows={5}
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent
                     bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     transition-all duration-200 resize-none"
        />
        {errors.comment && (
          <span className="text-red-500 text-sm mt-1 block">
            {errors.comment.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 
                   text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg hover:shadow-xl hover:shadow-rose-500/20
                   transform hover:-translate-y-0.5"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
            Submitting...
          </span>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}
