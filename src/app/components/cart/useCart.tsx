"use client";
import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useStorage from "@/app/services/useStorage";
import useCartSync from "@/app/hooks/useCartSync";
import { useState } from "react";

const useCart = () => {
  const { setDataCart, setDataModal, hasToken } = useTheContext();
  const { requestPost } = useService();
  const { handleWriteStorageDataCart, handleRemoveStorageDataCart } =
    useStorage();
  const { refreshCartFromServer, clearCartEverywhere } = useCartSync();

  const [showDivCart, setShowDivCart] = useState<boolean>(false);
  const [loadingRmAllCart, setLoadingRmAllCart] = useState<boolean>(false);

  const onMouseEnterCart = () => {
    setShowDivCart(true);
  };

  const onMouseLeaveCart = () => {
    setShowDivCart(false);
  };

  const handleRemoveItemCart = async (
    dataCartProp: ProductI[],
    productProp: ProductI,
    handleRemoveItemCartProp: any,
  ) => {
    if (hasToken) {
      try {
        const resp = await requestPost(
          {
            idProduct: productProp.idProduct,
            storeId: productProp.storeId ?? null,
          },
          "/cart/removeProduct",
        );

        if (resp && resp.status == 200) {
          const remaining = await refreshCartFromServer();
          if (remaining.length === 0) {
            handleRemoveItemCartProp();
          }
        }
      } catch (error: any) {
        setDataModal({
          isOpen: true,
          title: "Error",
          type: "error",
          message: error.response?.message || error.message,
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
      }
      return;
    }

    const removeProductStorage = dataCartProp.filter(
      (item: ProductI) =>
        !(
          String(item.idProduct) === String(productProp.idProduct) &&
          String(item.storeId ?? "") === String(productProp.storeId ?? "")
        ),
    );

    setDataCart(removeProductStorage);
    handleWriteStorageDataCart(removeProductStorage);

    if (removeProductStorage.length === 0) {
      setShowDivCart(false);
      handleRemoveItemCartProp?.();
    }
  };

  const addProductFromStorage = async () => {
    const { readLocalCartStorage } = await import("../utils/cartSync");
    const storage = readLocalCartStorage();
    if (storage.length === 0) return;

    try {
      const getStatus = await requestPost(
        { dataCart: storage },
        "/cart/addProductFromStorage",
      );

      if (getStatus?.status === 200) {
        const { clearLocalCartStorage } = await import("../utils/cartSync");
        clearLocalCartStorage();
        await refreshCartFromServer();
      }
    } catch {
      // Sin sesión o error de red
    }
  };

  const handleRemoveAllCart = async (
    dataCartProp: ProductI[],
    onMouseLeaveCartProp: any,
  ) => {
    if (hasToken) {
      try {
        setLoadingRmAllCart(true);
        await clearCartEverywhere(dataCartProp);
        handleRemoveStorageDataCart();
        onMouseLeaveCartProp();
      } catch {
        setDataModal({
          isOpen: true,
          message: "Ocurrió un error al borrar el carrito",
          title: "Error",
          type: "error",
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
      } finally {
        setLoadingRmAllCart(false);
      }
      return;
    }

    handleRemoveStorageDataCart();
    onMouseLeaveCartProp?.();
  };

  const handleConfirmEmptyCart = (
    dataCartProp: ProductI[],
    onCloseCart?: () => void,
  ) => {
    setDataModal({
      isOpen: true,
      message:
        "¿Estás seguro de que deseas eliminar todos los productos del carrito?",
      title: "Vaciar carrito",
      type: "warning",
      showActions: true,
      onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
        void handleRemoveAllCart(dataCartProp, onCloseCart);
      },
    });
  };

  return {
    handleRemoveItemCart,
    loadingRmAllCart,
    showDivCart,
    onMouseEnterCart,
    onMouseLeaveCart,
    addProductFromStorage,
    handleRemoveAllCart,
    handleConfirmEmptyCart,
  };
};

export default useCart;
