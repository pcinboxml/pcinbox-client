"use client";

import { useTheContext } from "@/app/services/globalContext";

export default function ShippingNotice() {
  const { setDataModal } = useTheContext();

  const zones: string[] = [
    "Silao",
    "Guanajuato",
    "San Felipe",
    "Dolores Hgo. Cuna de la Indep. Nal",
    "San miguel de Allende",
    "Irapuato",
    "Salamanca",
    "San Francisco del Rincón",
    "Purísima del Rincón",
    "Pénjamo",
    "Cuerámaro",
    "Abasolo",
    "León de los Aldama",
  ];

  return (
    <div className="mx-auto p-6">
      <div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow-sm"
        style={{
          padding: "10px",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Información de Envíos
            </h3>
            <p className="text-gray-700 mb-1">
              Por el momento,{" "}
              <span className="font-semibold text-indigo-700">PCinBOX</span> no
              cuenta con servicio de paquetería Express ni con Estafeta.
            </p>
            <p className="text-gray-700 mb-2">
              Realizamos envíos únicamente a{" "}
              <span className="font-medium">León</span> y en otros destinos
              específicos.
            </p>
            <div
              className="flex items-center gap-2 text-sm"
              style={{
                marginBottom: "2px",
              }}
            >
              <span style={{ marginBottom: "10px" }}>
                <a
                  href="#"
                  role="button"
                  onClick={() => {
                    setDataModal({
                      isOpen: true,
                      type: "info",
                      message: (
                        <div className="max-w-2xl mx-auto p-6">
                          <div className="bg-white overflow-hidden">
                            <div className="p-2">
                              <div className="grid grid-cols-4 md:grid-cols-4 gap-3">
                                {zones.map((zone, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                                  >
                                    <div className="flex-shrink-0">
                                      <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                      {zone}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div
                                className="mt-6 pt-6 border-t border-gray-200"
                                style={{ marginTop: "10px" }}
                              >
                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                  <svg
                                    className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span>
                                    Si tu zona no aparece en la lista,
                                    contáctanos para verificar disponibilidad de
                                    entrega.
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ),
                      title: "Destinos especificos",
                      showActions: true,
                      onClose: () => {
                        setDataModal((prev) => ({ ...prev, isOpen: false }));
                      },
                      onConfirm: () => {
                        setDataModal((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                >
                  Mostrar destinos especificos
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>

              <span className="text-gray-600">
                ¿Tienes dudas?{" "}
                <a
                  target="_blank"
                  href="https://wa.me/message/W345O6QEZDJEP1?src=qr"
                  className="text-indigo-600 font-medium hover:text-indigo-700 underline"
                >
                  Comunícate aquí
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
