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

  const CIUDADES_ENVIO_PERSONALIZADO = [
    "León de los Aldama",
    "Irapuato",
    "Silao",
    "Guanajuato",
    "San Felipe",
    "Dolores Hgo. Cuna de la Indep. Nal.",
    "San miguel de Allende",
    "Salamanca",
    "San Francisco del Rincón",
    "Purísima del Rincón",
    "Pénjamo",
    "Cuerámaro",
    "Abasolo",
  ];

  // --- ESTADOS CORREGIDOS ---
  // Se inicializan con una función que lee desde localStorage.
  // Esto garantiza que el estado tenga el valor correcto en el primer render.
  const [optionEnvio, setOptionEnvio] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progressPay");
      if (stored) {
        const store = JSON.parse(stored);
        return store.optionEnvio || {};
      }
    }
    return {};
  });

  const [addressByStore, setAddressByStore] = useState<Record<string, number>>(
    () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("progressPay");
        if (stored) {
          const store = JSON.parse(stored);
          return store.addressByStore || {};
        }
      }
      return {};
    },
  );

  const [costoEnvioProductByZone, setCostoEnvioProductByZone] = useState<
    Record<string, number>
  >(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progressPay");
      if (stored) {
        const store = JSON.parse(stored);
        return store.costoEnvioProductByZone || {};
      }
    }
    return {};
  });
  // --- FIN DE ESTADOS CORREGIDOS ---

  const { requestGet, requestPost } = useService();
  const { setDataModal } = useTheContext();

  // En tu hook useOpcionesEntrega

  const handleOnChangeOptionEnvio = async (
    event: ChangeEvent<HTMLInputElement>,
    envioKey: string,
  ) => {
    const { value } = event.target;

    setOptionEnvio((prev) => ({
      ...prev,
      [envioKey]: value,
    }));

    if (value !== "sucursal" && value !== "sucursalExt") {
      setDataModal({
        isOpen: true,
        title: "Selecciona el domicilio",
        type: "info",
        showActions: false,
        onClose: () => {
          setOptionEnvio((prev) => ({
            ...prev,
            [envioKey]: "",
          }));
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        message: (
          <SelectDomicilio
            // --- CAMBIO IMPORTANTE ---
            key={`${envioKey}-${addressByStore[envioKey] || "empty"}`}
            // --- FIN DEL CAMBIO ---
            addressByStore={addressByStore}
            setAddressByStore={setAddressByStore}
            envioKey={envioKey}
            selectedOption={value}
          />
        ),
      });
    }
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

  // --- FUNCIÓN getValuesStorage CORREGIDA ---
  // Ahora carga todos los estados necesarios desde localStorage.
  const getValuesStorage = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progressPay");
      if (stored) {
        const store = JSON.parse(stored);

        if (store.optionEnvio) {
          setOptionEnvio(store.optionEnvio);
        }
        if (store.addressByStore) {
          setAddressByStore(store.addressByStore);
        }
        if (store.costoEnvioProductByZone) {
          setCostoEnvioProductByZone(store.costoEnvioProductByZone);
        }
      }
    }
  };

  const getValuesStorage2 = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progressPay2");
      if (stored) {
        const store = JSON.parse(stored);

        if (store.optionEnvio) {
          setOptionEnvio(store.optionEnvio);
        }
        if (store.addressByStore) {
          setAddressByStore(store.addressByStore);
        }
        if (store.costoEnvioProductByZone) {
          setCostoEnvioProductByZone(store.costoEnvioProductByZone);
        }
      }
    }
  };
  // --- FIN DE FUNCIÓN CORREGIDA ---

  const loadingAddressUser = async () => {
    try {
      const resp = await requestGet("/address/hasAddressUser");
      if (resp.status == 200) {
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

  const generateCostoByZone = async (destino: any) => {
    try {
      const resp = await requestPost({ destino }, "/geonames/ShippingByZone");
      if (resp.status === 200) {
        return resp.data.data?.costo || 0;
      }
    } catch (error) {}
    return 0;
  };

  return {
    handleOnChangeOptionEnvio,
    handleRemoveAddress,
    setIsEditAddress,
    getValuesStorage,
    getValuesStorage2,
    loadingAddressUser,
    handleFormRegisterAddress,
    handleFormEditAddress,
    optionEnvio,
    setOptionEnvio,
    addressByStore,
    setAddressByStore,
    dataUserAddress,
    generateCostoByZone,
    costoEnvioProductByZone,
    setCostoEnvioProductByZone,
    CIUDADES_ENVIO_PERSONALIZADO,
  };
};

export default useOpcionesEntrega;
