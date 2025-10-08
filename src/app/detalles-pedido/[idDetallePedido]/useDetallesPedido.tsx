"use client";

import useService from "../../services/useService";
import { useState, useEffect } from "react";

const useDetallesPedido = () => {
  const { formatCurrency, requestPost } = useService();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [rows, setRows] = useState([]);

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
                {formatCurrency(Number(params.value))}
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
                {formatCurrency(Number(params.value))}
              </span>
            </div>
          );
        }
      },
    },
  ];

  const handleGetSalesByUser = async (idOrder: any) => {
    try {
      const resp = await requestPost(
        { idOrder: idOrder },
        "/sales/getSalesByUser"
      );
      if (resp.status == 200) {
        const data = resp.data;

        let dataRow = data.data.data.map((item: any) => {
          return {
            id: item.idOrder,
            img: item.image_url,
            description: item.description,
            quantity: Number(item.quantity),
            unitPrice: Number(item.price),
            totalPrice: Number(item.totalAmount),
          };
        });

        setRows(dataRow);
      }
    } catch (error) {
      setRows([]);
    }
  };
  return {
    columns,
    rows,
    handleGetSalesByUser,
  };
};

export default useDetallesPedido;
