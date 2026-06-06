"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

// Estructura de servicios de mantenimiento (Solo 3 opciones)
const SERVICES = [
  {
    id: "preventivo",
    name: "Mantenimiento preventivo",
    icon: MdBuild,
    price: "$499 MXN",
    description: "Limpieza interna profunda, soplado de polvo, lubricación de ventiladores y cambio de pasta térmica de alto rendimiento.",
    duration: "1.5 - 2 horas"
  },
  {
    id: "diagnostico",
    name: "Diagnóstico",
    icon: MdSearch,
    price: "$299 MXN",
    description: "Detección y diagnóstico detallado de fallas de hardware y software con cotización formal de refacciones.",
    duration: "1 hora"
  },
  {
    id: "actualizacion",
    name: "Actualización",
    icon: MdAutorenew,
    price: "$399 MXN",
    description: "Instalación de unidades SSD, expansión de memoria RAM, clonación de disco y optimización de componentes.",
    duration: "1 - 2 horas"
  }
];

// Horarios específicos separados por hora (1 hora de duración cada uno)
const TIME_SLOTS = [
  { time: "11:00 AM", label: "11:00 AM", spots: "1 espacio disponible" },
  { time: "02:00 PM", label: "02:00 PM", spots: "1 espacio disponible" },
  { time: "05:00 PM", label: "05:00 PM", spots: "1 espacio disponible" }
];

const POPULAR_BRANDS = [
  "HP",
  "Dell",
  "Lenovo",
  "ASUS",
  "Acer",
  "Apple",
  "MSI",
  "Gigabyte",
  "Samsung",
  "Huawei",
  "Sony",
  "Toshiba",
  "Razer",
  "Corsair",
  "Generic/Ensamblada (Custom PC)",
  "Otra (Escribir marca)"
];

// Helper para comprobar si un día es feriado oficial en México
const isHoliday = (date: Date): boolean => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Ene, 1 = Feb, etc.
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0 = Dom, 1 = Lun, ..., 6 = Sáb

  // 1 de Enero (Año Nuevo)
  if (month === 0 && day === 1) return true;

  // Primer lunes de Febrero (Día de la Constitución)
  if (month === 1 && dayOfWeek === 1 && day >= 1 && day <= 7) return true;

  // Tercer lunes de Marzo (Natalicio de Benito Juárez)
  if (month === 2 && dayOfWeek === 1 && day >= 15 && day <= 21) return true;

  // 1 de Mayo (Día del Trabajo)
  if (month === 4 && day === 1) return true;

  // 16 de Septiembre (Día de la Independencia)
  if (month === 8 && day === 16) return true;

  // Tercer lunes de Noviembre (Día de la Revolución)
  if (month === 10 && dayOfWeek === 1 && day >= 15 && day <= 21) return true;

  // 25 de Diciembre (Navidad)
  if (month === 11 && day === 25) return true;

  // Transmisión del Poder Ejecutivo Federal (1 de octubre cada 6 años)
  if (month === 9 && day === 1 && (year === 2024 || year === 2030 || year === 2036)) return true;

  // 2 de Noviembre (Día de Muertos - Inhábil común)
  if (month === 10 && day === 2) return true;

  return false;
};

// Generar siguientes 14 días laborables (omitir sábados, domingos y días feriados)
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  let count = 0;
  let dayOffset = 1;

  while (count < 14) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + dayOffset);
    const day = nextDate.getDay();
    // Omitir Sábado (6), Domingo (0) y Días Feriados
    if (day !== 0 && day !== 6 && !isHoliday(nextDate)) {
      dates.push(nextDate);
      count++;
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

function MaintenanceBookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requestPost, requestGet } = useService();
  const { setDataModal } = useTheContext();

  // Estados del Formulario (Todos los campos de contacto están vacíos por defecto)
  const [selectedService, setSelectedService] = useState("");
  const [deviceType, setDeviceType] = useState(""); // "pc" | "laptop"
  const [brand, setBrand] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Datos del Cliente
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneLada, setPhoneLada] = useState("+52"); // Lada por defecto +52
  const [contactPhone, setContactPhone] = useState("");

  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [bookingRef, setBookingRef] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para horarios ocupados dinámicos
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Proteger ruta para usuarios no autenticados
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/principal");
      }
    }
  }, [router]);

  // Manejar parámetro de reprogramación
  useEffect(() => {
    const checkReschedule = async () => {
      const rescheduleRef = searchParams.get("reschedule");
      if (rescheduleRef) {
        setIsLoadingSlots(true);
        try {
          const res = await requestGet(`/reservas/get/${rescheduleRef}`);
          if (res && res.status === 200 && res.data && res.data.data) {
            const data = res.data.data;
            const srv = SERVICES.find(s => s.name === data.service);
            if (srv) setSelectedService(srv.id);
            setDeviceType(data.deviceType === "PC" ? "pc" : "laptop");
            const isPopular = POPULAR_BRANDS.includes(data.brand) && data.brand !== "Otra (Escribir marca)";
            if (isPopular) {
              setBrand(data.brand);
              setIsCustomBrand(false);
            } else {
              setBrand(data.brand);
              setIsCustomBrand(true);
            }
            setModel(data.model);
            setDescription(data.description);
            setContactName(data.contactName);
            setContactEmail(data.contactEmail);
            const phoneParts = data.contactPhone.split(" ");
            if (phoneParts.length > 1) {
              setPhoneLada(phoneParts[0]);
              setContactPhone(phoneParts[1]);
            } else {
              setContactPhone(data.contactPhone);
            }
            setBookingRef(rescheduleRef);
            setIsRescheduling(true);
            setIsAgreed(true);
          }
        } catch (error) {
          console.error("Error fetching reservation for rescheduling:", error);
          setErrorMsg("No se pudo cargar la información de la reservación a reprogramar.");
        } finally {
          setIsLoadingSlots(false);
        }
      }
    };
    checkReschedule();
  }, [searchParams]);

  const availableDates = useMemo(() => generateAvailableDates(), []);

  // Consultar disponibilidad de horarios en tiempo real
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
          // Filtrar los slots ocupados (available = false)
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

    fetchAvailability();
  }, [selectedDate]);

  // Generar y enviar mensaje por WhatsApp
  const sendWhatsAppNotification = (refCode: string, dateStr: string, timeStr: string, serviceName: string) => {
    const deviceStr = `${deviceType === "pc" ? "PC" : "Laptop"} (${brand} ${model})`;
    const textMessage = `¡Hola PCINBOX! Me gustaría agendar una cita de mantenimiento.

*Detalles de la Reserva:*
• *Referencia:* ${refCode}
• *Servicio:* ${serviceName}
• *Dispositivo:* ${deviceStr}
• *Falla/Síntomas:* ${description}
• *Fecha:* ${dateStr}
• *Horario:* ${timeStr}

*Datos de Contacto:*
• *Nombre:* ${contactName}
• *Correo:* ${contactEmail}
• *Teléfono:* ${phoneLada} ${contactPhone}`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/524774803834?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedService) {
      setErrorMsg("Por favor, selecciona un servicio de mantenimiento.");
      return;
    }
    if (!deviceType) {
      setErrorMsg("Por favor, selecciona si tu equipo es Laptop o PC de Escritorio.");
      return;
    }
    if (!brand.trim() || !model.trim()) {
      setErrorMsg("Por favor, ingresa la marca y modelo de tu dispositivo.");
      return;
    }
    if (description.trim().length < 10) {
      setErrorMsg("Por favor, describe la falla o síntomas en al menos 10 caracteres.");
      return;
    }
    if (!selectedDate) {
      setErrorMsg("Por favor, selecciona un día para tu cita.");
      return;
    }
    if (!selectedTime) {
      setErrorMsg("Por favor, selecciona un horario disponible.");
      return;
    }
    if (!contactName.trim()) {
      setErrorMsg("Por favor, ingresa tu nombre completo.");
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes("@")) {
      setErrorMsg("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (contactPhone.trim().length < 10) {
      setErrorMsg("El teléfono celular debe tener al menos 10 dígitos.");
      return;
    }
    if (!isAgreed) {
      setErrorMsg("Debes aceptar los términos de recepción de equipos para proceder.");
      return;
    }

    const dateFormattedStr = selectedDate.toISOString().split("T")[0];
    const serviceDetails = SERVICES.find(s => s.id === selectedService);
    const fullPhoneNumber = `${phoneLada} ${contactPhone}`;

    setIsSubmitting(true);

    // Si es reprogramación de cita existente
    if (isRescheduling) {
      try {
        const response = await requestPost({
          reference: bookingRef,
          date: dateFormattedStr,
          time: selectedTime,
        }, "/reservas/reschedule");

        if (response && response.status === 200) {
          setIsSuccess(true);
          setIsRescheduling(false);
          setSuccessMsg("Cita reprogramada con éxito en el sistema.");
        }
      } catch (error) {
        setErrorMsg("Error al reprogramar la cita en el servidor.");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Si es una nueva reserva
    const randomRef = `PCX-${Math.floor(1000 + Math.random() * 9000)}-${deviceType === "pc" ? "PC" : "LP"}`;
    try {
      const response = await requestPost({
        reference: randomRef,
        service: serviceDetails?.name || "",
        deviceType: deviceType === "pc" ? "PC" : "Laptop",
        brand,
        model,
        description,
        date: dateFormattedStr,
        time: selectedTime,
        contactName,
        contactEmail,
        contactPhone: fullPhoneNumber,
      }, "/reservas/create");

      if (response && (response.status === 201 || response.status === 200)) {
        setBookingRef(randomRef);
        setIsSuccess(true);
      }
    } catch (error) {
      setErrorMsg("Error al conectar con el servidor para agendar la cita.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Acciones de Usuario en el Ticket
  const handleConfirmAccept = () => {
    setSuccessMsg("Cita confirmada y aceptada con éxito.");
    const dateFormatted = selectedDate ? formatDateFull(selectedDate) : "";
    const serviceDetails = SERVICES.find(s => s.id === selectedService);
    sendWhatsAppNotification(bookingRef, dateFormatted, selectedTime, serviceDetails?.name || "");
  };

  const handleReschedule = () => {
    setIsSuccess(false);
    setSuccessMsg("");
    setIsRescheduling(true);
    setSelectedDate(null);
    setSelectedTime("");
  };

  const handleCancelBooking = () => {
    setDataModal({
      isOpen: true,
      title: "¿Cancelar reservación?",
      message: (
        <span>
          Esta acción modificará el estado de tu cita de mantenimiento con referencia{" "}
          <strong className="font-mono">{bookingRef}</strong> a &quot;cancelada&quot;. No se puede revertir.
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

  const confirmCancellation = async () => {
    setDataModal((prev) => ({ ...prev, isOpen: false }));
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await requestPost({ reference: bookingRef }, "/reservas/cancel");
      if (response && response.status === 200) {
        setIsSuccess(false);
        setIsRescheduling(false);
        setSelectedService("");
        setDeviceType("");
        setBrand("");
        setModel("");
        setDescription("");
        setSelectedDate(null);
        setSelectedTime("");
        setIsAgreed(false);
        setErrorMsg("Cita cancelada correctamente.");
        setSuccessMsg("");

        setDataModal({
          isOpen: true,
          title: "Reservación Cancelada",
          message: `La reservación con referencia ${bookingRef} ha sido cancelada exitosamente.`,
          type: "success",
          onClose: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          },
          onConfirm: () => {
            setDataModal((prev) => ({ ...prev, isOpen: false }));
          }
        });
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

  const selectedServiceDetails = SERVICES.find(s => s.id === selectedService);

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
          <span
            className="text-[#BB3D4B] font-bold text-sm tracking-wider uppercase block"
            style={{
              marginBottom: "4px"
            }}
          >
            Mantenimiento Especializado
          </span>
          <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
            {isRescheduling ? "Reprogramar Reserva" : "Reserva de Mantenimiento"}
          </h2>
          <p
            className="text-xs text-zinc-400"
            style={{
              marginTop: "4px"
            }}
          >
            {isRescheduling ? "Reprograma tu cita seleccionando un nuevo día y horario." : "Agenda el servicio técnico para tu equipo en pocos pasos."}
          </p>
        </div>

        {/* Cajas de Alertas */}
        {errorMsg && (
          <div
            className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md text-red-700 dark:text-red-400 flex items-center"
            style={{
              marginBottom: "24px",
              padding: "16px",
              gap: "8px",
              fontSize: "12px"
            }}
          >
            <MdInfoOutline className="flex-shrink-0" size={18} />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 rounded-md text-emerald-700 dark:text-emerald-400 flex items-center"
            style={{
              marginBottom: "24px",
              padding: "16px",
              gap: "8px",
              fontSize: "12px"
            }}
          >
            <MdCheckCircle className="flex-shrink-0 text-emerald-500" size={18} />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Vista del Ticket de Éxito */}
        {isSuccess ? (
          <div
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transform animate-fadeIn transition-all"
            style={{
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >

            {/* Cabecera del Ticket */}
            <div
              className="bg-gradient-to-r from-[#BB3D4B] to-[#b32b39] text-center text-white relative"
              style={{
                padding: "32px"
              }}
            >
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md"
                style={{
                  marginBottom: "16px"
                }}
              >
                <MdCheckCircle size={36} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">¡Reserva Confirmada!</h2>
              <p
                className="text-white/80 text-sm"
                style={{
                  marginTop: "4px"
                }}
              >
                Cita registrada correctamente en nuestro sistema
              </p>

              {/* Código de Cita */}
              <div
                className="inline-block bg-white/10 backdrop-blur-md rounded-xl text-lg font-mono tracking-wider font-semibold"
                style={{
                  marginTop: "16px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "8px",
                  paddingBottom: "8px"
                }}
              >
                {bookingRef}
              </div>

              {/* Círculos laterales del ticket */}
              <div
                className="absolute w-8 h-8 rounded-full bg-[#fafafa] dark:bg-zinc-950"
                style={{
                  bottom: "-16px",
                  left: "-16px",
                  zIndex: 20
                }}
              ></div>
              <div
                className="absolute w-8 h-8 rounded-full bg-[#fafafa] dark:bg-zinc-950"
                style={{
                  bottom: "-16px",
                  right: "-16px",
                  zIndex: 20
                }}
              ></div>
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

            {/* Detalles del Ticket */}
            <div
              className="text-zinc-700 dark:text-zinc-300"
              style={{
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}
            >
              <div
                className="grid grid-cols-2 text-sm"
                style={{
                  gap: "16px"
                }}
              >
                <div>
                  <span
                    className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold"
                    style={{
                      marginBottom: "2px"
                    }}
                  >
                    Servicio
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{selectedServiceDetails?.name}</span>
                </div>
                <div>
                  <span
                    className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold"
                    style={{
                      marginBottom: "2px"
                    }}
                  >
                    Costo Aprox.
                  </span>
                  <span className="font-bold text-[#A67845]">{selectedServiceDetails?.price}</span>
                </div>
                <div>
                  <span
                    className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold"
                    style={{
                      marginBottom: "2px"
                    }}
                  >
                    Dispositivo
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {deviceType === "pc" ? "PC de Escritorio" : "Laptop"} ({brand} {model})
                  </span>
                </div>
                <div>
                  <span
                    className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold"
                    style={{
                      marginBottom: "2px"
                    }}
                  >
                    Horario
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{selectedTime}</span>
                </div>
                <div className="col-span-2">
                  <span
                    className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold"
                    style={{
                      marginBottom: "2px"
                    }}
                  >
                    Fecha de Cita
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{selectedDate && formatDateFull(selectedDate)}</span>
                </div>
                <div className="col-span-2">
                  <span
                    className="text-xs text-zinc-400 dark:text-zinc-500 uppercase block font-semibold"
                    style={{
                      marginBottom: "2px"
                    }}
                  >
                    Contacto
                  </span>
                  <span className="font-semibold text-zinc-900 dark:text-white block">{contactName}</span>
                  <span
                    className="text-xs text-zinc-500"
                    style={{
                      display: "block",
                      marginTop: "2px"
                    }}
                  >
                    {contactEmail} | {phoneLada} {contactPhone}
                  </span>
                </div>
              </div>

              {/* Caja de instrucciones */}
              <div
                className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-start"
                style={{
                  padding: "16px",
                  gap: "12px"
                }}
              >
                <MdInfoOutline className="text-[#BB3D4B] flex-shrink-0" style={{ marginTop: "2px" }} size={18} />
                <div
                  className="text-xs text-zinc-600 dark:text-zinc-400"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  <p className="font-semibold text-zinc-950 dark:text-zinc-200" style={{ marginBottom: "4px" }}>
                    Instrucciones de Entrega:
                  </p>
                  <p>• Tu reserva ha sido registrada y enviada por WhatsApp. En breve te contactaremos.</p>
                  <p>• Acude a nuestra sucursal 10 minutos antes de la hora acordada.</p>
                  {deviceType === "laptop" && <p>• Trae tu Laptop junto con su cargador oficial.</p>}
                </div>
              </div>

              {/* Botones de Acción Solicitados: Reprogramar, Cancelar, Notificar WhatsApp */}
              <div
                className="flex flex-col gap-3"
                style={{
                  paddingTop: "8px"
                }}
              >
                {/* Botón principal de WhatsApp para enviar confirmación */}
                <button
                  type="button"
                  onClick={() => {
                    const dateFormatted = selectedDate ? formatDateFull(selectedDate) : "";
                    const serviceName = selectedServiceDetails?.name || "";
                    sendWhatsAppNotification(bookingRef, dateFormatted, selectedTime, serviceName);
                  }}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-sm cursor-pointer flex items-center justify-center"
                  style={{
                    padding: "12px 16px",
                    gap: "8px",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
                    border: "none"
                  }}
                >
                  <FaWhatsapp size={18} />
                  <span>Enviar confirmación por WhatsApp</span>
                </button>

                <div
                  className="flex flex-col sm:flex-row"
                  style={{
                    gap: "12px"
                  }}
                >
                  {/* 1. Reprogramar cita */}
                  <button
                    onClick={handleReschedule}
                    className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold transition-all text-sm cursor-pointer flex items-center justify-center"
                    style={{
                      padding: "12px 16px",
                      gap: "6px"
                    }}
                  >
                    <MdRefresh size={18} />
                    <span>Reprogramar cita</span>
                  </button>

                  {/* 2. Cancelar cita */}
                  <button
                    onClick={handleCancelBooking}
                    className="flex-1 rounded-xl border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold transition-all text-sm cursor-pointer flex items-center justify-center"
                    style={{
                      padding: "12px 16px",
                      gap: "6px"
                    }}
                  >
                    <MdClose size={18} />
                    <span>Cancelar cita</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Formulario en Una Sola Vista */
          <form
            onSubmit={handleBookingSubmit}
            autoComplete="off"
            className="grid grid-cols-1 lg:grid-cols-3"
            style={{
              gap: "32px"
            }}
          >
            {/* Columna Izquierda (Servicio, Equipo, Horario) */}
            <div
              className="lg:col-span-2"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px"
              }}
            >

              {/* Sección 1: Selección de Servicio */}
              <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800/80"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">1. Selecciona el Servicio</h3>
                  <p className="text-xs text-zinc-400">Elige el tipo de mantenimiento que requiere tu equipo.</p>
                </div>
                <div
                  className="grid grid-cols-1 sm:grid-cols-3"
                  style={{
                    gap: "12px"
                  }}
                >
                  {SERVICES.map((srv) => {
                    const Icon = srv.icon;
                    const isSelected = selectedService === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv.id)}
                        className={`rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${isSelected
                          ? "border-[#BB3D4B] bg-red-50/20 dark:bg-[#BB3D4B]/5"
                          : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50"
                          }`}
                        style={{
                          padding: "16px",
                          gap: "8px"
                        }}
                      >
                        <div className="flex items-center" style={{ gap: "8px" }}>
                          <div
                            className={`rounded-lg ${isSelected ? "bg-[#BB3D4B] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                              }`}
                            style={{
                              padding: "6px"
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <span className="font-bold text-xs text-zinc-900 dark:text-white">{srv.name}</span>
                        </div>

                        <div>
                          <p className="text-[10px] text-zinc-400 leading-tight" style={{ marginTop: "4px", marginBottom: "8px" }}>
                            {srv.description}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80" style={{ paddingTop: "6px" }}>
                            <span className="font-extrabold text-[#A67845]">{srv.price}</span>
                            <span>{srv.duration}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sección 2: Especificaciones del Dispositivo */}
              <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800/80"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">2. Detalles del Equipo</h3>
                  <p className="text-xs text-zinc-400">Cuéntanos qué equipo traerás.</p>
                </div>

                {/* Tipo de Equipo (PC o Laptop) */}
                <div
                  className="grid grid-cols-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    width: "100%"
                  }}
                >
                  <div
                    onClick={() => {
                      setDeviceType("laptop");
                      if (brand === "Generic/Ensamblada (Custom PC)") {
                        setBrand("");
                      }
                    }}
                    className={`rounded-xl border cursor-pointer text-center flex items-center justify-center transition-all ${deviceType === "laptop"
                      ? "border-[#BB3D4B] bg-red-50/20 dark:bg-[#BB3D4B]/5 font-bold"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50"
                      }`}
                    style={{
                      padding: "12px",
                      gap: "8px"
                    }}
                  >
                    <MdLaptop size={20} className={deviceType === "laptop" ? "text-[#BB3D4B]" : "text-zinc-400"} />
                    <span className="text-xs text-zinc-900 dark:text-white">Laptop</span>
                  </div>

                  <div
                    onClick={() => {
                      setDeviceType("pc");
                      if (!brand) {
                        setBrand("Generic/Ensamblada (Custom PC)");
                        setIsCustomBrand(false);
                      }
                    }}
                    className={`rounded-xl border cursor-pointer text-center flex items-center justify-center transition-all ${deviceType === "pc"
                      ? "border-[#BB3D4B] bg-red-50/20 dark:bg-[#BB3D4B]/5 font-bold"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50"
                      }`}
                    style={{
                      padding: "12px",
                      gap: "8px"
                    }}
                  >
                    <MdComputer size={20} className={deviceType === "pc" ? "text-[#BB3D4B]" : "text-zinc-400"} />
                    <span className="text-xs text-zinc-900 dark:text-white">PC Escritorio</span>
                  </div>
                </div>

                {/* Marca y Modelo */}
                <div
                  className="grid grid-cols-2"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    width: "100%"
                  }}
                >
                  <div className="relative">
                    <label
                      className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                      style={{
                        marginBottom: "6px"
                      }}
                    >
                      Marca
                    </label>

                    {!isCustomBrand ? (
                      <div>
                        {/* Selector principal */}
                        <div
                          onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs cursor-pointer flex justify-between items-center select-none"
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            paddingTop: "10px",
                            paddingBottom: "10px"
                          }}
                        >
                          <span>{brand || "Selecciona una marca"}</span>
                          <span className="text-zinc-400 text-[9px]">{isBrandDropdownOpen ? "▲" : "▼"}</span>
                        </div>

                        {/* Dropdown del selector */}
                        {isBrandDropdownOpen && (
                          <div
                            className="absolute left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-y-auto flex flex-col gap-1 p-2 animate-fadeIn"
                            style={{
                              top: "100%",
                              marginTop: "4px",
                              maxHeight: "220px",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                            }}
                          >
                            {/* Input de búsqueda interno */}
                            <input
                              type="text"
                              placeholder="Buscar marca..."
                              value={brandSearch}
                              onChange={(e) => setBrandSearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                paddingTop: "6px",
                                paddingBottom: "6px",
                                marginBottom: "4px"
                              }}
                            />

                            {/* Opciones filtradas */}
                            {POPULAR_BRANDS.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map((b) => (
                              <div
                                key={b}
                                onClick={() => {
                                  if (b === "Otra (Escribir marca)") {
                                    setIsCustomBrand(true);
                                    setBrand("");
                                  } else {
                                    setBrand(b);
                                  }
                                  setIsBrandDropdownOpen(false);
                                  setBrandSearch("");
                                }}
                                className="px-3 py-2 rounded-lg text-xs hover:bg-[#BB3D4B]/10 hover:text-[#BB3D4B] dark:hover:bg-[#BB3D4B]/20 text-zinc-800 dark:text-zinc-200 cursor-pointer transition-all select-none"
                              >
                                {b}
                              </div>
                            ))}

                            {/* Si la búsqueda no arroja coincidencias */}
                            {POPULAR_BRANDS.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).length === 0 && (
                              <div
                                onClick={() => {
                                  setIsCustomBrand(true);
                                  setBrand(brandSearch);
                                  setIsBrandDropdownOpen(false);
                                  setBrandSearch("");
                                }}
                                className="px-3 py-2 rounded-lg text-xs text-zinc-400 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/40 italic select-none"
                              >
                                &quot;{brandSearch}&quot; no encontrada. Presiona aquí para escribir manualmente...
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {/* Input libre */}
                        <input
                          type="text"
                          placeholder="Ej. Alienware, Compaq"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="flex-grow rounded-lg border border-[#BB3D4B] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none"
                          style={{
                            boxSizing: "border-box",
                            paddingLeft: "12px",
                            paddingRight: "12px",
                            paddingTop: "10px",
                            paddingBottom: "10px",
                            minWidth: 0
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomBrand(false);
                            setBrand("");
                          }}
                          className="px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold cursor-pointer transition-all shrink-0"
                        >
                          Lista
                        </button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                      style={{
                        marginBottom: "6px"
                      }}
                    >
                      Modelo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. ROG Strix, Pavilion"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                    />
                  </div>
                </div>

                {/* Descripción de Falla */}
                <div>
                  <label
                    className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                    style={{
                      marginBottom: "6px"
                    }}
                  >
                    Descripción de la falla (min. 10 caract.)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej. El ventilador hace ruido y el equipo se calienta demasiado al jugar."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B] resize-none"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      paddingLeft: "12px",
                      paddingRight: "12px",
                      paddingTop: "10px",
                      paddingBottom: "10px"
                    }}
                  ></textarea>
                </div>
              </div>

              {/* Sección 3: Agenda (Lunes a Viernes) */}
              <div
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/80 dark:border-zinc-800/80"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px"
                }}
              >
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">3. Selecciona Fecha y Hora</h3>
                  <p className="text-xs text-zinc-400">Atención de Lunes a Viernes. Elige tu horario.</p>
                </div>

                {/* Carrusel de Fechas */}
                <div>
                  <div
                    className="flex overflow-x-auto"
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      gap: "8px",
                      paddingBottom: "8px",
                      width: "100%"
                    }}
                  >
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
                          style={{
                            padding: "8px"
                          }}
                        >
                          <span
                            style={{
                              fontSize: "9px",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              color: isSame ? "rgba(255,255,255,0.8)" : "#9e9e9e"
                            }}
                          >
                            {formatDayName(date)}
                          </span>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "800",
                              display: "block",
                              marginTop: "2px",
                              marginBottom: "2px"
                            }}
                          >
                            {date.getDate()}
                          </span>
                          <span
                            style={{
                              fontSize: "9px",
                              color: isSame ? "rgba(255,255,255,0.8)" : "#9e9e9e"
                            }}
                          >
                            {formatMonthName(date)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Horarios Disponibles */}
                {selectedDate && (
                  <div>
                    {isLoadingSlots ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#808080",
                          fontSize: "12px",
                          paddingTop: "8px",
                          paddingBottom: "8px"
                        }}
                      >
                        <MdAutorenew
                          className="animate-spin text-[#BB3D4B]"
                          style={{ animation: "spin 1s linear infinite" }}
                          size={16}
                        />
                        <span>Consultando disponibilidad en tiempo real...</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "12px",
                          width: "100%",
                          marginTop: "4px"
                        }}
                      >
                        {TIME_SLOTS.map((slot) => {
                          const isBusy = busySlots.includes(slot.time);
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
                                  ? "border-[#BB3D4B] bg-[#BB3D4B]/10 dark:bg-[#BB3D4B]/15 text-[#BB3D4B] shadow-sm shadow-[#BB3D4B]/10"
                                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                }`}
                              style={{
                                paddingLeft: "16px",
                                paddingRight: "16px",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                cursor: isBusy ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                outline: "none",
                                boxSizing: "border-box"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <MdAccessTime size={16} className={isBusy ? "text-zinc-300 dark:text-zinc-700" : isSelected ? "text-[#BB3D4B]" : "text-zinc-400"} />
                                <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                                  {slot.label}
                                </span>
                              </div>

                              {/* Mini badge para espacios disponibles */}
                              {!isBusy && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    paddingLeft: "6px",
                                    paddingRight: "6px",
                                    paddingTop: "2px",
                                    paddingBottom: "2px",
                                    borderRadius: "9999px",
                                    fontWeight: "600",
                                    backgroundColor: isSelected ? "rgba(187, 61, 75, 0.15)" : "rgba(16, 185, 129, 0.1)",
                                    color: isSelected ? "#BB3D4B" : "#10b981",
                                    marginLeft: "4px"
                                  }}
                                >
                                  Disponible
                                </span>
                              )}
                              {isBusy && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    paddingLeft: "6px",
                                    paddingRight: "6px",
                                    paddingTop: "2px",
                                    paddingBottom: "2px",
                                    borderRadius: "9999px",
                                    fontWeight: "600",
                                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                                    color: "rgba(239, 68, 68, 0.5)",
                                    marginLeft: "4px"
                                  }}
                                >
                                  Ocupado
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha Sticky (Resumen de cita, Datos de Contacto y Botón de Enviar) */}
            <div className="lg:col-span-1">
              <div
                className="lg:sticky bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200/85 dark:border-zinc-800/85"
                style={{
                  top: "24px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px"
                }}
              >
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">4. Confirmación y Contacto</h3>
                  <p className="text-xs text-zinc-400">Ingresa tus datos y confirma tu reservación.</p>
                </div>

                {/* Resumen del servicio */}
                <div
                  className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl"
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Resumen del servicio</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Mantenimiento:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {selectedServiceDetails?.name || "No seleccionado"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Precio estimado:</span>
                    <span className="font-bold text-[#A67845]">
                      {selectedServiceDetails?.price || "$0 MXN"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Dispositivo:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {deviceType ? (deviceType === "pc" ? "PC" : "Laptop") : "No elegido"} {brand && `(${brand})`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Fecha y Hora:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {selectedDate ? `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}` : ""} {selectedTime ? `@ ${selectedTime}` : "No programada"}
                    </span>
                  </div>
                </div>

                {/* Campos de Contacto */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label
                      className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                      style={{
                        marginBottom: "4px"
                      }}
                    >
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Ej. Juan Pérez"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                      style={{
                        marginBottom: "4px"
                      }}
                    >
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      autoComplete="off"
                      placeholder="tucorreo@ejemplo.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        paddingTop: "10px",
                        paddingBottom: "10px"
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                      style={{
                        marginBottom: "4px"
                      }}
                    >
                      Teléfono Celular
                    </label>
                    <div className="flex" style={{ display: "flex", gap: "8px", width: "100%" }}>
                      <select
                        value={phoneLada}
                        onChange={(e) => setPhoneLada(e.target.value)}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                        style={{
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          width: "95px",
                          flexShrink: 0,
                          boxSizing: "border-box"
                        }}
                      >
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="+55">🇧🇷 +55</option>
                        <option value="+56">🇨🇱 +56</option>
                        <option value="+57">🇨🇴 +57</option>
                        <option value="+58">🇻🇪 +58</option>
                        <option value="+51">🇵🇪 +51</option>
                      </select>
                      <input
                        type="tel"
                        autoComplete="off"
                        maxLength={10}
                        placeholder="10 dígitos celulares"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ""))}
                        className="flex-grow rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                        style={{
                          paddingLeft: "12px",
                          paddingRight: "12px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          flexGrow: 1,
                          minWidth: 0,
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Checkbox de términos */}
                <div>
                  <label className="flex items-start cursor-pointer" style={{ gap: "8px" }}>
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="rounded text-[#BB3D4B] focus:ring-[#BB3D4B] border-zinc-300 dark:border-zinc-700"
                      style={{ marginTop: "3px" }}
                    />
                    <span className="text-[10px] text-zinc-400 leading-tight">
                      Acepto los términos de recepción de equipos y autorizo el diagnóstico técnico previo del dispositivo.
                    </span>
                  </label>
                </div>

                {/* Botón de Confirmación final */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center bg-[#BB3D4B] hover:bg-[#b32b39] text-white font-bold transition-all text-sm shadow-md shadow-red-500/10 cursor-pointer ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  style={{
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "12px",
                    gap: "6px"
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <MdAutorenew size={18} className="animate-spin" />
                      <span>Agendando...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar Reserva</span>
                      <MdCheckCircle size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default function MaintenanceBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <MdAutorenew size={40} className="animate-spin text-[#BB3D4B]" style={{ animation: "spin 1s linear infinite" }} />
          <span className="text-sm text-zinc-500 font-medium font-semibold">Cargando módulo de reservas...</span>
        </div>
      </div>
    }>
      <MaintenanceBookingPageContent />
    </Suspense>
  );
}
