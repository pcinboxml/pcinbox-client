import useService from "@/app/services/useService";
import React, { useState, useEffect, JSX } from "react";

const SuccessMP = ({ dataMpPay }: { dataMpPay: any }) => {
  const { onRouterLink } = useService();
  useEffect(() => {
    createConfetti();
  }, []);

  const createConfetti = () => {
    const colors = ["#009ee3", "#00a650", "#ffe600", "#ff5733", "#c70039"];
    const confettiElements: JSX.Element[] = [];

    for (let i = 0; i < 50; i++) {
      confettiElements.push(
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-[confetti_3s_ease-out_forwards]"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      );
    }

    return confettiElements;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleContinue = () => {
    console.log("Continuar clickeado");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009ee3] to-[#0081c3] overflow-x-hidden"
      style={{ padding: "20px" }}
    >
      <style>{`
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
        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease;
        }
        .checkmark path {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheck 0.5s ease forwards 0.3s;
        }
      `}</style>

      {/* Confetti Container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {createConfetti()}
      </div>

      {/* Background Circles */}
      <div
        className="absolute bg-white opacity-[0.08] rounded-full blur-[60px] w-64 h-64"
        style={{ top: "80px", left: "40px" }}
      />
      <div
        className="absolute bg-white opacity-[0.08] rounded-full blur-[60px] w-96 h-96"
        style={{ bottom: "80px", right: "40px" }}
      />

      {/* Main Container */}
      <div className="max-w-[512px] w-full relative z-10">
        <div
          className="bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] animate-slideUp"
          style={{ padding: "40px" }}
        >
          {/* Icon Container */}
          <div className="flex justify-center" style={{ marginBottom: "32px" }}>
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 bg-[#00a650] rounded-full opacity-20 animate-[pulse_2s_ease_infinite]" />
              <div className="absolute inset-0 bg-[#00a650] rounded-full flex items-center justify-center">
                <svg className="w-14 h-14" viewBox="0 0 52 52">
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    stroke="white"
                    fill="none"
                    strokeWidth="4"
                  />
                  <path
                    className="checkmark"
                    d="M14 27l8 8 16-16"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center" style={{ marginBottom: "32px" }}>
            <h1
              className="text-[30px] font-bold text-[#009ee3]"
              style={{ marginBottom: "8px" }}
            >
              ¡Pago Exitoso!
            </h1>
            <p className="text-base text-gray-500">
              Tu pago se procesó correctamente
            </p>
          </div>

          {/* Amount Box */}
          <div
            className="bg-gradient-to-br from-[#e6f7ff] to-[#cceeff] rounded-2xl text-center border-2 border-[#99d5f5]"
            style={{ padding: "24px", marginBottom: "24px" }}
          >
            <p
              className="text-sm text-gray-600 font-medium"
              style={{ marginBottom: "8px" }}
            >
              Monto pagado
            </p>
            <p className="text-4xl font-bold text-[#009ee3]">
              {formatCurrency(dataMpPay?.transaction_amount)}
            </p>
          </div>

          {/* Details Box */}
          <div
            className="bg-gray-50 rounded-2xl"
            style={{ padding: "20px", marginBottom: "24px" }}
          >
            <div
              className="flex justify-between items-center border-b border-gray-200"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">Número de orden</span>
              <span className="text-sm font-semibold text-gray-900">
                #{dataMpPay?.metadata?.id_order}
              </span>
            </div>

            <div
              className="flex justify-between items-center border-b border-gray-200"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">ID de transacción</span>
              <span className="text-sm font-semibold text-gray-900 font-mono">
                {dataMpPay?.id}
              </span>
            </div>

            <div
              className="flex justify-between items-center border-b border-gray-200"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">Fecha y hora</span>
              <span className="text-sm font-semibold text-gray-900">
                {new Date(dataMpPay?.date_approved).toLocaleString()}
              </span>
            </div>

            {dataMpPay?.card && Object.keys(dataMpPay.card).length > 0 ? (
              <>
                <div
                  className="flex justify-between items-center border-b border-gray-200"
                  style={{ padding: "8px 0" }}
                >
                  <span className="text-sm text-gray-600">Metodo de pago</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {dataMpPay?.card?.tags[0] == "credit"
                      ? "Tarjeta de Crédito"
                      : "Tarjeta de Débito"}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center border-b border-gray-200"
                  style={{ padding: "8px 0" }}
                >
                  <span className="text-sm text-gray-600">No. Tarjeta</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {dataMpPay?.card?.last_four_digits}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex justify-between items-center border-b border-gray-200"
                  style={{ padding: "8px 0" }}
                >
                  <span className="text-sm text-gray-600">Metodo de pago</span>
                  <span className="text-sm font-semibold text-gray-900">
                    Pagado con saldo
                  </span>
                </div>
              </>
            )}

            <div
              className="flex justify-between items-center"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">Estado</span>
              <span className="text-sm font-semibold text-[#00a650]">
                Aprobado
              </span>
            </div>
          </div>

          {/* Security Badge */}
          <div
            className="flex items-center justify-center gap-2 bg-[#e6f7ff] rounded-xl border border-[#99d5f5]"
            style={{ padding: "12px", marginBottom: "24px" }}
          >
            <svg
              className="w-5 h-5 text-[#009ee3]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold text-[#0081c3]">
              Transacción protegida por Mercado Pago
            </span>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              //   setLoadingRoute(true);

              onRouterLink(
                `/pay-end?id=${dataMpPay?.id}&idOrder=${dataMpPay?.metadata?.id_order}&method_pay=mercadopago&provider=mp`
              );
              //  setLoadingRoute(false);
            }}
            className="w-full bg-[#009ee3] text-white font-semibold rounded-lg border-none cursor-pointer text-base transition-all duration-300 hover:bg-[#0081c3] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,158,227,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ padding: "14px 16px" }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMP;
