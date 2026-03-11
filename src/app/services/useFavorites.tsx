"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "./globalContext";
import useService from "./useService";
import { FavoritesI } from "../interfaces/favorites/favorites.interface";

const useFavorites = () => {
  const { dataFavorites, setDataFavorites, setDataNotification, setDataCart } =
    useTheContext();
  const { requestPost, requestGet } = useService();

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
      const stored = localStorage.getItem("dataCartStorage");
      const products: (typeof product)[] = stored ? JSON.parse(stored) : [];

      const existingProductIndex = products.findIndex(
        (p: any) =>
          Number(p.idProduct) === Number(product.productId) &&
          Number(p.storeId) === Number(product.products?.storeId),
      );

      const stock = Number(product?.products?.stock);

      if (existingProductIndex !== -1) {
        const currentQuantity =
          products[existingProductIndex].products?.quantity;

        // Validar límite de stock
        if (currentQuantity! >= stock) {
          return;
        }

        const current = products[existingProductIndex]?.products?.quantity;
        if (current != null) {
          products[existingProductIndex].products!.quantity = current + 1;
        }
      } else {
        // Si el stock es 0 tampoco agregar
        if (stock <= 0) return;

        products.push({
          ...product.products,
          quantity: 1,
        } as FavoritesI & { quantity: number });
      }

      localStorage.setItem("dataCartStorage", JSON.stringify(products));

      setLoadingAddId(String(product.productId) || null);
      setLoadingAddCartFavorite(true);

      const resp = await requestPost(
        {
          // product: product.products,
          idProduct: product?.products?.idProduct,
          quantity: 1,
          price: product.products?.price,
          isDetails: false,
        },
        "/cart/addProduct",
      );

      setLoadingAddCartFavorite(false);

      if (resp.status == 200) {
        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) =>
              Number(item.idProduct) === Number(product.products?.idProduct),
          );
          if (existingProduct) {
            return prev.map((item) =>
              Number(item.idProduct) == Number(existingProduct.idProduct)
                ? { ...item, quantity: Number(item.quantity) + Number(1) }
                : item,
            );
          } else {
            return [
              ...prev,
              {
                categoryId: product.products?.categoryId || "",
                createdAt: product.products?.createdAt || "",
                description: product.products?.description || "",
                idProduct: product.products?.idProduct || "",
                imageUrl:
                  product.products?.imageUrl ||
                  (product.products as any)?.image_url ||
                  "",
                name: product.products?.name || "",
                price: product.products?.price || "0",
                providerId: product.products?.providerId || "",
                stock: product.products?.stock || 0,
                rating: product.products?.rating || 0,
                reviews: product.products?.reviews || [],
                sku: product.products?.sku || "",
                quantity: 1,
                isPC: product?.products?.isPC,
                isPc: product?.products?.isPc,
                caracteristicas: product?.products?.caracteristicas,
                height: product?.products?.height,
                idProductExt: product?.products?.idProductExt,
                largo: product?.products?.largo,
                product_stock: product?.products?.product_stock,
                storeId: product?.products?.storeId,
                upc: product?.products?.upc,
                width: product?.products?.width,
              },
            ];
          }
        });
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
          idFavorite: favorite.idFavorite,
        },
        "/favorites/removeFavorites",
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
