"use client";

import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import useStorage from "../services/useStorage";
import {
  clearLocalCartStorage,
  readLocalCartStorage,
  writeLocalCartStorageFromProducts,
} from "../utils/cartSync";

export default function useCartSync() {
  const { setDataCart, hasToken } = useTheContext();
  const { requestGet, requestPost } = useService();
  const { handleWriteStorageDataCart } = useStorage();

  const applyCartItems = (items: ProductI[]) => {
    setDataCart(items);
    if (hasToken) {
      clearLocalCartStorage();
    } else {
      writeLocalCartStorageFromProducts(items);
      handleWriteStorageDataCart(items);
    }
  };

  const refreshCartFromServer = async (): Promise<ProductI[]> => {
    if (!hasToken) {
      return [];
    }

    try {
      const resp = await requestGet("/cart/getCart", true);
      if (resp?.status === 200) {
        const items = Array.isArray(resp.data?.data) ? resp.data.data : [];
        applyCartItems(items);
        return items;
      }
    } catch {
      // sin servidor autenticado no hay carrito persistido local útil
    }

    applyCartItems([]);
    return [];
  };

  const mergeLocalCartIntoServer = async () => {
    if (!hasToken) return refreshCartFromServer();

    const localRefs = readLocalCartStorage();
    if (localRefs.length > 0) {
      try {
        await requestPost(
          {
            dataCart: localRefs.map((item) => ({
              idProduct: item.idProduct,
              quantity: Number(item.quantity) || 1,
              storeId: item.storeId ?? null,
            })),
          },
          "/cart/addProductFromStorage",
        );
      } catch {
        clearLocalCartStorage();
      }
    }

    return refreshCartFromServer();
  };

  const syncCartOnAuth = async () => {
    if (!hasToken) return [];
    return mergeLocalCartIntoServer();
  };

  const syncCartLineQuantity = async (product: ProductI, quantity: number) => {
    if (!hasToken) {
      const localItems = (await refreshCartFromServer()).map((item) =>
        String(item.idProduct) === String(product.idProduct) &&
        String(item.storeId ?? "") === String(product.storeId ?? "")
          ? { ...item, quantity }
          : item,
      );
      applyCartItems(localItems);
      return localItems;
    }

    await requestPost(
      {
        idProduct: Number(product.idProduct),
        quantity,
        storeId: product.storeId ?? null,
        isDetails: false,
      },
      "/cart/addProduct",
    );

    return refreshCartFromServer();
  };

  const clearCartEverywhere = async (items: ProductI[]) => {
    if (hasToken) {
      await requestPost({ dataCart: items }, "/cart/removeAllCart");
    }
    clearLocalCartStorage();
    applyCartItems([]);
  };

  return {
    refreshCartFromServer,
    mergeLocalCartIntoServer,
    syncCartOnAuth,
    syncCartLineQuantity,
    clearCartEverywhere,
  };
}
