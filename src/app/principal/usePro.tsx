"use client";

import { useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";

const usePro = () => {
  const { dataProducts } = useTheContext();

  const [pagePro, setPagePro] = useState(1);
  const itemsPerPagePro = 8;

  const proProducts = useMemo(() => {
    return dataProducts.filter((item) => {
      try {
        if (item.caracteristicas) {
          const caracteristicas =
            typeof item.caracteristicas === "string"
              ? JSON.parse(item.caracteristicas)
              : item.caracteristicas;

          const tipo = caracteristicas.find((c: any) => c.prop === "tipo");
          return tipo?.value === "pro";
        }
        return false;
      } catch (error) {
        console.error("Error parseando caracteristicas:", error);
        return false;
      }
    });
  }, [dataProducts]);

  // 📄 Calcular productos de la página actual
  const startIndex = (pagePro - 1) * itemsPerPagePro;
  const endIndex = startIndex + itemsPerPagePro;
  const currentPageProductsPro = proProducts.slice(startIndex, endIndex);

  // 📊 Total de páginas
  const totalPagesPro = Math.ceil(proProducts.length / itemsPerPagePro);

  // 🧭 Cambio de página
  const handlePageChangePro = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagePro(value);
  };

  return {
    pagePro,
    totalPagesPro,
    handlePageChangePro,
  };
};

export default usePro;
