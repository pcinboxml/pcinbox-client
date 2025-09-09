"use client";

import { useMediaQuery } from "@mui/material";
import useService from "../../services/useService";
import { useTheContext } from "@/app/services/globalContext";
import { useMemo } from "react";

const useDetallesPedido = () => {
  const { formatCurrency } = useService();

  const isSmallScreen = useMediaQuery("(max-width: 1550px)");
  const { dataCart } = useTheContext();

  const subTotal = useMemo(() => {
    const total = dataCart
      ? dataCart
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  const rows = dataCart.map((item) => ({
    id: item.idProduct,
    img: item.image_url,
    description: item.description,
    quantity: Number(item.quantity),
    unitPrice: Number(item.price),
    totalPrice: Number(item.quantity) * Number(item.price),
  }));

  const columns = [
    {
      field: "img",
      headerName: "Imagen",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="pb-2 h-[80px]">
              <img
                src={params.value}
                alt="User"
                width={50}
                height={50}
                className="mx-auto my-2"
              />
            </div>
          );
        } else {
          return <span>{params.value}</span>;
        }
      },
    },
    {
      field: "description",
      headerName: "Descripción",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params) {
          return (
            <div className="h-[80px] w-full p-2 overflow-hidden">
              <p
                className="break-words text-[#808080] whitespace-normal text-sm leading-snug"
                title={params.value}
                style={{ fontSize: "15px" }}
              >
                {params.value && params.value.length > 50
                  ? `${params.value.slice(0, 50)}...`
                  : params.value}
              </p>
            </div>
          );
        }
      },
    },
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
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
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
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
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
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
    columns,
    rows,
    subTotal,
  };
};

export default useDetallesPedido;
