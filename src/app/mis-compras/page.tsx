"use client";

import { ArrowRight, Calendar, CheckCircle, Eye, Package } from "lucide-react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";

const TimeLineStep = ({ step, isLast }: { step: any; isLast: boolean }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-4">
        <div
          className={`w-4 h-4 rounded-full border-2 ${
            step.completed
              ? step.current
                ? "bg-blue-500 border-blue-500"
                : "bg-green-500 border-green-500"
              : "bg-white border-gray-300"
          }`}
        >
          {step.completed && !step.current && (
            <CheckCircle className="w-4 h-4 text-white -mt-0.5 -ml-0.5" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-0.5 h-12 ${
              step.completed ? "bg-green-200" : "bg-gray-200"
            }`}
          ></div>
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <p
              className={`font-medium ${
                step.current
                  ? "text-blue-600"
                  : step.completed
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {step.step}
            </p>
            <p className="text-sm text-gray-500">
              {step.date} • {step.time}
            </p>
          </div>
          {step.current && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Actual
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const MisCompras = () => {
  return (
    <section
      style={{
        width: "80%",
        margin: "30px auto",
        display: "flex",
      }}
    >
      <div className="w-[280px] border ">
        <SidebarMiCuenta />
      </div>
      <div className="w-[80%] border p-3">
        <span
          className="text-[#bb3d4b]"
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            marginBottom: "10px",
            marginTop: "10px",
            display: "block",
          }}
        >
          Mis compras
        </span>

        <span className="text-[#808080] text-[20px]">
          Compras en cursos (1)
        </span>

        {/* Content de compras en curso */}
        <div className="w-full mt-4 flex flex-col">
          <div
            key={1}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Header de la compra */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4 p-3">
                  <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <Package className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 mx-2">
                      {"Nombre del producto"}
                    </h3>
                    <p className="text-gray-600 mb-2 mx-2">{"Proveedor 1"}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 p-1">
                      <span className="flex items-center mx-1">
                        <Calendar className="w-4 h-4 mx-1" />
                        Pedido: {"2025-09-23"}
                      </span>
                      <span className="flex items-center mx-1">
                        <Eye className="w-4 h-4 mx-1" />
                        {"SKO-12-1222"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right p-3">
                  <p className="text-2xl font-bold text-gray-900">{1200}</p>
                  <p className="text-sm text-gray-500">
                    Entrega: {"2025-09-24"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4 p-3">
                Seguimiento del pedido
              </h4>
              <div className="max-w-lg">
                <TimeLineStep
                  key={1}
                  step={{
                    step: "Pedido confirmado",
                    date: "22 Sep",
                    time: "10:20",
                    completed: true,
                    current: true,
                  }}
                  isLast={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content de compras ya hechas entregadas o canceladas */}
        <div className="w-full mt-4 flex flex-col">
          <div className="grid grid-cols-[1fr]">
            <div
              key={2}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 mx-5 my-2 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">
                      imagen
                    </div>
                    <div className="flex-1 my-2">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {"Nombre del producto"}
                      </h3>
                      <p className="text-sm text-gray-600">{"store"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 px-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      {1200}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {"categoria"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 mb-2">
                    {5}
                    <span className="text-sm text-gray-500 ml-2">({5}/5)</span>
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Entregado: {"2025-09-24"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                      Ver detalles
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MisCompras;
