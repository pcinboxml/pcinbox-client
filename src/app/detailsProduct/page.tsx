"use client";
import "./detailsProduct.css";
import Card from "../components/card/Card";
import useDetailsProduct from "./useDetailsProducts";
import { useEffect, useState } from "react";
import ProductI from "../interfaces/products/product.interface";
import useService from "../services/useService";
import { MdFavorite } from "react-icons/md";
import { Checkbox, FormControlLabel } from "@mui/material";

const DetailsProduct = () => {
  const { quantity, handleAdd, handleSubstract, handleAddProductCart } =
    useDetailsProduct();
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
  });

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
            Fecha de entrega tentativa: <span>{dataProduct.createdAt}</span>
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
              readOnly
            />
            <button className="border" onClick={handleSubstract}>
              -
            </button>
          </div>

          <button
            className="btnAgregar"
            onClick={() => handleAddProductCart(dataProduct, quantity)}
          >
            Agregar
          </button>
          <br />

          <button className="btnAgregarFavoritos">
            Agregar a favoritos
            <MdFavorite size={20} />
          </button>

          <div className="w-full  p-2 flex items-center">
            <FormControlLabel control={<Checkbox />} label="Comparar" />
          </div>
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
        <div className="w-full flex justify-center items-center flex-col">
          <label htmlFor="">Panel trasero Puertos</label>
          <div className="content-description">
            <span>Entrada de linea</span>
          </div>
        </div>
      </div>

      <div className="content-history">
        <div id="container-img">
          <img src="/banner2.png" alt="" />
        </div>
        <div className="history">
          <div className="head-container">
            <span>Historial</span>
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
