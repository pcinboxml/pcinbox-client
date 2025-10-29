"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import useService from "../services/useService";
import ProductI from "../interfaces/products/product.interface";
import useProveedores from "../services/proveedores/useProveedores";
import { useTheContext } from "../services/globalContext";

const usePrincipal = () => {
  const { socketServer } = useTheContext();
  const { setDataProducts, dataProducts } = useTheContext();

  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  useEffect(() => {
    socketServer.current?.on("newAllProducts", (inputDataSocket: any) => {
      setDataProducts((prev) => [
        ...prev,
        ...inputDataSocket.map((item: any) => ({
          categoryId: item.categoryId,
          description: item.description,
          name: item.name,
          price: item.price,
          stock: item.stock,
          sku: item.sku,
          imageUrl: item.imageUrl,
          idProduct: item.idProduct,
          providerId: item.providerId,
          rating: item.rating,
          quantity: item.stock,
          reviews: !item.reviews
            ? []
            : item.reviews.filter(
                (item2: any) => item2.productId == item.idProduct
              ),
          createdAt: "",
        })),
      ]);
    });
    socketServer.current?.on("updateAllProducts", (inputDataSocket: any[]) => {
      setDataProducts((prev) =>
        prev.map((itemProduct) => {
          const updated = inputDataSocket.find(
            (p) => p.idProduct === itemProduct.idProduct
          );

          return updated
            ? {
                categoryId: updated.categoryId,
                description: updated.description,
                sku: updated.sku,
                name: updated.name,
                price: updated.price,
                stock: updated.stock,
                imageUrl: updated.image_url,
                idProduct: updated.idProduct,
                providerId: updated.providerId,
                quantity: updated.stock,
                rating: updated.rating,
                reviews: !updated.reviews
                  ? []
                  : updated.reviews.filter(
                      (item: any) => item.productId == updated.idProduct
                    ),
                createdAt: "",
              }
            : itemProduct;
        })
      );
    });

    return () => {
      socketServer.current?.off("newAllProducts");
      socketServer.current?.off("updateAllProducts");
    };
  }, [socketServer.current]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // setNewProduct((prev) => ({
    //   ...prev,
    //   [name]: value,
    // }));
  };

  const onSubmitNewProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const resp = await requestPostProveedor(newProduct, "/newProduct");
    // const data = await resp.data;
    // const status = await resp.status;

    // console.log(newProduct);
    // console.log(data);
    // console.log(status);
  };

  return {
    // handleClick,
    dataProducts,
    loadingProducts,
    handleOnChange,
    onSubmitNewProduct,
    setDataProducts,
  };
};

export default usePrincipal;
