"use client";
import "./card.css";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import { MdArrowDropDown } from "react-icons/md";
import useService from "@/app/services/useService";

const Card = () => {
  const { onRouterLink } = useService();

  return (
    <div className="mi-card border">
      <div className="container-img">
        <img
          src="/tarjeta_video.png"
          alt=""
          style={{ backgroundColor: "transparent" }}
        />
      </div>
      <div className="container-rating">
        <div className="rating">
          <Rating
            name="simple-controlled"
            defaultValue={0}
            max={5}
            size="medium"
            sx={{
              color: "#BB3D4B",
            }}
          />
        </div>
        <div className="comments flex">
          <button
            className="flex justify-center items-center border"
            style={{ marginLeft: "5px", borderRadius: "2px" }}
          >
            <MdArrowDropDown size={10} color="gray" />
          </button>
          <span style={{ marginLeft: "5px" }}>10 opiniones</span>
        </div>
      </div>

      <div className="container-description">
        <span className="name-product">Monitor de 20 pulgadas HP</span>
        <span className="code">COD 100-100001404WOF</span>
      </div>

      <div className="actions-product">
        <div
          className="buttons relative"
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
        >
          <button onClick={() => onRouterLink("/detailsProduct")}>
            Agregar
          </button>
        </div>

        <div className="cantidad-product">
          <span className="costoProducto">$6,000.71</span>
          <span className="costoEnvio">Costo de envío desde $155.00.</span>
          <span className="stock">Disponible: 12 pzas.</span>
        </div>
      </div>

      <div className="w-full  p-2 flex items-center">
        <FormControlLabel control={<Checkbox />} label="Comparar" />
      </div>
    </div>
  );
};

export default Card;
