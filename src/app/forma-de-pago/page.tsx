"use client";

import TimelineComponent from "../components/timeline/TimelineComponent";
import useFormaDePago from "./useFormaDePago";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { useEffect } from "react";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";
import useStorage from "../services/useStorage";
import { Alert } from "@mui/material";
import ListCardsSave from "../components/listCardsSave/ListCardsSave";

import CardForm from "../components/cardForm/CardForm";
import StripeProviderClient from "../components/stripeClient/StripeClientProvider";
import { MdAdd } from "react-icons/md";

const FormaDePago = () => {
  const {
    optionsPago,
    idMethodPay,
    methodsPay,
    // loadingTransferBank,
    // handleOnChange,
    handleSelectOptionPay,
    handleSelectOptionPayById,
    handleRegisterCard,
    // handleRegisterTransferBank,
    getValuesStorage,
    // handleOnChangeTextArea,
  } = useFormaDePago();
  const { selectedCard, dataCart, setDataModal, setDataCard, dataCard } =
    useTheContext();
  const { onRouterLink } = useService();

  const { requestPostPagos } = usePasarelaDePagos();

  const { progressPay, handleWriteStorageProgressPay } = useStorage();

  useEffect(() => {
    requestPostPagos(
      {
        userId: localStorage.getItem("idUser"),
      },
      "/stripe/getCardByUser"
    ).then((resp) => {
      if (resp?.status == 200) {
        setDataCard(resp.data.data.data);
      }
    });

    getValuesStorage();
  }, []);

  return (
    <section>
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

                <div className="border rounded w-[60%]  mt-3">
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
                        if (pago.id != 2) {
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

                                    {pago?.label && (
                                      <>
                                        <br />
                                        <span
                                          className="text-[#666666] mx-2"
                                          style={{
                                            fontWeight: "100",
                                            fontSize: "13px",
                                          }}
                                        >
                                          {pago.label}
                                        </span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              </label>

                              {/* <div
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
                              </div> */}
                            </div>
                          );
                        }
                      })}
                </div>
              </div>

              {idMethodPay != 0 && (
                <div style={{ marginTop: "50px" }}>
                  {idMethodPay == 1 ? (
                    <>
                      {dataCard && dataCard.length > 0 ? (
                        <>
                          <h5
                            style={{
                              fontWeight: "bold",
                              fontSize: "17px",
                              color: "#666666",
                            }}
                          >
                            Selecciona el metodo de pago
                          </h5>
                          <div
                            className="h-[auto] max-h-[300px] border py-2 px-3 rounded"
                            style={{
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <ListCardsSave dataCard={dataCard} />
                          </div>
                          <button
                            onClick={handleRegisterCard}
                            className="cursor-pointer border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#990000] text-white font-bold"
                          >
                            <MdAdd /> Agregar tarjeta
                          </button>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {/* <div className="mt-3">
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
                  </div> */}
                  {/* {idMethodPay == 1 ? (
                    <StripeProviderClient>
                      <CardForm
                        userId={Number(localStorage.getItem("idUser"))}
                      />
                    </StripeProviderClient>
                  ) : null} */}
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
                        message: "Elige un metodo de pago",
                        title: "Error",
                        type: "error",
                        onClose: () => {
                          setDataModal((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                        },
                        onConfirm: () => {
                          setDataModal((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                        },
                      });
                      return;
                    }
                    if (
                      idMethodPay == 1 &&
                      dataCard.length > 0 &&
                      selectedCard == ""
                    ) {
                      setDataModal({
                        isOpen: true,
                        message: "Selecciona el metodo de pago",
                        title: "Error",
                        type: "error",
                        onClose: () => {
                          setDataModal((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                        },
                        onConfirm: () => {
                          setDataModal((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                        },
                      });
                      return;
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
                        idCard: selectedCard,
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
