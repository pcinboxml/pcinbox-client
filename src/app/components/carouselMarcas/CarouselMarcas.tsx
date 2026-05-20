"use client";
import Image from "next/image";
import styles from "./carousel_marca.module.css";

type Props = {
  images: string[];
};

export default function CarouselMarcas() {
  const LOOP_IMAGES = [
    "https://neliosoftware.com/es/blog/imagenes-gratuitas-para-tu-blog/",
    "https://neliosoftware.com/es/blog/imagenes-gratuitas-para-tu-blog/",
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {LOOP_IMAGES.map((src, i) => (
          <div className={styles.slide} key={i}>
            <Image
              src={src}
              alt={`img-${i}`}
              width={300}
              height={200}
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
