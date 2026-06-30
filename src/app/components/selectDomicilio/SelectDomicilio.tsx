"use client";

import { useTheContext } from "@/app/services/globalContext";
import { Alert } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";

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

  const hasSelectedAddress = Boolean(localAddressByStore[envioKey]);

  const esCiudadEnvioPersonalizado = (city: string) =>
    CIUDADES_ENVIO_PERSONALIZADO.includes(city);

  // 👉 FILTRADO CORRECTO SEGÚN TIPO DE ENVÍO
  const filteredAddresses = useMemo(() => {
    if (!dataUserAddress || dataUserAddress.length === 0) return [];

    // 1. SI ES ENVÍO PERSONALIZADO, FILTRA POR CIUDADES ESPECÍFICAS
    if (selectedOption === "envioLeon") {
      return dataUserAddress.filter((address) =>
        esCiudadEnvioPersonalizado(address.city),
      );
    }

    // 2. PARA CUALQUIER OTRO ENVÍO (PAQUETEEXPRESS, ESTAFETA, ETC.),
    // MUESTRA TODOS LOS DOMICILIOS SIN FILTRAR POR CIUDAD.
    return dataUserAddress;
  }, [dataUserAddress, selectedOption]);
  return (
    <div className="w-full flex flex-col gap-4 px-1 sm:px-2">
      {filteredAddresses.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          {filteredAddresses.map((address) => {
            const isSelected =
              String(localAddressByStore[envioKey]) ===
              String(address.idAddress);

            return (
              <label
                key={address.idAddress}
                className={`
                  relative block cursor-pointer rounded-lg border-2 p-4
                  transition-all duration-200 w-full
                  ${
                    isSelected
                      ? "border-[#BB3D4B] bg-red-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white"
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

                <div className="flex items-start gap-4">
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
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <Alert severity="info">
          No hay domicilios disponibles para este tipo de envío
        </Alert>
      )}

      {filteredAddresses.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-3 pt-2 border-t border-gray-200">
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
      )}
    </div>
  );
};

export default SelectDomicilio;
