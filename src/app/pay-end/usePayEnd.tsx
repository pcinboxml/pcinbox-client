"use client";

import { useState } from "react";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { OrderI } from "../interfaces/stripe/stripe.interface";

const usePayEnd = () => {
  const { requestPostPagos, requestGetPagos } = usePasarelaDePagos();
  const [dataOrderCash, setDataOrderCash] = useState<OrderI | null>();
  const [loadingDownloadBar, setLoadingDownloadBar] = useState<boolean>(false);

  const handleGetOrderCash = async (idOrder: any, idUser: any) => {
    try {
      const resp = await requestPostPagos(
        {
          idOrder,
          idUser,
        },
        "/stripe/getOrderCash"
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

  const handleDownloadBar = async (valueBar: any) => {
    try {
      setLoadingDownloadBar(true);
      const resp = await requestGetPagos(
        `/codeOxxo/downloadCodeBar/${valueBar}`,
        true
      );

      const url = window.URL.createObjectURL(new Blob([resp.data]));

      // Crear <a> y simular click
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `barcode-${valueBar}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar URL temporal
      window.URL.revokeObjectURL(url);

      setLoadingDownloadBar(false);
    } catch (error) {
      setLoadingDownloadBar(false);
    }
  };

  const initDownloadBar = async (valueBar: any) => {
    const resp = await requestGetPagos(
      `/codeOxxo/downloadCodeBar/${valueBar}`,
      true
    );

    const url = window.URL.createObjectURL(new Blob([resp.data]));

    // Crear <a> y simular click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `barcode-${valueBar}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpiar URL temporal
    window.URL.revokeObjectURL(url);
  };

  return {
    handleGetOrderCash,
    formatDate,
    handleDownloadBar,
    initDownloadBar,
    dataOrderCash,
    loadingDownloadBar,
  };
};

export default usePayEnd;
