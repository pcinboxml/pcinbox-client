"use client";

import { ChangeEvent, useState } from "react";
import useService from "../services/useService";
import { AddressI } from "../interfaces/address/address.interface";
import { useTheContext } from "../services/globalContext";
import useStorage from "../services/useStorage";
import RegisterDomicilio from "../components/registerDomicilio/RegisterDomicilio";
import SelectDomicilio from "../components/selectDomicilio/SelectDomicilio";
import EliminarDomicilio from "../components/eliminarDomicilio/EliminarDomicilio";

const useOpcionesEntrega = () => {
  const {
    dataUserAddress,
    setDataUserAddress,
    setIsEditAddress,
    setDataAddress,
  } = useTheContext();

  const [costoEnvioByZone, setCostoEnvioByZone] = useState<{
    valor: number;
    loading: boolean;
    destino: string;
  }>({
    valor: 0,
    loading: false,
    destino: "",
  });

  const [optionEnvio, setOptionEnvio] = useState<string>("");

  const { requestGet, requestPost } = useService();

  const { setDataModal } = useTheContext();

  // const { handleWriteStorageProgressPay } = useStorage();

  const handleOnChangeOptionEnvio = async (
    event: ChangeEvent<HTMLInputElement>,
    costoEnvioByZone?: {
      valor: number;
      loading: boolean;
      destino: string;
    }
  ) => {
    const { value } = event.target;
    setOptionEnvio(value);

    // handleWriteStorageProgressPay({
    //   optionSend: {
    //     name: value,
    //   },
    // });

    if (value != "sucursal") {
      setDataModal({
        isOpen: true,
        title: "Selecciona el domicilio",
        type: "info",
        showActions: false,
        onClose: () => {
          setOptionEnvio("");

          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        message: (
          <SelectDomicilio
            optionEnvio={value}
            setOptionEnvio={setOptionEnvio}
          />
        ),
      });
    }
  };

  const handleOnChangeOptionEnvio2 = async (name: string) => {
    setOptionEnvio(name);
    // handleWriteStorageProgressPay({
    //   optionSend: {
    //     name: name,
    //   },
    // });
  };

  const handleRemoveAddress = async (address: AddressI) => {
    setDataModal({
      isOpen: true,
      type: "info",
      title: "Cuidado",
      message: (
        <EliminarDomicilio address={address} setOptionEnvio={setOptionEnvio} />
      ),
      showActions: false,
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: async () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const getValuesStorage = () => {
    const stored = localStorage.getItem("progressPay");
    if (stored) {
      const store = JSON.parse(stored);
      const name = store?.optionSend?.name;
      const costo = store?.optionsSend?.costo;
      if (name) {
        setOptionEnvio(name);
        setCostoEnvioByZone({
          loading: false,
          valor: Number(costo),
          destino: "",
        });
        handleOnChangeOptionEnvio2(name);
      }
    }
  };

  const loadingAddressUser = async () => {
    try {
      const resp = await requestGet("/address/hasAddressUser");
      const status = await resp.status;
      if (status == 200) {
        const data: AddressI[] = await resp.data.data.data;
        setDataUserAddress(data);
      }
    } catch (error: any) {
      setDataUserAddress([]);
    }
  };

  const handleFormRegisterAddress = () => {
    setIsEditAddress({
      edit: false,
      idAddress: 0,
    });
    setDataAddress({
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
    setDataModal({
      isOpen: true,
      type: "info",
      message: "",
      title: "Registrar domicilio",
      children: <RegisterDomicilio />,
      showActions: false,
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleFormEditAddress = async (addressProp: AddressI) => {
    setIsEditAddress({
      edit: true,
      idAddress: addressProp.idAddress,
    });

    setDataModal({
      isOpen: true,
      type: "info",
      message: "",
      title: "Editar domicilio",
      children: <RegisterDomicilio />,
      showActions: false,
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const generateCostoByZone = async (destino: string) => {
    try {
      setCostoEnvioByZone((prev) => ({ ...prev, loading: true }));
      const resp = await requestPost(
        {
          destino,
        },
        "/geonames/ShippingByZone"
      );
      setCostoEnvioByZone((prev) => ({ ...prev, loading: false }));

      if (resp.status == 200) {
        const data = resp.data.data;

        setCostoEnvioByZone({
          loading: false,
          valor: data?.costo,
          destino: data?.destino,
        });
      }
    } catch (error) {}
  };

  return {
    handleOnChangeOptionEnvio,
    handleRemoveAddress,
    setIsEditAddress,
    getValuesStorage,
    loadingAddressUser,
    handleFormRegisterAddress,
    handleFormEditAddress,

    optionEnvio,
    setOptionEnvio,
    dataUserAddress,
    generateCostoByZone,
    costoEnvioByZone,
  };
};

export default useOpcionesEntrega;
