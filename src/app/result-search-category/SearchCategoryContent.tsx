"use client";

import styles from "./result-search-category.module.css";
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

const SearchCategoryContent = () => {
  const { setDataModal, socketPagos, socketServer, setDataFavorites } =
    useTheContext();

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<any>("");
  const { requestPostProveedor } = useProveedores();
  const [data, setData] = useState<ProductI[]>([]);
  const [dataCopy, setDataCopy] = useState<ProductI[]>([]);
  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca] = useState<any>("");
  const [processorBrand, setProcessorBrand] = useState<"INTEL" | "AMD" | null>(
    null,
  );
  const [searchText, setSearchText] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
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
    const allowedParams = ["idProduct", "name", "categoryId"];
    const invalidParams = Array.from(searchParams.keys()).filter(
      (key) => !allowedParams.includes(key),
    );
    if (invalidParams.length > 0) return;
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
    if (marca) {
      filtered = filtered.filter((item: any) => item.marcaId == marca);
    }
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
        const updateFn = (prevData: any) =>
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
                if (!xx) return xx;
                const branchStock = branchesEntries.find(
                  ([nameBranch]) => nameBranch === xx.branches?.name,
                );
                return {
                  ...xx,
                  stock: branchStock ? Number(branchStock[1]) : xx.stock,
                };
              }),
            };
          });
        setData(updateFn);
        setDataCopy(updateFn);
      }
    });

    return () => {
      socketCron?.current?.off("updatedStockCron");
    };
  }, [socketCron?.current]);

  useEffect(() => {
    if (!socketServer.current) return;
    if (!socketPagos.current) return;

    const socket = socketServer.current;

    const handlerUpdateProduct = (data: ProductI) => {
      const updateFn = (prev: any) =>
        prev.map((item: any) => {
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
        });
      setDataCopy(updateFn);
      setData(updateFn);
    };

    const handlerUpdateProductComponent = (dataSocket: ProductI) => {
      const updateFn = (prev: any) =>
        prev.map((item: any) => {
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
        });
      setDataCopy(updateFn);
      setData(updateFn);
      setDataFavorites((prevFavorites) =>
        prevFavorites.map((item: any) => {
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
        }),
      );
    };

    const handleUpdatedStock = (
      dataSocket: { idProduct: number; stock: Number }[],
    ) => {
      const updateFn = (prev: any) =>
        prev.map((item: any) => {
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
        });
      setDataCopy(updateFn);
      setData(updateFn);
    };

    socket.on("updateProductComponent", handlerUpdateProductComponent);
    socket.on("updateProduct", handlerUpdateProduct);
    socketPagos?.current?.on("updatedStock", handleUpdatedStock);

    // socketPagos?.current?.on("removeStorageProgressPay2", () => {
    //   localStorage.removeItem("progressPay2");
    // });

    return () => {
      socket.off("updateProduct", handlerUpdateProduct);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
      socketPagos?.current?.off("updatedStock", handleUpdatedStock);
      // socketPagos?.current?.off("removeStorageProgressPay2", () => {
      //   localStorage.removeItem("progressPay2");
      // });
    };
  }, [socketServer.current, socketPagos?.current]);

  const ratingProgress = [
    { id: 1, rating: 5 },
    { id: 2, rating: 4 },
    { id: 3, rating: 3 },
    { id: 4, rating: 2 },
    { id: 5, rating: 1 },
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
      minWidth: 260,
      maxWidth: "95vw",
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
      if (item.rating === progressRating.rating) return acc + 1;
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
      }
      return 0;
    }, 0);
    const percentage =
      totalRatingCount > 0 ? (ratingCount / totalRatingCount) * 100 : 0;
    return { percentage, rating: progressRating.rating };
  };

  const hasSidebar =
    marcas && marcas?.length > 0 && (marcas as any)?.[0]?.idMarca != null;

  return (
    <section className={styles.section}>
      {!loadingData ? (
        <div className={`mt-2 w-full ${hasSidebar ? styles.mainGrid : ""}`}>
          {hasSidebar && (
            <>
              {/* Botón toggle — solo visible en móvil/tablet (<1024px) */}
              <button
                className={styles.filterToggle}
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                <MdFilterList size={20} />
                <span>
                  {sidebarOpen ? "Ocultar filtros" : "Mostrar filtros"}
                </span>
              </button>

              {/* Sidebar */}
              <aside
                className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
              >
                <button
                  className={styles.resetFilterBtn}
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
                >
                  Resetear Filtro
                  <MdFilterList size={22} />
                </button>

                <span className={styles.sidebarTitle}>Marcas</span>
                <ul className={styles.marcaList}>
                  {marcas &&
                    marcas.map((m: any, indexMarca: number) => (
                      <li key={indexMarca}>
                        <label
                          htmlFor={`marca${m.idMarca}`}
                          className={styles.marcaLabel}
                        >
                          <input
                            type="radio"
                            id={`marca${m.idMarca}`}
                            name="marca"
                            value={m.idMarca}
                            checked={Number(marca) === m.idMarca}
                            onChange={handleOnSelectMarca}
                          />
                          <span style={{ margin: "0 4px" }}>{m.name}</span>
                          <span style={{ margin: "0 4px" }}>
                            {`(${Number(
                              dataCopy.filter(
                                (item: any) => item.marcaId == m.idMarca,
                              ).length,
                            ).toLocaleString()})`}
                          </span>
                        </label>
                      </li>
                    ))}
                </ul>

                {categoryId == "10" && (
                  <div style={{ marginTop: 12 }}>
                    <span className={styles.sidebarTitle}>
                      Marca del procesador
                    </span>
                    <ul className={styles.marcaList}>
                      {(["INTEL", "AMD"] as const).map((brand) => {
                        const lengthBrand = dataCopy.filter((item: any) => {
                          const caract =
                            typeof item?.caracteristicas === "string"
                              ? JSON.parse(item.caracteristicas)
                              : item.caracteristicas;
                          if (!Array.isArray(caract)) return false;
                          return caract.some(
                            (c: any) =>
                              c.prop === "Fabricante de procesador" &&
                              c.value?.toLowerCase() === brand.toLowerCase(),
                          );
                        }).length;

                        return (
                          <li key={brand}>
                            <label
                              htmlFor={`marca-procesador-madre-${brand.toLowerCase()}`}
                              className={styles.marcaLabel}
                            >
                              <input
                                type="radio"
                                id={`marca-procesador-madre-${brand.toLowerCase()}`}
                                name="marca-procesador"
                                checked={processorBrand === brand}
                                disabled={lengthBrand === 0}
                                value={brand === "INTEL" ? 1 : 2}
                                onChange={handleOnSelectMarcaProcesadorMadre}
                              />
                              <span style={{ margin: "0 4px" }}>{brand}</span>
                              <span style={{ margin: "0 4px" }}>
                                {`(${Number(lengthBrand).toLocaleString()})`}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </aside>
            </>
          )}

          {/* Contenido principal */}
          <div className={styles.mainContent}>
            <h3 className={styles.categoryTitle}>
              {data && data.length > 0 ? (data[0] as any).nameCategoria : ""}
            </h3>

            {data && data?.length > 0 && (
              <>
                <div
                  className={`${styles.searchBar}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className={styles.searchInput}
                    onChange={(event) =>
                      setSearchText(event.currentTarget.value)
                    }
                    value={searchText}
                  />
                  <div className={styles.sortWrapper}>
                    <span className={styles.sortLabel}>Ordenar por:</span>
                    <select
                      className="form-select"
                      value={filterValue}
                      onChange={(event) => {
                        setFilterValue(event.target?.value);

                        setData((prev) => {
                          const sorted = [...prev].sort((a: any, b: any) =>
                            event.target.value === "1"
                              ? Number(b.price) - Number(a.price)
                              : Number(a.price) - Number(b.price),
                          );
                          setPage(1);
                          return sorted;
                        });
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

            <div>
              {data && data.length > 0 ? (
                data
                  .slice(startIndex, endIndex)
                  .sort((a: any, b: any) => {
                    if (a.stock > 0 && b.stock === 0) return -1;
                    if (a.stock === 0 && b.stock > 0) return 1;
                    return 0;
                  })
                  .map((item: any, index: number) => (
                    <div key={index}>
                      {/* ====== Fila del producto ====== */}
                      <div className={styles.productRow}>
                        {/* Izquierda: info */}
                        <div className={styles.productInfo}>
                          <div className={styles.itemComponent}>
                            {/* Nombre */}
                            <a
                              role="button"
                              onClick={() =>
                                onRouterLink(
                                  `/detailsProduct/${item.idProduct}`,
                                )
                              }
                              className={styles.productName}
                            >
                              {item.name}
                            </a>

                            {/* SKU + Rating */}
                            <div className={styles.skuRatingGrid}>
                              {/* SKU / UPC */}
                              <div>
                                {item?.upc && (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 4,
                                    }}
                                  >
                                    <span style={{ color: "#808080" }}>
                                      SKU: {item.sku}
                                    </span>
                                    <span style={{ fontWeight: "bold" }}>
                                      UPC:
                                      <span
                                        style={{
                                          fontWeight: "normal",
                                          marginLeft: 4,
                                        }}
                                      >
                                        {item.upc}
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Rating */}
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
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <Rating
                                      name="simple-controlled"
                                      max={5}
                                      readOnly
                                      value={promedioRating}
                                      size="medium"
                                      sx={{ color: "#BB3D4B" }}
                                    />
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <StyledTooltip
                                        title={
                                          <div style={{ width: "100%" }}>
                                            <Box>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Rating
                                                  value={item.rating}
                                                  readOnly
                                                  size="medium"
                                                  precision={0.5}
                                                  sx={{ color: "#BB3D4B" }}
                                                />
                                                <span
                                                  style={{
                                                    color: "#666",
                                                    fontWeight: "bold",
                                                    fontSize: 18,
                                                    marginLeft: 8,
                                                  }}
                                                >
                                                  {item.reviews.length.toLocaleString()}{" "}
                                                  Opiniones
                                                </span>
                                              </div>
                                              <div style={{ marginTop: 8 }}>
                                                <span
                                                  style={{
                                                    color: "#808080",
                                                    fontSize: 16,
                                                  }}
                                                >
                                                  {item.rating} estrellas
                                                </span>
                                              </div>
                                              <div style={{ marginTop: 12 }}>
                                                {ratingProgress.map(
                                                  (progressRating) => (
                                                    <div
                                                      key={progressRating.id}
                                                      style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginBottom: 8,
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: 200,
                                                          height: 15,
                                                          borderRadius: 5,
                                                          background: "#E7E7E7",
                                                          position: "relative",
                                                          overflow: "hidden",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            width: `${calcPorcentaje(item, dataProducts, progressRating).percentage}%`,
                                                            height: 15,
                                                            background:
                                                              "#BB3D4B",
                                                            borderRadius: 5,
                                                          }}
                                                        />
                                                      </div>
                                                      <span
                                                        style={{
                                                          fontSize: 15,
                                                          color: "#606060",
                                                          fontWeight: "bold",
                                                          margin: "0 8px",
                                                        }}
                                                      >
                                                        {
                                                          calcPorcentaje(
                                                            item,
                                                            dataProducts,
                                                            progressRating,
                                                          ).rating
                                                        }
                                                      </span>
                                                      <MdStar
                                                        color="#ccc"
                                                        size={20}
                                                      />
                                                      <span
                                                        style={{
                                                          color: "#ccc",
                                                          fontSize: 13,
                                                          marginLeft: 4,
                                                        }}
                                                      >
                                                        (
                                                        {item.reviews.reduce(
                                                          (
                                                            acc: any,
                                                            r: any,
                                                          ) => {
                                                            if (
                                                              r.rating ===
                                                              progressRating.rating
                                                            )
                                                              return acc + 1;
                                                            return acc;
                                                          },
                                                          0,
                                                        )}
                                                        )
                                                      </span>
                                                    </div>
                                                  ),
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
                                                    fontSize: 17,
                                                    textDecoration: "none",
                                                    cursor: "pointer",
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
                                        <button
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "1px solid #ccc",
                                            borderRadius: 2,
                                            width: 20,
                                            height: 20,
                                            marginLeft: 5,
                                            background: "transparent",
                                            cursor: "pointer",
                                            flexShrink: 0,
                                          }}
                                        >
                                          <MdArrowDropDown
                                            size={10}
                                            color="gray"
                                          />
                                        </button>
                                      </StyledTooltip>
                                      <a
                                        style={{
                                          marginLeft: 5,
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        {item.reviews
                                          .filter(
                                            (itemF: any) =>
                                              itemF.productId == item.idProduct,
                                          )
                                          .length.toLocaleString()}{" "}
                                        opiniones
                                      </a>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Características / Precio / Botón */}
                            <div className={styles.detailGrid}>
                              {/* Características */}
                              <div>
                                {item?.caracteristicas &&
                                (typeof item?.caracteristicas === "object" ||
                                  typeof item?.caracteristicas === "string") ? (
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
                                          <ul
                                            style={{
                                              listStyle: "none",
                                              padding: 0,
                                              margin: 0,
                                            }}
                                          >
                                            {caracs
                                              .slice(0, 6)
                                              .map(
                                                (carac: any, index: number) => (
                                                  <li
                                                    key={index}
                                                    style={{
                                                      fontSize: 13,
                                                      marginTop: 4,
                                                    }}
                                                  >
                                                    <span
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {carac.prop}:{" "}
                                                    </span>
                                                    <span
                                                      style={{
                                                        fontStyle: "italic",
                                                        wordBreak: "break-word",
                                                      }}
                                                    >
                                                      {carac.value &&
                                                      carac.value.length > 70
                                                        ? `${carac.value.slice(0, 70)}...`
                                                        : carac.value || "—"}
                                                    </span>
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
                              <div style={{ padding: "0 12px" }}>
                                <span
                                  style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                  {formatCurrency(Number(item.price))}
                                </span>
                                <br />
                                <span>Disponibles: {item.stock} piezas</span>
                              </div>

                              {/* Botón */}
                              <div className={styles.addToCartWrapper}>
                                <button
                                  disabled={
                                    loadingAddProductCar[item.idProduct] ||
                                    item.stock == 0 ||
                                    item.stock == "0"
                                  }
                                  className={styles.addToCartBtn}
                                  onClick={() => {
                                    if (
                                      (item?.isPC == 0 || item?.isPc == 0) &&
                                      item?.product_stock.length > 0 &&
                                      Number(item?.providerId) === 3
                                    ) {
                                      setDataModal({
                                        isOpen: true,
                                        message: (
                                          <div
                                            className={
                                              styles.branchSelectorWrapper
                                            }
                                          >
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
                        </div>

                        {/* Derecha: Carousel — SIEMPRE visible en todos los breakpoints */}
                        <div className={styles.carouselWrapper}>
                          <Carousel
                            showIndicators={true}
                            showThumbs={false}
                            showStatus={false}
                            showArrows={true}
                            onClickItem={() =>
                              onRouterLink(`/detailsProduct/${item.idProduct}`)
                            }
                          >
                            {item.image_url && item.image_url.length > 0
                              ? item.image_url.map((img: string, i: number) => (
                                  <div key={i} className={styles.carouselSlide}>
                                    <img
                                      src={img}
                                      className={styles.productImg}
                                      loading="lazy"
                                    />
                                  </div>
                                ))
                              : [
                                  <div key="no-img" style={{ padding: 8 }}>
                                    Sin imágenes
                                  </div>,
                                ]}
                          </Carousel>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))
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
        <div className={styles.paginationWrapper}>
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
