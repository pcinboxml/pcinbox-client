"use client";

import { Alert, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import useWriteReview from "./useWriteReview";
import { MdAutorenew } from "react-icons/md";
import styles from "./write-review.module.css";
import { IMAGE_SIZES, optimizeImageUrl } from "@/app/lib/optimizeImage";

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
    <section className={styles.section}>
      <span className={styles.pageTitle}>
        Escribe tu opinión acerca de este producto:
      </span>

      {/* Imagen + descripción del producto */}
      <div className={styles.productPreview}>
        <img
          src={optimizeImageUrl(image_url, { width: IMAGE_SIZES.cardLg })}
          alt=""
          width={200}
          height={200}
          className={styles.productImg}
          loading="lazy"
        />
        <p className={styles.productDescription}>{description}</p>
      </div>

      {/* Título de opinión + Rating */}
      <div className={styles.titleRatingGrid}>
        <div className="p-1">
          <label className="text-[#808080] text-[16px]">
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

        <div className={styles.ratingBlock}>
          <label className="text-[#606060] font-bold">
            Califica el producto de acuerdo al rango
          </label>
          <Rating
            size="large"
            sx={{ color: "#bb3d4b" }}
            value={dataAddReview.rating}
            onChange={(e, value) => {
              if (value) {
                setDataAddReview((prev) => ({ ...prev, rating: value }));
              }
            }}
          />
        </div>
      </div>

      {/* Textarea opinión */}
      <div className="w-full mt-5">
        <span className="text-[#808080]">Tu opinión sobre el producto</span>
        <textarea
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
        />
      </div>

      {/* Nombre publicado */}
      <div className="w-full mt-3">
        <span className="text-[#606060] font-bold text-[17px]">
          Tu opinión será publicada como{" "}
          <span className="text-[#bb3d4b]">{fullName}</span>
        </span>
      </div>

      {/* Botón enviar */}
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
