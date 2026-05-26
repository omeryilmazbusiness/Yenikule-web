import type { ListingFilters } from "@/features/listings/types/listing.types";
import { PAGINATION } from "@/lib/constants";

/** Public /ilanlar — sabit 12 kayıt, site şişmesin */
export function normalizeListingsPageFilters(
  filters: ListingFilters,
): ListingFilters {
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

const LISTING_SORT_VALUES = [
  "newest",
  "price-asc",
  "price-desc",
  "area-desc",
] as const;

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

/** Parse filters from URLSearchParams (client or server). */
export function parseListingFiltersFromSearchParams(
  params: URLSearchParams,
): ListingFilters {
  const filters: ListingFilters = {};

  const search = params.get("search");
  if (search) filters.search = search;

  const category = params.get("category");
  if (category) filters.category = category as ListingFilters["category"];

  const type = params.get("type");
  if (type) filters.type = type as ListingFilters["type"];

  const city = params.get("city");
  if (city) filters.city = city;

  const district = params.get("district");
  if (district) filters.district = district;

  const minPrice = parseNumber(params.get("minPrice"));
  if (minPrice !== undefined) filters.minPrice = minPrice;

  const maxPrice = parseNumber(params.get("maxPrice"));
  if (maxPrice !== undefined) filters.maxPrice = maxPrice;

  const minArea = parseNumber(params.get("minArea"));
  if (minArea !== undefined) filters.minArea = minArea;

  const maxArea = parseNumber(params.get("maxArea"));
  if (maxArea !== undefined) filters.maxArea = maxArea;

  const rooms = params.get("rooms");
  if (rooms) filters.rooms = rooms;

  const isFeatured = parseBoolean(params.get("featured") ?? params.get("isFeatured"));
  if (isFeatured !== undefined) filters.isFeatured = isFeatured;

  const sort = params.get("sort");
  if (sort && LISTING_SORT_VALUES.includes(sort as (typeof LISTING_SORT_VALUES)[number])) {
    filters.sort = sort as ListingFilters["sort"];
  }

  const page = parseNumber(params.get("page"));
  if (page !== undefined) filters.page = page;

  return filters;
}

/** Serialize filters to URL query string params. */
export function listingFiltersToSearchParams(
  filters: ListingFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.type) params.set("type", filters.type);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minArea !== undefined) params.set("minArea", String(filters.minArea));
  if (filters.maxArea !== undefined) params.set("maxArea", String(filters.maxArea));
  if (filters.rooms) params.set("rooms", filters.rooms);
  if (filters.isFeatured) params.set("featured", "true");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params;
}

/** Next.js App Router `searchParams` object → ListingFilters (server-safe). */
export function parseListingFiltersFromPageSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ListingFilters {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  return parseListingFiltersFromSearchParams(params);
}
