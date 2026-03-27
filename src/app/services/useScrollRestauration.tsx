"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function useScrollRestoration(
  scrollRef: React.RefObject<HTMLElement | null>,
) {
  const pathname = usePathname();

  useEffect(() => {
    return () => {
      if (!scrollRef.current) return;

      const isDetails = pathname.startsWith("/detailsProduct/");

      if (!isDetails) {
        sessionStorage.setItem(
          `scroll-${pathname}`,
          scrollRef.current.scrollTop.toString(),
        );
      }
    };
  }, [pathname, scrollRef]);

  // Restaurar scroll
  useEffect(() => {
    const isDetails = pathname.startsWith("/detailsProduct/");

    if (isDetails) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
      return;
    }

    const saved = sessionStorage.getItem(`scroll-${pathname}`);

    if (!saved || !scrollRef.current) return;

    const y = parseInt(saved, 10);

    const restore = () => {
      if (!scrollRef.current) return;

      const container = scrollRef.current;

      if (container.scrollHeight >= y) {
        container.scrollTop = y;
      } else {
        requestAnimationFrame(restore);
      }
    };

    restore();
  }, [pathname, scrollRef]);
}
