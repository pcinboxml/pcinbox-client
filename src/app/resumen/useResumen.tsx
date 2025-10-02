"use client";

import { useMediaQuery } from "@mui/material";
import { useTheContext } from "../services/globalContext";
import GridResumen from "./gridResumen";
import useStorage from "../services/useStorage";
import { useMemo, useState } from "react";
import useService from "../services/useService";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { createCardToken } from "@mercadopago/sdk-react/esm/coreMethods";

initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "");

const useResumen = () => {
  const [loadingCreateOrder, setLoadingCreateOrder] = useState<boolean>(false);
  const { dataCart, setDataCart } = useTheContext();

  const isSmallScreen = useMediaQuery("(max-width: 1250px)", {
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

  const { columns, rows, totalIVA, totalPagar } = GridResumen({
    dataCart,
    isSmallScreen,
  });

  const handleCreateOrder = async () => {
    if (progressPay.methodPay.typeMethod == "efectivo") {
      try {
        setLoadingCreateOrder(true);

        const resp = await requestPostPagos(
          {
            totalAmount: totalPagar,
            userId: localStorage.getItem("idUser"),
            shipping_method: progressPay.optionSend.name,
            dataProduct: dataCart,
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
    } else if (progressPay.methodPay.typeMethod == "tarjeta_debito_credito") {
      const respCustomer = await requestPostPagos(
        {
          userId: localStorage.getItem("idUser"),
        },
        "/mp/getCustomerId/"
      );

      if (respCustomer.status == 200) {
        let obj = {
          cardId: progressPay.methodPay.idCard,
          securityCode: "123",
          customerId: respCustomer.data.data,
        };

        const cardTokenResponse = await requestPostPagos(obj, "mp/createToken");

        if (cardTokenResponse && cardTokenResponse.status == 200) {
          try {
            const response = await requestPostPagos(
              {
                amount: totalPagar,
                userId: localStorage.getItem("idUser"),
                cardId: progressPay.methodPay.idCard,
                token: cardTokenResponse.data.data.token,
              },
              "/mp/payment"
            );

            const status = await response.status;
            const data = await response.data;
            console.log(status);
            console.log(data);
          } catch (error: any) {}
        }
      }
    }
  };

  return {
    loadingCreateOrder,
    columns,
    rows,
    totalPrice,
    totalIVA,
    totalPagar,
    handleCreateOrder,
  };
};

export default useResumen;
