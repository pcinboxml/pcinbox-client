"use client";
import "./detailsProduct.css";
import Card from "../components/card/Card";
import useDetailsProduct from "./useDetailsProducts";

const DetailsProduct = () => {
  const { amountProduct, handleAdd, handleSubstract } = useDetailsProduct();

  return (
    <div className="container-all white p-4">
      <div className="flex justify-center gap-2 mt-4">
        <div className="container-detail border p-3">
          <h3 className="title-product">Tarjeta madre ASUS Prime B34</h3>
          <span className="code-product">COD: PRIME B7676</span>
          <br />
          <br />

          <span className="price-product">$18,000</span>
          <span className="plazos-product">Hasta 18 pagos en $125.00</span>
          <br />

          <span className="costo-envio-product">Costo de envío: $155.00</span>
          <span className="fecha-entrega-product">
            Fecha de entrega tentativa
          </span>
          <span className="stock-product">En stock: 38 pzas.</span>

          <div className="textfield flex mt-1">
            <button className="border" onClick={handleAdd}>
              +
            </button>
            <input
              type="number"
              className="border text-center"
              value={amountProduct}
            />
            <button className="border" onClick={handleSubstract}>
              -
            </button>
          </div>

          <button className="btnAgregar">Agregar</button>
        </div>
        <div className="container-img border p-3">
          <img src="/tarjeta_video.png" />
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
            {[1, 2, 3].map((item) => (
              <Card key={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsProduct;
