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
        let findFavorite = dataFavorites.find(
          (item) => Number(item.productId) == Number(favorite.idProduct)
        );
        if (!findFavorite) {
          setDataFavorites((prev) => [
            ...prev,
            {
              idFavorite: Number(findFavorite!.idFavorite),
              image_url: favorite.image_url,
              productId: Number(favorite.idProduct),
              userId: Number(findFavorite!.userId),
            },
          ]);
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
        } else {
          setDataNotification({
            open: true,
            handleClose: () =>
              setDataNotification((prevNoti) => ({
                ...prevNoti,
                open: false,
              })),
            message: `Ya existe ${favorite.name} en favoritos`,
            type: "info",
          });
        }
      }
    } catch (error) {
      setLoadingFavorite(false);
      setDataFavorites([]);
    }
  };

  const handleAddFavoriteCart = (product: FavoritesI) => {
    const updateItems = dataCart.map((item) => {
      if (Number(item.idProduct) === Number(product.productId)) {
        const newQuantity =
          Number(item.quantity) > 1 ? Number(item.quantity) - Number(1) : 1;
        return { ...item, quantity: newQuantity };
      }
      return { ...item };
    });

    setDataCart(updateItems);
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

  return {
    handleAddFavorites,
    handleGetDataFavorites,
    handleAddFavoriteCart,
    handleSelectOrden,
    loadingFavorite,
  };
};

export default useFavorites;
