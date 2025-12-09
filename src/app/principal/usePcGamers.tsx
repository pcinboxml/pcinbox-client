import { useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";

interface UseProductsParams {
  tipo: string;
  itemsPerPage?: number;
}

const usePcGamers = ({ tipo, itemsPerPage = 8 }: UseProductsParams) => {
  const { dataProducts } = useTheContext();
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (!dataProducts || dataProducts.length === 0) return [];

    return dataProducts.filter((item) => {
      try {
        if (!item.caracteristicas) return false;

        // Asegurarse de que sea un array
        let caracteristicasArray: any[] = [];

        if (typeof item.caracteristicas === "string") {
          // Evitar parsear strings vacíos
          if (
            item.caracteristicas.trim() === "" ||
            item.caracteristicas === "[]"
          ) {
            return false;
          }
          caracteristicasArray = JSON.parse(item.caracteristicas);
        } else if (Array.isArray(item.caracteristicas)) {
          caracteristicasArray = item.caracteristicas;
        } else {
          return false;
        }

        // Verificar que realmente sea un array después del parse
        if (!Array.isArray(caracteristicasArray)) return false;

        const tipoProp = caracteristicasArray.find(
          (c: any) => c.prop === "tipo"
        );
        return tipoProp?.value === tipo;
      } catch (error) {
        console.error(
          "Error parseando caracteristicas:",
          error,
          item.caracteristicas
        );
        return false;
      }
    });
  }, [dataProducts, tipo]);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return {
    page,
    totalPages,
    handlePageChange,
    currentPageProducts,
  };
};

export default usePcGamers;
