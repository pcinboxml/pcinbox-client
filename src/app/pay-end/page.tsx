"use client";

import { Alert } from "@mui/material";
import { Clock, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import usePayEnd from "./usePayEnd";

const PayEnd = () => {
  const [idOrder, setIdOrder] = useState("");
  const [methodPay, setMethodPay] = useState("");
  const [expired, setExpired] = useState("");
  const { dataOrderCash, handleGetOrderCash, formatDate } = usePayEnd();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const idOrderParam = urlParams.get("idOrder");
    const methodPayParam = urlParams.get("method_pay");
    const expiredParam = urlParams.get("expired");

    if (idOrderParam) {
      setIdOrder(idOrder);
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
  }, []);

  return (
    <section
      style={{
        width: "80%",
        margin: "50px auto",
      }}
    >
      {idOrder != "" ? (
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

                {/* Simulación visual del código de barras */}
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-3">
                  <div className="flex justify-center mb-2">
                    {/* Representación visual del código de barras */}
                    <Barcode value={dataOrderCash?.number.toString()!} />
                  </div>

                  {/* Número del código de barras */}
                  <div className="text-center">
                    <div className="font-mono text-sm text-gray-700 mb-2">
                      {/* {formatBarcode(paymentData.barcode)} */}
                    </div>
                    <button
                      // onClick={() => copyToClipboard(paymentData.barcode)}
                      className="flex items-center justify-center mx-auto px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                    >
                      <Copy className="w-3 h-3 mr-1 mx-1" />
                      Copiar código
                    </button>

                    <button
                      // onClick={() => copyToClipboard(paymentData.barcode)}
                      className="flex items-center justify-center mx-auto my-2 px-3 py-1 bg-[#606060] text-white text-xs rounded"
                    >
                      <Download className="w-3 h-3 mr-1 mx-1" />
                      Descargar código
                    </button>
                  </div>
                </div>
              </div>

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
        </div>
      ) : (
        "otro contenido"
      )}
    </section>
  );
};

export default PayEnd;
