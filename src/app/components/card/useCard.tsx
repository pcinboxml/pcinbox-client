"use client";

import ProductI from "@/app/interfaces/products/product.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useCartSync from "@/app/hooks/useCartSync";
import { useState } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const useCard = () => {
  const { setDataCart, setDataModal, setDataNotification, hasToken, dataCart } =
    useTheContext();
  const { requestPost } = useService();
  const { refreshCartFromServer } = useCartSync();

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
      setDataModal({
        isOpen: true,
        message: "Tu sesión expiro, debes iniciar sesión nuevamente.",
        title: "Sesión expirada",
        onClose: () => {
          // location.href = "/principal";
          //  localStorage.clear();
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: async () => {
          // location.href = "/principal";
          //  localStorage.clear();

          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        type: "info",
      });

      return;
      // const stored = localStorage.getItem("dataCart");
      // const products: (typeof product)[] = stored ? JSON.parse(stored) : [];
      // const existingProductIndex = products.findIndex(
      //   (p: any) => p.idProduct == product.idProduct,
      // );

      // if (existingProductIndex != -1) {
      //   products[existingProductIndex].quantity += 1;
      // } else {
      //   products.push({
      //     ...product,
      //     quantity: 1,
      //   });
      // }

      // localStorage.setItem("dataCart", JSON.stringify(products));

      // setDataNotification({
      //   open: true,
      //   handleClose: () =>
      //     setDataNotification((prevNoti) => ({
      //       ...prevNoti,
      //       open: false,
      //     })),
      //   message: `${product.name} agregado al carrito correctamente`,
      //   type: "success",
      // });

      // setDataCart(JSON.parse(localStorage.getItem("dataCart") || "") || []);
      // return;
    }

    try {
      setLoadingAgregar(true);

      const resp = await requestPost(
        {
          idProduct: Number(product?.idProduct),
          quantity: 1,
          price: product.price,
          storeId: product.storeId ?? null,
          isDetails: false,
        },
        "/cart/addProduct",
      );

      setLoadingAgregar(false);

      if (resp && resp.status == 200) {
        await refreshCartFromServer();
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
    progressRating: { rating: number },
  ) => {
    const totalReviews = product.reviews.length; // total de reviews del producto
    const ratingCount = product.reviews.filter(
      (r) => r.rating === progressRating.rating,
    ).length;

    const percentage =
      totalReviews > 0 ? (ratingCount / totalReviews) * 100 : 0;

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
