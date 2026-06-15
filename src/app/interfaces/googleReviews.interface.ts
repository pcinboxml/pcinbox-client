export interface GoogleReviewItem {
  id: string;
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  date: string;
}

export interface GoogleReviewsData {
  name: string;
  rating: number;
  googleReviewsUrl?: string;
  reviews: GoogleReviewItem[];
}
