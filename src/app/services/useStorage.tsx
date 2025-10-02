"use client";

import { useEffect, useState } from "react";

interface progressPayI {
  optionSend: {
    name: string;
    address?: number;
  };
  methodPay: {
    name: string;
    typeMethod?: string;
    idCard?: any;
  };
}

const useStorage = () => {
  const [progressPay, setProgressPay] = useState<progressPayI>({
    optionSend: {
      name: "",
      address: 0,
    },
    methodPay: {
      name: "",
      typeMethod: "",
      idCard: "",
    },
  });

  useEffect(() => {
    const stored = localStorage.getItem("progressPay");

    if (!stored) return;

    try {
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
    } catch (error) {
      console.error("Error parsing localStorage:", error);
    }
  }, []);

  const handleWriteStorageProgressPay = (obj: Partial<progressPayI>) => {
    const updated = {
      optionSend: {
        ...progressPay.optionSend,
        ...obj.optionSend,
      },
      methodPay: {
        ...progressPay.methodPay,
        ...obj.methodPay,
      },
    };

    setProgressPay(updated);
    localStorage.setItem("progressPay", JSON.stringify(updated));
  };

  return {
    progressPay,
    handleWriteStorageProgressPay,
  };
};
export default useStorage;
