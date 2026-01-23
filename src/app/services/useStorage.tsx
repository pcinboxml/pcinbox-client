"use client";

import { useEffect, useState } from "react";

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
  optionEnvio?: any;
  addressByStore?: any;
  costoEnvioProductByZone?: any;
  pay?: {
    id?: any;
    name?: any;
  };
}

const useStorage = () => {
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
    optionEnvio: {},
    addressByStore: {},
    costoEnvioProductByZone: {},

    pay: {
      name: "",
      id: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("progressPay");
    const stored2 = localStorage.getItem("progressPay2");

    if (!stored || !stored2) return;

    try {
      const parsed = JSON.parse(stored);
      const parsed2 = JSON.parse(stored2);

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
      setProgressPay2((prev2) => ({
        ...prev2,
        ...parsed2,
        optionEnvio: {
          ...prev2.optionEnvio,
          ...parsed2.optionEnvio,
        },
        addressByStore: {
          ...prev2.addressByStore,
          ...parsed2.addressByStore,
        },
        costoEnvioProductByZone: {
          ...prev2.costoEnvioProductByZone,
          ...parsed2.costoEnvioProductByZone,
        },
        // products: [...prev2.products, ...parsed2.products],
        pay: {
          ...prev2.pay,
          ...parsed2.pay,
        },
      }));
    } catch (error) {
      console.error("Error parsing localStorage:", error);
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
      // products: [...(prevStorage.products ?? []), ...(obj.products ?? [])],
      optionEnvio: {
        ...prevStorage.optionEnvio,
        ...obj.optionEnvio,
      },
      addressByStore: {
        ...prevStorage.addressByStore,
        ...obj.addressByStore,
      },
      costoEnvioProductByZone: {
        ...prevStorage.costoEnvioProductByZone,
        ...obj.costoEnvioProductByZone,
      },
      pay: {
        ...prevStorage.pay,
        ...obj.pay,
      },
    };

    setProgressPay2(updated);
    localStorage.setItem("progressPay2", JSON.stringify(updated));
  };
  return {
    progressPay,
    progressPay2,
    handleWriteStorageProgressPay,
    handleWriteStorageProgressPay2,
  };
};
export default useStorage;
