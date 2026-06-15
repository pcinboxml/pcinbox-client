import type { Metadata } from "next";
import {
  formatProductPrice,
  getProductImageUrl,
  getProductServer,
  truncateText
} from "@/app/lib/getProductServer";
import { getProductUrl } from "@/app/lib/getSiteUrl";

type Props = {
  children: React.ReactNode;
  params: Promise<{ idProduct: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { idProduct } = await params;
  const product = await getProductServer(idProduct);

  if (!product) {
    return {
      title: "Producto | PCInbox",
      description: "Encuentra los mejores productos de tecnología en PCInbox.",
    };
  }

  const price = formatProductPrice(product.price);
  const url = getProductUrl(idProduct);
  const image = getProductImageUrl(product);
  const shortName = truncateText(product.name, 55);
  const title = `${shortName} - ${price}`;
  const description = product.description
    ? `${truncateText(product.description, 90)} · ${price}`
    : `Disponible en PCInbox · ${price}`;

  return {
    title: {
      absolute: `${title} | PCInBOX`,
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "PCInbox",
      locale: "es_MX",
      type: "website",
      images: image
        ? [
            {
              url: image,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": "MXN",
    },
  };
}

export default function DetailsProductLayout({ children }: Props) {
  return children;
}
