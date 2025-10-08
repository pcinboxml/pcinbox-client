"use client";

import { useState } from "react";
import useService from "../services/useService";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { useTheContext } from "../services/globalContext";

const useMisCompras = () => {
  const { requestGet } = useService();
  const { requestPostPagos } = usePasarelaDePagos();
  const { setDataModal } = useTheContext();

  const [loadingCancelledCompra, setLoadingCancelledCompra] =
    useState<boolean>(false);

  const [dataHistoryCompras, setDataHistoryCompras] = useState<
    {
      createdAt: string;
      description: string;
      idOrder: number;
      image_url: string[];
      name: string;
      pay_method: string;
      price: string;
      quantity: number;
      totalAmount: string;
      totalSales: number;
      userId: number;
      stripePaymentIntentId: string;
      status: any;
    }[]
  >([]);

  const handleMisCompras = async () => {
    try {
      const resp = await requestGet("/sales/historySalesByUser");

      if (resp.status == 200) {
        const data = await resp.data;
        setDataHistoryCompras(data.data.data);
      }
    } catch (error) {
      setDataHistoryCompras([]);
    }
  };

  const handleCancelledCompra = async (
    idOrder: any,
    stripePaymentIntentId: any
  ) => {
    try {
      setLoadingCancelledCompra(true);

      const response = await requestPostPagos(
        {
          paymentIntentId: stripePaymentIntentId,
          orderId: idOrder,
        },
        "/stripe/refundPayment"
      );

      if (response.status == 200) {
        const data = response.data;

        setLoadingCancelledCompra(false);
        setDataHistoryCompras(data.data.data);

        setDataModal({
          isOpen: true,
          message: "Reembolso procesado exitosamente.",
          title: "Correcto",
          type: "success",
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
            window.location.reload();
          },
          onClose: () => {
            window.location.reload();
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error) {
      setLoadingCancelledCompra(false);
    }
  };

  const handleCancelledCompraInSucursal = async (idOrder: any) => {
    try {
      setLoadingCancelledCompra(true);

      const response = await requestPostPagos(
        {
          idUser: localStorage.getItem("idUser"),
          idOrder: idOrder,
        },
        "/stripe/cancelledCompraInSucursal"
      );

      if (response.status == 200) {
        const data = response.data;
        setDataHistoryCompras(data.data.data);
        setLoadingCancelledCompra(false);

        setDataModal({
          isOpen: true,
          message: "Pedido cancelado exitosamente.",
          title: "Correcto",
          type: "success",
          onConfirm: () => {
            window.location.reload();
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onClose: () => {
            window.location.reload();
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error) {
      setLoadingCancelledCompra(false);
    }
  };

  return {
    dataHistoryCompras,
    loadingCancelledCompra,
    handleCancelledCompra,
    handleMisCompras,
    handleCancelledCompraInSucursal,
  };
};

export default useMisCompras;
