"use client";

import { useEffect, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "./globalContext";
import {
  hasAuthToken,
  readLocalCartStorage,
  writeLocalCartStorageFromProducts,
  clearLocalCartStorage,
} from "../utils/cartSync";
import {
  buyNowSessionToProduct,
  CHECKOUT_STORAGE_KEYS,
  CheckoutMode,
  clearAccountScopedCheckoutStorage,
  getCheckoutMode,
  readBuyNowSession,
  setCheckoutMode,
} from "../utils/checkoutStorage";

/** Solo preferencias de checkout — sin montos manipulables. */
export type ProgressPayPersisted = {
  optionSend?: {
    name?: string;
    address?: number;
    storeIdDico?: unknown;
  };
  methodPay?: {
    name: string;
    typeMethod?: string;
    idCard?: unknown;
  };
  addressByStore?: Record<string, number>;
};

/** Estado en memoria para paso de entrega (costos vienen del servidor). */
export type ProgressPay2State = {
  dataPurchase?: Record<string, unknown>;
  pay?: {
    id?: unknown;
    name?: unknown;
  };
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function sanitizeProgressPay(data: Partial<ProgressPayPersisted>): ProgressPayPersisted {
  return {
    optionSend: data.optionSend
      ? {
          name: data.optionSend.name,
          address: data.optionSend.address,
          storeIdDico: data.optionSend.storeIdDico,
        }
      : undefined,
    methodPay: data.methodPay,
    addressByStore: data.addressByStore,
  };
}

const useStorage = () => {
  const { setDataCart, setBuyNowProduct } = useTheContext();
  const [dataCartStorege, setDataCartStorege] = useState<ProductI[]>([]);
  const [checkoutMode, setCheckoutModeState] = useState<CheckoutMode>("cart");

  const [progressPay, setProgressPay] = useState<ProgressPayPersisted>({
    optionSend: { name: "", address: 0 },
    methodPay: { name: "", typeMethod: "", idCard: "" },
  });

  const [progressPay2, setProgressPay2] = useState<ProgressPay2State>({
    dataPurchase: {},
    pay: {},
  });

  useEffect(() => {
    if (hasAuthToken()) {
      const mode = getCheckoutMode();
      if (mode) {
        setCheckoutModeState(mode);
      }
      return;
    }

    const stored = safeParse<ProgressPayPersisted>(
        localStorage.getItem(CHECKOUT_STORAGE_KEYS.progressPay),
      );
      if (stored) {
        setProgressPay((prev) => ({
          ...prev,
          ...sanitizeProgressPay(stored),
          optionSend: { ...prev.optionSend, ...stored.optionSend },
          methodPay: { ...prev.methodPay, ...stored.methodPay },
        }));
      }

      readLocalCartStorage();

      try {
        const buyNowSession = readBuyNowSession();
        const mode = getCheckoutMode() ?? "cart";
        setCheckoutModeState(mode);
        if (buyNowSession) {
          setBuyNowProduct(buyNowSessionToProduct(buyNowSession));
        }
      } catch {
        // sin sesión buy now
      }
  }, [setBuyNowProduct]);

  const handleWriteStorageProgressPay = (obj: Partial<ProgressPayPersisted>) => {
    const stored = safeParse<ProgressPayPersisted>(
      localStorage.getItem(CHECKOUT_STORAGE_KEYS.progressPay),
    );
    const prevStorage = stored ?? progressPay;

    const updated = sanitizeProgressPay({
      optionSend: { ...prevStorage.optionSend, ...obj.optionSend },
      methodPay: { ...prevStorage.methodPay, ...obj.methodPay },
      addressByStore: obj.addressByStore ?? prevStorage.addressByStore,
    });

    setProgressPay(updated);
    if (!hasAuthToken()) {
      localStorage.setItem(
        CHECKOUT_STORAGE_KEYS.progressPay,
        JSON.stringify(updated),
      );
    }
  };

  /** Solo memoria — montos y dataPurchase viven en el borrador del servidor. */
  const handleWriteStorageProgressPay2 = (obj: Partial<ProgressPay2State>) => {
    setProgressPay2((prev) => ({
      dataPurchase: { ...prev.dataPurchase, ...obj.dataPurchase },
      pay: { ...prev.pay, ...obj.pay },
    }));
  };

  const handleWriteStorageDataCart = (updatedCart: ProductI[]) => {
    setDataCartStorege(updatedCart);
    if (!hasAuthToken()) {
      writeLocalCartStorageFromProducts(updatedCart);
    }
  };

  const handleRemoveStorageDataCart = () => {
    setDataCartStorege([]);
    setDataCart([]);
    clearLocalCartStorage();
  };

  const clearAccountCheckoutState = () => {
    handleRemoveStorageDataCart();
    clearAccountScopedCheckoutStorage();
    setBuyNowProduct(null);
    setCheckoutModeState("cart");
    setProgressPay({
      optionSend: { name: "", address: 0 },
      methodPay: { name: "", typeMethod: "", idCard: "" },
    });
    setProgressPay2({ dataPurchase: {}, pay: {} });
  };

  const handleSetCheckoutMode = (mode: CheckoutMode) => {
    setCheckoutModeState(mode);
    setCheckoutMode(mode);
  };

  return {
    progressPay,
    progressPay2,
    dataCartStorege,
    handleWriteStorageProgressPay,
    handleWriteStorageProgressPay2,
    handleWriteStorageDataCart,
    handleRemoveStorageDataCart,
    clearAccountCheckoutState,
    checkoutMode,
    setCheckoutMode: handleSetCheckoutMode,
  };
};

export default useStorage;
