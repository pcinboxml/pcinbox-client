"use client";

import { Rating } from "@mui/material";
import "./footer.css";

const Footer = () => {
  return (
    <section className="footer-section">
      <div className="footer-wrapper">
        {/* Fila superior: Horarios/Contacto + Mapa */}
        <div className="footer-top-row">
          <div className="footer-card">
            <span className="footer-card-title">Horarios de atención</span>
            <p>Lunes a Viernes | 10am – 7pm</p>
            <p>Sábado | 10am – 3pm</p>
            <p>Domingo | Cerrado</p>

            <div className="footer-divider" />

            <span className="footer-card-title">Contacto</span>
            <p>Tel: +52 (477) 330 04 37</p>
            <p>WhatsApp: +52 (477) 533 41 27</p>
            <a href="#">contacto@pcinbox.com.mx</a>
          </div>

          <div className="footer-card">
            <span className="footer-card-title">Ubicación</span>
            <a
              href="https://maps.app.goo.gl/4egcn2hWZf4Whkyu9"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-address"
            >
              Blvd. Juan Alonso de Torres Pte. 1917 Local 1,
              <br />
              Col. Unión Comunitaria, C.P. 37239
              <br />
              León, Guanajuato, México
            </a>
            <iframe
              src="https://www.google.com/maps?q=Blvd.+Juan+Alonso+de+Torres+Pte.+1917,+Le%C3%B3n,+Guanajuato,+M%C3%A9xico&output=embed"
              className="footer-map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación PcInbox León, Guanajuato"
            />
          </div>
        </div>

        {/* Fila inferior: Pagos/Envíos | Reseñas | Redes */}
        <div className="footer-bottom-row">
          <div className="footer-card">
            <span className="footer-card-title">Formas de pago</span>
            <div className="footer-pay-grid">
              <img src="/spei.png" alt="SPEI" title="SPEI" loading="lazy" />
              <img src="/bbva.png" alt="BBVA" title="BBVA" loading="lazy" />
              <img
                src="/mastercard.png"
                alt="Mastercard"
                title="Mastercard"
                loading="lazy"
              />
              <img src="/visa.png" alt="Visa" title="Visa" loading="lazy" />
              <img
                src="/mercadopago.jpg"
                alt="MercadoPago"
                title="MercadoPago"
                loading="lazy"
                className="span2"
              />
              <img
                src="/openpay.png"
                alt="OpenPay"
                title="OpenPay"
                loading="lazy"
              />
              <img
                src="/compra_segura_blanco.jpg"
                alt="Compra Segura"
                title="Compra Segura"
                loading="lazy"
              />
            </div>

            <div className="footer-divider" />

            <span className="footer-card-title">Envíos</span>
            <div className="footer-ship-row">
              <img src="/estafeta.png" alt="Estafeta" loading="lazy" />
              <img
                src="/paqueteexpress.png"
                alt="Paquete Express"
                loading="lazy"
              />
            </div>
          </div>

          <div className="footer-card">
            <span className="footer-card-title">Reseñas</span>
            <div className="footer-reviews-wrap">
              <img src="/google.jpg" alt="Google Reviews" loading="lazy" />
              <span className="footer-reviews-label">Verified Reviews</span>
            </div>
            <a
              href="https://www.google.com/search?q=pcinbox"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-rating-link"
            >
              <Rating
                name="google-rating"
                defaultValue={5}
                max={5}
                readOnly
                size="medium"
                sx={{ "& .MuiRating-iconFilled": { color: "#EDEC3B" } }}
              />
            </a>
          </div>

          <div className="footer-card">
            <span className="footer-card-title">Síguenos</span>
            <div className="footer-social-row">
              <a
                href="https://www.facebook.com/pcinboxbajio?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <img src="/facebook.png" alt="Facebook" loading="lazy" />
              </a>
              <a
                href="https://www.youtube.com/@pcinboxmx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <img src="/youtube.png" alt="YouTube" loading="lazy" />
              </a>
              <a
                href="https://www.instagram.com/pcinbox_bajio/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="/instagram.png" alt="Instagram" loading="lazy" />
              </a>
              <a
                href="https://www.tiktok.com/@pcinbox"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <img src="/tiktok.png" alt="TikTok" loading="lazy" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="footer-bar">
        <a
          href="/terminos_y_condiciones"
          target="_blank"
          rel="noopener noreferrer"
        >
          Términos y condiciones de uso
        </a>
        <span className="footer-bar-divider">|</span>
        <a href="/aviso_privacidad" target="_blank" rel="noopener noreferrer">
          Aviso de privacidad
        </a>
      </div>
    </section>
  );
};

export default Footer;
