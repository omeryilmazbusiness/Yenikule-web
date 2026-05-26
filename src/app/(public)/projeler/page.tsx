import { Suspense } from "react";

import { PageShell } from "@/components/layout/PageShell";
import { ProjectActiveFilters } from "@/components/projects/ProjectActiveFilters";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectsMobileStickyToolbar } from "@/components/projects/ProjectsMobileStickyToolbar";
import { ProjectPagination } from "@/components/projects/ProjectPagination";
import { ProjectsResultsHeader } from "@/components/projects/ProjectsResultsHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { projectService } from "@/features/projects/services/project.service";
import {
  normalizeProjectsPageFilters,
  parseProjectFiltersFromPageSearchParams,
} from "@/features/projects/utils/project-search-params";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";

export const metadata = createPageMetadata({
  title: "Projeler",
  description: "Yeni Kule İnşaat konut, ticari ve karma kullanımlı projeleri.",
  path: routes.projects.index,
});

type ProjectsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function ProjectsContent({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const filters = normalizeProjectsPageFilters(
    parseProjectFiltersFromPageSearchParams(searchParams),
  );
  const { items, total, page, totalPages } = await projectService.getAll(filters);

  return (
    <>
      <div className="listings-mobile-sticky-head lg:hidden">
        <ProjectsMobileStickyToolbar />
      </div>

      <div className="listings-page-layout">
        <ProjectFilters />

        <div id="projects-results" className="listings-page-main">
          <ProjectsResultsHeader total={total} page={page} totalPages={totalPages} />
          <ProjectActiveFilters className="hidden sm:flex" />
          <ProjectGrid projects={items} />
          <ProjectPagination page={page} totalPages={totalPages} total={total} />
        </div>
      </div>
    </>
  );
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <PageShell
      eyebrow="Projeler"
      title="Projelerimiz"
      description="İstanbul'da geliştirdiğimiz konut ve ticari projeleri keşfedin."
      className="listings-page-shell"
    >
      <Suspense
        fallback={
          <div className="listings-page-layout">
            <Skeleton className="hidden h-[28rem] w-full max-w-[19rem] shrink-0 rounded-[1.25rem] lg:block" />
            <div className="listings-page-main space-y-4">
              <Skeleton className="h-10 w-48 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-xl lg:hidden" />
              <div className="listings-list">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[5.5rem] rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <ProjectsContent searchParams={resolvedSearchParams} />
      </Suspense>
    </PageShell>
  );
}
