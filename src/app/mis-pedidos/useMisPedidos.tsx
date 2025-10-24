"use client";

import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import useService from "../services/useService";
import { useEffect, useState } from "react";

interface PedidosI {
  idOrder: number;
  userId: number;
  totalSales: number;
  totalAmount: number;
  pay_method: string;
  createdAt: string;
}

const useMisPedidos = () => {
  const [dataPedidos, setDataPedidos] = useState<PedidosI[]>([]);
  const { formatCurrency, onRouterLink, requestGet } = useService();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    const match = window.matchMedia("(max-width: 1550px)");
    setIsSmallScreen(match.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    match.addEventListener("change", handler);

    return () => {
      match.removeEventListener("change", handler);
    };
  }, []);

  const columns: GridColDef[] = [
    {
      field: "noDePedido",
      headerName: "No. de pedido",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center min-h-[100%] p-1">
            <span
              className="text-[#808080] block text-center"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%] p-1">
            <span
              title={params.value}
              style={{ fontSize: "16px" }}
              className="text-center text-[#808080] whitespace-normal leading-snug break-words"
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%] p-1">
            <span
              className="text-[#808080] block text-center"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "total",
      headerName: "Total",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%] p-1">
            <span
              className="text-[#808080] block text-center"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              {formatCurrency(params.value)}
            </span>
          </div>
        );
      },
    },
    {
      field: "methodPay",
      headerName: "Metodo de pago",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%] p-1">
            <span
              title={params.value}
              style={{ fontSize: "16px" }}
              className="text-center text-[#808080] whitespace-normal leading-snug break-words"
            >
              {params.value == "tarjeta_de_debito" ||
              params.value == "tarjeta_de_credito"
                ? "Tarjeta"
                : params.value == "efectivo"
                ? "Efectivo"
                : params.value == "oxxo"
                ? "OXXO"
                : ""}
            </span>
          </div>
        );
      },
    },
    {
      field: "opciones",
      headerName: "Opciones",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,

      renderCell: (params) => {
        return (
          <div className="w-[100%] h-[100%] flex justify-center items-center p-1">
            <button
              onClick={() => onRouterLink(`/detalles-pedido/${params.id}`)}
              className="bg-[#BB3D4B] text-white font-bold text-center px-2 rounded h-[45px] flex justify-center items-center"
            >
              Detalles
            </button>
          </div>
        );
      },
    },
  ];

  const handleGetPedidosByUser = async () => {
    try {
      const resp = await requestGet("/sales/getPedidosByUser");
      if (resp.status == 200) {
        const data = await resp.data;
        setDataPedidos(data.data.data);

        let dataRows = data.data.data
          .filter((f: any) => f.status == "paid")
          .map((pedido: any) => ({
            id: pedido.idOrder,
            noDePedido: pedido.idOrder,
            fecha: new Date(pedido.createdAt).toLocaleString(),
            cantidad: pedido.totalSales,
            methodPay: pedido.pay_method,
            total: pedido.totalAmount,
            opciones: "",
          }));

        const uniqueRows: any = Array.from(
          new Map(dataRows.map((item: any) => [item.id, item])).values()
        );

        setRows(uniqueRows);
      }
    } catch (error) {
      setDataPedidos([]);
    }
  };

  return {
    rows,
    columns,
    dataPedidos,
    handleGetPedidosByUser,
  };
};

export default useMisPedidos;
