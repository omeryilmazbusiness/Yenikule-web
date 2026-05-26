import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectListRow } from "@/components/projects/ProjectListRow";
import { cn } from "@/lib/cn";
import type { Project } from "@/features/projects/types/project.types";

type ProjectGridProps = {
  projects: Project[];
  className?: string;
  emptyMessage?: string;
  variant?: "default" | "immersive";
};

export function ProjectGrid({
  projects,
  className,
  emptyMessage = "Arama kriterlerinize uygun proje bulunamadı. Filtreleri genişletmeyi deneyin.",
  variant = "immersive",
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className={cn("listings-empty", className)}>
        <p className="font-heading text-xl font-medium text-foreground">
          Proje bulunamadı
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className={cn("listings-list", className)} aria-label="Proje listesi">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectListRow project={project} />
          </li>
        ))}
      </ul>

      <ul className={cn("listings-grid", className)} aria-label="Proje kartları">
        {projects.map((project) => (
          <li key={project.id} className="min-h-0">
            <ProjectCard project={project} variant={variant} className="h-full" />
          </li>
        ))}
      </ul>
    </>
  );
}
