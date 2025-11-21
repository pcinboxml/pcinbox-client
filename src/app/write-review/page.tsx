"use client";

import { Alert, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import useWriteReview from "./useWriteReview";
import { MdAutorenew } from "react-icons/md";

const WriteReview = () => {
  const { setDataAddReview, handleAddReview, loadingAddReview, dataAddReview } =
    useWriteReview();
  const [fullName, setFullName] = useState<string>("");
  const [idProduct, setIdProduct] = useState("");
  const [image_url, setImageUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const name = localStorage.getItem("name") ?? "";
    const lastname = localStorage.getItem("lastname") ?? "";

    if (name || lastname) {
      setFullName(`${name} ${lastname}`.trim());
    }

    const urlParams = new URLSearchParams(window.location.search);

    const idProduct = urlParams.get("idProduct");
    const imageUrl = urlParams.get("image_url");
    const descrip = urlParams.get("description");

    if (idProduct) {
      setIdProduct(idProduct);
      setDataAddReview((prev) => ({ ...prev, idProduct: idProduct }));
    }
    if (imageUrl) {
      setImageUrl(imageUrl);
    }

    if (descrip) {
      setDescription(descrip);
    }
  }, []);

  return idProduct ? (
    <section>
      <span className="text-[#bb3d4b] text-[17px] font-bold block text-start">
        Escribe tu opinión acerca de este producto:
      </span>

      <div className="flex items-center mt-2">
        <img src={image_url} alt="" width={200} height={200} loading="lazy" />

        <p className="text-[18px] text-[#606060] font-bold mx-3">
          {description}
        </p>
      </div>

      <div className="w-full grid grid-cols-[1fr_auto]">
        <div className="p-1">
          <label htmlFor="" className="text-[#808080] text-[16px]">
            Título de tu opinión del producto:
          </label>
          <input
            type="text"
            className="form-control"
            value={dataAddReview.title}
            onChange={(event) =>
              setDataAddReview((prev) => ({
                ...prev,
                title: event.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col p-1">
          <label htmlFor="" className="text-[#606060] font-bold">
            Califica el producto de acuerdo al rango
          </label>
          <Rating
            size="large"
            sx={{
              color: "#bb3d4b",
            }}
            value={dataAddReview.rating}
            onChange={(e, value) => {
              if (value) {
                setDataAddReview((prev) => ({ ...prev, rating: value }));
              }
            }}
          />
        </div>
      </div>

      <div className="w-full mt-5">
        <span className="text-[#808080]">Tu opinión sobre el producto</span>
        <textarea
          name=""
          id=""
          className="form-control"
          value={dataAddReview.message}
          placeholder="Excelente producto"
          style={{ resize: "none", height: "180px" }}
          onChange={(event) =>
            setDataAddReview((prev) => ({
              ...prev,
              message: event.target.value,
            }))
          }
        ></textarea>
      </div>

      <div className="w-full mt-3">
        <span className="text-[#606060] font-bold text-[17px]">
          Tu opinión será publicada como{" "}
          <span className="text-[#bb3d4b]">{fullName}</span>
        </span>
      </div>

      <div className="w-full mt-3">
        <button
          disabled={loadingAddReview}
          onClick={handleAddReview}
          className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
        >
          {loadingAddReview ? (
            <MdAutorenew size={20} className="m-auto the-spinner" />
          ) : (
            "Enviar mi opinión"
          )}
        </button>
      </div>
    </section>
  ) : (
    <section>
      <Alert severity="info">Contenido no disponible, intentelo de nuevo</Alert>
    </section>
  );
};

export default WriteReview;
