// hooks/useEnterpriseSearch.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import useDebounced from "./useDebounced";

const fetchEnterpriseProducts = async (search: string) => {
  if (!search) return [];
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_PROVEEDOR}/searchProductInput?q=${encodeURIComponent(
      search,
    )}`,
  );
  if (!res.ok) throw new Error("Error al buscar productos");
  const data = await res.json();
  return data?.data ?? [];
};

const useEnterpriseSearch = (search: string) => {
  const debouncedSearch = useDebounced(search, 500); // espera 500ms tras la última tecla

  return useQuery({
    queryKey: ["enterprise-search", debouncedSearch],
    queryFn: () => fetchEnterpriseProducts(debouncedSearch),
    enabled: debouncedSearch.length >= 3, // solo busca a partir de 3 caracteres
    staleTime: 1000 * 60 * 2, // cache 2 minutos
  });
};

export default useEnterpriseSearch;
