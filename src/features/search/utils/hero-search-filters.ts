import type {
  SearchEntityType,
  SearchIndexItem,
} from "@/features/search/types/search.types";

export type HeroSearchFilters = {
  types: SearchEntityType[];
  listingType: "all" | "satilik" | "kiralik";
  featuredOnly: boolean;
};

export const DEFAULT_HERO_SEARCH_FILTERS: HeroSearchFilters = {
  types: ["listing", "project", "vehicle"],
  listingType: "all",
  featuredOnly: false,
};

export function applyHeroSearchFilters(
  items: SearchIndexItem[],
  filters: HeroSearchFilters,
): SearchIndexItem[] {
  return items.filter((item) => {
    if (!filters.types.includes(item.type)) return false;
    if (filters.featuredOnly && !item.isFeatured) return false;
    if (
      filters.listingType !== "all" &&
      item.type === "listing" &&
      item.listingType !== filters.listingType
    ) {
      return false;
    }
    return true;
  });
}

export function countActiveHeroSearchFilters(filters: HeroSearchFilters): number {
  let count = 0;
  if (filters.types.length < 3) count += 1;
  if (filters.listingType !== "all") count += 1;
  if (filters.featuredOnly) count += 1;
  return count;
}
