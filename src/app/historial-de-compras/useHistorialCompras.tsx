"use client";

import { ChangeEvent, useState } from "react";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { GroupByIdI } from "../interfaces/compras/historyCompras.interface";

const useHistorialDeCompras = () => {
  const { requestGet, requestPost } = useService();
  const [loadingCancelledCompra, setLoadingCancelledCompra] =
    useState<boolean>(false);

  const { setDataModal } = useTheContext();

  const { requestPostPagos } = usePasarelaDePagos();
  const { groupById } = useService();

  const [dataHistoryCompras, setDataHistoryCompras] = useState<GroupByIdI[]>(
    []
  );
  const [dataHistoryComprasCopy, setDataHistoryComprasCopy] = useState<
    GroupByIdI[]
  >([]);

  const handleOnSelectStatus = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    try {
      const resp = await requestPost(
        {
          userId: localStorage.getItem("idUser"),
          status: value,
        },
        "/sales/filterSales"
      );

      if (resp.status == 200) {
        const data = await resp.data;
        setDataHistoryCompras(groupById(data.data.data));
      }
    } catch (error) {}
  };

  const handleHistoryByUser = async () => {
    try {
      const resp = await requestGet("/sales/historySalesByUser");

      if (resp.status == 200) {
        const data = await resp.data;
        setDataHistoryCompras(groupById(data.data.data));
        setDataHistoryComprasCopy(groupById(data.data.data));
      }
    } catch (error) {
      setDataHistoryCompras([]);
    }
  };

  const showModal = (historyCompra: GroupByIdI) => {
    setDataModal({
      isOpen: true,
      message: "¿Seguro que deseas cancelar la compra?",
      type: "info",
      title: "",
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: async () => {
        await handleCancelPedido(historyCompra);
      },
    });
  };

  const handleCancelPedido = async (historyCompra: GroupByIdI) => {
    try {
      setLoadingCancelledCompra(true);

      const resp = await requestPostPagos(
        {
          idOrder: historyCompra.idOrder,
          userId: Number(localStorage.getItem("idUser")),
          stripePaymentIntentId: historyCompra.stripePaymentIntentId,
        },
        "/stripe/cancelledCompra"
      );
      setLoadingCancelledCompra(false);
      if (resp.status == 200) {
        const data = await resp.data;
        setDataHistoryCompras(groupById(data.data.data));
        window.location.reload();
      }
    } catch (error) {
      setLoadingCancelledCompra(false);
      setDataHistoryCompras([]);
    }
  };

  const handleOnSearch = (product: string) => {
    if (product.trim().length > 0) {
      const results = dataHistoryComprasCopy
        .map((item): GroupByIdI | null => {
          const matchedProducts = item.products.filter((p) => {
            return (
              p.name.toLowerCase().includes(product.toLowerCase()) ||
              p.description.toLowerCase().includes(product.toLowerCase())
            );
          });

          if (matchedProducts.length > 0) {
            return { ...item, products: matchedProducts };
          }

          return null;
        })
        .filter((item): item is GroupByIdI => item !== null);

      if (results.length === 0) {
        setDataHistoryCompras(dataHistoryComprasCopy);
      } else {
        setDataHistoryCompras(results);
      }
    } else {
      setDataHistoryCompras(dataHistoryComprasCopy);
    }
  };

  const handleOnPeriodo = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value) {
      const result = dataHistoryComprasCopy.filter((item) => {
        let date = new Date(item.createdAt);
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, "0");

        let day = String(date.getDate()).padStart(2, "0");

        if (value == `${year}-${month}-${day}`) {
          return item;
        }
      });

      if (result.length > 0) {
        setDataHistoryCompras(result);
      } else {
        setDataHistoryCompras(dataHistoryComprasCopy);
      }
    }
    //
  };

  return {
    dataHistoryCompras,
    loadingCancelledCompra,
    showModal,
    handleOnPeriodo,
    handleHistoryByUser,
    handleOnSelectStatus,
    handleOnSearch,
    setDataHistoryCompras,
  };
};

export default useHistorialDeCompras;
