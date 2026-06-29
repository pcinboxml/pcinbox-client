"use client";

import { useEffect, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import { publicEnv } from "@/app/config/env";

const useProducts = () => {
  const [products, setProducts] = useState<ProductI[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch(
        `${publicEnv.apiUrlProveedor}/getAllProduct`,
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
