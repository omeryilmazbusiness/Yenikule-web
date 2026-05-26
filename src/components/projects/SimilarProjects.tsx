import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { projectService } from "@/features/projects/services/project.service";
import type { Project } from "@/features/projects/types/project.types";
import { routes } from "@/lib/routes";

type SimilarProjectsProps = {
  project: Project;
  limit?: number;
};

export async function SimilarProjects({ project, limit = 3 }: SimilarProjectsProps) {
  const { items } = await projectService.getAll({
    district: project.district,
    pageSize: limit + 1,
  });

  const similar = items.filter((item) => item.id !== project.id).slice(0, limit);

  if (similar.length === 0) {
    return null;
  }

  return (
    <Section background="muted">
      <Container>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              Benzer Projeler
            </h2>
            <p className="mt-2 text-muted-foreground">
              Aynı bölgedeki diğer Yeni Kule projeleri
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={routes.projects.index}>
              Tüm Projeler
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <ul className="listings-grid">
          {similar.map((item) => (
            <li key={item.id} className="min-h-0">
              <ProjectCard project={item} variant="immersive" className="h-full" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
