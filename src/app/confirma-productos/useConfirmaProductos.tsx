"use client";

import { useTheContext } from "../services/globalContext";
import { useMediaQuery } from "@mui/material";

const useConfirmaProductos = () => {
  const { dataCart } = useTheContext();
  const isSmallScreen = useMediaQuery("(max-width: 1550px)", {
    noSsr: true,
  });

  const rows = dataCart.map((itemCart) => ({
    id: itemCart.idProduct,
    products: itemCart.description,
    quantity: Number(itemCart.quantity),
    sucursal: "Leon",
    totalSinIva: Number(itemCart.price),
    totalConIva: Number(itemCart.quantity) * Number(itemCart.price),
    importConIva: 1,
  }));

  const columns = [
    {
      field: "products",
      headerName: "Productos",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="pb-2 h-[80px]">
              <span>{params.value}</span>
            </div>
          );
        } else {
          return <span>{params.value}</span>;
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
            <div className="pb-2 h-[80px]">
              <span>{params.value}</span>
            </div>
          );
        } else {
          return <span>{params.value}</span>;
        }
      },
    },

    {
      field: "sucursal",
      headerName: "Sucursal",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="pb-2 h-[80px]">
              <span>Leon</span>
            </div>
          );
        } else {
          return <span>{params.value}</span>;
        }
      },
    },
    {
      field: "totalSinIva",
      headerName: "total sin IVA",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="pb-2 h-[80px]">
              <span>{params.value}</span>
            </div>
          );
        } else {
          return <span>{params.value}</span>;
        }
      },
    },

    {
      field: "totalConIva",
      headerName: "Total con IVA",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="pb-2 h-[80px]">
              <span>{params.value}</span>
            </div>
          );
        } else {
          return <span>{params.value}</span>;
        }
      },
    },
    {
      field: "importConIva",
      headerName: "Importe con IVA",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="pb-2 h-[80px]">
              <span>{params.value}</span>
            </div>
          );
        } else {
          return <span>{params.value}</span>;
        }
      },
    },
  ];

  return {
    rows,
    columns,
  };
};

export default useConfirmaProductos;
