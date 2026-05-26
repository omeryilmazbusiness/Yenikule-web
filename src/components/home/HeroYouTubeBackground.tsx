"use client";

import { useEffect, useState } from "react";

import { HERO_YOUTUBE_VIDEO_ID } from "@/data/home/hero-video";
import { cn } from "@/lib/cn";

function buildEmbedUrl(videoId: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    showinfo: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    enablejsapi: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    cc_load_policy: "0",
    origin:
      typeof window !== "undefined" ? window.location.origin : "https://localhost",
  });

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

type HeroYouTubeBackgroundProps = {
  className?: string;
};

export function HeroYouTubeBackground({ className }: HeroYouTubeBackgroundProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-black", className)}>
      {mounted && !reducedMotion ? (
        <iframe
          src={buildEmbedUrl(HERO_YOUTUBE_VIDEO_ID)}
          title="Yeni Kule İnşaat tanıtım videosu"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          aria-hidden
        />
      ) : (
        <div
          className="home-hero-gradient-fallback absolute inset-0"
          aria-hidden
        />
      )}

      {/* YouTube chrome gizleme + kontrast */}
      <div
        className="absolute inset-0 bg-black/25"
        aria-hidden
      />
    </div>
  );
}
