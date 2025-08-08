"use client";

import { Mail, Shield } from "lucide-react";
import useForgotPassword from "./useForgotPassword";

const ForgotPassword = () => {
  const { emailR, handleInputChange, loading, handleClick, handleKeyup } =
    useForgotPassword();

  return (
    <section className="w-full mt-2">
      <div className=" via-white to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Recuperar Contraseña
                </h1>
                <p className="text-gray-600 mt-2">
                  Ingresa tu correo electrónico y te enviaremos un enlace seguro
                  para restablecer tu contraseña. Recibirás instrucciones
                  detalladas para crear una nueva contraseña en pocos minutos.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={emailR}
                    onChange={handleInputChange}
                    onKeyUp={handleKeyup}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={handleClick}
                  disabled={loading || !emailR}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Enviar Enlace de Recuperación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-sm text-gray-600">
              Revisa tu bandeja de entrada y carpeta de spam
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
