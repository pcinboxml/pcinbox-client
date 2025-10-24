import ProductI from "../products/product.interface";

export interface FavoritesI {
  idFavorite: number;
  productId: number;
  userId: number;
  image_url: string[];
  createdAt?: string;
  products?: ProductI;
}
