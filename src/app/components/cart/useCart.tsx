"use client";
import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useStorage from "@/app/services/useStorage";
import useCartSync from "@/app/hooks/useCartSync";
import useConfirmEmptyCart from "@/app/hooks/useConfirmEmptyCart";
import { useRef, useState } from "react";

export type CartOpenMode = "hover" | "click" | null;

const useCart = () => {
  const { setDataCart, setDataModal, hasToken } = useTheContext();
  const { requestPost } = useService();
  const { handleWriteStorageDataCart, handleRemoveStorageDataCart } =
    useStorage();
  const { refreshCartFromServer, clearCartEverywhere } = useCartSync();
  const { confirmEmptyCart } = useConfirmEmptyCart();

  const [showDivCart, setShowDivCart] = useState<boolean>(false);
  const [cartOpenMode, setCartOpenMode] = useState<CartOpenMode>(null);
  const [loadingRmAllCart, setLoadingRmAllCart] = useState<boolean>(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCart = (mode: CartOpenMode = "hover") => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setCartOpenMode(mode);
    setShowDivCart(true);
  };

  const onMouseEnterCart = () => {
    openCart("hover");
  };

  const closeCartNow = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setCartOpenMode(null);
    setShowDivCart(false);
  };

  const onMouseLeaveCart = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setCartOpenMode(null);
      setShowDivCart(false);
      closeTimerRef.current = null;
    }, 220);
  };

  const cancelCloseCart = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const toggleCart = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setShowDivCart((prev) => {
      const next = !prev;
      setCartOpenMode(next ? "click" : null);
      return next;
    });
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
    const { readLocalCartStorage } = await import("@/app/utils/cartSync");
    const storage = readLocalCartStorage();
    if (storage.length === 0) return;

    try {
      const getStatus = await requestPost(
        { dataCart: storage },
        "/cart/addProductFromStorage",
      );

      if (getStatus?.status === 200) {
        const { clearLocalCartStorage } = await import("@/app/utils/cartSync");
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
        await clearCartEverywhere();
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
    confirmEmptyCart({
      onConfirmEmpty: () => handleRemoveAllCart(dataCartProp, onCloseCart),
    });
  };

  return {
    handleRemoveItemCart,
    loadingRmAllCart,
    showDivCart,
    cartOpenMode,
    onMouseEnterCart,
    onMouseLeaveCart,
    closeCartNow,
    cancelCloseCart,
    toggleCart,
    addProductFromStorage,
    handleRemoveAllCart,
    handleConfirmEmptyCart,
  };
};

export default useCart;
