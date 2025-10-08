"use client";

import { useState } from "react";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";

const useWriteReview = () => {
  const { setDataModal } = useTheContext();
  const { requestPost, onRouterLink } = useService();
  const [dataAddReview, setDataAddReview] = useState<{
    title: string;
    message: string;
    rating: number;
    idProduct?: string;
  }>({
    title: "",
    message: "",
    rating: 0,
    idProduct: "",
  });

  const [loadingAddReview, setLoadingAddReview] = useState<boolean>(false);

  const handleAddReview = async () => {
    if (dataAddReview.idProduct) {
      if (
        !dataAddReview.message.trim() ||
        !dataAddReview.rating ||
        !dataAddReview.title.trim()
      ) {
        setDataModal({
          isOpen: true,
          message: "Completa los campos",
          title: "Error",
          type: "error",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            {
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            }
          },
        });
        return;
      }

      try {
        setLoadingAddReview(true);

        const resp = await requestPost(
          {
            review: dataAddReview.message.trim(),
            productId: dataAddReview.idProduct,
            reviewerName:
              localStorage.getItem("name")! + localStorage.getItem("lastname")!,
            rating: dataAddReview.rating,
          },
          "/review/addReview"
        );
        setLoadingAddReview(false);

        if (resp.status == 200) {
          setDataModal({
            isOpen: true,
            message: "Opinión registrada correctamente",
            title: "Registro de opinion",
            type: "success",
            onClose: () => {
              setDataModal((prev) => ({ ...prev, isOpen: false }));
              setDataAddReview({
                title: "",
                message: "",
                rating: 0,
              });
              onRouterLink(`/review?idProduct=${dataAddReview.idProduct}`);
            },
            onConfirm: () => {
              {
                setDataModal((prev) => ({ ...prev, isOpen: false }));
                setDataAddReview({
                  title: "",
                  message: "",
                  rating: 0,
                });
              }
            },
          });
        }
      } catch (error) {
        setLoadingAddReview(false);
      }
    }
  };

  return {
    setDataAddReview,
    handleAddReview,
    loadingAddReview,
    dataAddReview,
  };
};

export default useWriteReview;
