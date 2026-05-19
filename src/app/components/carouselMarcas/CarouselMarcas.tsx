"use client";

import React from "react";
import styles from "./carousel_marca.module.css";

const brands = [
  { name: "NVIDIA", letter: "N" },
  { name: "AMD", letter: "A" },
  { name: "Intel", letter: "I" },
  { name: "ASUS ROG", letter: "R" },
  { name: "MSI", letter: "M" },
  { name: "Corsair", letter: "C" },
  { name: "Razer", letter: "Z" },
  { name: "NZXT", letter: "X" },
  { name: "Logitech G", letter: "G" },
  { name: "SteelSeries", letter: "S" },
  { name: "Cooler Master", letter: "K" },
  { name: "Gigabyte", letter: "B" },
  { name: "HyperX", letter: "H" },
  { name: "Thermaltake", letter: "T" },
  { name: "Fractal", letter: "F" },
];

// Duplicate for seamless infinite loop
const doubled = [...brands, ...brands];

export default function CarouselMarcas() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.fade_left} />
      <div className={styles.fade_right} />
      <div className={styles.track}>
        {doubled.map((brand, i) => (
          <div className={styles.item} key={`${brand.name}-${i}`}>
            <span className={styles.logo}>{brand.letter}</span>
            <span className={styles.name}>{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
