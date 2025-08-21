"use client";
import "./index.css";
import useIndex from "./useIndex";
import Carousel from "../components/carousel/Carousel";
import Card from "../components/card/Card";

const Index = () => {
  const {
    getListProducts,
    dataProducts,
    loadingProducts,
    MARCAS,
    changePagination,
    currentPage,
    itemsPerPage,
    sectionRef,
  } = useIndex();

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
            {[1, 2, 3].map((item) => (
              <Card key={item} />
            ))}
          </div>

          <div className="head-container">
            <span>Lo más buscado!</span>
          </div>

          <div className="container-destacado">
            {[1, 2, 3].map((item) => (
              <Card key={item} />
            ))}
          </div>

          <div className="head-container">
            <span>Lo más vendido!</span>
          </div>

          <div className="container-destacado">
            {[1, 2, 3].map((item) => (
              <Card key={item} />
            ))}
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

export default Index;
