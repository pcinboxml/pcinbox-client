"use client";
import "./principal.css";
import usePrincipal from "./usePrincipal";
import Carousel from "../components/carousel/Carousel";
import Card from "../components/card/Card";
import { useEffect } from "react";
import Skeleton from "../components/skeleton/Skeleton";

const PrincipalComponent = () => {
  const {
    getListProducts,
    dataProducts,
    loadingProducts,
    MARCAS,
    changePagination,
    currentPage,
    itemsPerPage,
    sectionRef,
  } = usePrincipal();

  useEffect(() => {
    getListProducts();
  }, []);

  return (
    <section>
      {/*Carrusel */}

      <div className="content-main">
        <div className="list-products">
          <img src="/banner0.png" className="banner0" />
          <img src="/banner1.png" className="banner1" />
          <img src="/banner2.png" className="banner2" />
        </div>
        <div className="content-index">
          <div className="container-carousel">
            {/* <img src="/nintendo.jpg" alt="" /> */}
            <Carousel />
          </div>

          <div className="head-container">
            <span>Tenemos lo más destacado en Gaming!</span>
          </div>
          <div className="container-destacado">
            {dataProducts &&
              dataProducts.map((product) => (
                <Card key={product.idProduct} product={product} />
              ))}
          </div>

          <div className="head-container">
            <span>Lo más buscado!</span>
          </div>

          <div className="container-destacado">
            {dataProducts && dataProducts.length > 0 ? (
              dataProducts.map((product) => (
                <Card key={product.idProduct} product={product} />
              ))
            ) : (
              <Skeleton />
            )}
          </div>

          <div className="head-container">
            <span>Lo más vendido!</span>
          </div>

          <div className="container-destacado">
            {dataProducts && dataProducts.length > 0 ? (
              dataProducts.map((product) => (
                <Card key={product.idProduct} product={product} />
              ))
            ) : (
              <Skeleton />
            )}
          </div>
        </div>
      </div>

      {/* <div className="img">
        <img src="/pcgamer.jpg" alt="" />
      </div>

      <div className="tema">
        <span>Tenemos lo más destacado en Gaming!</span>
      </div>

      <div className="container-products-destacados">
        <Card />
      </div> */}
    </section>
  );
};

export default PrincipalComponent;
