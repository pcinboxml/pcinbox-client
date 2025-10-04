"use client";
import "./principal.css";
import usePrincipal from "./usePrincipal";
import Carousel from "../components/carousel/Carousel";
import Card from "../components/card/Card";
import { useEffect } from "react";
import Skeleton from "../components/skeleton/Skeleton";
import PaginationComponent from "../components/pagination/PaginationComponent";
import useSocket from "./../services/ioClient";
import ProductI from "../interfaces/products/product.interface";
import { Alert } from "@mui/material";

const PrincipalComponent = () => {
  const { socketServer } = useSocket();

  const {
    getListProducts,
    dataProducts,
    handleOnChange,
    onSubmitNewProduct,
    setDataProducts,
  } = usePrincipal();

  useEffect(() => {
    getListProducts();

    socketServer.current?.on("newProduct", (data: ProductI[]) => {
      setDataProducts(data);
      //Llamar a funcion setDataProducts para actualizar la vista del usuario
    });

    return () => {
      socketServer.current?.off("newProduct");
    };
  }, []);

  return (
    <section className="mb-4">
      <div className="content-main">
        {dataProducts && dataProducts.length > 0 ? (
          <div className="list-products">
            <img src="/banner0.png" className="banner0" />
            <img src="/banner1.png" className="banner1" />
            <img src="/banner2.png" className="banner2" />
          </div>
        ) : (
          ""
        )}

        <div className="content-index">
          {/* <form
            style={{ display: "none" }}
            className="flex flex-col items-center mt-1"
            onSubmit={onSubmitNewProduct}
          >
            <input
              type="text"
              placeholder="Nombre"
              name="name"
              className="form-control"
              onChange={handleOnChange}
            />
            <input
              type="text"
              placeholder="Descripcion"
              name="description"
              className="form-control"
              onChange={handleOnChange}
            />
            <input
              type="number"
              placeholder="price"
              name="price"
              className="form-control"
              onChange={handleOnChange}
            />

            <input
              type="number"
              placeholder="rating"
              name="rating"
              className="form-control"
              onChange={handleOnChange}
            />

            <input
              type="text"
              placeholder="imagen url"
              name="image_url"
              className="form-control"
              onChange={handleOnChange}
            />

            <input
              type="text"
              placeholder="categoryId"
              name="categoryId"
              className="form-control"
              onChange={handleOnChange}
            />

            <input
              type="text"
              placeholder="proveedorId"
              name="providerId"
              className="form-control"
              onChange={handleOnChange}
            />

            <button type="submit" className="btn btn-info">
              Guardar Producto
            </button>
          </form> */}
          <div className="container-carousel">
            {/* <img src="/nintendo.jpg" alt="" /> */}

            {dataProducts && dataProducts.length > 0 ? (
              <Carousel />
            ) : (
              <div className="w-full flex justify-end p-2">
                {/* <Skeleton /> */}
                <Alert>Sin contenido disponible</Alert>
              </div>
            )}
          </div>

          {dataProducts && dataProducts.length > 0 ? (
            <>
              <div className="head-container">
                <span>Tenemos lo más destacado en Gaming!</span>
              </div>

              <div className="container-destacado">
                {dataProducts
                  .sort((a, b) => Number(b.idProduct) - Number(a.idProduct))
                  .slice(0, 6)
                  .map((product) => (
                    <Card
                      key={product.idProduct}
                      product={product}
                      dataProducts={dataProducts}
                    />
                  ))}
              </div>

              {/* <PaginationComponent
                count={pagination[0].pageCount}
                page={pagination[0].currentPage}
                onChange={(event, page) => changePagination(event, page, 1)}
              /> */}
            </>
          ) : (
            <Skeleton />
          )}

          {dataProducts && dataProducts.length > 0 ? (
            <>
              <div className="head-container">
                <span>Lo más buscado!</span>
              </div>
              <div className="container-destacado">
                {dataProducts.slice(0, 6).map((product) => (
                  <Card
                    key={product.idProduct}
                    product={product}
                    dataProducts={dataProducts}
                  />
                ))}
              </div>
            </>
          ) : (
            <Skeleton />
          )}

          {dataProducts && dataProducts.length > 0 ? (
            <>
              <div className="head-container">
                <span>Lo más vendido!</span>
              </div>

              <div className="container-destacado">
                {dataProducts.slice(0, 6).map((product) => (
                  <Card
                    key={product.idProduct}
                    product={product}
                    dataProducts={dataProducts}
                  />
                ))}
              </div>
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
