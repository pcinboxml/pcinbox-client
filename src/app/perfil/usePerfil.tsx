"use client";

import { ChangeEvent, useState } from "react";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";

const usePerfil = () => {
  const { setDataModal } = useTheContext();
  const { requestPost, requestGet } = useService();

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [rutaImg, setRutaImg] = useState<string>("");

  const onChangeUploadPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];

    if (file) {
      if (
        file.type != "image/png" &&
        file.type != "image/jpeg" &&
        file.type != "image/jpg"
      ) {
        setDataModal({
          isOpen: true,
          type: "error",
          title: `Archivo no permitido`,
          message: `El archivo ${file.name} no está permitido para usarlo como foto de perfil`,
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        setShowLoader(true);
        const resp = await requestPost(formData, "/user/uploadPhotoUser");
        setShowLoader(false);
        if (resp.status == 200) {
          setRutaImg(resp.data.data.rutaImg);
          setDataModal({
            isOpen: true,
            type: "success",
            title: `Correcto`,
            message: "Foto actualizada correctamente",
            onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
            onConfirm: () => {
              setDataModal((prev) => ({ ...prev, isOpen: false }));
            },
          });
          return;
        }
      } catch (error: any) {
        setShowLoader(false);
        setDataModal({
          isOpen: true,
          type: "error",
          title: `Error`,
          message: error.response.data.message || error.message,
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }
    }
  };

  const getPhotoUser = async () => {
    try {
      const resp = await requestGet("/user/getPhotoUser");
      if (resp.status == 200) {
        setRutaImg(resp.data.data.rutaImg);
      }
    } catch (error: any) {
      setShowLoader(false);

      setDataModal({
        isOpen: true,
        type: "error",
        title: `Error`,
        message: error.response.data.message || error.message,
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }
  };

  return {
    showLoader,
    rutaImg,
    onChangeUploadPhoto,
    getPhotoUser,
  };
};

export default usePerfil;
