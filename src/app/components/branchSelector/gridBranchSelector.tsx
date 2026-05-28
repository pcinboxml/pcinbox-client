"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { SetStateAction, useState } from "react";

const GridBranchSelector = () => {
  const { requestPost, onRouterLink } = useService();
  const { setDataCart, setDataModal, setBuyNowProduct } = useTheContext();
  const [quantities, setQuantities] = useState<Record<number, number | "">>({});

  const [loadingByBranch, setLoadingByBranch] = useState<
    Record<number, boolean>
  >({});

  const handleBuyNowProduct = async (
    productSelected: ProductI,
    quantity: number,
    sucursal: any,
  ) => {
    try {
      localStorage.setItem("checkout_mode", "buy_now");

      setBuyNowProduct({
        ...productSelected,
        categoryId: productSelected!.categoryId,
        createdAt: productSelected!.createdAt,
        description: productSelected!.description,
        idProduct: productSelected!.idProduct,
        imageUrl: productSelected!.imageUrl,
        name: productSelected!.name,
        price: productSelected!.price,
        providerId: productSelected!.providerId,
        stock: productSelected!.stock,
        rating: productSelected!.rating,
        reviews: productSelected!.reviews,
        quantity: Number(quantity),
        sku: productSelected!.sku,
        isPC: productSelected?.isPC,
        isPc: productSelected?.isPc,
        caracteristicas: productSelected?.caracteristicas,
        height: productSelected?.height,
        idProductExt: productSelected?.idProductExt,
        largo: productSelected?.largo,
        storeId: productSelected?.storeId,
        upc: productSelected?.upc,
        width: productSelected?.width,
        product_stock: productSelected?.product_stock,
      });
      localStorage.setItem(
        "buyNowProduct",
        JSON.stringify({
          ...productSelected,
          categoryId: productSelected!.categoryId,
          createdAt: productSelected!.createdAt,
          description: productSelected!.description,
          idProduct: productSelected!.idProduct,
          imageUrl: productSelected!.imageUrl,
          name: productSelected!.name,
          price: productSelected!.price,
          providerId: productSelected!.providerId,
          stock: productSelected!.stock,
          rating: productSelected!.rating,
          reviews: productSelected!.reviews,
          quantity: Number(quantity),
          sku: productSelected!.sku,
          isPC: productSelected?.isPC,
          isPc: productSelected?.isPc,
          caracteristicas: productSelected?.caracteristicas,
          height: productSelected?.height,
          idProductExt: productSelected?.idProductExt,
          largo: productSelected?.largo,
          storeId: productSelected?.storeId,
          upc: productSelected?.upc,
          width: productSelected?.width,
          product_stock: productSelected?.product_stock,
        }),
      );
      setDataModal((prev) => ({ ...prev, isOpen: false }));
      onRouterLink("/confirma-productos");
    } catch (error) {
      setDataModal({
        isOpen: true,
        title: "Error",
        message: "Ocurrio un error al comprar ahora el producto",
        type: "error",
        showActions: true,
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  };

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

      if (resp!.status == 200) {
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

  const branchesDico: { idStore: number; name: string }[] =
    process.env.NEXT_PUBLIC_NODE_ENV === "local"
      ? [
          {
            idStore: 4,
            name: "Arboledas",
          },
          {
            idStore: 26,
            name: "dicoags2",
          },
          {
            idStore: 16,
            name: "gdl",
          },
        ]
      : [
          {
            idStore: 34,
            name: "santafe",
          },
          {
            idStore: 30,
            name: "leon2",
          },
        ];

  return {
    quantities,
    loadingByBranch,
    branchesDico,
    handleAddProductCart,
    handleBuyNowProduct,
    handleChangeQuantity,
  };
};

export default GridBranchSelector;
