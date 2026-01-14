"use client";

import { Rating } from "@mui/material";
import "./footer.css";

const Footer = () => {
  return (
    <section className="relative">
      <div className="fondo-rojo w-[102%] absolute bottom-0 left-[-10px] right-[-5px] h-[180px] bg-[#BA2B3D]"></div>
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
              <img src="/spei.png" loading="lazy" />
              <img src="/bbva.png" loading="lazy" />
            </div>
            <div>
              <img src="/mastercard.png" loading="lazy" />
              <img src="/visa.png" loading="lazy" />
            </div>
            <div className="flex">
              <img
                src="/mercadopago.jpg"
                alt=""
                width="250"
                height="250"
                loading="lazy"
              />
            </div>
            <div className="flex">
              <img src="/openpay.png" />
              <img
                width="250"
                height="250"
                src="/compra_segura_blanco.jpg"
                style={{
                  filter: "grayscale(0%)",
                }}
              />
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
            {/* <img src="/dhl.png" /> */}
          </div>
        </div>

        <div className="container-footer">
          <span className="block text-center">Siguenos</span>

          <div className="iconos-redes">
            <img src="/google.jpg" alt="" loading="lazy" />
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
            <a
              target="_blank"
              className="cursor-pointer"
              href="https://www.facebook.com/pcinboxbajio?locale=es_LA"
            >
              <img src="/facebook.png" loading="lazy" />
            </a>
            <a href="https://www.youtube.com/@pcinboxmx" target="_blank">
              <img src="/youtube.png" loading="lazy" />
            </a>
            <a href="https://www.instagram.com/pcinbox_bajio/" target="_blank">
              <img src="/instagram.png" loading="lazy" />
            </a>
            <a href="https://www.tiktok.com/@pcinbox" target="_blank">
              <img src="/tiktok.png" loading="lazy" />
            </a>
          </div>
        </div>

        <div className="container-footer">
          <span className="block text-center">Ubicación</span>

          <a
            id="address"
            href="https://maps.app.goo.gl/4egcn2hWZf4Whkyu9"
            target="_blank"
            style={{
              lineHeight: "15px",
              color: "#808080",
            }}
          >
            Blvd. Juan Alonso de Torres Pte. No. 1917 Local 1 Colonia Unión
            Comunitaria de León C.P 37239 Ciudad de León, Guanajuato, México
          </a>
          <br />
          <span className="text-center block">Contacto</span>

          <p>Teléfono oficina: +52 (477) 330 04 37</p>
          <p>Atención Vía Whatsapp: +52 (477) 533 41 27</p>
        </div>
      </footer>
      <div className="bg-[#BA2B3D] w-full px-1 py-1 flex justify-start absolute bottom-0">
        <div>
          <a
            href="/terminos_y_condiciones"
            target="_blank"
            className="text-[13px] text-white cursor-pointer hover:underline"
            style={{ textDecoration: "none" }}
          >
            Términos y condiciones de uso
          </a>
          <span className="text-white text-[13px] mx-1">|</span>
          <a
            href="/aviso_privacidad"
            target="_blank"
            className="text-[13px] text-white cursor-pointer hover:underline"
            style={{ textDecoration: "none" }}
          >
            Aviso de privacidad
          </a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
