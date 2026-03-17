import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch(
      "https://server-proveedores-a69933baa01a.herokuapp.com/api/v1/getAllProductsForSitemap",
      { cache: "no-store" },
    );

    const data = await res.json();
    const products = Array.isArray(data?.data) ? data.data : [];

    const urls = products.map(
      (product: any) => `
  <url>
    <loc>https://www.pcinbox.com.mx/product/${product.idProduct}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`,
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.pcinbox.com.mx</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${urls.join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch {
    return new NextResponse("", { status: 500 });
  }
}
