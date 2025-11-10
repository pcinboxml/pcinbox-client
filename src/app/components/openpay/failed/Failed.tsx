"use client";

import React, { useState } from "react";
import { XCircle, Clock, FileText, DollarSign, Hash } from "lucide-react";
import { ChargesOpenPay } from "@/app/interfaces/openpay/charges.interface";
import { MdAutorenew } from "react-icons/md";
import usePasarelaDePagos from "@/app/services/pasarela-de-pagos/usePasarelaDePagos";
import useStorage from "@/app/services/useStorage";

const Failed = ({
  dataPayOpenPay,
}: {
  dataPayOpenPay: ChargesOpenPay | null;
}) => {
  const { requestPostPagos } = usePasarelaDePagos();
  const [loadingRetryPayment, setLoadingRetryPayment] =
    useState<boolean>(false);

  const { progressPay } = useStorage();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 fixed top-0 left-0 right-0 bottom-0">
      <div className="max-w-lg w-full">
        {/* Recibo */}

        <div className="bg-white rounded-lg shadow-2xl overflow-hidden p-3">
          {/* Header - Estado de Pago */}
          <div
            className="bg-red-500 text-center"
            style={{ padding: "10px", marginBottom: "10px" }}
          >
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-2">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Pago Rechazado
            </h1>
            <p className="text-red-100 text-sm">
              La transacción no se completó
            </p>
          </div>

          {/* Detalles de la transacción */}
          <div className="p-8">
            {/* Alerta con razón del error */}
            {/* <div
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded"
              style={{ marginBottom: "10px" }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 mb-1">
                    Razón del rechazo
                  </p>
                  <p className="text-red-700 text-sm">{/* {errorReason} </p>*/}
            {/* </div>
              </div>
            </div>  */}

            {/* Información de la transacción */}
            <div className="space-y-4 mb-6 grid grid-cols-[1fr_1fr]">
              {/* <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                <Hash className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Tarjeta</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                    {dataPayOpenPay?.card?.card_number}
                  </p>
                </div>
              </div> */}
              {/* ID de Transacción */}
              <div className="flex items-start gap-3 pb-4 pt-2 border-b border-gray-200">
                <Hash className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">
                    ID de Transacción
                  </p>
                  <p className="font-mono text-sm font-semibold text-gray-900 break-all">
                    {dataPayOpenPay?.id}
                  </p>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div className="flex items-start gap-3 pb-4 pt-2 border-b border-gray-200">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Fecha y Hora</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(dataPayOpenPay!.operation_date).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Descripción del Producto */}
              <div className="flex items-start gap-3 pb-4 pt-2 border-b border-gray-200">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Descripción</p>
                  <p className="font-semibold text-gray-900">
                    {dataPayOpenPay?.description}
                  </p>
                </div>
              </div>

              {/* Monto */}
              <div className="flex items-start gap-3 pb-2 pt-2">
                <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Monto</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${dataPayOpenPay?.amount.toFixed(2)}{" "}
                    <span className="text-lg text-gray-500">MXN</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Estado Final */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Estado</span>
                <span className="bg-red-100 text-red-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                  RECHAZADO
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                disabled={loadingRetryPayment}
                onClick={async () => {
                  try {
                    setLoadingRetryPayment(true);

                    const resp = await requestPostPagos(
                      {
                        orderId: dataPayOpenPay?.order_id,
                        idUser: localStorage.getItem("idUser"),
                        idAddress: progressPay.optionSend.address,
                      },
                      "/openpay/retryPaymentOpenPay"
                    );

                    setLoadingRetryPayment(false);

                    if (resp.status == 200) {
                      const data = resp.data;

                      location.href = data.data.checkout_link;
                    }
                  } catch (error) {
                    setLoadingRetryPayment(false);
                  }
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded transition-colors"
              >
                {/* Intentar de Nuevo */}
                {loadingRetryPayment ? (
                  <MdAutorenew size={20} className="m-auto the-spinner" />
                ) : (
                  <>Intentar de nuevo</>
                )}
              </button>

              <button
                onClick={() => {
                  location.href = "https://wa.me/message/W345O6QEZDJEP1?src=qr";
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Contactar Soporte
              </button>
            </div>

            {/* Nota informativa */}
            {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> No se realizó ningún cargo a tu cuenta. 
                Guarda el ID de transacción si necesitas contactar a soporte.
              </p>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Este recibo es únicamente informativo
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Failed;
