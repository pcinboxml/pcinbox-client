"use client";

import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import {
  abandonBuyNowSession,
  clearPostPurchaseStorage,
  persistBuyNowSession,
  setCheckoutMode,
  setCheckoutStep,
  writeCheckoutSnapshot,
} from "../utils/checkoutStorage";
import { toCheckoutSnapshot } from "../utils/checkoutValidation";
import { CheckoutStep } from "../components/timeline/checkoutSteps";

import useCheckoutDraft from "./useCheckoutDraft";

export default function useCheckoutSession() {
  const { setBuyNowProduct, setDataCart } = useTheContext();
  const { clearDraft } = useCheckoutDraft();

  const startBuyNow = (product: ProductI, quantity: number) => {
    const session = persistBuyNowSession(product, quantity);
    setBuyNowProduct({
      ...product,
      quantity: session.quantity,
      storeId: session.storeId ?? undefined,
    });
  };

  const clearBuyNow = () => {
    abandonBuyNowSession();
    setBuyNowProduct(null);
  };

  const enterCartCheckout = (products: ProductI[]) => {
    clearBuyNow();
    setCheckoutMode("cart");
    writeCheckoutSnapshot(toCheckoutSnapshot(products));
    setCheckoutStep(CheckoutStep.CONFIRMAR_PRODUCTOS);
  };

  const completePurchaseCleanup = () => {
    clearPostPurchaseStorage();
    setBuyNowProduct(null);
    setDataCart([]);
    void clearDraft();
  };

  return {
    startBuyNow,
    clearBuyNow,
    enterCartCheckout,
    completePurchaseCleanup,
  };
}
