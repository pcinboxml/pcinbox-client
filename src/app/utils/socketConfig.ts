import { publicEnv } from "@/app/config/env";

/** URL del socket de proveedores (stock, reservas, etc.). */
export function getSocketProveedorUrl(): string | null {
  return publicEnv.socketProveedor || null;
}

/** URL del socket de pasarela de pagos (órdenes, stock post-pago). */
export function getSocketPagosUrl(): string | null {
  return publicEnv.socketPagos || null;
}
