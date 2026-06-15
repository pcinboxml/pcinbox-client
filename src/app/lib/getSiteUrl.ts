export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "local") {
    return "http://localhost:3000";
  }

  return "https://www.pcinbox.com.mx";
}

export function getProductUrl(idProduct: string | number): string {
  return `${getSiteUrl()}/detailsProduct/${idProduct}`;
}
