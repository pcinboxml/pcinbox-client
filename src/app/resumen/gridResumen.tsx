"use client";

import ProductI from "../interfaces/products/product.interface";
import useService from "../services/useService";

const GridResumen = ({
  dataCart,
  isSmallScreen,
}: {
  dataCart: ProductI[];
  isSmallScreen: boolean;
}) => {
  const { formatCurrency } = useService();

  const rows = dataCart.map((itemCart) => ({
    id: itemCart.idProduct,
    products: `${itemCart.name} ${itemCart.description}`,
    quantity: Number(itemCart.quantity),
    sucursal: "Leon",
    price: Number(itemCart.price) * Number(itemCart.quantity),
    // import: Number(itemCart.price) * Number(itemCart.quantity) * 1.16,
  }));

  const columns = [
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
      field: "products",
      headerName: "Productos",
      // flex: isSmallScreen ? undefined : 1,
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
      field: "sucursal",
      headerName: "Sucursal",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 100 : undefined,
      renderCell: (params: any) => {
        if (params.value) {
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
    {
      field: "price",
      headerName: "Precio",
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

    // {
    //   field: "import",
    //   headerName: "Importe",
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
  ];

  const subtotal = rows.reduce((sum, row) => sum + row.price * row.quantity, 0);

  // Calcular IVA total (16% del subtotal)
  const totalIVA = subtotal * 0.16;

  // Calcular total a pagar (ya incluye IVA)
  const totalPagar = rows.reduce((sum, row) => sum + row.price, 0);

  return {
    rows,
    columns,
    totalIVA,
    totalPagar,
  };
};

export default GridResumen;
