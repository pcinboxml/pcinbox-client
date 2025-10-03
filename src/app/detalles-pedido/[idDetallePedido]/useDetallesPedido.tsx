"use client";

import useService from "../../services/useService";
import { useTheContext } from "@/app/services/globalContext";
import { useMemo, useState, useEffect } from "react";

const useDetallesPedido = () => {
  const { formatCurrency } = useService();

  const { dataCart } = useTheContext();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
    img: item.imageUrl,
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
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <img
                src={params.value}
                alt="User"
                width={50}
                height={50}
                className="mx-auto my-2"
              />
            </div>
          );
        }
      },
    },
    {
      field: "description",
      headerName: "Descripción",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 350 : undefined,
      renderCell: (params: any) => {
        if (params) {
          return (
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                title={params.value}
                className="inline-block text-center text-sm leading-snug w-full text-[#808080]"
                style={{
                  display: "inline-block",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {params?.value?.length > 150
                  ? `${params.value.slice(0, 150)}...`
                  : params.value}
              </span>
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
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                className="text-[#808080] block text-center"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {params.value}
              </span>
            </div>
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
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                className="text-[#808080] block text-center"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {params.value}
              </span>
            </div>
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
            <div className="flex justify-center items-center min-h-[100%] p-1">
              <span
                className="text-[#808080] block text-center"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                {params.value}
              </span>
            </div>
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
