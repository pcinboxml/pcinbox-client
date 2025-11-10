"use client";

import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { useTheContext } from "../../services/globalContext";
import useService from "../../services/useService";
import {
  CatalagosCFDI,
  DataSendI,
  FacturacionI,
} from "../../interfaces/perfil/perfil.interface";
import PostalCodeLookupI from "../../interfaces/geonames/postalCodeLookupJSON/postalCodeLookupJSON.interface";

const useFormFactura = () => {
  const { setDataModal, setRutaImgPerfil } = useTheContext();
  const { requestPost, requestGet } = useService();

  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [dataPerfil, setDataPerfil] = useState<{
    email: string;
    name: string;
    lastname: string;
  }>({ email: "", name: "", lastname: "" });
  const [showLineaProgress, setShowLinearProgress] = useState<boolean>(false);

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
  const [catalagoCFDi, setCatalagoCFDI] = useState<{
    regimenesFiscales: {
      clave: string;
      descripcion: string;
    }[];
    usosCFDI: {
      clave: string;
      descripcion: string;
      persona: string;
    }[];
  } | null>();

  const [dataFacturacion, setDataFacturacion] = useState<FacturacionI>({
    // street: "",
    // noExt: "",
    // noInt: "",
    codePostal: 0,
    // cologne: "",
    state: "",
    city: "",
    CFDI: "",
    companyName: "",
    methodPay: "",
    // observations: "",
    rfc: "",
    taxRegimen: "",
    country: "México",
  });
  const [postalCodes, setPostalCodes] = useState<PostalCodeLookupI[]>([]);
  const [postalCodes2, setPostalCodes2] = useState<PostalCodeLookupI[]>([]);
  const [loadingDataAddress, setLoadingDataAddress] = useState<boolean>(false);
  const [loadingDataFacturacion, setLoadingDataFacturacion] =
    useState<boolean>(false);

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
        setShowLinearProgress(true);
        setShowLoader(true);
        const resp = await requestPost(formData, "/user/uploadPhotoUser");
        setShowLoader(false);
        setShowLinearProgress(false);
        if (resp.status == 200) {
          setRutaImgPerfil(resp.data.data.rutaImg);
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
        setShowLinearProgress(false);
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
        setRutaImgPerfil(resp.data.data.rutaImg);
      }
    } catch (error: any) {}
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

  const handleOnChange2 = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

        setPostalCodes2(dataResp.postalcodes);
        setDataFacturacion((prev) => ({
          ...prev,
          state: dataResp.postalcodes[0].adminName1,
          city: dataResp.postalcodes[0].adminName3,
        }));
      }
    } else if (name == "codePostal" && value.length < 5) {
      setPostalCodes2([]);
    }

    setDataFacturacion((prev) => ({
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
        message: "Ocurrio un error, intentalo de nuevo",
        title: "Error",
        type: "error",
        onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
        onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }
  };

  const onSubmit2 = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const excludeKeys = ["noInt", "observations"];

    const emptyFields = Object.entries(dataFacturacion)
      .filter(
        ([key, value]) =>
          !excludeKeys.includes(key) &&
          (value === "" || value === null || value === undefined)
      )
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      //   setDataModal({
      //     isOpen: true,
      //     message: "Completa los campos",
      //     title: "Error",
      //     type: "error",
      //     onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      //     onConfirm: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
      //   });
      return;
    }

    try {
      setLoadingDataFacturacion(true);

      const resp = await requestPost(
        {
          companyName: dataFacturacion.companyName.trim(),
          rfc: dataFacturacion.rfc.trim(),
          cfdi: dataFacturacion.CFDI,
          taxRegimen: dataFacturacion.taxRegimen,
          methodPay: dataFacturacion.methodPay,
          codePostal: dataFacturacion.codePostal,
          state: dataFacturacion.state,
          city: dataFacturacion.city,
        },
        "/billing/createBilling"
      );

      setLoadingDataFacturacion(false);

      setDataModal((prev) => ({ ...prev, isOpen: false }));
      if (resp.status == 200) {
        setDataModal({
          isOpen: true,
          type: "success",
          title: "Correcto",
          message: "Datos de facturación registrados correctamente",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }
    } catch (error: any) {
      setLoadingDataFacturacion(false);

      setDataModal({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Ocurrio un error, intentelo de nuevo",
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
      return;
    }
  };

  const handleOnSelect = async (
    event: SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const { name, value } = event.currentTarget;

    setDataAddress((prev) => ({
      ...prev,
      cologne: name == "cologne" ? value : "",
      state: postalCodes[0].adminName1,
      city: postalCodes[0].adminName3,
    }));
  };

  const handleOnSelect2 = async (
    event: SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const { name, value } = event.currentTarget;

    if (name != "cologne" && name != "state" && name != "city") {
      setDataFacturacion((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setDataFacturacion((prev) => ({
        ...prev,
        cologne: name == "cologne" ? value : "",
        state: postalCodes2[0].adminName1,
        city: postalCodes2[0].adminName3,
      }));
    }
  };

  const getCatalagoCfdi = async () => {
    const resp = await fetch("/json/catalagoCfdi.json");
    if (resp.status == 200) {
      const data: CatalagosCFDI = await resp.json();
      setCatalagoCFDI(data);
    } else {
      setCatalagoCFDI(null);
    }
  };

  return {
    showLoader,
    dataPerfil,
    dataAddress,
    postalCodes,
    postalCodes2,
    dataFacturacion,
    loadingDataAddress,
    showLineaProgress,
    catalagoCFDi,
    loadingDataFacturacion,
    setDataPerfil,
    onChangeUploadPhoto,
    getPhotoUser,
    handleOnChange,
    handleOnChange2,
    onSubmit,
    onSubmit2,
    setDataAddress,
    handleOnSelect,
    handleOnSelect2,
    getCatalagoCfdi,
    //  getAddressAuth,
  };
};

export default useFormFactura;
