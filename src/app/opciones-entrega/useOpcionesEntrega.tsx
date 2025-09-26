"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import useService from "../services/useService";
import { AddressI } from "../interfaces/address/address.interface";
import { DataSendI } from "../interfaces/perfil/perfil.interface";
import { useTheContext } from "../services/globalContext";
import PostalCodeLookupI from "../interfaces/geonames/postalCodeLookupJSON/postalCodeLookupJSON.interface";
import useStorage from "../services/useStorage";

const useOpcionesEntrega = () => {
  const [optionEnvio, setOptionEnvio] = useState<string>("");
  const [idAddressEnvio, setIdAddressEnvio] = useState<number>(0);
  const [dataUserAddress, setDataUserAddress] = useState<AddressI[]>([]);
  const [loadingRegisterAddress, setLoadingRegisterAddress] =
    useState<boolean>(false);
  const [postalCodes, setPostalCodes] = useState<PostalCodeLookupI[]>([]);
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

  const [showFormAddress, setShowFormAddress] = useState<boolean>(false);
  const [isEditAddress, setIsEditAddress] = useState({
    edit: false,
    idAddress: 0,
  });

  const { requestGet, requestPost, onRouterLink } = useService();

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

  const handleOnChangeOptionEnvio2 = async (name: string) => {
    setOptionEnvio(name);
    handleWriteStorageProgressPay({
      optionSend: {
        name: name,
      },
    });

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
      const resp = await requestPost(
        isEditAddress.edit == false
          ? dataAddress
          : {
              ...dataAddress,
              idAddress: isEditAddress.idAddress,
            },
        isEditAddress.edit == false
          ? "/address/registerAddress"
          : "/address/updatedAddress"
      );

      setLoadingRegisterAddress(false);

      if (resp && resp.status == 200) {
        setDataModal({
          isOpen: true,
          message:
            isEditAddress.edit == false
              ? "Tu domicilio se creo correctamente"
              : "Tu domicilio se actualizo correctamente",
          title: "Correcto",
          type: "success",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
            onRouterLink("/forma-de-pago");
          },
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

  const handleRemoveAddress = async (address: AddressI) => {
    setDataModal({
      isOpen: true,
      type: "info",
      title: "Cuidado",
      message: (
        <div>
          <span className="text-[#808080] font-bold">
            ¿Seguro que deseas eliminar el domicilio?
          </span>{" "}
          <br />
          <div className="flex justify-start px-5 my-1">
            <span className="text-[#808080] font-bold">Calle:</span>
            <span className="text-[#606060] mx-2">{address.street}</span>
          </div>
          <div className="flex justify-start px-5">
            <span className="text-[#808080] font-bold">Colonia:</span>
            <span className="text-[#606060] mx-2">{address.cologne}</span>
          </div>
          <div className="flex justify-start px-5">
            <span className="text-[#808080] font-bold">No.Ext:</span>
            <span className="text-[#606060] mx-2">{address.noExt}</span>
          </div>
          <div className="flex justify-start px-5">
            <span className="text-[#808080] font-bold">No.Int:</span>
            <span className="text-[#606060] mx-2">{address.noInt}</span>
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
            setDataModal({
              isOpen: true,
              type: "success",
              title: "Bien",
              message: "Domicilio eliminado correctamente",
              onClose: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false }));
              },
              onConfirm: () => {
                setDataModal((prev) => ({ ...prev, isOpen: false }));
              },
            });
          }
        } catch (error) {}
      },
    });
  };

  const handleEditAddress = async (address: AddressI) => {
    setDataAddress((prev) => ({
      city: address.city,
      codePostal: Number(address.postalCode),
      cologne: address.cologne,
      country: address.country,
      noExt: address.noExt,
      state: address.state,
      phone1: address.phone1,
      phone2: address.phone2,
      street: address.street,
      noInt: address.noInt,
    }));
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

  return {
    handleOnChangeOptionEnvio,
    registerAddress,
    setIdAddressEnvio,
    handleOnChange,
    handleOnSelect,
    handleRemoveAddress,
    handleEditAddress,
    setShowFormAddress,
    setIsEditAddress,
    getValuesStorage,
    showFormAddress,
    idAddressEnvio,
    optionEnvio,
    dataUserAddress,
    loadingRegisterAddress,
    postalCodes,
    dataAddress,
  };
};

export default useOpcionesEntrega;
