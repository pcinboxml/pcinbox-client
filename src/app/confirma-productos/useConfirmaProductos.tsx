"use client";

import { MdAutorenew, MdDelete, MdRemove } from "react-icons/md";
import { useTheContext } from "../services/globalContext";
import { useMediaQuery } from "@mui/material";
import useService from "../services/useService";
import { useState } from "react";

const useConfirmaProductos = () => {
  const { dataCart, setDataCart, setDataModal } = useTheContext();
  const { requestPost, formatCurrency } = useService();
  const isSmallScreen = useMediaQuery("(max-width: 1250px)", {
    noSsr: true,
  });

  const [loadingClearCar, setLoadingClearCar] = useState<boolean>(false);
  const [loadingRemoveProduct, setLoadingRemoveProduct] =
    useState<boolean>(false);

  const handleRemoveProduct = async (idProduct: string) => {
    try {
      setLoadingRemoveProduct(true);

      const resp = await requestPost(
        {
          idProduct: idProduct,
        },
        "/cart/removeProduct"
      );
      setLoadingRemoveProduct(false);

      if (resp && resp.status == 200) {
        const removeProduct = dataCart.filter(
          (item) => item.idProduct != idProduct
        );
        setDataCart(removeProduct);
      }
    } catch (error) {
      setLoadingRemoveProduct(false);
    }
  };

  const rows = dataCart.map((itemCart) => ({
    id: itemCart.idProduct,
    products: `${itemCart.name} ${itemCart.description}`,
    quantity: Number(itemCart.quantity),
    sucursal: "León",
    totalSinIva: Number(itemCart.price) * Number(itemCart.quantity),
    totalConIva: Number(itemCart.price) * Number(itemCart.quantity) * 1.16,
    importConIva: Number(itemCart.price) * Number(itemCart.quantity) * 0.16,
    action: 1,
  }));

  const columns = [
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
    {
      field: "totalSinIva",
      headerName: "Precio sin IVA",
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
      field: "totalConIva",
      headerName: "Precio con IVA",
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
      field: "importConIva",
      headerName: "Importe con IVA",
      flex: isSmallScreen ? undefined : 1,
      width: isSmallScreen ? 170 : undefined,
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

  const handleShowModalVaciarCarrito = () => {
    setDataModal({
      isOpen: true,
      message: "¿Seguro que deseas vaciar el carrito de compras?",
      title: "Vaciar carrito",
      type: "info",
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: async () => {
        try {
          setLoadingClearCar(true);
          const resp = await requestPost(dataCart, "/cart/removeAllCart");
          setLoadingClearCar(false);

          if (resp.status == 200) {
            setDataCart([]);
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }
        } catch (error) {
          setLoadingClearCar(false);
        }
      },
    });
  };

  return {
    rows,
    columns,
    loadingClearCar,
    handleShowModalVaciarCarrito,
  };
};

export default useConfirmaProductos;
