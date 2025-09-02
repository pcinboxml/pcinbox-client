"use client";

import { useEffect } from "react";
import SidebarMiCuenta from "./../components/sidebar-mi-cuenta/SidebarMiCuenta";
import styles from "./perfil.module.css";
import usePerfil from "./usePerfil";
import { MdAutorenew } from "react-icons/md";

const MiCuenta = () => {
  const {
    dataPerfil,
    dataAddress,
    postalCodes,
    loadingDataAddress,
    setDataPerfil,
    handleOnChange,
    handleOnSelect,
    onSubmit,
    setDataAddress,
    onChangeUploadPhoto,
  } = usePerfil();

  useEffect(() => {
    if (
      localStorage.getItem("email") &&
      localStorage.getItem("name") &&
      localStorage.getItem("lastname")
    ) {
      setDataPerfil({
        email: localStorage.getItem("email") || "",
        name: localStorage.getItem("name") || "",
        lastname: localStorage.getItem("lastname") || "",
      });
    }
  }, []);

  useEffect(() => {
    if (postalCodes.length > 0) {
      setDataAddress((prev) => ({
        ...prev,
        state: postalCodes.length > 0 ? postalCodes[0].adminName1 : "",
        city: postalCodes.length > 0 ? postalCodes[0].adminName3 : "",
      }));
    }
  }, [postalCodes]);

  return (
    <section className={styles.section}>
      <div className="w-[280px] border ">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <div
          className={`containerCar w-[${
            dataPerfil.email ? "auto" : "500px"
          }] border flex p-2 min-h-[150px]`}
        >
          <div
            className={`containerPhoto w-[150px] h-[150px] ${
              dataPerfil.email ? "m-auto" : ""
            }`}
          >
            <div className="border p-2 relative h-[150px]">
              <div
                className="capa absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
                style={{ background: "rgba(255,255,255,0.4)" }}
              >
                <button
                  className="p-2 bg-[#A67845] text-[white] w-[70%] relative"
                  style={{ fontWeight: "bold" }}
                >
                  <input
                    type="file"
                    onChange={onChangeUploadPhoto}
                    className="absolute top-0 left-0 bottom-0 right-0 opacity-0 cursor-pointer"
                  />
                  Foto
                </button>
              </div>
              <img
                src="/user.jpeg"
                width="150"
                height="150"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {!dataPerfil.email ? (
            <div className="containerData flex flex-col items-center p-2 w-[300px]">
              <span
                className="block text-center"
                style={{ fontWeight: "bold", color: "#BB3D4B" }}
              >
                ¡Termina tu perfil!
              </span>

              <p className="text-center mt-2">
                Por favor completa tus datos para empezar
              </p>

              <div
                className="p-2 bg-[#A67845] text-[white] w-[150px]"
                style={{ fontWeight: "bold" }}
              >
                <span className="block text-center">Perfil</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="container-datos-personales mt-3">
          <span className="text-[#BB3D4B] text-xl font-bold">
            Datos Personales
          </span>

          <form className="my-3 mx-auto w-[65%]">
            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Nombre(s):
              </label>
              <input
                type="text"
                className="form-control"
                value={dataPerfil.name || ""}
                readOnly
                disabled
              />
            </div>

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Apellido(s):
              </label>
              <input
                type="text"
                className="form-control"
                value={dataPerfil.lastname || ""}
                readOnly
                disabled
              />
            </div>

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                value={dataPerfil.email || ""}
                readOnly
                disabled
              />
            </div>
          </form>
        </div>

        <div className="container-datos-envio" style={{ marginTop: "70px" }}>
          <span className="text-[#BB3D4B] text-xl font-bold">
            Datos de Envío
          </span>

          <form className="w-[65%] my-3 mx-auto" onSubmit={onSubmit}>
            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Calle:
              </label>
              <input
                type="text"
                className="form-control"
                name="street"
                value={dataAddress?.street}
                onChange={handleOnChange}
              />
            </div>

            <div className="grid grid-cols-[195px_195px] gap-2 items-end justify-end mt-4 relative">
              <div
                className="flex justify-center"
                style={{ alignItems: "flex-end" }}
              >
                <label
                  htmlFor=""
                  className="text-[#808080] text-base mx-2 block"
                >
                  Número Ext:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="noExt"
                  value={dataAddress?.noExt}
                  onChange={handleOnChange}
                />
              </div>
              <div
                className="flex justify-center"
                style={{ alignItems: "flex-end" }}
              >
                <label htmlFor="" className="text-[#808080] text-base mx-2">
                  Interior: (opcional)
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="noInt"
                  value={dataAddress?.noInt}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Código Postal:
              </label>

              <input
                type="number"
                name="codePostal"
                className="form-control"
                onChange={handleOnChange}
              />
            </div>

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Colonia:
              </label>

              <select
                name="cologne"
                className="form-select"
                disabled={postalCodes.length == 0}
                onChange={handleOnSelect}
                value={dataAddress.cologne ?? ""}
              >
                {postalCodes && postalCodes.length > 0 ? (
                  <>
                    <option value="">Selecciona una colonia</option>
                    {postalCodes.map((pCodes) => (
                      <option key={pCodes.placeName} value={pCodes.placeName}>
                        {pCodes.placeName}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">Selecciona una colonia</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Estado:
              </label>

              <select
                name="state"
                className="form-select"
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

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Ciudad:
              </label>
              <select
                name="city"
                className="form-select"
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

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Teléfono 1:
              </label>

              <input
                type="text"
                className="form-control"
                name="phone1"
                onChange={handleOnChange}
              />
            </div>

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label htmlFor="" className="text-[#808080] text-base text-end">
                Teléfono 2: (opcional)
              </label>

              <input
                type="text"
                className="form-control"
                name="phone2"
                onChange={handleOnChange}
              />
            </div>

            <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
              <label
                htmlFor="
              "
              ></label>

              <button
                type="submit"
                disabled={loadingDataAddress}
                className="p-2 bg-[#BB3D4B] text-white font-bold mt-4"
                style={{ borderRadius: "10px" }}
              >
                {loadingDataAddress ? (
                  <MdAutorenew size={20} className="m-auto the-spinner" />
                ) : (
                  "Guardar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MiCuenta;
