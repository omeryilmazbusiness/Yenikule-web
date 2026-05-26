import Link from "next/link";
import { ChevronRight, Layers, MapPin } from "lucide-react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import {
  formatProjectAvailability,
  formatProjectLocation,
  formatProjectTimeline,
  getProjectStatusLabel,
} from "@/features/projects/utils/project-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { IMAGE_PLACEHOLDERS, sanitizeImageUrl } from "@/lib/images";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type ProjectListRowProps = {
  project: Project;
  className?: string;
};

export function ProjectListRow({ project, className }: ProjectListRowProps) {
  const href = routes.projects.detail(project.slug);
  const imageSrc = sanitizeImageUrl(project.coverImage, IMAGE_PLACEHOLDERS.project);

  return (
    <Link href={href} className={cn("listing-list-row", className)}>
      <div className="listing-list-row-media">
        <OptimizedImage
          src={imageSrc}
          alt={project.title}
          aspectRatio="1/1"
          rounded={false}
          className="listing-list-row-image"
          sizes="112px"
          fallbackSrc={IMAGE_PLACEHOLDERS.project}
        />
        {project.isFeatured ? (
          <span className="listing-list-row-featured">Öne Çıkan</span>
        ) : null}
      </div>

      <div className="listing-list-row-body">
        <div className="listing-list-row-badges">
          <span className="listing-list-row-badge listing-list-row-badge-sale">
            {getProjectStatusLabel(project.status)}
          </span>
          <span className="listing-list-row-badge listing-list-row-badge-muted">
            {project.name}
          </span>
        </div>

        <h3 className="listing-list-row-title">{project.title}</h3>

        <p className="listing-list-row-meta">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{formatProjectLocation(project)}</span>
        </p>

        <p className="listing-list-row-meta">
          <Layers className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{formatProjectTimeline(project)}</span>
        </p>

        <p className="listing-list-row-price">{formatProjectAvailability(project)}</p>
      </div>

      <ChevronRight className="listing-list-row-chevron" aria-hidden />
    </Link>
  );
}
