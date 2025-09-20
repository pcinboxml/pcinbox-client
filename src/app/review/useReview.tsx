"use client";

import { ChangeEvent, useState } from "react";
import useProveedores from "../services/proveedores/useProveedores";
import ProductI from "../interfaces/products/product.interface";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";

const ReviewsRating = [
  {
    id: 1,
    rating: 5,
  },
  {
    id: 2,
    rating: 4,
  },
  {
    id: 3,
    rating: 3,
  },
  {
    id: 4,
    rating: 2,
  },
  {
    id: 5,
    rating: 1,
  },
];

const useReview = () => {
  const { setDataCart } = useTheContext();
  const { requestGetProveedor } = useProveedores();
  const { requestPost } = useService();

  const [dataProduct, setDataProduct] = useState<ProductI | null>(null);
  const [loadingAddProductCar, setLoadingAddProductCar] =
    useState<boolean>(false);

  const handleGetProduct = async (idProduct: number) => {
    try {
      const resp = await requestGetProveedor(
        `/getProduct?idProduct=${idProduct}`
      );
      const status = await resp.status;
      const data = await resp.data;
      if (status == 200) {
        setDataProduct({
          createdAt: data.data.data.createdAt,
          description: data.data.data.description,
          idProduct: data.data.data.idProduct,
          image_url: data.data.data.image_url,
          name: data.data.data.name,
          price: data.data.data.price,
          rating: data.data.data.rating,
          stock: data.data.data.stock,
          reviews: data.data.data.reviews.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
          categoryId: "",
          quantity: 0,
          providerId: "",
        });
      }
    } catch (error) {}
  };

  const handleAddProductCart = async (productProp: ProductI) => {
    try {
      setLoadingAddProductCar(true);

      const resp = await requestPost(
        {
          product: productProp,
          quantity: 1,
          price: productProp.price,
          isDetails: false,
        },
        "/cart/addProduct"
      );

      setLoadingAddProductCar(false);

      if (resp.status == 200) {
        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) => Number(item.idProduct) === Number(productProp.idProduct)
          );
          if (existingProduct) {
            return prev.map((item) =>
              Number(item.idProduct) == Number(existingProduct.idProduct)
                ? { ...item, quantity: Number(item.quantity) + Number(1) }
                : item
            );
          } else {
            return [
              ...prev,
              {
                categoryId: productProp.categoryId,
                createdAt: productProp.createdAt,
                description: productProp.description,
                idProduct: productProp.idProduct,
                image_url: productProp.image_url,
                name: productProp.name,
                price: productProp.price,
                providerId: productProp.providerId,
                stock: productProp.stock,
                rating: productProp.rating,
                reviews: productProp.reviews,
                quantity: 1,
              },
            ];
          }
        });
      }
    } catch (error) {
      setLoadingAddProductCar(false);
    }
  };

  const calcPorcentaje = (product: ProductI, rating: number) => {
    if (product) {
      const ratingCount = product.reviews.reduce((acc, item) => {
        if (item.rating === rating) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const totalRatingCount = product.reviews.length;

      const percentage =
        totalRatingCount > 0 ? (ratingCount / totalRatingCount) * 100 : 0;

      return {
        percentage,
        rating: rating,
        ratingCount,
        totalRatingCount,
      };
    } else {
      return {
        percentage: 0,
        rating: 0,
        ratingCount: 0,
        totalRatingCount: 0,
      };
    }
  };

  const handleChangeOrdenar = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (dataProduct) {
      setDataProduct((prev) => {
        if (!prev) return prev;

        const sortedReviews =
          value == "1"
            ? [...prev.reviews].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
            : value == "2"
            ? [...prev.reviews].sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
            : value == "3"
            ? [...prev.reviews].sort((a, b) => b.rating - a.rating)
            : [...prev.reviews].sort((a, b) => a.rating - b.rating);

        return {
          ...prev,
          reviews: sortedReviews,
        };
      });
    }
  };

  return {
    handleGetProduct,
    handleAddProductCart,
    handleChangeOrdenar,
    calcPorcentaje,
    dataProduct,
    loadingAddProductCar,
    ReviewsRating,
  };
};
export default useReview;
