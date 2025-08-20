"use client";

import useService from "../services/useService";
import SidebarMiCuenta from "./../components/sidebar-mi-cuenta/SidebarMiCuenta";
import styles from "./mi-cuenta.module.css";

const MiCuenta = () => {
  const { onRouterLink } = useService();

  return (
    <section className={styles.section}>
      <div className="w-[20%] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <div className="containerCard w-[45%]">
          <div className={`${styles.headerCard} border flex justify-center`}>
            ¡Completa tu perfil!
          </div>

          <div className="bodyCard w-[100%] border flex flex-col items-center mt-2 p-2">
            <div className={styles.containerImg}>
              <div className={styles.opaco}>
                <button
                  className={styles.btnChangeFoto}
                  onClick={() => onRouterLink("/perfil")}
                >
                  Cambiar foto
                </button>
              </div>
              <img
                src="/user.jpeg"
                className="w-[100%] h-[150px] object-contain"
              />
            </div>
            <br />
            <br />
            <p className={styles.description}>Completa tu información</p>

            <button className={styles.btnPerfil}>Mi perfil</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiCuenta;
