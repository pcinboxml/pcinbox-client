"use client";

import "./carousel.css";
import { useEffect, useRef, useState } from "react";
import useCarousel from "./useCarousel";
import CarouselMarcas from "../carouselMarcas/CarouselMarcas";
import Image from "next/image";

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
        <div className="imageContainer">
          {/* Slider track */}
          <div
            className="sliderTrack"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((src, index) => (
              <div className="slide" key={index}>
                <Image
                  src={src}
                  width={800}
                  height={400}
                  alt={`Imagen ${index + 1}`}
                  className="image"
                  style={{ objectFit: "contain" }}
                  priority={index === 0}
                />
              </div>
            ))}
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
            border: "1px solid blue",
          }}
        >
          contenido
          {/* <CarouselMarcas /> */}
        </div>
      </div>
    </>
  );
};

export default Carousel;
