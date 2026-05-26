import type { VehicleFilters } from "@/features/vehicles/types/vehicle.types";
import { PAGINATION } from "@/lib/constants";

export function normalizeVehiclePageFilters(
  filters: VehicleFilters,
): VehicleFilters {
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

const VEHICLE_SORT_VALUES = ["newest", "price-asc", "price-desc"] as const;

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

export function parseVehicleFiltersFromSearchParams(
  params: URLSearchParams,
): VehicleFilters {
  const filters: VehicleFilters = {};

  const search = params.get("search");
  if (search) filters.search = search;

  const category = params.get("category");
  if (category) filters.category = category as VehicleFilters["category"];

  const brand = params.get("brand");
  if (brand) filters.brand = brand;

  const minPrice = parseNumber(params.get("minPrice"));
  if (minPrice !== undefined) filters.minPrice = minPrice;

  const maxPrice = parseNumber(params.get("maxPrice"));
  if (maxPrice !== undefined) filters.maxPrice = maxPrice;

  const minYear = parseNumber(params.get("minYear"));
  if (minYear !== undefined) filters.minYear = minYear;

  const maxYear = parseNumber(params.get("maxYear"));
  if (maxYear !== undefined) filters.maxYear = maxYear;

  const maxMileage = parseNumber(params.get("maxMileage"));
  if (maxMileage !== undefined) filters.maxMileage = maxMileage;

  const fuelType = params.get("fuelType");
  if (fuelType) filters.fuelType = fuelType as VehicleFilters["fuelType"];

  const transmission = params.get("transmission");
  if (transmission) {
    filters.transmission = transmission as VehicleFilters["transmission"];
  }

  const isFeatured = parseBoolean(params.get("featured") ?? params.get("isFeatured"));
  if (isFeatured !== undefined) filters.isFeatured = isFeatured;

  const sort = params.get("sort");
  if (sort && VEHICLE_SORT_VALUES.includes(sort as (typeof VEHICLE_SORT_VALUES)[number])) {
    filters.sort = sort as VehicleFilters["sort"];
  }

  const page = parseNumber(params.get("page"));
  if (page !== undefined) filters.page = page;

  return filters;
}

export function vehicleFiltersToSearchParams(
  filters: VehicleFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
  if (filters.minYear !== undefined) params.set("minYear", String(filters.minYear));
  if (filters.maxYear !== undefined) params.set("maxYear", String(filters.maxYear));
  if (filters.maxMileage !== undefined) params.set("maxMileage", String(filters.maxMileage));
  if (filters.fuelType) params.set("fuelType", filters.fuelType);
  if (filters.transmission) params.set("transmission", filters.transmission);
  if (filters.isFeatured) params.set("featured", "true");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  return params;
}

export function parseVehicleFiltersFromPageSearchParams(
  raw: Record<string, string | string[] | undefined>,
): VehicleFilters {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (key === "segment") continue;
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  return parseVehicleFiltersFromSearchParams(params);
}
