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
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
}: {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: any;
  children?: React.ReactNode;
  onConfirm: () => void;
  showActions?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;

      // Bloquear el scroll del body
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      setIsVisible(true);
    } else {
      // Restaurar el scroll del body
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }

      setIsVisible(false);
    }

    // Limpieza al desmontar
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // duración animación
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
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
    <div className={`fixed inset-0 z-[11000] flex items-center justify-center`}>
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative bg-[#E6E6E6] rounded shadow-2xl mx-4 p-2 sm:p-3 md:p-4 transform transition-all duration-300 w-fit max-w-[95vw] md:max-w-[700px] lg:max-w-[900px] ${
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
          className="absolute p-2 bg-[#bb3d4b] hover:bg-[#a32d39] transition-colors rounded-full shadow-md z-[60] right-2 top-2 md:-right-4 md:-top-4"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-[white] font-bold" />
        </button>

        <div className="bg-[#E6E6E6] w-full p-2 sm:p-3 mt-8 relative rounded">
          <div className="bg-[white] w-full rounded flex flex-col max-h-[min(70vh,640px)] min-w-[min(100%,320px)]">
            <div
              className={`flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 pt-8 ${
                showActions ? "pb-4" : "pb-5 sm:pb-6"
              }`}
            >
              <div className="flex flex-col items-center w-full">
                <div className="mb-5 flex shrink-0 justify-center">
                  {config.type == "info" ? (
                    <MdInfo size={52} color="#bb3d4b" />
                  ) : config.type == "success" ? (
                    <MdCheckCircle size={52} />
                  ) : config.type == "warning" ? (
                    <MdWarningAmber size={52} color="#bb3d4b" />
                  ) : config.type == "error" ? (
                    <MdError size={52} color="#bb3d4b" />
                  ) : null}
                </div>

                {title && (
                  <h3
                    id="modal-title"
                    className="text-2xl text-center font-bold text-[#606060] mb-4 px-2 w-full"
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
                    className="text-[#808080] text-center leading-relaxed text-base max-w-[420px] mx-auto px-2"
                  >
                    {message}
                  </p>
                ) : (
                  <div className="w-full px-2 sm:px-4">{message}</div>
                )}
                {children}
              </div>
            </div>

            {showActions && showActions == true && (
              <div className="shrink-0 flex gap-4 justify-center px-4 sm:px-6 py-4 border-t border-[#ececec] bg-white rounded-b w-full">
                <button
                  onClick={handleClose}
                  className="border text-[#808080] rounded px-3 py-1.5 min-w-[96px]"
                >
                  {cancelLabel}
                </button>

                <button
                  onClick={handleConfirm}
                  className="text-white font-bold bg-[#bb3d4b] px-3 py-1.5 rounded min-w-[96px]"
                >
                  {confirmLabel}
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
