"use client";

import { MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#333",
        color: "white",
        padding: "50px 0 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Columna 1 */}
          <div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#f74928",
                marginBottom: "20px",
              }}
            >
              TechStore
            </div>
            <p
              style={{
                lineHeight: "1.6",
                color: "#ccc",
                marginBottom: "20px",
              }}
            >
              Tu tienda de confianza para productos tecnológicos. Calidad,
              garantía y los mejores precios del mercado.
            </p>
            <div style={{ display: "flex", gap: "15px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#f74928",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                📧
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#f74928",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                📱
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#f74928",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                🔗
              </div>
            </div>
          </div>

          {/* Columna 2 */}
          <div>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "white",
              }}
            >
              Categorías
            </h4>
            <ul style={{ listStyle: "none", lineHeight: "2" }}>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Laptops
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Smartphones
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Gaming
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Audio
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Monitores
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "white",
              }}
            >
              Ayuda
            </h4>
            <ul style={{ listStyle: "none", lineHeight: "2" }}>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Envíos y devoluciones
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Garantías
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "white",
              }}
            >
              Contacto
            </h4>
            <div style={{ color: "#ccc", lineHeight: "2" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <MapPin size={16} />
                <span>León, Guanajuato, México</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <Phone size={16} />
                <span>+52 477 123 4567</span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                📧
                <span>info@techstore.mx</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: "1px solid #555",
            paddingTop: "30px",
            textAlign: "center",
            color: "#999",
          }}
        >
          <p>© 2025 TechStore. Todos los derechos reservados.</p>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <a href="#" style={{ color: "#999", textDecoration: "none" }}>
              Términos de uso
            </a>
            <a href="#" style={{ color: "#999", textDecoration: "none" }}>
              Política de privacidad
            </a>
            <a href="#" style={{ color: "#999", textDecoration: "none" }}>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
