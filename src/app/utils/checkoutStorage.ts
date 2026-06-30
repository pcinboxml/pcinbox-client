import ProductI from "../interfaces/products/product.interface";
import { CheckoutStep } from "../components/timeline/checkoutSteps";
import { clearCheckoutUiSession } from "./checkoutSessionStorage";

export type CheckoutMode = "cart" | "buy_now";

/** Referencia mínima persistida en localStorage (invitado / merge al login). */
export type CartLineRef = {
  idProduct: string | number;
  quantity: number;
  storeId: number | null;
  providerId?: string | number | null;
};

export type ProductCheckoutSnapshot = CartLineRef;

/** Datos mínimos para sesión "comprar ahora" (sin reviews ni props pesadas). */
export type BuyNowSession = {
  idProduct: string;
  quantity: number;
  storeId: number | null;
  providerId: string;
  name: string;
  price: string;
  stock: number;
  imageUrl: ProductI["imageUrl"];
  sku?: string;
  description?: string;
  product_stock?: ProductI["product_stock"];
};

export const CHECKOUT_STORAGE_KEYS = {
  cart: "dataCartStorage",
  legacyCart: "dataCart",
  /** null = carrito de invitado; solo se fusiona al login si no pertenece a otra cuenta. */
  cartOwner: "cartOwnerUserId",
  buyNow: "buyNowProduct",
  checkoutMode: "checkout_mode",
  checkoutSnapshot: "checkout_products_snapshot",
  checkoutStep: "checkout_step",
  progressPay: "progressPay",
  progressPay2: "progressPay2",
} as const;

const SESSION_CHECKOUT_MODE = "checkout_mode_session";
const SESSION_CHECKOUT_STEP = "checkout_step_session";

function hasPersistedAuthToken(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return Boolean(token && token !== "null" && token !== "undefined");
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function normalizeStoreId(id: unknown): number | null {
  if (id === null || id === undefined || id === "null" || id === "") return null;
  const num = Number(id);
  return Number.isNaN(num) ? null : num;
}

export function toCartLineRef(
  product: Pick<ProductI, "idProduct" | "quantity" | "storeId" | "providerId">,
): CartLineRef {
  return {
    idProduct: product.idProduct,
    quantity: Number(product.quantity) || 1,
    storeId: normalizeStoreId(product.storeId),
    providerId: product.providerId ?? null,
  };
}

export function toCheckoutSnapshot(products: ProductI[]): ProductCheckoutSnapshot[] {
  return (products || []).map(toCartLineRef);
}

export function snapshotLineKey(line: CartLineRef): string {
  return `${line.idProduct}-${line.storeId ?? "null"}`;
}

export function toBuyNowSession(product: ProductI, quantity: number): BuyNowSession {
  return {
    idProduct: String(product.idProduct),
    quantity: Number(quantity) || 1,
    storeId: normalizeStoreId(product.storeId),
    providerId: String(product.providerId ?? ""),
    name: product.name,
    price: product.price,
    stock: Number(product.stock) || 0,
    imageUrl: product.imageUrl,
    sku: product.sku,
    description: product.description,
    product_stock: product.product_stock,
  };
}

export function buyNowSessionToProduct(session: BuyNowSession): ProductI {
  return {
    idProduct: session.idProduct,
    quantity: session.quantity,
    storeId: session.storeId ?? undefined,
    providerId: session.providerId,
    name: session.name,
    price: session.price,
    stock: session.stock,
    imageUrl: session.imageUrl,
    sku: session.sku ?? "",
    description: session.description ?? "",
    categoryId: "",
    createdAt: "",
    rating: 0,
    reviews: [],
    isPc: 0,
    isPC: 0,
    product_stock: session.product_stock,
  };
}

function isFullCartItem(item: unknown): item is ProductI {
  return (
    typeof item === "object" &&
    item !== null &&
    "name" in item &&
    "price" in item &&
    "idProduct" in item
  );
}

export function readCartLineRefs(): CartLineRef[] {
  if (typeof window === "undefined") return [];

  const raw =
    localStorage.getItem(CHECKOUT_STORAGE_KEYS.cart) ||
    localStorage.getItem(CHECKOUT_STORAGE_KEYS.legacyCart);

  const parsed = safeParse<unknown[]>(raw);
  if (!parsed?.length) return [];

  if (isFullCartItem(parsed[0])) {
    return parsed.map((p) => toCartLineRef(p as ProductI));
  }

  return parsed
    .filter(
      (item): item is CartLineRef =>
        typeof item === "object" &&
        item !== null &&
        "idProduct" in item &&
        "quantity" in item,
    )
    .map((item) => ({
      idProduct: item.idProduct,
      quantity: Number(item.quantity) || 1,
      storeId: normalizeStoreId(item.storeId),
      providerId: item.providerId ?? null,
    }));
}

export function writeCartLineRefs(refs: CartLineRef[]) {
  if (typeof window === "undefined") return;
  if (hasPersistedAuthToken()) return;
  localStorage.setItem(CHECKOUT_STORAGE_KEYS.cart, JSON.stringify(refs));
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.legacyCart);
}

export function clearCartLineRefs() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.cart);
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.legacyCart);
}

export function readBuyNowSession(): BuyNowSession | null {
  if (typeof window === "undefined") return null;
  const parsed = safeParse<BuyNowSession | ProductI>(
    localStorage.getItem(CHECKOUT_STORAGE_KEYS.buyNow),
  );
  if (!parsed || !("idProduct" in parsed)) return null;

  if ("reviews" in parsed && Array.isArray((parsed as ProductI).reviews)) {
    return toBuyNowSession(parsed as ProductI, Number(parsed.quantity) || 1);
  }

  return parsed as BuyNowSession;
}

export function writeBuyNowSession(session: BuyNowSession) {
  if (typeof window === "undefined") return;
  if (hasPersistedAuthToken()) return;
  localStorage.setItem(CHECKOUT_STORAGE_KEYS.buyNow, JSON.stringify(session));
}

export function clearBuyNowSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.buyNow);
}

export function getCheckoutMode(): CheckoutMode | null {
  if (typeof window === "undefined") return null;
  if (hasPersistedAuthToken()) {
    const sessionMode = sessionStorage.getItem(SESSION_CHECKOUT_MODE);
    return sessionMode === "cart" || sessionMode === "buy_now"
      ? sessionMode
      : null;
  }
  const mode = localStorage.getItem(CHECKOUT_STORAGE_KEYS.checkoutMode);
  return mode === "cart" || mode === "buy_now" ? mode : null;
}

export function setCheckoutMode(mode: CheckoutMode | null) {
  if (typeof window === "undefined") return;
  if (hasPersistedAuthToken()) {
    if (mode) {
      sessionStorage.setItem(SESSION_CHECKOUT_MODE, mode);
    } else {
      sessionStorage.removeItem(SESSION_CHECKOUT_MODE);
    }
    return;
  }
  if (mode) {
    localStorage.setItem(CHECKOUT_STORAGE_KEYS.checkoutMode, mode);
  } else {
    localStorage.removeItem(CHECKOUT_STORAGE_KEYS.checkoutMode);
  }
}

/** Productos activos en checkout según modo (carrito vs comprar ahora). */
export function resolveCheckoutProducts(
  checkoutMode: CheckoutMode,
  buyNowProduct: ProductI | null | undefined,
  dataCart: ProductI[] | null | undefined,
): ProductI[] {
  if (checkoutMode === "buy_now" && buyNowProduct != null) {
    return [buyNowProduct];
  }
  if (dataCart?.length) {
    return dataCart;
  }
  if (buyNowProduct != null) {
    return [buyNowProduct];
  }
  return [];
}

export function readCheckoutSnapshot(): ProductCheckoutSnapshot[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<ProductCheckoutSnapshot[]>(
    localStorage.getItem(CHECKOUT_STORAGE_KEYS.checkoutSnapshot),
  );
  if (!parsed?.length) return [];

  return parsed.map((p: any) => ({
    idProduct: p.idProduct ?? p.id,
    quantity: Number(p.quantity) || 1,
    storeId: normalizeStoreId(p.storeId),
    providerId: p.providerId ?? null,
  }));
}

export function writeCheckoutSnapshot(products: ProductCheckoutSnapshot[]) {
  if (typeof window === "undefined") return;
  if (hasPersistedAuthToken()) return;
  localStorage.setItem(
    CHECKOUT_STORAGE_KEYS.checkoutSnapshot,
    JSON.stringify(products),
  );
}

/** Sincroniza modo + snapshot mínimo según carrito / comprar ahora. */
export function syncCheckoutFromProducts(
  buyNowProduct: ProductI | null | undefined,
  dataCart: ProductI[],
  productsToShow: ProductI[] | null | undefined,
) {
  if (hasPersistedAuthToken()) return;

  if (buyNowProduct != null && dataCart.length === 0) {
    setCheckoutMode("buy_now");
    if (productsToShow?.length) {
      writeCheckoutSnapshot(toCheckoutSnapshot(productsToShow));
    }
    return;
  }

  if (dataCart.length > 0 && buyNowProduct == null) {
    setCheckoutMode("cart");
    if (productsToShow?.length) {
      writeCheckoutSnapshot(toCheckoutSnapshot(productsToShow));
    }
    return;
  }

  if (buyNowProduct == null && dataCart.length === 0) {
    setCheckoutMode(null);
    clearCheckoutSnapshot();
  }
}

export function clearCheckoutProgressStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.progressPay);
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.progressPay2);
  clearCheckoutUiSession();
}

export function clearCheckoutSnapshot() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.checkoutSnapshot);
}

function clearPersistedCheckoutModeAndStep() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.checkoutMode);
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.checkoutStep);
  sessionStorage.removeItem(SESSION_CHECKOUT_MODE);
  sessionStorage.removeItem(SESSION_CHECKOUT_STEP);
}

export function getCheckoutStep(): CheckoutStep | null {
  if (typeof window === "undefined") return null;
  const raw = hasPersistedAuthToken()
    ? sessionStorage.getItem(SESSION_CHECKOUT_STEP)
    : localStorage.getItem(CHECKOUT_STORAGE_KEYS.checkoutStep);
  if (raw === null || raw === "") return null;
  const step = Number(raw);
  return Number.isNaN(step) ? null : (step as CheckoutStep);
}

export function setCheckoutStep(step: CheckoutStep | null) {
  if (typeof window === "undefined") return;
  if (hasPersistedAuthToken()) {
    if (step === null) {
      sessionStorage.removeItem(SESSION_CHECKOUT_STEP);
    } else {
      sessionStorage.setItem(SESSION_CHECKOUT_STEP, String(step));
    }
    return;
  }
  if (step === null) {
    localStorage.removeItem(CHECKOUT_STORAGE_KEYS.checkoutStep);
  } else {
    localStorage.setItem(CHECKOUT_STORAGE_KEYS.checkoutStep, String(step));
  }
}

export type ClearCheckoutOptions = {
  clearCartRefs?: boolean;
  clearProgress?: boolean;
  clearBuyNow?: boolean;
  clearSnapshot?: boolean;
  clearStep?: boolean;
  clearMode?: boolean;
};

/** Limpia buy now y progreso de checkout sin tocar el carrito de invitado (para merge al login). */
export function clearGuestBuyNowAndCheckoutProgress() {
  if (typeof window === "undefined") return;
  clearBuyNowSession();
  clearPersistedCheckoutModeAndStep();
  clearCheckoutSnapshot();
  clearCheckoutProgressStorage();
}

/** Limpia todo el checkout persistido al cambiar de cuenta o cerrar sesión. */
export function clearAccountScopedCheckoutStorage() {
  if (typeof window === "undefined") return;
  clearCartLineRefs();
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.cartOwner);
  clearGuestBuyNowAndCheckoutProgress();
}

/** Limpia estado de checkout en localStorage (sin tocar token ni perfil). */
export function clearCheckoutLocalStorage(options: ClearCheckoutOptions = {}) {
  if (typeof window === "undefined") return;

  const {
    clearCartRefs = false,
    clearProgress = true,
    clearBuyNow = true,
    clearSnapshot = true,
    clearStep = true,
    clearMode = true,
  } = options;

  if (clearProgress) {
    clearCheckoutProgressStorage();
  }
  if (clearBuyNow) clearBuyNowSession();
  if (clearSnapshot) clearCheckoutSnapshot();
  if (clearStep || clearMode) clearPersistedCheckoutModeAndStep();
  if (clearCartRefs) clearCartLineRefs();
}

/** Tras compra exitosa: carrito, buy now y progreso de checkout. */
export function clearPostPurchaseStorage() {
  clearCheckoutLocalStorage({
    clearCartRefs: true,
    clearProgress: true,
    clearBuyNow: true,
    clearSnapshot: true,
    clearStep: true,
    clearMode: true,
  });
}

/** Inicia sesión comprar ahora sin alterar el carrito persistido. */
export function persistBuyNowSession(product: ProductI, quantity: number) {
  const session = toBuyNowSession(product, quantity);
  if (!hasPersistedAuthToken()) {
    writeBuyNowSession(session);
    clearCheckoutProgressStorage();
    setCheckoutStep(null);
    clearCheckoutSnapshot();
  }
  setCheckoutMode("buy_now");
  return session;
}

/** Abandona comprar ahora y vuelve al flujo de carrito. */
export function abandonBuyNowSession() {
  clearBuyNowSession();
  setCheckoutMode("cart");
  setCheckoutStep(null);
  clearCheckoutSnapshot();
  clearCheckoutProgressStorage();
}
