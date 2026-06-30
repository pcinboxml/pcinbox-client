"use client";

import { ChargesOpenPay } from "@/app/interfaces/openpay/charges.interface";
import useCheckoutSession from "@/app/hooks/useCheckoutSession";
import { useTheContext } from "@/app/services/globalContext";
import usePasarelaDePagos from "@/app/services/pasarela-de-pagos/usePasarelaDePagos";
import useService from "@/app/services/useService";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { MdAutorenew } from "react-icons/md";

function isOfflineOpenPayMethod(data: ChargesOpenPay | null) {
  const type = data?.payment_method?.type ?? data?.method;
  return (
    type === "store" ||
    type === "bank_transfer" ||
    type === "bank_account" ||
    type === "bank"
  );
}

const PayPending = ({
  dataPayOpenPay,
}: {
  dataPayOpenPay: ChargesOpenPay | null;
}) => {
  const { onRouterLink } = useService();
  const { requestGetPagos } = usePasarelaDePagos();
  const [loadingDownloadBar, setLoadingDownloadBar] = useState<boolean>(false);
  const { socketPagos } = useTheContext();
  const { completePurchaseCleanup } = useCheckoutSession();
  const cleanedUpRef = useRef(false);

  useEffect(() => {
    if (!dataPayOpenPay || cleanedUpRef.current) return;
    if (!isOfflineOpenPayMethod(dataPayOpenPay)) return;

    cleanedUpRef.current = true;
    void completePurchaseCleanup();
  }, [dataPayOpenPay, completePurchaseCleanup]);

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "mxn",
    }).format(value);
  };

  const getPaymentMethodDetails = () => {
    switch (dataPayOpenPay?.payment_method?.type) {
      case "store":
        return {
          name: "Tienda",
          icon: "🏪",
          color: "from-amber-500 to-orange-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
      case "bank":
        return {
          name: "Transferencia SPEI",
          icon: "🏦",
          color: "from-blue-500 to-indigo-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      default:
        return {
          name: "Pago Pendiente",
          icon: "⏳",
          color: "from-amber-500 to-orange-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
    }
  };

  const details = getPaymentMethodDetails();

  const handleDownloadBar = async (valueBar: any) => {
    try {
      setLoadingDownloadBar(true);
      const resp = await requestGetPagos(
        `/codeOxxo/downloadCodeBar/${valueBar}`,
        true,
      );
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `barcode-${valueBar}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setLoadingDownloadBar(false);
    } catch (error) {
      setLoadingDownloadBar(false);
    }
  };

  return (
    <div
      className={`min-h-screen fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-3 sm:p-5 bg-gradient-to-br ${details.color} overflow-hidden`}
    >
      {/* Círculos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-[float_20s_ease_infinite]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-[float_20s_ease_infinite_10s]" />
      </div>

      {/* Card principal */}
      <div className="max-w-2xl w-full relative z-10">
        <div
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl animate-[slideUp_0.5s_ease] overflow-y-auto"
          style={{ padding: "16px", maxHeight: "95vh" }}
        >
          {/* Icono reloj animado */}
          <div className="flex justify-center mb-5 sm:mb-8">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28">
              <div className="absolute inset-0 bg-amber-500 rounded-full opacity-20 animate-[pulse_2s_ease_infinite]" />
              <div className="absolute inset-0 bg-amber-500 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white rounded-full relative">
                  {/* Manecilla hora */}
                  <div className="absolute w-1 h-5 sm:h-6 bg-white left-1/2 top-1/2 origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_4s_linear_infinite]" />
                  {/* Manecilla minuto */}
                  <div className="absolute w-0.5 h-6 sm:h-7 bg-white left-1/2 top-1/2 origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_60s_linear_infinite]" />
                </div>
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-5 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-600 mb-3 flex items-center justify-center gap-2 flex-wrap">
              <span>{details.icon}</span>
              Pago Pendiente
            </h1>
          </div>

          {/* Referencia + Barcode */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-dashed border-amber-400 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            {dataPayOpenPay?.payment_method?.reference ? (
              <div className="text-center mb-4">
                <p className="text-xs text-amber-900 font-bold uppercase tracking-wider mb-2">
                  Referencia de Pago
                </p>
              </div>
            ) : null}

            {dataPayOpenPay?.payment_method?.reference ? (
              <div className="w-full flex flex-col items-center">
                {/* Barcode escalado en móvil */}
                <div className="w-full flex justify-center overflow-hidden">
                  <div className="max-w-full overflow-x-auto">
                    <Barcode
                      value={dataPayOpenPay?.payment_method?.reference}
                    />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <button
                    disabled={loadingDownloadBar}
                    onClick={() =>
                      handleDownloadBar(
                        dataPayOpenPay?.payment_method?.reference,
                      )
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
            ) : null}
          </div>

          {/* Datos bancarios SPEI */}
          {(dataPayOpenPay?.payment_method.type === "bank_transfer" ||
            dataPayOpenPay?.payment_method.type === "bank_account") && (
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl mt-2 p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Datos Bancarios
              </h3>
              <div className="space-y-3">
                <DetailRow
                  label="Banco"
                  value={dataPayOpenPay?.payment_method.bank!}
                />
                {dataPayOpenPay?.payment_method?.clabe && (
                  <DetailRow
                    label="CLABE"
                    value={dataPayOpenPay?.payment_method?.clabe}
                    mono
                  />
                )}
                <DetailRow
                  label="Beneficiario"
                  value={"LIZBETH ORDAZ CAMACHO"}
                  mono
                />
                <DetailRow
                  label="Referencia"
                  value={dataPayOpenPay?.payment_method?.name!}
                  mono
                />
              </div>
            </div>
          )}

          {/* Detalles del pago */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl mt-3 p-4">
            <div className="space-y-1">
              <DetailRow
                label="Monto a pagar"
                value={formatAmount(Number(dataPayOpenPay?.amount))}
                bold
              />
              <DetailRow label="Método seleccionado" value={details.name} />
              <DetailRow
                label="ID de transacción"
                value={dataPayOpenPay!.id.toString()}
                mono
              />
            </div>
          </div>

          {/* Botón continuar */}
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => {
                  void completePurchaseCleanup();
                  onRouterLink(
                    `/pay-end?id=${dataPayOpenPay?.id}&idOrder=${
                      dataPayOpenPay?.order_id
                    }&method_pay=${
                      dataPayOpenPay?.payment_method?.type == "card"
                        ? dataPayOpenPay?.card?.type == "credit"
                          ? "tarjeta_de_credito"
                          : "tarjeta_de_debito"
                        : dataPayOpenPay?.payment_method?.type == "store"
                          ? "oxxo"
                          : "transferencia"
                    }`,
                  );
                  socketPagos.current?.emit("updateOrder", {
                    idOrder: Number(dataPayOpenPay?.order_id),
                    method_pay:
                      dataPayOpenPay?.payment_method?.type == "card"
                        ? dataPayOpenPay?.card?.type == "credit"
                          ? "tarjeta_de_credito"
                          : "tarjeta_de_debito"
                        : dataPayOpenPay?.payment_method?.type == "store"
                          ? "oxxo"
                          : "transferencia",
                    statusPay: "pending",
                    statusShip: "procesando",
                  });
                }}
                className="w-full px-4 py-3 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 transition-all text-sm"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 0.2; }
          50%       { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

// Componente auxiliar para los pasos de instrucciones
function InstructionStep({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex gap-4 items-start p-3 bg-white rounded-xl hover:shadow-md transition-shadow">
      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
        {number}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed pt-1">{text}</p>
    </div>
  );
}

// Componente auxiliar para las filas de detalles
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
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 gap-2">
      <span className="text-sm text-gray-600 shrink-0">{label}</span>
      <span
        className={`text-sm text-gray-900 text-right break-all ${mono ? "font-mono" : ""} ${
          bold ? "font-bold text-base" : "font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default PayPending;
