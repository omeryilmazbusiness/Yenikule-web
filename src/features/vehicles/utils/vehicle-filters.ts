import type { Vehicle, VehicleFilters } from "@/features/vehicles/types/vehicle.types";

export function applyVehicleFilters(
  vehicles: Vehicle[],
  filters: VehicleFilters = {},
): Vehicle[] {
  let result = [...vehicles];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    result = result.filter((v) => v.category === filters.category);
  }

  if (filters.status) {
    result = result.filter((v) => v.status === filters.status);
  } else {
    result = result.filter((v) => v.status === "aktif" || v.status === "rezerve");
  }

  if (filters.brand) {
    result = result.filter(
      (v) => v.brand.toLowerCase() === filters.brand!.toLowerCase(),
    );
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((v) => v.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((v) => v.price <= filters.maxPrice!);
  }

  if (filters.minYear !== undefined) {
    result = result.filter((v) => v.year >= filters.minYear!);
  }

  if (filters.maxYear !== undefined) {
    result = result.filter((v) => v.year <= filters.maxYear!);
  }

  if (filters.maxMileage !== undefined) {
    result = result.filter((v) => v.mileage <= filters.maxMileage!);
  }

  if (filters.fuelType) {
    result = result.filter((v) => v.fuelType === filters.fuelType);
  }

  if (filters.transmission) {
    result = result.filter((v) => v.transmission === filters.transmission);
  }

  if (filters.isFeatured !== undefined) {
    result = result.filter((v) => v.isFeatured === filters.isFeatured);
  }

  return sortVehicles(result, filters.sort ?? "newest");
}

export function sortVehicles(
  vehicles: Vehicle[],
  sort: NonNullable<VehicleFilters["sort"]>,
): Vehicle[] {
  const sorted = [...vehicles];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export function paginateVehicles<T>(
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
