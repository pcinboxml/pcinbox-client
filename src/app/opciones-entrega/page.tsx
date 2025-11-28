"use client";

import { MdAutorenew, MdDirectionsCar, MdStore } from "react-icons/md";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useService from "../services/useService";
import { useTheContext } from "../services/globalContext";
import { Alert } from "@mui/material";
import useOpcionesEntrega from "./useOpcionesEntrega";
import styles from "./opciones-entrega.module.css";
import { use, useEffect, useMemo } from "react";
import useStorage from "../services/useStorage";

const OpcionesEntrega = () => {
  const { onRouterLink } = useService();
  const {
    handleOnChangeOptionEnvio,
    setIdAddressEnvio,
    handleRemoveAddress,
    handleFormRegisterAddress,
    setIsEditAddress,
    getValuesStorage,
    idAddressEnvio,
    optionEnvio,
    loadingAddressUser,
    handleFormEditAddress,
    loadingEdit,
  } = useOpcionesEntrega();

  const { handleWriteStorageProgressPay } = useStorage();

  const { dataCart, dataUserAddress, setDataModal, setDataAddress } =
    useTheContext();

  const totalPrice = useMemo(() => {
    const total = dataCart
      ? dataCart
          .filter((itemF) => itemF.stock != 0)
          .map((item) => Number(item.price) * item.quantity)
          .reduce((sum, current) => sum + current, 0)
      : 0;

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [dataCart]);

  useEffect(() => {
    if (dataUserAddress.length === 1) {
      setIdAddressEnvio(Number(dataUserAddress[0].idAddress));
    }
  }, [dataUserAddress]);

  useEffect(() => {
    loadingAddressUser();
    getValuesStorage();
  }, []);

  return (
    <section>
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
              loading="lazy"
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

                {totalPrice > 1000 && dataUserAddress ? (
                  <>
                    <Alert severity="info">
                      Estimado cliente, le pedimos atentamente considere que las
                      paqueterías tienen exceso de entregas a nivel nacional,
                      por lo que puede implicar tiempos de entrega más
                      prolongados en algunos casos. Esto es totalmente ajeno a
                      nuestra empresa.
                    </Alert>
                    <img
                      src="/compra_segura_gris.png"
                      width="150"
                      height="150"
                      style={{ objectFit: "contain", marginTop: "10px" }}
                    />
                  </>
                ) : null}

                {totalPrice < 1000 ? (
                  <Alert severity="info" className="mt-3">
                    Para enviar a tu domicilio el monto minimo de compra debe
                    ser de $1,000 pesos.
                  </Alert>
                ) : null}

                {totalPrice >= 1000 &&
                  dataUserAddress &&
                  dataUserAddress.some(
                    (d) => d.city === "León de los Aldama"
                  ) && (
                    <div className="flex items-center relative my-4">
                      <input
                        type="radio"
                        name="envioLeon"
                        id="envioLeon"
                        className="mx-2"
                        value={"envioLeon"}
                        checked={optionEnvio === "envioLeon"}
                        onChange={handleOnChangeOptionEnvio}
                      />

                      <label className="form-check-label" htmlFor="envioLeon">
                        <div className="w-full flex items-center">
                          <MdDirectionsCar size={26} />
                          <span
                            className="text-[#666666] text-sm mx-2"
                            style={{ fontWeight: "bold" }}
                          >
                            <span style={{ fontWeight: "bold" }}>|</span> Envío
                            local (León) solo en compra mayores de $1,000 pesos
                          </span>
                        </div>
                      </label>

                      <span
                        className="absolute right-5 to-5 text-[#808080]"
                        style={{ fontSize: "14px" }}
                      >
                        Gratis
                      </span>
                    </div>
                  )}
                {totalPrice >= 1000 &&
                  dataUserAddress &&
                  dataUserAddress.some(
                    (d) => d.city != "León de los Aldama"
                  ) && (
                    <>
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

                        <label
                          className="form-check-label"
                          htmlFor="paqueteexpress"
                        >
                          <div className="w-full flex items-center">
                            <img
                              src="/paqueteexpress.png"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "contain",
                                filter: "grayscale(100%)",
                              }}
                              loading="lazy"
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
                      </div>

                      {/* <div className="flex items-center relative">
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
                              loading="lazy"
                            />
                            <span
                              className="text-[#666666] text-sm mx-2"
                              style={{ fontWeight: "bold" }}
                            >
                              <span style={{ fontWeight: "bold" }}>|</span> DHL
                            </span>
                          </div>
                        </label>
                      </div> */}

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
                              loading="lazy"
                            />

                            <span
                              className="text-[#666666] text-sm mx-2"
                              style={{ fontWeight: "bold" }}
                            >
                              <span style={{ fontWeight: "bold" }}>|</span>{" "}
                              Estafeta
                            </span>
                          </div>
                        </label>
                      </div>
                    </>
                  )}

                {totalPrice >= 1000 &&
                dataUserAddress &&
                dataUserAddress.length > 0 &&
                optionEnvio != "sucursal" ? (
                  <form className={styles.formContainer}>
                    <h2>Selecciona tu domicilio</h2>

                    {dataUserAddress.map((address) => {
                      if (optionEnvio == "envioLeon") {
                        if (address.city == "León de los Aldama") {
                          return (
                            <div
                              key={address.idAddress}
                              className="radio-group"
                            >
                              <label className="my-3">
                                <input
                                  type="radio"
                                  name="domicilio"
                                  value={address.idAddress}
                                  checked={idAddressEnvio == address.idAddress}
                                  onChange={(event) =>
                                    setIdAddressEnvio(
                                      Number(event.target.value)
                                    )
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
                                  <span className="mx-2">
                                    {address.cologne}
                                  </span>
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

                              {loadingEdit ? (
                                <MdAutorenew />
                              ) : (
                                <a
                                  role="button"
                                  style={{
                                    display: "inline-block",
                                    marginLeft: "10px",
                                    color: "#606060",
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                  }}
                                  onClick={() => {
                                    setIsEditAddress({
                                      edit: true,
                                      idAddress: address.idAddress,
                                    });
                                    setDataAddress({
                                      city: address.city,
                                      cologne: address.cologne,
                                      country: address.country,
                                      noExt: address.noExt,
                                      phone1: address.phone1,
                                      phone2: address.phone2,
                                      state: address.state,
                                      street: address.street,
                                      noInt: address.noInt,
                                      codePostal: Number(address.postalCode),
                                    });

                                    handleFormEditAddress(address);
                                  }}
                                >
                                  Editar
                                </a>
                              )}
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
                        }
                      } else {
                        if (address.city != "León de los Aldama") {
                          return (
                            <div
                              key={address.idAddress}
                              className="radio-group"
                            >
                              <label className="my-3">
                                <input
                                  type="radio"
                                  name="domicilio"
                                  value={address.idAddress}
                                  checked={idAddressEnvio == address.idAddress}
                                  onChange={(event) =>
                                    setIdAddressEnvio(
                                      Number(event.target.value)
                                    )
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
                                  <span className="mx-2">
                                    {address.cologne}
                                  </span>
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

                              {loadingEdit ? (
                                <MdAutorenew />
                              ) : (
                                <a
                                  role="button"
                                  style={{
                                    display: "inline-block",
                                    marginLeft: "10px",
                                    color: "#606060",
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                  }}
                                  onClick={() => {
                                    setIsEditAddress({
                                      edit: true,
                                      idAddress: address.idAddress,
                                    });
                                    setDataAddress({
                                      city: address.city,
                                      cologne: address.cologne,
                                      country: address.country,
                                      noExt: address.noExt,
                                      phone1: address.phone1,
                                      phone2: address.phone2,
                                      state: address.state,
                                      street: address.street,
                                      noInt: address.noInt,
                                      codePostal: Number(address.postalCode),
                                    });

                                    handleFormEditAddress(address);
                                  }}
                                >
                                  Editar
                                </a>
                              )}

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
                        }
                      }
                    })}
                  </form>
                ) : null}

                <hr />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end my-4">
            <button
              onClick={() => {
                handleFormRegisterAddress();
              }}
              className="border py-2 px-5 text-black rounded"
            >
              Agregar domicilio
            </button>
          </div>

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
