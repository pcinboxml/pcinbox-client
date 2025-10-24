"use client";
import "./card.css";
import Rating from "@mui/material/Rating";
import { MdArrowDropDown, MdAutorenew, MdStar } from "react-icons/md";
import useService from "@/app/services/useService";
import ProductI from "@/app/interfaces/products/product.interface";
import useCard from "./useCard";
import { Carousel } from "react-responsive-carousel";
import { Box, Tooltip, styled } from "@mui/material";

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

const Card = ({
  product,
  dataProducts,
}: {
  product: ProductI;
  dataProducts: ProductI[];
}) => {
  const { onRouterLink, formatCurrency } = useService();
  const {
    handleAddProductCart,
    calcPorcentaje,
    CustomNextArrow,
    CustomPrevArrow,
    loadingAgregar,
    ratingProgress,
  } = useCard();

  return (
    <div className="mi-card border">
      <div className="container-img">
        {/* <div
          className="relative w-full overflow-hidden"
          style={{
            maxWidth: "100%",
            maxHeight: "150px",
            position: "relative",
          }}
        > */}
        <Carousel
          showIndicators={true}
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          onClickItem={() => {
            onRouterLink(`/detailsProduct/${product.idProduct}`);
          }}
        >
          {product.imageUrl && product.imageUrl.length > 0
            ? product.imageUrl.map((img: string, i: number) => (
                <div key={i}>
                  <img
                    src={img}
                    style={{ objectFit: "contain", height: "150px" }}
                  />
                </div>
              ))
            : [<div key="no-img">Sin imágenes</div>]}
        </Carousel>
        {/* </div> */}
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
        {/* {product.reviews && product.reviews.length > 0 && ( */}
        <div className="comments flex">
          <StyledTooltip
            title={
              <div className="w-full  flex justify-center">
                <Box>
                  <div className="w-full flex items-center">
                    <Rating
                      value={product.rating}
                      readOnly
                      size="medium"
                      precision={0.5}
                      sx={{
                        color: "#BB3D4B",
                      }}
                    />

                    <span className="text-[#666666] font-bold text-[18px] block mx-2">
                      {product.reviews.length.toLocaleString()} Opiniones
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[#808080] text-[16px] ">
                      {product.rating} estrellas
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols[1fr_auto] w-full">
                    {ratingProgress &&
                      ratingProgress.map((progressRating) => {
                        return (
                          <div
                            className="flex items-center mb-2"
                            key={progressRating.id}
                          >
                            <div
                              className="barProgress"
                              style={{
                                width: "200px",
                                height: "15px",
                                borderRadius: "5px",
                                background: "#E7E7E7",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  width: calcPorcentaje(
                                    product,
                                    dataProducts,
                                    progressRating
                                  ).percentage,
                                  height: "15px",
                                  top: "0",
                                  left: "0",
                                  bottom: "0",
                                  background: "#BB3D4B",
                                  borderRadius: "5px",
                                }}
                              ></div>
                            </div>
                            <div className="text-[15px] text-[#606060] font-bold mx-2">
                              {
                                calcPorcentaje(
                                  product,
                                  dataProducts,
                                  progressRating
                                ).rating
                              }
                            </div>
                            <div>
                              <MdStar color="#ccc" size={20} />
                            </div>

                            <div>
                              <span className="text-[#ccc] text-[13px] mx-1">
                                (
                                {product.reviews.reduce((acc, item) => {
                                  if (item.rating === progressRating.rating) {
                                    return acc + 1;
                                  }
                                  return acc;
                                }, 0)}
                                )
                              </span>
                            </div>
                          </div>
                        );
                      })}

                    <a
                      role="button"
                      onClick={() =>
                        onRouterLink(`/review?idProduct=${product.idProduct}`)
                      }
                      style={{
                        display: "block",
                        color: "#BB3D4B",
                        textAlign: "center",
                        fontSize: "17px",
                        textDecoration: "none",
                      }}
                    >
                      Ver todas las ({product.reviews.length.toLocaleString()})
                      opiniones
                    </a>
                  </div>
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
        {/* )} */}
      </div>

      <div className="container-description">
        <span className="name-product" title={product.name}>
          {product.name && product.name.length > 20
            ? `${product.name.slice(0, 20)}...`
            : product.name}
        </span>
        <span className="code">{product.sku}</span>
      </div>

      <div className="actions-product">
        <div className="buttons relative">
          <button
            disabled={loadingAgregar || product.stock <= 0}
            onClick={() => handleAddProductCart(product)}
          >
            {loadingAgregar ? (
              <MdAutorenew size={20} className="m-auto the-spinner" />
            ) : product.stock > 0 ? (
              "Agregar"
            ) : (
              "No disponible"
            )}
          </button>
        </div>

        <div className="cantidad-product">
          <span className="costoProducto">
            {formatCurrency(Number(product.price))}
          </span>
          {/* <span className="costoEnvio">Costo de envío desde $155.00.</span> */}
          <span className="stock">Disponible: {product.stock} pzas.</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
