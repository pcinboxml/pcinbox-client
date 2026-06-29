import ProductI from "../interfaces/products/product.interface";
import {
  CartLineRef,
  ProductCheckoutSnapshot,
  normalizeStoreId,
  snapshotLineKey,
  toCartLineRef,
  toCheckoutSnapshot,
} from "./checkoutStorage";

export type DeliveryGroup = {
  providerId: string;
  storeId: number | null;
};

export function deliveryGroupKey(group: DeliveryGroup): string {
  return `${group.providerId}-${group.storeId ?? "null"}`;
}

export function getDeliveryGroup(
  product: Pick<ProductI, "providerId" | "storeId">,
): DeliveryGroup {
  return {
    providerId: String(product.providerId ?? ""),
    storeId: normalizeStoreId(product.storeId),
  };
}

export function getUniqueDeliveryGroups(products: ProductI[]): DeliveryGroup[] {
  const map = new Map<string, DeliveryGroup>();
  for (const product of products) {
    const group = getDeliveryGroup(product);
    map.set(deliveryGroupKey(group), group);
  }
  return Array.from(map.values());
}

export function snapshotToDeliveryGroups(
  snapshot: ProductCheckoutSnapshot[],
): DeliveryGroup[] {
  const map = new Map<string, DeliveryGroup>();
  for (const line of snapshot) {
    const group: DeliveryGroup = {
      providerId: String(line.providerId ?? ""),
      storeId: normalizeStoreId(line.storeId),
    };
    map.set(deliveryGroupKey(group), group);
  }
  return Array.from(map.values());
}

export function hasCartLinesChanged(
  previous: ProductCheckoutSnapshot[],
  current: ProductI[],
): boolean {
  const prevMap = new Map<string, ProductCheckoutSnapshot>();
  previous.forEach((p) => prevMap.set(snapshotLineKey(p), p));

  const currentLines = toCheckoutSnapshot(current);

  if (currentLines.length !== previous.length) return true;

  return currentLines.some((line) => {
    const prev = prevMap.get(snapshotLineKey(line));
    if (!prev) return true;
    return Number(prev.quantity) !== Number(line.quantity);
  });
}

/**
 * Requiere reconfigurar entrega cuando el carrito introduce combinaciones
 * proveedor+sucursal que no existían en el snapshot (p. ej. otro proveedor u otra sucursal).
 * Si el producto nuevo comparte proveedor y sucursal con los existentes, no aplica.
 */
export function requiresDeliveryReconfiguration(
  previousSnapshot: ProductCheckoutSnapshot[],
  currentProducts: ProductI[],
): boolean {
  if (!previousSnapshot.length || !currentProducts.length) return false;

  const previousGroups = snapshotToDeliveryGroups(previousSnapshot);
  const currentGroups = getUniqueDeliveryGroups(currentProducts);

  const previousKeys = new Set(previousGroups.map(deliveryGroupKey));

  return currentGroups.some(
    (group) => !previousKeys.has(deliveryGroupKey(group)),
  );
}

export type CheckoutProceedResult = {
  canProceed: boolean;
  needsDeliveryWarning: boolean;
  cartChanged: boolean;
};

/** Valida si puede avanzar desde confirmar productos hacia opciones de entrega. */
export function evaluateCheckoutProceed(
  previousSnapshot: ProductCheckoutSnapshot[],
  currentProducts: ProductI[],
): CheckoutProceedResult {
  const cartChanged = hasCartLinesChanged(previousSnapshot, currentProducts);
  const needsDeliveryWarning = requiresDeliveryReconfiguration(
    previousSnapshot,
    currentProducts,
  );

  return {
    canProceed: true,
    needsDeliveryWarning,
    cartChanged,
  };
}

export function normalizeSnapshotFromLegacy(
  raw: ProductCheckoutSnapshot[] | { id: number; quantity: number; storeId: number | null }[],
): ProductCheckoutSnapshot[] {
  return (raw || []).map((item: any) => ({
    idProduct: item.idProduct ?? item.id,
    quantity: Number(item.quantity) || 1,
    storeId: normalizeStoreId(item.storeId),
    providerId: item.providerId ?? null,
  }));
}

export function productsMatchSnapshot(
  products: ProductI[],
  snapshot: ProductCheckoutSnapshot[],
): boolean {
  return !hasCartLinesChanged(snapshot, products);
}

export { toCartLineRef, toCheckoutSnapshot };
