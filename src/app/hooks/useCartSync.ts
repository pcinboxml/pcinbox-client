"use client";



import ProductI from "../interfaces/products/product.interface";

import { useTheContext } from "../services/globalContext";

import useService from "../services/useService";

import useStorage from "../services/useStorage";

import {
  clearLocalCartStorage,
  discardStaleLocalCartIfNotMergeable,
  readLocalCartStorageForMerge,
  writeLocalCartStorageFromProducts,
} from "../utils/cartSync";



type ApplyCartOptions = {

  /** Permite vaciar localStorage cuando el servidor confirma carrito vacío. */

  allowEmpty?: boolean;

};



function cartHasItems(items: ProductI[]) {

  return items.length > 0;

}



export default function useCartSync() {

  const { setDataCart, hasToken, dataCart } = useTheContext();

  const { requestGet, requestPost } = useService();

  const { handleWriteStorageDataCart } = useStorage();



  const applyCartItems = (items: ProductI[], options: ApplyCartOptions = {}) => {

    const { allowEmpty = false } = options;



    setDataCart(items);



    if (cartHasItems(items)) {
      if (!hasToken) {
        writeLocalCartStorageFromProducts(items);
      }
      handleWriteStorageDataCart(items);
      return;
    }



    if (allowEmpty) {

      clearLocalCartStorage();

      handleWriteStorageDataCart([]);

    }

  };



  const refreshCartFromServer = async (): Promise<ProductI[]> => {

    if (!hasToken) {

      return [];

    }



    const previousItems = dataCart ?? [];



    try {

      const resp = await requestGet("/cart/getCart", true);

      if (resp?.status === 200) {

        const items = Array.isArray(resp.data?.data) ? resp.data.data : [];



        if (!cartHasItems(items) && cartHasItems(previousItems)) {
          await new Promise((resolve) => setTimeout(resolve, 350));

          const retry = await requestGet("/cart/getCart", true);

          if (retry?.status === 200) {
            const retryItems = Array.isArray(retry.data?.data)
              ? retry.data.data
              : [];

            applyCartItems(retryItems, { allowEmpty: true });
            return retryItems;
          }
        }

        applyCartItems(items, { allowEmpty: true });
        return items;

      }

    } catch {

      return previousItems;

    }



    return previousItems;

  };



  const mergeLocalCartIntoServer = async () => {
    if (!hasToken) return refreshCartFromServer();

    discardStaleLocalCartIfNotMergeable();

    const localRefs = readLocalCartStorageForMerge();

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

        clearLocalCartStorage();

      } catch {

        // Conservar localStorage para reintentar en el próximo sync.

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

      const localItems = dataCart.map((item) =>

        String(item.idProduct) === String(product.idProduct) &&

        String(item.storeId ?? "") === String(product.storeId ?? "")

          ? { ...item, quantity }

          : item,

      );

      applyCartItems(localItems, { allowEmpty: true });

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



  const clearCartEverywhere = async () => {

    if (hasToken) {

      await requestPost({}, "/cart/removeAllCart");

    }

    applyCartItems([], { allowEmpty: true });

  };



  return {

    refreshCartFromServer,

    mergeLocalCartIntoServer,

    syncCartOnAuth,

    syncCartLineQuantity,

    clearCartEverywhere,

  };

}


