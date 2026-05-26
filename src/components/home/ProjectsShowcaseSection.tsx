"use client";

import Link from "next/link";
import { ArrowUpRight, Layers, MapPin } from "lucide-react";

import { ImmersiveCardShell } from "@/components/common/ImmersiveCardShell";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { MotionInView, MotionItem } from "@/components/common/MotionInView";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  formatProjectAvailability,
  formatProjectLocation,
  formatProjectTimeline,
} from "@/features/projects/utils/project-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { IMAGE_PLACEHOLDERS, sanitizeImageUrl } from "@/lib/images";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type ProjectsShowcaseSectionProps = {
  featured: Project | null;
  rest: Project[];
};

function FeaturedProjectCard({ project }: { project: Project }) {
  const href = routes.projects.detail(project.slug);
  const cover = sanitizeImageUrl(project.coverImage, IMAGE_PLACEHOLDERS.project);

  return (
    <ImmersiveCardShell
      href={href}
      imageSrc={cover}
      imageAlt={project.title}
      fallbackSrc={IMAGE_PLACEHOLDERS.project}
      sizes="(max-width: 1024px) 100vw, 66vw"
      title={project.title}
      size="featured"
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
            <span>{formatProjectLocation(project)}</span>
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
              aria-label="Projeyi incele"
            >
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </>
      }
    />
  );
}

export function ProjectsShowcaseSection({
  featured,
  rest,
}: ProjectsShowcaseSectionProps) {
  const hasGrid = rest.length > 0;

  return (
    <div className="space-y-10 md:space-y-12">
      <MotionInView stagger={false}>
        <SectionHeader
          eyebrow="Projeler"
          title="Yeni Kule İmzası Taşıyan Projeler"
          subtitle="Modern mimari, doğru lokasyon ve güvenilir teslim anlayışıyla geliştirilen projeler."
          action={{
            href: routes.projects.index,
            label: "Tüm Projeler",
          }}
        />
      </MotionInView>

      <MotionInView
        as="ul"
        className={cn(
          "list-none p-0 m-0 grid gap-6 md:gap-7",
          hasGrid && "lg:grid-cols-2",
        )}
      >
        {featured ? (
          <MotionItem as="li" className={hasGrid ? "lg:col-span-2" : undefined}>
            <FeaturedProjectCard project={featured} />
          </MotionItem>
        ) : null}
        {rest.map((project) => (
          <MotionItem key={project.id} as="li">
            <ProjectCard project={project} variant="immersive" />
          </MotionItem>
        ))}
      </MotionInView>
    </div>
  );
}
