"use client";

import styles from "./brnAndroide.module.css";

const WHATSAPP_URL = "https://wa.me/message/W345O6QEZDJEP1?src=qr";

const BtnAndroide = () => {
  return (
    <div className={`${styles.wrapper} fab-dock-item`}>
      <span className={styles.tooltip} aria-hidden="true">
        <span className={styles.tooltipText}>
          ¿Tienes
          <br />
          alguna duda?
        </span>
        <span className={styles.tooltipArrow} />
      </span>

      <button
        type="button"
        aria-label="¿Tienes alguna duda? Abrir WhatsApp"
        onClick={() =>
          window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")
        }
        className={styles.btnAndroide}
      >
        <span className={styles.imageClip}>
          <img
            src="/androide.gif"
            alt=""
            className={styles.image}
            loading="lazy"
            draggable={false}
          />
        </span>
      </button>
    </div>
  );
};

export default BtnAndroide;
