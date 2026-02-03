"use client";
import styles from "./register.module.css";
import useRegister from "./useRegister";
import PasswordStrengthBar from "../components/password-strength-bar/PasswordStrengthBar";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeClosed } from "lucide-react";
import { MdAutorenew } from "react-icons/md";

const Register = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    setShowConfirmPassword,
    setShowPassword,
    showConfirmPassword,
    showPassword,
    typeStrength,
    loadingRegister,
    loadingRegisterGoogle,
    handleRegisterGoogle,
  } = useRegister();

  return (
    <section
      className={`border flex`}
      style={{
        marginBottom: "80px",
      }}
    >
      <div className="w-[50%]">
        <img
          className={styles.img}
          src="/pc_gamer.jpeg"
          alt=""
          loading="lazy"
        />
      </div>

      <div className={`w-[50%] ${styles.containerForm}`}>
        <div className={styles.theHead}>
          <span>PCinbox tu mejor opción para empezar a armar tu PC Gamer.</span>
          <br />
          <p>
            contamos con los mejores dispositivos para tu equipo, personaliza a
            tu gusto <span>¡Crea tu cuenta!</span>
          </p>
        </div>
        <form className="w-[80%]" onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Nombre(s):"
              name="name"
              value={formData.name}
              className="w-[100%] border p-1"
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group mb-3">
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              placeholder="Apellidos:"
              className="w-[100%] border p-1"
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group mb-3">
            <input
              type="number"
              name="phone"
              value={formData.phone}
              placeholder="Teléfono:"
              className="w-[100%] border p-1"
              onChange={handleInputChange}
            />
          </div>

          <div className="input-group mb-3">
            <input
              type="email"
              value={formData.email}
              className="w-[100%] border p-1"
              name="email"
              onChange={handleInputChange}
              placeholder="Ingresa tu email:"
            />
          </div>

          <div className="input-group mb-3 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              className="w-[100%] border"
              placeholder="Crea tu contraseña:"
              name="password"
              onChange={handleInputChange}
            />

            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <Eye size={21} /> : <EyeClosed size={21} />}
            </button>
          </div>

          <div className="input-group mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              className="w-[100%] border p-1"
              placeholder="Confirma tu contraseña:"
              name="confirmPassword"
              onChange={handleInputChange}
            />

            <button
              type="button"
              className={styles.eye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {!showConfirmPassword ? (
                <Eye size={21} />
              ) : (
                <EyeClosed size={21} />
              )}
            </button>
          </div>

          {typeStrength != "" ? (
            <div className={styles.containerStrength}>
              <span>Seguridad de contraseña</span>
              <PasswordStrengthBar strength={typeStrength} />
            </div>
          ) : null}

          <div
            className={`${styles.btnRegisterActions} flex flex-col items-center justify-center mt-3`}
          >
            <button type="submit" disabled={loadingRegister}>
              {loadingRegister ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : (
                "Crear cuenta"
              )}
            </button>
            <button
              type="button"
              className="border"
              onClick={handleRegisterGoogle}
              disabled={loadingRegisterGoogle}
            >
              {loadingRegisterGoogle ? (
                <MdAutorenew size={20} className="m-auto the-spinner" />
              ) : (
                <>
                  <FcGoogle size={22} />
                  Iniciar Sesión con Google
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
