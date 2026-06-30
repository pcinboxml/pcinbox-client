"use client";

import { useMediaQuery } from "@mui/material";
import { useTheContext } from "../services/globalContext";
import GridResumen from "./gridResumen";
import { useEffect, useMemo, useState } from "react";
import useService from "../services/useService";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import FormFactura from "../components/formFactura/FormFactura";
import useCheckoutDraft from "../hooks/useCheckoutDraft";

const useResumen = () => {
  const [loadingCreateOrder, setLoadingCreateOrder] = useState<boolean>(false);
  const { setDataModal } = useTheContext();
  const [selectedFactura, setSelectedFactura] = useState<boolean>(false);
  const [billingData, setBillingData] = useState(null);

  const isSmallScreen = useMediaQuery("(max-width: 1250px)", {
    noSsr: true,
  });

  const { requestGet, totalPrice, productsToShow } = useService();
  const { fetchSummary, summary, buildPaymentPayload } = useCheckoutDraft();
  const { requestPostPagos } = usePasarelaDePagos();

  const { columns, rows, totalPagar } = GridResumen({
    isSmallScreen,
  });

  const productsKey = useMemo(
    () =>
      productsToShow
        ?.map(
          (p) =>
            `${p.idProduct}:${p.quantity}:${p.storeId ?? ""}:${p.price ?? ""}`,
        )
        .join("|") ?? "",
    [productsToShow],
  );

  useEffect(() => {
    if (!productsKey || !productsToShow?.length) return;
    void fetchSummary(productsToShow);
    // Solo recargar cuando cambian los productos del checkout (productsKey).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsKey, fetchSummary]);

  const costoTotalEnvio = Number(summary?.shippingTotal) || 0;

  const { costoEnvio, costoSeguro } = useMemo(() => {
    if (!summary?.dataPurchase) {
      return { costoEnvio: 0, costoSeguro: 0 };
    }

    return Object.values(summary.dataPurchase).reduce(
      (acc, item) => ({
        costoEnvio:
          acc.costoEnvio + Number(item?.costoEnvioProductByZone ?? 0),
        costoSeguro: acc.costoSeguro + Number(item?.costoSeguroEnvio ?? 0),
      }),
      { costoEnvio: 0, costoSeguro: 0 },
    );
  }, [summary?.dataPurchase]);

  const handleCreateOrder = async () => {
    try {
      setLoadingCreateOrder(true);

      const payload = await buildPaymentPayload({
        requiredFactura: selectedFactura,
        products: productsToShow ?? undefined,
      });

      if (!payload) {
        setDataModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "No se pudo validar el checkout. Revisa entrega y pago.",
          showActions: true,
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
        return;
      }

      const payName = payload.pay?.name;
      const paymentBody = {
        userId: payload.userId,
        amount: payload.amount,
        dataPurchase: payload.dataPurchase,
        dataProduct: payload.dataProduct,
        requiredFactura: payload.requiredFactura,
      };

      if (payName === "mercadopago") {
        const resp = await requestPostPagos(
          paymentBody,
          "/mercadopago/preferencePago",
        );
        const initPoint =
          resp?.data?.data?.init_point ?? resp?.data?.init_point;

        if (resp?.status === 200 && initPoint) {
          window.location.href = initPoint;
          return;
        }
      } else if (payName === "openpay") {
        const resp = await requestPostPagos(
          paymentBody,
          "/openpay/generateLinkOpenPay",
        );
        const checkoutLink =
          resp?.data?.data?.data?.checkout_link ??
          resp?.data?.data?.checkout_link;

        if (resp?.status === 200 && checkoutLink) {
          window.location.href = checkoutLink;
          return;
        }
      } else {
        setDataModal({
          isOpen: true,
          type: "error",
          title: "Método de pago no disponible",
          message:
            payName === "tarjeta_debito_credito" ||
            payName === "transferencia" ||
            payName === "efectivo_al_recoger" ||
            payName === "tarjeta_al_recoger" ||
            payName === "efectivo"
              ? "Este método de pago no está habilitado en línea. Selecciona Mercado Pago u OpenPay."
              : "Selecciona un método de pago válido antes de confirmar la compra.",
          showActions: true,
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
        return;
      }

      setDataModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "No se pudo iniciar el pago. Intenta de nuevo.",
        showActions: true,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    } catch {
      // El interceptor ya muestra el modal de error.
    } finally {
      setLoadingCreateOrder(false);
    }
  };

  const handleSelectedFactura = async (
    event: React.SyntheticEvent,
    checked: boolean,
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
    totalPagar,
    selectedFactura,
    summary,
    costoTotalEnvio,
    costoEnvio,
    costoSeguro,
    handleCreateOrder,
    handleSelectedFactura,
  };
};

export default useResumen;
