"use client";
import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useStorage from "@/app/services/useStorage";
import { useState } from "react";

const useCart = () => {
  const { setDataCart, setDataModal, hasToken } = useTheContext();
  const { requestPost } = useService();
  const { handleWriteStorageDataCart } = useStorage();

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
          { idProduct: productProp.idProduct },
          "/cart/removeProduct",
        );

        if (resp && resp.status == 200) {
          const removeProduct = dataCartProp.filter(
            (item: ProductI) => item.idProduct != productProp.idProduct,
          );

          if (removeProduct.length === 0) {
            handleRemoveItemCartProp();
          }

          setDataCart(removeProduct);
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
    } else {
      if (localStorage.getItem("dataCart")) {
        const storage = JSON.parse(localStorage.getItem("dataCart") || "");
        let removeProductStorage = storage.filter(
          (item: ProductI) => item.idProduct != productProp.idProduct,
        );

        setDataCart(removeProductStorage);
        localStorage.setItem("dataCart", JSON.stringify(removeProductStorage));

        // 🔥 Cierra el modal si ya no hay productos
        if (removeProductStorage.length === 0) {
          setShowDivCart(false);
        }
      }
    }
  };

  const addProductFromStorage = async () => {
    if (localStorage.getItem("dataCart")) {
      const storage = JSON.parse(localStorage.getItem("dataCart") || "");

      try {
        const getStatus = await requestPost(
          {
            dataCart: storage,
          },
          "/cart/addProductFromStorage",
        );

        if (getStatus!.status == 200) {
          localStorage.removeItem("dataCart");
        }
      } catch (error: any) {}
    }
  };

  const handleRemoveAllCart = async (
    dataCartProp: ProductI[],
    onMouseLeaveCartProp: any,
  ) => {
    if (hasToken) {
      try {
        setLoadingRmAllCart(true);
        const resp = await requestPost(
          {
            dataCart: dataCartProp,
          },
          "/cart/removeAllCart",
        );

        setLoadingRmAllCart(false);

        const status = await resp!.status;
        if (status == 200) {
          // setDataCart([]);
          onMouseLeaveCartProp();
        }
      } catch (error) {
        setLoadingRmAllCart(false);
        setDataModal({
          isOpen: true,
          message: "Ocurrio un error al borrar el carrito",
          title: "Error",
          type: "error",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } else {
      if (localStorage.getItem("dataCart")) {
        // setDataCart([]);
        localStorage.setItem("dataCart", JSON.stringify([]));
      }
    }
  };

  return {
    handleRemoveItemCart,
    loadingRmAllCart,
    showDivCart,
    onMouseEnterCart,
    onMouseLeaveCart,
    addProductFromStorage,
    handleRemoveAllCart,
  };
};

export default useCart;
