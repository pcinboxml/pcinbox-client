"use client";

import { useMediaQuery } from "@mui/material";
import { useTheContext } from "../services/globalContext";
import GridResumen from "./gridResumen";
import useStorage from "../services/useStorage";
import { useMemo, useState } from "react";
import useService from "../services/useService";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";

const useResumen = () => {
  const [loadingCreateOrder, setLoadingCreateOrder] = useState<boolean>(false);
  const { dataCart } = useTheContext();

  const isSmallScreen = useMediaQuery("(max-width: 1550px)", {
    noSsr: true,
  });

  const { onRouterLink } = useService();

  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  const { progressPay } = useStorage();
  const { requestPostPagos } = usePasarelaDePagos();

  const { columns, rows } = GridResumen({ dataCart, isSmallScreen });

  const handleCreateOrder = async () => {
    if (progressPay.methodPay.typeMethod == "efectivo") {
      try {
        setLoadingCreateOrder(true);

        const resp = await requestPostPagos(
          {
            totalAmount: totalPrice,
            userId: localStorage.getItem("idUser"),
            shipping_method: progressPay.optionSend.name,
          },
          "/stripe/createOrderCash"
        );

        setLoadingCreateOrder(false);

        if (resp.status == 200) {
          const data = await resp.data;
          onRouterLink(
            `/pay-end?idOrder=${data.data.orderId}&method_pay=oxxo&expired=${data.data.next_action.oxxo_display_details.expires_after}`
          );
        }
      } catch (error) {
        setLoadingCreateOrder(false);
      }
    }
  };

  return {
    loadingCreateOrder,
    columns,
    rows,
    totalPrice,
    handleCreateOrder,
  };
};

export default useResumen;
