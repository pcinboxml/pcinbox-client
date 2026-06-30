"use client";

import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import useStorage from "../services/useStorage";
import {
  abandonBuyNowSession,
  clearPostPurchaseStorage,
  getCheckoutMode,
  persistBuyNowSession,
  setCheckoutMode,
  setCheckoutStep,
  writeCheckoutSnapshot,
} from "../utils/checkoutStorage";
import { toCheckoutSnapshot } from "../utils/checkoutValidation";
import { CheckoutStep } from "../components/timeline/checkoutSteps";
import useCartSync from "./useCartSync";
import useCheckoutDraft from "./useCheckoutDraft";

export default function useCheckoutSession() {
  const { setBuyNowProduct, hasToken } = useTheContext();
  const { setCheckoutMode: setCheckoutModeState, handleRemoveStorageDataCart } =
    useStorage();
  const { saveDraft, clearDraft } = useCheckoutDraft();
  const { clearCartEverywhere } = useCartSync();

  const startBuyNow = (product: ProductI, quantity: number) => {
    const session = persistBuyNowSession(product, quantity);
    setCheckoutModeState("buy_now");
    setBuyNowProduct({
      ...product,
      quantity: session.quantity,
      storeId: session.storeId ?? undefined,
    });

    if (hasToken) {
      void saveDraft({
        checkoutMode: "buy_now",
        checkoutStep: CheckoutStep.CONFIRMAR_PRODUCTOS,
        buyNow: {
          idProduct: session.idProduct,
          quantity: session.quantity,
          storeId: session.storeId,
        },
        deliveryGroups: {},
      });
    }
  };

  const clearBuyNow = () => {
    abandonBuyNowSession();
    setCheckoutModeState("cart");
    setBuyNowProduct(null);
  };

  const enterCartCheckout = (products: ProductI[]) => {
    clearBuyNow();
    setCheckoutModeState("cart");
    setCheckoutMode("cart");
    writeCheckoutSnapshot(toCheckoutSnapshot(products));
    setCheckoutStep(CheckoutStep.CONFIRMAR_PRODUCTOS);

    if (hasToken) {
      void saveDraft({
        checkoutMode: "cart",
        checkoutStep: CheckoutStep.CONFIRMAR_PRODUCTOS,
        buyNow: null,
        deliveryGroups: {},
      });
    }
  };

  /** Solo progreso de checkout (localStorage). No toca el carrito en BD ni dataCartStorage. */
  const resetCheckoutProgress = () => {
    clearPostPurchaseStorage();
    setBuyNowProduct(null);
    void clearDraft();
  };

  /**
   * Vacía carrito + progreso de checkout.
   * Usar únicamente cuando el pago está confirmado (socket removeStorageProgressPay2).
   */
  const clearCartAfterPaymentConfirmed = async () => {
    const mode = getCheckoutMode();
    resetCheckoutProgress();

    if (mode === "buy_now") {
      return;
    }

    if (!hasToken) {
      handleRemoveStorageDataCart();
      return;
    }

    try {
      await clearCartEverywhere();
      handleRemoveStorageDataCart();
    } catch (error) {
      console.error("[cart] Error al vaciar carrito tras pago confirmado:", error);
    }
  };

  return {
    startBuyNow,
    clearBuyNow,
    enterCartCheckout,
    resetCheckoutProgress,
    clearCartAfterPaymentConfirmed,
  };
}
