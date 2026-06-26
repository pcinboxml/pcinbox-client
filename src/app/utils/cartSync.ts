import ProductI from "../interfaces/products/product.interface";

export const CART_STORAGE_KEY = "dataCartStorage";
export const LEGACY_CART_STORAGE_KEY = "dataCart";

export function getCartLineKey(product: Pick<ProductI, "idProduct" | "storeId">) {
  return `${product.idProduct}-${product.storeId ?? ""}`;
}

export function readLocalCartStorage(): ProductI[] {
  if (typeof window === "undefined") return [];

  try {
    const raw =
      localStorage.getItem(CART_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeLocalCartStorage(items: ProductI[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
}

export function clearLocalCartStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
}

export function hasAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return Boolean(token && token !== "null" && token !== "undefined");
}
