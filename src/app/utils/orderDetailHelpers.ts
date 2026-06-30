import { HistoryComprasI } from "../interfaces/compras/historyCompras.interface";
import { SalesByUserI } from "../interfaces/compras/salesByUser.interface";

const DETAIL_ELIGIBLE_PRODUCT_STATUSES = new Set([
  "entregado",
  "disponible",
  "cancelado",
  "completada",
  "completado",
]);

const COMPLETED_SHIPMENT_STATUSES = new Set([
  "entregado",
  "disponible",
  "completada",
  "completado",
]);

export type OrderDetailMode = "delivered" | "pickup" | "cancelled";

export function canViewOrderDetails(historyCompra: HistoryComprasI): boolean {
  const products = historyCompra.products || [];
  if (products.length === 0) return false;

  return products.every((item) =>
    DETAIL_ELIGIBLE_PRODUCT_STATUSES.has(
      String(item.statusShip ?? "").toLowerCase(),
    ),
  );
}

export function resolveOrderDetailMode(
  data: SalesByUserI | null,
): OrderDetailMode | null {
  if (!data?.sales?.length) return null;

  const shipmentStatuses = (data.shipments ?? []).map((s) =>
    String(s.status ?? "").toLowerCase(),
  );

  if (
    data.status === "cancelled" ||
    shipmentStatuses.some((status) => status === "cancelado")
  ) {
    return "cancelled";
  }

  if (data.status !== "paid" || shipmentStatuses.length === 0) {
    return null;
  }

  if (shipmentStatuses.every((status) => status === "disponible")) {
    return "pickup";
  }

  if (shipmentStatuses.every((status) => COMPLETED_SHIPMENT_STATUSES.has(status))) {
    return "delivered";
  }

  return null;
}

export function getOrderDetailHeader(mode: OrderDetailMode): {
  label: string;
  subtitle: string;
} {
  if (mode === "cancelled") {
    return {
      label: "Compra cancelada",
      subtitle: "Esta compra fue cancelada",
    };
  }

  if (mode === "pickup") {
    return {
      label: "Pedido completado",
      subtitle: "Recogido en sucursal PCInbox",
    };
  }

  return {
    label: "Pedido completado",
    subtitle: "Entregado exitosamente",
  };
}
