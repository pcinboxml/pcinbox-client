"use client";

import "./carousel.css";
import { useEffect, useRef, useState } from "react";

const Carousel = () => {
  const AUTO_PLAY_INTERVAL = 3000;

  // Imágenes de ejemplo
  const images = [
    "/banner_prin.png",

    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy",

    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=entropy",

    "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop&crop=entropy",

    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=600&fit=crop&crop=entropy",
  ];

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
