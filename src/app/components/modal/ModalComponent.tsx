"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { MdCheckCircle, MdError, MdInfo, MdWarningAmber } from "react-icons/md";

type ModalType = "success" | "error" | "warning" | "info";

const ModalComponent = ({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  children,
  onConfirm,
  showActions = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: any;
  children?: React.ReactNode;
  onConfirm: () => void;
  showActions?: boolean;
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
        type: "success",
      },
      error: {
        icon: AlertCircle,
        bgColor: "bg-red-50",
        iconColor: "text-red-500",
        borderColor: "border-red-200",
        buttonColor: "bg-red-600 hover:bg-red-700",
        type: "error",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-50",
        iconColor: "text-yellow-500",
        borderColor: "border-yellow-200",
        buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        type: "warning",
      },
      info: {
        icon: Info,
        bgColor: "bg-blue-50",
        iconColor: "text-blue-500",
        borderColor: "border-blue-200",
        buttonColor: "bg-blue-600 hover:bg-blue-700",
        type: "info",
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
        className={`relative bg-[#E6E6E6] rounded shadow-2xl max-w-lg w-full mx-4 p-8 transform transition-all duration-300 ${
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
          className="absolute p-2 bg-[#bb3d4b]"
          style={{
            right: "-18px",
            top: "-15px",
            borderRadius: "50%",
          }}
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-[white] font-bold" />
        </button>

        <div className="bg-[#E6E6E6] min-h-[200px] flex items-end p-3 mt-5 relative">
          <div
            className="absolute"
            style={{
              transform: "translateX(225px)",
              top: "-17px",
            }}
          >
            {config.type == "info" ? (
              <MdInfo size={55} color="#bb3d4b" />
            ) : config.type == "success" ? (
              <MdCheckCircle size={55} />
            ) : config.type == "warning" ? (
              <MdWarningAmber size={55} color="#bb3d4b" />
            ) : config.type == "error" ? (
              <MdError size={55} color="#bb3d4b" />
            ) : (
              ""
            )}
          </div>
          <div className="bg-[white] w-full py-4 px-2 rounded">
            {title && (
              <h3
                id="modal-title"
                className="text-2xl text-center font-bold text-[#606060]"
                style={{
                  color: "#606060",
                  fontWeight: "bold",
                }}
              >
                {title}
              </h3>
            )}

            {typeof message == "string" ? (
              <p
                id="modal-description"
                className="text-[#808080] text-center mb-8 leading-relaxed text-base max-w-[420px] mx-auto"
              >
                {message}
              </p>
            ) : (
              message
            )}
            {children}

            {showActions && showActions == true && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleClose}
                  className="border text-[#808080] rounded px-2 py-1"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleConfirm}
                  className={` text-white font-bold bg-[#bb3d4b] px-2 py-1 rounded`}
                >
                  Aceptar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
