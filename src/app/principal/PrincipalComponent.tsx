"use client";
import "./principal.css";
import Carousel from "../components/carousel/Carousel";
import Card from "../components/card/Card";
import PaginationComponent from "../components/pagination/PaginationComponent";
import { useTheContext } from "../services/globalContext";
import useProducts from "../hooks/products";
import { useEffect, useState } from "react";
import GoogleReviewsCarousel from "../components/GoogleReviewsCarousel/GoogleReviewsCarousel";
import CarouselMarcas from "../components/carouselMarcas/CarouselMarcas";

const PrincipalComponent = () => {
  const { socketServer } = useTheContext();
  const [banners, setBanners] = useState<string[]>([]);
  const [pages, setPages] = useState<Record<string, number>>({});
  const itemsPerPage = 8;

  const { products } = useProducts();

  const handlePageChange =
    (tipo: string) => (_: React.ChangeEvent<unknown>, value: number) => {
      setPages((prev) => ({
        ...prev,
        [tipo]: value,
      }));
    };
  const tipos = [
    // { tipo: "Oficina y Gaming", label: "Laptops, Escritorios y sillas Gamer" },
    { tipo: "workStation", label: "PC Estación de trabajo" },
    // { tipo: "", label: "" },
    { tipo: "pro", label: "Pc Gamer Pro" },
    { tipo: "intermedia", label: "Pc Gamer Intermedio" },
    { tipo: "entrada", label: "Pc Gamer de entrada" },
  ];

  const productosPorTipo = tipos.map(({ tipo, label }) => {
    const filtrados = products.filter((item) => {
      if (!item.caracteristicas) return false;

      try {
        const arr =
          typeof item.caracteristicas === "string"
            ? JSON.parse(item.caracteristicas)
            : item.caracteristicas;

        const tipoProp = arr.find((c: any) => c.prop === "tipo");
        return tipoProp?.value === tipo;
      } catch {
        return false;
      }
    });

    const page = pages[tipo] || 1;
    const totalPages = Math.ceil(filtrados.length / itemsPerPage);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const currentPageProducts = filtrados.slice(start, end);

    return {
      tipo,
      label,
      currentPageProducts,
      page,
      totalPages,
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBanners([
        `https://ik.imagekit.io/pcinboxkit/${process.env.NEXT_PUBLIC_NODE_ENV === "local" ? "local" : "prod"}/carrusel-principal/banner_prin_01.png?v=${Date.now()}`,
        `https://ik.imagekit.io/pcinboxkit/${process.env.NEXT_PUBLIC_NODE_ENV === "local" ? "local" : "prod"}/carrusel-principal/banner_prin_02.png?v=${Date.now()}`,
        `https://ik.imagekit.io/pcinboxkit/${process.env.NEXT_PUBLIC_NODE_ENV === "local" ? "local" : "prod"}/carrusel-principal/banner_prin_03.png?v=${Date.now()}`,
        `https://ik.imagekit.io/pcinboxkit/${process.env.NEXT_PUBLIC_NODE_ENV === "local" ? "local" : "prod"}/carrusel-principal/banner_prin_04.png?v=${Date.now()}`,
        `https://ik.imagekit.io/pcinboxkit/${process.env.NEXT_PUBLIC_NODE_ENV === "local" ? "local" : "prod"}/carrusel-principal/banner_prin_05.png?v=${Date.now()}`,
      ]);
    }
  }, []);

  useEffect(() => {
    if (!socketServer.current) {
      return;
    }

    socketServer.current.on(
      "updateBanners",
      (data: { id: string; slot: any; url: string }[]) => {
        setBanners((prev) => {
          const updated = [...prev];

          data.forEach(({ slot, url }) => {
            const index = slot - 1;
            if (updated[index] !== undefined) {
              updated[index] = url;
            }
          });

          return updated;
        });
      },
    );
  }, [socketServer.current]);
  return (
    <section className="mb-4">
      <div className="content-main">
        {/* <div className="list-products">
          <img src="/banner0.png" className="banner0" />
          <img src="/banner1.png" className="banner1" />
          <img src="/banner2.png" className="banner2" />
        </div> */}

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
            {/* {dataProducts && dataProducts.length > 0 ? ( */}
            <Carousel banners={banners} />
            <br />

            {/* ) : (
              <div className="w-full flex justify-end p-2">
                <Alert severity="info">Sin contenido disponible</Alert>
              </div>
            )} */}
          </div>
          {productosPorTipo.map(
            ({ tipo, label, currentPageProducts, page, totalPages }) =>
              currentPageProducts.length > 0 && (
                <div key={tipo}>
                  <div className="head-container">
                    <span>{label}</span>
                  </div>

                  <div className="container-destacado">
                    {currentPageProducts.map((product) => (
                      <Card key={product.idProduct} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <PaginationComponent
                      page={page}
                      count={totalPages}
                      onChange={handlePageChange(tipo)}
                    />
                  )}
                </div>
              ),
          )}
        </div>
      </div>

      <GoogleReviewsCarousel />
      <div className="mt-2">
        <iframe
          src="https://www.google.com/maps?q=pcinbox+León+Guanajuato&output=embed"
          className="footer-map w-full h-[400px]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación PcInbox"
        />
      </div>
    </section>
  );
};

export default PrincipalComponent;
