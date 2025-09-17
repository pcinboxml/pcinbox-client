"use client";
import "./detailsProduct.css";
import useDetailsProduct from "./useDetailsProducts";
import { useEffect, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import useService from "../services/useService";
import { MdAutorenew, MdCheck, MdFavorite } from "react-icons/md";
import useFavorites from "../services/useFavorites";

const DetailsProduct = () => {
  const {
    quantity,
    loadingAddProduct,
    handleAdd,
    handleSubstract,
    handleAddProductCart,
    handleOnChange,
    handleKeyBoard,
  } = useDetailsProduct();
  const { formatCurrency } = useService();

  const [dataProduct, setProduct] = useState<ProductI>({
    categoryId: "",
    createdAt: "",
    description: "",
    idProduct: "",
    image_url: "",
    name: "",
    price: "",
    providerId: "",
    quantity: 0,
    stock: 0,
    reviews: [],
    rating: 0,
  });

  const { handleAddFavorites, loadingFavorite } = useFavorites();

  useEffect(() => {
    let productStorage = localStorage.getItem("product");
    if (productStorage) {
      let convertJSON = JSON.parse(productStorage);
      setProduct(convertJSON);
    }
  }, []);

  return (
    <div className="container-all white p-4">
      <div className="flex justify-center gap-2 mt-4">
        <div className="container-detail border p-3">
          <h3 className="title-product">{dataProduct.name}</h3>
          <span className="code-product">COD: PRIME B7676</span>
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
        <div className="container-img border p-3">
          {dataProduct.image_url && (
            <img src={dataProduct.image_url} alt="Imagen" />
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
            <span>Historial de pedidos</span>
          </div>

          <div className="items-history">
            {/* {[1, 2, 3].map((item) => (
              <Card key={item} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsProduct;
