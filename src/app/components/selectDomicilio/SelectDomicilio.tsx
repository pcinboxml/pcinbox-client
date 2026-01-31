"use client";

import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import useStorage from "@/app/services/useStorage";
import { CheckCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

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

const SelectDomicilio = ({
  envioKey,
  selectedOption,
  addressByStore,
  setAddressByStore,
}: {
  envioKey: any;
  selectedOption: string;
  seguroEnvio: Record<any, any>;
  addressByStore: Record<string, number>;
  setAddressByStore: Dispatch<SetStateAction<Record<string, number>>>;
  setSeguroEnvio: Dispatch<SetStateAction<Record<any, any>>>;
}) => {
  const { dataUserAddress, setDataModal } = useTheContext();
  const [localAddressByStore, setLocalAddressByStore] =
    useState(addressByStore);

  // --- CAMBIO IMPORTANTE ---
  // Sincronizar el estado local con las props
  useEffect(() => {
    setLocalAddressByStore(addressByStore);
  }, [addressByStore]);
  // --- FIN DEL CAMBIO ---

  const esCiudadEnvioPersonalizado = (city: string) => {
    return CIUDADES_ENVIO_PERSONALIZADO.includes(city);
  };

  return (
    <>
      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
        {dataUserAddress.map((address) => {
          const isSelected =
            String(localAddressByStore[envioKey]) === String(address.idAddress);

          const debeMostrarse =
            selectedOption === "envioLeon"
              ? esCiudadEnvioPersonalizado(address.city)
              : !esCiudadEnvioPersonalizado(address.city);

          if (!debeMostrarse) return null;

          return (
            <label
              key={address.idAddress}
              className={`
                my-2
                relative cursor-pointer rounded-lg border-2 p-4
                transition-all duration-200 flex items-start gap-4 w-full
                ${
                  isSelected
                    ? "border-[#BB3D4B] bg-red-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
                }
              `}
            >
              <input
                type="radio"
                name={`domicilio-${envioKey}`}
                className="hidden"
                value={address.idAddress}
                checked={isSelected}
                onChange={() => {
                  // --- CAMBIO IMPORTANTE ---
                  // Actualizar tanto el estado local como el estado global
                  setLocalAddressByStore((prev) => ({
                    ...prev,
                    [envioKey]: Number(address.idAddress),
                  }));
                  setAddressByStore((prev) => ({
                    ...prev,
                    [envioKey]: Number(address.idAddress),
                  }));
                  // --- FIN DEL CAMBIO ---
                }}
              />

              <div className="flex-shrink-0 pt-1">
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all
                    ${
                      isSelected
                        ? "border-[#BB3D4B] bg-[#BB3D4B]"
                        : "border-gray-300 bg-white"
                    }
                  `}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-2 text-sm">
                <p className="font-semibold text-gray-800 text-base">
                  {address.street} #{address.noExt}
                  {address.noInt && ` Int. ${address.noInt}`}
                </p>

                <div className="space-y-1 text-gray-600">
                  <p>
                    {address.cologne}, {address.city}
                  </p>
                  <p>
                    {address.state}, {address.country}
                  </p>
                  <p className="font-medium">CP {address.postalCode}</p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-gray-500 flex items-center gap-2">
                    <span className="text-xs">📞</span>
                    {address.phone1}
                    {address.phone2 && ` • ${address.phone2}`}
                  </p>
                </div>
              </div>

              {isSelected && (
                <CheckCircle
                  size={20}
                  className="absolute top-3 right-3 text-[#BB3D4B]"
                />
              )}
            </label>
          );
        })}
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => {
            // --- CAMBIO IMPORTANTE ---
            // Actualizar tanto el estado local como el estado global
            setLocalAddressByStore((prev) => ({
              ...prev,
              [envioKey]: 0,
            }));
            setAddressByStore((prev) => ({
              ...prev,
              [envioKey]: 0,
            }));
            // --- FIN DEL CAMBIO ---
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }}
          className="cursor-pointer text-white border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#808080]"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }}
          className="cursor-pointer text-white border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#BB3D4B]"
        >
          Aceptar
        </button>
      </div>
    </>
  );
};

export default SelectDomicilio;
