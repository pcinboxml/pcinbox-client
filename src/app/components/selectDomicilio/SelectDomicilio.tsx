"use client";

import { useTheContext } from "@/app/services/globalContext";
import { CheckCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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

type Props = {
  envioKey: string;
  selectedOption: string;
  addressByStore: Record<string, number>;
  setAddressByStore: Dispatch<SetStateAction<Record<string, number>>>;
  setOptionEnvio: Dispatch<SetStateAction<Record<string, string>>>;
};

const SelectDomicilio = ({
  envioKey,
  selectedOption,
  addressByStore,
  setAddressByStore,
  setOptionEnvio,
}: Props) => {
  const { dataUserAddress, setDataModal } = useTheContext();

  const [localAddressByStore, setLocalAddressByStore] =
    useState<Record<string, number>>(addressByStore);

  // Sincroniza cuando cambia desde fuera
  useEffect(() => {
    setLocalAddressByStore(addressByStore);
  }, [addressByStore]);

  // 👉 Estado GLOBAL para botones y lógica
  const hasSelectedAddress = Boolean(localAddressByStore[envioKey]);

  const esCiudadEnvioPersonalizado = (city: string) =>
    CIUDADES_ENVIO_PERSONALIZADO.includes(city);

  return (
    <>
      <div className="max-h-[500px] max-w-[550px] overflow-y-auto pr-2 space-y-3">
        {dataUserAddress.map((address) => {
          const debeMostrarse =
            selectedOption === "envioLeon"
              ? esCiudadEnvioPersonalizado(address.city)
              : !esCiudadEnvioPersonalizado(address.city);

          if (!debeMostrarse) return null;

          // 👉 Estado POR CARD
          const isSelected =
            String(localAddressByStore[envioKey]) === String(address.idAddress);

          return (
            <label
              key={address.idAddress}
              className={`
                my-2 relative cursor-pointer rounded-lg border-2 p-4
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
                  setLocalAddressByStore((prev) => ({
                    ...prev,
                    [envioKey]: Number(address.idAddress),
                  }));
                  setAddressByStore((prev) => ({
                    ...prev,
                    [envioKey]: Number(address.idAddress),
                  }));
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
            setLocalAddressByStore((prev) => ({
              ...prev,
              [envioKey]: 0,
            }));
            setAddressByStore((prev) => ({
              ...prev,
              [envioKey]: 0,
            }));
            setOptionEnvio((prev) => ({
              ...prev,
              [envioKey]: "",
            }));
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }}
          className="cursor-pointer text-white border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#808080]"
        >
          Cancelar
        </button>

        <button
          disabled={!hasSelectedAddress}
          onClick={() => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }}
          className={`
            cursor-pointer text-white border rounded px-3 py-2 my-2 flex
            justify-center items-center gap-2
            ${
              hasSelectedAddress
                ? "bg-[#BB3D4B]"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          Aceptar
        </button>
      </div>
    </>
  );
};

export default SelectDomicilio;
