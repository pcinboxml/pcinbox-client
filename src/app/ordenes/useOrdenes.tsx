"use client";

import useService from "../services/useService";

const useOrdenes = () => {
  const { formatCurrency } = useService();

  const rows = [
    {
      id: 1,
      img: "/tarjeta_video.png",
      description: "the Community version",
      quantity: 1,
      unitPrice: 108,
      totalPrice: 108,
    },
    {
      id: 2,
      img: "/tarjeta_video.png",
      description: "the Pro version",
      quantity: 2,
      unitPrice: 200,
      totalPrice: 400,
    },
    {
      id: 3,
      img: "/tarjeta_video.png",
      description: "the Premium version",
      quantity: 4,
      unitPrice: 50,
      totalPrice: 200,
    },
  ];

  const columns = [
    {
      field: "img",
      headerName: "Imagen",
      width: 150,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <img
              src={params.value}
              alt="User"
              width={50}
              height={50}
              className="m-auto"
            />
          );
        } else {
          return <span>{params.value}</span>;
        }
      },
    },
    { field: "description", headerName: "Descripción", width: 200 },
    {
      field: "quantity",
      headerName: "Cantidad",
      width: 150,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <span
              className="text-[#808080] block text-center"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              {params.value}
            </span>
          );
        }
      },
    },
    {
      field: "unitPrice",
      headerName: "Precio Unitario",
      width: 150,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <span
              className="text-[#808080] block text-center"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              {formatCurrency(params.value)}
            </span>
          );
        }
      },
    },
    {
      field: "totalPrice",
      headerName: "Precio Total",
      width: 150,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <span
              className="text-[#808080] block text-center"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              {formatCurrency(params.value)}
            </span>
          );
        }
      },
    },
  ];

  return {
    rows,
    columns,
  };
};

export default useOrdenes;
