"use client";

import { useState } from "react";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";

const usePayEnd = () => {
  const { requestPostPagos, requestGetPagos } = usePasarelaDePagos();
  const [dataOrderCash, setDataOrderCash] = useState<any | null>(null);
  const [loadingDownloadBar, setLoadingDownloadBar] = useState<boolean>(false);

  const handleGetOrderCash = async (idTransaction: any, idOrder: any) => {
    try {
      const resp = await requestPostPagos(
        {
          idTransaction,
          idOrder,
          idUser: localStorage.getItem("idUser"),
        },
        "/openpay/getDataOrderOpenPay",
      );

      if (resp.status == 200) {
        const data = await resp.data;

        setDataOrderCash(data.data.data);
      }
    } catch (error) {
      setDataOrderCash(null);
    }
  };

  const formatDate = (unix: number) => {
    const date = new Date(unix * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Enero = 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // No necesitas crear el 'a' aquí, solo la lógica de descarga
  const handleDownloadBar = async (
    valueBar: any,
    linkRef: React.RefObject<HTMLAnchorElement | null>,
  ) => {
    if (!linkRef.current) return; // Salir si la referencia no está lista

    try {
      setLoadingDownloadBar(true);
      const resp = await requestGetPagos(
        `/codeOxxo/downloadCodeBar/${valueBar}`,
        true,
      );

      const url = window.URL.createObjectURL(new Blob([resp.data]));

      // Usamos la referencia al elemento 'a' que está en el componente
      const link = linkRef.current;
      link.href = url;
      link.setAttribute("download", `barcode-${valueBar}.png`);

      // Simulamos el click
      link.click();

      // Limpiamos la URL temporal después de un pequeño retraso
      // para asegurar que la descarga haya comenzado.
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100); // 100ms es generalmente suficiente
    } catch (error) {
      console.error("Error al descargar el código de barras:", error);
    } finally {
      setLoadingDownloadBar(false);
    }
  };

  // const handleDownloadBar = async (valueBar: any) => {
  //   try {
  //     setLoadingDownloadBar(true);
  //     const resp = await requestGetPagos(
  //       `/codeOxxo/downloadCodeBar/${valueBar}`,
  //       true
  //     );

  //     const url = window.URL.createObjectURL(new Blob([resp.data]));

  //     // Crear <a> y simular click
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `barcode-${valueBar}.png`);
  //     document.body.appendChild(link);
  //     link.click();
  //     if (link.parentNode) {
  //       link.parentNode.removeChild(link);
  //     }

  //     // Limpiar URL temporal
  //     window.URL.revokeObjectURL(url);

  //     setLoadingDownloadBar(false);
  //   } catch (error) {
  //     setLoadingDownloadBar(false);
  //   }
  // };

  // const initDownloadBar = async (valueBar: any) => {
  //   const resp = await requestGetPagos(
  //     `/codeOxxo/downloadCodeBar/${valueBar}`,
  //     true,
  //   );

  //   const url = window.URL.createObjectURL(new Blob([resp.data]));

  //   // Crear <a> y simular click
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.setAttribute("download", `barcode-${valueBar}.png`);
  //   document.body.appendChild(link);
  //   link.click();
  //   if (link.parentNode) {
  //     link.parentNode.removeChild(link);
  //   }

  //   // Limpiar URL temporal
  //   window.URL.revokeObjectURL(url);
  // };

  const initDownloadBar = async (valueBar: any) => {
    let link: HTMLAnchorElement | null = null;
    let url: string | null = null;

    try {
      const resp = await requestGetPagos(
        `/codeOxxo/downloadCodeBar/${valueBar}`,
        true,
      );

      url = window.URL.createObjectURL(new Blob([resp.data]));

      // Crear <a> y simular click
      link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `barcode-${valueBar}.png`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error en la inicialización de la descarga:", error);
      // Manejar el error si es necesario
    } finally {
      // Limpieza segura
      if (link) {
        try {
          // Elimina el nodo del body directamente.
          document.body.removeChild(link);
        } catch (e) {
          // Si falla, no es crítico, el navegador probablemente ya lo limpió.
          console.warn(
            "No se pudo remover el enlace del DOM en initDownloadBar.",
            e,
          );
        }
      }

      if (url) {
        // Limpia la URL temporal para liberar memoria.
        window.URL.revokeObjectURL(url);
      }
    }
  };

  const handleCopy = (idOrder: string) => {
    navigator.clipboard
      .writeText(idOrder)
      .then(() => {
        console.log("Texto copiado al portapapeles:", idOrder);
        // Puedes mostrar un toast o mensaje de éxito aquí
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
        // Manejo de errores
      });
  };
  return {
    handleGetOrderCash,
    formatDate,
    handleDownloadBar,
    initDownloadBar,
    handleCopy,
    dataOrderCash,
    loadingDownloadBar,
  };
};

export default usePayEnd;
