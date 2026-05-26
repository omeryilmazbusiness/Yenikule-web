import type { ProjectFilters } from "@/features/projects/types/project.types";
import { PAGINATION } from "@/lib/constants";

const PROJECT_SORT_VALUES = ["newest", "name-asc"] as const;

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

export function parseProjectFiltersFromSearchParams(
  params: URLSearchParams,
): ProjectFilters {
  const filters: ProjectFilters = {};

  const search = params.get("search");
  if (search) filters.search = search;

  const status = params.get("status");
  if (status) filters.status = status as ProjectFilters["status"];

  const city = params.get("city");
  if (city) filters.city = city;

  const district = params.get("district");
  if (district) filters.district = district;

  const isFeatured = parseBoolean(params.get("featured") ?? params.get("isFeatured"));
  if (isFeatured !== undefined) filters.isFeatured = isFeatured;

  const sort = params.get("sort");
  if (sort && PROJECT_SORT_VALUES.includes(sort as (typeof PROJECT_SORT_VALUES)[number])) {
    filters.sort = sort as ProjectFilters["sort"];
  }

  const page = parseNumber(params.get("page"));
  if (page !== undefined) filters.page = page;

  return filters;
}

export function projectFiltersToSearchParams(
  filters: ProjectFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.isFeatured) params.set("featured", "true");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params;
}

export function normalizeProjectsPageFilters(
  filters: ProjectFilters,
): ProjectFilters {
  const page =
    filters.page !== undefined && filters.page > 0
      ? Math.floor(filters.page)
      : 1;

  return {
    ...filters,
    page,
    pageSize: PAGINATION.defaultPageSize,
  };
}

export function parseProjectFiltersFromPageSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ProjectFilters {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  return parseProjectFiltersFromSearchParams(params);
}
