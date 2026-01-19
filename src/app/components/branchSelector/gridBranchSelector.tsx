"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { useState } from "react";

const GridBranchSelector = () => {
  const { requestPost } = useService();
  const { setDataCart, setDataModal } = useTheContext();
  const [quantities, setQuantities] = useState<Record<number, number | "">>({});

  const [loadingByBranch, setLoadingByBranch] = useState<
    Record<number, boolean>
  >({});

  const handleAddProductCart = async (
    product: ProductI,
    quantity: number,
    price: string,
    sucursal: any,
  ) => {
    try {
      setLoadingByBranch((prev) => ({
        ...prev,
        [sucursal?.id]: true,
      }));

      const resp = await requestPost(
        {
          product: product,
          quantity: quantity,
          price: product.price,
          isDetails: false,
        },
        "/cart/addProduct",
      );

      setLoadingByBranch((prev) => ({
        ...prev,
        [sucursal?.id]: false,
      }));

      if (resp.status == 200) {
        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) => Number(item.idProduct) === Number(product.idProduct),
          );
          if (existingProduct) {
            return prev.map((item) =>
              Number(item.idProduct) == Number(existingProduct.idProduct)
                ? {
                    ...item,
                    quantity: Number(item.quantity) + Number(quantity),
                  }
                : item,
            );
          } else {
            return [
              ...prev,
              {
                categoryId: product.categoryId,
                createdAt: product.createdAt,
                description: product.description,
                idProduct: product.idProduct,
                imageUrl: product.imageUrl || (product as any).image_url,
                name: product.name,
                price: product.price,
                providerId: product.providerId,
                stock: product.stock,
                rating: product.rating,
                reviews: product.reviews,
                sku: product.sku,
                quantity: quantity,
              },
            ];
          }
        });

        setDataModal((prev) => ({ ...prev, isOpen: false }));
      }
    } catch (error) {
      setLoadingByBranch((prev) => ({
        ...prev,
        [sucursal?.id]: false,
      }));
    } finally {
      setLoadingByBranch((prev) => ({
        ...prev,
        [sucursal?.id]: false,
      }));
    }
  };

  const handleChangeQuantity = (branchId: number, value: string) => {
    if (value === "") {
      setQuantities((prev) => ({
        ...prev,
        [branchId]: "",
      }));
      return;
    }

    const quantity = Number(value);

    setQuantities((prev) => ({
      ...prev,
      [branchId]: quantity,
    }));
  };

  const branchesDico: { idStore: number; name: string }[] = [
    {
      idStore: 34,
      name: "santafe",
    },
    {
      idStore: 7,
      name: "leon",
    },
    {
      idStore: 16,
      name: "gdl",
    },
    {
      idStore: 4,
      name: "Arboledas",
    },
  ];

  return {
    quantities,
    loadingByBranch,
    branchesDico,
    handleAddProductCart,
    handleChangeQuantity,
  };
};

export default GridBranchSelector;
