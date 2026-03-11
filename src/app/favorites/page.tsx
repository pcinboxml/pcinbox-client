"use client";
import {
  MdArrowDropDown,
  MdAutorenew,
  MdShoppingCart,
  MdStar,
} from "react-icons/md";
import useFavorites from "../services/useFavorites";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { Alert, Box, Rating, styled, Tooltip } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import ProductI from "../interfaces/products/product.interface";
import { useState } from "react";
import BranchSelector from "../components/branchSelector/BranchSelector";

const Favorites = () => {
  const {
    handleAddFavoriteCart,
    handleSelectOrden,
    handleRemoveFavorite,
    loadingAddId,
    loadingRemoveId,
  } = useFavorites();
  const { dataFavorites, dataProducts, setDataModal } = useTheContext();
  const { formatCurrency, onRouterLink } = useService();

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

  const calcPorcentaje = (
    reviews: {
      idReview: string;
      productId: string;
      rating: number;
      title: string;
      description: string;
      date: string;
      reviewerName: string;
    }[],
    dataProducts: ProductI[],
    progressRating: any,
    idProduct: number,
  ) => {
    const ratingCount = reviews?.reduce((acc, item) => {
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
              item.idProduct == String(idProduct),
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
      <h5
        style={{
          color: "#bb3d4b",
          fontWeight: "bold",
        }}
      >
        Mis Favoritos
      </h5>

      <br />

      {dataFavorites && dataFavorites.length > 0 ? (
        <div className="w-full flex justify-end items-center p-2">
          <div className="grid grid-cols-[100px_150px]">
            <div className="flex justify-end px-1">
              <label htmlFor="fecha" className="col-form-label">
                Ordenar:
              </label>
            </div>
            <div>
              <select
                name="fecha"
                id="fecha"
                className="form-select"
                onChange={handleSelectOrden}
              >
                <option defaultValue="date">Fecha</option>
                <option value="z_a">Nombre Z-A</option>
                <option value="a_z">Nombre A-Z</option>
                <option value="mayor_precio">Mayor Precio</option>
                <option value="menor_precio">Menor Precio</option>
              </select>
            </div>
          </div>
          {/* <div className="grid grid-cols-[100px_200px]">
            <div className="flex justify-end px-1">
              <label htmlFor="filtro" className="col-form-label">
                Filtrar:
              </label>
            </div>
            <div>
              <select name="filtro" id="filtro" className="form-select">
                <option value="todos_los_productos">Todos los productos</option>
              </select>
            </div>
          </div> */}
        </div>
      ) : (
        <Alert severity="info">No hay datos para mostrar</Alert>
      )}

      <div className="mb-11">
        {dataFavorites &&
          dataFavorites.length > 0 &&
          dataFavorites.map((favorite, index) => {
            return (
              <div key={index}>
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="flex flex-col">
                    <div className="item-component p-3">
                      <a
                        role="button"
                        onClick={() => {
                          onRouterLink(`/detailsProduct/${favorite.productId}`);
                        }}
                        className="text-[#BB3D4B] font-bold"
                        style={{
                          color: "#BB3D4B",
                        }}
                      >
                        {favorite?.products?.name}
                      </a>
                      {/* <span className="text-[#BB3D4B] font-bold">
                                {item.name}
                              </span> */}
                      <div className="grid grid-cols-[1fr_1fr_1fr] my-1">
                        <div className="flex">
                          {favorite?.products?.upc && (
                            <div className="flex flex-col gap-1">
                              <span className="text-[#808080]">
                                SKU: {favorite?.products?.sku}
                              </span>
                              <span className="font-bold text-black">
                                UPC:
                                <span className="font-normal mx-1">
                                  {favorite?.products?.upc}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                        {(() => {
                          const promedioRating =
                            favorite?.products?.reviews?.length! > 0
                              ? favorite?.products?.reviews.reduce(
                                  (sum: any, review: any) =>
                                    sum + review.rating,
                                  0,
                                ) / favorite?.products?.reviews?.length!
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
                                            value={favorite?.products?.rating}
                                            readOnly
                                            size="medium"
                                            precision={0.5}
                                            sx={{
                                              color: "#BB3D4B",
                                            }}
                                          />

                                          <span className="text-[#666666] font-bold text-[18px] block mx-2">
                                            {favorite?.products?.reviews?.length.toLocaleString()}{" "}
                                            Opiniones
                                          </span>
                                        </div>
                                        <div className="mt-2">
                                          <span className="text-[#808080] text-[16px] ">
                                            {favorite?.products?.rating}{" "}
                                            estrellas
                                          </span>
                                        </div>

                                        <div className="mt-3 grid grid-cols[1fr_auto] w-full">
                                          {ratingProgress &&
                                            ratingProgress.map(
                                              (progressRating) => {
                                                return (
                                                  <div
                                                    className="flex items-center mb-2"
                                                    key={progressRating.id}
                                                  >
                                                    <div
                                                      className="barProgress"
                                                      style={{
                                                        width: "200px",
                                                        height: "15px",
                                                        borderRadius: "5px",
                                                        background: "#E7E7E7",
                                                        position: "relative",
                                                      }}
                                                    >
                                                      <div
                                                        style={{
                                                          width: calcPorcentaje(
                                                            favorite.products
                                                              ?.reviews!,
                                                            dataProducts,
                                                            progressRating,
                                                            favorite.productId,
                                                          ).percentage,
                                                          height: "15px",
                                                          top: "0",
                                                          left: "0",
                                                          bottom: "0",
                                                          background: "#BB3D4B",
                                                          borderRadius: "5px",
                                                        }}
                                                      ></div>
                                                    </div>
                                                    <div className="text-[15px] text-[#606060] font-bold mx-2">
                                                      {
                                                        calcPorcentaje(
                                                          favorite.products
                                                            ?.reviews!,
                                                          dataProducts,
                                                          progressRating,
                                                          favorite.productId,
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
                                                        {favorite?.products?.reviews.reduce(
                                                          (
                                                            acc: any,
                                                            item: any,
                                                          ) => {
                                                            if (
                                                              item.rating ===
                                                              progressRating.rating
                                                            ) {
                                                              return acc + 1;
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
                                                `/review?idProduct=${favorite?.products?.idProduct}`,
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
                                            {favorite?.products?.reviews.length.toLocaleString()}
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
                                      <MdArrowDropDown size={10} color="gray" />
                                    </button>
                                  </div>
                                </StyledTooltip>
                                <a style={{ marginLeft: "5px" }}>
                                  {favorite?.products?.reviews
                                    .filter(
                                      (itemF: any) =>
                                        itemF.productId ==
                                        favorite?.products?.idProduct,
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
                        <div>
                          <ul>
                            {favorite?.products?.caracteristicas
                              ? (() => {
                                  try {
                                    const caracs = JSON.parse(
                                      favorite?.products?.caracteristicas,
                                    );
                                    if (
                                      Array.isArray(caracs) &&
                                      caracs.length > 0
                                    ) {
                                      return caracs
                                        .slice(0, 6)
                                        .map((carac: any, index: number) => (
                                          <li
                                            key={index}
                                            className="flex gap-2 items-end"
                                          >
                                            <span className="font-bold text-black text-[13px]">
                                              {carac.prop}:
                                            </span>
                                            <span className="italic text-[13px]">
                                              {carac.value}
                                            </span>
                                          </li>
                                        ));
                                    }
                                    return "Sin caracteristicas disponibles";
                                  } catch (e) {
                                    return "Sin caracteristicas disponibles";
                                  }
                                })()
                              : "Sin caracteristicas disponibles"}
                          </ul>
                        </div>
                        <div className="px-3">
                          <span className="text-[20px] font-bold">
                            {formatCurrency(Number(favorite?.products?.price))}
                          </span>
                          <br />
                          {/* <span>Costo de envio: $160</span> */}
                          {/* <br /> */}
                          <span>
                            Disponibles: {favorite?.products?.stock} piezas
                          </span>
                        </div>
                        <div>
                          <button
                            disabled={
                              loadingAddId == favorite.products?.idProduct ||
                              favorite?.products?.stock == 0
                            }
                            className="bg-[#BB3D4B] text-white px-2 py-2 rounded flex items-center gap-2"
                            onClick={() => {
                              if (
                                (favorite?.products?.isPC == 0 ||
                                  favorite?.products?.isPc == 0) &&
                                favorite?.products?.product_stock!.length > 0 &&
                                Number(favorite?.products?.providerId) != 1
                              ) {
                                setDataModal({
                                  isOpen: true,
                                  message: (
                                    <div className="w-[800px] border">
                                      <BranchSelector
                                        productSelected={favorite?.products}
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
                                handleAddFavoriteCart(favorite);
                              }
                            }}
                          >
                            {loadingAddId == favorite.products?.idProduct ? (
                              <MdAutorenew
                                size={20}
                                className="m-auto the-spinner"
                              />
                            ) : (
                              <>
                                {favorite?.products?.stock == 0 ? (
                                  "No disponible"
                                ) : (
                                  <>
                                    Agregar al carrito
                                    <MdShoppingCart size={20} color="white" />
                                  </>
                                )}
                              </>
                            )}
                          </button>

                          <button
                            className="border bg-white text-black rounded px-2 py-2 my-2"
                            disabled={
                              loadingRemoveId === favorite?.products?.idProduct
                            }
                            onClick={() => handleRemoveFavorite(favorite)}
                          >
                            {loadingRemoveId ===
                            favorite?.products?.idProduct ? (
                              <MdAutorenew
                                size={20}
                                className="m-auto the-spinner"
                              />
                            ) : (
                              "Eliminar"
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
                          `/detailsProduct/${favorite?.products?.idProduct}`,
                        );
                      }}
                    >
                      {(favorite?.products as any).image_url &&
                      (favorite?.products as any).image_url.length > 0
                        ? (favorite?.products as any).image_url.map(
                            (img: string, i: number) => (
                              <div key={i}>
                                <img
                                  src={img}
                                  style={{
                                    objectFit: "contain",
                                    height: "auto",
                                    maxHeight: "200px",
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
          })}
      </div>
    </section>
  );
};

export default Favorites;
