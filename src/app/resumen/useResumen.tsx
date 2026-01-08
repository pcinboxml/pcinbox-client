"use client";

import { useMediaQuery } from "@mui/material";
import { useTheContext } from "../services/globalContext";
import GridResumen from "./gridResumen";
import useStorage from "../services/useStorage";
import { useMemo, useState } from "react";
import useService from "../services/useService";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import FormFactura from "../components/formFactura/FormFactura";

const useResumen = () => {
  const [loadingCreateOrder, setLoadingCreateOrder] = useState<boolean>(false);
  const { dataCart, setDataCart, setDataModal } = useTheContext();
  const [selectedFactura, setSelectedFactura] = useState<boolean>(false);
  const [billingData, setBillingData] = useState(null);

  const isSmallScreen = useMediaQuery("(max-width: 1250px)", {
    noSsr: true,
  });

  const { onRouterLink, requestPost, requestGet } = useService();
  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
          .filter((itemF) => itemF.stock != 0)
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
            idAddress: progressPay.optionSend.address,
            requiredFactura: selectedFactura,
          },
          "/stripe/createOrderCash"
        );

        if (resp.status == 200) {
          const data = await resp.data;
          setLoadingCreateOrder(false);
          setDataCart([]);

          setDataModal({
            isOpen: true,
            type: "success",
            title: "Correcto",
            message: "Orden generada correctamente",
            onClose: () => {
              onRouterLink(
                `/pay-end?idOrder=${data.data.orderId}&method_pay=oxxo&expired=${data.data.next_action.oxxo_display_details.expires_after}`
              );
              setDataCart([]);
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            },
            onConfirm: () => {
              onRouterLink(
                `/pay-end?idOrder=${data.data.orderId}&method_pay=oxxo&expired=${data.data.next_action.oxxo_display_details.expires_after}`
              );
              setDataCart([]);
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            },
          });
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
            amount: totalPagar,
            optionEnvio: progressPay.optionSend.name,
            idAddress: progressPay.optionSend.address,
            dataProduct: dataCart,
            requiredFactura: selectedFactura,
          },
          "/stripe/paymentWithCard"
        );

        if (resp.status == 200) {
          const data = await resp.data;
          setLoadingCreateOrder(true);

          try {
            const respRegisterSales = await requestPost(
              {
                dataCart,
                idOrder: data.data.orderId,
                total: totalPagar,
              },
              "/sales/registerSales"
            );
            setLoadingCreateOrder(false);

            if (respRegisterSales.status == 200) {
              // localStorage.removeItem("progressPay");

              setDataCart([]);
              const data = await resp.data;
              setDataModal({
                isOpen: true,
                type: "success",
                title: "Correcto",
                message: "Orden generada correctamente",
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
    } else if (
      progressPay.methodPay.typeMethod == "efectivo_al_recoger" ||
      progressPay.methodPay.typeMethod == "tarjeta_al_recoger"
    ) {
      try {
        setLoadingCreateOrder(true);

        try {
          const respRegisterSales = await requestPostPagos(
            {
              dataCart,
              amount: totalPagar,
              methodPay: progressPay.methodPay.typeMethod,
              userId: localStorage.getItem("idUser"),
            },
            "/stripe/paymentInSucursal"
          );
          setLoadingCreateOrder(false);

          if (respRegisterSales.status == 200) {
            // localStorage.removeItem("progressPay");

            setDataCart([]);
            const data = await respRegisterSales.data;
            setDataModal({
              isOpen: true,
              type: "success",
              title: "Correcto",
              message: "Orden generada correctamente",
              onClose: () => {
                onRouterLink(
                  `/pay-end?idOrder=${data.data.orderId}&method_pay=efectivo_al_recoger`
                );
                setDataCart([]);
                setDataModal((prev) => ({ ...prev, isOpen: false }));
              },
              onConfirm: () => {
                onRouterLink(
                  `/pay-end?idOrder=${data.data.orderId}&method_pay=efectivo_al_recoger`
                );
                setDataCart([]);
                setDataModal((prev) => ({ ...prev, isOpen: false }));
              },
            });
          }
        } catch (error) {
          setLoadingCreateOrder(false);
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
    } else if (progressPay.methodPay.typeMethod == "mercadopago") {
      try {
        setLoadingCreateOrder(true);

        const resp = await requestPostPagos(
          {
            dataProduct: dataCart,
            userId: Number(localStorage.getItem("idUser")),
            totalAmount: totalPagar,
            shipping_method: progressPay.optionSend.name,
            idAddress: progressPay.optionSend.address,
          },
          "/mercadopago/payMP"
        );
        setLoadingCreateOrder(false);

        if (resp.status == 200) {
          //Pruebas
          window.location.href = resp.data.sandbox_init_point;
        }
      } catch (error) {
        setLoadingCreateOrder(false);
      }
    } else if (progressPay.methodPay.typeMethod == "openpay") {
      try {
        setLoadingCreateOrder(true);
        const resp = await requestPostPagos(
          {
            userId: Number(localStorage.getItem("idUser")),
            amount:
              dataCart && dataCart.length > 0
                ? totalPagar <= 1000
                  ? totalPagar
                  : totalPagar +
                    (progressPay?.optionSend?.costo
                      ? Number(progressPay?.optionSend?.costo)
                      : 0)
                : null,
            optionEnvio:
              dataCart && dataCart.length > 0
                ? totalPagar <= 1000
                  ? "sucursal"
                  : progressPay.optionSend.name
                : null,
            idAddress:
              dataCart && dataCart.length > 0
                ? totalPagar <= 1000
                  ? 0
                  : progressPay.optionSend.address
                : null,
            dataProduct: dataCart,
            requiredFactura: selectedFactura,
          },
          "/openpay/generateLinkOpenPay"
        );
        if (resp.status == 200) {
          const data = resp.data;
          location.href = data.data.data.checkout_link;
          // setLoadingCreateOrder(false);
        }
      } catch (error) {
        setLoadingCreateOrder(false);
      }
    }
  };

  const handleSelectedFactura = async (
    event: React.SyntheticEvent,
    checked: boolean
  ) => {
    setSelectedFactura(checked);

    if (billingData) {
      return;
    }

    if (checked == true) {
      try {
        const resp = await requestGet("/billing/getBillingByUser");
        if (resp.status == 200) {
          const data = resp.data;

          if (data.data.data == null) {
            setDataModal({
              isOpen: true,
              showActions: false,
              message: <FormFactura />,
              title: "Registro de facturación",
              type: "info",
              onClose: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false }));
                setSelectedFactura(false);
              },
              onConfirm: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false }));
              },
            });
          } else {
            setBillingData(data.data.data);
          }
        }
      } catch (error) {}
    }
  };

  return {
    loadingCreateOrder,
    columns,
    rows,
    totalPrice,
    totalIVA,
    totalPagar,
    selectedFactura,
    handleCreateOrder,
    handleSelectedFactura,
  };
};

export default useResumen;
