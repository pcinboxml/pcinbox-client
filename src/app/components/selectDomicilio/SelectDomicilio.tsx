"use client";

import { useTheContext } from "@/app/services/globalContext";
import useStorage from "@/app/services/useStorage";
import { CheckCircle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const SelectDomicilio = ({
  optionEnvio,
  setOptionEnvio,
}: {
  optionEnvio: string;
  setOptionEnvio: Dispatch<SetStateAction<string>>;
}) => {
  const { dataUserAddress, idAddressEnvio, setIdAddressEnvio, setDataModal } =
    useTheContext();

  const { handleWriteStorageProgressPay } = useStorage();

  return (
    <>
      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
        {dataUserAddress.map((address) => {
          const isSelected = idAddressEnvio === address.idAddress;

          if (optionEnvio == "envioLeon") {
            if (
              address.city == "León de los Aldama" ||
              address.city == "Irapuato" ||
              address.city == "Silao" ||
              address.city == "Guanajuato" ||
              address.city == "San Felipe" ||
              address.city == "Dolores Hgo. Cuna de la Indep. Nal." ||
              address.city == "San miguel de Allende" ||
              address.city == "Salamanca" ||
              address.city == "San Francisco del Rincón" ||
              address.city == "Purísima del Rincón" ||
              address.city == "Pénjamo" ||
              address.city == "Cuerámaro" ||
              address.city == "Abasolo"
            ) {
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
                  {/* Radio oculto (pero funcional) */}
                  <input
                    type="radio"
                    name="domicilio"
                    className="hidden"
                    value={address.idAddress}
                    checked={idAddressEnvio === address.idAddress}
                    onChange={() => {
                      setIdAddressEnvio(Number(address.idAddress));
                      handleWriteStorageProgressPay({
                        optionSend: {
                          address: address.idAddress,
                        },
                      });
                    }}
                    required
                  />

                  {/* Radio visual */}
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

                  {/* Contenido */}
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

                  {/* Check esquina */}
                  {isSelected && (
                    <CheckCircle
                      size={20}
                      className="absolute top-3 right-3 text-[#BB3D4B]"
                    />
                  )}
                </label>
              );
            }
          } else {
            if (
              address.city != "León de los Aldama" &&
              address.city != "Irapuato" &&
              address.city != "Silao" &&
              address.city != "Guanajuato" &&
              address.city != "San Felipe" &&
              address.city != "Dolores Hgo. Cuna de la Indep. Nal." &&
              address.city != "San miguel de Allende" &&
              address.city != "Salamanca" &&
              address.city != "San Francisco del Rincón" &&
              address.city != "Purísima del Rincón" &&
              address.city != "Pénjamo" &&
              address.city != "Cuerámaro" &&
              address.city != "Abasolo"
            ) {
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
                  {/* Radio oculto (pero funcional) */}
                  <input
                    type="radio"
                    name="domicilio"
                    className="hidden"
                    value={address.idAddress}
                    checked={idAddressEnvio === address.idAddress}
                    onChange={() => {
                      setIdAddressEnvio(Number(address.idAddress));
                      handleWriteStorageProgressPay({
                        optionSend: {
                          address: address.idAddress,
                        },
                      });
                    }}
                    required
                  />

                  {/* Radio visual */}
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

                  {/* Contenido */}
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

                  {/* Check esquina */}
                  {isSelected && (
                    <CheckCircle
                      size={20}
                      className="absolute top-3 right-3 text-[#BB3D4B]"
                    />
                  )}
                </label>
              );
            }
          }
        })}
      </div>
      <div className="flex justify-center items-center gap-2">
        <button
          onClick={() => {
            setOptionEnvio("");
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }}
          className="cursor-pointer text-white border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#808080]"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            handleWriteStorageProgressPay({
              optionSend: {
                address: idAddressEnvio,
              },
            });
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
