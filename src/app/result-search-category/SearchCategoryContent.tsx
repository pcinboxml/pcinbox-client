"use client";

import styles from "./result-search-category.module.css";
import Image from "next/image";
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
import { useSafeSearchParams } from "../hooks/useSafeSearchParams";
import { Heart, Share2, LayoutGrid, Rows } from "lucide-react";
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

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [loadingToogleFavorite, setLoadingToogleFavorite] = useState<
    Record<number, boolean>
  >({});
  const [filterValue, setFilterValue] = useState<any>("");
  const [viewMode, setViewMode] = useState<"rectangular" | "square">("rectangular");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
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
  const {
    formatCurrency,
    onRouterLink,
    updateURL,
    handleToggleFavorites,
    handleShare,
  } = useService();

  const {
    startIndex,
    endIndex,
    page,
    setPage,
    handleChangePage,
    itemsPerPage,
    loadingAddProductCar,
    handleAddProductCart,
    prevPageRef,
    handleComprarAhora,
    banners_x_categoria,
    setBannerXCategoria,
  } = useResultSearchCategory();
  const { get } = useSafeSearchParams();

  const idProduct = get("idProduct");
  const name = get("name");
  const categoryId = get("categoryId");

  const prevFiltersRef = useRef({
    marca,
    processorBrand,
    processorTipoMemoria,
    processorSocketProcesador,
    searchText,
    orderBy,
  });

  useEffect(() => {
    if (idProduct || name || categoryId) {
      handleGetData();
    }
  }, [idProduct, name, categoryId]);
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
      orderBy,
    };

    const filtersChanged =
      JSON.stringify(currentFilters) !== JSON.stringify(prevFiltersRef.current);

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

    const handleUpdateCategoryBanner = async (dataUpdateCategoryBanner: {
      categoryId: string;
      url: string;
    }) => {
      if (dataUpdateCategoryBanner) {
        setBannerXCategoria((prev) => {
          return prev.map((banner) => {
            if (banner.category === dataUpdateCategoryBanner.categoryId) {
              return {
                ...banner,
                pathImg: dataUpdateCategoryBanner.url,
              };
            }
            return banner;
          });
        });
      }
    };

    socket.on("updateProductComponent", handlerUpdateProductComponent);
    socket.on("updateProduct", handlerUpdateProduct);
    socket.on("updateCategoryBanner", handleUpdateCategoryBanner);
    socketPagos?.current?.on("updatedStock", handleUpdatedStock);

    return () => {
      socket.off("updateProduct", handlerUpdateProduct);
      socket.off("updateProductComponent", handlerUpdateProductComponent);
      socket.off("updateCategoryBanner", handleUpdateCategoryBanner);
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
    const pageParam = Number(get("page")) || 1;
    const marcaParam = get("marca");
    const searchParam = get("search") || "";
    const orderParam = get("order") || "";
    setPage(pageParam);
    setMarca(marcaParam ? Number(marcaParam) : "");
    setSearchText(searchParam);
    setFilterValue(orderParam);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
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
        (categori) => Number(categori.idCategorie) === Number(categoryId),
      );
      if (findCategory && findCategory.name === "TARJETAS MADRE") {
        setProcessorBrand(null);
      }

      if (findCategory && findCategory?.name === "MEMORIAS RAM Y FLASH") {
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
      orderBy: "",
    };
  };

  if (!isMounted) {
    return (
      <section className={styles.section}>
        <Alert severity="info">Cargando...</Alert>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      {(() => {
        let findNameCategory = dataCategories.find(
          (categorie) => Number(categorie?.idCategorie) === Number(categoryId),
        );

        if (findNameCategory) {
          let findImg = banners_x_categoria.find((banner: any) => {
            return banner.name === findNameCategory?.name;
          });

          if (findImg) {
            return (
              <div className="w-full flex justify-center">
                {/* <div
                  className="
                 relative
                        overflow-hidden
                        rounded-3xl
                        bg-g         
                        radient-to-br
                      from-zinc-100
                      to-zinc-200
                      dark:from-zinc-900
                      dark:to-zinc-800
                        shadow-2xl
                        border
                      border-white/20
                      p-6
                      backdrop-blur-sm
                      transition-all
                      duration-500
                      hover:scale-[1.01]
                      hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]
    "
                > */}
                {/* Glow decorativo */}
                {/* <div className="absolute inset-0 bg-white/5 pointer-events-none" /> */}

                <Image
                  src={findImg?.pathImg}
                  width={1920}
                  height={470}
                  alt={`Img de categoria ${findNameCategory?.name}`}
                  className={`
                   rounded
                  transition-transform
                  duration-500
                  hover:scale-105
                  ${styles.imgPortada}
              `}
                  priority
                />
                {/* </div> */}
              </div>
            );
          }
        }
      })()}
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
                      Socket del procesador
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
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                    <div className={styles.viewModeToggle}>
                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${viewMode === "square" ? styles.toggleBtnActive : ""}`}
                        onClick={() => setViewMode("square")}
                        aria-label="Vista cuadrícula"
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.toggleBtn} ${viewMode === "rectangular" ? styles.toggleBtnActive : ""}`}
                        onClick={() => setViewMode("rectangular")}
                        aria-label="Vista lista"
                      >
                        <Rows size={18} />
                      </button>
                    </div>

                    <div className={styles.sortWrapper}>
                      <span className={styles.sortLabel}>Ordenar por:</span>
                      <select
                        className="form-select"
                        value={filterValue}
                        onChange={(event) => {
                          setFilterValue(event.target?.value);
                          setOrderBy(event.target?.value);
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
                </div>
              </>
            )}

            {/* 
            <div
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
            </div>
             */}

            <hr />

            <div>
              {data && data.length > 0 ? (
                viewMode === "square" ? (
                  <div className={styles.productsGrid}>
                    {data
                      .slice(startIndex, endIndex)
                      .sort((a: any, b: any) => {
                        if (a.stock > 0 && b.stock === 0) return -1;
                        if (a.stock === 0 && b.stock > 0) return 1;
                        return 0;
                      })
                      .map((item, index: number) => (
                        <div key={index} className={styles.productSquareCard}>
                          <div className={styles.squareCardHeader}>
                            {/* Favorito */}
                            <div>
                              <button
                                disabled={
                                  loadingToogleFavorite[Number(item?.idProduct)]
                                }
                                onClick={async () => {
                                  let isFavorite = (item as any)?.isFavorite;
                                  setLoadingToogleFavorite((prev) => ({
                                    ...prev,
                                    [item?.idProduct]: true,
                                  }));
                                  await handleToggleFavorites(
                                    isFavorite,
                                    Number(item?.idProduct),
                                    setData,
                                    setDataCopy,
                                  );
                                  setLoadingToogleFavorite((prev) => ({
                                    ...prev,
                                    [item?.idProduct]: false,
                                  }));
                                }}
                                aria-label={
                                  (item as any)?.isFavorite
                                    ? "Quitar de favoritos"
                                    : "Agregar a favoritos"
                                }
                                className={`
            group relative flex h-9 w-9 items-center justify-center
            rounded-[8px] border-none backdrop-blur-sm
            transition-all duration-200 active:scale-95
            ${
              (item as any)?.isFavorite
                ? "bg-red-900/70 text-red-300 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.5)] hover:bg-red-700/85 hover:text-white"
                : "bg-black/55 text-red-400 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)] hover:bg-red-800/75 hover:text-white"
            }
          `}
                              >
                                <Heart
                                  size={16}
                                  className="transition-transform duration-150 group-active:scale-90"
                                  fill={
                                    (item as any)?.isFavorite
                                      ? "currentColor"
                                      : "none"
                                  }
                                  strokeWidth={(item as any)?.isFavorite ? 0 : 1.75}
                                />
                              </button>
                            </div>

                            {/* Compartir */}
                            <button
                              title="Compartir"
                              onClick={async () => {
                                await handleShare(
                                  "Producto",
                                  item?.name || item?.description,
                                  `${
                                    process.env.NEXT_PUBLIC_NODE_ENV === "local"
                                      ? `http://localhost:3000/detailsProduct/${item?.idProduct}`
                                      : `https://www.pcinbox.com.mx/detailsProduct/${item?.idProduct}`
                                  }`,
                                );
                              }}
                              aria-label="Compartir"
                              className="
          group relative flex h-9 w-9 items-center justify-center
          rounded-[8px] border-none backdrop-blur-sm
          bg-slate-900/55 text-yellow-400
          shadow-[inset_0_0_0_1px_rgba(96,165,250,0.2)]
          transition-all duration-200
          hover:bg-blue-800/75 hover:text-white
          active:scale-95
        "
                            >
                              <Share2
                                size={16}
                                className="transition-transform duration-150 group-active:scale-90"
                                strokeWidth={1.75}
                              />
                            </button>
                          </div>

                          <div className={styles.squareCarouselWrapper}>
                            <Carousel
                              showIndicators={true}
                              showThumbs={false}
                              showStatus={false}
                              showArrows={true}
                              onClickItem={() =>
                                onRouterLink(`/detailsProduct/${item.idProduct}`)
                              }
                            >
                              {(item as any).image_url &&
                              (item as any).image_url.length > 0
                                ? (item as any).image_url.map(
                                    (img: string, i: number) => (
                                      <div
                                        key={i}
                                        className={styles.squareCarouselSlide}
                                      >
                                        <Image
                                          src={`${img}?tr=w-400,q-70,f-auto`}
                                          alt="producto"
                                          width={140}
                                          height={140}
                                          style={{
                                            objectFit: "contain",
                                            height: "140px",
                                            width: "140px",
                                            marginTop: "8px",
                                          }}
                                          sizes="(max-width: 768px) 100vw, 50vw"
                                          priority={i === 0}
                                        />
                                      </div>
                                    ),
                                  )
                                : [
                                    <div key="no-img" style={{ padding: 8, fontSize: 12 }}>
                                      Sin imágenes
                                    </div>,
                                  ]}
                            </Carousel>
                          </div>

                          <div className={styles.squareCardBody}>
                            <a
                              role="button"
                              onClick={() =>
                                onRouterLink(`/detailsProduct/${item.idProduct}`)
                              }
                              className={styles.squareProductName}
                              title={item.name}
                            >
                              {item.name}
                            </a>

                            <div className={styles.squareSkuRating}>
                              <span className={styles.squareSku}>SKU: {item.sku}</span>
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
                                  <div className={styles.squareRatingRow}>
                                    <Rating
                                      name="simple-controlled-square"
                                      max={5}
                                      readOnly
                                      value={promedioRating}
                                      size="small"
                                      sx={{ color: "#BB3D4B" }}
                                    />
                                    <span className={styles.squareReviewCount}>
                                      ({item.reviews.length})
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className={styles.squarePriceStockRow}>
                              <span className={styles.squarePrice}>
                                {formatCurrency(Number(item.price))}
                              </span>
                              <div className={styles.squareStockRow}>
                                <span
                                  className={`${styles.stockDot} ${
                                    item?.stock === undefined
                                      ? styles.stockDotOut
                                      : item.stock > 10
                                        ? styles.stockDotHigh
                                        : item.stock > 0
                                          ? styles.stockDotLow
                                          : styles.stockDotOut
                                  }`}
                                />
                                <span className={styles.squareStockText}>
                                  {item.stock === 0
                                    ? "Sin stock"
                                    : item.stock < 10
                                      ? `¡Solo ${item?.stock} pzas!`
                                      : `${item?.stock} pzas.`}
                                </span>
                              </div>
                            </div>

                            <div className={styles.squareActions}>
                              <button
                                disabled={
                                  loadingAddProductCar[item.idProduct] ||
                                  item.stock == 0
                                }
                                className={styles.squareAddToCartBtn}
                                onClick={() => {
                                  if (
                                    (item?.isPC == 0 || item?.isPc == 0) &&
                                    item?.product_stock!.length > 0 &&
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
                                    size={16}
                                    className="m-auto the-spinner"
                                  />
                                ) : item.stock == 0 ? (
                                  "No disponible"
                                ) : (
                                  <>
                                    Agregar
                                    <MdShoppingCart size={14} color="white" />
                                  </>
                                )}
                              </button>

                              <button
                                className={styles.squareBuyNowBtn}
                                disabled={item?.stock === 0}
                                onClick={() => handleComprarAhora(item)}
                              >
                                {item?.stock !== 0 ? "Comprar" : "No disponible"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  data
                    .slice(startIndex, endIndex)
                    .sort((a: any, b: any) => {
                      if (a.stock > 0 && b.stock === 0) return -1;
                      if (a.stock === 0 && b.stock > 0) return 1;
                      return 0;
                    })
                    .map((item, index: number) => (
                      <div key={index} className={styles.productCard}>
                      <div
                        className="flex justify-end"
                        style={{ marginLeft: "auto" }}
                      >
                        {/* Favorito */}
                        <div>
                          <button
                            disabled={
                              loadingToogleFavorite[Number(item?.idProduct)]
                            }
                            onClick={async () => {
                              let isFavorite = (item as any)?.isFavorite;
                              setLoadingToogleFavorite((prev) => ({
                                ...prev,
                                [item?.idProduct]: true,
                              }));
                              await handleToggleFavorites(
                                isFavorite,
                                Number(item?.idProduct),
                                setData,
                                setDataCopy,
                              );
                              setLoadingToogleFavorite((prev) => ({
                                ...prev,
                                [item?.idProduct]: false,
                              }));
                            }}
                            aria-label={
                              (item as any)?.isFavorite
                                ? "Quitar de favoritos"
                                : "Agregar a favoritos"
                            }
                            className={`
        group relative flex h-10 w-10 items-center justify-center
        rounded-[10px] border-none backdrop-blur-sm
        transition-all duration-200 active:scale-95
        ${
          (item as any)?.isFavorite
            ? "bg-red-900/70 text-red-300 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.5)] hover:bg-red-700/85 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(248,113,113,0.6),0_4px_14px_rgba(185,28,28,0.4)]"
            : "bg-black/55 text-red-400 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)] hover:bg-red-800/75 hover:text-white hover:shadow-[inset_0_0_0_1px_rgba(248,113,113,0.5),0_4px_14px_rgba(185,28,28,0.35)]"
        }
      `}
                          >
                            <Heart
                              size={18}
                              className="transition-transform duration-150 group-active:scale-90"
                              fill={
                                (item as any)?.isFavorite
                                  ? "currentColor"
                                  : "none"
                              }
                              strokeWidth={(item as any)?.isFavorite ? 0 : 1.75}
                            />
                          </button>
                        </div>

                        {/* Compartir */}
                        <button
                          title="Compartir"
                          onClick={async () => {
                            await handleShare(
                              "Producto",
                              item?.name || item?.description,
                              `${
                                process.env.NEXT_PUBLIC_NODE_ENV === "local"
                                  ? `http://localhost:3000/detailsProduct/${item?.idProduct}`
                                  : `https://www.pcinbox.com.mx/detailsProduct/${item?.idProduct}`
                              }`,
                            );
                          }}
                          aria-label="Compartir"
                          className="
      group relative flex h-10 w-10 items-center justify-center
      rounded-[10px] border-none backdrop-blur-sm
      bg-slate-900/55 text-yellow-400
      shadow-[inset_0_0_0_1px_rgba(96,165,250,0.2)]
      transition-all duration-200
      hover:bg-blue-800/75 hover:text-white
      hover:shadow-[inset_0_0_0_1px_rgba(96,165,250,0.5),0_4px_14px_rgba(29,78,216,0.35)]
      active:scale-95
    "
                        >
                          <Share2
                            size={18}
                            className="transition-transform duration-150 group-active:scale-90"
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>

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
                                <div className={styles.stockRow}>
                                  <span
                                    className={`${styles.stockDot} ${
                                      item?.stock === undefined
                                        ? styles.stockDotOut
                                        : item.stock > 10
                                          ? styles.stockDotHigh
                                          : item.stock > 0
                                            ? styles.stockDotLow
                                            : styles.stockDotOut
                                    }`}
                                  />

                                  <span className={styles.stockText}>
                                    {item.stock === 0
                                      ? "Sin stock"
                                      : item.stock < 10
                                        ? `¡Solo quedan ${item?.stock} pzas!`
                                        : `Disponibles: ${item?.stock} pzas.`}
                                  </span>
                                </div>
                              </div>

                              <div className={styles.addToCartWrapper}>
                                {/* === BOTÓN CORREGIDO === */}
                                <button
                                  disabled={
                                    loadingAddProductCar[item.idProduct] ||
                                    item.stock == 0
                                  }
                                  className={`${styles.addToCartBtn} bg-[#BB3D4B] text-white px-4 py-2 rounded flex items-center gap-2`}
                                  onClick={() => {
                                    if (
                                      (item?.isPC == 0 || item?.isPc == 0) &&
                                      item?.product_stock!.length > 0 &&
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
                                  ) : item.stock == 0 ? (
                                    "No disponible"
                                  ) : (
                                    <>
                                      Agregar al carrito
                                      <MdShoppingCart size={20} color="white" />
                                    </>
                                  )}
                                </button>
                                {/* === FIN DEL BOTÓN CORREGIDO === */}

                                <button
                                  className={`w-full bg-[#BB3D4B] text-white px-4 py-1 rounded flex items-center justify-center mt-2`}
                                  disabled={item?.stock === 0}
                                  onClick={() => handleComprarAhora(item)}
                                >
                                  {item?.stock !== 0
                                    ? "Comprar Ahora"
                                    : "No disponible"}
                                </button>
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
                            {(item as any).image_url &&
                            (item as any).image_url.length > 0
                              ? (item as any).image_url.map(
                                  (img: string, i: number) => (
                                    <div
                                      key={i}
                                      className={styles.carouselSlide}
                                    >
                                      <Image
                                        src={`${img}?tr=w-600,q-70,f-auto`}
                                        alt="producto"
                                        width={150}
                                        height={150}
                                        style={{
                                          objectFit: "contain",
                                          height: "150px",
                                          width: "150px",
                                          marginTop: "12px",
                                        }}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority={i === 0}

                                        // className={styles.productImg}
                                        // sizes="(max-width: 768px) 100vw, 50vw"
                                        // priority={i === 0}
                                      />
                                    </div>
                                  ),
                                )
                              : [
                                  <div key="no-img" style={{ padding: 8 }}>
                                    Sin imágenes
                                  </div>,
                                ]}
                          </Carousel>
                        </div>
                      </div>
                    </div>
                  ))
                )
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
