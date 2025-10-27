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

const PrincipalComponent = () => {
  const pathName = usePathname();
  const { setDataProducts, dataProducts, socketServer } = useTheContext();
  const { getListProducts } = usePrincipal();
  const { pagePro, handlePageChangePro, totalPagesPro } = usePro();

  useEffect(() => {
    getListProducts();
  }, []);

  useEffect(() => {
    socketServer.current?.on("newProduct", (data: ProductI) => {
      setDataProducts((prev) => [
        {
          idProduct: data.idProduct.toString(),
          idProductExt: data.idProductExt,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: Number(data.stock),
          sku: data.sku,
          rating: Number(data.rating),
          imageUrl: data.imageUrl || (data as any).image_url,
          createdAt: data.createdAt,
          categoryId: data.categoryId.toString(),
          providerId: data.providerId.toString(),
          quantity: 0,
          reviews: [],
        },
        ...prev,
      ]);
    });

    return () => {
      socketServer.current?.off("newProduct");
    };
  }, [socketServer.current]);

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

          {dataProducts && dataProducts.length > 0 ? (
            <>
              <div className="head-container">
                <span>Pc Gamer Pro</span>
              </div>

              <div className="container-destacado">
                {dataProducts
                  .filter((item) => {
                    try {
                      if (item.caracteristicas) {
                        // Parsear las características (si vWienen como string)
                        const caracteristicas =
                          typeof item.caracteristicas === "string"
                            ? JSON.parse(item.caracteristicas)
                            : item.caracteristicas;

                        // Buscar la característica "tipo"
                        const tipo = caracteristicas.find(
                          (c: any) => c.prop == "tipo"
                        );

                        // Verificar si el tipo es "pro"
                        return tipo?.value == "pro";
                      }
                    } catch (error) {
                      console.error("Error parseando caracteristicas:", error);
                      return false; // si hay error, no mostrar el producto
                    }
                  })
                  .map((product) => (
                    <Card
                      key={product.idProduct}
                      product={product}
                      dataProducts={dataProducts}
                    />
                  ))}
              </div>

              <PaginationComponent
                page={pagePro}
                count={totalPagesPro}
                onChange={handlePageChangePro}
              />
            </>
          ) : (
            <Skeleton />
          )}

          {dataProducts && dataProducts.length > 0 ? (
            <>
              <div className="head-container">
                <span>PcGamer intermedio</span>
              </div>
              <div className="container-destacado">
                {dataProducts
                  .filter((item) => {
                    try {
                      if (item.caracteristicas) {
                        // Parsear las características (si vWienen como string)
                        const caracteristicas =
                          typeof item.caracteristicas === "string"
                            ? JSON.parse(item.caracteristicas)
                            : item.caracteristicas;

                        // Buscar la característica "tipo"
                        const tipo = caracteristicas.find(
                          (c: any) => c.prop == "tipo"
                        );

                        // Verificar si el tipo es "pro"
                        return tipo?.value == "intermedio";
                      }
                    } catch (error) {
                      console.error("Error parseando caracteristicas:", error);
                      return false; // si hay error, no mostrar el producto
                    }
                  })
                  .map((product) => (
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
                <span>PcGamer de entrada</span>
              </div>

              <div className="container-destacado">
                {dataProducts
                  .filter((item) => {
                    try {
                      if (item.caracteristicas) {
                        // Parsear las características (si vWienen como string)
                        const caracteristicas =
                          typeof item.caracteristicas === "string"
                            ? JSON.parse(item.caracteristicas)
                            : item.caracteristicas;

                        // Buscar la característica "tipo"
                        const tipo = caracteristicas.find(
                          (c: any) => c.prop == "tipo"
                        );

                        // Verificar si el tipo es "pro"
                        return tipo?.value == "entrada";
                      }
                    } catch (error) {
                      console.error("Error parseando caracteristicas:", error);
                      return false; // si hay error, no mostrar el producto
                    }
                  })
                  .map((product) => (
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
