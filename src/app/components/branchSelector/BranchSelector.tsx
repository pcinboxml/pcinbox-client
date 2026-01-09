"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import Table from "../table/Table";
import GridBranchSelector from "./gridBranchSelector";
import { Alert } from "@mui/material";
import { useMemo } from "react";
import useService from "@/app/services/useService";
import { MdAutorenew, MdShoppingCart } from "react-icons/md";

const BranchSelector = ({ productSelected }: { productSelected: ProductI }) => {
  const {
    handleAddProductCart,
    loadingByBranch,
    handleChangeQuantity,
    quantities,
  } = GridBranchSelector();
  const { formatCurrency } = useService();

  const branches = useMemo(() => {
    return productSelected.product_stock?.map((prodStock) => ({
      ...prodStock,
      id: prodStock.idProductStock,
      name: prodStock.branches?.name,
      price: productSelected.price,
      stock: prodStock.stock,
      action: 1,
    }));
  }, [productSelected]);

  return (
    <div>
      {branches && branches.length > 0 ? (
        <div>
          <span className="block text-white text-[18px] text-center bg-[#bb3d4b] py-2 px-3 rounded">
            Selecciona la sucursal que atenderá tu pedido:
          </span>
          <span className="text-[16px] text-[#606060] block text-center mt-4">
            {productSelected.name || productSelected.description}
          </span>

          <div className="mt-2 p-2">
            <table style={{ width: "750px", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      borderBottom: "2px solid #dee2e6",
                      color: "#495057",
                      fontWeight: 600,
                    }}
                  >
                    Sucursal
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      borderBottom: "2px solid #dee2e6",
                      color: "#495057",
                      fontWeight: 600,
                    }}
                  >
                    Existencia (Stock)
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      borderBottom: "2px solid #dee2e6",
                      color: "#495057",
                      fontWeight: 600,
                    }}
                  >
                    Precio
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                      color: "#495057",
                      fontWeight: 600,
                    }}
                  ></th>
                </tr>
              </thead>
              <tbody>
                {branches
                  .filter((branch) => {
                    if (Number(productSelected?.providerId) == 3) {
                      const name = branch?.branches?.name?.toLowerCase();
                      return (
                        branch?.branches?.providerId === 3 &&
                        ["leon", "gdl", "santafe", "arboledas"].includes(name!)
                      );
                    } else {
                      return branch;
                    }
                  })
                  .map((sucursal, indexBranches: number) => (
                    <tr
                      key={sucursal.id + indexBranches}
                      style={{ borderBottom: "1px solid #e9ecef" }}
                    >
                      <td
                        style={{
                          padding: "12px",
                          color: "#495057",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          {`PC-${sucursal.name}`}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "black",
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          {sucursal.stock}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          color: "#4a5568",
                          fontSize: "16px",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          {formatCurrency(Number(sucursal?.price))}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <input
                            type="number"
                            min="1"
                            max={sucursal.stock}
                            value={quantities[sucursal.id] ?? ""}
                            onChange={(e) =>
                              handleChangeQuantity(sucursal.id, e.target.value)
                            }
                            disabled={sucursal.stock === 0}
                            style={{
                              width: "60px",
                              padding: "8px",
                              border: "2px solid #dee2e6",
                              borderRadius: "4px",
                              textAlign: "center",
                              opacity: sucursal.stock === 0 ? 0.5 : 1,
                            }}
                          />
                          <button
                            onClick={() => {
                              if (quantities[sucursal.id] != "") {
                                if (
                                  Number(quantities[sucursal.id]) >
                                  sucursal?.stock
                                ) {
                                  return;
                                } else {
                                  handleAddProductCart(
                                    productSelected,
                                    Number(quantities[sucursal.id]),
                                    productSelected?.price,
                                    sucursal
                                  );
                                }
                              }
                            }}
                            disabled={
                              sucursal.stock === 0 ||
                              loadingByBranch[sucursal.id]
                            }
                            style={{
                              backgroundColor:
                                sucursal.stock === 0 ? "#6c757d" : "#bb3d4b",
                              color: "white",
                              border: "none",
                              padding: "10px 20px",
                              borderRadius: "4px",
                              cursor:
                                sucursal.stock === 0
                                  ? "not-allowed"
                                  : "pointer",
                              fontWeight: 600,
                              opacity: sucursal.stock === 0 ? 0.6 : 1,
                            }}
                          >
                            {/* <MdShoppingCart size={20} color="white" /> */}
                            {loadingByBranch[sucursal.id] ? (
                              <MdAutorenew
                                size={20}
                                className="m-auto the-spinner"
                              />
                            ) : (
                              <MdShoppingCart size={20} color="white" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Alert severity="info">No hay contenido disponible</Alert>
      )}
    </div>
  );
};

export default BranchSelector;
