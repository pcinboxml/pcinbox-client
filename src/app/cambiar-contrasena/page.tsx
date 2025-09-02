"use client";

import { Eye, EyeClosed } from "lucide-react";
import SidebarMiCuenta from "../components/sidebar-mi-cuenta/SidebarMiCuenta";
import styles from "./cambiar-contrasena.module.css";
import useCambiarContrasena from "./useCambiarContrasena";
import { MdAutorenew } from "react-icons/md";
import PasswordStrengthBar from "../components/password-strength-bar/PasswordStrengthBar";

const CambiarContrasena = () => {
  const {
    handleInputChange,
    handleShowPassword,
    onSubmit,
    dataForm,
    loadingChangePassword,
    typeStrength,
  } = useCambiarContrasena();

  return (
    <section className={styles.section}>
      <div className="w-[280px] border ">
        <SidebarMiCuenta />
      </div>

      <div className="w-[80%] border p-3">
        <div>
          <span
            className="text-[#BB3D4B] font-bold my-3 block text-center"
            style={{ fontSize: "20px" }}
          >
            Cambiar contraseña
          </span>

          <div className="containerForm">
            <form className="w-[60%] m-auto" onSubmit={onSubmit}>
              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
                <label className="text-[#808080] text-base text-end">
                  Contraseña actual:
                </label>

                <input
                  type={
                    dataForm.currentPassword.showPassword ? "text" : "password"
                  }
                  name="currentPassword"
                  onChange={handleInputChange}
                  value={dataForm.currentPassword.value}
                  className={`form-control ${styles.inputPassword} w-full px-2 py-1 border rounded`}
                />

                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => handleShowPassword("currentPassword")}
                >
                  {!dataForm.currentPassword.showPassword ? (
                    <Eye size={21} />
                  ) : (
                    <EyeClosed size={21} />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
                <label
                  htmlFor=""
                  className="text-[#808080] text-base shrink-0 text-end"
                >
                  Nueva Contraseña:
                </label>
                <input
                  type={dataForm.newPassword.showPassword ? "text" : "password"}
                  name="newPassword"
                  onChange={handleInputChange}
                  value={dataForm.newPassword.value}
                  className={`form-control ${styles.inputPassword}`}
                />

                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => handleShowPassword("newPassword")}
                >
                  {!dataForm.newPassword.showPassword ? (
                    <Eye size={21} />
                  ) : (
                    <EyeClosed size={21} />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-[180px_1fr_auto] gap-2 items-center mt-4 relative">
                <label
                  htmlFor=""
                  className="text-[#808080] text-base mx-2 shrink-0 text-end"
                >
                  Confirmar Nueva <br /> Contraseña:
                </label>
                <input
                  type={
                    dataForm.confirmPassword.showPassword ? "text" : "password"
                  }
                  name="confirmPassword"
                  onChange={handleInputChange}
                  value={dataForm.confirmPassword.value}
                  className={`form-control ${styles.inputPassword}`}
                />

                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => handleShowPassword("confirmPassword")}
                >
                  {!dataForm.confirmPassword.showPassword ? (
                    <Eye size={21} />
                  ) : (
                    <EyeClosed size={21} />
                  )}
                </button>
              </div>

              {typeStrength != "" ? (
                <div className={`${styles.containerStrength} mt-4`}>
                  <span>Seguridad de contraseña</span>
                  <PasswordStrengthBar strength={typeStrength} />
                </div>
              ) : null}

              <div className="inputButton flex justify-center items-center mt-4">
                <button
                  type="submit"
                  className="bg-[#BB3D4B] text-white font-bold text-center p-2 rounded w-[50%]"
                  disabled={loadingChangePassword}
                >
                  {loadingChangePassword ? (
                    <MdAutorenew size={20} className="m-auto the-spinner" />
                  ) : (
                    "Cambiar contraseña"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CambiarContrasena;
