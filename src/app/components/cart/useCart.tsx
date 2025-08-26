"use client";
import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { useState } from "react";

const useCart = () => {
  const { setDataCart, setDataModal } = useTheContext();
  const { requestPost } = useService();

  const [showDivCart, setShowDivCart] = useState<boolean>(false);

  const onMouseEnterCart = () => {
    setShowDivCart(true);
  };

  const onMouseLeaveCart = () => {
    setShowDivCart(false);
  };

  const handleRemoveItemCart = async (
    dataCartProp: ProductI[],
    productProp: ProductI
  ) => {
    try {
      const resp = await requestPost(
        {
          idProduct: productProp.idProduct,
        },
        "/cart/removeProduct"
      );

      if (resp && resp.status == 200) {
        const removeProduct = dataCartProp.filter(
          (item: ProductI) => item.idProduct != productProp.idProduct
        );
        setDataCart(removeProduct);
      }
    } catch (error: any) {
      setDataModal({
        isOpen: true,
        title: "Error",
        type: "error",
        message: error.response.message || error.message,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  return {
    handleRemoveItemCart,
    showDivCart,
    onMouseEnterCart,
    onMouseLeaveCart,
  };
};

export default useCart;
