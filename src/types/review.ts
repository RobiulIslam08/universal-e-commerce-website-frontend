export interface IReview {
  _id: string;
  productId:
    | string
    | {
        _id: string;
        title: string;
        images?: string[];
      };
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IReviewFormData {
  productId: string;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface IReviewsResponse {
  reviews: IReview[];
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface IReviewApiResponse {
  success: boolean;
  message: string;
  data: IReview | IReview[] | IReviewsResponse;
}
