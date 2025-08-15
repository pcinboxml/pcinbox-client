"use client";

import { useMemo, useRef, useState } from "react";
import useService from "../services/useService";

const useIndex = () => {
  const MARCAS = [
    {
      id: 1,
      name: "Apple",
      img: "/apple.jpg",
    },
    {
      id: 2,
      name: "Samsung",
      img: "/samsung.jpg",
    },
    {
      id: 3,
      name: "Dell",
      img: "/dell.jpg",
    },
    {
      id: 4,
      name: "HP",
      img: "/hp.jpg",
    },
    {
      id: 5,
      name: "Lenovo",
      img: "/lenovo.jpg",
    },
    {
      id: 6,
      name: "ASUS",
      img: "asus.jpg",
    },
    {
      id: 7,
      name: "Nintendo",
      img: "/nintendo.jpg",
    },
    {
      id: 8,
      name: "Sony",
      img: "/sony.jpg",
    },
  ];

  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [dataProducts, setDataProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const sectionRef = useRef<HTMLDivElement>(null);

  //  const cacheProduct = useMemo(() => {
  //   return loadingProducts ? dataProducts : []
  //  }, [dataProducts, loadingProducts])

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

  const changePagination = (event: React.ChangeEvent<any>, page: number) => {
    setCurrentPage(page);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    handleClick,
    getListProducts,
    dataProducts,
    loadingProducts,
    MARCAS,
    changePagination,
    itemsPerPage,
    currentPage,
    sectionRef,
  };
};

export default useIndex;
