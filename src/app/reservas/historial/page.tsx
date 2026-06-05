"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useService from "@/app/services/useService";
import { useTheContext } from "@/app/services/globalContext";
import SidebarMiCuenta from "@/app/components/sidebar-mi-cuenta/SidebarMiCuenta";
import {
  MdBuild,
  MdLaptop,
  MdComputer,
  MdCalendarToday,
  MdAccessTime,
  MdInfoOutline,
  MdClose,
  MdRefresh,
  MdAutorenew,
  MdHistory,
} from "react-icons/md";

interface Reservation {
  idReserva: string;
  reference: string;
  service: string;
  deviceType: "PC" | "Laptop";
  brand: string;
  model: string;
  description: string;
  date: string;
  time: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function BookingHistoryPage() {
  const router = useRouter();
  const { requestGet, requestPost } = useService();
  const { setDataModal } = useTheContext();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Proteger ruta para usuarios no autenticados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/principal");
      }
    }
  }, [router]);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await requestGet(`/reservas/getUserReservations?page=${page}&limit=5`);
      if (response && response.status === 200 && response.data) {
        setReservations(response.data.data || []);
        setPagination(response.data.pagination || null);
      }
    } catch (err) {
      console.error("Error al obtener historial de reservas:", err);
      setErrorMsg("Error al obtener tu historial de reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const handleOpenCancel = (ref: string) => {
    setDataModal({
      isOpen: true,
      title: "¿Cancelar reservación?",
      message: (
        <span>
          Esta acción modificará el estado de tu cita de mantenimiento con referencia{" "}
          <strong className="font-mono">{ref}</strong> a &quot;cancelada&quot;. No se puede revertir.
        </span>
      ),
      type: "warning",
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: () => {
        confirmCancellation(ref);
      },
    });
  };

  const confirmCancellation = async (ref: string) => {
    setDataModal((prev) => ({ ...prev, isOpen: false }));
    setErrorMsg("");
    try {
      const response = await requestPost({ reference: ref }, "/reservas/cancel");
      if (response && response.status === 200) {
        setDataModal({
          isOpen: true,
          title: "Reservación Cancelada",
          message: `La reservación con referencia ${ref} ha sido cancelada exitosamente.`,
          type: "success",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }
        });
        fetchHistory(); // Recargar la página actual
      }
    } catch (err: any) {
      console.error("Error al cancelar reserva:", err);
      const message = err?.response?.data?.message || "Ocurrió un error al intentar cancelar la reservación.";
      setDataModal({
        isOpen: true,
        title: "Error al cancelar",
        message,
        type: "error",
        onClose: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        },
        onConfirm: () => {
          setDataModal((prev) => ({ ...prev, isOpen: false }));
        }
      });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      // Ajuste para evitar corrimientos por zona horaria al usar formato UTC
      const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return `${days[localDate.getDay()]} ${localDate.getDate()} de ${months[localDate.getMonth()]} ${localDate.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section className="w-full flex flex-col lg:flex-row">
      {/* Sidebar de Cuenta */}
      <div
        className="hidden lg:block w-[280px] shrink-0"
        style={{
          borderRight: "1px solid #e4e4e7",
          paddingRight: "16px"
        }}
      >
        <SidebarMiCuenta />
      </div>

      {/* Sección de Contenido */}
      <div
        className="w-full lg:flex-grow px-4 py-6 md:px-10 md:py-8"
        style={{
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
          <div>
            <div 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: "1px solid #f4f4f5",
                paddingBottom: "16px",
                marginBottom: "24px"
              }}
            >
              <MdHistory size={26} className="text-[#BB3D4B]" />
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                Historial de Reservas
              </h2>
            </div>

            {errorMsg && (
              <div 
                className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md text-red-700 dark:text-red-400"
                style={{
                  padding: "16px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px"
                }}
              >
                <MdInfoOutline className="flex-shrink-0" size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {loading ? (
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "80px",
                  paddingBottom: "80px",
                  gap: "12px"
                }}
              >
                <MdAutorenew size={36} className="animate-spin text-[#BB3D4B]" style={{ animation: "spin 1s linear infinite" }} />
                <span className="text-xs text-zinc-400">Cargando tus citas...</span>
              </div>
            ) : reservations.length === 0 ? (
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: "64px",
                  paddingBottom: "64px",
                  textAlign: "center"
                }}
              >
                <div 
                  className="rounded-full bg-zinc-50 dark:bg-zinc-800/40"
                  style={{
                    width: "64px",
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "#BB3D4B"
                  }}
                >
                  <MdBuild size={28} />
                </div>
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No tienes reservaciones</h3>
                <p 
                  className="text-xs text-zinc-400"
                  style={{
                    marginTop: "4px",
                    maxWidth: "320px",
                    lineHeight: "1.5"
                  }}
                >
                  Agenda el mantenimiento de tu PC o Laptop hoy mismo en pocos pasos.
                </p>
                <button
                  onClick={() => router.push("/reservas/mantenimiento")}
                  className="bg-[#BB3D4B] hover:bg-[#a5323e] text-white"
                  style={{
                    marginTop: "20px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Agendar Mantenimiento
                </button>
              </div>
            ) : (
              <div 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                {reservations.map((res) => {
                  const isCancelled = res.status === "cancelled";
                  return (
                    <div
                      key={res.idReserva}
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "row", // default md
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        border: "1px solid #e4e4e7",
                        borderRadius: "16px",
                        backgroundColor: isCancelled ? "#f9f9fb" : "#ffffff",
                        opacity: isCancelled ? 0.75 : 1
                      }}
                    >
                      <div 
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px"
                        }}
                      >
                        <div 
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                          }}
                        >
                          <span 
                            className="font-mono text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            style={{
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              paddingTop: "4px",
                              paddingBottom: "4px",
                              borderRadius: "8px",
                              letterSpacing: "0.05em"
                            }}
                          >
                            {res.reference}
                          </span>
                          
                          {/* Badge de Estatus */}
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "800",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                              paddingTop: "2px",
                              paddingBottom: "2px",
                              borderRadius: "9999px",
                              border: "1px solid",
                              backgroundColor: isCancelled ? "rgba(239, 68, 68, 0.05)" : "rgba(245, 158, 11, 0.05)",
                              color: isCancelled ? "#ef4444" : "#d97706",
                              borderColor: isCancelled ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)"
                            }}
                          >
                            {isCancelled ? "CANCELADA" : "PENDIENTE"}
                          </span>
                        </div>

                        <div 
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            marginTop: "4px"
                          }}
                        >
                          <h4 
                            className="text-sm font-bold text-zinc-900 dark:text-white"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              margin: "0px"
                            }}
                          >
                            {res.deviceType === "PC" ? <MdComputer className="text-[#BB3D4B]" /> : <MdLaptop className="text-[#BB3D4B]" />}
                            {res.service}
                          </h4>
                          <p className="text-xs text-zinc-400" style={{ margin: "0px" }}>
                            Equipo: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{res.brand} {res.model}</span>
                          </p>
                          <p 
                            className="text-[11px] text-zinc-400 leading-relaxed italic bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/40"
                            style={{
                              marginTop: "4px",
                              marginBottom: "0px",
                              padding: "8px",
                              borderRadius: "8px",
                              maxWidth: "480px"
                            }}
                          >
                            &quot;{res.description}&quot;
                          </p>
                        </div>

                        <div 
                          className="text-xs text-zinc-500"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "16px",
                            marginTop: "8px"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <MdCalendarToday size={14} className="text-zinc-400" />
                            <span>{formatDate(res.date)}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <MdAccessTime size={14} className="text-zinc-400" />
                            <span className="font-semibold">{res.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      {!isCancelled && (
                        <div 
                          style={{
                            display: "flex",
                            flexDirection: "row", // default row, shared flex-grow
                            gap: "8px",
                            width: "100%",
                            maxWidth: "240px",
                            marginTop: "12px",
                            borderTop: "1px solid #f4f4f5",
                            paddingTop: "12px"
                          }}
                        >
                          <button
                            onClick={() => router.push(`/reservas/mantenimiento?reschedule=${res.reference}`)}
                            style={{
                              flexGrow: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              paddingLeft: "16px",
                              paddingRight: "16px",
                              paddingTop: "8px",
                              paddingBottom: "8px",
                              border: "1px solid #e4e4e7",
                              backgroundColor: "#ffffff",
                              color: "#3f3f46",
                              fontSize: "12px",
                              fontWeight: "bold",
                              borderRadius: "12px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            <MdRefresh size={16} />
                            <span>Reprogramar</span>
                          </button>
                          
                          <button
                            onClick={() => handleOpenCancel(res.reference)}
                            style={{
                              flexGrow: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "6px",
                              paddingLeft: "16px",
                              paddingRight: "16px",
                              paddingTop: "8px",
                              paddingBottom: "8px",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              backgroundColor: "#ffffff",
                              color: "#ef4444",
                              fontSize: "12px",
                              fontWeight: "bold",
                              borderRadius: "12px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            <MdClose size={16} />
                            <span>Cancelar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Paginación */}
          {pagination && pagination.total > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "32px",
                borderTop: "1px solid #f4f4f5",
                paddingTop: "24px"
              }}
            >
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  borderRadius: "8px",
                  border: "1px solid #e4e4e7",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: page === 1 ? "#a1a1aa" : "#4b5563",
                  backgroundColor: "#ffffff",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                Anterior
              </button>
              {Array.from({ length: pagination.totalPages || 1 }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    paddingTop: "6px",
                    paddingBottom: "6px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    border: p === page ? "1px solid #BB3D4B" : "1px solid #e4e4e7",
                    backgroundColor: p === page ? "#BB3D4B" : "#ffffff",
                    color: p === page ? "#ffffff" : "#4b5563",
                    boxShadow: p === page ? "0 4px 6px -1px rgba(187, 61, 75, 0.1)" : "none",
                    transition: "all 0.2s"
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages || pagination.totalPages <= 1}
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "6px",
                  paddingBottom: "6px",
                  borderRadius: "8px",
                  border: "1px solid #e4e4e7",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: (page === pagination.totalPages || pagination.totalPages <= 1) ? "#a1a1aa" : "#4b5563",
                  backgroundColor: "#ffffff",
                  cursor: (page === pagination.totalPages || pagination.totalPages <= 1) ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </section>
  );
}
