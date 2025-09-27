"use client";

import { Alert } from "@mui/material";
import { Clock, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import usePayEnd from "./usePayEnd";
import { MdAutorenew } from "react-icons/md";
import useService from "../services/useService";
import useStorage from "../services/useStorage";

const PayEnd = () => {
  const [idOrder, setIdOrder] = useState("");
  const [methodPay, setMethodPay] = useState("");
  const [expired, setExpired] = useState("");
  const {
    dataOrderCash,
    loadingDownloadBar,
    handleGetOrderCash,
    formatDate,
    handleDownloadBar,
    initDownloadBar,
  } = usePayEnd();

  const { formatCurrency } = useService();
  const { progressPay } = useStorage();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const idOrderParam = urlParams.get("idOrder");
    const methodPayParam = urlParams.get("method_pay");
    const expiredParam = urlParams.get("expired");

    if (idOrderParam) {
      console.log(idOrderParam);
      setIdOrder(idOrderParam);
    }

    if (methodPayParam) {
      if (methodPayParam == "oxxo") {
        handleGetOrderCash(idOrderParam, localStorage.getItem("idUser"));
      }
      setMethodPay(methodPayParam);
    }

    if (expiredParam) {
      setExpired(expiredParam);
    }
  }, [idOrder, methodPay, expired]);

  useEffect(() => {
    if (dataOrderCash?.number.toString()) {
      initDownloadBar(dataOrderCash?.number.toString());
    }
  }, []);

  return (
    <section
      style={{
        width: "80%",
        margin: "50px auto",
      }}
    >
      {idOrder == "" ? (
        <Alert severity="info">Contenido no disponible</Alert>
      ) : methodPay == "oxxo" ? (
        <div className="w-full">
          <span
            className="text-[#808080] font-bold block text-center text-[18px]"
            style={{
              fontStyle: "italic",
            }}
          >
            ¡Todo Listo!
          </span>

          <div className="mt-3 w-full">
            <div
              className="header-container-tabla w-[100%] p-2 bg-[#666666] flex items-center"
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

              <span className="font-bold text-white mx-2">|</span>
              <span className="mx-2 font-[100] text-white">
                PEDIDO REALIZADO CORRECTAMENTE
              </span>
            </div>

            <div className="w-full mt-2">
              {/* Código de barras */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-3 text-center">
                  Código de Barras para OXXO
                </h3>

                {dataOrderCash?.amount ? (
                  <span className="mb-3 text-[#606060] text-[20px] block font-bold">
                    Total a pagar:{" "}
                    <span className="text-black font-bold">
                      {formatCurrency(
                        dataOrderCash?.amount / 100 +
                          (dataOrderCash?.amount / 100) * 0.16
                      )}{" "}
                      pesos
                    </span>
                  </span>
                ) : null}

                {/* Simulación visual del código de barras */}
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-3">
                  <div className="flex justify-center mb-2">
                    {/* Representación visual del código de barras */}
                    <Barcode value={dataOrderCash?.number.toString()!} />
                  </div>

                  {/* Número del código de barras */}
                  <div className="text-center">
                    <button
                      disabled={loadingDownloadBar}
                      onClick={() =>
                        handleDownloadBar(dataOrderCash?.number.toString())
                      }
                      className="flex items-center justify-center mx-auto my-2 px-3 py-1 bg-[#606060] text-white text-xs rounded"
                    >
                      {loadingDownloadBar ? (
                        <MdAutorenew size={20} className="m-auto the-spinner" />
                      ) : (
                        <>
                          <Download className="w-3 h-3 mr-1 mx-1" />
                          Descargar código
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {progressPay?.optionSend?.name ? (
                <div className="w-full my-3">
                  <span className="text-[20px] text-[#606060] font-bold block text-center">
                    Guarda el siguiente número de pedido de la sucursal PCINBOX
                    Léon y sigue los pasos que se describen debajo:
                  </span>

                  <span className="block mt-2 font-bold text-center text-[#BB3D4B] text-[25px]">
                    {dataOrderCash?.idOrder}
                  </span>
                </div>
              ) : null}

              {/* Información de expiración */}
              <div className="p-4 border-b border-gray-200 bg-red-50">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-bold text-red-700 mx-2">
                    ¡IMPORTANTE!
                  </span>
                </div>

                <div className="text-center">
                  <div className="text-sm text-red-700 mb-1 flex justify-center items-end">
                    <span className="text-[18px]">Fecha límite de pago:</span>
                    <span className="text-[18px] mx-2 font-bold text-red-800">
                      {formatDate(Number(expired))}
                    </span>
                  </div>

                  <div className="text-xs text-red-600 mt-1">
                    Después de esta fecha el código expirará
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full my-4">
            <span className="block text-[#606060] text-[17px] text-center">
              Por favor lee atentamente y sigue los pasos que correspondan con
              las características de tu pedido.
            </span>

            <div
              className="header-container-tabla mt-3 w-[100%] p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white">
                PEDIDOS CON FORMA DE ENTREGA "PASO A RECOGER" SIN PAGO EN LÍNEA
              </span>
            </div>

            <div className="w-full mt-1">
              <span className="block text-[#808080] text-[15px]">
                1. Anota el número de pedido o imprime ésta pantalla
              </span>
              <span className="block text-[#808080] text-[15px]">
                2. Acude al mostrador de la sucursal correspondiente al pedido y
                proporciona el número de pedido al vendedor.
              </span>
              <span className="block text-[#808080] text-[15px]">
                3. Se pedirá una identificación, tu nombre debe coincidir con el
                de la cuenta o con el nombre del segundo titular.
              </span>
            </div>

            <div
              className="header-container-tabla mt-3 w-[100%] p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white">
                PEDIDOS CON FORMA DE ENTREGA "PASO A RECOGER" CON PAGO EN LÍNEA
              </span>
            </div>
            <div className="w-full mt-1">
              <span className="block text-[#808080] text-[15px]">
                4. Sigue los pasos del 1 al 3.
              </span>
              <span className="block text-[#808080] text-[15px]">
                5. Se te pedirá la tarjeta de crédito o débito y una
                identificación. Si la tarjeta de crédito o débito está
                personalizada, los nombres en estas deberán coincidir.
              </span>
              <span className="block text-[#808080] text-[15px]">
                6. Es necesario presentar el comprobante de pago impreso al
                recoger el pedido.
              </span>
            </div>

            <div
              className="header-container-tabla mt-3 w-[100%] p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white">
                PEDIDOS CON FORMA DE ENTREGA "ENVIAR A DOMICILIO"
              </span>
            </div>
            <div className="w-full mt-1">
              <span className="block text-[#808080] text-[15px]">
                7. Sigue el paso número 1.
              </span>
              <span className="block text-[#808080] text-[15px]">
                8. La paquetería te pedirá ver la tarjeta de crédito o débito y
                una identificación. Si l atarjeta de crédito o débito está
                personalizada, los nombres de estas deberán coincidir.
              </span>
            </div>

            <div
              className="header-container-tabla mt-3 w-[100%] p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white">NOTAS</span>
            </div>
            <div className="w-full mt-1">
              <span className="block text-[#808080] text-[15px]">
                1. En pedidos con envío a domicilio, no nos hacemos responsables
                por los tiempos de entrega en cada paquetería. Nuestros
                convenios cuentan con un compromiso de entrega de 1 a 3 días
                habiles, sin embargo, por circunstacia ajena a las paqueterías,
                en ocasiones la entrega puede tomar más tiempo del estimado. En
                estos casos, las circunstancias son ajenas a{" "}
                <span className="text-[black] font-bold ">PCINBOX</span>
              </span>
              {/* <span className="block text-[#808080] text-[15px]">
                2. La paquetería te pedirá ver la tarjeta de crédito o débito y
                una identificación. Si l atarjeta de crédito o débito está
                personalizada, los nombres de estas deberán coincidir.
              </span> */}
            </div>
          </div>
        </div>
      ) : (
        "otro contenido"
      )}
    </section>
  );
};

export default PayEnd;
