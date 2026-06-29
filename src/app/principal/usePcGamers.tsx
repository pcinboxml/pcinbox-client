import { useEffect, useMemo, useState } from "react";
import { useTheContext } from "../services/globalContext";
import { publicEnv } from "@/app/config/env";

interface UseProductsParams {
  tipo: string;
  itemsPerPage?: number;
}

const usePcGamers = ({ tipo, itemsPerPage = 8 }: UseProductsParams) => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const getListProducts = async () => {
      try {
        const res = await fetch(
          `${publicEnv.apiUrlProveedor}/getAllProduct?page=${page}&limit=${itemsPerPage}&tipo=${tipo}`,
          { signal: controller.signal },
        );

        const data = await res.json();

        setProducts(data?.data ?? []);
        setTotalPages(data?.totalPages ?? 0);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    };

    getListProducts();

    return () => controller.abort();
  }, [tipo, page, itemsPerPage]);

  return {
    page,
    totalPages,
    handlePageChange: (_: any, value: number) => setPage(value),
    currentPageProducts: products, // 👈 siempre array
  };
};

export default usePcGamers;
