"use client";

import { Alert, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import useProveedores from "../services/proveedores/useProveedores";
import useService from "../services/useService";
import { Carousel } from "react-responsive-carousel";
import { MdShoppingCart } from "react-icons/md";
import useResultSearchCategory from "./useResultSearchCategory";

const ResultSearchCategory = () => {
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const { requestPostProveedor } = useProveedores();
  const [data, setData] = useState([]);
  const { formatCurrency, onRouterLink } = useService();

  const { loadingAddProductCar, handleAddProductCart } =
    useResultSearchCategory();

  const handleGetData = async () => {
    try {
      setLoadingData(true);
      const resp = await requestPostProveedor(
        { categoryId: 1 },
        "/getProductByCategoryId"
      );
      setLoadingData(false);
      if (resp.status == 200) {
        const data = resp.data;
        setData(data.data.data);
      }
    } catch (error) {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  return (
    <section>
      {!loadingData ? (
        <div className="mt-2 w-full grid grid-cols-[auto_1fr] gap-2">
          <aside className="border p-3">
            <span className="block text-left text-[#BB3D4B] font-bold">
              Marcas
            </span>
            <div className="mt-2">
              <ul
                style={{
                  paddingLeft: "0px",
                }}
              >
                <li>
                  <label htmlFor="marca1">
                    <input type="radio" id="marca1" name="marca" />
                    <span className="mx-1">Marca 1</span>
                  </label>
                </li>
                <li>
                  <label htmlFor="marca2">
                    <input type="radio" id="marca2" name="marca" />
                    <span className="mx-1">Marca 2</span>
                  </label>
                </li>
              </ul>
            </div>
          </aside>

          <div className="px-3">
            <h3
              className="text-[#BB3D4B] font-bold"
              style={{
                color: "#BB3D4B",
                fontWeight: "bold",
              }}
            >
              {data && data.length > 0 ? (data[0] as any).nameCategoria : ""}
            </h3>

            <div className="mt-4 flex gap-1 items-center">
              <input
                type="text"
                placeholder="Buscar..."
                className="border py-1 px-4"
              />
              <button className="py-1 px-4 rounded text-white bg-[#BB3D4B]">
                Buscar
              </button>
            </div>

            <hr />
            <div>
              {data && data.length > 0 ? (
                data.map((item: any, index: number) => {
                  return (
                    <div key={index}>
                      <div className="grid grid-cols-[1fr_auto] gap-4">
                        <div className="flex flex-col">
                          <div className="item-component p-3">
                            <span className="text-[#BB3D4B] font-bold">
                              {item.name}
                            </span>
                            <div className="grid grid-cols-[1fr_1fr_1fr] my-1">
                              <span className="text-[#808080]">
                                SKU: {item.sku}
                              </span>
                              {(() => {
                                const promedioRating =
                                  item.reviews.length > 0
                                    ? item.reviews.reduce(
                                        (sum: any, review: any) =>
                                          sum + review.rating,
                                        0
                                      ) / item.reviews.length
                                    : 0;
                                return (
                                  <Rating
                                    name="simple-controlled"
                                    max={5}
                                    readOnly
                                    value={promedioRating}
                                    size="medium"
                                    sx={{
                                      color: "#BB3D4B",
                                    }}
                                  />
                                );
                              })()}

                              <span className="text-[black] font-bold">
                                {item.reviews.length == 0
                                  ? "Sin opiniones"
                                  : `${item.reviews.length} opiniones`}
                              </span>
                            </div>

                            <div className="grid grid-cols-[1fr_1fr_auto] my-4">
                              <div>
                                <ul>
                                  <li>Familia de procesador</li>
                                  <li>Circuito integrado</li>
                                </ul>
                              </div>
                              <div>
                                <span>
                                  {formatCurrency(Number(item.price))}
                                </span>
                                <br />
                                <span>Costo de envio: $160</span>
                                <br />
                                <span>Disponibles: {item.stock} piezas</span>
                              </div>
                              <div>
                                <button
                                  disabled={loadingAddProductCar}
                                  className="bg-[#BB3D4B] text-white px-2 py-2 rounded flex items-center gap-2"
                                  onClick={() => handleAddProductCart(item)}
                                >
                                  Agregar al carrito
                                  <MdShoppingCart size={20} color="white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-[150px]">
                          <Carousel
                            showIndicators={true}
                            showThumbs={false}
                            showStatus={false}
                            showArrows={true}
                            onClickItem={() => {
                              onRouterLink(`/detailsProduct/${item.idProduct}`);
                            }}
                          >
                            {item.image_url && item.image_url.length > 0
                              ? item.image_url.map((img: string, i: number) => (
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
                  );
                })
              ) : (
                <Alert severity="info">Sin contenido disponible</Alert>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Alert severity="info">Sin contenido disponible</Alert>
      )}
    </section>
  );
};

export default ResultSearchCategory;
