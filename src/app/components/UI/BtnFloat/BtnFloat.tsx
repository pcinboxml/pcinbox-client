"use client";

import { FaWhatsapp } from "react-icons/fa";
import styles from "./btnFloat.module.css";
import useService from "@/app/services/useService";

const BtnFloat = () => {
  const { onRouterHref } = useService();

  return (
    <button
      type="button"
      aria-label="Contactar por WhatsApp"
      onClick={() => {
        onRouterHref("https://wa.me/message/W345O6QEZDJEP1?src=qr", true);
      }}
      className={`${styles.fab} fab-dock-item`}
    >
      <span className={styles.wave} aria-hidden />
      <span className={styles.wave} aria-hidden />
      <span className={styles.wave} aria-hidden />
      <span className={styles.wave} aria-hidden />
      <FaWhatsapp className={styles.icon} aria-hidden />
    </button>
  );
};

export default BtnFloat;
