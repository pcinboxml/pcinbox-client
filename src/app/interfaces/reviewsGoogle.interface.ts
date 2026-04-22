export interface ReviewsGoogleI {
  html_attributions: any[];
  result: {
    name: string;
    rating: number;
    reviews: {
      author_name: string;
      author_url: string;
      language: string;
      original_language: string;
      profile_photo_url: string;
      rating: number;
      relative_time_description: string;
      text: string;
      time: number;
      translated: boolean;
    }[];
  };
  status: string;
}
