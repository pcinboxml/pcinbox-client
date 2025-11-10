"use client";

import { ChargesOpenPay } from "@/app/interfaces/openpay/charges.interface";
import useService from "@/app/services/useService";
import { useState, useEffect } from "react";

const PaySuccess = ({
  dataPayOpenPay,
}: {
  dataPayOpenPay: ChargesOpenPay | null;
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [checkmarkComplete, setCheckmarkComplete] = useState(false);
  const { onRouterLink } = useService();
  const [loadingRoute, setLoadingRoute] = useState<boolean>(false);

  useEffect(() => {
    // Animación del checkmark
    const timer = setTimeout(() => {
      setCheckmarkComplete(true);
    }, 400);

    // Ocultar confetti después de 3 segundos
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "mxn",
    }).format(value);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-[confetti_3s_ease-out_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                backgroundColor: [
                  "#10b981",
                  "#f59e0b",
                  "#3b82f6",
                  "#ec4899",
                  "#8b5cf6",
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Círculos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full relative z-10">
        <div
          className="bg-white rounded-3xl shadow-2xl animate-[slideUp_0.5s_ease]"
          style={{
            padding: "10px",
          }}
        >
          {/* Icono de éxito con animación */}
          <div className="flex justify-center mb-8">
            <div className="relative w-28 h-28">
              {/* Círculo pulsante */}
              <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-[pulse_2s_ease_infinite]"></div>

              {/* Círculo principal */}
              <div className="absolute inset-0 bg-emerald-500 rounded-full flex items-center justify-center">
                {/* Checkmark animado */}
                <svg className="w-14 h-14" viewBox="0 0 52 52">
                  <circle
                    className="stroke-white fill-none"
                    cx="26"
                    cy="26"
                    r="22"
                    strokeWidth="4"
                  />
                  <path
                    className={`fill-none stroke-white transition-all duration-500 ${
                      checkmarkComplete ? "opacity-100" : "opacity-0"
                    }`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 27l8 8 16-16"
                    style={{
                      strokeDasharray: 48,
                      strokeDashoffset: checkmarkComplete ? 0 : 48,
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Título y mensaje */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-600 mb-3">
              ¡Pago Exitoso!
            </h1>
            {/* <p className="text-gray-600 text-base leading-relaxed">
              Tu pago ha sido procesado correctamente. 
              {customerEmail && (
                <> Recibirás un correo de confirmación en <strong>{customerEmail}</strong></>
              )}
            </p> */}
          </div>

          {/* Monto destacado */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 mb-6 text-center border-2 border-emerald-100">
            <p className="text-sm text-gray-600 font-medium mb-2">
              Monto pagado
            </p>
            <p className="text-4xl font-bold text-emerald-600">
              {formatAmount(Number(dataPayOpenPay?.amount))}
            </p>
          </div>

          {/* Detalles de la transacción */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="space-y-3">
              {dataPayOpenPay?.order_id && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Número de orden</span>
                  <span className="text-sm font-semibold text-gray-900">
                    #{dataPayOpenPay.order_id}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">ID de transacción</span>
                <span className="text-sm font-semibold text-gray-900 font-mono">
                  {dataPayOpenPay?.id}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Fecha y hora</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(dataPayOpenPay?.creation_date!).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Método de pago</span>
                <span className="text-sm font-semibold text-gray-900">
                  {dataPayOpenPay?.card?.card_number}
                </span>
              </div>
              {dataPayOpenPay?.payment_plan && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    Meses sin intereses
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {dataPayOpenPay?.payment_plan?.payments.toString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Badge de confirmación */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold text-emerald-700">
              Transacción segura y verificada
            </span>
          </div>

          <div className="space-y-3 my-2">
            <div className="grid grid-cols-1 gap-3">
              <button
                disabled={loadingRoute}
                onClick={async () => {
                  setLoadingRoute(true);
                  await onRouterLink(
                    `/pay-end?id=${dataPayOpenPay?.id}&idOrder=${
                      dataPayOpenPay?.order_id
                    }&method_pay=${
                      dataPayOpenPay?.method == "card"
                        ? dataPayOpenPay?.card?.type == "credit"
                          ? "tarjeta_de_credito"
                          : "tarjeta_de_debito"
                        : dataPayOpenPay?.method == "store"
                        ? "oxxo"
                        : "transferencia"
                    }`
                  );
                  setLoadingRoute(false);
                }}
                className="px-4 py-3 bg-emerald-500  text-white font-semibold rounded hover:bg-emerald-600 transition-all text-sm"
              >
                Continuar
              </button>
            </div>
          </div>

          {/* Botones de acción */}
          {/* <div className="space-y-3">
            <button
              onClick={onDownloadReceipt}
              className="w-full px-6 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-600/40 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Recibo
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onViewDetails}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                Ver Detalles
              </button>
              <button
                onClick={onGoHome}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
              >
                Ir al Inicio
              </button>
            </div>
          </div> */}

          {/* Footer con iconos de seguridad */}
          {/* <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Encriptado SSL</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Confirmación enviada</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PaySuccess;
