"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { useState } from "react";

const useCard = () => {
  const { setDataCart, setDataModal, setDataNotification, hasToken } =
    useTheContext();
  const { requestPost } = useService();

  const [loadingAgregar, setLoadingAgregar] = useState<boolean>(false);

  const handleAddProductCart = async (product: ProductI) => {
    if (!hasToken) {
      const stored = localStorage.getItem("dataCart");
      const products: (typeof product)[] = stored ? JSON.parse(stored) : [];
      const existingProductIndex = products.findIndex(
        (p: any) => p.idProduct == product.idProduct
      );

      if (existingProductIndex != -1) {
        products[existingProductIndex].quantity += 1;
      } else {
        products.push({
          ...product,
          quantity: 1,
        });
      }

      localStorage.setItem("dataCart", JSON.stringify(products));

      setDataNotification({
        open: true,
        handleClose: () =>
          setDataNotification((prevNoti) => ({
            ...prevNoti,
            open: false,
          })),
        message: `${product.name} agregado al carrito correctamente`,
        type: "success",
      });

      setDataCart(JSON.parse(localStorage.getItem("dataCart") || ""));
      return;
    }

    try {
      setLoadingAgregar(true);

      const resp = await requestPost(
        {
          product: product,
          quantity: 1,
          price: product.price,
          isDetails: false,
        },
        "/cart/addProduct"
      );

      setLoadingAgregar(false);

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

        setDataCart((prev: any) => {
          const existingProductIndex = prev.findIndex(
            (item: any) => item.idProduct === product.idProduct
          );

          if (existingProductIndex !== -1) {
            return prev.map((item: any, index: number) =>
              index === existingProductIndex
                ? { ...item, quantity: Number(item.quantity) + Number(1) }
                : item
            );
          }

          return [
            ...prev,
            {
              categoryId: Number(product.categoryId),
              createdAt: product.createdAt,
              description: product.description,
              idProduct: Number(product.idProduct),
              image_url: product.image_url,
              name: product.name,
              price: Number(product.price),
              providerId: Number(product.providerId),
              stock: Number(product.stock),
              quantity: 1,
            },
          ];
        });
      }
    } catch (error: any) {
      setLoadingAgregar(false);

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
    handleAddProductCart,
    loadingAgregar,
  };
};

export default useCard;
