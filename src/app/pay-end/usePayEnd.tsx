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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleDownloadBar = async (valueBar: string) => {
    const barcodeValue = String(valueBar ?? "").trim();
    if (!barcodeValue) return;

    let link: HTMLAnchorElement | null = null;
    let objectUrl: string | null = null;

    try {
      setLoadingDownloadBar(true);
      const resp = await requestGetPagos(
        `/codeOxxo/downloadCodeBar/${encodeURIComponent(barcodeValue)}`,
        true,
      );

      objectUrl = window.URL.createObjectURL(
        new Blob([resp.data], { type: "image/png" }),
      );

      link = document.createElement("a");
      link.href = objectUrl;
      link.setAttribute("download", `barcode-${barcodeValue}.png`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error al descargar el código de barras:", error);
    } finally {
      if (link?.parentNode) {
        link.parentNode.removeChild(link);
      }
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
      setLoadingDownloadBar(false);
    }
  };

  const handleCopy = (idOrder: string) => {
    navigator.clipboard
      .writeText(idOrder)
      .then(() => {
        console.log("Texto copiado al portapapeles:", idOrder);
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
      });
  };

  return {
    handleGetOrderCash,
    formatDate,
    handleDownloadBar,
    handleCopy,
    dataOrderCash,
    loadingDownloadBar,
  };
};

export default usePayEnd;
