import type { Project, ProjectFilters } from "@/features/projects/types/project.types";

export function applyProjectFilters(
  projects: Project[],
  filters: ProjectFilters = {},
): Project[] {
  let result = [...projects];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q),
    );
  }

  if (filters.status) {
    result = result.filter((p) => p.status === filters.status);
  }

  if (filters.city) {
    result = result.filter(
      (p) => p.city.toLowerCase() === filters.city!.toLowerCase(),
    );
  }

  if (filters.district) {
    result = result.filter(
      (p) => p.district.toLowerCase() === filters.district!.toLowerCase(),
    );
  }

  if (filters.isFeatured !== undefined) {
    result = result.filter((p) => p.isFeatured === filters.isFeatured);
  }

  return sortProjects(result, filters.sort ?? "newest");
}

export function sortProjects(
  projects: Project[],
  sort: NonNullable<ProjectFilters["sort"]>,
): Project[] {
  const sorted = [...projects];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export function paginateProjects<T>(
  items: T[],
  page = 1,
  pageSize = 12,
): { items: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
