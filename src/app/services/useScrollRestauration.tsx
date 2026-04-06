"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useScrollRestoration(
  scrollRef: React.RefObject<HTMLElement | null>,
) {
  const pathname = usePathname();

  // --------------------------
  // Guardar scroll al salir
  // --------------------------
  useEffect(() => {
    return () => {
      if (!scrollRef.current) return;

      const isDetails = pathname.startsWith("/detailsProduct/");
      const isResultSearch = pathname.startsWith("/result-search-category");

      // NO guardar scroll en rutas excluidas
      if (!isDetails && !isResultSearch) {
        sessionStorage.setItem(
          `scroll-${pathname}`,
          scrollRef.current.scrollTop.toString(),
        );
      }
    };
  }, [pathname, scrollRef]);

  // --------------------------
  // Restaurar scroll al cargar
  // --------------------------
  useEffect(() => {
    const isDetails = pathname.startsWith("/detailsProduct/");
    const isResultSearch = pathname.startsWith("/result-search-category");

    // Si es ruta excluida, solo set scroll a 0 (opcional)
    if (isDetails) {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      return;
    }

    if (isResultSearch) {
      // Restaurar scroll guardado manualmente en tu page.tsx o layout
      return;
    }

    // Rutas normales: restaurar scroll guardado
    const saved = sessionStorage.getItem(`scroll-${pathname}`);
    if (!saved || !scrollRef.current) return;

    const y = parseInt(saved, 10);

    const restore = () => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;

      if (container.scrollHeight >= y) {
        container.scrollTop = y;
      } else {
        // Espera a que el contenido tenga altura suficiente
        requestAnimationFrame(restore);
      }
    };

    restore();
  }, [pathname, scrollRef]);
}