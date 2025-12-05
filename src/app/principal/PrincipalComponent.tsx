"use client";
import "./principal.css";
import Carousel from "../components/carousel/Carousel";
import Card from "../components/card/Card";
import PaginationComponent from "../components/pagination/PaginationComponent";
import { Alert } from "@mui/material";
import { useTheContext } from "../services/globalContext";
import { usePathname } from "next/navigation";
import SubMenuProductos from "../components/subMenuProductos/SubMenuProductos";
import usePcGamers from "./usePcGamers";

const PrincipalComponent = () => {
  const pathName = usePathname();
  const { dataProducts } = useTheContext();

  const tipos = [
    { tipo: "laptop", label: "Laptops" },
    { tipo: "workStation", label: "PC Estación de trabajo" },
    // { tipo: "", label: "" },
    { tipo: "pro", label: "Pc Gamer Pro" },
    { tipo: "intermedia", label: "Pc Gamer Intermedio" },
    { tipo: "entrada", label: "Pc Gamer de entrada" },
  ];

  const productosPorTipo = tipos.map(({ tipo, label }) => {
    const { currentPageProducts, page, totalPages, handlePageChange } =
      usePcGamers({ tipo });
    return {
      tipo,
      label,
      currentPageProducts,
      page,
      totalPages,
      handlePageChange,
    };
  });

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
            {dataProducts && dataProducts.length > 0 ? (
              <Carousel />
            ) : (
              <div className="w-full flex justify-end p-2">
                <Alert severity="info">Sin contenido disponible</Alert>
              </div>
            )}
          </div>
          {productosPorTipo.map(
            ({
              tipo,
              label,
              currentPageProducts,
              page,
              totalPages,
              handlePageChange,
            }) =>
              currentPageProducts.length > 0 && (
                <div key={tipo}>
                  <div className="head-container">
                    <span>{label}</span>
                  </div>

                  <div className="container-destacado">
                    {currentPageProducts.map((product) => (
                      <Card
                        key={product.idProduct}
                        product={product}
                        dataProducts={dataProducts}
                      />
                    ))}
                  </div>

                  <PaginationComponent
                    page={page}
                    count={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              )
          )}
        </div>
      </div>
    </section>
  );
};

export default PrincipalComponent;
