/** Agrega transformación ImageKit sin romper URLs que ya tienen query params. */
export function appendImageKitTransform(
  url: string,
  transform: string,
): string {
  if (!url || !url.includes("ik.imagekit.io")) return url;
  if (/[?&]tr=/.test(url)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}tr=${transform}`;
}

export function getPrincipalBannerUrls(): string[] {
  const env =
    process.env.NEXT_PUBLIC_NODE_ENV === "local" ? "local" : "prod";
  return [1, 2, 3, 4, 5].map(
    (n) =>
      `https://ik.imagekit.io/pcinboxkit/${env}/carrusel-principal/banner_prin_0${n}.png`,
  );
}
