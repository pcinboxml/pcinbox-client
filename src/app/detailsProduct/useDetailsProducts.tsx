"use client";

import { ChangeEvent, useEffect, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";

const useDetailsProduct = () => {
  const [quantity, setQuantity] = useState<number | string>(1);
  const { requestPost } = useService();
  const { setDataCart, setDataModal, setDataNotification } = useTheContext();
  const [loadingAddProduct, setLoadingAddProduct] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [changeImg, setChangeImg] = useState<string>("");

  const handleAdd = () => {
    const newQuantity = Number(quantity) + 1;
    setQuantity(newQuantity);
    updateLocalStorageQuantity(newQuantity);
  };

  const handleSubstract = () => {
    const newQuantity = Number(quantity) > 1 ? Number(quantity) - 1 : 1;
    setQuantity(newQuantity);
    updateLocalStorageQuantity(newQuantity);
  };
  const updateLocalStorageQuantity = (newQuantity: number) => {
    const productStorage = localStorage.getItem("product");
    if (productStorage) {
      const parsed = JSON.parse(productStorage);
      const updatedProduct = { ...parsed, quantity: newQuantity };
      localStorage.setItem("product", JSON.stringify(updatedProduct));
    }
  };

  const handleAddProductCart = async (
    dataProduct: ProductI,
    quantityProp: number
  ) => {
    try {
      setLoadingAddProduct(true);

      const resp = await requestPost(
        {
          product: dataProduct,
          quantity: quantityProp,
          price: dataProduct.price,
          isDetails: true,
        },
        "/cart/addProduct"
      );

      setLoadingAddProduct(false);

      if (resp && resp.status == 200) {
        setDataNotification({
          open: true,
          handleClose: () =>
            setDataNotification((prevNoti) => ({
              ...prevNoti,
              open: false,
            })),
          message: "Producto agregado al carrito correctamente",
          type: "success",
        });

        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) => Number(item.idProduct) === Number(dataProduct.idProduct)
          );
          if (existingProduct) {
            return prev.map((item) =>
              Number(item.idProduct) == Number(existingProduct.idProduct)
                ? { ...item, quantity: Number(item.quantity) + Number(1) }
                : item
            );
          } else {
            return [
              ...prev,
              {
                categoryId: dataProduct.categoryId,
                createdAt: dataProduct.createdAt,
                description: dataProduct.description,
                idProduct: dataProduct.idProduct,
                imageUrl: dataProduct.imageUrl,
                name: dataProduct.name,
                price: dataProduct.price,
                providerId: dataProduct.providerId,
                stock: dataProduct.stock,
                rating: dataProduct.rating,
                reviews: dataProduct.reviews,
                quantity: 1,
                sku: dataProduct.sku,
              },
            ];
          }
        });
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
    dataProduct: ProductI
  ) => {
    if (quantity != "" && quantity != 0 && event.key == "Enter") {
      handleAddProductCart(dataProduct, Number(quantity));
    }
  };

  return {
    quantity,
    loadingAddProduct,
    openModal,
    changeImg,
    setOpenModal,
    setChangeImg,
    handleAdd,
    handleSubstract,
    handleAddProductCart,
    handleOnChange,
    handleKeyBoard,
  };
};

export default useDetailsProduct;
