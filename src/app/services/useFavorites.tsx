"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "./globalContext";
import useService from "./useService";
import useCartSync from "../hooks/useCartSync";
import useCheckoutSession from "../hooks/useCheckoutSession";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";

const useFavorites = () => {
  const {
    dataFavorites,
    setDataFavorites,
    setDataNotification,
    setDataCart,
    setTotalFavorites,
  } = useTheContext();
  const { requestPost, requestGet } = useService();
  const { refreshCartFromServer } = useCartSync();
  const { clearBuyNow } = useCheckoutSession();

  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const [loadingRemoveFavorite, setLoadingRemoveFavorite] =
    useState<boolean>(false);

  const [loadingAddCartFavorite, setLoadingAddCartFavorite] =
    useState<boolean>(false);

  const [loadingAddId, setLoadingAddId] = useState<string | null>(null);
  const [loadingRemoveId, setLoadingRemoveId] = useState<string | null>(null);

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
        "/favorites/addFavorites",
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
      const stock = Number(product?.products?.stock);
      if (stock <= 0) return;

      setLoadingAddId(String(product.productId) || null);
      setLoadingAddCartFavorite(true);
      clearBuyNow();

      const resp = await requestPost(
        {
          idProduct: Number(product?.products?.idProduct),
          //product: product.products,
          quantity: 1,
          price: product.products?.price,
          isDetails: false,
        },
        "/cart/addProduct",
      );

      setLoadingAddCartFavorite(false);

      if (resp.status == 200) {
        await refreshCartFromServer();
      }
    } catch (error) {
      setLoadingAddCartFavorite(false);
    } finally {
      setLoadingAddId(null);
    }
  };

  const handleSelectOrden = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    const favoritesCopy = [...dataFavorites];

    if (value === "date") {
      const orderDate = favoritesCopy.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime(),
      );
      setDataFavorites([...orderDate]); // Aseguramos una nueva referencia
    } else if (value === "z_a") {
      const orderByNameDescription = favoritesCopy.sort((a, b) => {
        const nameA = a.products?.name ?? "";
        const nameB = b.products?.name ?? "";
        const descriptionA = a.products?.description ?? "";
        const descriptionB = b.products?.description ?? "";

        const nameComparison = nameB.localeCompare(nameA, undefined, {
          sensitivity: "base",
        });

        return nameComparison !== 0
          ? nameComparison
          : descriptionB.localeCompare(descriptionA, undefined, {
              sensitivity: "base",
            });
      });

      setDataFavorites([...orderByNameDescription]);
    } else if (value === "a_z") {
      const orderByNameDescription = favoritesCopy.sort((a, b) => {
        const nameA = a.products?.name ?? "";
        const nameB = b.products?.name ?? "";
        const descriptionA = a.products?.description ?? "";
        const descriptionB = b.products?.description ?? "";

        const nameComparison = nameA.localeCompare(nameB, undefined, {
          sensitivity: "base",
        });

        return nameComparison !== 0
          ? nameComparison
          : descriptionA.localeCompare(descriptionB, undefined, {
              sensitivity: "base",
            });
      });

      setDataFavorites([...orderByNameDescription]);
    } else if (value === "mayor_precio") {
      const orderByHighPrice = favoritesCopy.sort(
        (a, b) =>
          Number(b?.products?.price ?? 0) - Number(a?.products?.price ?? 0),
      );
      setDataFavorites([...orderByHighPrice]);
    } else if (value === "menor_precio") {
      const orderByLowPrice = favoritesCopy.sort(
        (a, b) =>
          Number(a?.products?.price ?? 0) - Number(b?.products?.price ?? 0),
      );
      setDataFavorites([...orderByLowPrice]);
    }
  };

  const handleRemoveFavorite = async (favorite: FavoritesI) => {
    try {
      setLoadingRemoveId(favorite.products?.idProduct?.toString()! || null);
      setLoadingRemoveFavorite(true);

      const resp = await requestPost(
        {
          idProduct: Number(favorite?.productId),
        },
        "/favorites/removeFavorites",
      );

      if (resp.status == 200) {
        const data = await resp.data;
        setDataFavorites(data.data.data);
        setLoadingRemoveFavorite(false);
        setTotalFavorites((prev) => prev - 1);
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
    } finally {
      setLoadingRemoveId(null);
    }
  };

  return {
    handleAddFavorites,
    handleGetDataFavorites,
    handleAddFavoriteCart,
    handleSelectOrden,
    handleRemoveFavorite,
    loadingAddId,
    loadingRemoveId,
    loadingFavorite,
    loadingAddCartFavorite,
  };
};

export default useFavorites;
