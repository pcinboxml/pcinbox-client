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
  MdSearch,
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
  cancelReason?: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "cancelled":
      return {
        label: "CANCELADA",
        colorClass: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30"
      };
    case "completed":
      return {
        label: "COMPLETADA",
        colorClass: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30"
      };
    case "in_process":
      return {
        label: "EN PROCESO",
        colorClass: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30"
      };
    case "pending":
    default:
      return {
        label: "PENDIENTE",
        colorClass: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30"
      };
  }
};

export default function BookingHistoryPage() {
  const router = useRouter();
  const { requestGet, requestPost } = useService();
  const { setDataModal, socketServer } = useTheContext();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados de filtros y búsqueda avanzada
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const hasActiveFilters = search.trim() !== "" || status !== "all" || startDate !== "" || endDate !== "";

  // Efecto para debounce de búsqueda (450ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reiniciar paginación al buscar
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // Proteger ruta para usuarios no autenticados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/principal");
      }
    }
  }, [router]);

  // Escuchar actualizaciones de estatus de reservación vía Socket.io en tiempo real
  useEffect(() => {
    if (!socketServer || !socketServer.current) return;

    const handleSocketUpdate = (data: any) => {
      if (data && data.reference) {
        setReservations((prev) =>
          prev.map((res) =>
            res.reference === data.reference
              ? {
                ...res,
                status: data.status,
                cancelReason: data.cancelReason !== undefined ? data.cancelReason : res.cancelReason,
              }
              : res
          )
        );
      }
    };

    socketServer.current.on("reservationStatusUpdated", handleSocketUpdate);

    return () => {
      socketServer.current?.off("reservationStatusUpdated", handleSocketUpdate);
    };
  }, [socketServer]);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "15");
      if (status && status !== "all") {
        params.append("status", status);
      }
      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch.trim());
      }
      if (startDate) {
        params.append("startDate", startDate);
      }
      if (endDate) {
        params.append("endDate", endDate);
      }

      const response = await requestGet(`/reservas/getUserReservations?${params.toString()}`);
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
  }, [page, status, debouncedSearch, startDate, endDate]);

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
          border: "1px solid #e4e4e7",
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

          {/* Panel de Búsqueda y Filtros Avanzados */}
          <div
            className="grid grid-cols-1 md:grid-cols-6 items-end bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-150 dark:border-zinc-800/60"
            style={{
              padding: "16px",
              marginBottom: "24px",
              gap: "16px"
            }}
          >
            {/* Buscador de Texto */}
            <div className="md:col-span-2">
              <label
                className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                style={{ marginBottom: "8px" }}
              >
                Búsqueda Avanzada
              </label>
              <div className="relative">
                <span
                  className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500"
                  style={{ paddingLeft: "12px" }}
                >
                  <MdSearch size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Buscar por folio, marca, modelo, servicio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                  style={{
                    paddingLeft: "36px",
                    paddingRight: "12px",
                    paddingTop: "10px",
                    paddingBottom: "10px"
                  }}
                />
              </div>
            </div>

            {/* Selector de Estado */}
            <div>
              <label
                className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                style={{ marginBottom: "8px" }}
              >
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  height: "38px"
                }}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="in_process">En proceso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Selector de Fecha Inicio */}
            <div>
              <label
                className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                style={{ marginBottom: "8px" }}
              >
                Desde
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  height: "38px"
                }}
              />
            </div>

            {/* Selector de Fecha Fin */}
            <div>
              <label
                className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                style={{ marginBottom: "8px" }}
              >
                Hasta
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  height: "38px"
                }}
              />
            </div>

            {/* Botón de Limpiar Filtros */}
            <div>
              {hasActiveFilters ? (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
                  className="w-full flex items-center justify-center rounded-lg border border-[#BB3D4B]/20 hover:border-[#BB3D4B]/40 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 text-[#BB3D4B] text-xs font-bold transition-all duration-200"
                  style={{
                    height: "38px",
                    cursor: "pointer",
                    gap: "6px"
                  }}
                >
                  <MdClose size={16} />
                  <span>Limpiar</span>
                </button>
              ) : (
                <div style={{ height: "38px" }} className="hidden md:block" />
              )}
            </div>
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
            hasActiveFilters ? (
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
                  <MdSearch size={28} />
                </div>
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Sin resultados</h3>
                <p
                  className="text-xs text-zinc-400"
                  style={{
                    marginTop: "4px",
                    maxWidth: "320px",
                    lineHeight: "1.5"
                  }}
                >
                  No se encontraron reservaciones que coincidan con los filtros seleccionados.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setStartDate("");
                    setEndDate("");
                    setPage(1);
                  }}
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
                  Limpiar Filtros
                </button>
              </div>
            ) : (
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
            )
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px"
              }}
            >
              {reservations.map((res) => {
                const isCancelled = res.status === "cancelled";
                const isCompleted = res.status === "completed";
                const statusConf = getStatusConfig(res.status);
                return (
                  <div
                    key={res.idReserva}
                    style={{
                      padding: "20px",
                      display: "flex",
                      flexDirection: "row", // default md
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      border: isCancelled ? "1px solid #fee2e2" : "1px solid #e4e4e7",
                      borderRadius: "16px",
                      backgroundColor: isCancelled ? "#fffbfa" : "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)"
                    }}
                    className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
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
                          className="font-mono text-sm font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          style={{
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            paddingTop: "6px",
                            paddingBottom: "6px",
                            borderRadius: "8px",
                            letterSpacing: "0.05em"
                          }}
                        >
                          {res.reference}
                        </span>

                        {/* Badge de Estatus */}
                        <span
                          className={`text-xs font-extrabold tracking-wider rounded-full border px-3 py-1 ${statusConf.colorClass}`}
                        >
                          {statusConf.label}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          marginTop: "4px"
                        }}
                      >
                        <h4
                          className="text-base font-extrabold text-zinc-950 dark:text-white"
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
                        <p className="text-sm text-zinc-600 dark:text-zinc-400" style={{ margin: "0px" }}>
                          Equipo: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{res.brand} {res.model}</span>
                        </p>
                        <p
                          className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/40"
                          style={{
                            marginTop: "4px",
                            marginBottom: "0px",
                            padding: "10px",
                            borderRadius: "8px",
                            maxWidth: "480px"
                          }}
                        >
                          &quot;{res.description}&quot;
                        </p>

                        {isCancelled && res.cancelReason && (
                          <div
                            className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl max-w-[480px] mt-2"
                            style={{ padding: "10px 14px" }}
                          >
                            <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed whitespace-pre-line">
                              <strong className="text-red-900 dark:text-red-200 font-bold">Motivo de cancelación:</strong> {res.cancelReason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div
                        className="text-sm text-zinc-700 dark:text-zinc-300"
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "16px",
                          marginTop: "8px"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <MdCalendarToday size={15} className="text-[#BB3D4B]" />
                          <span>{formatDate(res.date)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <MdAccessTime size={15} className="text-[#BB3D4B]" />
                          <span className="font-semibold">{res.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    {!isCancelled && !isCompleted && (
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
