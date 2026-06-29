"use client";

import { ChangeEvent, useEffect, useState } from "react";
import ProductI from "../../interfaces/products/product.interface";
import useService from "../../services/useService";
import { useTheContext } from "../../services/globalContext";
import useProveedores from "@/app/services/proveedores/useProveedores";
import useCartSync from "@/app/hooks/useCartSync";
import useCheckoutSession from "@/app/hooks/useCheckoutSession";

const useDetailsProduct = () => {
  const [quantity, setQuantity] = useState<number | string>(1);
  const { requestPost } = useService();
  const { requestGetProveedor } = useProveedores();
  const { setDataCart, setDataModal, setDataNotification } = useTheContext();
  const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [changeImg, setChangeImg] = useState<string>("");
  const { onRouterLink } = useService();
  const { refreshCartFromServer } = useCartSync();
  const { clearBuyNow } = useCheckoutSession();

  // const [dataProduct, setProduct] = useState<ProductI>({
  //   categoryId: "",
  //   createdAt: "",
  //   description: "",
  //   idProduct: "",
  //   imageUrl: [],
  //   name: "",
  //   price: "",
  //   providerId: "",
  //   quantity: 0,
  //   stock: 0,
  //   reviews: [],
  //   rating: 0,
  //   sku: "",
  //   caracteristicas: [],
  // });

  const handleAdd = (stockProp: number) => {
    const newQuantity = Number(quantity) + 1;

    if (newQuantity > stockProp) {
      return;
    }
    setQuantity(newQuantity);
  };

  const handleSubstract = () => {
    const newQuantity = Number(quantity) > 1 ? Number(quantity) - 1 : 1;
    setQuantity(newQuantity);
  };

  const handleAddProductCart = async (
    dataProduct: ProductI,
    quantityProp: number,
  ) => {
    try {
      const stock = Number(dataProduct?.stock);
      if (stock <= 0) return;

      setLoadingAddProduct(true);
      clearBuyNow();

      const resp = await requestPost(
        {
          idProduct: Number(dataProduct?.idProduct),
          quantity: quantityProp,
          price: dataProduct.price,
          isDetails: true,
        },
        "/cart/addProduct",
      );

      setLoadingAddProduct(false);

      if (resp && resp.status == 200) {
        await refreshCartFromServer();
      }
    } catch (error: any) {
      setLoadingAddProduct(false);

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

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value == "") {
      setQuantity("");
    } else {
      setQuantity(Number(value));
    }
  };

  const handleKeyBoard = (
    event: React.KeyboardEvent<HTMLInputElement>,
    dataProduct: ProductI,
  ) => {
    if (quantity != "" && quantity != 0 && event.key == "Enter") {
      handleAddProductCart(dataProduct, Number(quantity));
    }
  };

  // const handleGetDataProduct = async (idProduct: any) => {
  //   try {
  //     const resp = await requestGetProveedor(`/getProduct/${idProduct}`);
  //     if (resp.status == 200) {
  //       const data = resp.data;
  //       setProduct(data.data.data);
  //     }
  //   } catch (error) {}
  // };

  return {
    quantity,
    loadingAddProduct,
    openModal,
    changeImg,
    // dataProduct,
    setOpenModal,
    setChangeImg,
    handleAdd,
    handleSubstract,
    handleAddProductCart,
    handleOnChange,
    handleKeyBoard,
    // handleGetDataProduct,
  };
};

export default useDetailsProduct;
