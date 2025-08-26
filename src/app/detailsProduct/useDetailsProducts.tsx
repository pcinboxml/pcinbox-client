"use client";

import { useEffect, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";

const useDetailsProduct = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const { requestPost } = useService();
  const { setDataCart, setDataModal, setDataNotification } = useTheContext();

  useEffect(() => {
    const productStorage = localStorage.getItem("product");
    if (productStorage) {
      const convertJSON = JSON.parse(productStorage);
      const storedQuantity = Number(convertJSON.quantity);

      // Solo actualizar si storedQuantity es un número válido y mayor a 0
      if (!isNaN(storedQuantity) && storedQuantity > 0) {
        setQuantity(storedQuantity || 1);
      }
    }
  }, []);

  const handleAdd = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateLocalStorageQuantity(newQuantity);
  };

  const handleSubstract = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
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
      const resp = await requestPost(
        {
          product: dataProduct,
          quantity: quantityProp,
          price: dataProduct.price,
          isDetails: true,
        },
        "/cart/addProduct"
      );

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
          const existingProductIndex = prev.findIndex(
            (item) => item.idProduct === dataProduct.idProduct
          );

          if (existingProductIndex !== -1) {
            return prev.map((item, index) =>
              index === existingProductIndex
                ? { ...item, quantity: quantityProp }
                : item
            );
          }

          return [
            ...prev,
            {
              quantity: quantityProp,
              categoryId: dataProduct.categoryId,
              createdAt: dataProduct.createdAt,
              description: dataProduct.description,
              idProduct: dataProduct.idProduct,
              image_url: dataProduct.image_url,
              name: dataProduct.name,
              price: dataProduct.price,
              providerId: dataProduct.providerId,
              stock: dataProduct.stock,
            },
          ];
        });
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
    quantity,
    handleAdd,
    handleSubstract,
    handleAddProductCart,
  };
};

export default useDetailsProduct;
