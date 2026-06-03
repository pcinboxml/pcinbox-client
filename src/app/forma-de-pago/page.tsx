"use client";

import TimelineComponent from "../components/timeline/TimelineComponent";
import useFormaDePago from "./useFormaDePago";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { useEffect } from "react";
import useStorage from "../services/useStorage";
import { Alert } from "@mui/material";
import { CheckoutStep } from "../components/timeline/checkoutSteps";
import { useCheckoutGuard } from "../hooks/useCheckoutGuard";
import style from "./forma-de-pago.module.css";

const FormaDePago = () => {
  useCheckoutGuard(CheckoutStep.FORMA_DE_PAGO);

  const {
    optionsPago,
    idMethodPay,
    handleSelectOptionPay,
    handleSelectOptionPayById,
    getValuesStorage2,
  } = useFormaDePago();

  const {
    selectedCard,
    dataCart,
    setDataModal,
    dataCard,
    buyNowProduct,
    hasToken,
  } = useTheContext();
  const { onRouterLink, productsToShow } = useService();
  const { checkoutMode } = useStorage();

  // const { requestPostPagos } = usePasarelaDePagos();

  // const productsToShow =
  //   checkoutMode === "buy_now" && buyNowProduct != null
  //     ? [buyNowProduct]
  //     : dataCart;

  const {
    progressPay,
    handleWriteStorageProgressPay,
    handleWriteStorageProgressPay2,
  } = useStorage();

  useEffect(() => {
    getValuesStorage2();
  }, []);

  return (
    <section>
      {productsToShow && productsToShow?.length > 0 ? ( //Antes dataCart
        <>
          <TimelineComponent activeStep={2} />
          <div className="container-tabla  w-[90%] mx-auto mt-2">
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

            <div
              className={`grid ${
                idMethodPay == 1 || idMethodPay == 2
                  ? "grid-cols-[2fr_1fr]"
                  : "grid-cols-[1fr]"
              }`}
            >
              <div className="flex items-center flex-col p-3">
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
                      .filter((pago) => {
                        return pago.id;
                        // if (totalPrice >= 10000) {
                        //   return pago.id == 1 || pago.id == 7 || pago.id == 6;
                        // } else {
                        //   return pago.id == 1 || pago.id == 5 || pago.id == 7;
                        // }
                      })
                      .map((pag_, index) => {
                        return (
                          <div
                            className="flex items-center relative py-2 px-3"
                            style={{ borderBottom: "1px solid #ccc" }}
                            key={index}
                            onClick={() => handleSelectOptionPayById(pag_.id)}
                          >
                            <input
                              type="radio"
                              value={pag_.id}
                              name="pago"
                              id={pag_.value}
                              className="mx-2"
                              checked={idMethodPay == pag_.id}
                              onChange={handleSelectOptionPay}
                              onClick={(e) => e.stopPropagation()}
                            />

                            <label
                              className={`form-check-label ${style.labelPago}`}
                              htmlFor={pag_.value}
                            >
                              <div className="w-full flex items-center">
                                {pag_.icon}
                                <span
                                  className="text-[#666666] mx-2"
                                  style={{ fontWeight: "100" }}
                                >
                                  {pag_.label}
                                </span>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                </div>
              </div>

              {/* {idMethodPay != 0 && (
                <div style={{ marginTop: "10px" }}>
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
                            className="h-[auto] max-h-[250px] border py-2 px-3 rounded"
                            style={{
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <ListCardsSave dataCard={dataCard} />
                          </div>
                          <div className="flex justify-start gap-2 mb-5">
                            <button
                              onClick={handleRegisterCard}
                              className="cursor-pointer border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#990000] text-white font-bold"
                            >
                              <MdAdd /> Agregar tarjeta
                            </button>

                            {selectedCard == "" ||
                            selectedCard == null ||
                            !selectedCard ? null : (
                              <button
                                onClick={handleRemoveCard}
                                className="cursor-pointer text-white border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#808080]"
                              >
                                <MdDelete /> Eliminar tarjeta
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={handleRegisterCard}
                          className="cursor-pointer border rounded px-3 py-2 my-2 flex justify-center items-center gap-2 bg-[#990000] text-white font-bold"
                        >
                          <MdAdd /> Agregar tarjeta
                        </button>
                      )}
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
                  </div> 
                   {idMethodPay == 1 ? (
                    <StripeProviderClient>
                      <CardForm
                        userId={Number(localStorage.getItem("idUser"))}
                      />
                    </StripeProviderClient>
                  ) : null} 
                </div>
              )} */}
            </div>

            {productsToShow && ( //Antes de dataCart
              <div className="w-full flex justify-end items-center gap-5">
                <button
                  onClick={() => onRouterLink("/opciones-entrega")}
                  className="border py-2 px-5 text-black rounded"
                >
                  Atrás
                </button>
                <button
                  className="bg-[#B92B3D] py-2 px-5 text-white rounded"
                  onClick={() => {
                    if (!hasToken) {
                      setDataModal({
                        isOpen: true,
                        message:
                          "Tu sesión expiró, debes iniciar sesión nuevamente.",
                        title: "Sesión expirada",

                        onClose: () => {
                          setDataModal((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                        },

                        onConfirm: async () => {
                          setDataModal((prev) => ({
                            ...prev,
                            isOpen: false,
                          }));
                        },

                        type: "info",
                      });
                      return;
                    }
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
                      (dataCard.length == 0 ||
                        selectedCard == "" ||
                        selectedCard == null ||
                        !selectedCard)
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
                                  : idMethodPay == 6
                                    ? "mercadopago"
                                    : idMethodPay == 5
                                      ? "efectivo"
                                      : idMethodPay == 7
                                        ? "openpay"
                                        : "",
                        idCard: selectedCard,
                      },
                    });

                    handleWriteStorageProgressPay2({
                      pay: {
                        id: idMethodPay,
                        name:
                          idMethodPay == 1
                            ? "tarjeta_debito_credito"
                            : idMethodPay == 2
                              ? "transferencia"
                              : idMethodPay == 3
                                ? "efectivo_al_recoger"
                                : idMethodPay == 4
                                  ? "tarjeta_al_recoger"
                                  : idMethodPay == 6
                                    ? "mercadopago"
                                    : idMethodPay == 5
                                      ? "efectivo"
                                      : idMethodPay == 7
                                        ? "openpay"
                                        : "",
                      },
                    });
                    localStorage.setItem(
                      "checkout_step",
                      String(CheckoutStep.RESUMEN),
                    );

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
