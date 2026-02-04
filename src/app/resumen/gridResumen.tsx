"use client";

import ProductI from "../interfaces/products/product.interface";
import useService from "../services/useService";
import useStorage from "../services/useStorage";

const GridResumen = ({
  dataCart,
  isSmallScreen,
}: {
  dataCart: ProductI[];
  isSmallScreen: boolean;
}) => {
  const { formatCurrency } = useService();
  const { dataCartStorege } = useStorage();

  // const items =
  //   dataCartStorege && dataCartStorege?.length > 0 ? dataCartStorege : dataCart;

  const rows = dataCart.map((itemCart) => ({
    id: itemCart.idProduct,
    products: `${itemCart.name} ${itemCart.description}`,
    quantity: Number(itemCart.quantity),
    sucursal: itemCart.product_stock,
    storeId: Number(itemCart?.storeId),
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
        if (params.value && Array.isArray(params?.value)) {
          return (
            <div className="flex justify-center items-center min-h-[100%]">
              {(() => {
                return (
                  <span
                    className="text-[#808080] block text-center"
                    style={{ fontSize: "18px", fontWeight: "600" }}
                  >
                    {(() => {
                      if (Array.isArray(params.value)) {
                        let branchesProvider3 = params.value.filter(
                          (vf: any) => vf.branches.providerId === 3,
                        );

                        if (branchesProvider3.length > 0) {
                          let findSucursal = branchesProvider3?.find(
                            (fb: any) => fb?.branchId === params.row.storeId,
                          );

                          if (findSucursal) {
                            switch (findSucursal?.branches?.name) {
                              case "santafe":
                                return "PCinBOX-SFD";
                              case "leon":
                                return "PCinBOX-León";
                              case "dicoags2":
                                return "PCinBOX-AG2D";
                              case "Arboledas":
                                return "PCinBOX-AGD";
                              default:
                                return findSucursal?.branches?.name;
                            }
                          } else {
                            return "PCinBOX-León";
                          }
                        } else {
                          return "PCinBOX-León";
                        }
                      } else {
                        return "PCinBOX-León";
                      }
                    })()}
                  </span>
                );
              })()}
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
