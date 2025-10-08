"use client";

import useMisCompras from "@/app/mis-compras/useMisCompras";
import useService from "@/app/services/useService";
import { Alert } from "@mui/material";
import { CheckCircle, Circle, X } from "lucide-react";
import { MdAutorenew } from "react-icons/md";

interface Step {
  id: string;
  title: string;
  date: string;
  time: string;
  completed: boolean;
  current: boolean;
}

interface OrderTimelineProps {
  steps: Step[];
  product: {
    createdAt: string;
    description: string;
    idOrder: number;
    image_url: string[];
    name: string;
    pay_method: string;
    price: string;
    quantity: number;
    totalAmount: string;
    totalSales: number;
    userId: number;
    status: any;
    stripePaymentIntentId: string;
  }[];
}

export const OrderTimeline = ({ steps, product }: OrderTimelineProps) => {
  const { formatCurrency } = useService();

  const {
    handleCancelledCompra,
    handleCancelledCompraInSucursal,
    loadingCancelledCompra,
  } = useMisCompras();

  return product.length > 0 ? (
    product.map((p, index) => {
      return (
        <div className="p-4 bg-white shadow rounded my-5" key={index}>
          <div className="flex gap-4 mb-6  items-center p-3">
            <img
              src={p.image_url[0]}
              alt={p.name}
              className="w-[150px] h-20 rounded object-cover"
            />
            <div className="flex flex-col justify-between">
              <h3 className="text-lg font-semibold" title={p.name}>
                {p.name.length > 20 ? `${p.name.slice(0, 20)}...` : p.name}
              </h3>
              {/* <p className="text-sm text-gray-500">{product.provider}</p> */}
              <p className="text-sm text-gray-600">
                No. de Orden: #{p.idOrder}
              </p>
              <p className="text-sm text-gray-600">
                Precio: {formatCurrency(Number(p.price))}
              </p>
              <p className="text-sm text-gray-600">
                Total con IVA {formatCurrency(Number(p.totalAmount))}
              </p>
              {p.status == "paid" ? (
                <p className="text-sm text-gray-600">
                  {/* Entrega estimada: {product.estimatedDelivery} */}
                  Entrega estimada: {"2025-07-10"}
                </p>
              ) : null}
            </div>
            {/* {product.canCancel && ( */}
            <div className="w-[500px] flex justify-end">
              {(p.pay_method == "tarjeta_de_debito" ||
                p.pay_method == "tarjeta_de_credito") &&
              p.status == "cancelled" ? (
                <p className="text-[#bb3d4b] text-[22px] font-bold">
                  Pedido Cancelado <br />
                  <span className="text-[#606060] text-[15px] font-bold">
                    Tu reembolso estará reflejado a tu tarjeta en un periodo de{" "}
                    <span className="text-[#000] font-bold">5</span> a{" "}
                    <span className="text-[#000] font-bold">10</span> días
                    habiles.
                  </span>
                </p>
              ) : p.pay_method == "oxxo" && p.status == "paid" ? (
                <button
                  disabled={loadingCancelledCompra}
                  onClick={() =>
                    handleCancelledCompra(p.idOrder, p.stripePaymentIntentId)
                  }
                  className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
                >
                  {loadingCancelledCompra ? (
                    <MdAutorenew size={20} className="m-auto the-spinner" />
                  ) : (
                    <>Cancelar pedido</>
                  )}
                </button>
              ) : p.pay_method == "oxxo" && p.status == "pending" ? (
                <p className="text-[#bb3d4b] text-[22px] font-bold">
                  Esperando el pago en el OXXO
                  <br />
                  {/* <button
                    disabled={loadingCancelledCompra}
                    onClick={() => handleCancelledCompraInSucursal(p.idOrder)}
                    className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
                  >
                    {loadingCancelledCompra ? (
                      <MdAutorenew size={20} className="m-auto the-spinner" />
                    ) : (
                      <>Cancelar pedido</>
                    )}
                  </button> */}
                </p>
              ) : p.pay_method == "oxxo" && p.status == "cancelled" ? (
                <p className="text-[#bb3d4b] text-[22px] font-bold">
                  Pedido Cancelado <br />
                  <span className="text-[#606060] text-[15px] font-bold">
                    Comunicate con la sucursal{" "}
                    <span className="text-[#000] font-bold">PCInbox</span> para
                    solicitar tu reembolso.
                    <br />
                    <span className="text-[#606060] text-[15px] font-bold">
                      Envia el No. de orden #{p.idOrder} y tu nombre por favor.
                    </span>
                  </span>
                </p>
              ) : (p.pay_method == "tarjeta_de_debito" ||
                  p.pay_method == "tarjeta_de_credito") &&
                p.status == "paid" ? (
                <button
                  disabled={loadingCancelledCompra}
                  onClick={() =>
                    handleCancelledCompra(p.idOrder, p.stripePaymentIntentId)
                  }
                  className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
                >
                  {loadingCancelledCompra ? (
                    <MdAutorenew size={20} className="m-auto the-spinner" />
                  ) : (
                    <>Cancelar pedido</>
                  )}
                </button>
              ) : p.pay_method == "tarjeta_sucursal" &&
                p.status == "pending" ? (
                <p className="text-[#bb3d4b] text-[22px] font-bold">
                  Esperando el pago en la sucursal PCInbox con tarjeta
                  <br />
                  <button
                    disabled={loadingCancelledCompra}
                    onClick={() => handleCancelledCompraInSucursal(p.idOrder)}
                    className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
                  >
                    {loadingCancelledCompra ? (
                      <MdAutorenew size={20} className="m-auto the-spinner" />
                    ) : (
                      <>Cancelar pedido</>
                    )}
                  </button>
                </p>
              ) : p.pay_method == "tarjeta_sucursal" &&
                p.status == "cancelled" ? (
                <p className="text-[#bb3d4b] text-[22px] font-bold">
                  Pedido cancelado
                </p>
              ) : p.pay_method == "efectivo_sucursal" &&
                p.status == "pending" ? (
                <p className="text-[#bb3d4b] text-[22px] font-bold">
                  Esperando el pago en la sucursal PCInbox en efectivo
                  <br />
                  <button
                    disabled={loadingCancelledCompra}
                    onClick={() => handleCancelledCompraInSucursal(p.idOrder)}
                    className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
                  >
                    {loadingCancelledCompra ? (
                      <MdAutorenew size={20} className="m-auto the-spinner" />
                    ) : (
                      <>Cancelar pedido</>
                    )}
                  </button>
                </p>
              ) : p.pay_method == "efectivo_sucursal" &&
                p.status == "cancelled" ? (
                <p className="text-[#bb3d4b] text-[22px] font-bold">
                  Pedido cancelado
                </p>
              ) : null}
            </div>

            {/* )} */}
          </div>

          {p.status == "paid" ? (
            <ol className="relative border-l border-gray-300 ml-4">
              {steps.map((step, index) => (
                <li key={step.id} className="mb-10 ml-6">
                  <span
                    className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-8 ring-white
                ${
                  step.completed
                    ? step.current
                      ? "bg-blue-500"
                      : "bg-green-500"
                    : "bg-gray-300"
                }
              `}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-white" />
                    )}
                  </span>
                  <h3
                    className={`font-medium ${
                      step.current
                        ? "text-blue-600"
                        : step.completed
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                    {step.date} • {step.time}
                  </time>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      );
    })
  ) : (
    <Alert severity="info">No hay compras en curso</Alert>
  );
};

export default OrderTimeline;
