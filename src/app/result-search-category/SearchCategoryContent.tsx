"use client";

import styles from "./result-search-category.module.css";
import { Alert, Box, Rating, styled, Tooltip } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
  // Al principio del componente
//useScrollPosition("scroll-/result-search-category");

  
  const {
    setDataModal,
    socketPagos,
    socketServer,
    setDataFavorites,
    dataCategories,
    socketCron,
  } = useTheContext();

  const sectionRef = useRef<HTMLDivElement>(null);
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
  const [processorTipoMemoria, setProcessorTipoMemoria] = useState<
    "DDR4" | "DDR5" | null
  >(null);

  const [processorSocketProcesador, setProcessorSocketProcesador] = useState<
    "AM4" | "AM5" | null
  >(null);

  const [searchText, setSearchText] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<any>("");
  const { formatCurrency, onRouterLink, updateURL } = useService();

  const {
    startIndex,
    endIndex,
    page,
    setPage,
    handleChangePage,
    itemsPerPage,
    loadingAddProductCar,
    handleAddProductCart,
    prevPageRef
  } = useResultSearchCategory();
  const searchParams = useSearchParams();

  const idProduct = searchParams.get("idProduct");
  const name = searchParams.get("name");
  const categoryId = searchParams.get("categoryId");

   const prevFiltersRef = useRef({
      marca,
      processorBrand,
      processorTipoMemoria,
      processorSocketProcesador,
      searchText,
      orderBy
    });

  useEffect(() => {
    if (idProduct || name || categoryId) {
      handleGetData();
    }
  }, []);

  // useEffect(() => {
  //   const allowedParams = [
  //     "idProduct",
  //     "name",
  //     "categoryId",
  //     // "page",
  //     // "marca",
  //     // "search",
  //     // "order",
  //   ];
  //   const invalidParams = Array.from(searchParams.keys()).filter(
  //     (key) => !allowedParams.includes(key),
  //   );
  //   if (invalidParams.length > 0) return;
  //   handleGetData();
  // }, [searchParams]);

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
        setData(data.data.data.filter((product: any) => product?.stock !== 0));
        setDataCopy(
          data.data.data.filter((product: any) => product?.stock !== 0),
        );
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

  const handleOnSelectTipoMemoria = (event: ChangeEvent<HTMLInputElement>) => {
    const type = event?.target?.value === "1" ? "DDR4" : "DDR5";
    setProcessorTipoMemoria(type);
  };

  const handleOnSelectSocketProcesador = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const type = event?.target?.value === "1" ? "AM4" : "AM5";
    setProcessorSocketProcesador(type);
  };

  // useEffect(() => {
  //   let filtered = [...dataCopy];
  //   if (marca) {
  //     filtered = filtered.filter((item: any) => item.marcaId == marca);
  //   }
  //   if (processorBrand || processorTipoMemoria || processorSocketProcesador) {
  //     filtered = filtered.filter((item: any) => {
  //       const caract =
  //         typeof item.caracteristicas === "string"
  //           ? JSON.parse(item.caracteristicas)
  //           : item.caracteristicas;

  //       if (!Array.isArray(caract)) return false;

  //       const matchBrand = processorBrand
  //         ? caract.some(
  //             (c) =>
  //               c.prop === "Fabricante de procesador" &&
  //               c.value?.toLowerCase() === processorBrand.toLowerCase(),
  //           )
  //         : true;

  //       const matchMemory = processorTipoMemoria
  //         ? caract.some(
  //             (c) =>
  //               c.prop === "Tipo de memoria interna" &&
  //               c.value?.toLowerCase() === processorTipoMemoria.toLowerCase(),
  //           )
  //         : true;

  //       const matchSocket = processorSocketProcesador
  //         ? caract.some(
  //             (c) =>
  //               c.prop === "Socket de procesador" &&
  //               c.value
  //                 ?.toLowerCase()
  //                 .includes(processorSocketProcesador.toLowerCase()),
  //           )
  //         : true;

  //       return matchBrand && matchMemory && matchSocket;
  //     });
  //   }

  //   setData(filtered);
  // }, [
  //   marca,
  //   processorBrand,
  //   dataCopy,
  //   processorTipoMemoria,
  //   processorSocketProcesador,
  // ]);

  // useEffect(() => {
  //   if (searchText.trim().length < 3) {
  //     setData(dataCopy);
  //     return;
  //   }
  //   const term = searchText.toLowerCase().trim();
  //   const filtered = dataCopy.filter(
  //     (item: any) =>
  //       item.name.toLowerCase().includes(term) ||
  //       item.sku.toLowerCase().includes(term),
  //   );
  //   setData(filtered);
  // }, [searchText, dataCopy]);

 useEffect(() => {
  let filtered = [...dataCopy];

  // ===== FILTROS =====
  if (marca) {
    filtered = filtered.filter((item: any) => item.marcaId == marca);
  }

  if (processorBrand || processorTipoMemoria || processorSocketProcesador) {
    filtered = filtered.filter((item: any) => {
      const caract =
        typeof item.caracteristicas === "string"
          ? JSON.parse(item.caracteristicas)
          : item.caracteristicas;

      if (!Array.isArray(caract)) return false;

      const matchBrand = processorBrand
        ? caract.some(
            (c) =>
              c.prop === "Fabricante de procesador" &&
              c.value?.toLowerCase() === processorBrand.toLowerCase(),
          )
        : true;

      const matchMemory = processorTipoMemoria
        ? caract.some(
            (c) =>
              c.prop === "Tipo de memoria interna" &&
              c.value?.toLowerCase() === processorTipoMemoria.toLowerCase(),
          )
        : true;

      const matchSocket = processorSocketProcesador
        ? caract.some(
            (c) =>
              c.prop === "Socket de procesador" &&
              c.value
                ?.toLowerCase()
                .includes(processorSocketProcesador.toLowerCase()),
          )
        : true;

      return matchBrand && matchMemory && matchSocket;
    });
  }

  // ===== BUSCADOR =====
  const term = searchText.toLowerCase().trim();

  if (term.length >= 3) {
    filtered = filtered.filter((item: any) => {
      return (
        item.name?.toLowerCase().includes(term.trim()) ||
        item.description?.toLowerCase().includes(term.trim()) ||
        item.sku?.toLowerCase().includes(term.trim()) ||
        item.upc?.toLowerCase().includes(term.trim())
      );
    });
  }

  setData(filtered);
  
  const currentFilters = {
    marca,
    processorBrand,
    processorTipoMemoria,
    processorSocketProcesador,
    searchText,
    orderBy
  };
  
  const filtersChanged = JSON.stringify(currentFilters) !== JSON.stringify(prevFiltersRef.current);
  
  if (filtersChanged) {
    setPage(1);
    prevFiltersRef.current = currentFilters;
  }

}, [
  dataCopy,
  marca,
  processorBrand,
  processorTipoMemoria,
  processorSocketProcesador,
  searchText,
]);

useEffect(() => {
  if (prevPageRef.current !== page) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  prevPageRef.current = page;
}, [page]);

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

    return () => {
      socket.off("updateProduct", handlerUpdateProduct);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
      socketPagos?.current?.off("updatedStock", handleUpdatedStock);
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
      const sorted = [...prev].sort((a: any, b: any) =>
        orderBy === "1"
          ? Number(b.price) - Number(a.price)
          : Number(a.price) - Number(b.price),
      );
      return sorted;
    });
  }
}, [orderBy]);

  useEffect(() => {
    updateURL("/result-search-category", {
      page,
      marca,
      search: searchText,
      order: filterValue,
      idProduct,
      name,
      categoryId,
    });
  }, [page, marca, searchText, filterValue, idProduct, name, categoryId]);

  useEffect(() => {
    const pageParam = Number(searchParams.get("page")) || 1;
    const marcaParam = searchParams.get("marca");
    const searchParam = searchParams.get("search") || "";
    const orderParam = searchParams.get("order") || "";
    setPage(pageParam);
    setMarca(marcaParam ? Number(marcaParam) : "");
    setSearchText(searchParam);
    setFilterValue(orderParam);
  }, []);


useEffect(() => {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}, []);

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

    const handleResetFilters = () => {
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
      }

      if (
        findCategory &&
        findCategory?.name === "MEMORIAS RAM Y FLASH"
      ) {
        setProcessorTipoMemoria(null);
      }
    }
    setMarca(null);
    setOrderBy("");
    setFilterValue("");
    // *** SOLUCIÓN 1: Reiniciar la página a 1 al resetear ***
    setPage(1);
    prevFiltersRef.current = {
    marca: null,
    processorBrand: null,
    processorTipoMemoria: null,
    processorSocketProcesador: null,
    searchText: "",
    orderBy: ""
  };
};

  return (
    <section 
    className={styles.section}>
      {!loadingData ? (
        <div className={`mt-2 w-full ${hasSidebar ? styles.mainGrid : ""}`}>
          {hasSidebar && (
            <>
              <button
                className={styles.filterToggle}
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                <MdFilterList size={20} />
                <span>
                  {sidebarOpen ? "Ocultar filtros" : "Mostrar filtros"}
                </span>
              </button>

              <aside
                className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
              >
                <button
                  className={styles.resetFilterBtn}
                  onClick={handleResetFilters}
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
                {dataCategories.find(
                  (categorie) =>
                    Number(categorie?.idCategorie) === Number(categoryId),
                )?.name === "MEMORIAS RAM Y FLASH" && (
                  <div style={{ marginTop: 12 }}>
                    <span className={styles?.sidebarTitle}>
                      {"Tipo de memoria interna".toUpperCase()}
                    </span>
                    <ul className={styles.marcaList}>
                      {(["DDR4", "DDR5"] as const).map((tipoMemoria) => {
                        const lengthBrand = dataCopy.filter((item) => {
                          const caract =
                            typeof item?.caracteristicas === "string"
                              ? JSON.parse(item.caracteristicas)
                              : item.caracteristicas;
                          if (!Array.isArray(caract)) return false;
                          return caract.some(
                            (c) =>
                              c.prop === "Tipo de memoria interna" &&
                              c.value?.toLowerCase() ===
                                tipoMemoria.toLowerCase(),
                          );
                        }).length;

                        return (
                          <li key={tipoMemoria}>
                            <label
                              htmlFor={`tipo-memoria-${tipoMemoria.toLowerCase()}`}
                              className={styles.marcaLabel}
                            >
                              <input
                                type="radio"
                                id={`tipo-memoria-${tipoMemoria.toLowerCase()}`}
                                name="tipo-memoria"
                                checked={processorTipoMemoria === tipoMemoria}
                                disabled={lengthBrand === 0}
                                value={tipoMemoria === "DDR4" ? 1 : 2}
                                onChange={handleOnSelectTipoMemoria}
                              />
                              <span style={{ margin: "0 4px" }}>
                                {tipoMemoria}
                              </span>
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

                {dataCategories.find(
                  (categorie) =>
                    Number(categorie?.idCategorie) === Number(categoryId),
                )?.name === "TARJETAS MADRE" && (
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

                {dataCategories.find(
                  (categorie) =>
                    Number(categorie?.idCategorie) === Number(categoryId),
                )?.name === "TARJETAS MADRE" && (
                  <div style={{ marginTop: 12 }}>
                    <span className={styles.sidebarTitle}>
                      Marca del procesador
                    </span>
                    <ul className={styles.marcaList}>
                      {(["AM4", "AM5"] as const).map((socketProcesador) => {
                        const lengthSocketProcesador = dataCopy.filter(
                          (item) => {
                            const caract =
                              typeof item?.caracteristicas === "string"
                                ? JSON.parse(item.caracteristicas)
                                : item.caracteristicas;
                            if (!Array.isArray(caract)) return false;
                            return caract.some(
                              (c: any) =>
                                c.prop === "Socket de procesador" &&
                                c.value
                                  ?.toLowerCase()
                                  .includes(socketProcesador.toLowerCase()),
                            );
                          },
                        ).length;

                        return (
                          <li key={socketProcesador}>
                            <label
                              htmlFor={`socket-procesador-madre-${socketProcesador.toLowerCase()}`}
                              className={styles.marcaLabel}
                            >
                              <input
                                type="radio"
                                id={`socket-procesador-madre-${socketProcesador.toLowerCase()}`}
                                name="socket-procesador"
                                checked={
                                  processorSocketProcesador === socketProcesador
                                }
                                disabled={lengthSocketProcesador === 0}
                                value={socketProcesador === "AM4" ? 1 : 2}
                                onChange={handleOnSelectSocketProcesador}
                              />
                              <span style={{ margin: "0 4px" }}>
                                {socketProcesador}
                              </span>
                              <span style={{ margin: "0 4px" }}>
                                {`(${Number(lengthSocketProcesador).toLocaleString()})`}
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

          <div className={styles.mainContent}>
            <h3 className={styles.categoryTitle}>
              {data && data.length > 0 ? (data[0] as any).nameCategoria : ""}
            </h3>

            {dataCopy && dataCopy.length > 0 && (
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
                        setOrderBy(event.target?.value);
                        // setFilterValue(event.target?.value);
                        // setData((prev) => {
                        //   const sorted = [...prev].sort((a: any, b: any) =>
                        //     event.target.value === "1"
                        //       ? Number(b.price) - Number(a.price)
                        //       : Number(a.price) - Number(b.price),
                        //   );
                        //   setPage(1);
                        //   return sorted;
                        // });
                      }}
                    >
                      <option value={""} disabled>
                        Selecciona una opción
                      </option>
                      <option value={"1"}>Mayor precio</option>
                      <option value={"2"}>Menor precio</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* <div
              className="w-full mt-2 flex justify-end"
              style={{ padding: "2px" }}
            >
              {data && data?.length > 0 && (
                <div className={styles.paginationWrapper}>
                  <PaginationComponent
                    onChange={handleChangePage}
                    page={page}
                    count={Math.ceil(data.length / itemsPerPage)}
                  />
                </div>
              )}
            </div> */}

            <hr />

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
                      <div className={styles.productRow}>
                        <div className={styles.productInfo}>
                          <div className={styles.itemComponent}>
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

                            <div className={styles.skuRatingGrid}>
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
                                                  value={promedioRating} // Usar promedioRating calculado
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
                                                  {promedioRating.toFixed(1)}{" "}
                                                  estrellas
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
                                                            width: `${calcPorcentaje(item, data, progressRating).percentage}%`,
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
                                                            data,
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
                                        {item.reviews.length.toLocaleString()}{" "}
                                        opiniones
                                      </a>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className={styles.detailGrid}>
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

                              <div style={{ padding: "0 12px" }}>
                                <span
                                  style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                  {formatCurrency(Number(item.price))}
                                </span>
                                <br />
                                <span>Disponibles: {item.stock} piezas</span>
                              </div>

                              <div className={styles.addToCartWrapper}>
                                {/* === BOTÓN CORREGIDO === */}
                                <button
                                  disabled={
                                    loadingAddProductCar[item.idProduct] ||
                                    item.stock == 0 ||
                                    item.stock == "0"
                                  }
                                  className={`${styles.addToCartBtn} bg-[#BB3D4B] text-white px-4 py-2 rounded flex items-center gap-2`}
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
                                      <MdShoppingCart size={20} color="white" />
                                    </>
                                  )}
                                </button>
                                {/* === FIN DEL BOTÓN CORREGIDO === */}
                              </div>
                            </div>
                          </div>
                        </div>

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
        <Alert severity="info">Cargando...</Alert> // Mensaje más claro mientras carga
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





