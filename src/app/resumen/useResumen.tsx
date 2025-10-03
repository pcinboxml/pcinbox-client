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
  const { dataCart, setDataCart, setDataModal } = useTheContext();

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
      try {
        setLoadingCreateOrder(true);

        const resp = await requestPostPagos(
          {
            userId: Number(localStorage.getItem("idUser")),
            paymentMethodId: progressPay.methodPay.idCard,
            amount: Math.round(totalPagar * 100),
          },
          "/stripe/paymentWithCard"
        );

        if (resp.status == 200) {
          setLoadingCreateOrder(true);

          try {
            const respRemoveCart = await requestPost(
              {
                dataCart,
              },
              "/cart/removeAllCart"
            );
            setLoadingCreateOrder(false);

            if (respRemoveCart.status == 200) {
              localStorage.removeItem("progressPay");

              setDataCart([]);
              const data = await resp.data;
              setDataModal({
                isOpen: true,
                type: "success",
                title: "Correcto",
                message: "Pago realizado correctamente",
                onClose: () => {
                  onRouterLink(
                    `/pay-end?idOrder=${data.data.orderId}&method_pay=tarjeta_debito_credito`
                  );
                  setDataCart([]);
                  setDataModal((prev) => ({ ...prev, isOpen: false }));
                },
                onConfirm: () => {
                  onRouterLink(
                    `/pay-end?idOrder=${data.data.orderId}&method_pay=tarjeta_debito_credito`
                  );
                  setDataCart([]);
                  setDataModal((prev) => ({ ...prev, isOpen: false }));
                },
              });
            }
          } catch (error) {
            setLoadingCreateOrder(false);
          }
        }
      } catch (error) {
        setLoadingCreateOrder(false);
        setDataModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Ocurrió un error al procesar el pago, intentalo de nuevo",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
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
