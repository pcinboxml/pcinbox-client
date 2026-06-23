"use client";
import "./detailsProduct.css";
import useDetailsProduct from "./useDetailsProducts";
import { useEffect, useRef, useState } from "react";
import useService from "../../services/useService";

import {
  MdAutorenew,
  MdFavorite,
  MdShoppingCart,
  MdClose,
  MdLocalShipping,
  MdVerified,
  MdStar,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import useFavorites from "../../services/useFavorites";
import { Alert, Box, Modal } from "@mui/material";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";
import { useTheContext } from "@/app/services/globalContext";
import BranchSelector from "@/app/components/branchSelector/BranchSelector";
import useProveedores from "@/app/services/proveedores/useProveedores";
import ProductI from "@/app/interfaces/products/product.interface";
import { Share2 } from "lucide-react";
import BranchStockTooltip from "@/app/components/branchStockTooltip/BranchStockTooltip";

const DetailsProduct = () => {
  const [dataProduct, setDataProduct] = useState<ProductI | null>();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // ── Magnifier lens ──
  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 }); // porcentaje 0-100
  const imgStageRef = useRef<HTMLDivElement>(null);
  const ZOOM_FACTOR = 2.5;
  const ZOOM_PANEL_SIZE = 380; // px del panel de zoom flotante

  const {
    quantity,
    loadingAddProduct,
    openModal,
    changeImg,
    setChangeImg,
    setOpenModal,
    handleAdd,
    handleSubstract,
    handleAddProductCart,
    handleOnChange,
    handleKeyBoard,
    // fnGetServerSession,
  } = useDetailsProduct();

  const { formatCurrency, onRouterLink, handleShare } = useService();
  const { requestGetProveedor } = useProveedores();
  const { setDataModal, hasToken, setBuyNowProduct } = useTheContext();
  const router = useParams();
  const { idProduct } = router;
  const { handleAddFavorites, loadingFavorite } = useFavorites();

  const dateCurrent = new Date();
  const dateSend = new Date(dateCurrent);
  dateSend.setDate(dateCurrent.getDate() + 8);
  const fechaActualFormateada = dateCurrent.toLocaleDateString();
  const fechaFuturaFormateada = dateSend.toLocaleDateString();

  useEffect(() => {
    if (idProduct) {
      const fnGetDataProduct = async () => {
        try {
          const resp = await requestGetProveedor(`/getProduct/${idProduct}`);
          resp.status == 200
            ? setDataProduct(resp.data.data.data)
            : setDataProduct(null);
        } catch (error: any) {
          setDataProduct(null);
        }
      };
      fnGetDataProduct();
    }
  }, [idProduct]);

  useEffect(() => {
    if (dataProduct?.imageUrl) {
      setChangeImg(dataProduct.imageUrl[0]);
      setActiveImgIndex(0);
    }
  }, [dataProduct?.imageUrl]);

  const handlePrevImg = () => {
    if (!dataProduct?.imageUrl) return;
    const newIdx =
      activeImgIndex === 0
        ? dataProduct.imageUrl.length - 1
        : activeImgIndex - 1;
    setActiveImgIndex(newIdx);
    setChangeImg(dataProduct.imageUrl[newIdx]);
  };

  const handleNextImg = () => {
    if (!dataProduct?.imageUrl) return;
    const newIdx =
      activeImgIndex === dataProduct.imageUrl.length - 1
        ? 0
        : activeImgIndex + 1;
    setActiveImgIndex(newIdx);
    setChangeImg(dataProduct.imageUrl[newIdx]);
  };

  const handleAddToCartWithAnimation = () => {
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);

    if (
      (dataProduct?.isPC == 0 || dataProduct?.isPc == 0) &&
      dataProduct?.product_stock!.length > 0 &&
      Number(dataProduct?.providerId) !== 1
    ) {
      setDataModal({
        isOpen: true,
        message: (
          <div className="border">
            <BranchSelector productSelected={dataProduct} />
          </div>
        ),
        title: "",
        type: "success",
        showActions: false,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    } else {
      handleAddProductCart(dataProduct!, Number(quantity));
    }
  };

  const handleComprarAhora = () => {
    if (!hasToken) {
      setDataModal({
        title: "Información",
        isOpen: true,
        message: "Necesitas iniciar sesión",
        type: "info",
        showActions: true,
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
      return;
    }
    if (
      (dataProduct?.isPC == 0 || dataProduct?.isPc == 0) &&
      dataProduct?.product_stock!.length > 0 &&
      Number(dataProduct?.providerId) !== 1
    ) {
      setDataModal({
        isOpen: true,
        message: (
          <div className="border">
            <BranchSelector productSelected={dataProduct} comprarAhora={true} />
          </div>
        ),
        title: "",
        type: "success",
        showActions: false,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    } else {
      localStorage.setItem("checkout_mode", "buy_now");

      setBuyNowProduct({
        ...dataProduct,
        categoryId: dataProduct!.categoryId,
        createdAt: dataProduct!.createdAt,
        description: dataProduct!.description,
        idProduct: dataProduct!.idProduct,
        imageUrl: dataProduct!.imageUrl,
        name: dataProduct!.name,
        price: dataProduct!.price,
        providerId: dataProduct!.providerId,
        stock: dataProduct!.stock,
        rating: dataProduct!.rating,
        reviews: dataProduct!.reviews,
        quantity: Number(quantity),
        sku: dataProduct!.sku,
        isPC: dataProduct?.isPC,
        isPc: dataProduct?.isPc,
        caracteristicas: dataProduct?.caracteristicas,
        height: dataProduct?.height,
        idProductExt: dataProduct?.idProductExt,
        largo: dataProduct?.largo,
        storeId: dataProduct?.storeId,
        upc: dataProduct?.upc,
        width: dataProduct?.width,
        product_stock: dataProduct?.product_stock,
      });
      localStorage.setItem(
        "buyNowProduct",
        JSON.stringify({
          ...dataProduct,
          categoryId: dataProduct!.categoryId,
          createdAt: dataProduct!.createdAt,
          description: dataProduct!.description,
          idProduct: dataProduct!.idProduct,
          imageUrl: dataProduct!.imageUrl,
          name: dataProduct!.name,
          price: dataProduct!.price,
          providerId: dataProduct!.providerId,
          stock: dataProduct!.stock,
          rating: dataProduct!.rating,
          reviews: dataProduct!.reviews,
          quantity: Number(quantity),
          sku: dataProduct!.sku,
          isPC: dataProduct?.isPC,
          isPc: dataProduct?.isPc,
          caracteristicas: dataProduct?.caracteristicas,
          height: dataProduct?.height,
          idProductExt: dataProduct?.idProductExt,
          largo: dataProduct?.largo,
          storeId: dataProduct?.storeId,
          upc: dataProduct?.upc,
          width: dataProduct?.width,
          product_stock: dataProduct?.product_stock,
        }),
      );
      onRouterLink("/confirma-productos");

      return;

      // handleAddProductCart(dataProduct!, Number(quantity));
    }
  };

  // ── Magnifier mouse handler ──
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgStageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const stockStatus =
    dataProduct?.stock === undefined
      ? null
      : dataProduct.stock > 10
        ? "high"
        : dataProduct.stock > 0
          ? "low"
          : "out";

  // useEffect(() => {
  //   fnGetServerSession(idProduct);
  // }, [idProduct]);

  return (
    <div className="dp-root">
      {dataProduct === null ? (
        <div className="dp-empty">
          <Alert severity="info">Sin contenido disponible</Alert>
        </div>
      ) : (
        <div className="dp-wrapper">
          {/* ── BREADCRUMB / TITLE BAND ── */}
          <div className="dp-top-band">
            {/* <span className="dp-category-badge">
              <MdVerified size={13} /> Producto Verificado
            </span> */}
            <h1 className="dp-title">{dataProduct?.name}</h1>
            {/* <div className="dp-meta-row">
              <span className="dp-sku">{dataProduct?.sku}</span>
              <div className="dp-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <MdStar
                    key={s}
                    size={14}
                    color={s <= 4 ? "#f5a623" : "#ccc"}
                  />
                ))}
                <span className="dp-rating-count">(4.0)</span>
              </div>
            </div> */}
          </div>

          {/* ── MAIN GRID ── */}
          <div className="dp-main-grid relative">
            {/* LEFT: IMAGE GALLERY */}
            <div className="dp-gallery">
              {/* Stage con lupa */}

              <div className="dp-img-wrapper">
                <div
                  ref={imgStageRef}
                  className="dp-img-stage"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setLensVisible(true)}
                  onMouseLeave={() => setLensVisible(false)}
                  onClick={() => setOpenModal(true)}
                >
                  <img
                    src={dataProduct?.imageUrl?.[activeImgIndex] ?? null}
                    alt={dataProduct?.name}
                    className="dp-main-img"
                  />

                  {/* Lente cuadrada que sigue el cursor */}
                  {lensVisible && (
                    <div
                      className="dp-lens"
                      style={{
                        left: `calc(${lensPos.x}% - 50px)`,
                        top: `calc(${lensPos.y}% - 50px)`,
                      }}
                    />
                  )}

                  <button
                    className="dp-nav-btn dp-nav-prev"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImg();
                    }}
                  >
                    <MdChevronLeft size={22} />
                  </button>
                  <button
                    className="dp-nav-btn dp-nav-next"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImg();
                    }}
                  >
                    <MdChevronRight size={22} />
                  </button>

                  {!lensVisible && (
                    <span className="dp-zoom-hint">
                      🔍 Pasa el cursor para ampliar
                    </span>
                  )}
                </div>

                {/* Panel de zoom flotante a la derecha */}
                {lensVisible && (
                  <div
                    className="dp-zoom-panel"
                    style={{
                      width: `${ZOOM_PANEL_SIZE}px`,
                      height: `${ZOOM_PANEL_SIZE}px`,
                      backgroundImage: `url(${dataProduct?.imageUrl?.[activeImgIndex] ?? ""})`,
                      backgroundSize: `${ZOOM_FACTOR * 100}%`,
                      backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                    }}
                  />
                )}
              </div>

              {/* Thumbnails */}
              {dataProduct?.imageUrl && dataProduct.imageUrl.length > 1 && (
                <div className="dp-thumbs">
                  {dataProduct.imageUrl.map((img: string, i: number) => (
                    <div
                      key={i}
                      className={`dp-thumb ${i === activeImgIndex ? "dp-thumb--active" : ""}`}
                      onClick={() => {
                        setActiveImgIndex(i);
                        setChangeImg(img);
                      }}
                    >
                      <img src={img} alt={`Vista ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}

              <p className="dp-img-disclaimer">
                * Las imágenes son ilustrativas y pueden variar según
                inventario.
              </p>
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="dp-info-panel">
              {/* Price block */}
              <div className="flex justify-end items-center">
                <button
                  title="Compartir"
                  onClick={async () => {
                    await handleShare(
                      "Producto",
                      dataProduct?.name! || dataProduct?.description!,
                      `${process.env.NEXT_PUBLIC_NODE_ENV === "local" ? `http://localhost:3000/detailsProduct/${dataProduct?.idProduct}` : `https://www.pcinbox.com.mx/detailsProduct/${dataProduct?.idProduct}`}`,
                    );
                  }}
                  aria-label="Compartir"
                  className="
          group relative flex h-10 w-10 items-center justify-center
          rounded-lg border border-neutral-200 bg-transparent text-neutral-400
          transition-all duration-150
          hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500
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
              <div className="dp-price-block">
                <span className="dp-price">
                  {formatCurrency(Number(dataProduct?.price))}
                </span>
              </div>

              <div className="dp-trust-row">
                <p>
                  <b>UPC</b>: {dataProduct?.upc}
                </p>
              </div>

              {/* Description */}
              {dataProduct?.description && (
                <p className="dp-description">
                  {dataProduct.description.length > 160
                    ? `${dataProduct.description.slice(0, 160)}…`
                    : dataProduct.description}
                </p>
              )}

              {/* Trust chips */}
              <div className="dp-trust-row">
                <span className="dp-chip">
                  <MdLocalShipping size={14} /> Envío rápido
                </span>
                <span className="dp-chip">
                  <MdVerified size={14} /> Producto original
                </span>
              </div>

              {/* Delivery */}
              <div className="dp-delivery-card">
                <MdLocalShipping size={18} className="dp-delivery-icon" />
                <div>
                  <span className="dp-delivery-label">Entrega estimada</span>
                  <span className="dp-delivery-range">
                    {fechaActualFormateada} — {fechaFuturaFormateada}
                  </span>
                </div>
              </div>

              {/* Stock indicator */}
              <div className="dp-stock-row">
                <span className={`dp-stock-dot dp-stock-dot--${stockStatus}`} />
                <BranchStockTooltip product={dataProduct!}>
                  <span className="dp-stock-text">
                    {stockStatus === "out"
                      ? "Sin stock"
                      : stockStatus === "low"
                        ? `¡Solo quedan ${dataProduct?.stock} pzas!`
                        : `En stock: ${dataProduct?.stock} pzas.`}
                  </span>
                </BranchStockTooltip>
              </div>

              {/* Quantity selector */}
              <div className="dp-qty-section">
                <label className="dp-qty-label">Cantidad</label>
                <div className="dp-qty-control">
                  <button className="dp-qty-btn" onClick={handleSubstract}>
                    −
                  </button>
                  <input
                    type="number"
                    className="dp-qty-input"
                    value={quantity}
                    onChange={handleOnChange}
                    onKeyUp={(event) => handleKeyBoard(event, dataProduct!)}
                  />
                  <button
                    className="dp-qty-btn"
                    onClick={() => handleAdd(dataProduct!.stock)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="dp-cta-group">
                <button
                  className={`dp-btn-cart`}
                  disabled={loadingAddProduct || (dataProduct?.stock ?? 0) <= 0}
                  onClick={handleAddToCartWithAnimation}
                >
                  {loadingAddProduct ? (
                    <MdAutorenew size={20} className="dp-spinner" />
                  ) : (dataProduct?.stock ?? 0) > 0 ? (
                    <span className="dp-btn-inner">
                      <MdShoppingCart size={18} /> Añadir al carrito
                    </span>
                  ) : (
                    "No disponible"
                  )}
                </button>

                <button
                  className="dp-btn-cart"
                  disabled={dataProduct?.stock === 0}
                  onClick={handleComprarAhora}
                >
                  {dataProduct?.stock !== 0 ? (
                    <span className="dp-btn-inner">Comprar Ahora</span>
                  ) : (
                    "No disponible"
                  )}
                </button>

                <button
                  className="dp-btn-fav"
                  disabled={loadingFavorite}
                  onClick={() => handleAddFavorites(dataProduct!)}
                >
                  {loadingFavorite ? (
                    <MdAutorenew size={18} className="dp-spinner" />
                  ) : (
                    <span className="dp-btn-inner">
                      <MdFavorite size={18} /> Guardar en favoritos
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── SPECS + VIDEO ROW ── */}
          <div className="dp-bottom-row">
            <div className="dp-specs-card">
              <h4 className="dp-specs-title">Especificaciones técnicas</h4>
              {(() => {
                try {
                  if (!dataProduct?.caracteristicas)
                    return (
                      <p className="dp-specs-empty">
                        Sin especificaciones disponibles.
                      </p>
                    );
                  const caracteristicas =
                    typeof dataProduct.caracteristicas === "string"
                      ? JSON.parse(dataProduct.caracteristicas)
                      : dataProduct.caracteristicas;
                  if (
                    !Array.isArray(caracteristicas) ||
                    caracteristicas.length === 0
                  )
                    return (
                      <p className="dp-specs-empty">
                        Sin especificaciones disponibles.
                      </p>
                    );

                  return (
                    <div className="dp-specs-table">
                      {caracteristicas.map((item: any, i: number) => (
                        <div
                          key={i}
                          className={`dp-spec-row ${i % 2 === 0 ? "dp-spec-row--even" : ""}`}
                        >
                          <span className="dp-spec-key">{item.prop}</span>
                          <span className="dp-spec-val">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                } catch {
                  return null;
                }
              })()}
            </div>

            {idProduct?.toString() === "14" && (
              <div className="dp-video-card">
                <h4 className="dp-specs-title">Video del producto</h4>
                <div className="dp-video-wrapper">
                  <ReactPlayer
                    src="https://www.tiktok.com/@edson.hdez0/video/7567524415173381396"
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LIGHTBOX MODAL ── */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ zIndex: 9999 }}
      >
        <Box className="dp-modal-box">
          <button
            className="dp-modal-close"
            onClick={() => setOpenModal(false)}
          >
            <MdClose size={22} />
          </button>
          <div className="dp-modal-grid">
            <div className="dp-modal-main-img">
              <img src={changeImg} alt="Ampliada" />
            </div>
            <div className="dp-modal-thumbs">
              {dataProduct?.imageUrl?.map((img: string, i: number) => (
                <div
                  key={i}
                  className={`dp-modal-thumb ${img === changeImg ? "dp-modal-thumb--active" : ""}`}
                  onClick={() => setChangeImg(img)}
                >
                  <img src={img} loading="lazy" alt={`Imagen ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default DetailsProduct;
