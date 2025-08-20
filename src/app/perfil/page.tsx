"use client";

import { MdUpload } from "react-icons/md";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import styles from "./perfil.module.css";
import usePerfil from "./usePerfil";
import LinearProgressComponent from "../components/linearProgress/LinearProgressComponent";
import { useEffect } from "react";

const Perfil = () => {
  const { onChangeUploadPhoto, getPhotoUser, showLoader, rutaImg } =
    usePerfil();

  useEffect(() => {
    getPhotoUser();
  }, []);

  return (
    <section className={styles.section}>
      <div className="w-[20%] border">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3 flex justify-center items-center flex-col">
        <div className="tarjeta w-[80%] border flex ">
          <div className={`${styles.imgTarjeta} w-[30%] h-[100%]`}>
            <img
              className={styles.imgUser}
              src={rutaImg == "" ? "/user.jpeg" : rutaImg}
              alt=""
            />
          </div>

          <div className="bodyTarjeta p-3 w-[70%]">
            <div className="flex w-[100%] p-2">
              <span className={styles.miLabel}>Nombre:</span>
              <span className={`mx-1 block ${styles.miAnswer}`}>Fulano</span>
            </div>

            <div className="flex  w-[100%] p-2">
              <span className={styles.miLabel}>Fecha de registro:</span>
              <span className={`mx-1 block ${styles.miAnswer}`}>
                19/03/2025
              </span>
            </div>

            <div className="flex  w-[100%] p-2">
              <span className={styles.miLabel}>Correo electrónico:</span>
              <span className={`mx-1 block ${styles.miAnswer}`}>
                fulano@test.com
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-[80%] justify-center items-center my-4 cursor-pointer">
          <button className={styles.btnSubirFoto}>
            <input
              type="file"
              onChange={onChangeUploadPhoto}
              style={{
                position: "absolute",
                cursor: "pointer",
                top: "0%",
                left: "0%",
                right: "0%",
                bottom: "0%",
                opacity: "0",
                zIndex: "300",
              }}
            />
            Subir foto
            <MdUpload size={22} />
          </button>
        </div>
        {showLoader ? (
          <div className="w-[100%]">
            <LinearProgressComponent />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Perfil;
