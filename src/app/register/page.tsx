"use client";
import "./register.css";
import { Eye, EyeOff, User, Mail, Lock, Phone, Shield } from "lucide-react";
import useService from "../services/useService";
import useRegister from "./useRegister";
import useProtectedRoutes from "@/app/services/useProtectedRoutes";
import { useEffect } from "react";

const Register = () => {
  const { onRouterLink } = useService();

  const {
    acceptTerms,
    formData,
    handleInputChange,
    handleSubmit,
    setAcceptTerms,
    setShowConfirmPassword,
    setShowPassword,
    showConfirmPassword,
    showPassword,
    loadingRegister,
  } = useRegister();

  const { ProtectedLoginAndRegister } = useProtectedRoutes();

  useEffect(() => {
    //Proteger ruta register
    ProtectedLoginAndRegister();
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Contenido principal */}
      <div
        className="m-auto"
        style={{ width: "75%", paddingTop: "40px", paddingBottom: "40px" }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "40px",
            border: "1px solid #e7e7e7",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              Crear Cuenta
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "16px",
              }}
            >
              Únete a nuestra comunidad y disfruta de ofertas exclusivas
            </p>
          </div>

          <div>
            {/* Nombres */}
            <div
              className="container-names"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "20px",
              }}
            >
              <div style={{ position: "relative" }}>
                <User
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                    width: "18px",
                    height: "18px",
                  }}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#333",
                    border: "1px solid #e7e7e7",
                    height: "50px",
                    paddingLeft: "45px",
                    paddingRight: "15px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                  onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
                />
              </div>

              <div style={{ position: "relative" }}>
                <User
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                    width: "18px",
                    height: "18px",
                  }}
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Apellido"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#333",
                    border: "1px solid #e7e7e7",
                    height: "50px",
                    paddingLeft: "45px",
                    paddingRight: "15px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                  onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <Mail
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                  width: "18px",
                  height: "18px",
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  background: "#fff",
                  color: "#333",
                  border: "1px solid #e7e7e7",
                  height: "50px",
                  paddingLeft: "45px",
                  paddingRight: "15px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
              />
            </div>

            {/* Teléfono y Fecha de nacimiento */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <div style={{ position: "relative" }}>
                <Phone
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#999",
                    width: "18px",
                    height: "18px",
                  }}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#333",
                    border: "1px solid #e7e7e7",
                    height: "50px",
                    paddingLeft: "45px",
                    paddingRight: "15px",
                    borderRadius: "5px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                  onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <Lock
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                  width: "18px",
                  height: "18px",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  background: "#fff",
                  color: "#333",
                  border: "1px solid #e7e7e7",
                  height: "50px",
                  paddingLeft: "45px",
                  paddingRight: "45px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirmar contraseña */}
            <div style={{ position: "relative", marginBottom: "30px" }}>
              <Shield
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999",
                  width: "18px",
                  height: "18px",
                }}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  background: "#fff",
                  color: "#333",
                  border: "1px solid #e7e7e7",
                  height: "50px",
                  paddingLeft: "45px",
                  paddingRight: "45px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Términos y condiciones */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#666",
                  lineHeight: "1.5",
                }}
              >
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                  style={{
                    marginTop: "2px",
                    accentColor: "#f74928",
                  }}
                />
                <span>
                  Acepto los{" "}
                  <a
                    href="#"
                    style={{ color: "#f74928", textDecoration: "none" }}
                  >
                    términos y condiciones
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    style={{ color: "#f74928", textDecoration: "none" }}
                  >
                    política de privacidad
                  </a>
                </span>
              </label>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={!acceptTerms || loadingRegister}
              onClick={handleSubmit}
              style={{
                width: "100%",
                height: "50px",
                background: acceptTerms ? "#f74928" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: acceptTerms ? "pointer" : "not-allowed",
                transition: "all 300ms ease-in-out",
                marginBottom: "20px",
              }}
            >
              {loadingRegister ? (
                <div className="flex w-full justify-center items-center cursor-not-allowed">
                  <span
                    className="spinner-border spinner-border-sm flex items-center justify-center"
                    aria-hidden="true"
                  ></span>
                </div>
              ) : (
                "Crear cuenta"
              )}
            </button>

            {/* Link de inicio de sesión */}
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "14px" }}>
                ¿Ya tienes una cuenta?{" "}
                <a
                  role="button"
                  onClick={() => onRouterLink("/")}
                  style={{
                    color: "#f74928",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Iniciar Sesión
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Beneficios de registrarse */}
        <div
          style={{
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            padding: "30px",
            marginTop: "20px",
            border: "1px solid #e7e7e7",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Beneficios de ser miembro
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "#f74928",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 15px",
                }}
              >
                <Shield
                  style={{ color: "white", width: "24px", height: "24px" }}
                />
              </div>
              <h4
                style={{
                  color: "#333",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
              >
                Compras Seguras
              </h4>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
                Protección en todas tus compras con garantía extendida
              </p>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "#f74928",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 15px",
                }}
              >
                <Mail
                  style={{ color: "white", width: "24px", height: "24px" }}
                />
              </div>
              <h4
                style={{
                  color: "#333",
                  fontSize: "16px",
                  marginBottom: "10px",
                }}
              >
                Ofertas Exclusivas
              </h4>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
                Acceso anticipado a promociones y descuentos especiales
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
