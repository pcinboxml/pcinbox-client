"use client";

import { useMemo } from "react";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { useMediaQuery } from "@mui/material";

const useOrdenes = () => {
  const { formatCurrency } = useService();
  const { dataCart } = useTheContext();
  const isSmallScreen = useMediaQuery("(max-width: 1550px)");

  const subTotal = useMemo(() => {
    const total = dataCart
      ? dataCart
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  const rows = dataCart.map((itemCart) => ({
    id: itemCart.idProduct,
    img: itemCart.image_url,
    description: itemCart.description,
    quantity: Number(itemCart.quantity),
    unitPrice: Number(itemCart.price),
    totalPrice: Number(itemCart.quantity) * Number(itemCart.price),
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
    rows,
    columns,
    subTotal,
  };
};

export default useOrdenes;
