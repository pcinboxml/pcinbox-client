"use client";

import { useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";

const useIntermedio = () => {
  const { dataProducts } = useTheContext();

  const [pageInter, setPageInter] = useState(1);
  const itemsPerPageInter = 8;

  const interProducts = useMemo(() => {
    if (!dataProducts || dataProducts.length === 0) return [];

    return dataProducts.filter((item) => {
      try {
        if (item.caracteristicas) {
          const caracteristicas =
            typeof item.caracteristicas === "string"
              ? JSON.parse(item.caracteristicas)
              : item.caracteristicas;

          const tipo = caracteristicas.find((c: any) => c.prop === "tipo");
          return tipo?.value === "intermedia";
        }
        return false;
      } catch (error) {
        console.error("Error parseando caracteristicas:", error);
        return false;
      }
    });
  }, [dataProducts]);

  const startIndex = (pageInter - 1) * itemsPerPageInter;
  const endIndex = startIndex + itemsPerPageInter;
  const currentPageProductsInter = interProducts.slice(startIndex, endIndex);

  const totalPagesInter = Math.ceil(interProducts.length / itemsPerPageInter);

  const handlePageChangeInter = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageInter(value);
  };

  return {
    pageInter,
    totalPagesInter,
    handlePageChangeInter,
    currentPageProductsInter,
  };
};

export default useIntermedio;
