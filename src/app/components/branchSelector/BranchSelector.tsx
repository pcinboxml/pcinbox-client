"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import GridBranchSelector from "./gridBranchSelector";
import { Alert } from "@mui/material";
import { useMemo } from "react";
import useService from "@/app/services/useService";
import { MdAutorenew, MdShoppingCart } from "react-icons/md";
import useStorage from "@/app/services/useStorage";

const BranchSelector = ({ productSelected }: { productSelected: ProductI }) => {
  const { handleWriteStorageProgressPay } = useStorage();
  const {
    handleAddProductCart,
    loadingByBranch,
    handleChangeQuantity,
    quantities,
    branchesDico,
  } = GridBranchSelector();
  const { formatCurrency } = useService();

  const branches = useMemo(() => {
    return productSelected.product_stock
      ?.filter((productStockFilter) => {
        if (
          Number(productStockFilter.branches?.providerId) ==
          Number(productSelected?.providerId)
        ) {
          return productStockFilter;
        }
      })
      .map((prodStock) => ({
        ...prodStock,
        id: prodStock.idProductStock,
        idBranche: prodStock?.branchId,
        name: prodStock.branches?.name,
        price: productSelected.price,
        stock: prodStock.stock,
        action: 1,
      }));
  }, [productSelected]);

  const getBranchDisplayName = (sucursal: any) => {
    if (sucursal?.branches?.providerId === 3) {
      switch (sucursal?.branches.name) {
        case "santafe":
          return "PCinBOX-SFD";
        case "leon2":
          return "PCinBOX-León";
        case "dicoags2":
          return "PCinBOX-AG2D";
        case "Arboledas":
          return "PCinBOX-AGD";
        default:
          return sucursal?.branches.name; // Bueno tener un default
      }
    } else if (sucursal?.branches?.providerId === 2) {
      return `PC-${sucursal?.name}`;
    }
    return sucursal?.name ?? "";
  };

  const filteredBranches = useMemo(() => {
    return (branches ?? []).filter((branch) => {
      if (Number(productSelected?.providerId) == 3) {
        const name = branch?.branches?.name;
        return (
          branch?.branches?.providerId === 3 &&
          ["leon2", "santafe"].includes(name!)
        );
      }
      return true;
    });
  }, [branches, productSelected]);

  const handleAddToCart = (sucursal: any) => {
    const quantity = Number(quantities[sucursal.id] ?? 1);
    const stock = Number(sucursal?.stock ?? 0);
    if (quantity <= 0 || stock <= 0 || quantity > stock) return;

    handleAddProductCart(
      productSelected,
      quantity,
      productSelected?.price,
      sucursal,
    );

    handleWriteStorageProgressPay({
      optionSend: {
        storeIdDico:
          sucursal?.branches?.providerId === 3
            ? branchesDico?.find((br) => br?.name == sucursal?.name!)?.idStore
            : 0,
      },
    });
  };

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
            {/* ── Desktop / Tablet landscape: tabla normal ── */}
            <table className="branch-table w-full border-collapse hidden sm:table">
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  {["Sucursal", "Existencia (Stock)", "Precio", ""].map(
                    (h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "12px",
                          textAlign: i === 3 ? "left" : "center",
                          borderBottom: "2px solid #dee2e6",
                          color: "#495057",
                          fontWeight: 600,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredBranches.map((sucursal, indexBranches) => (
                  <tr
                    key={sucursal.id + indexBranches}
                    style={{ borderBottom: "1px solid #e9ecef" }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        color: "#495057",
                        textAlign: "center",
                      }}
                    >
                      {getBranchDisplayName(sucursal)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "black",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      {sucursal.stock}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "#4a5568",
                        fontSize: "16px",
                        textAlign: "center",
                      }}
                    >
                      {formatCurrency(Number(sucursal?.price))}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <QuantityCartRow
                        sucursal={sucursal}
                        quantities={quantities}
                        loadingByBranch={loadingByBranch}
                        handleChangeQuantity={handleChangeQuantity}
                        onAddToCart={handleAddToCart}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ── Mobile: tarjetas apiladas ── */}
            <div className="sm:hidden flex flex-col gap-3 mt-2">
              {filteredBranches.map((sucursal, indexBranches) => (
                <div
                  key={sucursal.id + indexBranches}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "14px",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Nombre de sucursal */}
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: "#495057",
                      marginBottom: "8px",
                    }}
                  >
                    {getBranchDisplayName(sucursal)}
                  </p>

                  {/* Stock y precio en fila */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <div>
                      <span style={{ color: "#6c757d", fontSize: "14px" }}>
                        Stock:
                      </span>
                      <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                        {sucursal.stock}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#6c757d", fontSize: "14px" }}>
                        Precio:
                      </span>
                      <span style={{ fontWeight: "bold", marginLeft: "8px" }}>
                        {formatCurrency(Number(sucursal?.price))}
                      </span>
                    </div>
                  </div>

                  {/* Cantidad + botón agregar */}
                  <QuantityCartRow
                    sucursal={sucursal}
                    quantities={quantities}
                    loadingByBranch={loadingByBranch}
                    handleChangeQuantity={handleChangeQuantity}
                    onAddToCart={handleAddToCart}
                    fullWidth
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Alert severity="info">No hay contenido disponible</Alert>
      )}
    </div>
  );
};

/* ─── Subcomponente reutilizable para input cantidad + botón ─── */
interface QuantityCartRowProps {
  sucursal: any;
  quantities: Record<number, number | "">;
  loadingByBranch: Record<number, boolean>;
  handleChangeQuantity: (id: number, value: string) => void;
  onAddToCart: (sucursal: any) => void;
  fullWidth?: boolean;
}

const QuantityCartRow = ({
  sucursal,
  quantities,
  loadingByBranch,
  handleChangeQuantity,
  onAddToCart,
  fullWidth,
}: QuantityCartRowProps) => {
  const outOfStock = sucursal.stock === 0;
  const isLoading = loadingByBranch[sucursal.id];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="number"
        min="1"
        max={sucursal.stock}
        value={quantities[sucursal.id] ?? 1}
        onChange={(e) => handleChangeQuantity(sucursal.id, e.target.value)}
        disabled={outOfStock}
        style={{
          width: "64px",
          padding: "8px",
          border: "2px solid #dee2e6",
          borderRadius: "4px",
          textAlign: "center",
          opacity: outOfStock ? 0.5 : 1,
          flexShrink: 0,
        }}
      />
      <button
        onClick={() => onAddToCart(sucursal)}
        disabled={outOfStock || isLoading}
        style={{
          backgroundColor: outOfStock ? "#6c757d" : "#bb3d4b",
          color: "white",
          border: "none",
          padding: "10px 16px",
          borderRadius: "4px",
          cursor: outOfStock ? "not-allowed" : "pointer",
          fontWeight: 600,
          opacity: outOfStock ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          flex: fullWidth ? 1 : "initial",
          minHeight: "40px",
        }}
      >
        {isLoading ? (
          <MdAutorenew size={20} className="m-auto the-spinner" />
        ) : (
          <>
            <MdShoppingCart size={20} color="white" />
            {fullWidth && (
              <span style={{ fontSize: "14px" }}>
                {outOfStock ? "Sin stock" : "Agregar al carrito"}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
};

export default BranchSelector;
