"use client";

import ProductI from "../interfaces/products/product.interface";

const useProducts = () => {
  const groupProducts = (products: ProductI[]) => {
    const grouped = Object.values(
      products.reduce((acc, item) => {
        const id = Number(item.idProduct);
        const numericPrice = Number(item.price);

        if (!acc[id]) {
          acc[id] = {
            ...item,
            quantity: 1,
            price: numericPrice,
          };
        } else {
          acc[id].quantity += 1;
          acc[id].price += numericPrice;
        }

        return acc;
      }, {} as Record<number, any>)
    );

    return grouped;
  };

  const mergeProductsById = (products: ProductI[]): ProductI[] => {
    const mergedMap = new Map<string, ProductI>();

    products.forEach((product) => {
      const existing = mergedMap.get(product.idProduct);

      if (existing) {
        mergedMap.set(product.idProduct, {
          ...existing,
          quantity: existing.quantity + product.quantity,
        });
      } else {
        mergedMap.set(product.idProduct, { ...product });
      }
    });

    return Array.from(mergedMap.values());
  };

  return {
    groupProducts,
    mergeProductsById,
  };
};

export default useProducts;
