"use client";

import "./carousel.css";
import { useEffect, useRef, useState } from "react";
import useCarousel from "./useCarousel";

const Carousel = () => {
  const { AUTO_PLAY_INTERVAL, images } = useCarousel();
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    resetAutoplay();
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const startAutoplay = () => {
    intervalRef.current = setInterval(nextImage, AUTO_PLAY_INTERVAL);
  };

  const resetAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAutoplay();
  };

  useEffect(() => {
    startAutoplay();
  }, []);

  return (
    <div className="carousel">
      <div className="imageContainer">
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="image"
        />

        <div className="dotsOverlay">
          {images.map((_, index) => (
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
