"use client";
import Image from "next/image";
import styles from "./carousel_marca.module.css";

type Props = {
  images: string[];
};

export default function CarouselMarcas() {
  const LOOP_IMAGES = [
    "/marcas/adata.png",
    "/marcas/amd.png",
    "/marcas/antec.png",
    "/marcas/aoc.png",
    "/marcas/asrock.png",
    "/marcas/asus.png",
    "/marcas/biostar.png",
    "/marcas/cdp.png",
    "/marcas/coolermaster.png",
    "/marcas/gigabyte.png",
    "/marcas/intel.png",
    "/marcas/kingston.png",
    "/marcas/msi.png",
    "/marcas/nvidia.png",
    "/marcas/radeon.png",
    "/marcas/seagate.png",
    "/marcas/seasonic.png",
    "/marcas/wd.png",
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
              width={50}
              height={50}
              className={styles.image}
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
