"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import useService from "../services/useService";
import ProductI from "../interfaces/products/product.interface";
import useProveedores from "../services/proveedores/useProveedores";
import io from "./../services/ioClient";
const usePrincipal = () => {
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [dataProducts, setDataProducts] = useState<ProductI[]>([]);
  const [newProduct, setNewProduct] = useState({
    categoryId: "",
    description: "",
    image_url: "",
    name: "",
    price: "",
    providerId: "",
    stock: 150,
    quantity: 2,
    rating: 0,
  });

  // const [pagination, setPagination] = useState(() => {
  //   const initialPagination = [
  //     {
  //       id: 1,
  //       currentPage: 1,
  //     },
  //     {
  //       id: 2,
  //       currentPage: 1,
  //     },
  //     {
  //       id: 3,
  //       currentPage: 1,
  //     },
  //   ];
  //   const itemsPerPage = 6;

  //   return initialPagination.map((item) => {
  //     const starIndex = (item.currentPage - 1) * itemsPerPage;
  //     const endIndex = starIndex + itemsPerPage;
  //     const paginatedProducts = dataProducts.slice(starIndex, endIndex);
  //     // const pageCount = Math.ceil(dataProducts.length / itemsPerPage);
  //     return {
  //       ...item,
  //       startIndex: starIndex,
  //       endIndex: endIndex,
  //       paginatedProduct: paginatedProducts,
  //       // pageCount: pageCount,
  //     };
  //   });
  // });

  const { requestGet } = useService();
  const { requestGetProducts, requestPostProveedor } = useProveedores();

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const paginatedProducts = dataProducts.slice(startIndex, endIndex);
  // const pageCount = Math.ceil(dataProducts.length / itemsPerPage);

  const handleClick = async () => {
    try {
      const res = await requestGet("/categories/list");
    } catch (error: any) {}
  };

  const getListProducts = async () => {
    fetch("http://localhost:8001/api/v1/proveedores/getAllProduct").then(
      async (res) => {
        const data = await res.json();

        setDataProducts(data.data);
      }
    );

    io.on("newAllProducts", (inputDataSocket: any) => {
      console.log("escuchando newAllProducts");
      setDataProducts((prev) => [
        ...prev,
        ...inputDataSocket.map((item: any) => ({
          categoryId: item.categoryId,
          description: item.description,
          name: item.name,
          price: item.price,
          stock: item.stock,
          image_url: item.image_url,
          idProduct: item.idProduct,
          providerId: item.providerId,
          rating: item.rating,
          quantity: item.stock,
          reviews: item.reviews.filter(
            (item2: any) => item2.productId == item.idProduct
          ),
          createdAt: "",
        })),
      ]);
    });
    io.on("updateAllProducts", (inputDataSocket: any[]) => {
      // console.log("escuchando updateAllProducts");
      // console.log(inputDataSocket);
      setDataProducts((prev) =>
        prev.map((itemProduct) => {
          const updated = inputDataSocket.find(
            (p) => p.idProduct === itemProduct.idProduct
          );

          return updated
            ? {
                categoryId: updated.categoryId,
                description: updated.description,
                name: updated.name,
                price: updated.price,
                stock: updated.stock,
                image_url: updated.image_url,
                idProduct: updated.idProduct,
                providerId: updated.providerId,
                quantity: updated.stock,
                rating: updated.rating,
                reviews: updated.reviews.filter(
                  (item: any) => item.productId == updated.idProduct
                ),
                createdAt: "",
              }
            : itemProduct;
        })
      );
    });

    return () => {
      io.off("newAllProducts");
      io.off("updateAllProducts");
    };

    // try {
    //   setLoadingProducts(false);
    //   const resp = await requestGetProducts();

    //   setLoadingProducts(true);

    //   if (resp && resp.status == 200) {
    //     setDataProducts(resp.data.data);
    //   }
    // } catch (error) {
    //   setLoadingProducts(false);
    // }
  };

  const changePagination = (
    event: React.ChangeEvent<any>,
    page: number,
    id: number
  ) => {
    //setCurrentPage(page);
    // setPagination((prev) => {
    //   let findId = prev.find((item) => item.id == id);
    //   if (findId) {
    //     findId.currentPage = page;
    //   }
    //   return prev;
    // });
    //sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitNewProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resp = await requestPostProveedor(newProduct, "/newProduct");
    const data = await resp.data;
    const status = await resp.status;

    console.log(newProduct);
    console.log(data);
    console.log(status);
  };

  return {
    handleClick,
    getListProducts,
    dataProducts,
    loadingProducts,
    changePagination,
    handleOnChange,
    onSubmitNewProduct,
    setDataProducts,
  };
};

export default usePrincipal;
