"use client";
import "./principal.css";
import Carousel from "../components/carousel/Carousel";
import { useTheContext } from "../services/globalContext";
import { useEffect, useState } from "react";
import GoogleReviewsCarousel from "../components/GoogleReviewsCarousel/GoogleReviewsCarousel";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PrincipalComponent = () => {
  const { socketServer } = useTheContext();
  const [banners, setBanners] = useState<string[]>([]);
  const router = useRouter();

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
        <div className="list-products">
          <img src="/banner0.png" className="banner0" />
          <img src="/banner1.png" className="banner1" />
          <img src="/banner2.png" className="banner2" />
        </div>

        <div className="content-index relative">
          <div className="container-carousel">
            <Carousel banners={banners} />
            <br />
          </div>

          <div className="w-full flex flex-col md:flex-row justify-center items-center my-8">
            <div
              onClick={() => router.push("/pc-gamer")}
              className="group relative cursor-pointer overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] w-full md:w-1/2"
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              <Image
                src={"/dual_products_banners/boton_pc_gamer.png"}
                alt="Boton PC Gamer"
                width={850}
                height={335}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "5px",
                  display: "block"
                }}
              />
            </div>

            <div
              onClick={() => router.push("/workstation")}
              className="group relative cursor-pointer overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] w-full md:w-1/2"
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              <Image
                src={"/dual_products_banners/boton_ws.png"}
                alt="Boton WS"
                width={850}
                height={334}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "5px",
                  display: "block"
                }}
              />
            </div>
          </div>

          <GoogleReviewsCarousel />
        </div>
      </div>

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
