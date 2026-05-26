"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/cn";
import {
  IMAGE_PLACEHOLDERS,
  sanitizeImageUrl,
  sanitizeImages,
} from "@/lib/images";

const AUTO_MS = 5000;

type ProjectGalleryProps = {
  images: string[];
  coverImage: string;
  title: string;
  className?: string;
};

export function ProjectGallery({
  images,
  coverImage,
  title,
  className,
}: ProjectGalleryProps) {
  const galleryImages = useMemo(() => {
    const merged =
      images.length > 0
        ? images
        : coverImage
          ? [coverImage]
          : [IMAGE_PLACEHOLDERS.project];
    const withCover =
      coverImage && !merged.includes(coverImage)
        ? [coverImage, ...merged]
        : merged;
    return sanitizeImages(withCover, IMAGE_PLACEHOLDERS.project);
  }, [coverImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback(
    (index: number) => {
      const total = galleryImages.length;
      setActiveIndex(((index % total) + total) % total);
    },
    [galleryImages.length],
  );

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  useEffect(() => {
    if (galleryImages.length <= 1 || hovered || reduceMotion) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryImages.length);
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [galleryImages.length, hovered, reduceMotion]);

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
            key={activeIndex}
            className="listing-detail-gallery-slide"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.45, ease: easePremium }}
          >
            <OptimizedImage
              src={sanitizeImageUrl(
                galleryImages[activeIndex]!,
                IMAGE_PLACEHOLDERS.project,
              )}
              alt={`${title} – görsel ${activeIndex + 1}`}
              fillParent
              rounded={false}
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority={activeIndex === 0}
              fallbackSrc={IMAGE_PLACEHOLDERS.project}
              className="listing-detail-gallery-image"
            />
          </motion.div>
        </AnimatePresence>

        {galleryImages.length > 1 ? (
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
              {activeIndex + 1} / {galleryImages.length}
            </div>
          </>
        ) : null}
      </div>

      {galleryImages.length > 1 ? (
        <ul className="listing-detail-gallery-thumbs" aria-label="Görsel seçimi">
          {galleryImages.map((src, index) => (
            <li key={`${src}-${index}`}>
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
                  src={src}
                  alt=""
                  aspectRatio="1/1"
                  rounded={false}
                  sizes="80px"
                  fallbackSrc={IMAGE_PLACEHOLDERS.project}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
