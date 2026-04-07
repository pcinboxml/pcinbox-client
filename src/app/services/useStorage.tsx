"use client";

import { useEffect, useState } from "react";
import CartI from "../interfaces/cart/cart.interface";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "./globalContext";

interface progressPayI {
  optionSend: {
    name?: string;
    address?: number;
    costo?: any;
    storeIdDico?: any;
  };
  methodPay: {
    name: string;
    typeMethod?: string;
    idCard?: any;
  };
}

interface progressPayI2 {
  dataPurchase?: {};
  pay?: {
    id?: any;
    name?: any;
  };
  // optionEnvio?: any;
  // addressByStore?: any;
  // costoEnvioProductByZone?: any;
  // seguroEnvio?: any;
  // pay?: {
  //   id?: any;
  //   name?: any;
  // };
}

type CheckoutMode = "cart" | "buy_now";

const useStorage = () => {
  const { setDataCart, setBuyNowProduct } = useTheContext();
  const [dataCartStorege, setDataCartStorege] = useState<ProductI[]>([]);
  const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>("cart");

  const [progressPay, setProgressPay] = useState<progressPayI>({
    optionSend: {
      name: "",
      address: 0,
      costo: 0,
    },
    methodPay: {
      name: "",
      typeMethod: "",
      idCard: "",
    },
  });

  const [progressPay2, setProgressPay2] = useState<progressPayI2>({
    dataPurchase: {},
    pay: {},
  });

  useEffect(() => {
    // Cargar datos de progressPay
    try {
      const stored = localStorage.getItem("progressPay");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProgressPay((prev) => ({
          ...prev,
          ...parsed,
          optionSend: {
            ...prev.optionSend,
            ...parsed.optionSend,
          },
          methodPay: {
            ...prev.methodPay,
            ...parsed.methodPay,
          },
        }));
      }
    } catch (error) {
      console.error("Error parsing progressPay from localStorage:", error);
    }

    // Cargar datos de progressPay2
    try {
      const stored2 = localStorage.getItem("progressPay2");
      if (stored2) {
        const parsed2 = JSON.parse(stored2);
        setProgressPay2((prev2) => ({
          ...prev2,
          ...parsed2,
          dataPurchase: {
            ...prev2.dataPurchase,
            ...parsed2?.dataPurchase,
          },
          pay: {
            ...prev2?.pay,
            ...parsed2?.pay,
          },
        }));
      }
    } catch (error) {
      console.error("Error parsing progressPay2 from localStorage:", error);
    }

    // Cargar datos del carrito - ESTA ES LA PARTE CORREGIDA
    try {
      const stored3 = localStorage.getItem("dataCartStorage");
      if (stored3) {
        const parsed3 = JSON.parse(stored3);
        // Reemplaza completamente el estado en lugar de concatenar
        setDataCartStorege(parsed3);
        setDataCart(parsed3);
      }
    } catch (error) {
      console.error("Error parsing dataCartStorage from localStorage:", error);
    }

    try {
      const storageBuyNowProduct = localStorage.getItem("buyNowProduct");
      const mode = localStorage.getItem("checkout_mode") as "cart" | "buy_now";

      setCheckoutMode(mode || "cart");

      if (storageBuyNowProduct) {
        const parsed4 = JSON.parse(storageBuyNowProduct);
        setBuyNowProduct(parsed4);
      }
    } catch (error) {
      console.log("Error parsing buyNow", error);
    }
  }, []);

  const handleWriteStorageProgressPay = (obj: Partial<progressPayI>) => {
    const stored = localStorage.getItem("progressPay");
    const prevStorage = stored ? JSON.parse(stored) : progressPay;

    const updated: progressPayI = {
      optionSend: {
        ...prevStorage.optionSend,
        ...obj.optionSend,
      },
      methodPay: {
        ...prevStorage.methodPay,
        ...obj.methodPay,
      },
    };

    setProgressPay(updated);
    localStorage.setItem("progressPay", JSON.stringify(updated));
  };

  const handleWriteStorageProgressPay2 = (obj: Partial<progressPayI2>) => {
    const stored = localStorage.getItem("progressPay2");
    const prevStorage = stored ? JSON.parse(stored) : progressPay2;

    const updated: progressPayI2 = {
      dataPurchase: {
        ...prevStorage.dataPurchase,
        ...obj?.dataPurchase,
      },
      pay: {
        ...prevStorage?.pay,
        ...obj?.pay,
      },
    };

    setProgressPay2(updated);
    localStorage.setItem("progressPay2", JSON.stringify(updated));
  };

  const handleWriteStorageDataCart = (updatedCart: ProductI[]) => {
    setDataCartStorege(updatedCart); // actualiza el estado
    localStorage.setItem("dataCartStorage", JSON.stringify(updatedCart)); // actualiza storage
  };

  const handleRemoveStorageDataCart = () => {
    setDataCartStorege([]);
    setDataCart([]);
    localStorage.removeItem("dataCartStorage");
  };

  // const syncStorageWithGlobalCart = (globalCart: ProductI[]) => {
  //   setDataCartStorege(globalCart);
  //   localStorage.setItem("dataCartStorage", JSON.stringify(globalCart));
  // };

  return {
    progressPay,
    progressPay2,
    dataCartStorege,
    handleWriteStorageProgressPay,
    handleWriteStorageProgressPay2,
    handleWriteStorageDataCart,
    // syncStorageWithGlobalCart,
    handleRemoveStorageDataCart,
    checkoutMode,
    setCheckoutMode,
  };
};

export default useStorage;
