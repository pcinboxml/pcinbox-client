"use client";

import { Rating } from "@mui/material";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="border">
      <div className="container-footer">
        <span>Horarios de contacto</span>
        <p>Lunes a Viernes de 10:00 am a 6:00 pm</p>
        <p>Sábado de 10:00 am a 2:00 pm</p>

        <br />
        <br />

        <span>Correo Electrónico</span>
        <p>contacto@pcinbox.com.mx</p>
      </div>

      <div className="container-footer">
        <span>Formas de pago</span>
        <div className="iconos-formas-de-pago">
          <img src="/spei.png" />
          <img src="/bbva.png" />
          <img src="/mastercard.png" />
          <img src="/visa.png" />
        </div>

        <br />
        <span>Envios por</span>
        <div className="iconos-envios">
          <img src="/estafeta.png" />
          <img src="/paqueteexpress.png" />
          <img src="/dhl.png" />
        </div>
      </div>

      <div className="container-footer">
        <span className="block text-center">Redes sociales</span>

        <div className="iconos-redes">
          <img src="/google.jpg" alt="" />
          <span>Verified Reviews</span>
        </div>

        <div className="flex justify-center mt-2">
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
        </div>
        <div className="redes">
          <img src="/facebook.png" />
          <img src="/youtube.png" />
          <img src="/instagram.png" />
          <img src="/tiktok.png" />
        </div>
      </div>

      <div className="container-footer">
        <span>Ubicación</span>

        <p>
          Blvd. Juan Alonso de Torres Pte. No. 1917 Local 1 Colonia Unión
          Comunitaria de León C.P 37239 Ciudad de León, Guanajuato, México
        </p>
        <br />
        <span>Tel. Oficina</span>
        <br />
        <span>(+52) 477 330 04 37</span>
        <br />
        <span>WhatsApp</span>
        <br />
        <div className="flex items-center" style={{ height: "15px" }}>
          <span>(+52) 477 533 41 27</span>
          <img
            src="/whatsapp.png"
            style={{ width: "50px", height: "50px", objectFit: "contain" }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
