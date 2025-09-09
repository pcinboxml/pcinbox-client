"use client";
import "./card.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import { MdArrowDropDown, MdAutorenew } from "react-icons/md";
import useService from "@/app/services/useService";
import ProductI from "@/app/interfaces/products/product.interface";
import useCard from "./useCard";
import { Box, Tooltip, Typography, styled } from "@mui/material";

const StyledTooltip = styled(({ className, ...props }: any) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    padding: 12,
    minWidth: 300,
    maxWidth: 400,
  },
  [`& .MuiTooltip-arrow`]: {
    color: "#fff",
  },
}));

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
            value={product.rating}
            size="medium"
            sx={{
              color: "#BB3D4B",
            }}
          />
        </div>
        {product.reviews && product.reviews.length > 0 && (
          <div className="comments flex">
            <StyledTooltip
              title={
                <div className="w-full  flex justify-center">
                  <Box>
                    {product.reviews &&
                      product.reviews.length >= 3 &&
                      product.reviews.slice(0, 2).map((review, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            <span className="break-words">
                              {" "}
                              {review.reviewerName}
                            </span>
                          </Typography>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            precision={0.5}
                            sx={{
                              color: "#BB3D4B",
                            }}
                          />
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            <span className="break-words">
                              {review.description}
                            </span>
                          </Typography>
                          <br />
                        </Box>
                      ))}

                    {product.reviews.length > 3 ? (
                      <Box>
                        <div className="w-full">
                          <a
                            role="button"
                            onClick={() => onRouterLink("/review")}
                            style={{
                              color: "#bb3d4b",
                              fontSize: "16px",
                              fontWeight: "500",
                            }}
                            className="text-center block text-[#bb3d4b]"
                          >
                            Ver todas las opiniones
                          </a>
                        </div>
                      </Box>
                    ) : null}
                  </Box>
                </div>
              }
            >
              <div className="flex">
                <button
                  className="flex justify-center items-center border"
                  style={{ marginLeft: "5px", borderRadius: "2px" }}
                >
                  <MdArrowDropDown size={10} color="gray" />
                </button>
              </div>
            </StyledTooltip>
            <a style={{ marginLeft: "5px" }}>
              {product.reviews
                .filter((item) => item.productId == product.idProduct)
                .length.toLocaleString()}{" "}
              opiniones
            </a>
          </div>
        )}
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
    </div>
  );
};

export default Card;
