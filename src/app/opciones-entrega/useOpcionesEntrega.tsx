"use client";

import { ChangeEvent, useState } from "react";
import useService from "../services/useService";
import { AddressI } from "../interfaces/address/address.interface";

const useOpcionesEntrega = () => {
  const [optionEnvio, setOptionEnvio] = useState<string>("");
  const [dataUserAddress, setDataUserAddress] = useState<AddressI[]>([]);
  const { requestGet } = useService();

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

  return {
    handleOnChangeOptionEnvio,
    optionEnvio,
    dataUserAddress,
  };
};

export default useOpcionesEntrega;
