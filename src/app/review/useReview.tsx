"use client";

import { useState } from "react";
import useProveedores from "../services/proveedores/useProveedores";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";

const useReview = () => {
  const { setDataCart } = useTheContext();
  const { requestGetProveedor } = useProveedores();
  const { requestPost } = useService();

  const [dataProduct, setDataProduct] = useState<ProductI | null>(null);
  const [loadingAddProductCar, setLoadingAddProductCar] =
    useState<boolean>(false);

  const handleGetProduct = async (idProduct: number) => {
    try {
      const resp = await requestGetProveedor(
        `/getProduct?idProduct=${idProduct}`
      );
      const status = await resp.status;
      const data = await resp.data;
      if (status == 200) {
        setDataProduct(data.data.data);
      }
    } catch (error) {}
  };

  const handleAddProductCart = async (productProp: ProductI) => {
    try {
      setLoadingAddProductCar(true);

      const resp = await requestPost(
        {
          product: productProp,
          quantity: 1,
          price: productProp.price,
          isDetails: false,
        },
        "/cart/addProduct"
      );

      setLoadingAddProductCar(false);

      if (resp.status == 200) {
        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) => Number(item.idProduct) === Number(productProp.idProduct)
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
                categoryId: productProp.categoryId,
                createdAt: productProp.createdAt,
                description: productProp.description,
                idProduct: productProp.idProduct,
                image_url: productProp.image_url,
                name: productProp.name,
                price: productProp.price,
                providerId: productProp.providerId,
                stock: productProp.stock,
                rating: productProp.rating,
                reviews: productProp.reviews,
                quantity: 1,
              },
            ];
          }
        });
      }
    } catch (error) {
      setLoadingAddProductCar(false);
    }
  };

  return {
    handleGetProduct,
    handleAddProductCart,
    dataProduct,
    loadingAddProductCar,
  };
};
export default useReview;
