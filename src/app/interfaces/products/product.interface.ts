export default interface ProductI {
  categoryId: string;
  createdAt: string;
  description: string;
  idProduct: string;
  image_url: string;
  name: string;
  price: string;
  providerId: string;
  stock: number;
  quantity: number;
  rating: number;
  reviews: {
    idReview: string;
    productId: string;
    rating: number;
    description: string;
    date: string;
    reviewerName: string;
  }[];
}
