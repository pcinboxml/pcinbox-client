"use client";

import { useTheContext } from "../services/globalContext";
import { useMediaQuery } from "@mui/material";
import useService from "../services/useService";
import { useState } from "react";
import GridConfirmaProductos from "./gridConfirmaProductos";
import axios from "axios";

const useConfirmaProductos = () => {
  const { dataCart, setDataCart, setDataModal } = useTheContext();
  const { requestPost, formatCurrency } = useService();
  const isSmallScreen = useMediaQuery("(max-width: 1250px)", {
    noSsr: true,
  });

  const [loadingClearCar, setLoadingClearCar] = useState<boolean>(false);
  const [loadingRemoveProduct, setLoadingRemoveProduct] =
    useState<boolean>(false);
  const [loadingCotizacion, setLoadingCotizacion] = useState<boolean>(false);

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
  const { columns } = GridConfirmaProductos({
    isSmallScreen,
    formatCurrency,
    loadingRemoveProduct,
    handleRemoveProduct,
  });

  const rows = dataCart.map((itemCart) => ({
    id: itemCart.idProduct,
    products: `${itemCart.name} ${itemCart.description}`,
    quantity: Number(itemCart.quantity),
    sucursal: "León",
    // totalSinIva: Number(itemCart.price) * Number(itemCart.quantity),
    // totalConIva: Number(itemCart.price) * Number(itemCart.quantity) * 1.16, //antes
    totalConIva: Number(itemCart.price),
    total: Number(itemCart.price) * Number(itemCart.quantity),
    // importConIva: Number(itemCart.price) * Number(itemCart.quantity) * 0.16,
    action: 1,
  }));

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

          const resp = await requestPost({ dataCart }, "/cart/removeAllCart");
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

  const handleGenerateCotizacion = async () => {
    try {
      setLoadingCotizacion(true);

      const resp = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/generateCotizacion`,
        {
          dataCart,
          name: localStorage.getItem("name"),
          lastname: localStorage.getItem("lastname"),
          email: localStorage.getItem("email"),
        },
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (resp.status == 200) {
        const blob = new Blob([resp.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "cotizacion.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLoadingCotizacion(false);
        setDataModal({
          isOpen: true,
          type: "success",
          message: "Descarga completada",
          title: "Cotización",
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error: any) {
      setLoadingCotizacion(false);
      setDataModal({
        isOpen: true,
        type: "error",
        message:
          "Ocurrió un error al intentar descargar el archivo, itentalo de nuevo",
        title: "Error",
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  };

  return {
    rows,
    columns,
    loadingClearCar,
    loadingCotizacion,
    handleShowModalVaciarCarrito,
    handleGenerateCotizacion,
  };
};

export default useConfirmaProductos;
