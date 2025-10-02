"use client";

import { MdAutorenew, MdStore } from "react-icons/md";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import { Alert } from "@mui/material";
import useOpcionesEntrega from "./useOpcionesEntrega";
import styles from "./opciones-entrega.module.css";
import { useEffect } from "react";
import useStorage from "../services/useStorage";

const OpcionesEntrega = () => {
  const { formatCurrency, onRouterLink } = useService();
  const {
    handleOnChangeOptionEnvio,
    registerAddress,
    setIdAddressEnvio,
    handleOnChange,
    handleOnSelect,
    handleRemoveAddress,
    setShowFormAddress,
    handleEditAddress,
    showFormAddress,
    setIsEditAddress,
    getValuesStorage,
    postalCodes,
    idAddressEnvio,
    optionEnvio,
    dataUserAddress,
    loadingRegisterAddress,
    dataAddress,
  } = useOpcionesEntrega();

  const { handleWriteStorageProgressPay } = useStorage();

  const { dataCart, setDataModal } = useTheContext();

  useEffect(() => {
    if (dataUserAddress.length === 1) {
      setIdAddressEnvio(Number(dataUserAddress[0].idAddress));
    }
  }, [dataUserAddress]);

  useEffect(() => {
    getValuesStorage();
  }, []);

  return (
    <section className="w-[80%] mx-auto my-5">
      {dataCart && dataCart.length > 0 ? (
        <TimelineComponent activeStep={1} />
      ) : null}
      {dataCart && dataCart.length > 0 ? (
        <div className="container-tabla  w-[90%] mx-auto my-3">
          <div
            className="header-container-tabla w-[100%] p-2 bg-[#666666]"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <img
              src="/logo_blanco_pcinbox.png"
              width={70}
              height={70}
              style={{ objectFit: "contain", marginLeft: "10px" }}
            />
          </div>
          <div className="content-tabla-opciones-entrega">
            <div className="grid grid-cols-[1fr_1fr] w-full">
              <div className="productos p-3 overflow-y-auto max-h-[250px]">
                {dataCart &&
                  dataCart.length &&
                  dataCart.map((product) => {
                    return (
                      <div key={product.idProduct}>
                        <span className="text-[#666666] text-sm">
                          {product.name}: {product.description}
                        </span>
                        <hr />
                      </div>
                    );
                  })}
              </div>

              <div className="opcion-de-envio p-3">
                <div className="flex">
                  <input
                    type="radio"
                    name="envio"
                    id="sucursal"
                    className="mx-2"
                    value="sucursal"
                    checked={optionEnvio === "sucursal"}
                    onChange={handleOnChangeOptionEnvio}
                  />
                  <MdStore size={26} color="gray" />
                  <label className="form-check-label" htmlFor="sucursal">
                    <span className="text-[#666666] text-sm mx-2">
                      Recoger en sucursal
                    </span>
                  </label>
                  <hr />
                </div>

                <Alert severity="info">
                  Estimado cliente, le pedimos atentamente considere que las
                  paqueterías tienen exceso de entregas a nivel nacional, por lo
                  que puede implicar tiempos de entrega más prolongados en
                  algunos casos. Esto es totalmente ajeno a nuestra empresa.
                </Alert>

                <div className="flex items-center relative">
                  <input
                    type="radio"
                    name="envio"
                    id="paqueteexpress"
                    className="mx-2"
                    value="paqueteexpress"
                    checked={optionEnvio === "paqueteexpress"}
                    onChange={handleOnChangeOptionEnvio}
                  />

                  <label className="form-check-label" htmlFor="paqueteexpress">
                    <div className="w-full flex items-center">
                      <img
                        src="/paqueteexpress.png"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          filter: "grayscale(100%)",
                        }}
                      />
                      <span
                        className="text-[#666666] text-sm mx-2"
                        style={{ fontWeight: "bold" }}
                      >
                        <span style={{ fontWeight: "bold" }}>|</span>{" "}
                        PaqueteExpress
                      </span>
                    </div>
                  </label>

                  <span
                    className="absolute right-5 to-5 text-[#808080]"
                    style={{ fontSize: "14px" }}
                  >
                    {formatCurrency(179)}
                  </span>
                </div>

                <div className="flex items-center relative">
                  <input
                    type="radio"
                    value="dhl"
                    name="envio"
                    id="dhl"
                    className="mx-2"
                    checked={optionEnvio === "dhl"}
                    onChange={handleOnChangeOptionEnvio}
                  />

                  <label className="form-check-label" htmlFor="dhl">
                    <div className="w-full flex items-center">
                      <img
                        src="/dhl.png"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          filter: "grayscale(100%)",
                        }}
                      />
                      <span
                        className="text-[#666666] text-sm mx-2"
                        style={{ fontWeight: "bold" }}
                      >
                        <span style={{ fontWeight: "bold" }}>|</span> DHL
                      </span>
                    </div>
                  </label>
                  <span
                    className="absolute right-5 to-5 text-[#808080]"
                    style={{ fontSize: "14px" }}
                  >
                    {formatCurrency(279)}
                  </span>
                </div>

                <div className="flex items-center relative ">
                  <input
                    type="radio"
                    name="envio"
                    id="estafeta"
                    className="mx-2"
                    value="estafeta"
                    checked={optionEnvio === "estafeta"}
                    onChange={handleOnChangeOptionEnvio}
                  />

                  <label className="form-check-label" htmlFor="estafeta">
                    <div className="w-full flex items-center">
                      <img
                        src="/estafeta.png"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          filter: "grayscale(100%)",
                        }}
                      />

                      <span
                        className="text-[#666666] text-sm mx-2"
                        style={{ fontWeight: "bold" }}
                      >
                        <span style={{ fontWeight: "bold" }}>|</span> Estafeta
                      </span>
                    </div>
                  </label>

                  <span
                    className="absolute right-5 to-5 text-[#808080]"
                    style={{ fontSize: "14px" }}
                  >
                    {formatCurrency(25.22)}
                  </span>
                </div>

                {dataUserAddress &&
                dataUserAddress.length > 0 &&
                optionEnvio != "sucursal" ? (
                  <form className={styles.formContainer}>
                    <h2>Selecciona tu domicilio</h2>

                    {dataUserAddress.map((address) => {
                      console.log(idAddressEnvio, address.idAddress);
                      return (
                        <div key={address.idAddress} className="radio-group">
                          <label className="my-3">
                            <input
                              type="radio"
                              name="domicilio"
                              value={address.idAddress}
                              checked={idAddressEnvio == address.idAddress}
                              onChange={(event) =>
                                setIdAddressEnvio(Number(event.target.value))
                              }
                              required
                            />
                            <div className="flex items-center  flex-wrap">
                              <b>Calle: </b>{" "}
                              <span className="pb-0 mx-2">
                                {" "}
                                {address.street}
                              </span>
                              <b>Colonia: </b>{" "}
                              <span className="mx-2">{address.cologne}</span>
                              <b>No.Ext: </b>
                              <span className="mx-2">{address.noExt}</span>
                              <b
                                style={{
                                  display:
                                    address.noInt != "" ? "block" : "none",
                                }}
                              >
                                No.Int:{" "}
                              </b>
                              <span
                                style={{
                                  display:
                                    address.noInt != "" ? "block" : "none",
                                }}
                                className="mx-2"
                              >
                                {address.noExt}
                              </span>
                            </div>
                          </label>

                          <a
                            role="button"
                            style={{
                              display: "inline-block",
                              marginLeft: "10px",
                              color: "#606060",
                              fontWeight: "bold",
                              textDecoration: "none",
                            }}
                            onClick={() => [
                              setIsEditAddress({
                                edit: true,
                                idAddress: address.idAddress,
                              }),
                              setShowFormAddress(true),
                              handleEditAddress(address),
                            ]}
                          >
                            Editar
                          </a>
                          <a
                            role="button"
                            style={{
                              display: "inline-block",
                              marginLeft: "10px",
                              color: "#BB3D4B",
                              fontWeight: "bold",
                              textDecoration: "none",
                            }}
                            onClick={() => handleRemoveAddress(address)}
                          >
                            Eliminar
                          </a>

                          <hr />
                        </div>
                      );
                    })}
                  </form>
                ) : (
                  optionEnvio != "" &&
                  optionEnvio != "sucursal" && (
                    <div
                      className="container-datos-envio px-3"
                      style={{ marginTop: "70px" }}
                    >
                      <span className="text-[#BB3D4B] text-xl font-bold">
                        Datos de Envío
                      </span>

                      <form className="w-[100%] my-3 mx-auto">
                        <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                          <label
                            htmlFor=""
                            className="text-[#808080] text-base text-end"
                          >
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

                        <div className="grid grid-cols-[auto_auto] gap-2 items-end justify-end mt-4 relative">
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
                            <label
                              htmlFor=""
                              className="text-[#808080] text-base mx-2"
                            >
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

                        <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                          <label
                            htmlFor=""
                            className="text-[#808080] text-base text-end"
                          >
                            Código Postal:
                          </label>

                          <input
                            type="number"
                            name="codePostal"
                            className="form-control"
                            onChange={handleOnChange}
                            value={
                              dataAddress?.codePostal == 0
                                ? ""
                                : dataAddress?.codePostal
                            }
                          />
                        </div>

                        <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                          <label
                            htmlFor=""
                            className="text-[#808080] text-base text-end"
                          >
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
                                  <option
                                    key={pCodes.placeName}
                                    value={pCodes.placeName}
                                  >
                                    {pCodes.placeName}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <option value="">Selecciona una colonia</option>
                            )}
                          </select>
                        </div>

                        <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                          <label
                            htmlFor=""
                            className="text-[#808080] text-base text-end"
                          >
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

                        <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                          <label
                            htmlFor=""
                            className="text-[#808080] text-base text-end"
                          >
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

                        <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                          <label
                            htmlFor=""
                            className="text-[#808080] text-base text-end"
                          >
                            Teléfono 1:
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            name="phone1"
                            onChange={handleOnChange}
                            value={dataAddress?.phone1}
                          />
                        </div>

                        <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                          <label
                            htmlFor=""
                            className="text-[#808080] text-base text-end"
                          >
                            Teléfono 2: <br /> (opcional)
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            name="phone2"
                            onChange={handleOnChange}
                            value={dataAddress?.phone2}
                          />
                        </div>

                        <div
                          className={`grid grid-cols-[auto] gap-2 items-center mt-4 relative ${styles.containerBtnGuardar1}`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              registerAddress(dataAddress);
                            }}
                            disabled={loadingRegisterAddress}
                            className="p-2 bg-[#BB3D4B] text-white font-bold mt-4"
                            style={{ borderRadius: "10px" }}
                          >
                            {loadingRegisterAddress ? (
                              <MdAutorenew
                                size={20}
                                className="m-auto the-spinner"
                              />
                            ) : (
                              "Guardar y continuar"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )
                )}

                <hr />
              </div>
            </div>
          </div>

          {showFormAddress && (
            <div className="w-full flex justify-end">
              <div className="w-[600px] px-3">
                <span className="text-[#BB3D4B] text-xl font-bold">
                  Datos de Envío
                </span>

                <form className="w-[100%] my-3 mx-auto">
                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                    <label
                      htmlFor=""
                      className="text-[#808080] text-base text-end"
                    >
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

                  <div className="grid grid-cols-[auto_auto] gap-2 items-end justify-end mt-4 relative">
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
                      <label
                        htmlFor=""
                        className="text-[#808080] text-base mx-2"
                      >
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

                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                    <label
                      htmlFor=""
                      className="text-[#808080] text-base text-end"
                    >
                      Código Postal:
                    </label>

                    <input
                      type="number"
                      name="codePostal"
                      className="form-control"
                      onChange={handleOnChange}
                      value={
                        dataAddress?.codePostal == 0
                          ? ""
                          : dataAddress?.codePostal
                      }
                    />
                  </div>

                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                    <label
                      htmlFor=""
                      className="text-[#808080] text-base text-end"
                    >
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
                            <option
                              key={pCodes.placeName}
                              value={pCodes.placeName}
                            >
                              {pCodes.placeName}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option value="">Selecciona una colonia</option>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                    <label
                      htmlFor=""
                      className="text-[#808080] text-base text-end"
                    >
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

                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                    <label
                      htmlFor=""
                      className="text-[#808080] text-base text-end"
                    >
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

                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                    <label
                      htmlFor=""
                      className="text-[#808080] text-base text-end"
                    >
                      Teléfono 1:
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="phone1"
                      onChange={handleOnChange}
                      value={dataAddress?.phone1}
                    />
                  </div>

                  <div className="grid grid-cols-[1fr_2fr] gap-2 items-center mt-4 relative">
                    <label
                      htmlFor=""
                      className="text-[#808080] text-base text-end"
                    >
                      Teléfono 2: <br /> (opcional)
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="phone2"
                      onChange={handleOnChange}
                      value={dataAddress?.phone2}
                    />
                  </div>

                  <div
                    className={`grid grid-cols-[auto] gap-2 items-center mt-4 relative ${styles.containerBtnGuardar1}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        registerAddress(dataAddress);
                      }}
                      disabled={loadingRegisterAddress}
                      className="p-2 bg-[#BB3D4B] text-white font-bold mt-4"
                      style={{ borderRadius: "10px" }}
                    >
                      {loadingRegisterAddress ? (
                        <MdAutorenew size={20} className="m-auto the-spinner" />
                      ) : (
                        "Guardar y continuar"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="w-full flex justify-end my-4">
            <button
              onClick={() => {
                setIsEditAddress({
                  edit: false,
                  idAddress: 0,
                }),
                  setShowFormAddress(!showFormAddress);
              }}
              className="border py-2 px-5 text-black rounded"
            >
              {showFormAddress == false
                ? "Agregar otro domicilio"
                : "Cerrar formulario"}
            </button>
          </div>

          {/* <div className="w-full flex justify-end items-center gap-3 py-2 px-3">
            <div className="grid grid-cols-[2fr_1fr]">
              <span
                className="block text-end mx-3"
                style={{
                  fontWeight: "bold",
                  color: "#666666",
                }}
              >
                Sub total:
              </span>
              <span className="text[#808080] block">
                {formatCurrency(1200)}
              </span>
            </div>
          </div>

          <div className="w-full flex justify-end items-center gap-3 py-2 px-3">
            <div className="grid grid-cols-[2fr_1fr]">
              <span
                className="block text-end mx-3"
                style={{
                  fontWeight: "bold",
                  color: "#B92B3D",
                }}
              >
                Total:
              </span>
              <span className="text[#808080] block">
                {formatCurrency(1200)}
              </span>
            </div>
          </div> */}

          {dataCart && dataCart.length > 0 && (
            <div className="w-full flex justify-end items-center  gap-5 mt-4">
              <button
                onClick={() => onRouterLink("/confirma-productos")}
                className="border py-2 px-5 text-black rounded"
              >
                Atrás
              </button>
              <button
                className="bg-[#B92B3D] py-2 px-5 text-white rounded"
                onClick={() => {
                  if (!optionEnvio) {
                    setDataModal({
                      isOpen: true,
                      type: "info",
                      message: "Selecciona una opción de entrega",
                      title: "",
                      onClose: () => {
                        setDataModal((prev) => ({ ...prev, isOpen: false }));
                      },
                      onConfirm: () => {
                        setDataModal((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  } else if (optionEnvio != "sucursal" && idAddressEnvio == 0) {
                    setDataModal({
                      isOpen: true,
                      type: "info",
                      message: "Selecciona un domicilio de entrega",
                      title: "",
                      onClose: () => {
                        setDataModal((prev) => ({ ...prev, isOpen: false }));
                      },
                      onConfirm: () => {
                        setDataModal((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  } else {
                    handleWriteStorageProgressPay({
                      optionSend: {
                        name: optionEnvio,
                        address: idAddressEnvio,
                      },
                    });
                    onRouterLink("/forma-de-pago");
                  }
                }}
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      ) : (
        <Alert severity="info">No hay datos para mostrar</Alert>
      )}
    </section>
  );
};

export default OpcionesEntrega;
