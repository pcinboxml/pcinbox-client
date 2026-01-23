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
  width?: any;
  height?: any;
  largo?: any;
  product_stock?: {
    idProductStock: number;
    branchId: number;
    productId: number;
    stock: number;
    branches?: {
      city: string | null;
      idBranche: number;
      name: string;
      providerId: number;
    };
  }[];
  reviews: {
    idReview: string;
    productId: string;
    rating: number;
    title: string;
    description: string;
    date: string;
    reviewerName: string;
  }[];
  storeId?: number;
}
