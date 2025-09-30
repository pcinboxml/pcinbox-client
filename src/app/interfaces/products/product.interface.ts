export default interface ProductI {
  categoryId: string;
  createdAt: string;
  description: string;
  idProduct: string;
  imageUrl: any;
  name: string;
  price: string;
  providerId: string;
  stock: number;
  quantity: number;
  rating: number;
  sku: string;
  reviews: {
    idReview: string;
    productId: string;
    rating: number;
    description: string;
    date: string;
    reviewerName: string;
  }[];
}
