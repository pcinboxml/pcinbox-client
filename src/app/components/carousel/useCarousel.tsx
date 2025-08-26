"use client";

const useCarousel = () => {
  const AUTO_PLAY_INTERVAL = 3000;

  // Imágenes de ejemplo
  const images = [
    "/banner_prin.png",
    "/banner_prin_02.png",
    "/banner_prin_03.png",
    "/banner_prin_04.png",
    "/banner_prin_05.png",
  ];

  return {
    AUTO_PLAY_INTERVAL,
    images,
  };
};

export default useCarousel;
