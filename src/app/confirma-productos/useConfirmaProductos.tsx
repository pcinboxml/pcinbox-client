"use client";

import { useTheContext } from "../services/globalContext";
import { useMediaQuery } from "@mui/material";
import useService from "../services/useService";
import { useEffect, useState } from "react";
import GridConfirmaProductos from "./gridConfirmaProductos";
import axios from "axios";
import useStorage from "../services/useStorage";

const useConfirmaProductos = () => {
  const { dataCart, setDataCart, setDataModal, buyNowProduct } =
    useTheContext();
  const { requestPost, formatCurrency } = useService();
  const { handleRemoveStorageDataCart } = useStorage();
  const isSmallScreen = useMediaQuery("(max-width: 1250px)", { noSsr: true });

  const [loadingClearCar, setLoadingClearCar] = useState<boolean>(false);
  const [loadingRemoveProduct, setLoadingRemoveProduct] =
    useState<boolean>(false);
  const [loadingCotizacion, setLoadingCotizacion] = useState<boolean>(false);

  const [rowsConfirmProducts, setRowsConfirmProducts] = useState<any[]>([]);

  // ---------- Manejo automático de productos a mostrar ----------
  useEffect(() => {
    const sourceProducts = buyNowProduct
      ? [buyNowProduct]
      : dataCart && dataCart.length > 0
        ? dataCart
        : [];

    setRowsConfirmProducts(
      sourceProducts.map((itemCart) => ({
        id: itemCart.idProduct,
        products: `${itemCart.name} ${itemCart.description}`,
        quantity: Number(itemCart.quantity),
        sucursal: itemCart.product_stock,
        storeId: itemCart?.storeId,
        totalConIva: Number(itemCart.price),
        total: Number(itemCart.price) * Number(itemCart.quantity),
        action: 1,
      })),
    );
  }, [buyNowProduct, dataCart]);

  // ---------- Eliminar producto ----------
  const handleRemoveProduct = async (idProduct: string) => {
    setLoadingRemoveProduct(true);

    if (!buyNowProduct) {
      try {
        const resp = await requestPost({ idProduct }, "/cart/removeProduct");

        if (resp?.status === 200) {
          const updatedCart = dataCart.filter(
            (item) => item.idProduct !== idProduct,
          );
          setDataCart(updatedCart);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingRemoveProduct(false);
      }
    } else {
      // Si es buyNowProduct, solo limpiar
      localStorage.removeItem("buyNowProduct");
      localStorage.removeItem("checkout_step");
      localStorage.setItem("checkout_mode", "cart");
      setRowsConfirmProducts(
        dataCart && dataCart.length > 0
          ? dataCart.map((itemCart) => ({
              id: itemCart.idProduct,
              products: `${itemCart.name} ${itemCart.description}`,
              quantity: Number(itemCart.quantity),
              sucursal: itemCart.product_stock,
              storeId: itemCart?.storeId,
              totalConIva: Number(itemCart.price),
              total: Number(itemCart.price) * Number(itemCart.quantity),
              action: 1,
            }))
          : [],
      );

      setLoadingRemoveProduct(false);
      // El useEffect se encargará de actualizar rowsConfirmProducts automáticamente
    }
  };

  // ---------- Vaciar carrito ----------
  const handleShowModalVaciarCarrito = () => {
    setDataModal({
      isOpen: true,
      message: "¿Seguro que deseas vaciar el carrito de compras?",
      title: "Vaciar carrito",
      type: "info",
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: async () => {
        try {
          setLoadingClearCar(true);
          const resp = await requestPost({ dataCart }, "/cart/removeAllCart");

          if (resp?.status === 200) {
            handleRemoveStorageDataCart();
            localStorage.removeItem("progressPay2");
            localStorage.removeItem("checkout_step");
            setDataCart([]);
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingClearCar(false);
        }
      },
    });
  };

  // ---------- Generar cotización ----------
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      if (resp.status === 200) {
        const blob = new Blob([resp.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "cotizacion.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();

        setDataModal({
          isOpen: true,
          type: "success",
          message: "Descarga completada",
          title: "Cotización",
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
      }
    } catch (error) {
      setDataModal({
        isOpen: true,
        type: "error",
        message:
          "Ocurrió un error al intentar descargar el archivo, intenta de nuevo",
        title: "Error",
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    } finally {
      setLoadingCotizacion(false);
    }
  };

  const { columns } = GridConfirmaProductos({
    isSmallScreen,
    formatCurrency,
    loadingRemoveProduct,
    handleRemoveProduct,
    rowsConfirmProducts,
    setRowsConfirmProducts,
  });

  return {
    rowsConfirmProducts,
    columns,
    loadingClearCar,
    loadingCotizacion,
    handleShowModalVaciarCarrito,
    handleGenerateCotizacion,
  };
};

export default useConfirmaProductos;
