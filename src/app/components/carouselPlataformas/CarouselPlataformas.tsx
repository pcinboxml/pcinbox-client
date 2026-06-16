"use client";
import Image from "next/image";
import styles from "./carousel_plataformas.module.css";

type Props = {
  images: string[];
};

export default function CarouselPlataforma() {
  const LOOP_IMAGES = [
    "/plataformas/battlenet.png",
    "/plataformas/epic.png",
    "/plataformas/gog.png",
    "/plataformas/origin.png",
    "/plataformas/riot.png",
    "/plataformas/rockstar.png",
    "/plataformas/steam.png",
    "/plataformas/ubisoft.png",
  ];

  const LOOP_IMAGES2 = [...LOOP_IMAGES, ...LOOP_IMAGES];

  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {LOOP_IMAGES2.map((src, i) => (
          <div className={styles.slide} key={i}>
            <Image
              src={src}
              alt={`img-${i}`}
              width={90}
              height={90}
              className={styles.image}
              loading="lazy"
              style={{
                objectFit: "contain",
                width: "100px",
                height: "100px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
