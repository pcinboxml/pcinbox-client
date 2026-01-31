"use client";

import { Alert, Box, Rating, styled, Tooltip } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import useProveedores from "../services/proveedores/useProveedores";
import useService from "../services/useService";
import { Carousel } from "react-responsive-carousel";
import {
  MdArrowDropDown,
  MdAutorenew,
  MdShoppingCart,
  MdStar,
} from "react-icons/md";
import useResultSearchCategory from "./useResultSearchCategory";
import { useSearchParams } from "next/navigation";
import PaginationComponent from "../components/pagination/PaginationComponent";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import BranchSelector from "../components/branchSelector/BranchSelector";
// import BranchSelector from "../components/branchSelector/BranchSelector";

const SearchCategoryContent = () => {
  const { setDataModal } = useTheContext();

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const { requestPostProveedor } = useProveedores();
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [searchText, setSearchText] = useState<string>("");
  const { formatCurrency, onRouterLink } = useService();
  const { dataProducts, socketServer, setDataFavorites } = useTheContext();

  const {
    startIndex,
    endIndex,
    page,
    handleChangePage,
    itemsPerPage,
    loadingAddProductCar,
    handleAddProductCart,
  } = useResultSearchCategory();
  const searchParams = useSearchParams();

  const idProduct = searchParams.get("idProduct");
  const name = searchParams.get("name");
  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    // Lista de parámetros permitidos
    const allowedParams = ["idProduct", "name", "categoryId"];

    // Validar que todos los parámetros en searchParams estén permitidos
    const invalidParams = Array.from(searchParams.keys()).filter(
      (key) => !allowedParams.includes(key),
    );

    if (invalidParams.length > 0) {
      return;
    }

    // Aquí puedes hacer tu lógica normalmente
    handleGetData();
  }, [searchParams]);

  const handleGetData = async () => {
    try {
      setLoadingData(true);
      const resp = await requestPostProveedor(
        { idProduct: idProduct, name: name?.trim(), categoryId },
        "/getProductByCategoryIdAndIdProduct",
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
        (item: any) => item.marcaId == event.target.value,
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
        item.sku.toLowerCase().includes(term),
    );

    setData(filtered);
  }, [searchText, dataCopy]);

  const ratingProgress = [
    {
      id: 1,
      rating: 5,
    },
    {
      id: 2,
      rating: 4,
    },
    {
      id: 3,
      rating: 3,
    },
    {
      id: 4,
      rating: 2,
    },
    {
      id: 5,
      rating: 1,
    },
  ];

  useEffect(() => {
    if (!socketServer.current || data.length === 0) return;
    const socket = socketServer.current;

    const handlerUpdateProductComponent = (dataSocket: ProductI) => {
      setData((prev: any) =>
        prev.map((item: any) =>
          item.idProduct == dataSocket.idProduct
            ? { ...item, stock: dataSocket.stock, price: dataSocket.price }
            : item,
        ),
      );

      setDataFavorites((prevFavorites) => {
        return prevFavorites.map((item: any) => {
          // Aquí comparamos con la estructura correcta:
          const match = Number(item.productId) === Number(dataSocket.idProduct);

          return match
            ? {
                ...item,
                products: {
                  ...item.products,
                  stock: Number(dataSocket.stock),
                  price: Number(dataSocket.price).toString(),
                },
              }
            : item;
        });
      });
    };

    socket.on("updateProductComponent", handlerUpdateProductComponent);

    return () => {
      socket.off("updateProductComponent", handlerUpdateProductComponent);
    };
  }, [socketServer.current, data]);

  const StyledTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(() => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: "#fff",
      color: "#000",
      borderRadius: 8,
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      padding: 12,
      minWidth: 300,
      maxWidth: 400,
    },
    [`& .MuiTooltip-arrow`]: {
      color: "#fff",
    },
  }));

  const calcPorcentaje = (
    product: ProductI,
    dataProducts: ProductI[],
    progressRating: any,
  ) => {
    const ratingCount = product.reviews.reduce((acc, item) => {
      if (item.rating === progressRating.rating) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const totalRatingCount = dataProducts.reduce((acc, item) => {
      if (item.reviews) {
        return (
          acc +
          item.reviews.filter(
            (r) =>
              r.rating === progressRating.rating &&
              item.idProduct == product.idProduct,
          ).length
        );
      } else {
        return 0;
      }
    }, 0);

    const percentage =
      totalRatingCount > 0 ? (ratingCount / totalRatingCount) * 100 : 0;

    return {
      percentage,
      rating: progressRating.rating,
    };
  };

  // useEffect(() => {
  //   setData((prev) => {
  //     return prev
  //       .slice(startIndex, endIndex)
  //       .sort((a: any, b: any) => Number(b.price) - Number(a.price));
  //   });
  // }, []);

  return (
    <section>
      {!loadingData ? (
        <div className="mt-2 w-full grid grid-cols-[auto_1fr] gap-2">
          {marcas &&
            marcas?.length > 0 &&
            (marcas as any)?.[0]?.idMarca != null && (
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
                      return (
                        marcas &&
                        marcas.map((marca: any, indexMarca: number) => {
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
                                      (item: any) =>
                                        item.marcaId == marca.idMarca,
                                    ).length;

                                    return `(${Number(
                                      longitudProductMarca,
                                    ).toLocaleString()})`;
                                  })()}
                                </span>
                              </label>
                            </li>
                          );
                        })
                      );
                    })()}
                  </ul>
                </div>
              </aside>
            )}

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

            {data && data?.length > 0 ? (
              <>
                <div className="mt-4 flex gap-1 items-center justify-between">
                  <div>
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
                            item.sku.toLowerCase().includes(term),
                        );

                        setData(filtered);
                      }}
                    >
                      Buscar
                    </button>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="flex shrink-0">Ordenar por:</span>
                    <select
                      className="form-select"
                      defaultValue={""}
                      onChange={(event) => {
                        setData((prev) => {
                          return prev
                            .slice(startIndex, endIndex)
                            .sort((a: any, b: any) =>
                              event.target.value == "1"
                                ? Number(b.price) - Number(a.price)
                                : Number(a.price) - Number(b.price),
                            );
                        });
                      }}
                    >
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      <option value={1}>Mayor precio</option>
                      <option value={2}>Menor precio</option>
                    </select>
                  </div>
                </div>

                <hr />
              </>
            ) : (
              ""
            )}
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
                              <a
                                role="button"
                                onClick={() => {
                                  onRouterLink(
                                    `/detailsProduct/${item.idProduct}`,
                                  );
                                }}
                                className="text-[#BB3D4B] font-bold"
                                style={{
                                  color: "#BB3D4B",
                                }}
                              >
                                {item.name}
                              </a>
                              {/* <span className="text-[#BB3D4B] font-bold">
                                {item.name}
                              </span> */}
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
                                          0,
                                        ) / item.reviews.length
                                      : 0;
                                  return (
                                    <div className="container-rating flex gap-2">
                                      <div className="rating">
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
                                      </div>
                                      {/* {product.reviews && product.reviews.length > 0 && ( */}
                                      <div className="comments flex">
                                        <StyledTooltip
                                          title={
                                            <div className="w-full  flex justify-center">
                                              <Box>
                                                <div className="w-full flex items-center">
                                                  <Rating
                                                    value={item.rating}
                                                    readOnly
                                                    size="medium"
                                                    precision={0.5}
                                                    sx={{
                                                      color: "#BB3D4B",
                                                    }}
                                                  />

                                                  <span className="text-[#666666] font-bold text-[18px] block mx-2">
                                                    {item.reviews.length.toLocaleString()}{" "}
                                                    Opiniones
                                                  </span>
                                                </div>
                                                <div className="mt-2">
                                                  <span className="text-[#808080] text-[16px] ">
                                                    {item.rating} estrellas
                                                  </span>
                                                </div>

                                                <div className="mt-3 grid grid-cols[1fr_auto] w-full">
                                                  {ratingProgress &&
                                                    ratingProgress.map(
                                                      (progressRating) => {
                                                        return (
                                                          <div
                                                            className="flex items-center mb-2"
                                                            key={
                                                              progressRating.id
                                                            }
                                                          >
                                                            <div
                                                              className="barProgress"
                                                              style={{
                                                                width: "200px",
                                                                height: "15px",
                                                                borderRadius:
                                                                  "5px",
                                                                background:
                                                                  "#E7E7E7",
                                                                position:
                                                                  "relative",
                                                              }}
                                                            >
                                                              <div
                                                                style={{
                                                                  width:
                                                                    calcPorcentaje(
                                                                      item,
                                                                      dataProducts,
                                                                      progressRating,
                                                                    )
                                                                      .percentage,
                                                                  height:
                                                                    "15px",
                                                                  top: "0",
                                                                  left: "0",
                                                                  bottom: "0",
                                                                  background:
                                                                    "#BB3D4B",
                                                                  borderRadius:
                                                                    "5px",
                                                                }}
                                                              ></div>
                                                            </div>
                                                            <div className="text-[15px] text-[#606060] font-bold mx-2">
                                                              {
                                                                calcPorcentaje(
                                                                  item,
                                                                  dataProducts,
                                                                  progressRating,
                                                                ).rating
                                                              }
                                                            </div>
                                                            <div>
                                                              <MdStar
                                                                color="#ccc"
                                                                size={20}
                                                              />
                                                            </div>

                                                            <div>
                                                              <span className="text-[#ccc] text-[13px] mx-1">
                                                                (
                                                                {item.reviews.reduce(
                                                                  (
                                                                    acc: any,
                                                                    item: any,
                                                                  ) => {
                                                                    if (
                                                                      item.rating ===
                                                                      progressRating.rating
                                                                    ) {
                                                                      return (
                                                                        acc + 1
                                                                      );
                                                                    }
                                                                    return acc;
                                                                  },
                                                                  0,
                                                                )}
                                                                )
                                                              </span>
                                                            </div>
                                                          </div>
                                                        );
                                                      },
                                                    )}

                                                  <a
                                                    role="button"
                                                    onClick={() =>
                                                      onRouterLink(
                                                        `/review?idProduct=${item.idProduct}`,
                                                      )
                                                    }
                                                    style={{
                                                      display: "block",
                                                      color: "#BB3D4B",
                                                      textAlign: "center",
                                                      fontSize: "17px",
                                                      textDecoration: "none",
                                                    }}
                                                  >
                                                    Ver todas las (
                                                    {item.reviews.length.toLocaleString()}
                                                    ) opiniones
                                                  </a>
                                                </div>
                                              </Box>
                                            </div>
                                          }
                                        >
                                          <div className="flex">
                                            <button
                                              className="flex justify-center items-center border"
                                              style={{
                                                marginLeft: "5px",
                                                borderRadius: "2px",
                                                width: "20px",
                                                height: "20px",
                                              }}
                                            >
                                              <MdArrowDropDown
                                                size={10}
                                                color="gray"
                                              />
                                            </button>
                                          </div>
                                        </StyledTooltip>
                                        <a style={{ marginLeft: "5px" }}>
                                          {item.reviews
                                            .filter(
                                              (itemF: any) =>
                                                itemF.productId ==
                                                item.idProduct,
                                            )
                                            .length.toLocaleString()}{" "}
                                          opiniones
                                        </a>
                                      </div>
                                      {/* )} */}
                                    </div>
                                  );
                                })()}
                              </div>

                              <div className="grid grid-cols-[1fr_1fr_auto] my-1">
                                {item?.caracteristicas &&
                                  item?.caracteristicas?.length > 0 && (
                                    <div>
                                      <ul>
                                        {item?.caracteristicas
                                          ? (() => {
                                              try {
                                                const caracs = JSON.parse(
                                                  item.caracteristicas,
                                                );
                                                if (
                                                  Array.isArray(caracs) &&
                                                  caracs.length > 0
                                                ) {
                                                  return caracs
                                                    .slice(0, 6)
                                                    .map(
                                                      (
                                                        carac: any,
                                                        index: number,
                                                      ) => (
                                                        <li
                                                          key={index}
                                                          className="flex gap-2 items-end"
                                                        >
                                                          <span className="font-bold text-black text-[13px]">
                                                            {carac.prop}:
                                                          </span>
                                                          <span className="italic text-[13px]">
                                                            {carac.value &&
                                                            carac?.value
                                                              ?.length > 70
                                                              ? `${carac?.value?.slice(
                                                                  0,
                                                                  70,
                                                                )}...`
                                                              : carac?.value}
                                                          </span>
                                                        </li>
                                                      ),
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
                                  )}
                                <div className="px-3">
                                  <span className="text-[20px] font-bold">
                                    {formatCurrency(Number(item.price))}
                                  </span>
                                  <br />
                                  {/* <span>Costo de envio: $160</span> */}
                                  {/* <br /> */}
                                  <span>Disponibles: {item.stock} piezas</span>
                                </div>
                                <div>
                                  <button
                                    disabled={
                                      loadingAddProductCar[item.idProduct] ||
                                      item.stock == 0 ||
                                      item.stock == "0"
                                    }
                                    className="bg-[#BB3D4B] text-white px-2 py-2 rounded flex items-center gap-2"
                                    onClick={() => {
                                      if (
                                        (item?.isPC == 0 || item?.isPc == 0) &&
                                        item?.product_stock.length > 0 &&
                                        Number(item?.providerId) === 3
                                      ) {
                                        setDataModal({
                                          isOpen: true,
                                          message: (
                                            <div className="w-[800px] border">
                                              <BranchSelector
                                                productSelected={item}
                                              />
                                            </div>
                                          ),
                                          title: "",
                                          type: "success",
                                          showActions: false,
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
                                      } else {
                                        handleAddProductCart(item);
                                      }
                                    }}
                                  >
                                    {item?.isPC == 0 &&
                                    loadingAddProductCar[item.idProduct] ==
                                      true &&
                                    Number(item?.providerId) === 3 ? (
                                      <MdAutorenew
                                        size={20}
                                        className="m-auto the-spinner"
                                      />
                                    ) : (
                                      <>
                                        {item.stock == "0" ||
                                        item.stock == 0 ? (
                                          "No disponible"
                                        ) : (
                                          <>
                                            Agregar al carrito
                                            <MdShoppingCart
                                              size={20}
                                              color="white"
                                            />
                                          </>
                                        )}
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
                                  `/detailsProduct/${item.idProduct}`,
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
                                    ),
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
      )}
      {data && data?.length > 0 && (
        <div className="flex p-2 justify-end items-center">
          <PaginationComponent
            onChange={handleChangePage}
            page={page}
            count={Math.ceil(data.length / itemsPerPage)}
          />
        </div>
      )}
    </section>
  );
};

export default SearchCategoryContent;
