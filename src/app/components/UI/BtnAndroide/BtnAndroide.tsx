"use client";

import styles from "./brnAndroide.module.css";
import Image from "next/image";

const BtnAndroide = () => {
  const whatsappUrl = "https://wa.me/message/W345O6QEZDJEP1?src=qr";

  return (
    <button
      onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
      className={`
        fixed bottom-6
        cursor-pointer
        rounded-full
        p-0 
        border-0 outline-none
        bg-transparent
        group
        ${styles.btnAndroide}
      `}
      style={{
        left: "4px",
      }}
    >
      {/* Tooltip - siempre visible, arriba del botón */}
      <span
        className="
    absolute bottom-full left-1/2 -translate-x-1/2 mb-3
    bg-gray-900 text-white text-sm font-medium
    px-1 py-2 rounded-xl
    whitespace-nowrap
    shadow-lg
    pointer-events-none
    text-center
    z-50
  "
        style={{
          padding: "5px",
        }}
      >
        ¿Tienes <br /> alguna duda?
        {/* Flecha apuntando hacia abajo */}
        <span
          className="
      absolute top-full left-1/2 -translate-x-1/2
      border-4 border-transparent border-t-gray-900
    "
        />
      </span>

      {/* Anillo animado exterior */}
      <span
        className="
          absolute inset-0 rounded-full
          border-2 border-white/30
          scale-100 group-hover:scale-110
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          pointer-events-none
        "
      />

      {/* Halo de brillo */}
      <span
        className="
          absolute inset-0 rounded-full
          bg-gradient-to-tr from-white/20 to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          pointer-events-none
          z-10
        "
      />

      <Image
        src="/androide.gif"
        width={100}
        height={100}
        alt="Androide"
        className="
          object-fill rounded-full
          w-full h-full
          block
        "
      />
    </button>
  );
};

export default BtnAndroide;
