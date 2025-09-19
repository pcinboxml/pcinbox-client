"use client";

import { Rating } from "@mui/material";
import { useEffect } from "react";
import { MdAutorenew, MdStar } from "react-icons/md";
import useReview from "./useReview";
import useService from "../services/useService";

const Reviews = () => {
  const {
    handleGetProduct,
    handleAddProductCart,
    dataProduct,
    loadingAddProductCar,
  } = useReview();
  const { formatCurrency } = useService();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    handleGetProduct(Number(urlParams.get("idProduct")));
  }, []);
  return (
    <section className="mx-auto my-5" style={{ width: "80%" }}>
      <span className="text-[#bb3d4b] text-[17px] font-bold block my-5 text-center">
        Opiniones de clientes sobre{" "}
        <span
          style={{
            fontStyle: "italic",
          }}
        >
          {dataProduct?.description}
        </span>
      </span>

      <div className="w-full flex justify-between">
        <div className="desc-product w-[400px] border p-3">
          <span className="text-black font-bold text-[15px]">
            {dataProduct?.description}
          </span>
          <div className="container-product flex justify-between mt-4">
            <img
              src={dataProduct?.image_url}
              alt=""
              width={200}
              height={200}
              className="object-contain"
            />

            <div className="container-price-product flex flex-col items-start">
              <span className="text-[#bb3d4b] text-[19px] font-bold">
                {formatCurrency(Number(dataProduct?.price))}
              </span>
              <span className="block my-2 text-[12px] text-[#bb3d4b]">
                Costo de envío: {formatCurrency(Number(160.0))}
              </span>

              <span className="text-[#606060] text-[13px] font-bold">
                Disponibles: {dataProduct?.stock.toLocaleString()} piezas
              </span>
            </div>
          </div>

          <div className="w-full mt-5 flex justify-center">
            <button
              onClick={() => handleAddProductCart(dataProduct!)}
              className="bg-[#bb3d4b] text-white font-bold rounded p-2"
            >
              {loadingAddProductCar ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : (
                "Agregar al carrito"
              )}
            </button>
          </div>
        </div>

        <div className="container-opiniones w-[500px] flex">
          <div>
            <div className="w-full flex items-center">
              <Rating
                value={5}
                readOnly
                size="medium"
                precision={0.5}
                sx={{
                  color: "#BB3D4B",
                }}
              />
              <span className="text-[#606060] font-bold mx-2">
                {dataProduct?.reviews.length.toLocaleString()} Opiniones
              </span>
            </div>

            <div className="w-full justify-start">
              <span className="text-black text-[13px]">4.90 estrellas</span>
            </div>

            <div className="flex items-center mb-2">
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
                    width: 25,
                    height: "15px",
                    top: "0",
                    left: "0",
                    bottom: "0",
                    background: "#BB3D4B",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
              <div className="text-[15px] text-[#606060] font-bold mx-2">5</div>
              <div>
                <MdStar color="#ccc" size={20} />
              </div>

              <div>
                <span className="text-[#ccc] text-[13px] mx-1">
                  12
                  {/* (
                                              {product.reviews.reduce((acc, item) => {
                                                if (item.rating === progressRating.rating) {
                                                  return acc + 1;
                                                }
                                                return acc;
                                              }, 0)}
                                              ) */}
                </span>
              </div>
            </div>
          </div>

          <div className="container-experiencia border p-2 h-[150px] mx-3">
            <span className="text-[#bb3d4b] text-[15px] text-center block font-bold">
              ¿Deseas compartir tu experiencia?
            </span>

            <button className="p-2 block my-2 mx-auto bg-[#bb3d4b] text-white rounded font-bold">
              <span className="text-[13px]">Escribir mi opinión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="list-opiniones w-full">
        <div className="w-full flex justify-between">
          <span className="text-[#808080] block mt-4">
            {dataProduct?.reviews.length.toLocaleString()} opiniones
          </span>

          <div className="flex items-center">
            <label htmlFor="" className="shrink-0 mx-2">
              Ordenar por:
            </label>

            <select
              name=""
              id=""
              defaultValue={""}
              className="form-select ml-2"
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="1">Mejor valorado</option>
            </select>
          </div>
        </div>
        <hr />

        {dataProduct?.reviews &&
          dataProduct.reviews.map((review) => {
            return (
              <div className="w-full p-2 flex" key={Number(review.idReview)}>
                <div className="w-[150px]  flex flex-col items-center gap-2">
                  <span className="text-[#606060] font-bold text-[15px]">
                    {review.reviewerName}
                  </span>

                  <Rating
                    value={review.rating}
                    readOnly
                    size="medium"
                    precision={0.5}
                    sx={{
                      color: "#BB3D4B",
                    }}
                  />
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>

                <div className="w-full pl-2 mx-4">
                  <span className="text-[#606060] font-bold text-[16px]">
                    En proceso de instalcion
                  </span>
                  <p className="text-[13px] text-[#808080] mt-2">
                    {review.description}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Reviews;
