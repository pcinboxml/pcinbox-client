"use client";

import { ChangeEvent, useState } from "react";
import useService from "../services/useService";
import { AddressI } from "../interfaces/address/address.interface";
import { DataSendI } from "../interfaces/perfil/perfil.interface";
import { useTheContext } from "../services/globalContext";

const useOpcionesEntrega = () => {
  const [optionEnvio, setOptionEnvio] = useState<string>("");
  const [idAddressEnvio, setIdAddressEnvio] = useState<number>(0);
  const [dataUserAddress, setDataUserAddress] = useState<AddressI[]>([]);
  const [loadingRegisterAddress, setLoadingRegisterAddress] =
    useState<boolean>(false);
  const { requestGet, requestPost, onRouterLink } = useService();

  const { setDataModal } = useTheContext();

  const handleOnChangeOptionEnvio = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setOptionEnvio(value);

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

  const registerAddress = async (dataAddress: DataSendI) => {
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

    setLoadingRegisterAddress(true);

    try {
      const resp = await requestPost(dataAddress, "/address/registerAddress");

      setLoadingRegisterAddress(false);

      if (resp && resp.status == 200) {
        setDataModal({
          isOpen: true,
          message: "Tu domicilio se creo correctamente",
          title: "Correcto",
          type: "success",
          onClose: () => setDataModal((prev) => ({ ...prev, isOpen: false })),
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
            onRouterLink("/forma-de-pago");
          },
        });

        return;
      }
    } catch (error: any) {
      setLoadingRegisterAddress(false);

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
  };

  return {
    handleOnChangeOptionEnvio,
    registerAddress,
    setIdAddressEnvio,
    idAddressEnvio,
    optionEnvio,
    dataUserAddress,
    loadingRegisterAddress,
  };
};

export default useOpcionesEntrega;
