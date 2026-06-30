"use client";

import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import useStorage from "../services/useStorage";
import { clearLocalCartStorage } from "../utils/cartSync";
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

import useCartSync from "./useCartSync";
import useCheckoutDraft from "./useCheckoutDraft";

export default function useCheckoutSession() {
  const { setBuyNowProduct, setDataCart, dataCart, hasToken } = useTheContext();
  const { clearDraft } = useCheckoutDraft();
  const { clearCartEverywhere, refreshCartFromServer } = useCartSync();
  const { handleRemoveStorageDataCart } = useStorage();

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

  const completePurchaseCleanup = async () => {
    clearPostPurchaseStorage();
    setBuyNowProduct(null);
    void clearDraft();

    try {
      const items = hasToken ? await refreshCartFromServer() : [...dataCart];
      await clearCartEverywhere(items);
    } catch {
      setDataCart([]);
      clearLocalCartStorage();
    } finally {
      handleRemoveStorageDataCart();
    }
  };

  return {
    startBuyNow,
    clearBuyNow,
    enterCartCheckout,
    completePurchaseCleanup,
  };
}
