"use client";

import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useMediaQuery } from "@mui/material";

const useMisPedidos = () => {
  const isSmallScreen = useMediaQuery("(max-width: 1550px)");

  const rows: GridRowsProp = [
    {
      id: 1,
      noDePedido: "000001",
      fecha: "29-08-2025 11:12:12",
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
    },
    {
      field: "fecha",
      headerName: "Fecha",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
    },
    {
      field: "total",
      headerName: "Total",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
    },
    {
      field: "methodPay",
      headerName: "Metodo de pago",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
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
