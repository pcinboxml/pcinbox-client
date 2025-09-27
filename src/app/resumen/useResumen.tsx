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
  const { dataCart, setDataCart } = useTheContext();

  const isSmallScreen = useMediaQuery("(max-width: 1550px)", {
    noSsr: true,
  });

  const { onRouterLink, requestPost } = useService();
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
            totalAmount: totalPrice + totalPrice * 0.16,
            userId: localStorage.getItem("idUser"),
            shipping_method: progressPay.optionSend.name,
          },
          "/stripe/createOrderCash"
        );

        if (resp.status == 200) {
          const data = await resp.data;

          try {
            const respRemoveCart = await requestPost(
              {
                dataCart,
              },
              "/cart/removeAllCart"
            );
            setLoadingCreateOrder(false);

            if (respRemoveCart.status == 200) {
              // localStorage.removeItem("progressPay");
              onRouterLink(
                `/pay-end?idOrder=${data.data.orderId}&method_pay=oxxo&expired=${data.data.next_action.oxxo_display_details.expires_after}`
              );
              setDataCart([]);
            }
          } catch (error) {
            setLoadingCreateOrder(false);
          }
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
