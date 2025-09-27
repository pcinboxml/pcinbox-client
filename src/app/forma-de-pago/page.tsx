"use client";

import TimelineComponent from "../components/timeline/TimelineComponent";
import useFormaDePago from "./useFormaDePago";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { ChangeEvent, useEffect } from "react";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import useStorage from "../services/useStorage";
import { Alert } from "@mui/material";

const FormaDePago = () => {
  const {
    optionsPago,
    idMethodPay,
    methodsPay,
    setDataCard,
    handleSelectOptionPay,
    handleSelectOptionPayById,
    handleOnChange,
    handleRegisterCard,
    setSaveCard,
    getValuesStorage,
  } = useFormaDePago();
  const { dataCart, setDataModal } = useTheContext();
  const { onRouterLink } = useService();

  const { requestGetPagos } = usePasarelaDePagos();

  const { progressPay, handleWriteStorageProgressPay } = useStorage();

  useEffect(() => {
    requestGetPagos(
      `/card/getAllCardUser?idUser=${localStorage.getItem("idUser")}`
    ).then((resp) => {
      if (resp?.status == 200) {
        setDataCard(resp.data.data.data);
      }
    });

    getValuesStorage();
  }, []);

  return (
    <section className="w-[80%] mx-auto my-5">
      {dataCart && dataCart.length > 0 ? (
        <>
          <TimelineComponent activeStep={2} />
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

            <div
              className={`grid ${
                idMethodPay == 1 || idMethodPay == 2
                  ? "grid-cols-[2fr_1fr]"
                  : "grid-cols-[1fr]"
              }`}
            >
              <div className="flex items-center flex-col p-3 my-3 ">
                <div>
                  <h5
                    style={{
                      fontWeight: "bold",
                      fontSize: "17px",
                      color: "#666666",
                    }}
                  >
                    ¿Cómo deseas pagar tus productos?
                  </h5>
                </div>

                <div className="border rounded w-full  mt-3">
                  {optionsPago &&
                    optionsPago
                      .filter((f) => {
                        if (progressPay?.optionSend?.name != "sucursal") {
                          return (
                            f.value != "efectivo_al_recoger" &&
                            f.value != "tarjeta_al_recoger"
                          );
                        }
                        return true;
                      })
                      .map((pago, index) => {
                        return (
                          <div
                            className="flex items-center relative p-4"
                            style={{ borderBottom: "1px solid #ccc" }}
                            key={index}
                            onClick={() => handleSelectOptionPayById(pago.id)}
                          >
                            <input
                              type="radio"
                              value={pago.id}
                              name="pago"
                              id={pago.value}
                              className="mx-2"
                              checked={idMethodPay == pago.id}
                              onChange={handleSelectOptionPay}
                              onClick={(e) => e.stopPropagation()}
                            />

                            <label
                              className="form-check-label"
                              htmlFor={pago.value}
                            >
                              <div className="w-full flex items-center">
                                {pago.icon}
                                <span
                                  className="text-[#666666] mx-2"
                                  style={{ fontWeight: "100" }}
                                >
                                  {pago.label}

                                  {pago?.subLabel && (
                                    <>
                                      <br />
                                      <span
                                        className="text-[#666666] mx-2"
                                        style={{
                                          fontWeight: "100",
                                          fontSize: "13px",
                                        }}
                                      >
                                        {pago.subLabel}
                                      </span>
                                    </>
                                  )}
                                </span>
                              </div>
                            </label>

                            <div
                              className={`info-cargo flex flex-col items-center justify-center mx-3 p-2 absolute right-0 bg-[${pago.color}] rounded`}
                            >
                              <span
                                style={{
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                }}
                              >
                                $166.09
                              </span>
                              <span
                                style={{
                                  color: "white",
                                  fontWeight: "bold",
                                  fontSize: "17px",
                                }}
                              >
                                Cargo Bancario
                              </span>
                            </div>
                          </div>
                        );
                      })}
                </div>
              </div>

              {idMethodPay != 0 && (
                <div style={{ marginTop: "50px" }}>
                  <div>
                    <h5
                      style={{
                        fontWeight: "bold",
                        fontSize: "17px",
                        color: "#666666",
                      }}
                    >
                      {idMethodPay == 1
                        ? "Registro de tarjeta"
                        : idMethodPay == 2
                        ? "Transferencia bancaria"
                        : ""}
                    </h5>
                  </div>
                  <form onSubmit={handleRegisterCard}>
                    {methodsPay
                      .filter((pay) => pay.id == idMethodPay)
                      .map((item) => {
                        return item.form.map((f, index) => {
                          return (
                            <div
                              key={index}
                              className="flex flex-col gap-2 items-center mt-4 relative"
                            >
                              <label
                                htmlFor=""
                                className="text-[#808080] text-base text-left block w-full"
                              >
                                {f.label}
                              </label>
                              {f.input == "text" ? (
                                <input
                                  type={f.input}
                                  className="form-control"
                                  name={f.name}
                                  onChange={handleOnChange}
                                />
                              ) : f.input == "textarea" ? (
                                <textarea
                                  className="form-control"
                                  style={{ resize: "none" }}
                                ></textarea>
                              ) : (
                                <input
                                  type={f.name === "card" ? "text" : f.input}
                                  className="form-control"
                                  name={f.name}
                                  onChange={handleOnChange}
                                  onInput={(
                                    e: React.FormEvent<HTMLInputElement>
                                  ) => {
                                    if (f.name === "card") {
                                      let value = e.currentTarget.value;

                                      // 🔹 Solo números
                                      value = value.replace(/\D/g, "");

                                      // 🔹 Limitar a 16 dígitos
                                      value = value.slice(0, 16);

                                      // 🔹 Agrupar en bloques de 4
                                      value = value
                                        .replace(/(.{4})/g, "$1 ")
                                        .trim();

                                      e.currentTarget.value = value;

                                      setSaveCard((prev) => ({
                                        ...prev,
                                        cardNumber: value
                                          .replace(/\s+/g, "")
                                          .trim(),
                                      }));
                                    }
                                  }}
                                  maxLength={f.name === "card" ? 19 : undefined}
                                  placeholder={
                                    f.name === "card"
                                      ? "1234 5678 9012 3456"
                                      : ""
                                  }
                                />
                              )}
                              {/* <input
                            type={f.input}
                            className="form-control"
                            name={f.name}
                          /> */}
                            </div>
                          );
                        });
                      })}
                    <div className="mt-4 flex justify-center">
                      {idMethodPay == 1 ? (
                        <button
                          type="submit"
                          className="rounded p-2 bg-[#BA2B3D] text-white font-bold"
                        >
                          Guardar tarjeta
                        </button>
                      ) : idMethodPay == 2 ? (
                        <button
                          type="button"
                          className="rounded p-2 bg-[#BA2B3D] text-white font-bold"
                        >
                          Hacer transferencia
                        </button>
                      ) : null}
                    </div>
                  </form>
                </div>
              )}
            </div>

            {dataCart && dataCart.length > 0 && (
              <div className="w-full flex justify-end items-center  gap-5 mt-4">
                <button
                  onClick={() => onRouterLink("/opciones-entrega")}
                  className="border py-2 px-5 text-black rounded"
                >
                  Atrás
                </button>
                <button
                  className="bg-[#B92B3D] py-2 px-5 text-white rounded"
                  onClick={() => {
                    if (!idMethodPay) {
                      setDataModal({
                        isOpen: true,
                        type: "error",
                        message: "Elige un metodo de pago",
                        title: "Error",
                        onClose: () => {
                          setDataModal((prev) => ({ ...prev, isOpen: false }));
                        },
                        onConfirm: () => {
                          {
                            setDataModal((prev) => ({
                              ...prev,
                              isOpen: false,
                            }));
                          }
                        },
                      });
                    }
                    handleWriteStorageProgressPay({
                      methodPay: {
                        name: idMethodPay.toString(),
                        typeMethod:
                          idMethodPay == 1
                            ? "tarjeta_debito_credito"
                            : idMethodPay == 2
                            ? "transferencia"
                            : idMethodPay == 3
                            ? "efectivo_al_recoger"
                            : idMethodPay == 4
                            ? "tarjeta_al_recoger"
                            : "efectivo",
                      },
                    });
                    onRouterLink("/resumen");
                  }}
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <Alert severity="info">Sin contenido disponible</Alert>
      )}
    </section>
  );
};

export default FormaDePago;
