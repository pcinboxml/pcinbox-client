"use client";

import { GridColDef, GridRowsProp } from "@mui/x-data-grid";

const useMisPedidos = () => {
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
      width: 150,
    },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 150,
    },
    {
      field: "cantidad",
      headerName: "Cantidad",
      width: 110,
    },
    {
      field: "total",
      headerName: "Total",
      width: 110,
    },
    {
      field: "methodPay",
      headerName: "Metodo de pago",
      width: 160,
    },
    {
      field: "opciones",
      headerName: "Opciones",
      width: 140,

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
