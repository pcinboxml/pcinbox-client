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
          idProduct: Number(product?.idProduct),
          quantity: quantity,
          isDetails: false,
          storeId: sucursal?.idBranche,
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
            (item) =>
              Number(item.idProduct) === Number(product.idProduct) &&
              Number(item.storeId) === Number(sucursal.idBranche),
          );

          const stock =
            product.product_stock?.find(
              (b) => b.branchId === sucursal.idBranche,
            )?.stock ?? 0;

          if (existingProduct) {
            const newQuantity = Math.min(
              Number(existingProduct.quantity) + Number(quantity),
              stock,
            );

            return prev.map((item) =>
              Number(item.idProduct) === Number(product.idProduct) &&
              Number(item.storeId) === Number(sucursal.idBranche)
                ? { ...item, quantity: newQuantity }
                : item,
            );
          }

          const newQuantity = Math.min(quantity, stock);

          return [
            ...prev,
            {
              ...product,
              quantity: newQuantity,
              storeId: sucursal.idBranche,
            },
          ];
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
      name: "Arboledas",
    },
    {
      idStore: 26,
      name: "dicoags2",
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
