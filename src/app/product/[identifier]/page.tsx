"use client";

import Head from "next/head";
import React, { useState, useEffect } from "react";
import { MdAutorenew, MdShoppingCart, MdStar } from "react-icons/md";
import dynamic from "next/dynamic";
import BranchSelector from "@/app/components/branchSelector/BranchSelector";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { Carousel } from "react-responsive-carousel";

interface ProductPageProps {
  params: Promise<{ identifier: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { identifier } = React.use(params);
  const { setDataModal, setDataCart, dataCart, hasToken } = useTheContext();
  const { requestPost } = useService();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener producto desde API
  useEffect(() => {
    //https://server-proveedores-a69933baa01a.herokuapp.com/api/v1/getProductGoogleSearchConsole/${searchTerm}
    async function fetchProduct() {
      try {
        const searchTerm = decodeURIComponent(identifier);
        const res = await fetch(
          `https://server-proveedores-a69933baa01a.herokuapp.com/api/v1/getProductGoogleSearchConsole/${searchTerm}`,
          { cache: "no-store" },
        );

        if (!res.ok) throw new Error("No se pudo obtener el producto");

        const result = await res.json();
        const productsArray = Array.isArray(result.data?.data)
          ? result.data.data
          : [result.data?.data];

        const productFound =
          productsArray.length === 1
            ? productsArray[0]
            : productsArray.find(
              (p: any) =>
                p.idProduct.toString() === identifier.toString() ||
                p.sku === identifier ||
                p.upc === identifier ||
                p.name.toLowerCase() === identifier.toLowerCase() ||
                p.description?.toLowerCase() === identifier.toLowerCase(),
            ) || productsArray[0];

        setProduct(productFound);
      } catch (err: any) {
        setError(err.message || "Error al cargar producto");
      }
    }

    fetchProduct();
  }, [identifier]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  const handleAddProductCart = async (productProp: any) => {
    try {
      const productInCart = dataCart?.find(
        (item) => Number(item.idProduct) === Number(productProp.idProduct),
      );

      if (productInCart && productInCart.quantity >= (productProp.stock || 0))
        return;

      setLoading(true);

      const resp = await requestPost(
        {
          idProduct: Number(productProp.idProduct),
          quantity: 1,
          price: productProp.price,
          isDetails: false,
        },
        "/cart/addProduct",
      );

      setLoading(false);

      if (resp.status === 200) {
        setDataCart((prev) => {
          if (productInCart) {
            return prev.map((item) =>
              Number(item.idProduct) === Number(productProp.idProduct)
                ? {
                  ...item,
                  quantity: Math.min(
                    Number(item.quantity) + 1,
                    Number(productProp.stock),
                  ),
                }
                : item,
            );
          } else {
            return [...prev, { ...productProp, quantity: 1 }];
          }
        });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Cargando producto...</div>;

  const promedioRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      product.reviews.length
      : 0;

  const Rating = ({ value }: { value: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <MdStar
          key={star}
          size={20}
          color={star <= value ? "#BB3D4B" : "#ccc"}
        />
      ))}
    </div>
  );

  return (
    <>
      <Head>
        <title>{product.name} | PCInbox</title>
        <meta
          name="description"
          content={product.description?.slice(0, 160) || ""}
        />
        <link
          rel="canonical"
          href={`https://www.pcinbox.com.mx/product/${identifier}`}
        />
      </Head>

      <div key={1}>
        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="flex flex-col">
            <div className="item-component p-3">
              <a
                role="button"
                onClick={() => {
                  // onRouterLink(
                  //   `/detailsProduct/${item.idProduct}`,
                  // );

                  location.href = `/detailsProduct/${product.idProduct}`;
                }}
                className="text-[#BB3D4B] font-bold"
                style={{
                  color: "#BB3D4B",
                }}
              >
                {product?.name}
              </a>
              {/* <span className="text-[#BB3D4B] font-bold">
                                {item.name}
                              </span> */}
              <div className="grid grid-cols-[1fr_1fr_1fr] my-1">
                <div className="flex">
                  {product?.upc && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[#808080]">
                        SKU: {product?.sku}
                      </span>
                      <span className="font-bold text-black">
                        UPC:
                        <span className="font-normal mx-1">{product?.upc}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_1fr_auto] my-1 gap-4">
                {/* Características */}
                <div>
                  {product?.caracteristicas &&
                    (typeof product?.caracteristicas === "object" ||
                      typeof product?.caracteristicas === "string") ? (
                    (() => {
                      try {
                        const caracs =
                          typeof product?.caracteristicas === "string"
                            ? JSON.parse(product.caracteristicas)
                            : product?.caracteristicas;

                        if (Array.isArray(caracs) && caracs.length > 0) {
                          return (
                            <ul className="space-y-1">
                              {caracs
                                .slice(0, 6)
                                .map((carac: any, index: number) => (
                                  <li
                                    key={index}
                                    className="grid grid-cols-[minmax(120px,max-content)_1fr] gap-2 items-start text-[13px]"
                                  >
                                    {/* Clave */}
                                    <span
                                      className="font-bold text-black"
                                      style={{
                                        marginTop: "5px",
                                      }}
                                    >
                                      {carac.prop}:{" "}
                                      <span className="italic break-words font-normal">
                                        {carac.value && carac.value.length > 70
                                          ? `${carac.value.slice(0, 70)}...`
                                          : carac.value || "—"}
                                      </span>
                                    </span>

                                    {/* Valor */}
                                  </li>
                                ))}
                            </ul>
                          );
                        }
                        return <span>Sin características disponibles</span>;
                      } catch (e) {
                        return <span>Sin características disponibles</span>;
                      }
                    })()
                  ) : (
                    <span>Sin características disponibles</span>
                  )}
                </div>

                {/* Precio y stock */}
                <div className="px-3">
                  <span className="text-[20px] font-bold">
                    {formatCurrency(Number(product.price))}
                  </span>
                  <br />
                  <span>Disponibles: {product.stock} piezas</span>
                </div>

                {/* Botón */}
                <div>
                  <button
                    disabled={
                      loading || product.stock == 0 || product.stock == "0"
                    }
                    className="bg-[#BB3D4B] text-white px-4 py-2 rounded flex items-center gap-2"
                    onClick={() => {
                      if (!hasToken) {
                        setDataModal({
                          title: "Información",
                          isOpen: true,
                          message: "Necesitas iniciar sesión",
                          type: "info",
                          showActions: true,
                          onClose: () => {
                            setDataModal((prev) => ({
                              ...prev,
                              isOpen: false,
                            }));
                          },
                          onConfirm: () => {
                            setDataModal((prev) => ({
                              ...prev,
                              isOpen: false,
                            }));
                          },
                        });
                        return;
                      }
                      if (
                        (product?.isPC == 0 || product?.isPc == 0) &&
                        product?.product_stock.length > 0 &&
                        Number(product?.providerId) === 3
                      ) {
                        setDataModal({
                          isOpen: true,
                          message: (
                            <div className="border">
                              <BranchSelector productSelected={product} />
                            </div>
                          ),
                          title: "",
                          type: "success",
                          showActions: false,
                          onClose: () =>
                            setDataModal((prev) => ({
                              ...prev,
                              isOpen: false,
                            })),
                          onConfirm: () =>
                            setDataModal((prev) => ({
                              ...prev,
                              isOpen: false,
                            })),
                        });
                      } else {
                        handleAddProductCart(product);
                      }
                    }}
                  >
                    {product?.isPC == 0 &&
                      loading &&
                      Number(product?.providerId) === 3 ? (
                      <MdAutorenew size={20} className="m-auto the-spinner" />
                    ) : product.stock == "0" || product.stock == 0 ? (
                      "No disponible"
                    ) : (
                      <>
                        Agregar al carrito
                        <MdShoppingCart size={20} color="white" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[150px] flex justify-center items-center">
            <Carousel
              showIndicators={true}
              showThumbs={false}
              showStatus={false}
              showArrows={true}
              onClickItem={() => {
                // onRouterLink(
                //   `/detailsProduct/${item.idProduct}`,
                // );
                location.href = `/detailsProduct/${product.idProduct}`;
              }}
            >
              {product.image_url && product.image_url.length > 0
                ? product.image_url.map((img: string, i: number) => (
                  <div key={i}>
                    <img
                      src={img}
                      style={{
                        objectFit: "contain",
                        height: "150px",
                        marginTop: "12px",
                      }}
                      loading="lazy"
                    />
                  </div>
                ))
                : [<div key="no-img">Sin imágenes</div>]}
            </Carousel>
          </div>
        </div>
        <hr />
      </div>

      {/* <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#BB3D4B]">{product.name}</h1>

        <div className="flex gap-4">
          <div className="w-[150px]">
            <Carousel showIndicators showThumbs={false} showStatus={false}>
              {(product?.image_url || product?.imageUrl)?.map((img: string, i: number) => (
                <div key={i}>
                  <img
                    src={img}
                    style={{ objectFit: "contain", height: "150px" }}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="flex-1">
            <span>SKU: {product.sku}</span> | <span>UPC: {product.upc}</span>
            <div className="flex items-center gap-2">
              <Rating value={promedioRating} />
              <span>{product.reviews?.length || 0} opiniones</span>
            </div>
            <div className="my-2">
              <span className="text-xl font-bold">
                {formatCurrency(product.price)}
              </span>
              <br />
              <span>Disponibles: {product.stock} piezas</span>
            </div>
            <button
              disabled={loading || product?.stock == 0 || product?.stock == "0"}
              className="bg-[#BB3D4B] text-white px-4 py-2 rounded flex items-center gap-2"
              onClick={() => {
                if (
                  (product?.isPC == 0 || product?.isPc == 0) &&
                  product?.product_stock?.length > 0 &&
                  Number(product?.providerId) === 3
                ) {
                  setDataModal({
                    isOpen: true,
                    message: <BranchSelector productSelected={product} />,
                    title: "",
                    type: "success",
                    showActions: false,
                    onClose: () =>
                      setDataModal((prev) => ({ ...prev, isOpen: false })),
                    onConfirm: () =>
                      setDataModal((prev) => ({ ...prev, isOpen: false })),
                  });
                } else {
                  handleAddProductCart(product);
                }
              }}
            >
              {product?.isPC == 0 &&
              loading &&
              Number(product?.providerId) === 3 ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : product?.stock == "0" || product?.stock == 0 ? (
                "No disponible"
              ) : (
                <>
                  Agregar al carrito
                  <MdShoppingCart size={20} color="white" />
                </>
              )}
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
}
