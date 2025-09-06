"use client";

import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useMediaQuery } from "@mui/material";

const useMisPedidos = () => {
  const isSmallScreen = useMediaQuery("(max-width: 1550px)");

  const rows: GridRowsProp = [
    {
      id: 1,
      noDePedido: "000001",
      fecha: new Date("2025-04-30T09:41:02Z").toLocaleString(),
      cantidad: 1,
      total: 123,
      methodPay: "Tarjeta de debito",
      opciones: "",
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "noDePedido",
      headerName: "No. de pedido",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%]">
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
      field: "fecha",
      headerName: "Fecha",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%]">
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
          <div className="flex justify-center items-center h-[100%]">
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
      field: "total",
      headerName: "Total",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%]">
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
      field: "methodPay",
      headerName: "Metodo de pago",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center h-[100%]">
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
      field: "opciones",
      headerName: "Opciones",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,

      renderCell: (params) => {
        return (
          <div className="w-[100%] h-[100%] flex justify-center items-center">
            <button className="bg-[#BB3D4B] text-white font-bold text-center px-2 rounded h-[45px] flex justify-center items-center">
              Detalles
            </button>
          </div>
        );
      },
    },
  ];

  return {
    rows,
    columns,
  };
};

export default useMisPedidos;
