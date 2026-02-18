"use client";

import { GridColDef } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useState } from "react";
import { MdAutorenew, MdDelete } from "react-icons/md";
import useService from "../services/useService";

const GridConfirmaProductos = ({
  isSmallScreen,
  formatCurrency,
  loadingRemoveProduct,
  handleRemoveProduct,
  rowsConfirmProducts,
  setRowsConfirmProducts,
}: {
  isSmallScreen: boolean;
  formatCurrency: any;
  loadingRemoveProduct: boolean;
  handleRemoveProduct: any;
  rowsConfirmProducts: any[];
  setRowsConfirmProducts: Dispatch<SetStateAction<any[]>>;
}) => {
  const { requestPost } = useService();

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
        const handleChangeSucursal = async (newStoreId: number) => {
          try {
            const resp = await requestPost(
              { idProduct: params.row.id, storeId: newStoreId },
              "/cart/changeSucursal",
            );

            if (resp.status === 200) {
              //const data = resp.data;

              // ⚡ Actualiza solo la fila afectada
              setRowsConfirmProducts((prevRowsConfirmProducts) =>
                prevRowsConfirmProducts.map((row) =>
                  row.id === params.row.id
                    ? { ...row, storeId: Number(newStoreId) }
                    : row,
                ),
              );
            }
          } catch (error) {
            console.error("Error al actualizar sucursal:", error);
          }
        };

        if (
          params.value &&
          Array.isArray(params.value) &&
          params.value.length > 0
        ) {
          return (
            <div className="flex justify-center items-center min-h-[100%]">
              {(() => {
                // 1️⃣ Filtrar sucursales permitidas
                const sucursalesValidas = Array.isArray(params.value)
                  ? params.value.filter((sucursal: any) =>
                      ["leon2", "Arboledas", "santafe", "dicoags2"].includes(
                        sucursal?.branches?.name,
                      ),
                    )
                  : [];

                // 2️⃣ Verificar si el storeId actual existe en las opciones
                const storeIdValido = sucursalesValidas.some(
                  (sucursal: any) => sucursal.branchId === params.row.storeId,
                );

                // 3️⃣ Definir el value seguro del select
                const selectValue = storeIdValido
                  ? params.row.storeId.toString()
                  : sucursalesValidas[0]?.branchId?.toString() || "";

                // 4️⃣ Si no hay sucursales válidas, mostrar fallback
                if (sucursalesValidas.length === 0) {
                  return (
                    <span
                      className="text-[#808080] block text-center"
                      style={{ fontSize: "16px", fontWeight: "600" }}
                    >
                      Sin sucursal
                    </span>
                  );
                }

                return (
                  <select
                    className="form-select border-gray-300"
                    value={selectValue}
                    onChange={(e) =>
                      handleChangeSucursal(Number(e.target.value))
                    }
                  >
                    {sucursalesValidas.map((sucursal: any) => (
                      <option
                        key={sucursal.idProductStock}
                        value={sucursal.branchId}
                        disabled={sucursal.stock === 0}
                      >
                        {(() => {
                          switch (sucursal.branches.name) {
                            case "santafe":
                              return "PCinBOX-SFD";
                            case "leon2":
                              return "PCinBOX-León";
                            case "dicoags2":
                              return "PCinBOX-AG2D";
                            case "Arboledas":
                              return "PCinBOX-AGD";
                            default:
                              return sucursal.branches.name;
                          }
                        })()}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>
          );
        } else {
          return (
            <div className="flex justify-center items-center min-h-[100%]">
              <span
                className="text-[#808080] block text-center"
                style={{ fontSize: "18px", fontWeight: "600" }}
              >
                León
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
