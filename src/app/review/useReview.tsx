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
      const resp = await requestGetProveedor(`/getProduct/${idProduct}`);
      const status = await resp.status;
      const data = await resp.data;
      if (status == 200) {
        console.log(data.data.data);
        setDataProduct({
          ...data?.data?.data,
          active: data.data.data.active,
          caracteristicas: data.data.data.caracteristicas,
          categoryId: data.data.data.categoryId,
          createdAt: data.data.data.createdAt,
          description: data.data.data.description,
          height: data.data.data.height,
          idProduct: data.data.data.idProduct,
          idProductExt: data.data.data.idProductExt,
          imageUrl: data?.data?.data?.imageUrl,
          image_url: data?.data?.data?.image_url,
          isPC: data?.data?.data?.isPC,
          largo: data?.data?.data?.largo,
          marcaId: data?.data?.data?.marcaId,
          name: data?.data?.data?.name,
          peso: null,
          price: data?.data?.data?.price,
          product_stock: data?.data?.data?.product_stock,
          providerId: data?.data?.data?.providerId,
          rating: 0,
          reviews: data.data.data.reviews.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
          sku: data?.data?.data?.sku,
          stock: data?.data?.data?.stock,
          upc: data?.data?.data?.upc,
          width: data?.data?.data?.width,
          quantity: 0,
          // isPC: data?.data?.data?.isPC,
          // isPc: data?.data?.data?.isPc,
          // caracteristicas: data?.data?.data?.caracteristicas,
          // height: data?.data?.data?.height,
          // idProductExt: data?.data?.data?.idProductExt,
          // largo: data?.data?.data?.largo,
          // product_stock: data?.data?.data?.product_stock,
          // storeId: data?.data?.data?.storeId,
          // upc: data?.data?.data?.upc,
          // width: data?.data?.data?.width,
          // createdAt: data.data.data.createdAt,
          // description: data.data.data.description,
          // idProduct: data.data.data.idProduct,
          // imageUrl: data.data.data.imageUrl,
          // name: data.data.data.name,
          // price: data.data.data.price,
          // rating: data.data.data.rating,
          // sku: data.data.data.sku,
          // stock: data.data.data.stock,
          // reviews: data.data.data.reviews.sort(
          //   (a: any, b: any) =>
          //     new Date(a.date).getTime() - new Date(b.date).getTime(),
          // ),

          // quantity: 0,
        });
      }
    } catch (error) {}
  };

  const handleAddProductCart = async (productProp: ProductI) => {
    try {
      setLoadingAddProductCar(true);

      const resp = await requestPost(
        {
          //  product: productProp,
          idProduct: productProp?.idProduct,
          quantity: 1,
          price: productProp.price,
          isDetails: false,
        },
        "/cart/addProduct",
      );

      setLoadingAddProductCar(false);

      if (resp.status == 200) {
        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) => Number(item.idProduct) === Number(productProp.idProduct),
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
                categoryId: productProp.categoryId,
                createdAt: productProp.createdAt,
                description: productProp.description,
                idProduct: productProp.idProduct,
                imageUrl: productProp.imageUrl,
                name: productProp.name,
                price: productProp.price,
                providerId: productProp.providerId,
                stock: productProp.stock,
                rating: productProp.rating,
                reviews: productProp.reviews,
                sku: productProp.sku,
                quantity: 1,
                isPC: productProp?.isPC,
                isPc: productProp?.isPc,
                caracteristicas: productProp?.caracteristicas,
                height: productProp?.height,
                idProductExt: productProp?.idProductExt,
                largo: productProp?.largo,
                product_stock: productProp?.product_stock,
                storeId: productProp?.storeId,
                upc: productProp?.upc,
                width: productProp?.width,
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
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )
            : value == "2"
              ? [...prev.reviews].sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
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
