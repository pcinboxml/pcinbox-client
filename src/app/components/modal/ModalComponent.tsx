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
  children,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;
  children: React.ReactNode;
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
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center`}>
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 p-8 transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center" style={{ padding: "25px" }}>
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${config.bgColor} ${config.borderColor} border-2`}
          >
            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
          </div>

          {title && (
            <h3
              id="modal-title"
              className="text-2xl font-semibold text-gray-900 mb-3"
            >
              {title}
            </h3>
          )}

          {message && (
            <p
              id="modal-description"
              className="text-gray-700 mb-8 leading-relaxed text-base max-w-[420px] mx-auto"
            >
              {message}
            </p>
          )}

          {/* {children} */}
          {children && (
            <div className="flex gap-4 justify-center pb-2">{children}</div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleClose}
              style={{ padding: "10px" }}
              className="border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirm}
              style={{ padding: "10px" }}
              className={` text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${config.buttonColor}`}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
