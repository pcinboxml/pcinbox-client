"use client";
import "./detailsProduct.css";
import useDetailsProduct from "./useDetailsProducts";
import { useEffect, useState } from "react";
import ProductI from "../../interfaces/products/product.interface";
import useService from "../../services/useService";
import { MdAutorenew, MdCheck, MdClose, MdFavorite } from "react-icons/md";
import useFavorites from "../../services/useFavorites";
import { Box, Modal } from "@mui/material";
import { useParams } from "next/navigation";

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

  useEffect(() => {
    if (idProduct) {
      console.log(idProduct);
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
          <h3 className="title-product">
            {dataProduct.name} {dataProduct.description}
          </h3>
          <span className="code-product">{dataProduct.sku}</span>
          <br />
          <br />

          <span className="price-product">
            {formatCurrency(Number(dataProduct.price))}
          </span>
          <span className="plazos-product">Hasta 18 pagos en $125.00</span>
          <br />

          <span className="costo-envio-product">Costo de envío: $155.00</span>
          <span className="fecha-entrega-product">
            Fecha de entrega tentativa:{" "}
            <span>{new Date(dataProduct.createdAt).toLocaleString()}</span>
          </span>
          <span className="stock-product">
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
          className="container-img border p-3"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          {dataProduct.imageUrl && (
            <img
              src={dataProduct.imageUrl[0]}
              alt="Imagen"
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </div>

      <div className="container-description w-full border mt-2 flex justify-center flex-wrap p-2">
        <h4>Descripción</h4>
        <br />
        <br />
        {[
          {
            label: "Panel trasero",
            data: [
              {
                description: "Estrada de linea",
                check: true,
                quantity: 0,
              },
            ],
          },
          {
            label: "Puertos e interfaces",
            data: [
              {
                description: "Numero de puertos HDMI",
                check: false,
                quantity: 1,
              },
              {
                description: "Cantidad de puertos VGA (D-Sub)",
                check: false,
                quantity: 1,
              },
            ],
          },
          {
            label: "Ranuras de expansion",
            data: [
              {
                description: "Ranuras PCI Express",
                check: false,
                quantity: 2,
              },
            ],
          },
        ].map((item, indexFather) => {
          return (
            <div
              key={indexFather}
              className="w-full flex justify-center items-center flex-col mb-3"
            >
              <label htmlFor="">{item.label}</label>
              <div className="content-description flex flex-col items-center justify-start">
                {item.data.map((d, indexChild) => {
                  return (
                    <div key={indexChild} className="flex justify-center gap-2">
                      <span>{d.description}</span>
                      {d.check && (
                        <span className="mx-2 block">
                          <MdCheck
                            size={20}
                            color="#0054B4"
                            style={{ fontWeight: "500" }}
                          />
                        </span>
                      )}
                      {d.quantity == 0 ? null : (
                        <span className="block mx-2 font-bold text-black">
                          {d.quantity}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="content-history">
        <div id="container-img">
          <img src="/banner2.png" alt="" />
        </div>
        <div className="history">
          <div className="head-container">
            <span>Historial de compras</span>
          </div>

          <div className="items-history">
            {/* {[1, 2, 3].map((item) => (
              <Card key={item} />
            ))} */}
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
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
                  style={{ height: "400px", objectFit: "contain" }}
                />
              </div>
              <div className="flex flex-wrap justify-start items-center p-2">
                {dataProduct.imageUrl.length > 0
                  ? dataProduct.imageUrl.map((img: string, index: number) => {
                      return (
                        <img
                          src={img}
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() => setChangeImg(img)}
                        />
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
