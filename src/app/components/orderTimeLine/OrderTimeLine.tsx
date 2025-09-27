"use client";

import { CheckCircle, Circle, X } from "lucide-react";

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
    name: string;
    image: string;
    provider: string;
    price: number;
    orderCode: string;
    orderDate: string;
    estimatedDelivery: string;
    canCancel: boolean;
  };
  onCancel: () => void;
}

export const OrderTimeline = ({
  steps,
  product,
  onCancel,
}: OrderTimelineProps) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="flex gap-4 mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-20 h-20 rounded object-cover"
        />
        <div className="flex flex-col justify-between">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.provider}</p>
          <p className="text-sm text-gray-600">
            Código de pedido: {product.orderCode}
          </p>
          <p className="text-sm text-gray-600">Precio: ${product.price}</p>
          <p className="text-sm text-gray-600">
            Entrega estimada: {product.estimatedDelivery}
          </p>
        </div>
        {product.canCancel && (
          <div className="ml-auto">
            <button
              onClick={onCancel}
              className="bg-[#bb3d4b] text-white font-bold p-2 rounded"
            >
              Cancelar pedido
            </button>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default OrderTimeline;
