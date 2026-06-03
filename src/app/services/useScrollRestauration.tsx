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

      // Guardar scroll de la página de la que estamos saliendo
      if (!isDetails) {
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

    // Si es ruta excluida, solo set scroll a 0 (opcional)
    if (isDetails) {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      return;
    }

    // Rutas normales: restaurar scroll guardado
    const saved = sessionStorage.getItem(`scroll-${pathname}`);
    if (!saved || !scrollRef.current) return;

    const y = parseInt(saved, 10);
    let rafId: number;
    let retries = 0;
    const maxRetries = 150; // ~2.5 segundos a 60fps

    const restore = () => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;

      if (container.scrollHeight >= y) {
        container.scrollTop = y;
      } else if (retries < maxRetries) {
        retries++;
        rafId = requestAnimationFrame(restore);
      }
    };

    restore();

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [pathname, scrollRef]);
}