"use client";

import { useEffect, useMemo, useState } from "react";

import type { HeroBackgroundVideoSource } from "@/features/settings/utils/hero-background-video";
import { buildYouTubeEmbedUrl } from "@/features/settings/utils/hero-background-video";
import { cn } from "@/lib/cn";

type HeroBackgroundVideoProps = {
  source: HeroBackgroundVideoSource;
  title: string;
  className?: string;
};

export function HeroBackgroundVideo({
  source,
  title,
  className,
}: HeroBackgroundVideoProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  const youtubeEmbedUrl = useMemo(() => {
    if (source.kind !== "youtube") return null;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://localhost";
    return buildYouTubeEmbedUrl(source.videoId, origin);
  }, [source]);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    queueMicrotask(() => setReducedMotion(mq.matches));
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showMotionMedia = mounted && !reducedMotion;

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-black", className)}>
      {showMotionMedia ? (
        source.kind === "youtube" && youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            aria-hidden
          />
        ) : source.kind === "file" ? (
          <video
            key={source.src}
            src={source.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
        ) : (
          <div className="home-hero-gradient-fallback absolute inset-0" aria-hidden />
        )
      ) : (
        <div className="home-hero-gradient-fallback absolute inset-0" aria-hidden />
      )}

      <div className="absolute inset-0 bg-black/25" aria-hidden />
    </div>
  );
}
