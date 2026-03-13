"use client";

import { Alert } from "@mui/material";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import usePayEnd from "./usePayEnd";
import { MdAutorenew, MdCopyAll } from "react-icons/md";
import useService from "../services/useService";
import useStorage from "../services/useStorage";
import styles from "./pay-end.module.css";

function DetailRow({
  label,
  value,
  mono = false,
  bold = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span
        className={`text-sm text-gray-900 ${mono ? "font-mono" : ""} ${
          bold ? "font-bold text-base" : "font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

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
    handleCopy,
  } = usePayEnd();

  const { formatCurrency } = useService();
  const { progressPay } = useStorage();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const idParam = urlParams.get("id");
    const idOrderParam = urlParams.get("idOrder");
    const methodPayParam = urlParams.get("method_pay");
    const expiredParam = urlParams.get("expired");

    if (idOrderParam) {
      setIdOrder(idOrderParam);
    }

    if (methodPayParam) {
      handleGetOrderCash(idParam, idOrderParam);
      setMethodPay(methodPayParam);
    }

    if (expiredParam) {
      setExpired(expiredParam);
    }
  }, [idOrder, methodPay, expired]);

  useEffect(() => {
    if (dataOrderCash?.payment_method?.reference) {
      initDownloadBar(dataOrderCash?.payment_method?.reference);
    }
  }, []);

  return (
    <section className={styles.section}>
      {idOrder == "" || dataOrderCash == null ? (
        <Alert severity="info">Contenido no disponible</Alert>
      ) : (
        <div className="w-full">
          <span
            className="text-[#808080] font-bold block text-center text-[18px]"
            style={{ fontStyle: "italic" }}
          >
            ¡Todo Listo!
          </span>

          <div className="mt-3 w-full">
            {/* Header tabla */}
            <div
              className="header-container-tabla w-full p-2 bg-[#666666] flex items-center"
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
              <span className="font-bold text-white mx-2">|</span>
              <span className="mx-2 font-[100] text-white text-sm">
                PEDIDO REALIZADO CORRECTAMENTE
              </span>
            </div>

            {methodPay == "oxxo" ? (
              <div className="w-full mt-2">
                {/* Código de barras OXXO */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-bold text-gray-800 mb-3 text-center">
                    Código de Barras
                  </h3>

                  {dataOrderCash?.amount ? (
                    <span className="mb-3 text-[#606060] text-[20px] block font-bold">
                      Total a pagar:{" "}
                      <span className="text-black font-bold">
                        {formatCurrency(
                          Number(dataOrderCash.amount.toFixed(2)),
                        )}{" "}
                        pesos
                      </span>
                    </span>
                  ) : null}

                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 mb-3">
                    {/* Barcode responsive */}
                    <div className={styles.barcodeWrapper}>
                      <Barcode
                        value={dataOrderCash?.payment_method.reference}
                      />
                    </div>

                    <div className="text-center">
                      <button
                        disabled={loadingDownloadBar}
                        onClick={() =>
                          handleDownloadBar(
                            dataOrderCash?.payment_method.reference,
                          )
                        }
                        className="flex items-center justify-center mx-auto my-2 px-3 py-1 bg-[#606060] text-white text-xs rounded"
                      >
                        {loadingDownloadBar ? (
                          <MdAutorenew
                            size={20}
                            className="m-auto the-spinner"
                          />
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

                {/* {progressPay?.optionSend?.name ? ( */}
                <div className="w-full my-3">
                  <span className="text-[20px] text-[#606060] font-bold block text-center">
                    Guarda el siguiente número de pedido de la sucursal PCINBOX
                    Léon y sigue los pasos que se describen debajo:
                  </span>

                  <span className="block mt-2 font-bold text-center text-[#BB3D4B] text-[25px]">
                    # {dataOrderCash?.order_id}
                  </span>
                </div>
                {/* ) : null} */}

                {/* Información de expiración */}
                {/* <div className="p-4 border-b border-gray-200 bg-red-50">
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
                </div> */}
              </div>
            ) : (
              <div className="w-full mt-2 mb-5">
                <p className={styles.orderTitle}>
                  Guarda el siguiente número de pedido de la sucursal{" "}
                  <b className="text-[black] font-black">PCINBOX </b>
                  León y sigue los pasos que se describen debajo:
                </p>
                <br />
                <div className="w-full flex justify-center items-center gap-2">
                  <span className="text-[#BB3D4B] font-bold text-[25px] block text-center">
                    {idOrder}
                  </span>
                  <MdCopyAll
                    size={40}
                    color="#BB3D4B"
                    title="Copiar Orden"
                    className="cursor-pointer"
                    onClick={() => handleCopy(idOrder)}
                  />
                </div>

                {/* Barcode responsive */}
                <div className={styles.barcodeWrapper}>
                  <Barcode value={idOrder} />
                </div>

                {dataOrderCash?.payment_method?.type == "bank_transfer" ||
                dataOrderCash?.payment_method.type === "bank_account" ? (
                  <div className="space-y-3 mt-3">
                    <span className="text-[20px] text-black font-bold">
                      Datos Bancarios para hacer la transferencia
                    </span>
                    <DetailRow
                      label="Banco"
                      value={dataOrderCash?.payment_method.bank!}
                    />
                    {dataOrderCash?.payment_method?.clabe && (
                      <DetailRow
                        label="CLABE"
                        value={dataOrderCash?.payment_method?.clabe}
                        mono
                      />
                    )}
                    <DetailRow
                      label="Referencia"
                      value={dataOrderCash?.payment_method?.name!}
                      mono
                    />
                    <DetailRow
                      label="Beneficiario"
                      value={"LIZBETH ORDAZ CAMACHO"}
                      mono
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Instrucciones */}
          <div className="w-full my-4">
            <span className="block text-[#606060] text-[17px] text-center">
              Por favor lee atentamente y sigue los pasos que correspondan con
              las características de tu pedido.
            </span>

            {/* Bloque: paso a recoger sin pago */}
            <div
              className="header-container-tabla mt-3 w-full p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white text-sm">
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

            {/* Bloque: paso a recoger con pago */}
            <div
              className="header-container-tabla mt-3 w-full p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white text-sm">
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

            {/* Bloque: envío a domicilio */}
            <div
              className="header-container-tabla mt-3 w-full p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white text-sm">
                PEDIDOS CON FORMA DE ENTREGA "ENVIAR A DOMICILIO"
              </span>
            </div>
            <div className="w-full mt-1">
              <span className="block text-[#808080] text-[15px]">
                7. Sigue el paso número 1.
              </span>
              <span className="block text-[#808080] text-[15px]">
                8. La paquetería te pedirá ver la tarjeta de crédito o débito y
                una identificación. Si la tarjeta de crédito o débito está
                personalizada, los nombres de estas deberán coincidir.
              </span>
            </div>

            {/* Bloque: notas */}
            <div
              className="header-container-tabla mt-3 w-full p-2 bg-[#666666] flex items-center"
              style={{
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <span className="mx-2 font-[100] text-white text-sm">NOTAS</span>
            </div>
            <div className="w-full mt-1">
              <span className="block text-[#808080] text-[15px]">
                1. En pedidos con envío a domicilio, no nos hacemos responsables
                por los tiempos de entrega en cada paquetería. Nuestros
                convenios cuentan con un compromiso de entrega de 1 a 3 días
                habiles, sin embargo, por circunstacia ajena a las paqueterías,
                en ocasiones la entrega puede tomar más tiempo del estimado. En
                estos casos, las circunstancias son ajenas a{" "}
                <span className="text-[black] font-bold">PCINBOX</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PayEnd;
