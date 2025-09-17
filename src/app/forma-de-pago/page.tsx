"use client";

import { MdCreditCard } from "react-icons/md";
import TimelineComponent from "../components/timeline/TimelineComponent";
import useFormaDePago from "./useFormaDePago";
import { useTheContext } from "../services/globalContext";
import useService from "../services/useService";
import { useEffect } from "react";
import usePasarelaDePagos from "../services/pasarela-de-pagos/usePasarelaDePagos";

const FormaDePago = () => {
  const {
    optionsPago,
    idMethodPay,
    methodsPay,
    setDataCard,
    handleSelectOptionPay,
  } = useFormaDePago();
  const { dataCart } = useTheContext();
  const { onRouterLink } = useService();

  const { requestGetPagos } = usePasarelaDePagos();

  useEffect(() => {
    requestGetPagos("/getAllCardUser").then((resp) => {
      if (resp?.status == 200) {
        setDataCard(resp.data.data.data);
      }
    });
  }, []);

  return (
    <section className="w-[80%] mx-auto my-5">
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
                optionsPago.map((pago, index) => {
                  return (
                    <div
                      className="flex items-center relative p-4"
                      style={{ borderBottom: "1px solid #ccc" }}
                      key={index}
                    >
                      <input
                        type="radio"
                        value={pago.id}
                        name="pago"
                        id={pago.value}
                        className="mx-2"
                        onChange={handleSelectOptionPay}
                      />

                      <label className="form-check-label" htmlFor={pago.value}>
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
              <form action="">
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
                            />
                          ) : f.input == "textarea" ? (
                            <textarea
                              className="form-control"
                              style={{ resize: "none" }}
                            ></textarea>
                          ) : (
                            <input
                              type={f.input}
                              className="form-control"
                              name={f.name}
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
                onRouterLink("/resumen");
              }}
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FormaDePago;
