"use client";

import Image from "next/image";
import { MouseEvent, ReactNode } from "react";
import { Carousel } from "react-responsive-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./productImageCarousel.module.css";

type ProductImageCarouselProps = {
  images?: string[];
  imageClassName: string;
  slideClassName?: string;
  imageSizes: string;
  imageWidth?: number;
  imageHeight?: number;
  imageTransform?: string;
  className?: string;
  onNavigate?: () => void;
  emptyFallback?: ReactNode;
};

const stopPropagation = (event: MouseEvent<HTMLButtonElement>) => {
  event.stopPropagation();
};

const ProductImageCarousel = ({
  images = [],
  imageClassName,
  slideClassName,
  imageSizes,
  imageWidth = 400,
  imageHeight = 400,
  imageTransform = "tr=w-400,q-70,f-auto",
  className,
  onNavigate,
  emptyFallback,
}: ProductImageCarouselProps) => {
  const hasMultiple = images.length > 1;
  const rootClassName = [styles.carouselRoot, className].filter(Boolean).join(" ");

  const renderArrowPrev = (
    clickHandler: () => void,
    hasPrev: boolean,
    label: string,
  ) => {
    if (!hasPrev) return null;

    return (
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navPrev}`}
        onClick={(event) => {
          stopPropagation(event);
          clickHandler();
        }}
        aria-label={label}
      >
        <ChevronLeft size={18} strokeWidth={2.5} aria-hidden />
      </button>
    );
  };

  const renderArrowNext = (
    clickHandler: () => void,
    hasNext: boolean,
    label: string,
  ) => {
    if (!hasNext) return null;

    return (
      <button
        type="button"
        className={`${styles.navBtn} ${styles.navNext}`}
        onClick={(event) => {
          stopPropagation(event);
          clickHandler();
        }}
        aria-label={label}
      >
        <ChevronRight size={18} strokeWidth={2.5} aria-hidden />
      </button>
    );
  };

  const slides =
    images.length > 0
      ? images.map((img, index) => (
          <div
            key={`${img}-${index}`}
            className={slideClassName ?? styles.slide}
          >
            <Image
              src={`${img}?${imageTransform}`}
              alt="producto"
              width={imageWidth}
              height={imageHeight}
              className={imageClassName}
              sizes={imageSizes}
              priority={index === 0}
            />
          </div>
        ))
      : [
          emptyFallback ?? (
            <div key="no-img" className={styles.emptyState}>
              Sin imágenes
            </div>
          ),
        ];

  return (
    <div className={rootClassName}>
      <Carousel
        showIndicators={hasMultiple}
        showThumbs={false}
        showStatus={false}
        showArrows={hasMultiple}
        renderArrowPrev={renderArrowPrev}
        renderArrowNext={renderArrowNext}
        onClickItem={onNavigate}
      >
        {slides}
      </Carousel>
    </div>
  );
};

export default ProductImageCarousel;
