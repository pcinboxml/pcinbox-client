"use client";

import { Alert, Rating } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import useProveedores from "../services/proveedores/useProveedores";
import useService from "../services/useService";
import { Carousel } from "react-responsive-carousel";
import { MdAutorenew, MdShoppingCart } from "react-icons/md";
import useResultSearchCategory from "./useResultSearchCategory";
import { useSearchParams } from "next/navigation";
import PaginationComponent from "../components/pagination/PaginationComponent";
import usePaginationComponent from "../components/pagination/usePaginationComponent";

const ResultSearchCategory = () => {
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const { requestPostProveedor } = useProveedores();
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [searchText, setSearchText] = useState<string>("");
  const { formatCurrency, onRouterLink } = useService();

  const { loadingAddProductCar, handleAddProductCart } =
    useResultSearchCategory();
  const { startIndex, endIndex, page, handleChangePage } =
    usePaginationComponent();
  const searchParams = useSearchParams();

  const idProduct = searchParams.get("idProduct");
  const name = searchParams.get("name");
  useEffect(() => {
    handleGetData();
  }, [idProduct != null && idProduct != "null", name]);

  const handleGetData = async () => {
    try {
      setLoadingData(true);
      const resp = await requestPostProveedor(
        { idProduct: idProduct, name },
        "/getProductByCategoryIdAndIdProduct"
      );
      setLoadingData(false);
      if (resp.status == 200) {
        const data = resp.data;
        setData(data.data.data);
        setDataCopy(data.data.data);
        setMarcas(data.data.marcas);
      }
    } catch (error) {
      setLoadingData(false);
    }
  };

  const handleOnSelectMarca = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.value) {
      const filtered = dataCopy.filter(
        (item: any) => item.marcaId == event.target.value
      );
      setData(filtered);
    }
  };

  useEffect(() => {
    if (searchText.trim().length < 3) {
      setData(dataCopy);
      return;
    }

    const term = searchText.toLowerCase().trim();

    const filtered = dataCopy.filter(
      (item: any) =>
        item.name.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term)
    );

    setData(filtered);
  }, [searchText, dataCopy]);

  return (
    <section>
      {!loadingData ? (
        data && data.length > 0 ? (
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
                  {(() => {
                    return marcas.map((marca: any, indexMarca: number) => {
                      return (
                        <li key={indexMarca} className="px-2">
                          <label
                            htmlFor={`marca${marca.idMarca}`}
                            className=" cursor-pointer"
                          >
                            <input
                              type="radio"
                              id={`marca${marca.idMarca}`}
                              name="marca"
                              value={marca.idMarca}
                              onChange={handleOnSelectMarca}
                            />
                            <span className="mx-1">{marca.name}</span>
                            <span className="mx-1">
                              {(() => {
                                let longitudProductMarca = dataCopy.filter(
                                  (item: any) => item.marcaId == marca.idMarca
                                ).length;

                                return `(${Number(
                                  longitudProductMarca
                                ).toLocaleString()})`;
                              })()}
                            </span>
                          </label>
                        </li>
                      );
                    });
                  })()}
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
                  onChange={(event) => {
                    setSearchText(event.currentTarget.value);
                  }}
                  value={searchText}
                />
                <button
                  className="py-1 px-4 rounded text-white bg-[#BB3D4B] cursor-pointer"
                  onClick={() => {
                    if (searchText.trim().length < 3) {
                      setData(dataCopy);
                      return;
                    }

                    const term = searchText.toLowerCase().trim();

                    const filtered = dataCopy.filter(
                      (item: any) =>
                        item.name.toLowerCase().includes(term) ||
                        item.sku.toLowerCase().includes(term)
                    );

                    setData(filtered);
                  }}
                >
                  Buscar
                </button>
              </div>

              <hr />
              <div>
                {data && data.length > 0 ? (
                  data
                    .slice(startIndex, endIndex)
                    .map((item: any, index: number) => {
                      return (
                        <div key={index}>
                          <div className="grid grid-cols-[1fr_auto] gap-4">
                            <div className="flex flex-col">
                              <div className="item-component p-3">
                                <span className="text-[#BB3D4B] font-bold">
                                  {item.name}
                                </span>
                                <div className="grid grid-cols-[1fr_1fr_1fr] my-1">
                                  <div className="flex">
                                    {item?.upc && (
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[#808080]">
                                          SKU: {item.sku}
                                        </span>
                                        <span className="font-bold text-black">
                                          UPC:
                                          <span className="font-normal mx-1">
                                            {item.upc}
                                          </span>
                                        </span>
                                      </div>
                                    )}
                                  </div>
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
                                      {item?.caracteristicas
                                        ? (() => {
                                            try {
                                              const caracs = JSON.parse(
                                                item.caracteristicas
                                              );
                                              if (
                                                Array.isArray(caracs) &&
                                                caracs.length > 0
                                              ) {
                                                return caracs.map(
                                                  (
                                                    carac: any,
                                                    index: number
                                                  ) => (
                                                    <li
                                                      key={index}
                                                      className="flex gap-2 items-end"
                                                    >
                                                      <span className="font-bold text-black text-[19px]">
                                                        {carac.prop}:
                                                      </span>
                                                      <span className="italic">
                                                        {carac.value}
                                                      </span>
                                                    </li>
                                                  )
                                                );
                                              }
                                              return "Sin caracteristicas disponibles";
                                            } catch (e) {
                                              return "Sin caracteristicas disponibles";
                                            }
                                          })()
                                        : "Sin caracteristicas disponibles"}
                                    </ul>
                                  </div>
                                  <div>
                                    <span>
                                      {formatCurrency(Number(item.price))}
                                    </span>
                                    <br />
                                    {/* <span>Costo de envio: $160</span> */}
                                    {/* <br /> */}
                                    <span>
                                      Disponibles: {item.stock} piezas
                                    </span>
                                  </div>
                                  <div>
                                    <button
                                      disabled={loadingAddProductCar}
                                      className="bg-[#BB3D4B] text-white px-2 py-2 rounded flex items-center gap-2"
                                      onClick={() => handleAddProductCart(item)}
                                    >
                                      {loadingAddProductCar ? (
                                        <MdAutorenew
                                          size={20}
                                          className="m-auto the-spinner"
                                        />
                                      ) : (
                                        <>
                                          Agregar al carrito
                                          <MdShoppingCart
                                            size={20}
                                            color="white"
                                          />
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
                                  onRouterLink(
                                    `/detailsProduct/${item.idProduct}`
                                  );
                                }}
                              >
                                {item.image_url && item.image_url.length > 0
                                  ? item.image_url.map(
                                      (img: string, i: number) => (
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
                                      )
                                    )
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
        )
      ) : (
        <Alert severity="info">Sin contenido disponible</Alert>
      )}
      <div className="flex p-2 justify-end items-center">
        <PaginationComponent
          onChange={handleChangePage}
          page={page}
          count={Math.ceil(data.length / 10)}
        />
      </div>
    </section>
  );
};

export default ResultSearchCategory;
