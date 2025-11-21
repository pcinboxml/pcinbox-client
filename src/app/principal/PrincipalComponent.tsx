"use client";
import "./principal.css";
import usePrincipal from "./usePrincipal";
import Carousel from "../components/carousel/Carousel";
import Card from "../components/card/Card";
import { useEffect } from "react";
import Skeleton from "../components/skeleton/Skeleton";
import PaginationComponent from "../components/pagination/PaginationComponent";
import ProductI from "../interfaces/products/product.interface";
import { Alert } from "@mui/material";
import { useTheContext } from "../services/globalContext";
import { usePathname } from "next/navigation";
import SubMenuProductos from "../components/subMenuProductos/SubMenuProductos";
import usePro from "./usePro";
import useIntermedio from "./useIntermedio";
import useEntrada from "./useEntrada";
import Image from "next/image";

const PrincipalComponent = () => {
  const pathName = usePathname();
  const { dataProducts } = useTheContext();
  const {
    pagePro,
    handlePageChangePro,
    totalPagesPro,
    currentPageProductsPro,
  } = usePro();

  const {
    pageInter,
    handlePageChangeInter,
    totalPagesInter,
    currentPageProductsInter,
  } = useIntermedio();

  const {
    pageEntrada,
    handlePageChangeEntrada,
    totalPagesEntrada,
    currentPageProductsEntrada,
  } = useEntrada();

  return (
    <section className="mb-4">
      <div className="content-main">
        {dataProducts && dataProducts.length > 0 ? (
          <div className="list-products">
            <Image
              src="/banner0.png"
              className="banner0"
              width={100}
              height={`${100}`}
              loading="lazy"
              alt="banner0"
            />
            <Image
              src="/banner1.png"
              className="banner1"
              loading="lazy"
              width={100}
              height={`${100}`}
              alt="banner1"
            />
            <Image
              src="/banner2.png"
              className="banner2"
              loading="lazy"
              width={100}
              height={`${100}`}
              alt="banner2"
            />

            {/* <img src="/banner1.png" className="banner1" loading="lazy" />
            <img src="/banner2.png" className="banner2" loading="lazy" /> */}
          </div>
        ) : (
          ""
        )}

        <div className="content-index relative">
          {/* {pathName == "/principal" || pathName == "/" ? (
            <SubMenuProductos
              styles={{
                // left: "-160px",
                top: "-43px",
                paddingLeft: "2px",
                paddingTop: "3px",
                paddingRight: "3px",
              }}
            />
          ) : null} */}
          <div className="container-carousel">
            {/* <img src="/nintendo.jpg" alt="" /> */}

            {dataProducts && dataProducts.length > 0 ? (
              <Carousel />
            ) : (
              <div className="w-full flex justify-end p-2">
                {/* <Skeleton /> */}
                <Alert severity="info">Sin contenido disponible</Alert>
              </div>
            )}
          </div>

          {currentPageProductsPro && currentPageProductsPro.length > 0 ? (
            <>
              <div className="head-container">
                <span>Pc Gamer Pro</span>
              </div>

              <div className="container-destacado">
                {currentPageProductsPro.map((product, indexproduct) => (
                  <Card
                    key={product.idProduct + indexproduct}
                    product={product}
                    dataProducts={dataProducts}
                  />
                ))}
              </div>
              {/* <Alert severity="info" className="my-2">
                Las imágenes publicadas son meramente ilustrativas y no siempre
                representan el producto final.
              </Alert> */}

              {currentPageProductsPro && currentPageProductsPro.length > 0 && (
                <PaginationComponent
                  page={pagePro}
                  count={totalPagesPro}
                  onChange={handlePageChangePro}
                />
              )}
            </>
          ) : (
            <Skeleton />
          )}

          {currentPageProductsInter && currentPageProductsInter.length > 0 ? (
            <>
              <div className="head-container">
                <span>Pc Gamer Intermedio</span>
              </div>

              <div className="container-destacado">
                {currentPageProductsInter.map((product, indexproduct) => (
                  <Card
                    key={product.idProduct + indexproduct}
                    product={product}
                    dataProducts={dataProducts}
                  />
                ))}
              </div>
              {/* <Alert severity="info" className="my-2">
                Las imágenes publicadas son meramente ilustrativas y no siempre
                representan el producto final.
              </Alert> */}

              {currentPageProductsInter &&
                currentPageProductsInter.length > 0 && (
                  <PaginationComponent
                    page={pageInter}
                    count={totalPagesInter}
                    onChange={handlePageChangeInter}
                  />
                )}
            </>
          ) : (
            <Skeleton />
          )}

          {currentPageProductsEntrada &&
          currentPageProductsEntrada.length > 0 ? (
            <>
              <div className="head-container">
                <span>Pc Gamer de entrada</span>
              </div>

              <div className="container-destacado">
                {currentPageProductsEntrada.map((product) => (
                  <Card
                    key={product.idProduct}
                    product={product}
                    dataProducts={dataProducts}
                  />
                ))}
              </div>
              {currentPageProductsEntrada &&
                currentPageProductsEntrada.length > 0 && (
                  <PaginationComponent
                    page={pageEntrada}
                    count={totalPagesEntrada}
                    onChange={handlePageChangeEntrada}
                  />
                )}
            </>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
    </section>
  );
};

export default PrincipalComponent;
