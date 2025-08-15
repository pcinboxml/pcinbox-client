"use client";

import "./login.css";
import { useEffect } from "react";
import useLogin from "./useLogin";
import useService from "@/app/services/useService";
import { Eye, EyeOff, Lock, Mail, Shield, Star, Truck } from "lucide-react";
import useProtectedRoutes from "@/app/services/useProtectedRoutes";

const Login = () => {
  const {
    onSubmit,
    formData,
    setFormData,
    loadingLogin,
    showPassword,
    setShowPassword,
  } = useLogin();

  const { onRouterLink } = useService();
  const { ProtectedLoginAndRegister } = useProtectedRoutes();

  useEffect(() => {
    //Proteger ruta login
    ProtectedLoginAndRegister();

    const getEmailStorage = localStorage.getItem("email");
    if (getEmailStorage) {
      setFormData((prev) => ({ ...prev, email: getEmailStorage }));
    }
  }, []);

  return (
    <div className="w-full" style={{ background: "#f8f9fa" }}>
      <div className="container-first">
        {/* Contenido principal */}
        <div className="container-grid">
          {/* Panel izquierdo - Login */}
          <div className="bg-container">
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1>Iniciar Sesión</h1>
              <p
                style={{
                  color: "#666",
                  fontSize: "16px",
                }}
              >
                Accede a tu cuenta y disfruta de tus productos favoritos
              </p>
            </div>

            <div>
              <form onSubmit={onSubmit}>
                {/* Email */}
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <Mail className="icon-class" />
                  <input
                    type="email"
                    name="email"
                    className="input-class"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                    onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                    onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
                  />
                </div>

                {/* Contraseña */}
                <div style={{ position: "relative", marginBottom: "20px" }}>
                  <Lock className="icon-class" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    required
                    className="input-class"
                    onFocus={(e) => (e.target.style.borderColor = "#f74928")}
                    onBlur={(e) => (e.target.style.borderColor = "#e7e7e7")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="icon-class-eye"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Recordarme y olvidar contraseña */}
                <div className="container-forgot-pass">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: e.target.checked,
                        }))
                      }
                      style={{
                        accentColor: "#f74928",
                      }}
                    />
                    <span>Recordarme</span>
                  </label>

                  <a
                    role="button"
                    onClick={() => onRouterLink("/forgotpassword")}
                    style={{
                      color: "#f74928",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Botón de login */}
                <button
                  type="submit"
                  className="btnLogin"
                  disabled={loadingLogin}
                >
                  {loadingLogin ? (
                    <div className="flex w-full justify-center items-center cursor-not-allowed">
                      <span
                        className="spinner-border spinner-border-sm flex items-center justify-center"
                        aria-hidden="true"
                      ></span>
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </form>
              {/* Divisor */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    height: "1px",
                    background: "#e7e7e7",
                    flex: 1,
                  }}
                ></div>
                <span
                  style={{
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  o
                </span>
                <div
                  style={{
                    height: "1px",
                    background: "#e7e7e7",
                    flex: 1,
                  }}
                ></div>
              </div>

              {/* Link de registro */}
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#666", fontSize: "14px" }}>
                  ¿No tienes una cuenta?{" "}
                  <a
                    role="button"
                    onClick={() => onRouterLink("/register")}
                    style={{
                      color: "#f74928",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Regístrate aquí
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Panel derecho - Información y beneficios */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {/* Bienvenida */}
            <div
              style={{
                background: "linear-gradient(135deg, #f74928 0%, #ff6b47 100%)",
                borderRadius: "10px",
                padding: "40px",
                color: "white",
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                }}
              >
                ¡Bienvenido de vuelta!
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  opacity: "0.95",
                }}
              >
                Accede a miles de productos tecnológicos con las mejores ofertas
                del mercado
              </p>
            </div>

            {/* Beneficios */}
            <div
              style={{
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                padding: "30px",
                border: "1px solid #e7e7e7",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "25px",
                  textAlign: "center",
                }}
              >
                ¿Por qué elegir PCInbox?
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "#f74928",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Truck
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </div>
                  <div>
                    <h4
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        marginBottom: "5px",
                      }}
                    >
                      Envío Gratis
                    </h4>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      En pedidos mayores a $999
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "#f74928",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Shield
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </div>
                  <div>
                    <h4
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        marginBottom: "5px",
                      }}
                    >
                      Garantía Extendida
                    </h4>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      Protección total en tus compras
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "#f74928",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Star
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </div>
                  <div>
                    <h4
                      style={{
                        color: "#333",
                        fontSize: "16px",
                        marginBottom: "5px",
                      }}
                    >
                      Soporte 24/7
                    </h4>
                    <p style={{ color: "#666", fontSize: "14px" }}>
                      Atención al cliente siempre disponible
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            <div
              style={{
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                padding: "25px",
                border: "1px solid #e7e7e7",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                  textAlign: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#f74928",
                      marginBottom: "5px",
                    }}
                  >
                    50K+
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Productos
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#f74928",
                      marginBottom: "5px",
                    }}
                  >
                    100K+
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Clientes
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#f74928",
                      marginBottom: "5px",
                    }}
                  >
                    4.8★
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Valoración
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive para móviles */}
        <style>
          {`
          @media (max-width: 768px) {
            .main-content {
              grid-template-columns: 1fr !important;
            }
          }
        `}
        </style>
      </div>
    </div>
  );
};

export default Login;
