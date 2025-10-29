"use client";

import { useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";

const useEntrada = () => {
  const { dataProducts } = useTheContext();

  const [pageEntrada, setPageEntrada] = useState(1);
  const itemsPerPageEntrada = 8;

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
          return tipo?.value === "entrada";
        }
        return false;
      } catch (error) {
        console.error("Error parseando caracteristicas:", error);
        return false;
      }
    });
  }, [dataProducts]);

  const startIndex = (pageEntrada - 1) * itemsPerPageEntrada;
  const endIndex = startIndex + itemsPerPageEntrada;
  const currentPageProductsEntrada = interProducts.slice(startIndex, endIndex);

  const totalPagesEntrada = Math.ceil(
    interProducts.length / itemsPerPageEntrada
  );

  const handlePageChangeEntrada = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPageEntrada(value);
  };

  return {
    pageEntrada,
    totalPagesEntrada,
    handlePageChangeEntrada,
    currentPageProductsEntrada,
  };
};

export default useEntrada;
