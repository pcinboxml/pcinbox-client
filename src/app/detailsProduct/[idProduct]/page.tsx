"use client";
import "./detailsProduct.css";
import useDetailsProduct from "./useDetailsProducts";
import { useEffect } from "react";
import useService from "../../services/useService";
import { MdAutorenew, MdCheck, MdClose, MdFavorite } from "react-icons/md";
import useFavorites from "../../services/useFavorites";
import { Box, Modal } from "@mui/material";
import { useParams } from "next/navigation";
import { Carousel } from "react-responsive-carousel";

const DetailsProduct = () => {
  const {
    quantity,
    loadingAddProduct,
    openModal,
    changeImg,
    dataProduct,
    setChangeImg,
    setOpenModal,
    handleAdd,
    handleSubstract,
    handleAddProductCart,
    handleOnChange,
    handleKeyBoard,
    handleGetDataProduct,
  } = useDetailsProduct();

  const { formatCurrency } = useService();
  const router = useParams();
  const { idProduct } = router;

  const { handleAddFavorites, loadingFavorite } = useFavorites();

  const dateCurrent = new Date();

  // Crear nueva fecha sumando 8 días
  const dateSend = new Date(dateCurrent);
  dateSend.setDate(dateCurrent.getDate() + 8);

  // Formatear ambas fechas a formato local (ej: dd/mm/yyyy o mm/dd/yyyy según región)
  const fechaActualFormateada = dateCurrent.toLocaleDateString();
  const fechaFuturaFormateada = dateSend.toLocaleDateString();

  useEffect(() => {
    if (idProduct) {
      handleGetDataProduct(idProduct);
      //setProduct(null);
    }
  }, []);

  useEffect(() => {
    if (dataProduct.imageUrl) {
      setChangeImg(dataProduct.imageUrl[0]);
    }
  }, [dataProduct.imageUrl]);

  return (
    <div className="container-all white p-4">
      <div className="flex justify-center gap-2 mt-4">
        <div className="container-detail border p-3">
          <h3 className="title-product">{dataProduct.name}</h3>
          {dataProduct.description && dataProduct.description.length > 100 ? (
            <span
              title={dataProduct.description}
              className="text-[#808080] text-[16px] mt-2"
            >
              Descripción: {`${dataProduct.description.slice(0, 100)}...`}
            </span>
          ) : dataProduct.description &&
            dataProduct.description.length < 100 ? (
            <span className="text-[#808080] text-[16px]">
              Descripción: {dataProduct.description}
            </span>
          ) : null}

          <span className="code-product mt-2">{dataProduct.sku}</span>

          <span className="price-product mt-2">
            {formatCurrency(Number(dataProduct.price))}
          </span>
          {/* <span className="plazos-product">Hasta 18 pagos en $125.00</span>
          <br /> */}

          {/* <span className="costo-envio-product">Costo de envío: $155.00</span> */}
          <span className="fecha-entrega-product mt-2">
            Fecha de entrega tentativa:{" "}
            <span>
              del {fechaActualFormateada} al {fechaFuturaFormateada}
            </span>
          </span>
          <span className="stock-product mt-2">
            En stock: {dataProduct.stock} pzas.
          </span>

          <div className="textfield flex mt-1">
            <button className="border" onClick={handleAdd}>
              +
            </button>
            <input
              type="number"
              className="border text-center"
              value={quantity}
              onChange={handleOnChange}
              onKeyUp={(event) => handleKeyBoard(event, dataProduct)}
            />
            <button className="border" onClick={handleSubstract}>
              -
            </button>
          </div>

          <button
            className="btnAgregar"
            disabled={loadingAddProduct}
            onClick={() => handleAddProductCart(dataProduct, Number(quantity))}
          >
            {loadingAddProduct ? (
              <MdAutorenew size={20} className="m-auto the-spinner" />
            ) : (
              "Agregar"
            )}
          </button>
          <br />

          <button
            className="btnAgregarFavoritos"
            disabled={loadingFavorite}
            onClick={() => handleAddFavorites(dataProduct)}
          >
            {loadingFavorite ? (
              <MdAutorenew size={20} className="m-auto the-spinner" />
            ) : (
              <div className="flex gap-2">
                Agregar a favoritos
                <MdFavorite size={20} />
              </div>
            )}
          </button>
        </div>
        <div
          className="container-img border"
          // onClick={() => {
          //   setOpenModal(true);
          // }}
        >
          <Carousel
            showIndicators={true}
            showThumbs={false}
            showStatus={false}
            showArrows={true}
            onClickItem={() => {
              //onRouterLink(`/detailsProduct/${dataProduct.idProduct}`);
              setOpenModal(true);
            }}
          >
            {dataProduct.imageUrl && dataProduct.imageUrl.length > 0
              ? dataProduct.imageUrl.map((img: string, i: number) => (
                  <div
                    key={i}
                    className="flex justify-center items-center"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={img}
                      style={{ objectFit: "contain", cursor: "pointer" }}
                    />
                  </div>
                ))
              : [<div key="no-img">Sin imágenes</div>]}
          </Carousel>
          {/* {dataProduct.imageUrl && (
            <img
              src={dataProduct.imageUrl[0]}
              alt="Imagen"
              style={{ cursor: "pointer" }}
            />
          )} */}
        </div>
      </div>

      <div className="container-description w-full border mt-2 flex justify-center flex-wrap p-2">
        <h4>Descripción</h4>
        <br />
        <br />

        {(() => {
          try {
            // 1️⃣ Verificamos que exista
            if (!dataProduct.caracteristicas) return null;

            // 2️⃣ Si es string, intentamos parsear
            const caracteristicas =
              typeof dataProduct.caracteristicas === "string"
                ? JSON.parse(dataProduct.caracteristicas)
                : dataProduct.caracteristicas;

            // 3️⃣ Si no es array o está vacío, no renderizamos nada
            if (!Array.isArray(caracteristicas) || caracteristicas.length === 0)
              return null;

            // 4️⃣ Renderizamos el array
            return caracteristicas.map((item: any, indexCa: number) => (
              <div
                key={indexCa}
                className="w-full flex justify-center items-center flex-col mb-3"
              >
                <label htmlFor="">{item.prop}</label>
                <div className="content-description flex flex-col items-center justify-start">
                  {item.value}
                </div>
              </div>
            ));
          } catch (error) {
            console.error(
              "❌ Error al parsear dataProduct.caracteristicas:",
              error
            );
            return null; // evita que React crashee
          }
        })()}
      </div>

      {/* <div className="content-history">
        <div id="container-img">
          <img src="/banner2.png" alt="" />
        </div>
        <div className="history">
          <div className="head-container">
            <span>Historial de compras</span>
          </div>

          <div className="items-history">
          
          </div>
        </div>
      </div> */}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          zIndex: "9999",
        }}
        children={
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",

              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
            }}
          >
            <button
              onClick={() => setOpenModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Cerrar modal"
            >
              <MdClose size={24} color="#333" />
            </button>
            <div className="w-full border grid grid-cols-[1fr_1fr] h-[400px] relative">
              <div className="flex justify-center items-center h-[400px]">
                <img
                  src={changeImg}
                  style={{ height: "90%", objectFit: "contain" }}
                />
              </div>
              <div className="flex flex-wrap justify-start items-start p-2 gap-2">
                {dataProduct.imageUrl.length > 0
                  ? dataProduct.imageUrl.map((img: string, index: number) => {
                      return (
                        <div className="p-3 rounded hover:shadow-2xl hover:rounded">
                          <img
                            src={img}
                            key={index}
                            style={{ cursor: "pointer", height: "150px" }}
                            onClick={() => setChangeImg(img)}
                          />
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </Box>
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      ></Modal>
    </div>
  );
};

export default DetailsProduct;
