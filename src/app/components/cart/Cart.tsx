"use client";

import "./cart.css";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import ProductI from "@/app/interfaces/products/product.interface";
import { useEffect, useMemo, useState } from "react";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useCart from "./useCart";
import { MdAutorenew } from "react-icons/md";
import useStorage from "@/app/services/useStorage";
import { CheckoutStep } from "../timeline/checkoutSteps";
import Image from "next/image";

export const Cart = () => {
  return <img src="/carrito.png" loading="lazy" className="cart-icon-img" alt="" />;
};

export const ModalCart = ({
  onMouseLeaveCart,
  showDivCart,
}: {
  onMouseLeaveCart: () => void;
  showDivCart: boolean;
}) => {
  const [runCheckoutSync, setRunCheckoutSync] = useState(false);
  const { dataCart, setDataCart, buyNowProduct } = useTheContext();
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

  const itemCount = useMemo(
    () =>
      dataCart?.reduce((sum, item) => sum + Number(item.quantity || 1), 0) ?? 0,
    [dataCart],
  );

  useEffect(() => {
    if (!showDivCart || typeof document === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMouseLeaveCart();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showDivCart, onMouseLeaveCart]);

  useEffect(() => {
    if (!runCheckoutSync) return;

    if (buyNowProduct != null && dataCart?.length === 0) {
      localStorage.setItem("checkout_mode", "buy_now");
      localStorage.setItem(
        "checkout_products_snapshot",
        JSON.stringify(
          productsToShow!.map((p) => ({
            id: p.idProduct,
            quantity: p.quantity,
            storeId: p.storeId,
          })),
        ),
      );
    } else if (dataCart?.length > 0 && buyNowProduct === null) {
      localStorage.setItem("checkout_mode", "cart");
      localStorage.setItem(
        "checkout_products_snapshot",
        JSON.stringify(
          productsToShow!.map((p) => ({
            id: p.idProduct,
            quantity: p.quantity,
            storeId: p.storeId,
          })),
        ),
      );
    } else if (buyNowProduct === null && dataCart.length === 0) {
      localStorage.removeItem("checkout_mode");
      localStorage.removeItem("checkout_products_snapshot");
    }

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

  const updateQuantity = (product: ProductI, delta: number) => {
    const stockByStore =
      product?.product_stock?.find(
        (branch) => branch?.branchId === product?.storeId,
      )?.stock ?? Number(product?.stock ?? 0);

    const updateItems = dataCart.map((item) => {
      const matches =
        String(item.idProduct) === String(product.idProduct) &&
        String(item.storeId ?? "") === String(product.storeId ?? "");
      if (!matches) return item;

      const maxStock =
        Number(item.providerId) !== 1 ? stockByStore : Number(item.stock);
      const nextQty = Math.max(
        1,
        Math.min(maxStock, Number(item.quantity) + delta),
      );
      return { ...item, quantity: nextQty };
    });

    setDataCart(updateItems);
    handleWriteStorageDataCart(updateItems);
  };

  if (!showDivCart) return null;

  return (
    <div
      className="cart-modal-backdrop"
      role="presentation"
      onClick={onMouseLeaveCart}
    >
      <div
        className="cart-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mi carrito"
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={onMouseLeaveCart}
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
            onClick={onMouseLeaveCart}
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
                  localStorage.removeItem("progressPay2");
                  localStorage.removeItem("checkout_step");
                  setRunCheckoutSync(true);
                  onMouseLeaveCart();
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

        <div className="flex-1 overflow-y-auto p-4 contentCart">
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
                  onMouseLeaveCart();
                }}
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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
                          localStorage.setItem(
                            "product",
                            JSON.stringify(product),
                          );
                          onRouterLink(`/detailsProduct/${product.idProduct}`);
                          onMouseLeaveCart();
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
                                onMouseLeaveCart,
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
              <span>Subtotal</span>
              <span>{formatCurrency(Number(totalPrice))}</span>
            </div>
            <div className="cart-footer-actions">
              <button
                type="button"
                className="cart-btn-secondary"
                onClick={onMouseLeaveCart}
              >
                Seguir comprando
              </button>
              <button
                type="button"
                className="cart-btn-primary"
                onClick={() => {
                  localStorage.setItem(
                    "checkout_step",
                    String(CheckoutStep.CONFIRMAR_PRODUCTOS),
                  );
                  localStorage.setItem("checkout_mode", "cart");
                  onRouterLink("/confirma-productos");
                  onMouseLeaveCart();
                }}
              >
                Proceder al pago
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};
