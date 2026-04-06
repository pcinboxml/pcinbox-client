// "use client";

// import { useEffect, useRef } from "react";
// import { usePathname } from "next/navigation";

// export const useScrollPosition = (key: string) => {
//   const pathname = usePathname();
//   const hasRestored = useRef(false);
//   const retryCount = useRef(0);
//   const maxRetries = 10;

//   // Guardar scroll continuamente
//   useEffect(() => {
//     const handleScroll = () => {
//       if (pathname.startsWith("/result-search-category")) {
//         sessionStorage.setItem(key, window.scrollY.toString());
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [pathname, key]);

//   // Restaurar scroll cuando entras a la página
//   useEffect(() => {
//     if (!pathname.startsWith("/result-search-category")) {
//       hasRestored.current = false;
//       retryCount.current = 0;
//       return;
//     }

//     // Evitar restaurar múltiples veces
//     if (hasRestored.current) return;

//     const savedPosition = sessionStorage.getItem(key);
//     if (!savedPosition) {
//       hasRestored.current = true;
//       return;
//     }

//     const target = parseInt(savedPosition, 10);
//     if (isNaN(target)) {
//       hasRestored.current = true;
//       return;
//     }

//     const restoreScroll = () => {
//       // Verificar si hay suficiente contenido para hacer scroll
//       const canScroll = document.body.scrollHeight > window.innerHeight;
      
//       if (canScroll && document.body.scrollHeight > target) {
//         window.scrollTo({
//           top: target,
//           behavior: "instant", // Usar "instant" para mejor compatibilidad
//         });
//         hasRestored.current = true;
//         retryCount.current = 0;
//       } else if (retryCount.current < maxRetries) {
//         // Si no hay suficiente contenido, esperar y reintentar
//         retryCount.current++;
//         setTimeout(restoreScroll, 200 + retryCount.current * 100); // Tiempo creciente
//       } else {
//         hasRestored.current = true; // Evitar bucles infinitos
//         retryCount.current = 0;
//       }
//     };

//     // Esperar a que el DOM esté listo
//     if (document.readyState === 'complete') {
//       restoreScroll();
//     } else {
//       window.addEventListener('load', restoreScroll);
//       return () => window.removeEventListener('load', restoreScroll);
//     }
//   }, [pathname, key]);
// };