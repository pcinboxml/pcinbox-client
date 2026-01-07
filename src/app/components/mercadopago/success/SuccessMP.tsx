"use client";

const SuccessMP = () => {
  const handleContinue = () => {
    console.log("Continuar clickeado");
    // Aquí puedes agregar la lógica para redirigir
  };

  return (
    <div className="h-[100vh] w-full flex items-center justify-center p-5 bg-gradient-to-br from-[#009ee3] to-[#0081c3] relative overflow-x-hidden">
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

        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }

        .confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: confetti 3s ease-out forwards;
          pointer-events: none;
        }

        .pulse-circle {
          animation: pulse 2s ease infinite;
        }

        .card-animate {
          animation: slideUp 0.5s ease;
        }

        .checkmark path {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheck 0.5s ease forwards 0.3s;
        }
      `}</style>

      {/* Confetti Container */}
      <div
        id="confettiContainer"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      />

      {/* Background Circles */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-[0.08] rounded-full blur-[60px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-[60px]" />

      {/* Main Container */}
      <div className="max-w-lg w-full relative z-10">
        <div
          className="bg-white rounded-3xl shadow-2xl card-animate"
          style={{
            padding: "15px",
          }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 bg-[#00a650] rounded-full opacity-20 pulse-circle" />
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#009ee3] mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="text-base text-gray-600">
              Tu pago se procesó correctamente
            </p>
          </div>

          {/* Amount Box */}
          <div
            style={{
              padding: "10px",
            }}
            className="bg-gradient-to-br from-[#e6f7ff] to-[#cceeff] rounded-2xl mb-6 text-center border-2 border-[#99d5f5]"
          >
            <p className="text-sm text-gray-600 font-medium mb-2">
              Monto pagado
            </p>
            <p className="text-4xl font-bold text-[#009ee3]">
              {/* {formatCurrency(paymentData.transaction_amount)} */}
            </p>
          </div>

          {/* Details Box */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Número de orden</span>
              <span className="text-sm font-semibold text-gray-900">
                {/* #{paymentData.idOrden} */}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">ID de transacción</span>
              <span className="text-sm font-semibold text-gray-900 font-mono">
                {/* {paymentData.id} */}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Fecha y hora</span>
              <span className="text-sm font-semibold text-gray-900">
                {/* {formatDate(paymentData.date_last_updated)} */}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Estado</span>
              <span
                className="text-sm font-semibold"
                // style={{ color: statusInfo.color }}
              >
                {/* {statusInfo.text} */}
              </span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-[#e6f7ff] rounded-xl border border-[#99d5f5]">
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
            onClick={handleContinue}
            style={{
              padding: "10px",
            }}
            className="w-full py-3.5 px-4 bg-[#009ee3] text-white font-semibold rounded border-none cursor-pointer text-base transition-all duration-300 hover:bg-[#0081c3] hover:-translate-y-0.5 hover:shadow-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMP;
