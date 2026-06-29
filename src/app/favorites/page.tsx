"use client";

import {
  MdArrowDropDown,
  MdAutorenew,
  MdShoppingCart,
  MdStar,
} from "react-icons/md";
import { LayoutGrid, Rows, Trash2 } from "lucide-react";
import { Alert, Box, Rating, styled, Tooltip } from "@mui/material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import useFavorites from "../services/useFavorites";
import useConfirmRemoveFavorite from "../hooks/useConfirmRemoveFavorite";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import ProductI from "../interfaces/products/product.interface";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";
import BranchSelector from "../components/branchSelector/BranchSelector";
import BranchStockTooltip from "../components/branchStockTooltip/BranchStockTooltip";
import ProductImageCarousel from "../components/productImageCarousel/ProductImageCarousel";
import styles from "../result-search-category/result-search-category.module.css";
import favStyles from "./favorites.module.css";

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
  { id: 1, rating: 5 },
  { id: 2, rating: 4 },
  { id: 3, rating: 3 },
  { id: 4, rating: 2 },
  { id: 5, rating: 1 },
];

const getProductImages = (favorite: FavoritesI) => {
  const fromProduct = (favorite.products as any)?.image_url;
  if (Array.isArray(fromProduct) && fromProduct.length > 0) return fromProduct;
  if (Array.isArray(favorite.image_url) && favorite.image_url.length > 0) {
    return favorite.image_url;
  }
  return [];
};

const parseCaracteristicas = (caracteristicas: unknown) => {
  if (!caracteristicas) return null;
  try {
    const parsed =
      typeof caracteristicas === "string"
        ? JSON.parse(caracteristicas)
        : caracteristicas;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
};

const calcPorcentaje = (
  reviews: ProductI["reviews"],
  progressRating: { rating: number },
) => {
  const list = reviews ?? [];
  const ratingCount = list.filter((r) => r.rating === progressRating.rating).length;
  const percentage = list.length > 0 ? (ratingCount / list.length) * 100 : 0;
  return { percentage, rating: progressRating.rating };
};

const Favorites = () => {
  const {
    handleAddFavoriteCart,
    handleSelectOrden,
    handleRemoveFavorite,
    loadingAddId,
    loadingRemoveId,
  } = useFavorites();
  const { confirmRemoveFavorite } = useConfirmRemoveFavorite();
  const { dataFavorites, setDataModal } = useTheContext();
  const { formatCurrency, onRouterLink } = useService();

  const [viewMode, setViewMode] = useState<"rectangular" | "square">("rectangular");
  const [searchText, setSearchText] = useState("");
  const [sortValue, setSortValue] = useState("date");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("favoritesViewMode");
    if (savedMode === "square" || savedMode === "rectangular") {
      setViewMode(savedMode);
    }
    setIsReady(true);
  }, []);

  const filteredFavorites = useMemo(() => {
    if (!dataFavorites?.length) return [];
    const query = searchText.trim().toLowerCase();
    if (!query) return dataFavorites;

    return dataFavorites.filter((favorite) => {
      const product = favorite.products;
      return (
        product?.name?.toLowerCase().includes(query) ||
        product?.sku?.toLowerCase().includes(query) ||
        product?.upc?.toLowerCase().includes(query)
      );
    });
  }, [dataFavorites, searchText]);

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortValue(event.target.value);
    handleSelectOrden(event);
  };

  const handleAddToCart = (favorite: FavoritesI) => {
    const product = favorite.products;
    if (!product) return;

    if (
      (product.isPC == 0 || product.isPc == 0) &&
      product.product_stock!.length > 0 &&
      Number(product.providerId) != 1
    ) {
      setDataModal({
        isOpen: true,
        message: (
          <div className={favStyles.branchSelectorWrapper}>
            <BranchSelector productSelected={product} />
          </div>
        ),
        title: "",
        type: "success",
        showActions: false,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    handleAddFavoriteCart(favorite);
  };

  const requestRemoveFavorite = (favorite: FavoritesI) => {
    confirmRemoveFavorite({
      favorite,
      onConfirmRemove: handleRemoveFavorite,
    });
  };

  const renderDeleteHeaderBtn = (favorite: FavoritesI) => (
    <button
      type="button"
      className={favStyles.deleteHeaderBtn}
      disabled={loadingRemoveId === String(favorite.productId)}
      onClick={() => requestRemoveFavorite(favorite)}
      aria-label="Eliminar de favoritos"
      title="Eliminar"
    >
      {loadingRemoveId === String(favorite.productId) ? (
        <MdAutorenew size={18} className="the-spinner" />
      ) : (
        <Trash2 size={16} strokeWidth={2} />
      )}
    </button>
  );

  const renderRatingBlock = (product: ProductI) => {
    const reviews = product.reviews ?? [];
    const promedioRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <Rating
          max={5}
          readOnly
          value={promedioRating}
          size="medium"
          sx={{ color: "#BB3D4B" }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <StyledTooltip
            title={
              <div style={{ width: "100%" }}>
                <Box>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Rating
                      value={promedioRating}
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
                      {reviews.length.toLocaleString()} Opiniones
                    </span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ color: "#808080", fontSize: 16 }}>
                      {promedioRating.toFixed(1)} estrellas
                    </span>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    {ratingProgress.map((progressRating) => (
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
                              width: `${calcPorcentaje(reviews, progressRating).percentage}%`,
                              height: 15,
                              background: "#BB3D4B",
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
                          {calcPorcentaje(reviews, progressRating).rating}
                        </span>
                        <MdStar color="#ccc" size={20} />
                        <span style={{ color: "#ccc", fontSize: 13, marginLeft: 4 }}>
                          (
                          {reviews.filter((r) => r.rating === progressRating.rating).length}
                          )
                        </span>
                      </div>
                    ))}
                    <a
                      role="button"
                      onClick={() =>
                        onRouterLink(`/review?idProduct=${product.idProduct}`)
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
                      Ver todas las ({reviews.length.toLocaleString()}) opiniones
                    </a>
                  </div>
                </Box>
              </div>
            }
          >
            <button
              type="button"
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
              <MdArrowDropDown size={10} color="gray" />
            </button>
          </StyledTooltip>
          <span style={{ marginLeft: 5, whiteSpace: "nowrap" }}>
            {reviews.length.toLocaleString()} opiniones
          </span>
        </div>
      </div>
    );
  };

  const renderCaracteristicas = (product: ProductI) => {
    const caracs = parseCaracteristicas(product.caracteristicas);
    if (!caracs) {
      return <span>Sin características disponibles</span>;
    }

    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {caracs.slice(0, 6).map((carac: any, index: number) => (
          <li key={index} style={{ fontSize: 13, marginTop: 4 }}>
            <span style={{ fontWeight: "bold" }}>{carac.prop}: </span>
            <span style={{ fontStyle: "italic", wordBreak: "break-word" }}>
              {carac.value && carac.value.length > 70
                ? `${carac.value.slice(0, 70)}...`
                : carac.value || "—"}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const renderStock = (product: ProductI, compact = false) => {
    const stock = product.stock ?? 0;
    return (
      <div className={compact ? styles.squareStockRow : styles.stockRow}>
        <span
          className={`${styles.stockDot} ${
            stock === undefined
              ? styles.stockDotOut
              : stock > 10
                ? styles.stockDotHigh
                : stock > 0
                  ? styles.stockDotLow
                  : styles.stockDotOut
          }`}
        />
        <BranchStockTooltip product={product}>
          <span className={compact ? styles.squareStockText : styles.stockText}>
            {stock === 0
              ? "Sin stock"
              : stock < 10
                ? compact
                  ? `¡Solo ${stock} pzas!`
                  : `¡Solo quedan ${stock} pzas!`
                : compact
                  ? `${stock} pzas.`
                  : `Disponibles: ${stock} pzas.`}
          </span>
        </BranchStockTooltip>
      </div>
    );
  };

  const renderSquareCard = (favorite: FavoritesI) => {
    const product = favorite.products;
    if (!product) return null;

    const reviews = product.reviews ?? [];
    const promedioRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;
    const images = getProductImages(favorite);

    return (
      <div key={favorite.idFavorite} className={styles.productSquareCard}>
        <div className={styles.squareMedia}>
          <div className={styles.squareCardHeader}>{renderDeleteHeaderBtn(favorite)}</div>
          <div className={styles.squareCarouselWrapper}>
            <ProductImageCarousel
              images={images}
              imageClassName={styles.squareProductImg}
              slideClassName={styles.squareCarouselSlide}
              imageSizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
              imageTransform="tr=w-400,q-70,f-auto"
              onNavigate={() => onRouterLink(`/detailsProduct/${product.idProduct}`)}
            />
          </div>
        </div>

        <div className={styles.squareCardBody}>
          <a
            role="button"
            onClick={() => onRouterLink(`/detailsProduct/${product.idProduct}`)}
            className={styles.squareProductName}
            title={product.name}
          >
            {product.name}
          </a>

          <div className={styles.squareSkuRating}>
            <span className={styles.squareSku}>SKU: {product.sku}</span>
            <div className={styles.squareRatingRow}>
              <Rating
                max={5}
                readOnly
                value={promedioRating}
                size="small"
                sx={{ color: "#BB3D4B" }}
              />
              <span className={styles.squareReviewCount}>({reviews.length})</span>
            </div>
          </div>

          <div className={styles.squarePriceStockRow}>
            <span className={styles.squarePrice}>
              {formatCurrency(Number(product.price))}
            </span>
            {renderStock(product, true)}
          </div>

          <div className={styles.squareActions}>
            <button
              type="button"
              disabled={
                loadingAddId == product.idProduct || product.stock == 0
              }
              className={styles.squareAddToCartBtn}
              onClick={() => handleAddToCart(favorite)}
            >
              {loadingAddId == product.idProduct ? (
                <MdAutorenew size={16} className="m-auto the-spinner" />
              ) : product.stock == 0 ? (
                "No disponible"
              ) : (
                <>
                  Agregar
                  <MdShoppingCart size={14} color="white" />
                </>
              )}
            </button>

            <button
              type="button"
              className={favStyles.squareRemoveBtn}
              disabled={loadingRemoveId === String(favorite.productId)}
              onClick={() => requestRemoveFavorite(favorite)}
            >
              {loadingRemoveId === String(favorite.productId) ? (
                <MdAutorenew size={16} className="m-auto the-spinner" />
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderListCard = (favorite: FavoritesI) => {
    const product = favorite.products;
    if (!product) return null;

    const images = getProductImages(favorite);

    return (
      <div key={favorite.idFavorite} className={styles.productCard}>
        <div className="flex justify-end" style={{ marginLeft: "auto" }}>
          {renderDeleteHeaderBtn(favorite)}
        </div>

        <div className={styles.productRow}>
          <div className={styles.productInfo}>
            <div className={styles.itemComponent}>
              <a
                role="button"
                onClick={() => onRouterLink(`/detailsProduct/${product.idProduct}`)}
                className={styles.productName}
              >
                {product.name}
              </a>

              <div className={styles.skuRatingGrid}>
                <div>
                  {product.upc && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ color: "#808080" }}>SKU: {product.sku}</span>
                      <span style={{ fontWeight: "bold" }}>
                        UPC:
                        <span style={{ fontWeight: "normal", marginLeft: 4 }}>
                          {product.upc}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
                {renderRatingBlock(product)}
              </div>

              <div className={styles.detailGrid}>
                <div>{renderCaracteristicas(product)}</div>

                <div style={{ padding: "0 12px" }}>
                  <span style={{ fontSize: 20, fontWeight: "bold" }}>
                    {formatCurrency(Number(product.price))}
                  </span>
                  {renderStock(product)}
                </div>

                <div className={styles.addToCartWrapper}>
                  <button
                    type="button"
                    disabled={
                      loadingAddId == product.idProduct || product.stock == 0
                    }
                    className={`${styles.addToCartBtn} bg-[#BB3D4B] text-white px-4 py-2 rounded flex items-center gap-2`}
                    onClick={() => handleAddToCart(favorite)}
                  >
                    {loadingAddId == product.idProduct ? (
                      <MdAutorenew size={20} className="m-auto the-spinner" />
                    ) : product.stock == 0 ? (
                      "No disponible"
                    ) : (
                      <>
                        Agregar al carrito
                        <MdShoppingCart size={20} color="white" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`${favStyles.removeBtn} ${favStyles.listRemoveBtn}`}
                    disabled={loadingRemoveId === String(favorite.productId)}
                    onClick={() => requestRemoveFavorite(favorite)}
                  >
                    {loadingRemoveId === String(favorite.productId) ? (
                      <MdAutorenew size={20} className="m-auto the-spinner" />
                    ) : (
                      "Eliminar"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.carouselWrapper}>
            <ProductImageCarousel
              images={images}
              imageClassName={styles.listProductImg}
              slideClassName={styles.carouselSlide}
              imageSizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 200px"
              imageTransform="tr=w-600,q-70,f-auto"
              onNavigate={() => onRouterLink(`/detailsProduct/${product.idProduct}`)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.mainContent}>
        <h3 className={styles.categoryTitle}>Mis Favoritos</h3>

        {!isReady ? (
          <div className={favStyles.hydrationPlaceholder} aria-hidden="true" />
        ) : dataFavorites && dataFavorites.length > 0 ? (
          <>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Buscar..."
                className={styles.searchInput}
                value={searchText}
                onChange={(event) => setSearchText(event.currentTarget.value)}
              />

              <div className={styles.searchActions}>
                <div className={styles.viewModeToggle}>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${viewMode === "square" ? styles.toggleBtnActive : ""}`}
                    onClick={() => {
                      setViewMode("square");
                      localStorage.setItem("favoritesViewMode", "square");
                    }}
                    aria-label="Vista cuadrícula"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleBtn} ${viewMode === "rectangular" ? styles.toggleBtnActive : ""}`}
                    onClick={() => {
                      setViewMode("rectangular");
                      localStorage.setItem("favoritesViewMode", "rectangular");
                    }}
                    aria-label="Vista lista"
                  >
                    <Rows size={18} />
                  </button>
                </div>

                <div className={styles.sortWrapper}>
                  <span className={styles.sortLabel}>Ordenar por:</span>
                  <select
                    className={`form-select ${styles.sortSelect}`}
                    value={sortValue}
                    onChange={handleSortChange}
                  >
                    <option value="date">Fecha</option>
                    <option value="z_a">Nombre Z-A</option>
                    <option value="a_z">Nombre A-Z</option>
                    <option value="mayor_precio">Mayor precio</option>
                    <option value="menor_precio">Menor precio</option>
                  </select>
                </div>
              </div>
            </div>

            <hr />

            {filteredFavorites.length > 0 ? (
              viewMode === "square" ? (
                <div className={styles.productsGrid}>
                  {filteredFavorites.map(renderSquareCard)}
                </div>
              ) : (
                <div className={styles.productsList}>
                  {filteredFavorites.map(renderListCard)}
                </div>
              )
            ) : (
              <Alert severity="info">No se encontraron favoritos con ese criterio</Alert>
            )}
          </>
        ) : (
          <Alert severity="info">No hay datos para mostrar</Alert>
        )}
      </div>
    </section>
  );
};

export default Favorites;
