import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatProjectAvailability,
  formatProjectLocation,
  formatProjectTimeline,
  getProjectStatusLabel,
} from "@/features/projects/utils/project-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { Container } from "@/components/common/Container";

type ProjectDetailHeroProps = {
  project: Project;
};

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  return (
    <div className="border-b border-border bg-card">
      <Container className="py-8 md:py-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{getProjectStatusLabel(project.status)}</Badge>
          {project.isFeatured && <Badge>Öne Çıkan</Badge>}
        </div>

        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-primary">
          {project.name}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {project.title}
        </h1>

        <p className="mt-3 flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          {formatProjectLocation(project)}
        </p>

        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          {project.shortDescription}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-8">
          <p className="font-semibold text-foreground">
            {formatProjectAvailability(project)}
          </p>
          <p className="text-muted-foreground">{formatProjectTimeline(project)}</p>
        </div>
      </Container>
    </div>
  );
}
