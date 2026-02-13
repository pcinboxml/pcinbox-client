"use client";

import { ChangeEvent, useMemo, useState } from "react";
import useService from "../services/useService";
import { AddressI } from "../interfaces/address/address.interface";
import { useTheContext } from "../services/globalContext";
import useStorage from "../services/useStorage";
import RegisterDomicilio from "../components/registerDomicilio/RegisterDomicilio";
import SelectDomicilio from "../components/selectDomicilio/SelectDomicilio";
import EliminarDomicilio from "../components/eliminarDomicilio/EliminarDomicilio";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import { MdLocationOn } from "react-icons/md";

const useOpcionesEntrega = () => {
  const IVA = 0.16;

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

  const { dataCart } = useTheContext();

  // --- ESTADOS CORREGIDOS ---
  // Se inicializan con una función que lee desde localStorage.
  // Esto garantiza que el estado tenga el valor correcto en el primer render.
  const [optionEnvio, setOptionEnvio] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progressPay2");
      if (stored) {
        const store = JSON.parse(stored);
        return store.optionEnvio || {};
      }
    }
    return {};
  });

  const [seguroEnvio, setSeguroEnvio] = useState<Record<any, any>>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progressPay2");
      if (stored) {
        const store = JSON.parse(stored);
        return store.seguroEnvio || {};
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

  const handleOnChangeSeguroEnvio = (
    event: ChangeEvent<HTMLInputElement>,
    envioKey: string,
  ) => {
    const { value } = event.target;

    if (dataCart && dataCart?.length > 0) {
      let [storeId, providerId] = envioKey.split("-");

      let findDataProductsStoreId = dataCart?.filter(
        (d) => d.storeId === Number(storeId),
      );

      if (findDataProductsStoreId && findDataProductsStoreId.length > 0) {
        const totalPriceStoreProvider3 = Math.round(
          findDataProductsStoreId
            ?.filter(
              (itemF) => itemF.stock != 0 && Number(itemF?.providerId) === 3,
            )
            .map((item) => Number(item.price) * item.quantity)
            .reduce((sum, current) => sum + current, 0) +
            Number.EPSILON * 100,
        );

        setSeguroEnvio((prev) => ({
          ...prev,
          [envioKey]: {
            required: value,
            costo:
              value === "no" ? 0 : calcPriceEnvio(totalPriceStoreProvider3),
          },
        }));
      }
    }
  };

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

    if (value === "sucursal") {
      setSeguroEnvio((prev) => ({
        ...prev,
        [envioKey]: {
          required: value,
          costo: 0,
        },
      }));

      setAddressByStore((prev) => ({
        ...prev,
        [envioKey]: Number(0),
      }));
    } else if (value !== "sucursal") {
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
            setOptionEnvio={setOptionEnvio}
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
  // const getValuesStorage = () => {
  //   if (typeof window !== "undefined") {
  //     const stored = localStorage.getItem("progressPay");
  //     if (stored) {
  //       const store = JSON.parse(stored);

  //       if (store.optionEnvio) {
  //         setOptionEnvio(store.optionEnvio);
  //       }
  //       if (store.addressByStore) {
  //         setAddressByStore(store.addressByStore);
  //       }
  //       if (store.costoEnvioProductByZone) {
  //         setCostoEnvioProductByZone(store.costoEnvioProductByZone);
  //       }
  //     }
  //   }
  // };

  const getValuesStorage2 = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progressPay2");
      if (stored) {
        const store = JSON.parse(stored);

        delete store.dataPurchase.dataPurchase;

        // "store" tiene algo como { "null-1": {...}, "4-3": {...} }

        const newOptionEnvio: Record<string, string> = {};
        const newSeguroEnvio: Record<string, any> = {};
        const newAddressByStore: Record<string, number> = {};
        const newCostoEnvioProductByZone: Record<string, number> = {};

        Object.keys(store.dataPurchase).forEach((key) => {
          const item = store.dataPurchase[key];

          newOptionEnvio[key] = item.shipping_method || "";

          newSeguroEnvio[key] = {
            required: item.costoSeguroEnvio ? "si" : "no",
            costo: item.costoSeguroEnvio ?? 0,
          };

          newAddressByStore[key] = item.idAddress || 0;

          newCostoEnvioProductByZone[key] = item.costoEnvioProductByZone || 0;
        });

        setOptionEnvio(newOptionEnvio);
        setSeguroEnvio(newSeguroEnvio);
        setAddressByStore(newAddressByStore);
        setCostoEnvioProductByZone(newCostoEnvioProductByZone);
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

  const showUbicationStore = (storeId: string): void => {
    let horarios: { horarios: { dia: any; hora: any }[]; storeId: string }[] = [
      {
        storeId: "PCinBOX-SFD",
        horarios: [
          { dia: "Lunes a Viernes", hora: "9:00am a 6:30pm" },
          { dia: "Sábado", hora: "9:00am a 2:30pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
      {
        storeId: "PCinBOX-AG2D",
        horarios: [
          { dia: "Lunes a Viernes", hora: "9:00am a 7:00pm" },
          { dia: "Sábado", hora: "9:00am a 3:00pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
      {
        storeId: "PCinBOX-León",
        horarios: [
          { dia: "Lunes a Viernes", hora: "10:30am a 7:00pm" },
          { dia: "Sábado", hora: "10:30am a 3:00pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
      {
        storeId: "PCinBOX-AGD",
        horarios: [
          {
            dia: "Lunes a Viernes",
            hora: "9:00am a 6:30pm",
          },
          { dia: "Sábado", hora: "9:00am a 2:30pm" },
          { dia: "Domingo", hora: "Cerrado" },
        ],
      },
    ];

    setDataModal({
      isOpen: true,
      type: "info",
      message: (
        <div className="p-6 space-y-5">
          {/* Dirección */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Ubicación
            </p>
            <p className="text-slate-700 font-medium leading-relaxed text-sm">
              {(() => {
                switch (storeId) {
                  case "PCinBOX-SFD":
                    return `
                         Carretera Panamericana #708 Condominio Santa Fe Tecno Park Jesús María, Ciudad: Aguascalientes.
                        `;
                  case "PCinBOX-AG2D":
                    return `Av. Convención de 1914 Norte #1405 Col. Arboledas, Ciudad: Aguascalientes.`;

                  case "PCinBOX-AGD":
                    return `Av. Convención de 1914 Norte #201 Col. Gremial CP:20030 Aguascalientes Aguascalientes.`;

                  case "PCinBOX-León":
                    return `Blvd. Juan Alonso de Torres Pte. No. 1917 Local 1 Colonia Unión Comunitaria de León C.P 37239 Ciudad de León, Guanajuato, México`;

                  default:
                    return "Tienda desconocida";
                }
              })()}
            </p>
          </div>

          {/* Horarios */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horarios
            </p>
            <div className="space-y-2">
              {horarios
                .filter((itemF) => itemF.storeId === storeId)[0]
                .horarios.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {item.dia}
                    </span>
                    <span
                      className={`text-sm font-semibold ${item.hora === "Cerrado" ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {item.hora}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* CTA Button */}
          <a
            onClick={() => {
              let url = "";

              switch (storeId) {
                case "PCinBOX-SFD":
                  url =
                    "https://www.google.com/maps/place/CEDIS+DICOTECH/@22.0252284,-102.2861256,17z/data=!3m1!4b1!4m6!3m5!1s0x8429e5885d9bfb11:0x70022dc2ed8396ef!8m2!3d22.0252284!4d-102.2835507!16s%2Fg%2F11l2q9rmt5?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D";
                  break;
                case "PCinBOX-León":
                  url =
                    "https://www.google.com/maps/place/pcinbox/@21.145074,-101.649971,17z/data=!3m2!4b1!5s0x842bbec23a6339d7:0x97fd35425c83c996!4m6!3m5!1s0x842bbf44ccdc84cd:0x38a155fcdc248313!8m2!3d21.1450741!4d-101.6451001!16s%2Fg%2F11mvmjh65f?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D";
                  break;
                case "PCinBOX-AG2D":
                  url =
                    "https://www.google.com/maps/place/Zegucom+c%C3%B3mputo+AGUASCALIENTES/@21.8984101,-102.3046535,17z/data=!3m1!4b1!4m6!3m5!1s0x8429eef5ca83ab93:0x609128c20d232c21!8m2!3d21.8984101!4d-102.3020786!16s%2Fg%2F1tjz884g?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D";
                  break;
                case "PCinBOX-AG":
                  url =
                    "https://www.google.com/maps/place/DICOTECH+Gremial/@21.8995775,-102.3018894,16z/data=!4m10!1m2!2m1!1sAv.+Convenci%C3%B3n+de+1914+Norte+%23201+Col.+Gremial+CP:20030+Aguascalientes+Aguascalientes.!3m6!1s0x8429ef0e6225de6f:0xfd013390fcaed156!8m2!3d21.9007454!4d-102.2914005!15sCldBdi4gQ29udmVuY2nDs24gZGUgMTkxNCBOb3J0ZSAjMjAxIENvbC4gR3JlbWlhbCBDUDoyMDAzMCBBZ3Vhc2NhbGllbnRlcyBBZ3Vhc2NhbGllbnRlcy5aViJUYXYgY29udmVuY2nDs24gZGUgMTkxNCBub3J0ZSAjMjAxIGNvbCBncmVtaWFsIGNwIDIwMDMwIGFndWFzY2FsaWVudGVzIGFndWFzY2NhbGllbnRlcyB...";
                  break;
                default:
                  url = "";
              }
              if (url) window.open(url, "_blank");
            }}
            style={{
              marginBottom: "10px",
            }}
            className="w-full mt-6 bg-slate-900 cursor-pointer text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform flex items-center justify-center gap-2 group"
          >
            <MdLocationOn className="w-4 h-4" />
            Ver en Google Maps
          </a>
        </div>
      ),
      title: "",
      showActions: true,
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  function calcPriceEnvio(cantidad: number) {
    if (cantidad < 1) return 0;

    const bloque = Math.ceil(cantidad / 1000);
    return bloque * 17.4;
  }

  return {
    showUbicationStore,
    handleOnChangeOptionEnvio,
    handleRemoveAddress,
    setIsEditAddress,
    // getValuesStorage,
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
    handleOnChangeSeguroEnvio,
    seguroEnvio,
    calcPriceEnvio,
  };
};

export default useOpcionesEntrega;
