"use client";

import { FaWhatsapp } from "react-icons/fa";
import styles from "./btnFloat.module.css";
import useService from "@/app/services/useService";

const BtnFloat = () => {
  const { onRouterHref } = useService();
  return (
    <button
      onClick={() => {
        onRouterHref("https://wa.me/message/W345O6QEZDJEP1?src=qr", true);
      }}
      //   href="https://wa.me/message/W345O6QEZDJEP1?src=qr"
      //   target="_blank"
      //   rel="noopener noreferrer"
      className={styles.fab}
    >
      <span className={styles.wave}></span>
      <span className={styles.wave}></span>
      <span className={styles.wave}></span>
      <span className={styles.wave}></span>

      <FaWhatsapp className="fab-icon" size={30} />
    </button>
  );
};
export default BtnFloat;
