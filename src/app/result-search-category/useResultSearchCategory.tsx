"use client";

import { useState } from "react";
import useService from "../services/useService";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";

const ITEMS_PER_PAGE = 20;

const useResultSearchCategory = () => {
  const [loadingAddProductCar, setLoadingAddProductCar] = useState(false);
  const { requestPost } = useService();
  const { setDataCart } = useTheContext();

  const [page, setPage] = useState<number>(1);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

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
                imageUrl:
                  productProp.imageUrl || (productProp as any).image_url,
                name: productProp.name,
                price: productProp.price,
                providerId: productProp.providerId,
                stock: productProp.stock,
                rating: productProp.rating,
                reviews: productProp.reviews,
                sku: productProp.sku,
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
    handleAddProductCart,
    loadingAddProductCar,
    page,
    setPage,
    startIndex,
    endIndex,
    handleChangePage,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};

export default useResultSearchCategory;
