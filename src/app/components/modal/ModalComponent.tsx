"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ModalType = "success" | "error" | "warning" | "info";

const ModalComponent = ({
  isOpen,
  onClose,
  type = "success",
  title,
  message,

  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;

  onConfirm: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, type]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  };

  const getTypeConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-green-50",
        iconColor: "text-green-500",
        borderColor: "border-green-200",
        buttonColor: "bg-green-600 hover:bg-green-700",
      },
      error: {
        icon: AlertCircle,
        bgColor: "bg-red-50",
        iconColor: "text-red-500",
        borderColor: "border-red-200",
        buttonColor: "bg-red-600 hover:bg-red-700",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        iconColor: "text-yellow-500",
        borderColor: "border-yellow-200",
        buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      },
      info: {
        icon: Info,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-500",
        borderColor: "border-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
      },
    };
    return configs[type] || configs.info;
  };

  const config = getTypeConfig();
  const IconComponent = config.icon;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon container */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${config.bgColor} ${config.borderColor} border-2`}
          >
            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
          </div>

          {/* Title */}
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h3>
          )}

          {/* Message */}
          {message && (
            <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirm}
              className={`px-6 py-2.5 text-white rounded-lg transition-colors font-medium ${config.buttonColor}`}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ejemplo de uso del componente
export default ModalComponent;
