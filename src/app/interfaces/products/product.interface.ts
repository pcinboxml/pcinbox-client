export default interface ProductI {
  categoryId: string;
  createdAt: string;
  description: string;
  idProduct: string;
  idProductExt?: any;
  imageUrl: any;
  name: string;
  price: string;
  providerId: string;
  stock: number;
  quantity: number;
  rating: number;
  sku: string;
  caracteristicas?: any;
  upc?: any;
  reviews: {
    idReview: string;
    productId: string;
    rating: number;
    title: string;
    description: string;
    date: string;
    reviewerName: string;
  }[];
}
