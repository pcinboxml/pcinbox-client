"use client";

import { useTheContext } from "../services/globalContext";
import { useMediaQuery } from "@mui/material";
import useService from "../services/useService";
import { useEffect, useState } from "react";
import GridConfirmaProductos from "./gridConfirmaProductos";
import axios from "axios";
import useCheckoutSession from "../hooks/useCheckoutSession";
import useStorage from "../services/useStorage";
import useConfirmEmptyCart from "../hooks/useConfirmEmptyCart";
import useCheckoutDraft from "../hooks/useCheckoutDraft";
import useCartSync from "../hooks/useCartSync";
import {
  clearCheckoutLocalStorage,
  resolveCheckoutProducts,
  setCheckoutMode,
  writeCheckoutSnapshot,
} from "../utils/checkoutStorage";
import { toCheckoutSnapshot } from "../utils/checkoutValidation";
import { pdf } from "@react-pdf/renderer";
import CotizacionPDF from "../components/UI/Cotizacion/Cotizacion";
import ProductI from "../interfaces/products/product.interface";

const useConfirmaProductos = () => {
  const {
    dataCart,
    setDataCart,
    setDataModal,
    buyNowProduct,
  } = useTheContext();
  const { requestPost, formatCurrency } = useService();
  const { handleRemoveStorageDataCart, checkoutMode } = useStorage();
  const { clearBuyNow } = useCheckoutSession();
  const { refreshCartFromServer, clearCartEverywhere } = useCartSync();
  const { confirmEmptyCart } = useConfirmEmptyCart();
  const { clearDraft } = useCheckoutDraft();
  const isSmallScreen = useMediaQuery("(max-width: 1250px)", { noSsr: true });

  const [loadingClearCar, setLoadingClearCar] = useState<boolean>(false);
  const [loadingRemoveProduct, setLoadingRemoveProduct] =
    useState<boolean>(false);
  const [loadingCotizacion, setLoadingCotizacion] = useState<boolean>(false);

  const [rowsConfirmProducts, setRowsConfirmProducts] = useState<any[]>([]);

  // ---------- Manejo automático de productos a mostrar ----------
  useEffect(() => {
    const sourceProducts = resolveCheckoutProducts(
      checkoutMode,
      buyNowProduct,
      dataCart,
    );

    if (sourceProducts?.length === 0) {
      clearCheckoutLocalStorage({ clearProgress: false, clearBuyNow: false });
    }

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
  }, [buyNowProduct, dataCart, checkoutMode]);

  // ---------- Eliminar producto ----------
  const handleRemoveProduct = async (idProduct: string) => {
    if (buyNowProduct == null) {
      try {
        setLoadingRemoveProduct(true);

        const resp = await requestPost({ idProduct }, "/cart/removeProduct");

        if (resp?.status === 200) {
          await refreshCartFromServer();
          writeCheckoutSnapshot(toCheckoutSnapshot(dataCart.filter(
            (item) => item.idProduct !== idProduct,
          )));
        }
      } catch (error) {
        setDataModal({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Error al eliminar el producto",
          showActions: true,
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      } finally {
        setLoadingRemoveProduct(false);
      }
    } else {
      clearBuyNow();
      setCheckoutMode("cart");
      if (dataCart?.length) {
        writeCheckoutSnapshot(toCheckoutSnapshot(dataCart));
      }
      setLoadingRemoveProduct(false);
    }
  };

  // ---------- Vaciar carrito ----------
  const handleShowModalVaciarCarrito = () => {
    confirmEmptyCart({
      onConfirmEmpty: async () => {
        try {
          setLoadingClearCar(true);
          await clearCartEverywhere();

          handleRemoveStorageDataCart();
          clearCheckoutLocalStorage({ clearProgress: true, clearBuyNow: true });
          await clearDraft();
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingClearCar(false);
        }
      },
    });
  };

  // ---------- Generar cotización ----------
  const handleGenerateCotizacion = async (
    products: ProductI[] | ProductI | null,
  ) => {
    if (products === null) {
      return;
    }

    try {
      setLoadingCotizacion(true);

      const blob = await pdf(
        <CotizacionPDF
          noCotizacion={`#${new Date().getTime()}`}
          products={products}
        />,
      ).toBlob();

      // crear url temporal
      const url = URL.createObjectURL(blob);

      // descargar automáticamente
      const link = document.createElement("a");
      link.href = url;
      link.download = `cotización-${new Date().getTime().toString()}.pdf`;
      link.click();

      // liberar memoria
      URL.revokeObjectURL(url);

      setDataModal({
        isOpen: true,
        type: "success",
        message: "Descarga completada",
        title: "Cotización",
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
      // }
    } catch (error) {
      console.log(error);
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
