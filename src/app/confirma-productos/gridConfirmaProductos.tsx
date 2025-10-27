"use client";

import { GridColDef } from "@mui/x-data-grid";
import { MdAutorenew, MdDelete } from "react-icons/md";

const GridConfirmaProductos = ({
  isSmallScreen,
  formatCurrency,
  loadingRemoveProduct,
  handleRemoveProduct,
}: {
  isSmallScreen: boolean;
  formatCurrency: any;
  loadingRemoveProduct: boolean;
  handleRemoveProduct: any;
}) => {
  const columns: GridColDef[] = [
    {
      field: "products",
      headerName: "Productos",
      width: 350,
      renderCell: (params: any) => {
        if (params.value) {
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
      width: isSmallScreen ? 100 : 90,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center min-h-[100%]">
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
      field: "sucursal",
      headerName: "Sucursal",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 100 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center min-h-[100%]">
              <span
                className="text-[#666666] block text-center"
                style={{ fontSize: "18px", fontWeight: "500" }}
              >
                {params.value}
              </span>
            </div>
          );
        }
      },
    },
    // {
    //   field: "totalSinIva",
    //   headerName: "Precio sin IVA",

    //   flex: isSmallScreen ? undefined : 1,
    //   width: isSmallScreen ? 130 : undefined,
    //   renderCell: (params: any) => {
    //     if (params.value) {
    //       return (
    //         <div className="flex justify-center items-center min-h-[100%]">
    //           <span
    //             className="text-[#808080] block text-center"
    //             style={{ fontSize: "18px", fontWeight: "600" }}
    //           >
    //             {formatCurrency(Number(params.value))}
    //           </span>
    //         </div>
    //       );
    //     }
    //   },
    // },

    {
      field: "totalConIva",
      headerName: "Precio Unitario",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 130 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center min-h-[100%]">
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
      field: "total",
      headerName: "Precio Total",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 150 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
          return (
            <div className="flex justify-center items-center min-h-[100%]">
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
    // {
    //   field: "importConIva",
    //   headerName: "Importe con IVA",
    //   flex: isSmallScreen ? undefined : 1,
    //   width: isSmallScreen ? 170 : undefined,
    //   renderCell: (params: any) => {
    //     if (params.value) {
    //       return (
    //         <div className="flex justify-center items-center min-h-[100%]">
    //           <span
    //             className="text-[#808080] block text-center"
    //             style={{ fontSize: "18px", fontWeight: "600" }}
    //           >
    //             {formatCurrency(Number(params.value))}
    //           </span>
    //         </div>
    //       );
    //     }
    //   },
    // },
    {
      field: "action",
      headerName: "",
      width: 50,
      renderCell: (params: any) => {
        return (
          <div className="flex justify-center items-center min-h-[100%]">
            <button
              disabled={loadingRemoveProduct}
              onClick={() => handleRemoveProduct(params.id)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loadingRemoveProduct ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : (
                <MdDelete size={25} color="red" />
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return {
    columns,
  };
};

export default GridConfirmaProductos;
