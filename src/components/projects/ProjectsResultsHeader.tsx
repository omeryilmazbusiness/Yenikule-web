"use client";

import { Loader2 } from "lucide-react";

import { ProjectActiveFilters } from "@/components/projects/ProjectActiveFilters";
import { useProjectFilters } from "@/components/projects/use-project-filters";

type ProjectsResultsHeaderProps = {
  total: number;
  page: number;
  totalPages: number;
};

export function ProjectsResultsHeader({
  total,
  page,
  totalPages,
}: ProjectsResultsHeaderProps) {
  const { isPending } = useProjectFilters();

  return (
    <div className="listings-results-header">
      <div className="flex items-center gap-2">
        {isPending ? (
          <Loader2
            className="size-4 shrink-0 animate-spin text-bronze"
            aria-hidden
          />
        ) : null}
        <p className="listings-results-count">
          <span className="font-semibold text-foreground">{total}</span> proje
          {totalPages > 1 ? (
            <span className="text-muted-foreground">
              {" "}
              · Sayfa {page}/{totalPages}
            </span>
          ) : null}
        </p>
      </div>
      <ProjectActiveFilters className="hidden sm:flex" />
    </div>
  );
}
