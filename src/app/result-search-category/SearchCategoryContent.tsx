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
  MdFilterList,
} from "react-icons/md";

import useResultSearchCategory from "./useResultSearchCategory";
import { useSearchParams } from "next/navigation";
import PaginationComponent from "../components/pagination/PaginationComponent";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import BranchSelector from "../components/branchSelector/BranchSelector";
// import BranchSelector from "../components/branchSelector/BranchSelector";

const SearchCategoryContent = () => {
  const { setDataModal, socketPagos, socketServer, setDataFavorites } =
    useTheContext();

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const { requestPostProveedor } = useProveedores();
  const [data, setData] = useState<ProductI[]>([]);
  const [dataCopy, setDataCopy] = useState<ProductI[]>([]);
  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca] = useState<any>("");
  const [processorBrand, setProcessorBrand] = useState<"INTEL" | "AMD" | null>(
    null,
  );
  const [searchText, setSearchText] = useState<string>("");
  const [orderBy, setOrderBy] = useState<any>("");
  const { formatCurrency, onRouterLink } = useService();
  const { dataProducts, socketCron, dataCategories } = useTheContext();

  const {
    startIndex,
    endIndex,
    page,
    setPage,
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
    setMarca(Number(event.target.value));
  };

  const handleOnSelectMarcaProcesadorMadre = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const type = event.target.value === "1" ? "INTEL" : "AMD";
    setProcessorBrand(type);
  };

  useEffect(() => {
    let filtered = [...dataCopy];

    // filtro por marca
    if (marca) {
      filtered = filtered.filter((item: any) => item.marcaId == marca);
    }

    // filtro por fabricante procesador
    if (processorBrand) {
      filtered = filtered.filter((item: any) => {
        const caract =
          typeof item.caracteristicas === "string"
            ? JSON.parse(item.caracteristicas)
            : item.caracteristicas;

        return (
          Array.isArray(caract) &&
          caract.some(
            (c: any) =>
              c.prop === "Fabricante de procesador" &&
              c.value?.toLowerCase() === processorBrand?.toLowerCase(),
          )
        );
      });
    }

    setData(filtered);
  }, [marca, processorBrand, dataCopy]);

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

  useEffect(() => {
    if (!socketCron?.current) return;

    socketCron?.current?.on("updatedStockCron", (dataSocketCron: any) => {
      if (Array.isArray(dataSocketCron)) {
        setData((prevData: any) =>
          prevData.map((pdp: any) => {
            const findIdProduct = dataSocketCron?.find(
              (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
            );
            if (!findIdProduct) return pdp;
            const branchesEntries = findIdProduct?.branches
              ? Object.entries(findIdProduct.branches)
              : [];

            return {
              ...pdp,
              stock: Number(findIdProduct.stock),
              product_stock: pdp.product_stock?.map((xx: any) => {
                if (!xx) return xx; // por si xx es undefined
                const branchStock = branchesEntries.find(
                  ([nameBranch]) => nameBranch === xx.branches?.name,
                );
                return {
                  ...xx,
                  stock: branchStock ? Number(branchStock[1]) : xx.stock,
                };
              }),
            };
          }),
        );

        setDataCopy((prevData: any) =>
          prevData.map((pdp: any) => {
            const findIdProduct = dataSocketCron?.find(
              (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
            );
            if (!findIdProduct) return pdp;
            const branchesEntries = findIdProduct?.branches
              ? Object.entries(findIdProduct.branches)
              : [];

            return {
              ...pdp,
              stock: Number(findIdProduct.stock),
              product_stock: pdp.product_stock?.map((xx: any) => {
                if (!xx) return xx; // por si xx es undefined
                const branchStock = branchesEntries.find(
                  ([nameBranch]) => nameBranch === xx.branches?.name,
                );
                return {
                  ...xx,
                  stock: branchStock ? Number(branchStock[1]) : xx.stock,
                };
              }),
            };
          }),
        );
      }
    });

    return () => {
      socketCron?.current?.off("updatedStockCron", (dataSocketCron: any) => {
        if (Array.isArray(dataSocketCron)) {
          setData((prevData: any) =>
            prevData.map((pdp: any) => {
              const findIdProduct = dataSocketCron?.find(
                (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
              );
              if (!findIdProduct) return pdp;
              const branchesEntries = findIdProduct?.branches
                ? Object.entries(findIdProduct.branches)
                : [];
              return {
                ...pdp,
                stock: Number(findIdProduct.stock),
                product_stock: pdp.product_stock?.map((xx: any) => {
                  if (!xx) return xx; // por si xx es undefined
                  const branchStock = branchesEntries.find(
                    ([nameBranch]) => nameBranch === xx.branches?.name,
                  );
                  return {
                    ...xx,
                    stock: branchStock ? Number(branchStock[1]) : xx.stock,
                  };
                }),
              };
            }),
          );

          setDataCopy((prevData: any) =>
            prevData.map((pdp: any) => {
              const findIdProduct = dataSocketCron?.find(
                (dsc) => Number(dsc?.idProduct) === Number(pdp?.idProduct),
              );
              if (!findIdProduct) return pdp;
              const branchesEntries = findIdProduct?.branches
                ? Object.entries(findIdProduct.branches)
                : [];
              return {
                ...pdp,
                stock: Number(findIdProduct.stock),
                product_stock: pdp.product_stock?.map((xx: any) => {
                  if (!xx) return xx; // por si xx es undefined
                  const branchStock = branchesEntries.find(
                    ([nameBranch]) => nameBranch === xx.branches?.name,
                  );
                  return {
                    ...xx,
                    stock: branchStock ? Number(branchStock[1]) : xx.stock,
                  };
                }),
              };
            }),
          );
        }
      });
    };
  }, [socketCron?.current]);

  useEffect(() => {
    if (!socketServer.current) return;
    if (!socketPagos.current) return;

    const socket = socketServer.current;

    const handlerUpdateProduct = (data: ProductI) => {
      setDataCopy((prev) =>
        prev.map((item) => {
          const match = Number(item.idProduct) === Number(data.idProduct);

          return match
            ? {
                ...item,
                name: data.name,
                description: data.description,
                caracteristicas: data.caracteristicas,
                price: Number(data.price).toString(),
                stock: Number(data.stock),
                sku: data.sku,
              }
            : item;
        }),
      );
      setData((prev) =>
        prev.map((item) => {
          const match = Number(item.idProduct) === Number(data.idProduct);

          return match
            ? {
                ...item,
                name: data.name,
                description: data.description,
                caracteristicas: data.caracteristicas,
                price: Number(data.price).toString(),
                stock: Number(data.stock),
                sku: data.sku,
              }
            : item;
        }),
      );
    };

    const handlerUpdateProductComponent = (dataSocket: ProductI) => {
      setDataCopy((prev) =>
        prev.map((item) => {
          const match = Number(item.idProduct) === Number(dataSocket.idProduct);

          return match
            ? {
                ...item,
                name: dataSocket.name,
                description: dataSocket.description,
                caracteristicas: dataSocket.caracteristicas,
                price: Number(dataSocket.price).toString(),
                stock: Number(dataSocket.stock),
                sku: dataSocket.sku,
              }
            : item;
        }),
      );

      setData((prev) =>
        prev.map((item) => {
          const match = Number(item.idProduct) === Number(dataSocket.idProduct);

          return match
            ? {
                ...item,
                name: dataSocket.name,
                description: dataSocket.description,
                caracteristicas: dataSocket.caracteristicas,
                price: Number(dataSocket.price).toString(),
                stock: Number(dataSocket.stock),
                sku: dataSocket.sku,
              }
            : item;
        }),
      );
      setDataFavorites((prevFavorites) => {
        return prevFavorites.map((item: any) => {
          // Aquí comparamos con la estructura correcta:
          const match = Number(item.productId) == Number(dataSocket.idProduct);

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

    const handleUpdatedStock = (
      dataSocket: { idProduct: number; stock: Number }[],
    ) => {
      setDataCopy((prev) =>
        prev.map((item) => {
          let findIdProduct = dataSocket.find(
            (dSocket) => Number(dSocket.idProduct) === Number(item.idProduct),
          );

          if (findIdProduct) {
            return {
              ...item,
              stock:
                item?.stock == 0
                  ? 0
                  : Number(item?.stock - Number(findIdProduct.stock)),
            };
          }

          return item;
        }),
      );

      setData((prev) =>
        prev.map((item) => {
          let findIdProduct = dataSocket.find(
            (dSocket) => Number(dSocket.idProduct) === Number(item.idProduct),
          );

          if (findIdProduct) {
            return {
              ...item,
              stock:
                item?.stock == 0
                  ? 0
                  : Number(item?.stock - Number(findIdProduct.stock)),
            };
          }

          return item;
        }),
      );
    };

    socket.on("updateProductComponent", handlerUpdateProductComponent);

    //socket.on("newProduct", handlerNewProduct);
    socket.on("updateProduct", handlerUpdateProduct);

    //socket.on("updateCart", handleUpdateCart);

    socketPagos?.current?.on("updatedStock", handleUpdatedStock);

    // socketPagos?.current?.on("removeStorageProgressPay2", () => {
    //   localStorage.removeItem("progressPay2");
    // });

    return () => {
      //  socket.off("newProduct", handlerNewProduct);
      socket.off("updateProduct", handlerUpdateProduct);
      // socket.off("updateCart", handleUpdateCart);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
      socketPagos?.current?.off("updatedStock", handleUpdatedStock);
      // socketPagos?.current?.off("removeStorageProgressPay2", () => {
      //   localStorage.removeItem("progressPay2");
      // });
    };
  }, [socketServer.current, socketPagos?.current]);
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
    if (orderBy) {
      setData((prev) => {
        // Copiamos todo el array antes de ordenar
        const sorted = [...prev].sort(
          (a: any, b: any) =>
            orderBy === "1"
              ? Number(b.price) - Number(a.price) // mayor a menor
              : Number(a.price) - Number(b.price), // menor a mayor
        );

        setPage(1);

        // Si necesitas slice, hazlo después
        return sorted;
      });
    }
  }, [orderBy]);
  const StyledTooltip = styled(({ className, ...props }: any) => (
    <Tooltip
      {...props}
      arrow
      classes={{ popper: className }}
      placement="bottom-start"
    />
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

  return (
    <section>
      {!loadingData ? (
        <div className="mt-2 w-full grid grid-cols-[auto_1fr] gap-2">
          {marcas &&
            marcas?.length > 0 &&
            (marcas as any)?.[0]?.idMarca != null && (
              <aside className="border p-3 relative">
                <button
                  style={{
                    padding: "5px",
                    marginLeft: "auto",
                    marginBottom: "10px",
                  }}
                  onClick={() => {
                    if (dataCategories) {
                      let findCategory = dataCategories.find(
                        (categori) =>
                          Number(categori.idCategorie) === Number(categoryId),
                      );
                      if (
                        findCategory &&
                        findCategory.name === "TARJETAS MADRE"
                      ) {
                        setProcessorBrand(null);
                        setMarca(null);
                        setOrderBy("");
                      }
                    }
                    // if (categoryId == "10") {
                    //   setProcessorBrand(null);
                    //   setMarca(null);
                    //   setOrderBy("");
                    // } else {
                    //   setMarca(null);
                    //   setOrderBy("");
                    // }
                  }}
                  className="bg-[#BB3D4B] rounded text-white font-bold block right-0"
                >
                  <span className="flex justify-center gap-2">
                    {" "}
                    Resetar Filtro
                    <MdFilterList size={22} />
                  </span>
                </button>
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
                        marcas.map((m: any, indexMarca: number) => {
                          return (
                            <li key={indexMarca} className="px-2">
                              <label
                                htmlFor={`marca${m.idMarca}`}
                                className=" cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  id={`marca${m.idMarca}`}
                                  name="marca"
                                  value={m.idMarca}
                                  checked={Number(marca) === m.idMarca}
                                  onChange={handleOnSelectMarca}
                                />
                                <span className="mx-1">{m.name}</span>
                                <span className="mx-1">
                                  {(() => {
                                    let longitudProductMarca = dataCopy.filter(
                                      (item: any) => item.marcaId == m.idMarca,
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

                {categoryId == "10" && ( //categoryId == 33 para local y categoryId == 10 para prod
                  <div className="mt-3">
                    <span className="block text-left text-[#BB3D4B] font-bold">
                      Marca del procesador
                    </span>

                    <div>
                      <ul
                        style={{
                          paddingLeft: "0px",
                        }}
                      >
                        <li className="px-2">
                          <label
                            htmlFor={`marca-procesador-madre-intel`}
                            className=" cursor-pointer"
                          >
                            <input
                              type="radio"
                              id={`marca-procesador-madre-intel`}
                              name="marca-procesador"
                              checked={processorBrand === "INTEL"}
                              disabled={(() => {
                                let lengthIntel = dataCopy.filter(
                                  (item: any) => {
                                    const caract =
                                      typeof item?.caracteristicas === "string"
                                        ? JSON.parse(item.caracteristicas)
                                        : item.caracteristicas;

                                    if (!Array.isArray(caract)) return false;

                                    return caract.some(
                                      (c: any) =>
                                        c.prop === "Fabricante de procesador" &&
                                        c.value?.toLowerCase() ===
                                          "INTEL".toLowerCase(), // o "INTEL"
                                    );
                                  },
                                ).length;
                                return lengthIntel === 0 ? true : false;
                              })()}
                              value={1}
                              onChange={handleOnSelectMarcaProcesadorMadre}
                            />
                            <span className="mx-1">{"INTEL"}</span>
                            <span className="mx-1">
                              {(() => {
                                let lengthIntel = dataCopy.filter(
                                  (item: any) => {
                                    const caract =
                                      typeof item?.caracteristicas === "string"
                                        ? JSON.parse(item.caracteristicas)
                                        : item.caracteristicas;

                                    if (!Array.isArray(caract)) return false;

                                    return caract.some(
                                      (c: any) =>
                                        c.prop === "Fabricante de procesador" &&
                                        c.value?.toLowerCase() ===
                                          "INTEL"?.toLowerCase(), // o "INTEL"
                                    );
                                  },
                                ).length;
                                return `(${Number(
                                  lengthIntel,
                                ).toLocaleString()})`;
                              })()}
                            </span>
                          </label>
                        </li>

                        <li className="px-2">
                          <label
                            htmlFor={`marca-procesador-madre-amd`}
                            className=" cursor-pointer"
                          >
                            <input
                              type="radio"
                              id={`marca-procesador-madre-amd`}
                              name="marca-procesador"
                              value={2}
                              checked={processorBrand === "AMD"}
                              disabled={(() => {
                                let lengthAMD = dataCopy.filter((item: any) => {
                                  const caract =
                                    typeof item?.caracteristicas === "string"
                                      ? JSON.parse(item.caracteristicas)
                                      : item.caracteristicas;

                                  if (!Array.isArray(caract)) return false;

                                  return caract.some(
                                    (c: any) =>
                                      c.prop === "Fabricante de procesador" &&
                                      c.value?.toLowerCase() ===
                                        "AMD"?.toLowerCase(), // o "INTEL"
                                  );
                                }).length;

                                return lengthAMD === 0 ? true : false;
                              })()}
                              onChange={handleOnSelectMarcaProcesadorMadre}
                            />
                            <span className="mx-1">{"AMD"}</span>
                            <span className="mx-1">
                              {(() => {
                                let lengthAMD = dataCopy.filter((item: any) => {
                                  const caract =
                                    typeof item?.caracteristicas === "string"
                                      ? JSON.parse(item.caracteristicas)
                                      : item.caracteristicas;

                                  if (!Array.isArray(caract)) return false;

                                  return caract.some(
                                    (c: any) =>
                                      c.prop === "Fabricante de procesador" &&
                                      c.value?.toLowerCase() ===
                                        "AMD"?.toLowerCase(), // o "INTEL"
                                  );
                                }).length;

                                return `(${Number(
                                  lengthAMD,
                                ).toLocaleString()})`;
                              })()}
                            </span>
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
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

            {/* {data && data?.length > 0 ? (
              <> */}
            {data && data?.length > 0 && (
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
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="flex shrink-0">Ordenar por:</span>
                    <select
                      className="form-select"
                      value={orderBy}
                      onChange={(event) => {
                        setOrderBy(event?.target?.value);
                      }}
                    >
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      <option value={"1"}>Mayor precio</option>
                      <option value={"2"}>Menor precio</option>
                    </select>
                  </div>
                </div>

                <hr />
              </>
            )}
            {/* </> */}
            {/* ) : (
              ""
            )} */}
            <div>
              {data && data.length > 0 ? (
                data
                  .slice(startIndex, endIndex)
                  .sort((a: any, b: any) => {
                    // Primero los que tienen stock > 0
                    if (a.stock > 0 && b.stock === 0) return -1;
                    if (a.stock === 0 && b.stock > 0) return 1;
                    return 0; // Mantiene el orden original si ambos son iguales
                  })
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
                                      <div className="comments flex h-[10px]">
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

                              <div className="grid grid-cols-[1fr_1fr_auto] my-1 gap-4">
                                {/* Características */}
                                <div>
                                  {item?.caracteristicas &&
                                  (typeof item?.caracteristicas === "object" ||
                                    typeof item?.caracteristicas ===
                                      "string") ? (
                                    (() => {
                                      try {
                                        const caracs =
                                          typeof item?.caracteristicas ===
                                          "string"
                                            ? JSON.parse(item.caracteristicas)
                                            : item?.caracteristicas;

                                        if (
                                          Array.isArray(caracs) &&
                                          caracs.length > 0
                                        ) {
                                          return (
                                            <ul className="space-y-1">
                                              {caracs
                                                .slice(0, 6)
                                                .map(
                                                  (
                                                    carac: any,
                                                    index: number,
                                                  ) => (
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
                                                          {carac.value &&
                                                          carac.value.length >
                                                            70
                                                            ? `${carac.value.slice(0, 70)}...`
                                                            : carac.value ||
                                                              "—"}
                                                        </span>
                                                      </span>

                                                      {/* Valor */}
                                                    </li>
                                                  ),
                                                )}
                                            </ul>
                                          );
                                        }
                                        return (
                                          <span>
                                            Sin características disponibles
                                          </span>
                                        );
                                      } catch (e) {
                                        return (
                                          <span>
                                            Sin características disponibles
                                          </span>
                                        );
                                      }
                                    })()
                                  ) : (
                                    <span>Sin características disponibles</span>
                                  )}
                                </div>

                                {/* Precio y stock */}
                                <div className="px-3">
                                  <span className="text-[20px] font-bold">
                                    {formatCurrency(Number(item.price))}
                                  </span>
                                  <br />
                                  <span>Disponibles: {item.stock} piezas</span>
                                </div>

                                {/* Botón */}
                                <div>
                                  <button
                                    disabled={
                                      loadingAddProductCar[item.idProduct] ||
                                      item.stock == 0 ||
                                      item.stock == "0"
                                    }
                                    className="bg-[#BB3D4B] text-white px-4 py-2 rounded flex items-center gap-2"
                                    onClick={() => {
                                      if (
                                        (item?.isPC == 0 || item?.isPc == 0) &&
                                        item?.product_stock.length > 0 &&
                                        Number(item?.providerId) != 1
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
                                        handleAddProductCart(item);
                                      }
                                    }}
                                  >
                                    {item?.isPC == 0 &&
                                    loadingAddProductCar[item.idProduct] &&
                                    Number(item?.providerId) != 1 ? (
                                      <MdAutorenew
                                        size={20}
                                        className="m-auto the-spinner"
                                      />
                                    ) : item.stock == "0" || item.stock == 0 ? (
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
