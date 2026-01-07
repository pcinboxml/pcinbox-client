"use client";

import React, { useEffect, useState } from "react";
import useService from "../services/useService";
import SuccessMP from "../components/mercadopago/success/SuccessMP";

interface PaymentData {
  status: string;
  idOrden: string;
  id: string;
  date_last_updated: string;
  transaction_amount: number;
}

const EstatusMP = () => {
  const { formatCurrency } = useService();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createConfetti();
    fetchPaymentData();
  }, []);

  const createConfetti = () => {
    const container = document.getElementById("confettiContainer");
    if (!container) return;

    const colors = ["#009ee3", "#00a650", "#ffe600", "#ff5733", "#c70039"];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + "s";
      confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
      container.appendChild(confetti);
    }
  };

  const fetchPaymentData = async () => {
    const params = new URLSearchParams(window.location.search);
    const preferenceId = params.get("preference_id");
    const paymentId = params.get("payment_id");

    // if (!preferenceId && !paymentId) {
    //   setError("ID de pago no encontrado");
    //   setLoading(false);
    //   return;
    // }

    // try {
    //   const token = localStorage.getItem("token") || "";
    //   const response = await fetch(
    //     `https://977b168e0530.ngrok-free.app/api/v1/mercadopago/getPaymentById?idPayment=${paymentId}&preferenceId=${preferenceId}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (response.status === 200) {
    //     const data: PaymentData = await response.json();
    //     console.log(data);
    //     setPaymentData(data);
    //   } else {
    //     setError("Error al obtener datos del pago");
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setError("Error de conexión");
    // } finally {
    //   setLoading(false);
    // }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      approved: { text: "Aprobado", color: "#00a650" },
      pending: { text: "Pendiente", color: "#ffa500" },
      in_process: { text: "En proceso", color: "#0081c3" },
      rejected: { text: "Rechazado", color: "#dc2626" },
      cancelled: { text: "Cancelado", color: "#6b7280" },
      refunded: { text: "Reembolsado", color: "#7c3aed" },
      charged_back: { text: "Contracargo", color: "#dc2626" },
    };

    return statusMap[status] || { text: "Desconocido", color: "#6b7280" };
  };

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009ee3] to-[#0081c3]">
  //         <div className="text-white text-xl">Cargando...</div>
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#009ee3] to-[#0081c3]">
  //         <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md">
  //           <div className="text-red-600 text-xl font-bold text-center">
  //             {error}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!paymentData) return null;

  //   const statusInfo = getStatusInfo(paymentData.status);

  return <SuccessMP />;
};

export default EstatusMP;
