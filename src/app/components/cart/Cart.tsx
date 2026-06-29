"use client";

import "./cart.css";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import ProductI from "@/app/interfaces/products/product.interface";
import { useEffect, useLayoutEffect, useMemo, useState, RefObject } from "react";
import { createPortal } from "react-dom";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useCart from "./useCart";
import type { CartOpenMode } from "./useCart";
import useCartSync from "@/app/hooks/useCartSync";
import { MdAutorenew } from "react-icons/md";
import useStorage from "@/app/services/useStorage";
import {
  clearCheckoutProgressStorage,
  syncCheckoutFromProducts,
  setCheckoutStep,
} from "@/app/utils/checkoutStorage";
import { CheckoutStep } from "@/app/components/timeline/checkoutSteps";
import Image from "next/image";

export const Cart = () => {
  return <img src="/carrito.png" loading="lazy" className="cart-icon-img" alt="" />;
};

export const ModalCart = ({
  onMouseLeaveCart,
  closeCartNow,
  showDivCart,
  cartOpenMode,
  anchorRef,
  cancelCloseCart,
}: {
  onMouseLeaveCart: () => void;
  closeCartNow: () => void;
  showDivCart: boolean;
  cartOpenMode: CartOpenMode;
  anchorRef?: RefObject<HTMLElement | null>;
  cancelCloseCart?: () => void;
}) => {
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});
  const [bridgeStyle, setBridgeStyle] = useState<React.CSSProperties>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isAnchoredDesktop, setIsAnchoredDesktop] = useState(false);
  const [runCheckoutSync, setRunCheckoutSync] = useState(false);
  const { dataCart, setDataCart, buyNowProduct, hasToken } = useTheContext();
  const {
    dataCartStorege,
    handleRemoveStorageDataCart,
    handleWriteStorageDataCart,
  } = useStorage();
  const { formatCurrency, onRouterLink, totalPrice, productsToShow } =
    useService();
  const {
    handleRemoveItemCart,
    handleConfirmEmptyCart,
    loadingRmAllCart,
  } = useCart();
  const { syncCartLineQuantity } = useCartSync();
  const [updatingQtyKey, setUpdatingQtyKey] = useState<string | null>(null);

  const itemCount = useMemo(
    () =>
      dataCart?.reduce((sum, item) => sum + Number(item.quantity || 1), 0) ?? 0,
    [dataCart],
  );

  useLayoutEffect(() => {
    if (!showDivCart || typeof window === "undefined") return;

    const updateLayout = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);

      if (mobile || !anchorRef?.current) {
        setIsAnchoredDesktop(false);
        setPanelStyle({});
        setBridgeStyle({});
        return;
      }

      const rect = anchorRef.current.getBoundingClientRect();
      const viewportPad = 12;
      const gap = 8;
      const panelWidth = Math.min(600, window.innerWidth - viewportPad * 2);

      let left = rect.right - panelWidth;
      left = Math.max(
        viewportPad,
        Math.min(left, window.innerWidth - panelWidth - viewportPad),
      );

      const top = rect.bottom + gap;
      const availableHeight = window.innerHeight - top - viewportPad;
      const maxHeight = Math.min(680, availableHeight);
      const minHeight = Math.min(540, maxHeight);

      const bridgeLeft = Math.min(rect.left, left);
      const bridgeRight = Math.max(rect.right, left + panelWidth);

      setIsAnchoredDesktop(true);
      setPanelStyle({
        top,
        left,
        width: panelWidth,
        minHeight,
        maxHeight,
      });
      setBridgeStyle({
        top: Math.max(0, rect.bottom - 2),
        left: bridgeLeft,
        width: bridgeRight - bridgeLeft,
        height: gap + 4,
      });
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, true);

    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
    };
  }, [showDivCart, anchorRef]);

  useEffect(() => {
    if (!showDivCart || typeof document === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCartNow();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showDivCart, onMouseLeaveCart, closeCartNow]);

  const keepCartOpen = () => {
    cancelCloseCart?.();
  };

  const scheduleCartClose = () => {
    onMouseLeaveCart();
  };

  useEffect(() => {
    if (!runCheckoutSync) return;
    syncCheckoutFromProducts(buyNowProduct, dataCart ?? [], productsToShow);
    setRunCheckoutSync(false);
  }, [runCheckoutSync, buyNowProduct, dataCart, productsToShow]);

  const getItemQuantity = (product: ProductI) => {
    const itemStorage = dataCartStorege?.find(
      (item) =>
        String(item.idProduct) === String(product.idProduct) &&
        String(item.storeId ?? "") === String(product.storeId ?? ""),
    );
    if (itemStorage) return Number(itemStorage.quantity);

    const itemCart = dataCart?.find(
      (item) =>
        String(item.idProduct) === String(product.idProduct) &&
        String(item.storeId ?? "") === String(product.storeId ?? ""),
    );
    return Number(itemCart?.quantity ?? 1);
  };

  const updateQuantity = async (product: ProductI, delta: number) => {
    const lineKey = `${product.idProduct}-${product.storeId ?? ""}`;
    if (updatingQtyKey === lineKey) return;

    const currentItem = dataCart.find(
      (entry) =>
        String(entry.idProduct) === String(product.idProduct) &&
        String(entry.storeId ?? "") === String(product.storeId ?? ""),
    );
    if (!currentItem) return;

    const stockByStore =
      product?.product_stock?.find(
        (branch) => branch?.branchId === product?.storeId,
      )?.stock ?? Number(product?.stock ?? 0);

    const maxStock =
      Number(currentItem.providerId) !== 1
        ? stockByStore
        : Number(currentItem.stock);
    const nextQty = Math.max(
      1,
      Math.min(maxStock, Number(currentItem.quantity) + delta),
    );

    if (nextQty === Number(currentItem.quantity)) return;

    if (hasToken) {
      setUpdatingQtyKey(lineKey);
      try {
        await syncCartLineQuantity(product, nextQty);
      } finally {
        setUpdatingQtyKey(null);
      }
      return;
    }

    const updateItems = dataCart.map((item) => {
      const matches =
        String(item.idProduct) === String(product.idProduct) &&
        String(item.storeId ?? "") === String(product.storeId ?? "");
      if (!matches) return item;
      return { ...item, quantity: nextQty };
    });

    setDataCart(updateItems);
    handleWriteStorageDataCart(updateItems);
  };

  if (!showDivCart) return null;

  const backdropClickable = isMobile || cartOpenMode === "click";

  const modal = (
    <>
      <div
        className={`cart-modal-backdrop ${backdropClickable ? "cart-modal-backdrop--clickable" : ""}`}
        role="presentation"
        onClick={backdropClickable ? closeCartNow : undefined}
      />
      {isAnchoredDesktop && (
        <div
          className="cart-modal-bridge"
          style={bridgeStyle}
          aria-hidden
          onMouseEnter={keepCartOpen}
          onMouseLeave={scheduleCartClose}
        />
      )}
      <div
        className={`cart-modal-panel ${isMobile ? "cart-modal-panel--mobile" : ""} ${isAnchoredDesktop ? "cart-modal-panel--anchored" : ""}`}
        style={isAnchoredDesktop ? panelStyle : undefined}
        role="dialog"
        aria-modal="true"
        aria-label="Mi carrito"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={keepCartOpen}
        onMouseLeave={scheduleCartClose}
      >
        <header className="cart-modal-header">
          <div>
            <h5 className="cart-modal-title">Mi carrito</h5>
            {itemCount > 0 ? (
              <p className="cart-modal-subtitle">
                {itemCount} producto{itemCount !== 1 ? "s" : ""}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="cart-modal-close"
            onClick={closeCartNow}
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </header>

        {dataCart && dataCart.length > 0 ? (
          <div className="cart-empty-btn-wrap">
            <button
              type="button"
              className="cart-empty-btn"
              disabled={loadingRmAllCart}
              onClick={() => {
                handleConfirmEmptyCart(dataCart, () => {
                  handleRemoveStorageDataCart();
                  clearCheckoutProgressStorage();
                  setCheckoutStep(null);
                  setRunCheckoutSync(true);
                  closeCartNow();
                });
              }}
            >
              {loadingRmAllCart ? (
                <MdAutorenew size={18} className="the-spinner" />
              ) : (
                <>
                  Vaciar todo
                  <Trash2 size={16} />
                </>
              )}
            </button>
          </div>
        ) : null}

        <div className="cart-modal-body contentCart">
          {!dataCart?.length ? (
            <div className="cart-empty-state">
              <ShoppingCart
                size={64}
                color="#d1d5db"
                style={{ margin: "0 auto", display: "block" }}
              />
              <p className="cart-empty-title">Tu carrito está vacío</p>
              <button
                type="button"
                className="cart-empty-link"
                onClick={() => {
                  onRouterLink("/");
                  closeCartNow();
                }}
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {dataCart.map((product: ProductI) => {
                if (product.stock == 0) return null;

                const qty = getItemQuantity(product);
                const stockByStore =
                  product?.product_stock?.find(
                    (branch) => branch?.branchId == product?.storeId,
                  )?.stock ?? product?.stock ?? 0;
                const imageSrc =
                  (product as any).image_url?.[0] ||
                  (product as any).imageUrl?.[0];

                return (
                  <article
                    key={`${product.idProduct}-${product.storeId}`}
                    className="cart-item-card"
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        loading="lazy"
                        alt={product.name || "Producto"}
                        width={88}
                        height={88}
                        className="cart-item-image"
                        onClick={() => {
                          onRouterLink(`/detailsProduct/${product.idProduct}`);
                          closeCartNow();
                        }}
                      />
                    ) : (
                      <div
                        className="cart-item-image"
                        style={{ background: "#e5e7eb" }}
                      />
                    )}

                    <div className="cart-item-body">
                      <h3 className="cart-item-name">{product.name}</h3>
                      <p className="cart-item-meta">
                        Disponibles: {stockByStore} piezas · SKU: {product.sku}
                      </p>
                      <p className="cart-item-unit-price">
                        {formatCurrency(Number(product.price))} c/u
                      </p>

                      <div className="cart-item-footer">
                        <div className="cart-qty-control">
                          <button
                            type="button"
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(product, -1)}
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="cart-qty-value">{qty}</span>
                          <button
                            type="button"
                            className="cart-qty-btn"
                            disabled={
                              Number(product?.providerId) !== 1
                                ? qty >= Number(stockByStore)
                                : qty >= Number(product?.stock)
                            }
                            onClick={() => updateQuantity(product, 1)}
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="cart-item-price-row">
                          <p className="cart-item-total">
                            {formatCurrency(Number(product.price) * qty)}
                          </p>
                          <button
                            type="button"
                            className="cart-remove-btn"
                            onClick={() =>
                              handleRemoveItemCart(
                                dataCart,
                                product,
                                closeCartNow,
                              )
                            }
                            aria-label="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {dataCart && dataCart.length > 0 && (
          <footer className="cart-modal-footer">
            <div className="cart-subtotal-row">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-value">
                {formatCurrency(Number(totalPrice))}
              </span>
            </div>
            <div className="cart-footer-actions">
              <button
                type="button"
                className="cart-btn-secondary"
                onClick={closeCartNow}
              >
                Seguir comprando
              </button>
              <button
                type="button"
                className="cart-btn-primary"
                onClick={() => {
                  setCheckoutStep(CheckoutStep.CONFIRMAR_PRODUCTOS);
                  syncCheckoutFromProducts(buyNowProduct, dataCart ?? [], productsToShow);
                  onRouterLink("/confirma-productos");
                  closeCartNow();
                }}
              >
                Proceder al pago
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );

  if (typeof document === "undefined") return modal;

  return createPortal(modal, document.body);
};
