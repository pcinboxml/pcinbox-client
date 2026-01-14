"use client";

import React, { useState, useEffect } from "react";

interface TimelineStep {
  title: string;
  description: string;
}

interface PendingConfig {
  message: string;
  detail: string;
  showPaymentMethod?: boolean;
  paymentInstructions?: string;
  paymentMethodTitle?: string;
  showBarcode?: boolean;
  timeline?: TimelineStep[];
  info?: string[];
}

interface PaymentData {
  status: string;
  status_detail?: string;
  payment_type_id?: string;
  idOrden?: string;
  id: string;
  date_created: string;
  date_of_expiration?: string;
  transaction_amount: number;
  barcode?: {
    content: string;
  };
}

const PendingMP: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [pendingInfo, setPendingInfo] = useState<PendingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const getPendingInfo = (
    statusDetail?: string,
    paymentTypeId?: string
  ): PendingConfig => {
    const configs: Record<string, PendingConfig> = {
      pending_contingency: {
        message: "Verificando Pago",
        detail: "Estamos verificando tu pago con la entidad emisora",
        timeline: [
          {
            title: "Verificación en proceso",
            description: "Validando la transacción con tu banco",
          },
          {
            title: "Confirmación",
            description: "Recibirás un email cuando se confirme",
          },
          { title: "Completado", description: "Tu pedido será procesado" },
        ],
        info: [
          "Este proceso puede tardar hasta 48 horas",
          "Te notificaremos por email cualquier novedad",
          "No es necesario realizar ninguna acción adicional",
        ],
      },
      pending_review_manual: {
        message: "Revisión Manual",
        detail: "Tu pago está siendo revisado por nuestro equipo",
        timeline: [
          {
            title: "Revisión en curso",
            description: "Nuestro equipo está validando la información",
          },
          {
            title: "Aprobación",
            description: "Te contactaremos si necesitamos algo",
          },
          {
            title: "Confirmación",
            description: "Recibirás confirmación por email",
          },
        ],
        info: [
          "La revisión puede tardar de 1 a 3 días hábiles",
          "Te contactaremos si necesitamos información adicional",
          "Mantén tu email actualizado",
        ],
      },
      pending_waiting_payment: {
        message: "Esperando Pago",
        detail: "Complete el pago según las instrucciones",
        showPaymentMethod: true,
        timeline: [
          {
            title: "Realiza el pago",
            description: "Completa el pago en el punto autorizado",
          },
          {
            title: "Procesamiento",
            description: "El sistema procesará tu pago automáticamente",
          },
          {
            title: "Confirmación",
            description: "Recibirás tu comprobante por email",
          },
        ],
        info: [
          "Conserva tu comprobante de pago",
          "El pago puede tardar hasta 24 horas en acreditarse",
          "Paga antes de la fecha de vencimiento",
        ],
      },
      pending_waiting_transfer: {
        message: "Esperando Transferencia",
        detail: "Realiza la transferencia según las instrucciones",
        showPaymentMethod: true,
        timeline: [
          {
            title: "Realiza la transferencia",
            description: "Usa los datos bancarios proporcionados",
          },
          {
            title: "Validación",
            description: "Verificaremos el pago en 1-2 días hábiles",
          },
          {
            title: "Confirmación",
            description: "Te notificaremos cuando se confirme",
          },
        ],
        info: [
          "Guarda el comprobante de transferencia",
          "Usa exactamente el monto indicado",
          "Incluye el número de referencia en la transferencia",
        ],
      },
      default: {
        message: "Procesando Pago",
        detail: "Tu pago está siendo procesado",
        timeline: [
          {
            title: "Validación",
            description: "Verificando la información del pago",
          },
          {
            title: "Procesamiento",
            description: "Procesando con la entidad financiera",
          },
          {
            title: "Confirmación",
            description: "Recibirás confirmación por email",
          },
        ],
        info: [
          "Este proceso puede tardar unos minutos",
          "Recibirás un email de confirmación",
          "No es necesario realizar ninguna acción",
        ],
      },
    };

    const config = configs[statusDetail || "default"] || configs.default;

    if (config.showPaymentMethod) {
      if (paymentTypeId === "ticket" || paymentTypeId === "atm") {
        config.paymentInstructions =
          "Acude a cualquier punto autorizado y proporciona el código de barras para completar tu pago.";
        config.paymentMethodTitle = "Paga en efectivo";
        config.showBarcode = true;
      } else if (paymentTypeId === "bank_transfer") {
        config.paymentInstructions =
          "Realiza una transferencia bancaria usando los datos proporcionados en tu email.";
        config.paymentMethodTitle = "Transferencia bancaria";
      } else {
        config.paymentInstructions =
          "Sigue las instrucciones enviadas a tu email para completar el pago.";
        config.paymentMethodTitle = "Completa tu pago";
      }
    }

    return config;
  };

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
    //     const info = getPendingInfo(data.status_detail, data.payment_type_id);
    //     setPendingInfo(info);
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

  const handleCheckStatus = () => {
    console.log("Verificando estado del pago");
    window.location.reload();
  };

  const handleGoBack = () => {
    console.log("Volver al inicio");
  };

  useEffect(() => {
    if (paymentData?.barcode?.content && pendingInfo?.showBarcode) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js";
      script.onload = () => {
        const JsBarcode = (window as any).JsBarcode;
        if (JsBarcode) {
          try {
            JsBarcode("#barcode", paymentData.barcode!.content, {
              format: "CODE128",
              width: 2,
              height: 60,
              displayValue: false,
            });
          } catch (error) {
            console.log("Error generando código de barras:", error);
          }
        }
      };
      document.body.appendChild(script);
    }
  }, [paymentData, pendingInfo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f59e0b] to-[#d97706]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!paymentData || !pendingInfo) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f59e0b] to-[#d97706] overflow-x-hidden"
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
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease;
        }
        .clock-hand {
          transform-origin: center;
          animation: rotate 2s linear infinite;
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
              <div className="absolute inset-0 bg-[#f59e0b] rounded-full opacity-20 animate-[pulse_2s_ease_infinite]" />
              <div className="absolute inset-0 bg-[#f59e0b] rounded-full flex items-center justify-center">
                <svg className="w-14 h-14" viewBox="0 0 52 52">
                  <circle
                    cx="26"
                    cy="26"
                    r="22"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  />
                  <path
                    className="clock-hand"
                    d="M26 26 L26 12"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M26 26 L34 26"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center" style={{ marginBottom: "32px" }}>
            <h1
              className="text-[30px] font-bold text-[#f59e0b]"
              style={{ marginBottom: "8px" }}
            >
              Pago Pendiente
            </h1>
            <p className="text-base text-gray-500">
              Tu pago está siendo procesado
            </p>
          </div>

          {/* Status Box */}
          <div
            className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-2xl text-center border-2 border-[#fcd34d]"
            style={{ padding: "24px", marginBottom: "24px" }}
          >
            <p
              className="text-sm text-[#92400e] font-medium"
              style={{ marginBottom: "8px" }}
            >
              Estado del pago
            </p>
            <p
              className="text-lg font-semibold text-[#d97706]"
              style={{ marginBottom: "8px" }}
            >
              {pendingInfo.message}
            </p>
            <p className="text-sm text-[#78350f]">{pendingInfo.detail}</p>
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
              Monto
            </p>
            <p className="text-[28px] font-bold text-gray-700">
              {formatCurrency(paymentData.transaction_amount || 0)}
            </p>
          </div>

          {/* Payment Method Box */}
          {pendingInfo.showPaymentMethod && (
            <div
              className="bg-gradient-to-br from-[#fef3c7] to-[#fde68a] rounded-xl border border-[#fcd34d]"
              style={{ padding: "16px", marginBottom: "24px" }}
            >
              <p
                className="text-sm font-semibold text-[#92400e]"
                style={{ marginBottom: "12px" }}
              >
                {pendingInfo.paymentMethodTitle}
              </p>
              <p className="text-sm text-[#78350f] leading-relaxed">
                {pendingInfo.paymentInstructions}
              </p>

              {/* Barcode Container */}
              {pendingInfo.showBarcode && paymentData.barcode && (
                <div
                  className="bg-white rounded-lg text-center"
                  style={{ padding: "16px", marginTop: "12px" }}
                >
                  <p
                    className="text-xs text-gray-500"
                    style={{ marginBottom: "8px" }}
                  >
                    Código de barras
                  </p>
                  <svg id="barcode" className="max-w-full h-auto"></svg>
                  <p
                    className="font-mono text-base font-bold text-gray-900 tracking-wider"
                    style={{ marginTop: "12px", marginBottom: "12px" }}
                  >
                    {paymentData.barcode.content}
                  </p>
                </div>
              )}
            </div>
          )}

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
                {paymentData.date_created
                  ? new Date(paymentData.date_created).toLocaleString()
                  : "-"}
              </span>
            </div>

            <div
              className="flex justify-between items-center border-b border-gray-200"
              style={{ padding: "8px 0" }}
            >
              <span className="text-sm text-gray-600">Estado</span>
              <span className="text-sm font-semibold text-[#f59e0b]">
                Pendiente
              </span>
            </div>

            {paymentData.date_of_expiration && (
              <div
                className="flex justify-between items-center"
                style={{ padding: "8px 0" }}
              >
                <span className="text-sm text-gray-600">Vence el</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(paymentData.date_of_expiration).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Timeline Box */}
          {pendingInfo.timeline && (
            <div
              className="bg-[#eff6ff] rounded-xl border border-[#bfdbfe]"
              style={{ padding: "20px", marginBottom: "24px" }}
            >
              <div
                className="flex items-center gap-2 text-sm font-semibold text-[#1e40af]"
                style={{ marginBottom: "16px" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                ¿Qué sigue?
              </div>
              <div className="flex flex-col gap-3">
                {pendingInfo.timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="min-w-[28px] h-7 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1" style={{ paddingTop: "4px" }}>
                      <div
                        className="text-sm font-semibold text-[#1e3a8a]"
                        style={{ marginBottom: "2px" }}
                      >
                        {step.title}
                      </div>
                      <div className="text-[13px] text-slate-600">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          {pendingInfo.info && (
            <div
              className="bg-[#fef3c7] rounded-xl border border-[#fcd34d]"
              style={{ padding: "16px", marginBottom: "24px" }}
            >
              <div
                className="flex items-center gap-2 text-sm font-semibold text-[#92400e]"
                style={{ marginBottom: "8px" }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Información importante
              </div>
              <ul className="list-none" style={{ paddingLeft: "0" }}>
                {pendingInfo.info.map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-[#78350f] relative"
                    style={{
                      marginBottom:
                        index === pendingInfo.info!.length - 1 ? "0" : "6px",
                      paddingLeft: "20px",
                    }}
                  >
                    <span
                      className="absolute text-[#f59e0b]"
                      style={{ left: "8px" }}
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Button Group */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckStatus}
              className="w-full bg-[#f59e0b] text-white font-semibold rounded-lg border-none cursor-pointer text-base transition-all duration-300 hover:bg-[#d97706] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(245,158,11,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ padding: "14px 16px" }}
            >
              Verificar Estado
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

export default PendingMP;
