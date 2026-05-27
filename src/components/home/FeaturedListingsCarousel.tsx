"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ListingCard } from "@/components/listings/ListingCard";
import type { Listing } from "@/features/listings/types/listing.types";
import { easePremium } from "@/lib/motion";
import { cn } from "@/lib/cn";

const AUTO_MS = 5500;
const PER_PAGE_LG = 3;
const PER_PAGE_MD = 2;
const PER_PAGE_SM = 1;

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

function usePerPage() {
  const [perPage, setPerPage] = useState(PER_PAGE_LG);

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const md = window.matchMedia("(min-width: 768px)");

    const sync = () => {
      if (lg.matches) setPerPage(PER_PAGE_LG);
      else if (md.matches) setPerPage(PER_PAGE_MD);
      else setPerPage(PER_PAGE_SM);
    };

    sync();
    lg.addEventListener("change", sync);
    md.addEventListener("change", sync);
    return () => {
      lg.removeEventListener("change", sync);
      md.removeEventListener("change", sync);
    };
  }, []);

  return perPage;
}

type FeaturedListingsCarouselProps = {
  listings: Listing[];
};

export function FeaturedListingsCarousel({
  listings,
}: FeaturedListingsCarouselProps) {
  const perPage = usePerPage();
  const pages = useMemo(
    () => chunk(listings, perPage),
    [listings, perPage],
  );
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const pageCount = pages.length;
  const canSlide = pageCount > 1;

  useEffect(() => {
    queueMicrotask(() => setPage(0));
  }, [perPage]);

  useEffect(() => {
    if (!canSlide || paused || reduceMotion) return;

    const id = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [canSlide, paused, pageCount, reduceMotion]);

  const goTo = useCallback(
    (index: number) => {
      if (pageCount === 0) return;
      setPage(((index % pageCount) + pageCount) % pageCount);
    },
    [pageCount],
  );

  const prev = useCallback(() => goTo(page - 1), [goTo, page]);
  const next = useCallback(() => goTo(page + 1), [goTo, page]);

  return (
    <div
      className="featured-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="featured-carousel-viewport">
        <div
          className="featured-carousel-track"
          style={{
            transform: `translate3d(-${page * 100}%, 0, 0)`,
            transitionTimingFunction: `cubic-bezier(${easePremium.join(", ")})`,
          }}
          aria-live="polite"
        >
          {pages.map((group, pageIndex) => (
            <ul
              key={`page-${pageIndex}-${group.map((l) => l.id).join("-")}`}
              className={cn(
                "featured-carousel-slide",
                perPage === 3 && "featured-carousel-slide-3",
                perPage === 2 && "featured-carousel-slide-2",
                perPage === 1 && "featured-carousel-slide-1",
              )}
            >
              {group.map((listing) => (
                <li key={listing.id} className="min-h-0">
                  <ListingCard
                    listing={listing}
                    variant="immersive"
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {canSlide ? (
        <>
          <div className="featured-carousel-controls">
            <button
              type="button"
              className="featured-carousel-arrow"
              onClick={prev}
              aria-label="Önceki ilanlar"
            >
              <ChevronLeft className="size-6 stroke-[1.5]" aria-hidden />
            </button>
            <button
              type="button"
              className="featured-carousel-arrow"
              onClick={next}
              aria-label="Sonraki ilanlar"
            >
              <ChevronRight className="size-6 stroke-[1.5]" aria-hidden />
            </button>
          </div>

          <div
            className="featured-carousel-dots"
            role="tablist"
            aria-label="Öne çıkan ilan sayfaları"
          >
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === page}
                aria-label={`Sayfa ${index + 1}`}
                className={cn(
                  "featured-carousel-dot",
                  index === page && "featured-carousel-dot-active",
                )}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
