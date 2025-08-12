"use client";

import { useState } from "react";
import useService from "../services/useService";

const useIndex = () => {
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [dataProducts, setDataProducts] = useState([]);

  const { requestGet } = useService();

  const handleClick = async () => {
    try {
      const res = await requestGet("/categories/list");
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const getListProducts = async () => {
    try {
      setLoadingProducts(false);
      const resp = await requestGet("/products/getList");

      setLoadingProducts(true);

      if (resp && resp.status == 200) {
        setDataProducts(resp.data.data);
      }
    } catch (error) {
      setLoadingProducts(false);
      console.log("error");
      console.log(error);
    }
  };

  return {
    handleClick,
    getListProducts,
    dataProducts,
    loadingProducts,
  };
};

export default useIndex;
