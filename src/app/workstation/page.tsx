"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Card from "../components/card/Card";
import PaginationComponent from "../components/pagination/PaginationComponent";
import useProducts from "../hooks/products";
import "../principal/principal.css";

const WorkstationPage = () => {
  const router = useRouter();
  const { products } = useProducts();
  const [pages, setPages] = useState<Record<string, number>>({});
  const itemsPerPage = 8;

  const handlePageChange =
    (tipo: string) => (_: React.ChangeEvent<unknown>, value: number) => {
      setPages((prev) => ({
        ...prev,
        [tipo]: value,
      }));
    };

  const tipos = [
    { tipo: "workStation", label: "PC Estación de trabajo" }
  ];

  const productosPorTipo = useMemo(() => {
    return tipos.map(({ tipo, label }) => {
      const filtrados = products.filter((item) => {
        if (!item.caracteristicas) return false;

        try {
          const arr =
            typeof item.caracteristicas === "string"
              ? JSON.parse(item.caracteristicas)
              : item.caracteristicas;

          const tipoProp = arr.find((c: any) => c.prop === "tipo");
          return tipoProp?.value === tipo;
        } catch {
          return false;
        }
      });

      const page = pages[tipo] || 1;
      const totalPages = Math.ceil(filtrados.length / itemsPerPage);

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;

      const currentPageProducts = filtrados.slice(start, end);

      return {
        tipo,
        label,
        currentPageProducts,
        page,
        totalPages,
      };
    });
  }, [products, pages]);

  const hasAnyProducts = useMemo(() => {
    return productosPorTipo.some((p) => p.currentPageProducts.length > 0);
  }, [productosPorTipo]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full mb-6">

        <h1 className="text-3xl font-extrabold text-zinc-950 mt-4 border-b pb-2">
          Estaciones de Trabajo
        </h1>
      </div>

      <div className="w-full">
        {productosPorTipo.map(
          ({ tipo, label, currentPageProducts, page, totalPages }) =>
            currentPageProducts.length > 0 && (
              <div key={tipo} className="mb-10">
                <div className="head-container">
                  <span>{label}</span>
                </div>

                <div className="container-destacado">
                  {currentPageProducts.map((product) => (
                    <Card key={product.idProduct} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <PaginationComponent
                      page={page}
                      count={totalPages}
                      onChange={handlePageChange(tipo)}
                    />
                  </div>
                )}
              </div>
            )
        )}

        {!hasAnyProducts && (
          <div className="w-full py-16 text-center text-zinc-500 font-medium bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
            No hay computadoras de trabajo disponibles en este momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkstationPage;
