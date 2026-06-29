import ProductI from "@/app/interfaces/products/product.interface";
import { publicEnv } from "@/app/config/env";

const API_BASE_URL = publicEnv.apiUrlProveedor;

export async function getProductServer(
  idProduct: string,
): Promise<ProductI | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/getProduct/${idProduct}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data?.data ?? null;
  } catch {
    return null;
  }
}

export function formatProductPrice(price: string | number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(price));
}

export function truncateText(text: string, maxLength: number): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length <= maxLength) return cleaned;

  const truncated = cleaned.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.6) {
    return `${truncated.slice(0, lastSpace).trim()}…`;
  }

  return `${truncated.trim()}…`;
}

export function getProductImageUrl(product: ProductI): string | undefined {
  const image =
    product.imageUrl?.[0] ??
    (product as ProductI & { image_url?: string[] }).image_url?.[0];

  if (!image) return undefined;
  if (image.startsWith("http")) return image;

  const base = publicEnv.apiUrlProveedor.replace(/\/api\/v1$/, "");
  return `${base}${image.startsWith("/") ? image : `/${image}`}`;
}
