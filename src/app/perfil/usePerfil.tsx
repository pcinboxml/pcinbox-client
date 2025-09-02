"use client";

import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { DataSendI } from "../interfaces/perfil/perfil.interface";
import PostalCodeLookupI from "../interfaces/geonames/postalCodeLookupJSON/postalCodeLookupJSON.interface";

const usePerfil = () => {
  const { setDataModal } = useTheContext();
  const { requestPost, requestGet } = useService();

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [rutaImg, setRutaImg] = useState<string>("");
  const [dataPerfil, setDataPerfil] = useState<{
    email: string;
    name: string;
    lastname: string;
  }>({ email: "", name: "", lastname: "" });

  const [dataAddress, setDataAddress] = useState<DataSendI>({
    street: "",
    noExt: "",
    noInt: "",
    codePostal: 0,
    cologne: "",
    state: "",
    city: "",
    phone1: "",
    phone2: "",
    country: "México",
  });
  const [postalCodes, setPostalCodes] = useState<PostalCodeLookupI[]>([]);
  const [loadingDataAddress, setLoadingDataAddress] = useState<boolean>(false);

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

  const handleOnChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name == "codePostal" && value.length == 5) {
      const resp = await requestPost(
        {
          postalCode: value,
        },
        "/geonames/getAddressWithPostalCode"
      );

      if (resp.status == 200) {
        const dataResp = await resp.data.data;

        setPostalCodes(dataResp.postalcodes);
      }
    } else if (name == "codePostal" && value.length < 5) {
      setPostalCodes([]);
    }

    setDataAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const excludeKeys = ["noInt", "phone2"];

    const emptyFields = Object.entries(dataAddress)
      .filter(
        ([key, value]) =>
          !excludeKeys.includes(key) &&
          (value === "" || value === null || value === undefined)
      )
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      setDataModal({
        isOpen: true,
        message: "Completa los campos",
        title: "Error",
        type: "error",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setLoadingDataAddress(true);

    try {
      const resp = await requestPost(dataAddress, "/address/registerAddress");

      setLoadingDataAddress(false);

      if (resp && resp.status == 200) {
        setDataModal({
          isOpen: true,
          message: "Tu domicilio se creo correctamente",
          title: "Correcto",
          type: "success",
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        });
        return;
      }
    } catch (error: any) {
      setLoadingDataAddress(false);

      setDataModal({
        isOpen: true,
        message: error.response.data.message,
        title: "Error",
        type: "error",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    console.log(dataAddress);
  };

  const handleOnSelect = async (
    event: SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const { name, value } = event.currentTarget;

    setDataAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    showLoader,
    rutaImg,
    dataPerfil,
    dataAddress,
    postalCodes,
    loadingDataAddress,
    setDataPerfil,
    onChangeUploadPhoto,
    getPhotoUser,
    handleOnChange,
    onSubmit,
    setDataAddress,
    handleOnSelect,
  };
};

export default usePerfil;
