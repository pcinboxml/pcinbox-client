"use client";

import { useState } from "react";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { OrderI } from "../interfaces/stripe/stripe.interface";

const usePayEnd = () => {
  const { requestPostPagos } = usePasarelaDePagos();
  const [dataOrderCash, setDataOrderCash] = useState<OrderI | null>();

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

  return {
    handleGetOrderCash,
    formatDate,
    dataOrderCash,
  };
};

export default usePayEnd;
