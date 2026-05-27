"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Project } from "@/features/projects/types/project.types";
import { cn } from "@/lib/cn";

const AUTO_MS = 4800;

type HomeProjectsMobileSliderProps = {
  projects: Project[];
};

export function HomeProjectsMobileSlider({ projects }: HomeProjectsMobileSliderProps) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = projects.length;
  const canSlide = count > 1;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    queueMicrotask(() => setActive(0));
  }, [count]);

  useEffect(() => {
    if (!canSlide || paused || reduceMotion) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [canSlide, paused, count, reduceMotion]);

  if (count === 0) return null;

  return (
    <div
      className="home-projects-slider"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="home-projects-slider-viewport">
        <ul
          className="home-projects-slider-track"
          style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}
          aria-live="polite"
        >
          {projects.map((project) => (
            <li key={project.id} className="home-projects-slider-slide">
              <ProjectCard project={project} variant="immersive" className="h-full" />
            </li>
          ))}
        </ul>
      </div>

      {canSlide ? (
        <div
          className="home-projects-slider-dots"
          role="tablist"
          aria-label="Proje slaytları"
        >
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`${project.title} — slayt ${index + 1}`}
              className={cn(
                "home-projects-slider-dot",
                index === active && "home-projects-slider-dot-active",
              )}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
