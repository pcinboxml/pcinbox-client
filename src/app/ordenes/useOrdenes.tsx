"use client";

import { useMemo, useEffect, useState } from "react";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";

const useOrdenes = () => {
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

  const rows = dataCart.map((itemCart) => {
    return {
      id: itemCart.idProduct,
      img:
        (itemCart as any).image_url ||
        (itemCart.imageUrl &&
          Array.isArray((itemCart as any).image_url || itemCart.imageUrl) &&
          itemCart.imageUrl.length > 0)
          ? (itemCart as any).image_url[0] || itemCart.imageUrl[0]
          : (itemCart as any).image_url || itemCart.imageUrl,
      description: itemCart.description,
      quantity: Number(itemCart.quantity),
      unitPrice: Number(itemCart.price),
      totalPrice: Number(itemCart.quantity) * Number(itemCart.price),
    };
  });

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
              <img src={params.value} alt="User" width={50} height={50} />
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
            <div className="flex justify-center items-center min-h-[100%] p-1">
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
                {formatCurrency(params.value)}
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
                {formatCurrency(params.value)}
              </span>
            </div>
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
