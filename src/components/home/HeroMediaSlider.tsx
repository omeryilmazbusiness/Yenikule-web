"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  HERO_POSTER_FALLBACK,
  HERO_SLIDE_INTERVAL_MS,
  heroSlides,
  type HeroSlide,
} from "@/data/home/hero-slides";
import { cn } from "@/lib/cn";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    queueMicrotask(() => setMatches(mq.matches));
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

type SlideMediaProps = {
  slide: HeroSlide;
  isActive: boolean;
  preferPoster: boolean;
};

function SlideMedia({ slide, isActive, preferPoster }: SlideMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [posterSrc, setPosterSrc] = useState(slide.poster);

  useEffect(() => {
    queueMicrotask(() => {
      setMediaFailed(false);
      setPosterSrc(slide.poster);
    });
  }, [slide.id, slide.poster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || slide.type !== "video" || preferPoster || mediaFailed) return;

    if (isActive) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          /* Autoplay blocked */
        });
      }
    } else {
      video.pause();
    }
  }, [isActive, mediaFailed, preferPoster, slide.type]);

  if (mediaFailed) {
    return <div className="home-hero-gradient-fallback absolute inset-0 size-full" />;
  }

  const showVideo =
    slide.type === "video" && isActive && !preferPoster;

  if (showVideo) {
    return (
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
        onError={() => setMediaFailed(true)}
        aria-hidden
      >
        <source src={slide.src} type="video/mp4" />
      </video>
    );
  }

  const imageSrc =
    slide.type === "image" && !preferPoster ? slide.src : posterSrc;

  return (
    <Image
      src={imageSrc}
      alt=""
      fill
      priority={isActive}
      sizes="100vw"
      className="object-cover"
      onError={() => {
        if (posterSrc !== HERO_POSTER_FALLBACK) {
          setPosterSrc(HERO_POSTER_FALLBACK);
          return;
        }
        setMediaFailed(true);
      }}
      aria-hidden
    />
  );
}

export function HeroMediaSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  }, []);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (reducedMotion) return;

    intervalRef.current = setInterval(goNext, HERO_SLIDE_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, reducedMotion]);

  const pauseAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resumeAutoPlay = () => {
    if (reducedMotion || intervalRef.current) return;
    intervalRef.current = setInterval(goNext, HERO_SLIDE_INTERVAL_MS);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      onFocus={pauseAutoPlay}
      onBlur={resumeAutoPlay}
    >
      <div className="home-hero-gradient-fallback absolute inset-0" aria-hidden />

      {heroSlides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none",
              isActive ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={!isActive}
          >
            <SlideMedia
              slide={slide}
              isActive={isActive}
              preferPoster={isMobile || reducedMotion}
            />
          </div>
        );
      })}

      <div
        className="absolute bottom-28 left-1/2 z-[2] flex -translate-x-1/2 gap-2 md:bottom-32"
        role="tablist"
        aria-label="Hero slayt göstergeleri"
      >
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`${slide.label} slaytı`}
            onClick={() => goTo(index)}
            className={cn(
              "h-2.5 min-w-[2.5rem] rounded-full transition-all duration-300",
              index === activeIndex
                ? "bg-bronze-soft"
                : "bg-white/35 hover:bg-white/55",
            )}
          />
        ))}
      </div>
    </div>
  );
}
