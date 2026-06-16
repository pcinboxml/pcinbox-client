const IMAGEKIT_HOST = "ik.imagekit.io";

export type OptimizeImageOptions = {
  width?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
};

/** Tamaños pensados para pantallas retina (2x del tamaño visible). */
export const IMAGE_SIZES = {
  thumbnail: 160,
  card: 300,
  cardLg: 400,
  banner: 1200,
  categoryBanner: 1400,
  productDetail: 900,
  productZoom: 1600,
  icon: 36,
} as const;

/**
 * Aplica transformaciones de ImageKit (resize, calidad, formato moderno).
 * URLs que no son de ImageKit se devuelven sin cambios.
 */
export function optimizeImageUrl(
  url: string | null | undefined,
  {
    width = 800,
    quality = 70,
    format = "auto",
  }: OptimizeImageOptions = {},
): string {
  if (!url) return "";

  if (!url.includes(IMAGEKIT_HOST)) {
    return url;
  }

  try {
    const parsed = new URL(url);
    parsed.searchParams.set("tr", `w-${width},q-${quality},f-${format}`);
    return parsed.toString();
  } catch {
    const [base, query = ""] = url.split("?");
    const params = new URLSearchParams(query);
    params.set("tr", `w-${width},q-${quality},f-${format}`);
    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  }
}
