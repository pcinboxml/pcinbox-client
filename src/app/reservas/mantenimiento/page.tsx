"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useService from "@/app/services/useService";
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

// Horarios específicos (12:30 pm y 4:00 pm, 3 espacios disponibles)
const TIME_SLOTS = [
  { time: "12:30 PM", label: "12:30 PM", spots: "3 espacios disponibles" },
  { time: "04:00 PM", label: "04:00 PM", spots: "3 espacios disponibles" }
];

// Generar siguientes 14 días laborables (omitir sábados y domingos)
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  let count = 0;
  let dayOffset = 1;

  while (count < 14) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + dayOffset);
    const day = nextDate.getDay();
    if (day !== 0 && day !== 6) { // Omitir Sábado (6) y Domingo (0)
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

export default function MaintenanceBookingPage() {
  const router = useRouter();
  const { requestPost } = useService();
  
  // Estados del Formulario (Todos los campos de contacto están vacíos por defecto)
  const [selectedService, setSelectedService] = useState("");
  const [deviceType, setDeviceType] = useState(""); // "pc" | "laptop"
  const [brand, setBrand] = useState("");
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

  const availableDates = useMemo(() => generateAvailableDates(), []);

  // Simulación de franjas horarias ocupadas
  const busySlots = useMemo(() => {
    if (!selectedDate) return [];
    const seed = selectedDate.getDate();
    return TIME_SLOTS.filter((_, idx) => (seed + idx) % 3 === 0).map(s => s.time);
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
    const whatsappUrl = `https://wa.me/524775334127?text=${encodedText}`;
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
          const dateFormatted = formatDateFull(selectedDate);
          sendWhatsAppNotification(bookingRef, dateFormatted, selectedTime, serviceDetails?.name || "");
        }
      } catch (error) {
        setErrorMsg("Error al reprogramar la cita en el servidor.");
        console.error(error);
      }
      return;
    }

    // Si es una nueva reserva
    const randomRef = `PCX-${Math.floor(1000 + Math.random() * 9000)}-${deviceType === "pc" ? "PC" : "LP"}`;
    try {
      const response = await requestPost({
        reference: randomRef,
        service: serviceDetails?.name || "",
        deviceType,
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
        const dateFormatted = formatDateFull(selectedDate);
        sendWhatsAppNotification(randomRef, dateFormatted, selectedTime, serviceDetails?.name || "");
      }
    } catch (error) {
      setErrorMsg("Error al conectar con el servidor para agendar la cita.");
      console.error(error);
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

  const handleCancelBooking = async () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
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
        }
      } catch (error) {
        setErrorMsg("Error al cancelar la cita en el servidor.");
        console.error(error);
      }
    }
  };

  const selectedServiceDetails = SERVICES.find(s => s.id === selectedService);

  return (
    <div 
      className="min-h-screen bg-[#fafafa] dark:bg-zinc-950" 
      style={{
        paddingTop: "32px",
        paddingBottom: "48px",
        paddingLeft: "16px",
        paddingRight: "16px"
      }}
    >
      <div 
        className="max-w-6xl" 
        style={{
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        
        {/* Encabezado */}
        <div 
          className="text-center" 
          style={{
            marginBottom: "32px"
          }}
        >
          <span 
            className="text-[#BB3D4B] font-bold text-sm tracking-wider uppercase block" 
            style={{
              marginBottom: "6px"
            }}
          >
            Mantenimiento Especializado
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Reserva de Mantenimiento
          </h1>
          <p 
            className="text-sm text-zinc-500 max-w-lg"
            style={{
              marginTop: "8px",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            {isRescheduling ? "Reprograma tu cita seleccionando un nuevo día y horario." : "Agenda el servicio técnico para tu equipo en una sola vista. Sin procesos largos ni formularios complejos."}
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
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <MdInfoOutline className="flex-shrink-0" size={20} />
            <span className="text-sm font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div 
            className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 rounded-md text-emerald-700 dark:text-emerald-400 flex items-center"
            style={{
              marginBottom: "24px",
              padding: "16px",
              gap: "8px",
              maxWidth: "36rem",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <MdCheckCircle className="flex-shrink-0 text-emerald-500" size={20} />
            <span className="text-sm font-medium">{successMsg}</span>
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

              {/* Botones de Acción Solicitados: Confirmar (aceptar), Reprogramar, Cancelar */}
              <div 
                className="flex flex-col sm:flex-row"
                style={{
                  gap: "12px",
                  paddingTop: "8px"
                }}
              >
                {/* 1. Confirmar (aceptar) */}
                <button
                  onClick={handleConfirmAccept}
                  className="flex-1 rounded-xl bg-[#BB3D4B] hover:bg-[#b32b39] text-white font-bold transition-all text-center text-sm shadow-md cursor-pointer flex items-center justify-center"
                  style={{
                    padding: "12px 16px",
                    gap: "6px"
                  }}
                >
                  <MdCheckCircle size={18} />
                  <span>Confirmar (aceptar)</span>
                </button>

                {/* 2. Reprogramar cita */}
                <button
                  onClick={handleReschedule}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold transition-all text-sm cursor-pointer flex items-center justify-center"
                  style={{
                    padding: "12px 16px",
                    gap: "6px"
                  }}
                >
                  <MdRefresh size={18} />
                  <span>Reprogramar cita</span>
                </button>

                {/* 3. Cancelar cita */}
                <button
                  onClick={handleCancelBooking}
                  className="rounded-xl border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold transition-all text-sm cursor-pointer flex items-center justify-center"
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
                        className={`rounded-xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                          isSelected
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
                            className={`rounded-lg ${
                              isSelected ? "bg-[#BB3D4B] text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
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
                    gap: "12px"
                  }}
                >
                  <div
                    onClick={() => setDeviceType("laptop")}
                    className={`rounded-xl border cursor-pointer text-center flex items-center justify-center transition-all ${
                      deviceType === "laptop"
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
                    onClick={() => setDeviceType("pc")}
                    className={`rounded-xl border cursor-pointer text-center flex items-center justify-center transition-all ${
                      deviceType === "pc"
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
                    gap: "12px"
                  }}
                >
                  <div>
                    <label 
                      className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider"
                      style={{
                        marginBottom: "6px"
                      }}
                    >
                      Marca
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. ASUS, HP, Dell"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                      style={{
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
                      gap: "8px",
                      paddingBottom: "8px"
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
                          className={`rounded-lg border text-center cursor-pointer min-w-[70px] transition-all flex flex-col justify-center items-center ${
                            isSame
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
                  <div 
                    className="grid grid-cols-1 sm:grid-cols-2"
                    style={{
                      gap: "12px"
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
                          className={`rounded-xl border text-left flex flex-col justify-center transition-all ${
                            isBusy
                              ? "bg-zinc-100 dark:bg-zinc-800/40 text-zinc-300 dark:text-zinc-700 border-zinc-100 dark:border-zinc-800 cursor-not-allowed"
                              : isSelected
                              ? "border-[#BB3D4B] bg-red-50/20 dark:bg-[#BB3D4B]/5 ring-2 ring-[#BB3D4B]/20"
                              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                          }`}
                          style={{
                            paddingLeft: "16px",
                            paddingRight: "16px",
                            paddingTop: "12px",
                            paddingBottom: "12px",
                            cursor: isBusy ? "not-allowed" : "pointer"
                          }}
                        >
                          <span className={`text-sm font-bold ${isSelected ? "text-[#BB3D4B]" : "text-zinc-800 dark:text-zinc-200"}`}>
                            {slot.label}
                          </span>
                          <span 
                            className="text-[10px] text-zinc-400"
                            style={{
                              marginTop: "2px"
                            }}
                          >
                            {slot.spots}
                          </span>
                        </button>
                      );
                    })}
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
                    <div className="flex" style={{ gap: "8px" }}>
                      <select
                        value={phoneLada}
                        onChange={(e) => setPhoneLada(e.target.value)}
                        className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-[#BB3D4B]"
                        style={{
                          paddingLeft: "8px",
                          paddingRight: "8px",
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          width: "80px"
                        }}
                      >
                        <option value="+52">+52</option>
                        <option value="+1">+1</option>
                        <option value="+34">+34</option>
                        <option value="+54">+54</option>
                        <option value="+55">+55</option>
                        <option value="+56">+56</option>
                        <option value="+57">+57</option>
                        <option value="+58">+58</option>
                        <option value="+51">+51</option>
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
                          paddingBottom: "10px"
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
                  className="w-full flex items-center justify-center bg-[#BB3D4B] hover:bg-[#b32b39] text-white font-bold transition-all text-sm shadow-md shadow-red-500/10 cursor-pointer"
                  style={{
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    borderRadius: "12px",
                    gap: "6px"
                  }}
                >
                  <span>Confirmar Reserva</span>
                  <MdCheckCircle size={18} />
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
