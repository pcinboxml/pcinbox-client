"use client";

import { Rating } from "@mui/material";
import { useEffect } from "react";
import { MdAutorenew, MdShoppingCart, MdStar } from "react-icons/md";
import useReview from "./useReview";
import useService from "../services/useService";
import usePaginationComponent from "../components/pagination/usePaginationComponent";
import PaginationComponent from "../components/pagination/PaginationComponent";
import BranchSelector from "../components/branchSelector/BranchSelector";
import { useTheContext } from "../services/globalContext";
import styles from "./reviews.module.css";
import BranchStockTooltip from "../components/branchStockTooltip/BranchStockTooltip";

const Reviews = () => {
  const {
    handleChangeOrdenar,
    handleGetProduct,
    handleAddProductCart,
    calcPorcentaje,
    dataProduct,
    loadingAddProductCar,
    ReviewsRating,
  } = useReview();

  const { setDataModal } = useTheContext();

  const { formatCurrency, onRouterLink } = useService();
  const { startIndex, endIndex, page, handleChangePage } =
    usePaginationComponent();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    handleGetProduct(Number(urlParams.get("idProduct")));
  }, []);

  return (
    <section className={styles.section}>
      {/* Título */}
      <span className={styles.pageTitle}>
        Opiniones de clientes sobre <br />
        <span style={{ fontStyle: "italic" }}>
          {dataProduct?.description || dataProduct?.name}
        </span>
      </span>

      {/* Layout superior: tarjeta producto + opiniones */}
      <div className={styles.topLayout}>
        {/* Tarjeta del producto */}
        <div className={styles.productCard}>
          <span className={styles.productCardName}>
            {dataProduct?.description || dataProduct?.name}
          </span>

          <div className={styles.productCardBody}>
            <img
              src={
                dataProduct?.imageUrl &&
                Array.isArray(dataProduct?.imageUrl) &&
                dataProduct?.imageUrl.length > 0
                  ? dataProduct?.imageUrl[0]
                  : dataProduct?.imageUrl
              }
              alt=""
              width={200}
              height={200}
              className={styles.productCardImg}
              loading="lazy"
            />

            <div className={styles.productCardPrice}>
              <span className={styles.priceText}>
                {formatCurrency(Number(dataProduct?.price))}
              </span>
              <BranchStockTooltip product={dataProduct!}>
                <span className={styles.stockText}>
                  Disponibles: {dataProduct?.stock.toLocaleString()} piezas
                </span>
              </BranchStockTooltip>
            </div>
          </div>

          <div className={styles.addToCartCenter}>
            <button
              disabled={loadingAddProductCar || dataProduct?.stock == 0}
              onClick={() => {
                if (
                  (dataProduct?.isPC == 0 || dataProduct?.isPc == 0) &&
                  dataProduct?.product_stock!.length > 0
                ) {
                  setDataModal({
                    isOpen: true,
                    message: (
                      <div className={styles.branchSelectorWrapper}>
                        <BranchSelector productSelected={dataProduct} />
                      </div>
                    ),
                    title: "",
                    type: "success",
                    showActions: false,
                    onClose: () => {
                      setDataModal((prev) => ({ ...prev, isOpen: false }));
                    },
                    onConfirm: () => {
                      setDataModal((prev) => ({ ...prev, isOpen: false }));
                    },
                  });
                } else {
                  handleAddProductCart(dataProduct!);
                }
              }}
              className={styles.addToCartBtn}
            >
              {loadingAddProductCar ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : dataProduct?.stock == 0 ? (
                "No disponible"
              ) : (
                <div className={styles.addToCartBtnInner}>
                  Agregar al carrito
                  <MdShoppingCart size={20} color="white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Panel de opiniones (rating bars + escribir opinión) */}
        <div className={styles.opinionesPanel}>
          {/* Rating bars */}
          <div>
            <div className={styles.ratingHeader}>
              <Rating
                value={5}
                readOnly
                size="medium"
                precision={0.5}
                sx={{ color: "#BB3D4B" }}
              />
              <span className={styles.ratingHeaderCount}>
                {dataProduct?.reviews.length.toLocaleString()} Opiniones
              </span>
            </div>

            <div>
              <span className={styles.ratingStarsLabel}>4.90 estrellas</span>
            </div>

            {ReviewsRating &&
              ReviewsRating.map((rr) => (
                <div className={styles.ratingBarRow} key={rr.id}>
                  <div className={styles.ratingBarBg}>
                    <div
                      style={{
                        width: `${calcPorcentaje(dataProduct!, rr.rating).percentage}%`,
                        height: "15px",
                        background: "#BB3D4B",
                        borderRadius: "5px",
                      }}
                    />
                  </div>
                  <span className={styles.ratingBarNumber}>{rr.rating}</span>
                  <MdStar color="#ccc" size={20} />
                  <span className={styles.ratingBarCount}>
                    {calcPorcentaje(dataProduct!, rr.rating).ratingCount}
                  </span>
                </div>
              ))}
          </div>

          {/* Caja escribir opinión */}
          <div className={styles.experienciaBox}>
            <span className={styles.experienciaTitle}>
              ¿Deseas compartir tu experiencia?
            </span>
            <button
              className={styles.writeReviewBtn}
              onClick={() =>
                onRouterLink(
                  `/write-review?idProduct=${dataProduct?.idProduct}&image_url=${
                    dataProduct?.imageUrl &&
                    Array.isArray(dataProduct?.imageUrl) &&
                    dataProduct?.imageUrl.length > 0
                      ? dataProduct?.imageUrl[0]
                      : dataProduct?.imageUrl
                  }&description=${dataProduct?.description || dataProduct?.name}`,
                )
              }
            >
              <span style={{ fontSize: 13 }}>Escribir mi opinión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de opiniones */}
      <div className={styles.listOpiniones}>
        <div className={styles.listOpinionesHeader}>
          <span className={styles.opinionesCount}>
            {dataProduct?.reviews.length.toLocaleString()} opiniones
          </span>
          <div className={styles.ordenarWrapper}>
            <label className={styles.ordenarLabel}>Ordenar por:</label>
            <select
              defaultValue={""}
              className="form-select ml-2"
              onChange={handleChangeOrdenar}
            >
              <option value="1">Mas reciente</option>
              <option value="2">Más antiguo</option>
              <option value="3">Mejor calificación</option>
              <option value="4">Peor calificación</option>
            </select>
          </div>
        </div>
        <hr />

        {dataProduct?.reviews &&
          dataProduct.reviews.slice(startIndex, endIndex).map((review) => (
            <div className={styles.reviewRow} key={Number(review.idReview)}>
              <div className={styles.reviewerInfo}>
                <span className={styles.reviewerName}>
                  {review.reviewerName}
                </span>
                <Rating
                  value={review.rating}
                  readOnly
                  size="medium"
                  precision={0.5}
                  sx={{ color: "#BB3D4B" }}
                />
                <span className={styles.reviewDate}>
                  {new Date(review.date).toLocaleString()}
                </span>
              </div>

              <div className={styles.reviewContent}>
                <span className={styles.reviewTitle}>{review.title}</span>
                <p className={styles.reviewDescription}>{review.description}</p>
              </div>
            </div>
          ))}
      </div>

      <div className={styles.paginationWrapper}>
        {dataProduct?.reviews && (
          <PaginationComponent
            onChange={handleChangePage}
            page={page}
            count={Math.ceil(dataProduct!.reviews.length / 4)}
          />
        )}
      </div>
    </section>
  );
};

export default Reviews;
