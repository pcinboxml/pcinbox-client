"use client";

import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import useStorage from "../services/useStorage";

// Función auxiliar para limpiar la lógica de nombres de sucursal
const getBranchDisplayName = (branch: any) => {
  if (!branch || !branch.branches) return "PCinBOX-León"; // Valor por defecto

  const { name, providerId } = branch.branches;

  if (providerId === 3) {
    switch (name) {
      case "santafe":
        return "PCinBOX-SFD";
      case "leon2":
        return "PCinBOX-León";
      case "dicoags2":
        return "PCinBOX-AG2D";
      case "Arboledas":
        return "PCinBOX-AGD";
      default:
        return name;
    }
  }

  if (providerId === 2) {
    switch (name) {
      case "GDL":
        return "PCinBOX-GDL";
      case "CDMX":
        return "PCinBOX-CDMX";
      default:
        return name;
    }
  }

  return name; // Valor por defecto final
};

const GridResumen = ({ isSmallScreen }: { isSmallScreen: boolean }) => {
  const { formatCurrency } = useService();
  // El hook useStorage no se usaba en la lógica final, se puede omitir si no es necesario.
  // const { checkoutMode } = useStorage();
  // const { buyNowProduct, dataCart } = useTheContext();
  const { productsToShow } = useService();

  // const productsToShow =
  //   checkoutMode === "buy_now" && buyNowProduct != null
  //     ? [buyNowProduct]
  //     : dataCart;

  const rows = productsToShow
    ? productsToShow.map((itemCart) => ({
        id: itemCart.idProduct,
        products: `${itemCart.name} ${itemCart.description}`,
        quantity: Number(itemCart.quantity),
        sucursal: itemCart.product_stock,
        storeId: Number(itemCart?.storeId),
        // 'price' ahora es el precio total por línea de producto (precio unitario * cantidad)
        price: Number(itemCart.price) * Number(itemCart.quantity),
      }))
    : [];

  const columns = [
    {
      field: "quantity",
      headerName: "Cantidad",
      flex: isSmallScreen ? undefined : 0.5,
      minWidth: 150,
      renderCell: (params: any) => (
        <div className="flex justify-center items-center min-h-[100%] p-1">
          <span className="text-center text-sm md:text-base font-semibold text-[#808080]">
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "products",
      headerName: "Productos",
      flex: 2,
      minWidth: 180,
      renderCell: (params: any) => (
        <div className="flex justify-center items-center min-h-[100%] p-1">
          <span
            className="break-words whitespace-normal text-sm md:text-base text-[#808080]"
            title={params.value} // Tooltip para ver el nombre completo
          >
            {params?.value?.length > 150
              ? `${params.value.slice(0, 150)}...`
              : params.value}
          </span>
        </div>
      ),
    },
    {
      field: "sucursal",
      headerName: "Sucursal",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => {
        const { sucursal, storeId } = params.row;
        let displayBranch = "PCinBOX-León"; // Valor por defecto

        if (Array.isArray(sucursal) && sucursal.length > 0) {
          const foundBranch = sucursal.find((b: any) => b.branchId === storeId);
          if (foundBranch) {
            displayBranch = getBranchDisplayName(foundBranch);
          }
        }

        return (
          <div className="flex justify-center items-center min-h-[100%]">
            <span
              className="text-[#808080] block text-center"
              style={{ fontSize: "18px", fontWeight: "600" }}
            >
              {displayBranch}
            </span>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "Precio Total",
      flex: 1,
      minWidth: 150,
      renderCell: (params: any) => (
        <div className="flex justify-center items-center min-h-[100%] p-1">
          <span className="text-center text-sm md:text-base font-semibold text-[#808080]">
            {formatCurrency(Number(params.value))}
          </span>
        </div>
      ),
    },
  ];

  // --- Corrección de la lógica de cálculo ---

  // 1. Subtotal: Suma de los precios totales de cada línea (ya incluye cantidad)
  const subtotal = rows.reduce((sum, row) => sum + row.price, 0);

  // 2. IVA total (16% del subtotal)
  //const totalIVA = subtotal * 0.16;

  // 3. Total a pagar (subtotal + IVA)
  //const totalPagar = subtotal + totalIVA;
  const totalPagar = subtotal;

  return {
    rows,
    columns,
    subtotal, // Se devuelve el subtotal corregido
    //totalIVA,
    totalPagar, // Se devuelve el total corregido
  };
};

export default GridResumen;
