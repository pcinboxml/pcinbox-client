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



export function getCartOwnerUserId(): string | null {
  if (typeof window === "undefined") return null;
  const owner = localStorage.getItem(CHECKOUT_STORAGE_KEYS.cartOwner);
  return owner && owner !== "null" ? owner : null;
}

export function setCartOwnerUserId(userId: string | null) {
  if (typeof window === "undefined") return;
  if (userId) {
    localStorage.setItem(CHECKOUT_STORAGE_KEYS.cartOwner, String(userId));
  } else {
    localStorage.removeItem(CHECKOUT_STORAGE_KEYS.cartOwner);
  }
}

export function clearCartOwnerUserId() {
  setCartOwnerUserId(null);
}

/** Devuelve refs mínimas persistidas (no ProductI completos). */

export function readLocalCartStorage(): CartLineRef[] {
  return readCartLineRefs();
}

/** Solo devuelve carrito local de invitado (sin dueño). Nunca fusiona carrito de otra cuenta. */
export function readLocalCartStorageForMerge(): CartLineRef[] {
  const refs = readCartLineRefs();
  if (!refs.length) return [];
  if (getCartOwnerUserId()) return [];
  return refs;
}

export function discardStaleLocalCartIfNotMergeable() {
  const refs = readCartLineRefs();
  if (!refs.length) return;
  if (readLocalCartStorageForMerge().length === 0) {
    clearLocalCartStorage();
  }
}



export function writeLocalCartRefs(refs: CartLineRef[]) {

  writeCartLineRefs(refs);

}



/** Persiste solo refs mínimas derivadas del carrito en memoria. */

export function writeLocalCartStorageFromProducts(items: ProductI[]) {
  if (typeof window === "undefined") return;
  if (hasAuthToken()) return;

  const refs: CartLineRef[] = items.map((item) => ({
    idProduct: item.idProduct,
    quantity: Number(item.quantity) || 1,
    storeId: item.storeId ?? null,
    providerId: item.providerId ?? null,
  }));

  writeCartLineRefs(refs);
  clearCartOwnerUserId();
}

export function clearLocalCartStorage() {
  clearCartLineRefs();
  clearCartOwnerUserId();
}



export { hasAuthToken };


