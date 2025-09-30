"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { useState } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const useCard = () => {
  const { setDataCart, setDataModal, setDataNotification, hasToken } =
    useTheContext();
  const { requestPost } = useService();

  const [loadingAgregar, setLoadingAgregar] = useState<boolean>(false);

  const ratingProgress = [
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

  const handleAddProductCart = async (product: ProductI) => {
    if (!hasToken) {
      const stored = localStorage.getItem("dataCart");
      const products: (typeof product)[] = stored ? JSON.parse(stored) : [];
      const existingProductIndex = products.findIndex(
        (p: any) => p.idProduct == product.idProduct
      );

      if (existingProductIndex != -1) {
        products[existingProductIndex].quantity += 1;
      } else {
        products.push({
          ...product,
          quantity: 1,
        });
      }

      localStorage.setItem("dataCart", JSON.stringify(products));

      setDataNotification({
        open: true,
        handleClose: () =>
          setDataNotification((prevNoti) => ({
            ...prevNoti,
            open: false,
          })),
        message: `${product.name} agregado al carrito correctamente`,
        type: "success",
      });

      setDataCart(JSON.parse(localStorage.getItem("dataCart") || "") || []);
      return;
    }

    try {
      setLoadingAgregar(true);

      const resp = await requestPost(
        {
          product: product,
          quantity: 1,
          price: product.price,
          isDetails: false,
        },
        "/cart/addProduct"
      );

      setLoadingAgregar(false);

      if (resp && resp.status == 200) {
        setDataNotification({
          open: true,
          handleClose: () =>
            setDataNotification((prevNoti) => ({
              ...prevNoti,
              open: false,
            })),
          message: "Producto agregado al carrito correctamente",
          type: "success",
        });

        setDataCart((prev) => {
          const existingProduct = prev.find(
            (item) => Number(item.idProduct) === Number(product.idProduct)
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
                categoryId: product.categoryId,
                createdAt: product.createdAt,
                description: product.description,
                idProduct: product.idProduct,
                imageUrl: product.imageUrl,
                name: product.name,
                price: product.price,
                providerId: product.providerId,
                stock: product.stock,
                rating: product.rating,
                reviews: product.reviews,
                sku: product.sku,
                quantity: 1,
              },
            ];
          }
        });
      }
    } catch (error: any) {
      setLoadingAgregar(false);

      setDataModal({
        isOpen: true,
        title: "Error",
        type: "error",
        message: error.response.message || error.message,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  const calcPorcentaje = (
    product: ProductI,
    dataProducts: ProductI[],
    progressRating: any
  ) => {
    const ratingCount = product.reviews.reduce((acc, item) => {
      if (item.rating === progressRating.rating) {
        return acc + 1;
      }
      return acc;
    }, 0);

    const totalRatingCount = dataProducts.reduce((acc, item) => {
      if (item.reviews) {
        return (
          acc +
          item.reviews.filter(
            (r) =>
              r.rating === progressRating.rating &&
              item.idProduct == product.idProduct
          ).length
        );
      } else {
        return 0;
      }
    }, 0);

    const percentage =
      totalRatingCount > 0 ? (ratingCount / totalRatingCount) * 100 : 0;

    return {
      percentage,
      rating: progressRating.rating,
    };
  };

  const CustomPrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          ...style,
          left: 5,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MdArrowBackIosNew size={20} color="#BB3D4B" />
      </div>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          ...style,
          right: 5,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MdArrowForwardIos size={20} color="#BB3D4B" />
      </div>
    );
  };

  return {
    handleAddProductCart,
    calcPorcentaje,
    CustomPrevArrow,
    CustomNextArrow,
    loadingAgregar,
    ratingProgress,
  };
};

export default useCard;
