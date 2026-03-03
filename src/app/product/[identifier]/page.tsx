import Head from "next/head";

interface ProductPageProps {
  params: Promise<{ identifier: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { identifier } = await params;

  async function getProduct(id: string) {
    const searchTerm = decodeURIComponent(identifier);
    //Prod `https://server-proveedores-a69933baa01a.herokuapp.com/api/v1/getProductGoogleSearchConsole/${searchTerm}`
    //Local `http://localhost:8001/api/v1/getProductGoogleSearchConsole/${searchTerm}`
    const res = await fetch(
      `https://server-proveedores-a69933baa01a.herokuapp.com/api/v1/getProductGoogleSearchConsole/${searchTerm}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("No se pudo obtener el producto");

    const result = await res.json();
    const productsArray = Array.isArray(result.data?.data)
      ? result.data.data
      : [result.data?.data];

    if (productsArray.length === 0) throw new Error("Producto no encontrado");

    const product =
      productsArray.length === 1
        ? productsArray[0]
        : productsArray.find(
            (p: any) =>
              p.idProduct.toString() === id.toString() ||
              p.sku === id ||
              p.upc === id ||
              p.name.toLowerCase() === id.toLowerCase() ||
              p.description?.toLowerCase() === id.toLowerCase(),
          ) || productsArray[0];

    return product;
  }

  const product = await getProduct(identifier);

  return (
    <>
      <Head>
        <title>{product.name} | PCInbox</title>
        <meta
          name="description"
          content={product.description?.slice(0, 160) || ""}
        />

        {/*
        //Prod `https://www.pcinbox.com.mx/product/${identifier}`
        //Local `http://localhost:3000/product/${identifier}`
        */}
        <link
          rel="canonical"
          href={`https://www.pcinbox.com.mx/product/${identifier}`}
        />
      </Head>

      {/*
        //Prod `https://www.pcinbox.com.mx/product/${identifier}`
        //Local `http://localhost:3000/product/${identifier}`
        */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: product.image_url,
            description: product.description,
            sku: product.sku,
            mpn: product.upc,
            offers: {
              "@type": "Offer",
              url: `https://www.pcinbox.com.mx/product/${identifier}`,
              priceCurrency: "MXN",
              price: product.price,
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />

      <h1>{product?.name}</h1>
      <p>{product?.description}</p>
      <p>SKU: {product?.sku}</p>
      <p>UPC: {product?.upc}</p>
      <p>Stock: {product?.stock}</p>
      <p>Precio: ${product?.price}</p>
      {product?.image_url?.[0] && (
        <img src={product?.image_url[0]} alt={product?.name} />
      )}
    </>
  );
}
