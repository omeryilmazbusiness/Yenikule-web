import Link from "next/link";
import { ArrowUpRight, MapPin, Layers } from "lucide-react";

import { ImmersiveCardShell } from "@/components/common/ImmersiveCardShell";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatProjectAvailability,
  formatProjectLocation,
  formatProjectTimeline,
} from "@/features/projects/utils/project-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { IMAGE_PLACEHOLDERS, sanitizeImageUrl } from "@/lib/images";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type ProjectCardProps = {
  project: Project;
  className?: string;
  variant?: "default" | "immersive";
};

export function ProjectCard({
  project,
  className,
  variant = "default",
}: ProjectCardProps) {
  const href = routes.projects.detail(project.slug);
  const cover = sanitizeImageUrl(project.coverImage, IMAGE_PLACEHOLDERS.project);

  if (variant === "immersive") {
    return (
      <ImmersiveCardShell
        href={href}
        imageSrc={cover}
        imageAlt={project.title}
        fallbackSrc={IMAGE_PLACEHOLDERS.project}
        title={project.title}
        className={className}
        eyebrow={project.name}
        badges={
          <>
            <StatusBadge status={project.status} type="project" />
            {project.isFeatured ? (
              <Badge variant="featured">Öne Çıkan</Badge>
            ) : null}
          </>
        }
        meta={
          <div className="immersive-card-meta-rows">
            <p className="immersive-card-meta-row">
              <span className="immersive-card-meta-icon" aria-hidden>
                <MapPin className="size-3.5" />
              </span>
              <span className="line-clamp-1">{formatProjectLocation(project)}</span>
            </p>
            <p className="immersive-card-meta-row">
              <span className="immersive-card-meta-icon" aria-hidden>
                <Layers className="size-3.5" />
              </span>
              <span className="line-clamp-2">{project.shortDescription}</span>
            </p>
          </div>
        }
        footer={
          <>
            <div className="min-w-0">
              <p className="immersive-card-price text-base md:text-lg">
                {formatProjectAvailability(project)}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/65">
                {formatProjectTimeline(project)}
              </p>
            </div>
            <div className="immersive-card-actions">
              <Link
                href={href}
                className="immersive-card-icon-btn"
                aria-label="Proje detayı"
              >
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </>
        }
      />
    );
  }

  return (
    <article
      className={cn(
        "soft-card soft-card-lift group flex h-full flex-col",
        className,
      )}
    >
      <Link href={href} className="relative block overflow-hidden">
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={cover}
            alt={project.title}
            aspectRatio="16/9"
            rounded={false}
            className="transition-premium-slow group-hover:scale-[1.04] motion-reduce:transform-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            fallbackSrc={IMAGE_PLACEHOLDERS.project}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-premium group-hover:opacity-100 motion-reduce:opacity-0"
            aria-hidden
          />
        </div>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatusBadge status={project.status} type="project" />
          {project.isFeatured ? (
            <Badge variant="featured">Öne Çıkan</Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="section-eyebrow mb-2.5 text-[10px]">{project.name}</p>
        <Link href={href}>
          <h3 className="font-heading line-clamp-2 text-lg font-medium leading-snug text-foreground transition-premium group-hover:text-bronze md:text-xl">
            {project.title}
          </h3>
        </Link>

        <p className="mt-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 opacity-70" aria-hidden />
          <span className="line-clamp-1">{formatProjectLocation(project)}</span>
        </p>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground/90">
          {project.shortDescription}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/50 pt-5 transition-premium group-hover:border-border">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-foreground">
              {formatProjectAvailability(project)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatProjectTimeline(project)}
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="shrink-0 transition-premium"
          >
            <Link href={href}>
              Detay
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
