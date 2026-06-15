export interface FeaturableReview {
  reviewId: string | null;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
    isAnonymous: boolean;
  };
  starRating: number;
  comment: string;
  createTime: string | null;
  updateTime: string | null;
}

export interface FeaturableReviewsResponse {
  success: boolean;
  reviews: FeaturableReview[];
  profileUrl?: string;
  totalReviewCount?: number;
  averageRating?: number;
}
