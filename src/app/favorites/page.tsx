"use client";
import { MdAutorenew, MdShoppingCart } from "react-icons/md";
import useFavorites from "../services/useFavorites";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { Alert } from "@mui/material";
import { Carousel } from "react-responsive-carousel";

const Favorites = () => {
  const {
    handleAddFavoriteCart,
    handleSelectOrden,
    handleRemoveFavorite,
    loadingRemoveFavorite,
    loadingAddCartFavorite,
  } = useFavorites();
  const { dataFavorites } = useTheContext();
  const { formatCurrency, onRouterLink } = useService();

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
          dataFavorites.map((favorite) => {
            return (
              <div
                className="border grid grid-cols-[250px_1fr] my-3"
                key={favorite.idFavorite}
              >
                <div className="container-img-favorite overflow-hidden">
                  <Carousel
                    showIndicators={true}
                    showThumbs={false}
                    showStatus={false}
                    showArrows={true}
                    onClickItem={() => {
                      onRouterLink(
                        `/detailsProduct/${favorite.products?.idProduct}`
                      );
                    }}
                  >
                    {favorite.image_url && favorite.image_url.length > 0
                      ? favorite.image_url.map((img: string, i: number) => (
                          <div key={i} className="cursor-pointer">
                            <img
                              src={img}
                              style={{
                                objectFit: "contain",
                                height: "200px",
                              }}
                              loading="lazy"
                            />
                          </div>
                        ))
                      : [<div key="no-img">Sin imágenes</div>]}
                  </Carousel>
                </div>

                <div className="content-favorite grid grid-cols-[5fr_auto]">
                  <div className="flex flex-col p-3">
                    <p
                      className="text-[#606060]"
                      style={{ fontWeight: "bold" }}
                    >
                      <span className="font-bold text-black">Nombre:</span>{" "}
                      {favorite?.products?.name}
                    </p>

                    {favorite.products?.description ? (
                      <p
                        className="text-[#606060]"
                        style={{ fontWeight: "bold" }}
                      >
                        <span className="font-bold text-black">
                          Descripción:
                        </span>{" "}
                        {favorite?.products?.description}
                      </p>
                    ) : null}

                    <p>
                      <span className="font-bold text-black">SKU: </span>
                      <span className="text-[#cccccc]">
                        {favorite.products?.sku}
                      </span>
                    </p>

                    <p>
                      <span className="font-bold text-black">
                        Fecha de agregado:
                      </span>

                      <span
                        className="text-[#606060]"
                        style={{ fontWeight: "bold" }}
                      >
                        {" "}
                        {favorite.createdAt != null
                          ? new Date(favorite?.createdAt || "").toLocaleString()
                          : ""}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-row items-center justify-center">
                    <div className="flex flex-col items-end">
                      <span
                        className="text-[#bb3d4b]"
                        style={{ fontWeight: "bold", fontSize: "19px" }}
                      >
                        {formatCurrency(Number(favorite.products?.price))}
                      </span>

                      <span
                        className="text-[#606060]"
                        style={{ fontWeight: "bold", fontSize: "14px" }}
                      >
                        Disponibles: {favorite.products?.stock.toLocaleString()}{" "}
                        piezas
                      </span>
                    </div>

                    <div className="flex flex-col mx-3">
                      <button
                        className="bg-[#bb3d4b] px-2 py-2 text-[white] rounded flex flex-row items-center gap-2"
                        style={{ fontWeight: "bold" }}
                        disabled={loadingAddCartFavorite}
                        onClick={() => handleAddFavoriteCart(favorite)}
                      >
                        {loadingAddCartFavorite ? (
                          <MdAutorenew
                            size={20}
                            className="m-auto the-spinner"
                          />
                        ) : (
                          <>
                            Agregar al carrito
                            <MdShoppingCart size={20} color="white" />
                          </>
                        )}
                      </button>

                      <button
                        className="border bg-white text-black rounded px-2 py-2 my-2"
                        disabled={loadingRemoveFavorite}
                        onClick={() => handleRemoveFavorite(favorite)}
                      >
                        {loadingRemoveFavorite ? (
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
            );
          })}
      </div>
    </section>
  );
};

export default Favorites;
