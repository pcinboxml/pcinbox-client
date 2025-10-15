"use client";

import { Rating } from "@mui/material";
import "./footer.css";

const Footer = () => {
  return (
    <section className="relative">
      <div className="fondo-rojo absolute bottom-0 left-5 right-5 h-[180px] bg-[#BA2B3D]"></div>
      <footer className="border">
        <div className="container-footer">
          <span>Horarios de atención</span>
          <p>Lunes a Viernes | 10am a 6pm</p>
          <p>Sábado | 10am a 2pm</p>
          <p>Domingo cerrado</p>
          <br />
          <br />

          <span>Correo Electrónico</span>
          <p>contacto@pcinbox.com.mx</p>
        </div>

        <div className="container-footer">
          <span
            className="text-center block"
            style={{
              color: "#646464",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Formas de pago
          </span>
          <div className="iconos-formas-de-pago">
            <div>
              <img src="/spei.png" />
              <img src="/bbva.png" />
            </div>
            <div>
              <img src="/mastercard.png" />
              <img src="/visa.png" />
            </div>
          </div>

          <br />
          <span
            className="text-center block"
            style={{
              color: "#646464",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Envíos
          </span>
          <div className="iconos-envios">
            <img src="/estafeta.png" />
            <img src="/paqueteexpress.png" />
            <img src="/dhl.png" />
          </div>
        </div>

        <div className="container-footer">
          <span className="block text-center">Siguenos</span>

          <div className="iconos-redes">
            <img src="/google.jpg" alt="" />
            <span
              style={{
                color: "#646464",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              Verified Reviews
            </span>
          </div>

          <div className="flex justify-center mt-2">
            <a
              target="_blank"
              href="https://www.google.com/search?q=pcinbox&sca_esv=83beed824cc47635&sxsrf=AE3TifNBEGA5x-KLCGqqedPiofDMOAzh1A%3A1760143660225&source=hp&ei=LKnpaMv2C-DJkPIPuYnZ4AU&iflsig=AOw8s4IAAAAAaOm3PMc656-GPbHeSuNUNLvnLxneKhFP&gs_ssp=eJzj4tVP1zc0zC3LzcowM00zYLRSNaiwMDFKSkozMUlOTkm2MElOsTKoMLZINDQ1TQMKGJlYGBsae7EXJGfmJeVXAABJnxKs&oq=pcin&gs_lp=Egdnd3Mtd2l6IgRwY2luKgIIADITEC4YgAQYxwEYJxiKBRiOBRivATIKECMYgAQYJxiKBTIEECMYJzINEC4YgAQY0QMYxwEYCjINEAAYgAQYsQMYgwEYCjINEC4YgAQY0QMYxwEYCjIHEAAYgAQYCjINEC4YgAQY0QMYxwEYCjIHEAAYgAQYCjIFEAAYgARI8g1QAFitCHAAeACQAQCYAWygAZgDqgEDMi4yuAEDyAEA-AEBmAIEoAKoA8ICEBAuGIAEGLEDGEMYgwEYigXCAgoQABiABBhDGIoFwgIKEC4YgAQYQxiKBcICCxAAGIAEGLEDGIMBwgINEAAYgAQYsQMYQxiKBcICCBAAGIAEGLEDmAMAkgcDMC40oAfeObIHAzAuNLgHqAPCBwUwLjMuMcgHDA&sclient=gws-wiz"
            >
              <Rating
                name="simple-controlled"
                defaultValue={5}
                max={5}
                readOnly
                size="medium"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#EDEC3B",
                  },
                }}
              />
            </a>
          </div>
          <div className="redes">
            <img src="/facebook.png" />
            <img src="/youtube.png" />
            <img src="/instagram.png" />
            <img src="/tiktok.png" />
          </div>
        </div>

        <div className="container-footer">
          <span className="block text-center">Ubicación</span>

          <p
            style={{
              lineHeight: "15px",
            }}
          >
            Blvd. Juan Alonso de Torres Pte. No. 1917 Local 1 Colonia Unión
            Comunitaria de León C.P 37239 Ciudad de León, Guanajuato, México
          </p>
          <br />
          <span className="text-center block">Contacto</span>

          <p>Teléfono oficina: +52 (477) 330 04 37</p>
          <p>Atención Vía Whatsapp: +52 (477) 533 41 27</p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
