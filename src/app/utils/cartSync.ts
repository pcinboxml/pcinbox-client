import ProductI from "../interfaces/products/product.interface";

import {

  CHECKOUT_STORAGE_KEYS,

  CartLineRef,

  clearCartLineRefs,

  readCartLineRefs,

  writeCartLineRefs,

} from "./checkoutStorage";

import { hasAuthToken } from "./authStorage";



export const CART_STORAGE_KEY = CHECKOUT_STORAGE_KEYS.cart;

export const LEGACY_CART_STORAGE_KEY = CHECKOUT_STORAGE_KEYS.legacyCart;



export function getCartLineKey(product: Pick<ProductI, "idProduct" | "storeId">) {

  return `${product.idProduct}-${product.storeId ?? ""}`;

}



/** Devuelve refs mínimas persistidas (no ProductI completos). */

export function readLocalCartStorage(): CartLineRef[] {

  return readCartLineRefs();

}



export function writeLocalCartRefs(refs: CartLineRef[]) {

  writeCartLineRefs(refs);

}



/** Persiste solo refs mínimas derivadas del carrito en memoria. */

export function writeLocalCartStorageFromProducts(items: ProductI[]) {

  if (typeof window === "undefined") return;

  const refs: CartLineRef[] = items.map((item) => ({

    idProduct: item.idProduct,

    quantity: Number(item.quantity) || 1,

    storeId: item.storeId ?? null,

    providerId: item.providerId ?? null,

  }));

  writeCartLineRefs(refs);

}



export function clearLocalCartStorage() {

  clearCartLineRefs();

}



export { hasAuthToken };


