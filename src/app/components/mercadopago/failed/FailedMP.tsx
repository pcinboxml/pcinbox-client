"use client";

import React, { useState, useEffect } from "react";

interface PaymentData {
  status: string;
  status_detail?: string;
  idOrden?: string;
  id: string;
  date_last_updated: string;
  transaction_amount: number;
}

const FailedMP: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    // const params = new URLSearchParams(window.location.search);
    // const preferenceId = params.get('preference_id');
    // const paymentId = params.get('payment_id');
    // if (!preferenceId && !paymentId) {
    //   alert('Id de pago no encontrado');
    //   setLoading(false);
    //   return;
    // }
    // try {
    //   const response = await fetch(
    //     `https://977b168e0530.ngrok-free.app/api/v1/mercadopago/getPaymentById?idPayment=${paymentId}&preferenceId=${preferenceId}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    //       },
    //     }
    //   );
    //   if (response.status === 200) {
    //     const data = await response.json();
    //     setPaymentData(data);
    //   }
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleRetry = () => {
    console.log("Reintentar pago");
  };

  const handleGoBack = () => {
    console.log("Volver al inicio");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dc2626] to-[#b91c1c]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!paymentData) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dc2626] to-[#b91c1c] overflow-x-hidden"
      style={{ padding: "20px" }}
    >
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
        @keyframes drawX {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease;
        }
        .x-mark path {
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: drawX 0.5s ease forwards 0.3s;
        }
      `}</style>

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
              <div className="absolute inset-0 bg-[#dc2626] rounded-full opacity-20 animate-[pulse_2s_ease_infinite]" />
              <div className="absolute inset-0 bg-[#dc2626] rounded-full flex items-center justify-center">
                <svg className="w-14 h-14" viewBox="0 0 52 52">
                  <path
                    className="x-mark"
                    d="M16 16 L36 36 M36 16 L16 36"
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
              className="text-[30px] font-bold text-[#dc2626]"
              style={{ marginBottom: "8px" }}
            >
              Pago No Procesado
            </h1>
            <p className="text-base text-gray-500">
              Tu pago no pudo ser completado
            </p>
          </div>

          {/* Error Box */}
          <div
            className="bg-gradient-to-br from-[#fee2e2] to-[#fecaca] rounded-2xl text-center border-2 border-[#fca5a5]"
            style={{ padding: "24px", marginBottom: "24px" }}
          >
            <p
              className="text-sm text-[#991b1b] font-medium"
              style={{ marginBottom: "8px" }}
            >
              Motivo del rechazo
            </p>
            <p
              className="text-lg font-semibold text-[#dc2626]"
              style={{ marginBottom: "8px" }}
            >
              Error en el procesamiento
            </p>
            <p className="text-sm text-[#7f1d1d]"></p>
          </div>

          {/* Amount Box */}
          <div
            className="bg-gray-50 rounded-xl text-center"
            style={{ padding: "16px", marginBottom: "24px" }}
          >
            <p
              className="text-sm text-gray-500"
              style={{ marginBottom: "4px" }}
            >
              Monto intentado
            </p>
            <p className="text-[28px] font-bold text-gray-700">
              {formatCurrency(paymentData.transaction_amount || 0)}
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
                {paymentData.idOrden ? `#${paymentData.idOrden}` : "-"}
              </span>
            </div>

            <div
              className="flex justify-between items-center border-b border-gray-200"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">ID de transacción</span>
              <span className="text-sm font-semibold text-gray-900 font-mono">
                {paymentData.id || "-"}
              </span>
            </div>

            <div
              className="flex justify-between items-center border-b border-gray-200"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">Fecha y hora</span>
              <span className="text-sm font-semibold text-gray-900">
                {paymentData.date_last_updated
                  ? new Date(paymentData.date_last_updated).toLocaleString()
                  : "-"}
              </span>
            </div>

            <div
              className="flex justify-between items-center"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">Estado</span>
              <span className="text-sm font-semibold text-gray-900">-</span>
            </div>
          </div>

          {/* Info Box */}
          <div
            className="bg-[#eff6ff] rounded-xl border border-[#bfdbfe]"
            style={{ padding: "16px", marginBottom: "24px" }}
          >
            <div
              className="flex items-center gap-2 text-sm font-semibold text-[#1e40af]"
              style={{ marginBottom: "8px" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              ¿Qué puedes hacer?
            </div>
            <ul className="list-none" style={{ paddingLeft: "0" }}>
              <li
                className="text-sm text-[#1e3a8a] relative"
                style={{ marginBottom: "6px", paddingLeft: "20px" }}
              >
                <span
                  className="absolute text-[#3b82f6]"
                  style={{ left: "8px" }}
                >
                  •
                </span>
                Verifica que los datos de tu tarjeta sean correctos
              </li>
              <li
                className="text-sm text-[#1e3a8a] relative"
                style={{ marginBottom: "6px", paddingLeft: "20px" }}
              >
                <span
                  className="absolute text-[#3b82f6]"
                  style={{ left: "8px" }}
                >
                  •
                </span>
                Asegúrate de tener fondos suficientes
              </li>
              <li
                className="text-sm text-[#1e3a8a] relative"
                style={{ marginBottom: "6px", paddingLeft: "20px" }}
              >
                <span
                  className="absolute text-[#3b82f6]"
                  style={{ left: "8px" }}
                >
                  •
                </span>
                Contacta a tu banco para verificar el estado de tu tarjeta
              </li>
              <li
                className="text-sm text-[#1e3a8a] relative"
                style={{ paddingLeft: "20px" }}
              >
                <span
                  className="absolute text-[#3b82f6]"
                  style={{ left: "8px" }}
                >
                  •
                </span>
                Intenta con otro método de pago
              </li>
            </ul>
          </div>

          {/* Button Group */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full bg-[#dc2626] text-white font-semibold rounded-lg border-none cursor-pointer text-base transition-all duration-300 hover:bg-[#b91c1c] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(220,38,38,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ padding: "14px 16px" }}
            >
              Intentar Nuevamente
            </button>
            <button
              onClick={handleGoBack}
              className="w-full bg-gray-100 text-gray-700 font-semibold rounded-lg border-none cursor-pointer text-base transition-all duration-300 hover:bg-gray-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ padding: "14px 16px" }}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedMP;
