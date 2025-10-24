"use client";

import { ChangeEvent, useState } from "react";
import useService from "../services/useService";
import { AddressI } from "../interfaces/address/address.interface";
import { useTheContext } from "../services/globalContext";
import useStorage from "../services/useStorage";
import RegisterDomicilio from "../components/registerDomicilio/RegisterDomicilio";

const useOpcionesEntrega = () => {
  const {
    dataUserAddress,
    setDataUserAddress,
    setIsEditAddress,
    setPostalCodes,
    setDataAddress,
  } = useTheContext();
  const [optionEnvio, setOptionEnvio] = useState<string>("");
  const [idAddressEnvio, setIdAddressEnvio] = useState<number>(0);
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

  const { requestGet, requestPost } = useService();

  const { setDataModal } = useTheContext();

  const { handleWriteStorageProgressPay } = useStorage();

  const handleOnChangeOptionEnvio = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setOptionEnvio(value);
    handleWriteStorageProgressPay({
      optionSend: {
        name: value,
      },
    });
  };

  const handleOnChangeOptionEnvio2 = async (name: string) => {
    setOptionEnvio(name);
    handleWriteStorageProgressPay({
      optionSend: {
        name: name,
      },
    });
  };

  const handleRemoveAddress = async (address: AddressI) => {
    setDataModal({
      isOpen: true,
      type: "info",
      title: "Cuidado",
      message: (
        <div className="flex flex-col p-1 items-start justify-center w-full">
          <span className="text-[#808080] font-bold block text-center w-full mb-2">
            ¿Seguro que deseas eliminar el domicilio?
          </span>

          <div className="flex flex-row items-center my-1 w-full">
            <span className="text-[#808080] font-bold min-w-[80px]">
              Calle:
            </span>
            <span className="text-[#606060]">{address.street}</span>
          </div>

          <div className="flex flex-row items-center my-1 w-full">
            <span className="text-[#808080] font-bold min-w-[80px]">
              Colonia:
            </span>
            <span className="text-[#606060]">{address.cologne}</span>
          </div>

          <div className="flex flex-row items-center my-1 w-full">
            <span className="text-[#808080] font-bold min-w-[80px]">
              No.Ext:
            </span>
            <span className="text-[#606060]">{address.noExt}</span>
          </div>

          <div className="flex flex-row items-center my-1 w-full">
            <span className="text-[#808080] font-bold min-w-[80px]">
              No.Int:
            </span>
            <span className="text-[#606060]">{address.noInt}</span>
          </div>
        </div>
      ),
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: async () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));

        try {
          const resp = await requestPost(
            {
              idAddress: address.idAddress,
            },
            "/address/removeAddress"
          );

          if (resp.status == 200) {
            const data = await resp.data;
            setDataUserAddress(data.data.data);
          }
        } catch (error) {}
      },
    });
  };

  const getValuesStorage = () => {
    const stored = localStorage.getItem("progressPay");
    if (stored) {
      const store = JSON.parse(stored);
      setIdAddressEnvio(store?.optionSend?.address);

      const name = store?.optionSend?.name;
      if (name) {
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

    try {
      setLoadingEdit(true);
      const resp = await requestPost(
        {
          postalCode: addressProp.postalCode,
        },
        "/geonames/getAddressWithPostalCode"
      );
      setLoadingEdit(false);
      if (resp.status == 200) {
        const dataResp = await resp.data.data;

        setPostalCodes(dataResp.postalcodes);
      }
    } catch (error) {
      setLoadingEdit(false);
    }

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
  return {
    handleOnChangeOptionEnvio,
    setIdAddressEnvio,
    handleRemoveAddress,
    setIsEditAddress,
    getValuesStorage,
    loadingAddressUser,
    handleFormRegisterAddress,
    handleFormEditAddress,
    idAddressEnvio,
    optionEnvio,
    dataUserAddress,
    loadingEdit,
  };
};

export default useOpcionesEntrega;
