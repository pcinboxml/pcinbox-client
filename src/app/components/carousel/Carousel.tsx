"use client";

import "./carousel.css";
import { useEffect, useRef, useState } from "react";
import useCarousel from "./useCarousel";
import CarouselMarcas from "../carouselMarcas/CarouselMarcas";
import Image from "next/image";
import CarouselPlataforma from "../carouselPlataformas/CarouselPlataformas";
import { appendImageKitTransform } from "@/app/lib/imageKit";

const Carousel = ({ banners }: { banners: string[] }) => {
  const { AUTO_PLAY_INTERVAL } = useCarousel();

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    resetAutoplay();
  };

  const nextImage = () => {
    if (!banners || banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevImage = () => {
    if (!banners || banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const startAutoplay = () => {
    if (!banners || banners.length === 0) return;
    intervalRef.current = setInterval(nextImage, AUTO_PLAY_INTERVAL);
  };

  const resetAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAutoplay();
  };

  useEffect(() => {
    if (!banners || banners.length === 0) return;

    setCurrentIndex(0);
    startAutoplay();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners]);

  return (
    <>
      <div className="carousel">
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            minWidth: 0,
            marginTop: "2px",
            // border: "1px solid blue",
          }}
        >
          <CarouselMarcas />
        </div>
        <div className="imageContainer">
          {/* Slider track */}
          <div
            className="sliderTrack"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((src, index) => {
              const shouldLoad =
                index === currentIndex ||
                index === (currentIndex + 1) % banners.length;

              return (
                <div className="slide" key={index}>
                  {shouldLoad ? (
                    <Image
                      src={appendImageKitTransform(
                        src,
                        "w-1200,q-75,f-auto",
                      )}
                      width={800}
                      height={400}
                      alt={`Imagen ${index + 1}`}
                      className="image"
                      style={{ objectFit: "contain" }}
                      priority={index === 0 && currentIndex === 0}
                      loading={
                        index === 0 && currentIndex === 0 ? undefined : "lazy"
                      }
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  ) : (
                    <div
                      className="image"
                      aria-hidden
                      style={{ minHeight: 400, width: "100%" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* Dots + Flechas */}
          <div className="dotsOverlay">
            <button
              className="arrowBtn"
              onClick={() => {
                prevImage();
                resetAutoplay();
              }}
              aria-label="Imagen anterior"
            >
              &#8249;
            </button>

            <div className="dotsGroup">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                />
              ))}
            </div>

            <button
              className="arrowBtn"
              onClick={() => {
                nextImage();
                resetAutoplay();
              }}
              aria-label="Siguiente imagen"
            >
              &#8250;
            </button>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
            minWidth: 0,
            marginTop: "10px",
            // padding: "10px",
            // border: "1px solid blue",
          }}
        >
          <CarouselPlataforma />
        </div>
      </div>
    </>
  );
};

export default Carousel;
