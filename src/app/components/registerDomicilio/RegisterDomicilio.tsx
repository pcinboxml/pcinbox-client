"use client";

import { AddressI } from "@/app/interfaces/address/address.interface";
import PostalCodeLookupI from "@/app/interfaces/geonames/postalCodeLookupJSON/postalCodeLookupJSON.interface";
import { DataSendI } from "@/app/interfaces/perfil/perfil.interface";
import { useTheContext } from "@/app/services/globalContext";
import useService from "@/app/services/useService";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { MdAutorenew } from "react-icons/md";

const RegisterDomicilio = () => {
  const {
    setDataModal,
    setDataUserAddress,
    setDataAddress,
    dataAddress,
    isEditAddress,
    postalCodes,
    setPostalCodes,
  } = useTheContext();

  const [loadingRegisterAddress, setLoadingRegisterAddress] =
    useState<boolean>(false);

  const { requestPost } = useService();

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
          onClose: async () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
            const data: AddressI[] = await resp.data.data.data;
            setDataUserAddress(data);
            setDataAddress({
              city: "",
              codePostal: 0,
              cologne: "",
              country: "",
              noExt: "",
              phone1: "",
              phone2: "",
              state: "",
              street: "",
              noInt: "",
            });
          },
          onConfirm: async () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
            const data: AddressI[] = await resp.data.data.data;
            setDataUserAddress(data);
            setDataAddress({
              city: "",
              codePostal: 0,
              cologne: "",
              country: "",
              noExt: "",
              phone1: "",
              phone2: "",
              state: "",
              street: "",
              noInt: "",
            });
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

  return (
    <div className="w-full">
      <div className="px-3 w-full max-w-3xl">
        <form className="w-full my-3 mx-auto">
          {/* Calle */}
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 items-center my-2">
            <label className="text-[#808080] text-base text-right">
              Calle:
            </label>
            <input
              type="text"
              className="form-control w-full"
              name="street"
              value={dataAddress?.street}
              onChange={handleOnChange}
            />
          </div>

          {/* Número exterior / interior */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
            <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <label className="text-[#808080] text-base text-right">
                Número Ext:
              </label>
              <input
                type="text"
                className="form-control w-full"
                name="noExt"
                value={dataAddress?.noExt}
                onChange={handleOnChange}
              />
            </div>

            <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <label className="text-[#808080] text-base text-right whitespace-normal">
                Interior (opcional):
              </label>
              <input
                type="text"
                className="form-control w-full"
                name="noInt"
                value={dataAddress?.noInt}
                onChange={handleOnChange}
              />
            </div>
          </div>

          {/* Código Postal */}
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 items-center my-2">
            <label className="text-[#808080] text-base text-right">
              Código Postal:
            </label>
            <input
              type="number"
              name="codePostal"
              className="form-control w-full"
              onChange={handleOnChange}
              value={
                dataAddress?.codePostal === 0 ? "" : dataAddress?.codePostal
              }
            />
          </div>

          {/* Colonia */}
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 items-center my-2">
            <label className="text-[#808080] text-base text-right">
              Colonia:
            </label>
            <select
              name="cologne"
              className="form-select w-full"
              disabled={postalCodes.length === 0}
              onChange={handleOnSelect}
              value={dataAddress.cologne ?? ""}
            >
              <option value="">Selecciona una colonia</option>
              {postalCodes.map((pCodes) => (
                <option key={pCodes.placeName} value={pCodes.placeName}>
                  {pCodes.placeName}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 items-center my-2">
            <label className="text-[#808080] text-base text-right">
              Estado:
            </label>
            <select
              name="state"
              className="form-select w-full"
              disabled={postalCodes.length === 0}
              onChange={handleOnSelect}
              value={dataAddress.state ?? ""}
            >
              <option value="">
                {postalCodes.length > 0
                  ? postalCodes[0].adminName1
                  : "Selecciona un estado"}
              </option>
            </select>
          </div>

          {/* Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 items-center my-2">
            <label className="text-[#808080] text-base text-right">
              Ciudad:
            </label>
            <select
              name="city"
              className="form-select w-full"
              disabled={postalCodes.length === 0}
              onChange={handleOnSelect}
              value={dataAddress.city ?? ""}
            >
              {postalCodes.length > 0 ? (
                <option value={postalCodes[0].adminName3}>
                  {postalCodes[0].adminName3}
                </option>
              ) : (
                <option value="">Selecciona una ciudad</option>
              )}
            </select>
          </div>

          {/* Teléfono 1 */}
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 items-center my-2">
            <label className="text-[#808080] text-base text-right">
              Teléfono 1:
            </label>
            <input
              type="text"
              className="form-control w-full"
              name="phone1"
              onChange={handleOnChange}
              value={dataAddress?.phone1}
            />
          </div>

          {/* Teléfono 2 */}
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 items-center my-2">
            <label className="text-[#808080] text-base text-right whitespace-normal">
              Teléfono 2 (opcional):
            </label>
            <input
              type="text"
              className="form-control w-full"
              name="phone2"
              onChange={handleOnChange}
              value={dataAddress?.phone2}
            />
          </div>

          {/* Botones */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              className="border rounded p-2 font-bold"
              onClick={() =>
                setDataModal((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => registerAddress(dataAddress)}
              disabled={loadingRegisterAddress}
              className="p-2 bg-[#BB3D4B] text-white font-bold rounded"
            >
              {loadingRegisterAddress ? (
                <MdAutorenew size={20} className="m-auto animate-spin" />
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDomicilio;
