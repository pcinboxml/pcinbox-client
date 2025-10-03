"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "./globalContext";
import useService from "./useService";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";

const useFavorites = () => {
  const {
    dataCart,
    dataFavorites,
    setDataFavorites,
    setDataNotification,
    setDataCart,
  } = useTheContext();
  const { requestPost, requestGet } = useService();

  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const [loadingRemoveFavorite, setLoadingRemoveFavorite] =
    useState<boolean>(false);

  const [loadingAddCartFavorite, setLoadingAddCartFavorite] =
    useState<boolean>(false);

  const handleGetDataFavorites = async () => {
    try {
      const resp = await requestGet("/favorites/getFavoritesUser");

      if (resp.status == 200) {
        const data = await resp.data;
        setDataFavorites(data.data.data);
      }
    } catch (error) {
      setDataFavorites([]);
    }
  };

  const handleAddFavorites = async (favorite: ProductI) => {
    try {
      setLoadingFavorite(true);

      const resp = await requestPost(
        {
          idProduct: Number(favorite.idProduct),
        },
        "/favorites/addFavorites"
      );

      setLoadingFavorite(false);

      if (resp.status == 200) {
        const data = await resp.data;

        setDataFavorites(data.data.data);

        setDataNotification({
          open: true,
          handleClose: () =>
            setDataNotification((prevNoti) => ({
              ...prevNoti,
              open: false,
            })),
          message: "Producto agregado a favoritos correctamente",
          type: "success",
        });
      }
    } catch (error) {
      setLoadingFavorite(false);
      setDataFavorites([]);
    }
  };

  const handleAddFavoriteCart = async (product: FavoritesI) => {
    try {
      setLoadingAddCartFavorite(true);

      const resp = await requestPost(
        {
          product: product.products,
          quantity: 1,
          price: product.products?.price,
          isDetails: false,
        },
        "/cart/addProduct"
      );

      setLoadingAddCartFavorite(false);

      if (resp.status == 200) {
        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) =>
              Number(item.idProduct) === Number(product.products?.idProduct)
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
                categoryId: product.products?.categoryId || "",
                createdAt: product.products?.createdAt || "",
                description: product.products?.description || "",
                idProduct: product.products?.idProduct || "",
                imageUrl: product.products?.imageUrl || "",
                name: product.products?.name || "",
                price: product.products?.price || "0",
                providerId: product.products?.providerId || "",
                stock: product.products?.stock || 0,
                rating: product.products?.rating || 0,
                reviews: product.products?.reviews || [],
                sku: product.products?.sku || "",
                quantity: 1,
              },
            ];
          }
        });
      }
    } catch (error) {
      setLoadingAddCartFavorite(false);
    }
  };

  const handleSelectOrden = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    if (value == "date") {
      let orderDate = dataFavorites.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
      setDataFavorites(orderDate);
    }
  };

  const handleRemoveFavorite = async (favorite: FavoritesI) => {
    try {
      setLoadingRemoveFavorite(true);

      const resp = await requestPost(
        {
          idFavorite: favorite.idFavorite,
        },
        "/favorites/removeFavorites"
      );

      if (resp.status == 200) {
        const data = await resp.data;
        setDataFavorites(data.data.data);
        setLoadingRemoveFavorite(false);
        setDataNotification({
          open: true,
          handleClose: () =>
            setDataNotification((prevNoti) => ({
              ...prevNoti,
              open: false,
            })),
          message: `${favorite.products?.name} eliminado de favoritos correctamente`,
          type: "success",
        });
      }
    } catch (error) {
      setLoadingRemoveFavorite(false);
    }
  };

  return {
    handleAddFavorites,
    handleGetDataFavorites,
    handleAddFavoriteCart,
    handleSelectOrden,
    handleRemoveFavorite,
    loadingFavorite,
    loadingRemoveFavorite,
    loadingAddCartFavorite,
  };
};

export default useFavorites;
