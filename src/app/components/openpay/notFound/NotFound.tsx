"use client";

const NotFound = () => {
  return (
    <div className="min-h-screen top-0 left-0 right-0 bottom-0 flex items-center justify-center p-5 bg-gradient-to-br from-purple-600 to-purple-800 fixed overflow-hidden">
      {/* Formas flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/12 w-20 h-20 bg-purple-500 opacity-10 rounded-2xl animate-[float_20s_infinite]"></div>
        <div className="absolute top-3/5 right-1/12 w-16 h-16 bg-purple-900 opacity-10 rounded-full animate-[float_20s_infinite_2s]"></div>
        <div className="absolute bottom-1/5 left-1/5 w-24 h-24 bg-amber-500 opacity-10 rounded-3xl animate-[float_20s_infinite_4s]"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div
          className="bg-white rounded-3xl shadow-2xl p-10 md:p-14 animate-[slideUp_0.6s_ease]"
          style={{
            padding: "40px",
          }}
        >
          {/* Número 404 */}
          <div className="text-center">
            <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-5 animate-[glitch_3s_infinite]">
              404
            </div>

            {/* Icono de lupa */}
            <div className="w-32 h-32 mx-auto mb-8 animate-[bounce_2s_ease_infinite]">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 border-8 border-gray-500 rounded-full relative">
                  <div className="absolute -bottom-9 -right-4 w-2 h-10 bg-gray-500 rounded transform rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl text-red-500 font-bold">
                    ×
                  </div>
                </div>
              </div>
            </div>

            {/* Título y descripción */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transacción No Encontrada
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              No pudimos localizar la transacción que buscas. Verifica el ID e
              intenta nuevamente.
            </p>
          </div>

          {/* Enlace de soporte */}
          <div className="text-center text-sm text-gray-600">
            ¿Necesitas ayuda?{" "}
            <a
              href="https://wa.me/message/W345O6QEZDJEP1?src=qr"
              //   onClick={onContactSupport}
              className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
            >
              Contacta a soporte
            </a>
          </div>
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(0) rotate(180deg);
          }
          75% {
            transform: translateY(20px) rotate(270deg);
          }
        }

        @keyframes glitch {
          0%, 90%, 100% {
            transform: translate(0);
          }
          92% {
            transform: translate(-2px, 2px);
          }
          94% {
            transform: translate(2px, -2px);
          }
          96% {
            transform: translate(-2px, -2px);
          }
          98% {
            transform: translate(2px, 2px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
