"use client";
import "./card.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import { MdArrowDropDown, MdAutorenew } from "react-icons/md";
import useService from "@/app/services/useService";
import ProductI from "@/app/interfaces/products/product.interface";
import useCard from "./useCard";

const Card = ({ product }: { product: ProductI }) => {
  const { onRouterLink, formatCurrency } = useService();
  const { handleAddProductCart, loadingAgregar } = useCard();

  return (
    <div className="mi-card border">
      <div
        className="container-img"
        onClick={() => {
          localStorage.setItem(
            "product",
            JSON.stringify({
              ...product,
            })
          );
          onRouterLink("/detailsProduct");
        }}
      >
        <img
          src={product.image_url}
          alt=""
          style={{ backgroundColor: "transparent" }}
        />
      </div>
      <div className="container-rating">
        <div className="rating">
          <Rating
            name="simple-controlled"
            max={5}
            readOnly
            value={3}
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
        <span className="name-product">{product.name}</span>
        <span className="code">COD 100-100001404WOF</span>
      </div>

      <div className="actions-product">
        <div className="buttons relative">
          <button
            disabled={loadingAgregar}
            onClick={() => handleAddProductCart(product)}
          >
            {loadingAgregar ? (
              <MdAutorenew size={20} className="m-auto the-spinner" />
            ) : (
              "Agregar"
            )}
          </button>
        </div>

        <div className="cantidad-product">
          <span className="costoProducto">
            {formatCurrency(Number(product.price))}
          </span>
          <span className="costoEnvio">Costo de envío desde $155.00.</span>
          <span className="stock">Disponible: {product.stock} pzas.</span>
        </div>
      </div>

      <div className="w-full  p-2 flex items-center">
        <FormControlLabel control={<Checkbox />} label="Comparar" />
      </div>
    </div>
  );
};

export default Card;
