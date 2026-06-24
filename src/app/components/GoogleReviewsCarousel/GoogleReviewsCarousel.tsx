"use client";

import { GoogleReviewItem } from "@/app/interfaces/googleReviews.interface";
import React, { useRef, useEffect, useState } from "react";

// ─── Star Component ───────────────────────────────────────────────────────────

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? "text-amber-400" : "text-zinc-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── Review Card ──────────────────────────────────────────────────────────────

const ReviewCard = ({ review }: { review: GoogleReviewItem }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(
    review.profile_photo_url || null,
  );

  return (
    <div
      style={{ padding: "10px" }}
      className="review-card flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 mx-3 select-none"
    >
      <div className="flex items-center gap-3 mb-4 relative">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0 relative overflow-hidden"
          style={{ background: avatarColor(review.author_name) }}
        >
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              className="w-full h-full object-cover absolute inset-0 z-10"
              alt={review.author_name}
              loading="lazy"
              onError={() => setImgSrc(null)}
            />
          ) : null}
          <span className="uppercase font-bold text-base select-none z-0">
            {review.author_name ? review.author_name.charAt(0) : "U"}
          </span>
        </div>
        <div className="overflow-hidden">
          <p className="font-semibold text-zinc-800 text-sm truncate">
            {review.author_name}
          </p>
          <p className="text-zinc-400 text-xs">
            {new Date(review.date).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="ml-auto flex-shrink-0 absolute right-1">
          <GoogleIcon />
        </div>
      </div>

      <Stars rating={review.rating} />

      <p className="mt-3 text-zinc-600 text-sm leading-relaxed line-clamp-4">
        {review.text}
      </p>
    </div>
  );
};

// ─── Google Icon ──────────────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

function avatarColor(name: string): string {
  const colors = [
    "#4F7BE8",
    "#E8654F",
    "#4FBE8A",
    "#BE8A4F",
    "#8A4FBE",
    "#4FBEBE",
    "#BE4F8A",
    "#8ABE4F",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ─── Main Carousel ────────────────────────────────────────────────────────────

export default function GoogleReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const posRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const [mediaRating, setMediaRating] = useState(0);
  const [googleReviewsUrl, setGoogleReviewsUrl] = useState("");
  const [dataReviews, setDataReviews] = useState<GoogleReviewItem[]>([]);

  const SPEED = 40;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || dataReviews.length === 0) return;

    const halfWidth = track.scrollWidth / 2;

    const animate = (timestamp: number) => {
      if (!isPaused) {
        if (lastTimeRef.current !== null) {
          const delta = (timestamp - lastTimeRef.current) / 1000;
          posRef.current += SPEED * delta;
          if (posRef.current >= halfWidth) posRef.current -= halfWidth;
          track.style.transform = `translateX(-${posRef.current}px)`;
        }
        lastTimeRef.current = timestamp;
      } else {
        lastTimeRef.current = null;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, dataReviews]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch("/google-reviews.json");

        if (!response.ok) {
          throw new Error("No se pudo cargar google-reviews.json");
        }

        const data = await response.json();

        if (data?.rating) {
          setMediaRating(data.rating);
        }
        if (data?.googleReviewsUrl) {
          setGoogleReviewsUrl(data.googleReviewsUrl);
        }

        if (!data?.reviews || !Array.isArray(data.reviews)) {
          setDataReviews([]);
          return;
        }

        const filtered = data.reviews.filter(
          (review: GoogleReviewItem) =>
            review.rating === 5 && review.text.trim() !== "",
        );

        if (filtered.length === 0) {
          setDataReviews([]);
          return;
        }

        setDataReviews([...filtered, ...filtered]);
      } catch (error) {
        console.warn("Failed to load Google reviews:", error);
        setDataReviews([]);
      }
    }

    loadReviews();
  }, []);

  if (dataReviews.length === 0 && !googleReviewsUrl) {
    return null;
  }

  return (
    <div className="border w-full">
      <section className="bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="text-center mb-10 px-4" style={{ padding: "10px" }}>
          <div
            style={{ padding: "10px" }}
            className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1.5 mb-4 shadow-sm"
          >
            <GoogleIcon />
            <span className="text-sm font-medium text-zinc-600">
              Reseñas de Google
            </span>
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Stars rating={mediaRating} />
            <span className="text-zinc-500 text-sm font-medium">
              {mediaRating}
            </span>
          </div>
          {googleReviewsUrl ? (
            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 underline"
            >
              Ver todas las reseñas en Google
            </a>
          ) : null}
        </div>

        {dataReviews.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-slate-50 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-white to-transparent" />

            <div className="overflow-hidden">
              <div ref={trackRef} className="flex will-change-transform py-4">
                {dataReviews.map((review, idx) => (
                  <ReviewCard key={`${review.id}-${idx}`} review={review} />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
