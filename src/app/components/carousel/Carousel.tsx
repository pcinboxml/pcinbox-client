"use client";

import "./carousel.css";
import { useEffect, useRef, useState } from "react";
import useCarousel from "./useCarousel";

const Carousel = ({ banners }: { banners: string[] }) => {
  const { AUTO_PLAY_INTERVAL } = useCarousel();

  const [currentIndex, setCurrentIndex] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🔴 Ir a índice específico
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    resetAutoplay();
  };

  // 🔴 Siguiente imagen (protegido contra empty array)
  const nextImage = () => {
    if (!banners || banners.length === 0) return;

    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // 🔴 Iniciar autoplay
  const startAutoplay = () => {
    if (!banners || banners.length === 0) return;

    intervalRef.current = setInterval(nextImage, AUTO_PLAY_INTERVAL);
  };

  // 🔴 Reset autoplay
  const resetAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAutoplay();
  };

  // 🔴 Inicialización + cleanup
  useEffect(() => {
    if (!banners || banners.length === 0) return;

    setCurrentIndex(0);
    startAutoplay();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners]);

  return (
    <div className="carousel">
      <div className="imageContainer">
        <img
          src={banners[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="image"
          loading="lazy"
        />

        <div className="dotsOverlay">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`dot ${index === currentIndex ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
