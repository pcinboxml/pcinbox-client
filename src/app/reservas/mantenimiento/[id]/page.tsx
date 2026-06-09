"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useService from "@/app/services/useService";
import { useTheContext } from "@/app/services/globalContext";
import SidebarMiCuenta from "@/app/components/sidebar-mi-cuenta/SidebarMiCuenta";
import {
  MdBuild,
  MdLaptop,
  MdComputer,
  MdSearch,
  MdAutorenew,
  MdCheckCircle,
  MdCalendarToday,
  MdAccessTime,
  MdPerson,
  MdPhone,
  MdEmail,
  MdInfoOutline,
  MdClose,
  MdRefresh,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

const SERVICES = [
  {
    id: "preventivo",
    name: "Mantenimiento preventivo",
    icon: MdBuild,
    description: "Limpieza interna profunda, soplado de polvo, lubricación de ventiladores y cambio de pasta térmica de alto rendimiento.",

  },
  {
    id: "diagnostico",
    name: "Diagnóstico",
    icon: MdSearch,

    description: "Detección y diagnóstico detallado de fallas de hardware y software con cotización formal de refacciones.",

  },
  {
    id: "actualizacion",
    name: "Actualización",
    icon: MdAutorenew,

    description: "Instalación de unidades SSD, expansión de memoria RAM, clonación de disco y optimización de componentes.",

  }
];

const TIME_SLOTS = [
  { time: "11:00 AM", label: "11:00 AM" },
  { time: "02:00 PM", label: "02:00 PM" },
  { time: "05:00 PM", label: "05:00 PM" }
];

const isHoliday = (date: Date): boolean => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();

  if (month === 0 && day === 1) return true;
  if (month === 1 && dayOfWeek === 1 && day >= 1 && day <= 7) return true;
  if (month === 2 && dayOfWeek === 1 && day >= 15 && day <= 21) return true;
  if (month === 4 && day === 1) return true;
  if (month === 8 && day === 16) return true;
  if (month === 10 && dayOfWeek === 1 && day >= 15 && day <= 21) return true;
  if (month === 11 && day === 25) return true;
  if (month === 9 && day === 1 && (year === 2024 || year === 2030 || year === 2036)) return true;
  if (month === 10 && day === 2) return true;

  return false;
};

const isSlotTimePassed = (selectedDate: Date, slotTime: string): boolean => {
  const today = new Date();

  if (selectedDate.toDateString() !== today.toDateString()) {
    return false;
  }

  const match = slotTime.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return false;

  let [_, hoursStr, minutesStr, meridian] = match;
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (meridian.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (meridian.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }

  const slotDate = new Date(today);
  slotDate.setHours(hours, minutes, 0, 0);

  // Deshabilitar si ya pasó o si falta media hora o menos para el horario (30 minutos buffer)
  const bufferMs = 30 * 60 * 1000;
  return today.getTime() + bufferMs > slotDate.getTime();
};

const isAnySlotAvailableToday = (): boolean => {
  const today = new Date();
  if (today.getDay() === 0 || today.getDay() === 6 || isHoliday(today)) {
    return false;
  }

  return TIME_SLOTS.some(slot => !isSlotTimePassed(today, slot.time));
};

const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  let count = 0;
  let dayOffset = 0;

  while (count < 14) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + dayOffset);
    const day = nextDate.getDay();
    if (day !== 0 && day !== 6 && !isHoliday(nextDate)) {
      if (dayOffset === 0) {
        if (isAnySlotAvailableToday()) {
          dates.push(nextDate);
          count++;
        }
      } else {
        dates.push(nextDate);
        count++;
      }
    }
    dayOffset++;
  }
  return dates;
};

const formatDayName = (date: Date) => {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return days[date.getDay()];
};

const formatMonthName = (date: Date) => {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return months[date.getMonth()];
};

const formatDateFull = (date: Date) => {
  return `${formatDayName(date)} ${date.getDate()} de ${formatMonthName(date)} ${date.getFullYear()}`;
};

function ReservationDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const { requestGet, requestPost } = useService();
  const { setDataModal } = useTheContext();

  const [reservation, setReservation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados para reprogramación
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDates = useMemo(() => generateAvailableDates(), []);

  // Cargar detalles de la reserva al montar
  useEffect(() => {
    const fetchReservation = async () => {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const response = await requestGet(`/reservas/get/${id}`);
        if (response && response.status === 200 && response.data && response.data.data) {
          setReservation(response.data.data);
          // Si viene con el parámetro reschedule=true, activar modo reprogramar directamente
          if (searchParams.get("reschedule") === "true") {
            setIsRescheduling(true);
          }
        } else {
          setErrorMsg("No se pudo cargar la reservación.");
        }
      } catch (err: any) {
        console.error("Error al obtener reserva:", err);
        setErrorMsg("Reservación no encontrada o código inválido.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchReservation();
    }
  }, [id, searchParams]);

  // Consultar disponibilidad al reprogramar
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedDate) {
        setBusySlots([]);
        return;
      }
      setIsLoadingSlots(true);
      try {
        const dateString = selectedDate.toISOString().split("T")[0];
        const response = await requestGet(`/reservas/availability?date=${dateString}`);
        if (response && response.status === 200 && response.data && response.data.slots) {
          const occupied = response.data.slots
            .filter((slot: any) => !slot.available)
            .map((slot: any) => slot.time);
          setBusySlots(occupied);
        } else {
          setBusySlots([]);
        }
      } catch (error) {
        console.error("Error al consultar disponibilidad:", error);
        setBusySlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    if (isRescheduling) {
      fetchAvailability();
    }
  }, [selectedDate, isRescheduling]);

  // Enviar mensaje por WhatsApp
  const sendWhatsAppNotification = (
    refCode: string,
    dateStr: string,
    timeStr: string,
    serviceName: string,
    action: "crear" | "reprogramar" | "cancelar" = "crear"
  ) => {
    if (!reservation) return;
    const deviceStr = `${reservation.deviceType === "PC" ? "PC" : "Laptop"} (${reservation.brand} ${reservation.model})`;

    let titleText = "Me gustaría agendar una cita de mantenimiento.";
    let headerText = "*Detalles de la Reserva (Nueva Cita):*";
    let dateLabel = "• *Fecha:*";
    let timeLabel = "• *Horario:*";

    if (action === "reprogramar") {
      titleText = "Solicito reprogramar mi cita de mantenimiento.";
      headerText = "*Detalles de la Cita Reprogramada:*";
      dateLabel = "• *Nueva Fecha:*";
      timeLabel = "• *Nuevo Horario:*";
    } else if (action === "cancelar") {
      titleText = "Solicito cancelar mi cita de mantenimiento.";
      headerText = "*Detalles de la Cita a Cancelar:*";
      dateLabel = "• *Fecha programada:*";
      timeLabel = "• *Horario programado:*";
    }

    const textMessage = `¡Hola PCINBOX! ${titleText}

${headerText}
• *Referencia:* ${refCode}
• *Servicio:* ${serviceName}
• *Dispositivo:* ${deviceStr}
${action !== "cancelar" ? `• *Falla/Síntomas:* ${reservation.description}\n` : ""}${dateLabel} ${dateStr}
${timeLabel} ${timeStr}

*Datos de Contacto:*
• *Nombre:* ${reservation.contactName}
• *Correo:* ${reservation.contactEmail}
• *Teléfono:* ${reservation.contactPhone}`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/524774803834?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  // Enviar reprogramación
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedDate) {
      setErrorMsg("Por favor, selecciona un día para tu cita.");
      return;
    }
    if (!selectedTime) {
      setErrorMsg("Por favor, selecciona un horario disponible.");
      return;
    }

    setIsSubmitting(true);
    const dateFormattedStr = selectedDate.toISOString().split("T")[0];

    try {
      const response = await requestPost({
        reference: id,
        date: dateFormattedStr,
        time: selectedTime,
      }, "/reservas/reschedule");

      if (response && response.status === 200) {
        setSuccessMsg("Cita reprogramada con éxito.");
        setIsRescheduling(false);

        // Actualizar datos locales
        setReservation((prev: any) => ({
          ...prev,
          date: dateFormattedStr,
          time: selectedTime,
          status: "pending"
        }));

        const dateFormatted = formatDateFull(selectedDate);
        sendWhatsAppNotification(id, dateFormatted, selectedTime, reservation.service, "reprogramar");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || "Error al reprogramar la cita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abrir Modal de Confirmación de Cancelación
  const handleCancelBooking = () => {
    setDataModal({
      isOpen: true,
      title: "¿Cancelar reservación?",
      message: (
        <span>
          Esta acción modificará el estado de tu cita de mantenimiento con referencia{" "}
          <strong className="font-mono">{id}</strong> a &quot;cancelada&quot;. No se puede revertir.
        </span>
      ),
      type: "warning",
      onClose: () => {
        setDataModal((prev) => ({ ...prev, isOpen: false }));
      },
      onConfirm: () => {
        confirmCancellation();
      },
    });
  };

  // Confirmar cancelación
  const confirmCancellation = async () => {
    setDataModal((prev) => ({ ...prev, isOpen: false }));
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await requestPost({ reference: id }, "/reservas/cancel");
      if (response && response.status === 200) {
        setSuccessMsg("Cita cancelada correctamente.");

        // Enviar WhatsApp de cancelación antes de cambiar el estado
        const dbDate = new Date(reservation.date);
        // Ajustar desfase de zona horaria si es necesario
        dbDate.setMinutes(dbDate.getMinutes() + dbDate.getTimezoneOffset());
        const dateFormatted = formatDateFull(dbDate);
        sendWhatsAppNotification(id, dateFormatted, reservation.time, reservation.service, "cancelar");

        setReservation((prev: any) => ({
          ...prev,
          status: "cancelled"
        }));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Ocurrió un error al intentar cancelar la cita.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <MdAutorenew size={40} className="animate-spin text-[#BB3D4B]" style={{ animation: "spin 1s linear infinite" }} />
          <span className="text-sm text-zinc-500 font-semibold">Cargando comprobante de reserva...</span>
        </div>
      </div>
    );
  }

  if (errorMsg && !reservation) {
    return (
      <section className="w-full flex flex-col lg:flex-row min-h-screen bg-[#fafafa] dark:bg-zinc-950">
        <div className="hidden lg:block w-[280px] shrink-0" style={{ border: "1px solid #e4e4e7", paddingRight: "16px" }}>
          <SidebarMiCuenta />
        </div>
        <div className="w-full lg:flex-grow flex flex-col items-center justify-center p-10">
          <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl text-center">
            <MdInfoOutline size={48} className="text-[#BB3D4B] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">Comprobante no encontrado</h3>
            <p className="text-xs text-zinc-500 mb-6">{errorMsg}</p>
            <button
              onClick={() => router.push("/reservas/mantenimiento")}
              className="w-full bg-[#BB3D4B] hover:bg-[#b32b39] text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
            >
              Ir a Reservas de Mantenimiento
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Parsear fecha para mostrar
  const reservationDateObj = new Date(reservation.date);
  reservationDateObj.setMinutes(reservationDateObj.getMinutes() + reservationDateObj.getTimezoneOffset());
  const dateFormattedText = formatDateFull(reservationDateObj);

  // Configuración de visualización basada en estatus
  let ticketHeaderGradient = "from-[#BB3D4B] to-[#b32b39]";
  let ticketTitle = "¡Reserva Confirmada!";
  let ticketSubtitle = "Cita registrada correctamente en nuestro sistema";
  let statusBadgeBg = "bg-yellow-100 text-yellow-800";
  let statusBadgeLabel = "Pendiente";

  if (reservation.status === "cancelled") {
    ticketHeaderGradient = "from-zinc-500 to-zinc-600";
    ticketTitle = "Reserva Cancelada";
    ticketSubtitle = "Esta cita ha sido cancelada";
    statusBadgeBg = "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400";
    statusBadgeLabel = "Cancelada";
  } else if (reservation.status === "completed") {
    ticketHeaderGradient = "from-emerald-600 to-emerald-700";
    ticketTitle = "Servicio Completado";
    ticketSubtitle = "El mantenimiento ha concluido con éxito";
    statusBadgeBg = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
    statusBadgeLabel = "Completada";
  } else if (reservation.status === "in_process") {
    ticketHeaderGradient = "from-blue-600 to-blue-700";
    ticketTitle = "Equipo en Proceso";
    ticketSubtitle = "Nuestros técnicos están trabajando en tu equipo";
    statusBadgeBg = "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400";
    statusBadgeLabel = "En Proceso";
  }

  return (
    <section className="w-full flex flex-col lg:flex-row min-h-screen bg-[#fafafa] dark:bg-zinc-950">
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
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Encabezado */}
        <div
          style={{
            borderBottom: "1px solid #f4f4f5",
            paddingBottom: "16px",
            marginBottom: "24px"
          }}
        >
          <span className="text-[#BB3D4B] font-bold text-sm tracking-wider uppercase block" style={{ marginBottom: "4px" }}>
            Detalle de Cita
          </span>
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
            Comprobante de Mantenimiento
          </h2>
        </div>

        {/* Alertas */}
        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md text-red-700 dark:text-red-400 flex items-center mb-6 p-4 gap-2 text-xs">
            <MdInfoOutline className="flex-shrink-0" size={18} />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 rounded-md text-emerald-700 dark:text-emerald-400 flex items-center mb-6 p-4 gap-2 text-xs">
            <MdCheckCircle className="flex-shrink-0 text-emerald-500" size={18} />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Ticket */}
        <div
          className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transform animate-fadeIn transition-all"
          style={{
            maxWidth: "36rem",
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%"
          }}
        >
          {/* Cabecera del Ticket */}
          <div
            className={`bg-gradient-to-r ${ticketHeaderGradient} text-center text-white relative`}
            style={{
              padding: "32px"
            }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mb-4">
              <MdCheckCircle size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">{ticketTitle}</h2>
            <p className="text-white/80 text-sm mt-1">{ticketSubtitle}</p>

            {/* Código de Cita */}
            <div
              className="inline-block bg-white/10 backdrop-blur-md rounded-xl text-lg font-mono tracking-wider font-semibold mt-4"
              style={{
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingTop: "8px",
                paddingBottom: "8px"
              }}
            >
              {id}
            </div>

            {/* Círculos laterales del ticket */}
            <div className="absolute w-8 h-8 rounded-full bg-[#fafafa] dark:bg-zinc-950" style={{ bottom: "-16px", left: "-16px", zIndex: 20 }}></div>
            <div className="absolute w-8 h-8 rounded-full bg-[#fafafa] dark:bg-zinc-950" style={{ bottom: "-16px", right: "-16px", zIndex: 20 }}></div>
          </div>

          {/* Separación troquelada */}
          <div
            className="relative border-t-2 border-dashed border-zinc-200 dark:border-zinc-800"
            style={{
              marginLeft: "24px",
              marginRight: "24px",
              marginTop: "8px",
              marginBottom: "8px"
            }}
          ></div>

          {/* Detalles o Formulario de Reprogramación */}
          <div
            className="text-zinc-700 dark:text-zinc-300"
            style={{
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}
          >
            {isRescheduling ? (
              /* Rescheduling Form inline */
              <form onSubmit={handleRescheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Reprogramar Cita</h3>
                  <p className="text-[11px] text-zinc-400">Selecciona una nueva fecha y horario.</p>
                </div>

                {/* Calendario */}
                <div style={{ display: "flex", overflowX: "auto", gap: "8px", paddingBottom: "8px", width: "100%" }}>
                  {availableDates.map((date, idx) => {
                    const isSame = selectedDate?.toDateString() === date.toDateString();
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        className={`rounded-lg border text-center cursor-pointer min-w-[70px] transition-all flex flex-col justify-center items-center ${isSame
                          ? "border-[#BB3D4B] bg-[#BB3D4B] text-white shadow-md shadow-[#BB3D4B]/20"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                        style={{ padding: "8px" }}
                      >
                        <span style={{ fontSize: "9px", fontWeight: "bold", textTransform: "uppercase", color: isSame ? "rgba(255,255,255,0.8)" : "#9e9e9e" }}>
                          {formatDayName(date)}
                        </span>
                        <span style={{ fontSize: "16px", fontWeight: "800", display: "block", marginTop: "2px", marginBottom: "2px" }}>
                          {date.getDate()}
                        </span>
                        <span style={{ fontSize: "9px", color: isSame ? "rgba(255,255,255,0.8)" : "#9e9e9e" }}>
                          {formatMonthName(date)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Selector de horas */}
                {selectedDate && (
                  <div>
                    {isLoadingSlots ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#808080", fontSize: "12px", padding: "8px 0" }}>
                        <MdAutorenew className="animate-spin text-[#BB3D4B]" style={{ animation: "spin 1s linear infinite" }} size={16} />
                        <span>Consultando horarios...</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%" }}>
                        {TIME_SLOTS.map((slot) => {
                          const isTimePassed = isSlotTimePassed(selectedDate, slot.time);
                          const isBusy = busySlots.includes(slot.time) || isTimePassed;
                          const isSelected = selectedTime === slot.time;
                          return (
                            <button
                              type="button"
                              disabled={isBusy}
                              key={slot.time}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`rounded-full border transition-all duration-200 flex items-center justify-between ${isBusy
                                ? "bg-zinc-100 dark:bg-zinc-800/40 text-zinc-300 dark:text-zinc-700 border-zinc-200 dark:border-zinc-800 cursor-not-allowed"
                                : isSelected
                                  ? "border-[#BB3D4B] bg-[#BB3D4B]/10 dark:bg-[#BB3D4B]/15 text-[#BB3D4B]"
                                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300"
                                }`}
                              style={{
                                padding: "8px 14px",
                                cursor: isBusy ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                boxSizing: "border-box"
                              }}
                            >
                              <span>{slot.label}</span>
                              <span style={{
                                fontSize: "9px",
                                padding: "1px 5px",
                                borderRadius: "9999px",
                                backgroundColor: isBusy ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.1)",
                                color: isBusy ? "rgba(239,68,68,0.5)" : "#10b981",
                                marginLeft: "4px"
                              }}>
                                {isTimePassed ? "Pasado" : isBusy ? "Ocupado" : "Disponible"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-[#BB3D4B] hover:bg-[#b32b39] text-white text-xs font-bold py-3 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isSubmitting ? <MdAutorenew className="animate-spin" size={16} /> : <MdCheckCircle size={16} />}
                    <span>Confirmar Cambios</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRescheduling(false)}
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold py-3 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              /* Ticket Details */
              <>
                <div className="grid grid-cols-2 text-sm" style={{ gap: "16px" }}>
                  <div>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold mb-1">
                      Servicio
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">{reservation.service}</span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold mb-1">
                      Estado
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${statusBadgeBg}`}>
                      {statusBadgeLabel}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold mb-1">
                      Dispositivo
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {reservation.deviceType === "PC" ? "PC de Escritorio" : "Laptop"} ({reservation.brand} {reservation.model})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold mb-1">
                      Horario
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">{reservation.time}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold mb-1">
                      Fecha de Cita
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white">{dateFormattedText}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold mb-1">
                      Contacto
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-white block">{reservation.contactName}</span>
                    <span className="text-xs text-zinc-500 block mt-0.5">
                      {reservation.contactEmail} | {reservation.contactPhone}
                    </span>
                  </div>
                </div>

                {/* Motivo de Cancelación */}
                {reservation.status === "cancelled" && reservation.cancelReason && (
                  <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start p-4 gap-3">
                    <MdInfoOutline className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-xs flex flex-col gap-1">
                      <p className="font-semibold text-red-950 dark:text-red-200 mb-1">
                        Motivo de Cancelación:
                      </p>
                      <p className="text-red-700 dark:text-red-400 whitespace-pre-line leading-relaxed">
                        {reservation.cancelReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Caja de instrucciones */}
                {reservation.status !== "cancelled" && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-start p-4 gap-3">
                    <MdInfoOutline className="text-[#BB3D4B] flex-shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-zinc-600 dark:text-zinc-400 flex flex-col gap-1">
                      <p className="font-semibold text-zinc-950 dark:text-zinc-200 mb-1">
                        Instrucciones de Entrega:
                      </p>
                      <p>• Tu cita está agendada en el sistema. En breve te contactaremos.</p>
                      <p>• Acude a nuestra sucursal 10 minutos antes de la hora acordada.</p>
                      {reservation.deviceType === "Laptop" && <p>• Trae tu Laptop junto con su cargador oficial.</p>}
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-col gap-3 pt-2">
                  {/* Botón principal de WhatsApp para enviar confirmación */}
                  <button
                    type="button"
                    onClick={() => {
                      sendWhatsAppNotification(id, dateFormattedText, reservation.time, reservation.service, "crear");
                    }}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-sm cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 border-none"
                  >
                    <FaWhatsapp size={18} />
                    <span>Enviar confirmación por WhatsApp</span>
                  </button>

                  {reservation.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* 1. Reprogramar cita */}
                      <button
                        onClick={() => setIsRescheduling(true)}
                        className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold py-3 text-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <MdRefresh size={18} />
                        <span>Reprogramar cita</span>
                      </button>

                      {/* 2. Cancelar cita */}
                      <button
                        onClick={handleCancelBooking}
                        className="flex-1 rounded-xl border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold py-3 text-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <MdClose size={18} />
                        <span>Cancelar cita</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ReservationDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <MdAutorenew size={40} className="animate-spin text-[#BB3D4B]" style={{ animation: "spin 1s linear infinite" }} />
          <span className="text-sm text-zinc-500 font-semibold">Cargando comprobante de reserva...</span>
        </div>
      </div>
    }>
      <ReservationDetailContent />
    </Suspense>
  );
}
