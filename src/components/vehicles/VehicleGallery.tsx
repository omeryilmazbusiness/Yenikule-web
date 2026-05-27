"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { cn } from "@/lib/cn";
import { easePremium } from "@/lib/motion";
import { IMAGE_PLACEHOLDERS, sanitizeImages } from "@/lib/images";

const AUTO_MS = 5000;

type VehicleGalleryProps = {
  images?: string[];
  title: string;
  className?: string;
};

export function VehicleGallery({ images, title, className }: VehicleGalleryProps) {
  const reduceMotion = useReducedMotion();
  const items = useMemo(
    () =>
      sanitizeImages(images ?? [], IMAGE_PLACEHOLDERS.vehicle).map((url, index) => ({
        id: `${index}-${url}`,
        url,
        isPrimary: index === 0,
      })),
    [images],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const activeItem = items[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      const total = items.length;
      setActiveIndex(((index % total) + total) % total);
    },
    [items.length],
  );

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  useEffect(() => {
    if (items.length <= 1 || hovered || reduceMotion) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [items.length, hovered, reduceMotion]);

  if (!activeItem) return null;

  return (
    <div
      className={cn("listing-detail-gallery", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "listing-detail-gallery-stage",
          hovered && "listing-detail-gallery-stage-zoomed",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.id}
            className="listing-detail-gallery-slide"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease: easePremium }}
          >
            <OptimizedImage
              src={activeItem.url}
              alt={`${title} – görsel ${activeIndex + 1}`}
              fillParent
              rounded={false}
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority={activeIndex === 0}
              fallbackSrc={IMAGE_PLACEHOLDERS.vehicle}
              className="listing-detail-gallery-image"
            />
          </motion.div>
        </AnimatePresence>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              className="listing-detail-gallery-nav listing-detail-gallery-nav-prev"
              onClick={goPrev}
              aria-label="Önceki görsel"
            >
              <ChevronLeft className="size-6 stroke-[1.5]" aria-hidden />
            </button>
            <button
              type="button"
              className="listing-detail-gallery-nav listing-detail-gallery-nav-next"
              onClick={goNext}
              aria-label="Sonraki görsel"
            >
              <ChevronRight className="size-6 stroke-[1.5]" aria-hidden />
            </button>
            <div className="listing-detail-gallery-counter" aria-live="polite">
              {activeIndex + 1} / {items.length}
            </div>
          </>
        ) : null}
      </div>

      {items.length > 1 ? (
        <ul className="listing-detail-gallery-thumbs" aria-label="Görsel seçimi">
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "listing-detail-gallery-thumb",
                  index === activeIndex && "listing-detail-gallery-thumb-active",
                )}
                aria-label={`Görsel ${index + 1}`}
                aria-current={index === activeIndex}
              >
                <OptimizedImage
                  src={item.url}
                  alt=""
                  aspectRatio="1/1"
                  rounded={false}
                  sizes="80px"
                  fallbackSrc={IMAGE_PLACEHOLDERS.vehicle}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

