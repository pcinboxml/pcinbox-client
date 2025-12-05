"use client";

import { ChangeEvent, useEffect, useState } from "react";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import { GroupByIdI } from "../interfaces/compras/historyCompras.interface";

const useHistorialDeCompras = () => {
  const [dataFilter, setDataFilter] = useState({
    status: "allState",
    startDate: "",
    endDate: "",
    searchProduct: "",
  });
  const { requestPost } = useService();
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

  useEffect(() => {
    initDataHistory();
  }, []);

  useEffect(() => {
    const result = dataHistoryComprasCopy.filter((item) => {
      // Si status es "allState", no filtramos por estado
      const statusMatch =
        dataFilter.status && dataFilter.status !== "allState"
          ? item.statusEnvio === dataFilter.status
          : true;

      const dateMatch =
        dataFilter.startDate && dataFilter.endDate
          ? (() => {
              const itemDate = new Date(item.createdAt);

              const start = new Date(dataFilter.startDate);
              const end = new Date(dataFilter.endDate);

              // Normaliza las fechas para comparar solo por día
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              itemDate.setHours(0, 0, 0, 0);

              return itemDate >= start && itemDate <= end;
            })()
          : true;

      const searchTextMatch = dataFilter.searchProduct
        ? item.products.some((p) =>
            p.name
              .toLowerCase()
              .includes(dataFilter.searchProduct.toLowerCase())
          )
        : true;

      return statusMatch && dateMatch && searchTextMatch;
    });

    setDataHistoryCompras(result);
  }, [dataFilter, dataHistoryComprasCopy]);

  const initDataHistory = async () => {
    try {
      const resp = await requestPost(
        {
          userId: localStorage.getItem("idUser"),
          status: "allState",
        },
        "/sales/filterSales"
      );

      if (resp.status == 200) {
        const data = await resp.data;
        setDataHistoryCompras(groupById(data.data.data));
        setDataHistoryComprasCopy(groupById(data.data.data));
      }
    } catch (error) {}
  };

  // const handleOnFilter = async (
  //   event: ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const { value } = event.target;

  // if (dataHistoryComprasCopy.length > 0) {
  //   // console.log(dataHistoryComprasCopy);
  //   // console.log(value);
  //   if (value) {
  //     if (value != "allState") {
  //       let result = dataHistoryComprasCopy.filter(
  //         (item) => item.statusEnvio == value
  //       );
  //       setDataHistoryCompras(result.length > 0 ? result : []);
  //     }
  //     return;
  //   } else {
  //     // Si borras la fecha del input, restablece todos los datos
  //     setDataHistoryCompras(dataHistoryComprasCopy);
  //   }
  // }

  //};

  const handleHistoryByUser = async () => {
    try {
      const resp = await requestPost(
        {
          userId: localStorage.getItem("idUser"),
          status: "allState",
        },
        "/sales/filterSales"
      );

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
      title: "Cancelar compra",

      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: async () => {
        // setDataModal((prev) => ({ ...prev, isOpen: false }));
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
        },
        "/openpay/cancelledPaymantOpenPay"
      );
      setLoadingCancelledCompra(false);
      if (resp.status == 200) {
        const data = resp.data;

        setDataHistoryCompras(groupById(data.data.data));

        setDataModal({
          isOpen: true,
          type: "success",
          message: `Compra ${historyCompra.idOrder} cancelada correctamente.`,
          title: "Compra cancelada",

          onConfirm: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },
          onClose: () => {
            setDataModal((prev) => ({
              ...prev,
              isOpen: false,
            }));
          },
        });
      }
    } catch (error) {
      setLoadingCancelledCompra(false);
      //setDataHistoryCompras([]);
    }
  };

  const handleOnSearch = (product: string) => {
    // if (product.trim().length > 0) {
    //   const results = dataHistoryComprasCopy
    //     .map((item): GroupByIdI | null => {
    //       const matchedProducts = item.products.filter((p) => {
    //         return (
    //           p.name.toLowerCase().includes(product.toLowerCase()) ||
    //           p.description.toLowerCase().includes(product.toLowerCase())
    //         );
    //       });
    //       if (matchedProducts.length > 0) {
    //         return { ...item, products: matchedProducts };
    //       }
    //       return null;
    //     })
    //     .filter((item): item is GroupByIdI => item !== null);
    //   if (results.length === 0) {
    //     setDataHistoryCompras(dataHistoryComprasCopy);
    //   } else {
    //     setDataHistoryCompras(results);
    //   }
    // } else {
    //   setDataHistoryCompras(dataHistoryComprasCopy);
    // }
  };

  // const handleOnPeriodo = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = event.target;

  //   if (value) {
  //     const result = dataHistoryComprasCopy.filter((item) => {
  //       const itemDate = new Date(item.createdAt);

  //       const itemDateString = `${itemDate.getFullYear()}-${String(
  //         itemDate.getMonth() + 1
  //       ).padStart(2, "0")}-${String(itemDate.getDate()).padStart(2, "0")}`;

  //       return itemDateString === value; // value ya viene en formato YYYY-MM-DD
  //     });

  //     setDataHistoryCompras(result); // si no hay coincidencias, queda vacío
  //   } else {
  //     // Si borras la fecha del input, restablece todos los datos
  //     setDataHistoryCompras(dataHistoryComprasCopy);
  //   }
  // };

  return {
    dataHistoryCompras,
    loadingCancelledCompra,
    showModal,
    // handleOnPeriodo,
    handleHistoryByUser,
    setDataFilter,
    dataFilter,
    // handleOnSelectStatus,
    // handleOnFilter,
    handleOnSearch,
    setDataHistoryCompras,
  };
};

export default useHistorialDeCompras;
