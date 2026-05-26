import type { Listing, ListingFilters } from "@/features/listings/types/listing.types";

export function applyListingFilters(
  listings: Listing[],
  filters: ListingFilters = {},
): Listing[] {
  let result = [...listings];

  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.district.toLowerCase().includes(q) ||
        l.neighborhood.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    result = result.filter((l) => l.category === filters.category);
  }

  if (filters.type) {
    result = result.filter((l) => l.type === filters.type);
  }

  if (filters.status) {
    result = result.filter((l) => l.status === filters.status);
  } else if (!filters.includeAllStatuses) {
    result = result.filter((l) => l.status === "aktif" || l.status === "rezerve");
  }

  if (filters.city) {
    result = result.filter(
      (l) => l.city.toLowerCase() === filters.city!.toLowerCase(),
    );
  }

  if (filters.district) {
    result = result.filter(
      (l) => l.district.toLowerCase() === filters.district!.toLowerCase(),
    );
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((l) => l.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((l) => l.price <= filters.maxPrice!);
  }

  if (filters.minArea !== undefined) {
    result = result.filter((l) => l.area >= filters.minArea!);
  }

  if (filters.maxArea !== undefined) {
    result = result.filter((l) => l.area <= filters.maxArea!);
  }

  if (filters.rooms) {
    result = result.filter((l) => l.rooms === filters.rooms);
  }

  if (filters.isFeatured !== undefined) {
    result = result.filter((l) => l.isFeatured === filters.isFeatured);
  }

  if (filters.projectId) {
    result = result.filter((l) => l.projectId === filters.projectId);
  }

  return sortListings(result, filters.sort ?? "newest");
}

export function sortListings(
  listings: Listing[],
  sort: NonNullable<ListingFilters["sort"]>,
): Listing[] {
  const sorted = [...listings];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "area-desc":
      return sorted.sort((a, b) => b.area - a.area);
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}

export function paginateListings<T>(
  items: T[],
  page = 1,
  pageSize = 12,
): { items: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
