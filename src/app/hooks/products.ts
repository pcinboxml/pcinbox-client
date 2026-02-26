"use client";

import { useEffect, useState } from "react";
import ProductI from "../interfaces/products/product.interface";

const useProducts = () => {
  const [products, setProducts] = useState<ProductI[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_PROVEEDOR}/getAllProduct`,
      );
      const data = await res.json();
      setProducts(data?.data ?? []);
    };

    getProducts();
  }, []);

  return {
    products,
  };
};

export default useProducts;
