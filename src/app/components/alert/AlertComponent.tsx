import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import useAlert from "./useAlert";

type TypeAlert = "success" | "error" | "warning" | "info";

const AlertComponent = ({
  type = "info",
  title,
  message,
  idAlert,
}: {
  type: TypeAlert;
  title: string;
  message: string;
  idAlert: string;
}) => {
  const { alertRef, handleDismissAlert } = useAlert({
    idAlert,
  });

  const alertStyles = {
    success: {
      bg: "bg-green-50 border-green-200",
      text: "text-green-800",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      text: "text-red-800",
      icon: XCircle,
      iconColor: "text-red-500",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      text: "text-yellow-800",
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-800",
      icon: Info,
      iconColor: "text-blue-500",
    },
  };

  const currentStyle = alertStyles[type];
  const IconComponent = currentStyle.icon;

  return (
    <div
      id={idAlert}
      ref={alertRef}
      className={`border rounded-lg p-4 ${currentStyle.bg} ${currentStyle.text}`}
    >
      <div className="flex items-start">
        <IconComponent
          className={`w-5 h-5 ${currentStyle.iconColor} mt-0.5 mr-3 flex-shrink-0`}
        />

        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          {message && <p className="text-sm">{message}</p>}
        </div>

        <button
          onClick={handleDismissAlert}
          className={`ml-3 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors ${currentStyle.iconColor}`}
          aria-label="Cerrar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertComponent;
