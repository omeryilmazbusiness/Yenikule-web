import type {
  GroupedSearchResults,
  SearchHit,
  SearchIndexItem,
} from "@/features/search/types/search.types";
import type { HeroSearchFilters } from "@/features/search/utils/hero-search-filters";
import { applyHeroSearchFilters } from "@/features/search/utils/hero-search-filters";
import {
  normalizeSearchText,
  tokenizeSearchQuery,
} from "@/features/search/utils/normalize-search-text";

type QueryOptions = {
  limitPerType?: number;
  filters?: HeroSearchFilters;
};

function scoreItem(item: SearchIndexItem, tokens: string[], fullQuery: string): number {
  let score = 0;
  const title = normalizeSearchText(item.title);

  if (title === fullQuery) score += 200;
  else if (title.startsWith(fullQuery)) score += 120;
  else if (title.includes(fullQuery)) score += 80;

  for (const token of tokens) {
    if (title.startsWith(token)) score += 40;
    else if (title.includes(token)) score += 25;
    if (item.searchText.includes(token)) score += 8;
  }

  if (item.type === "listing") score += 2;
  return score;
}

function groupHits(hits: SearchHit[], limitPerType: number): GroupedSearchResults {
  const listings = hits.filter((h) => h.item.type === "listing").slice(0, limitPerType);
  const projects = hits.filter((h) => h.item.type === "project").slice(0, limitPerType);
  const vehicles = hits.filter((h) => h.item.type === "vehicle").slice(0, limitPerType);

  return {
    listings,
    projects,
    vehicles,
    total: listings.length + projects.length + vehicles.length,
  };
}

export function querySearchIndex(
  items: SearchIndexItem[],
  rawQuery: string,
  options: QueryOptions = {},
): GroupedSearchResults {
  const limitPerType = options.limitPerType ?? 5;
  const fullQuery = normalizeSearchText(rawQuery);
  const tokens = tokenizeSearchQuery(rawQuery);
  const pool = options.filters ? applyHeroSearchFilters(items, options.filters) : items;

  if (!fullQuery || tokens.length === 0) {
    return { listings: [], projects: [], vehicles: [], total: 0 };
  }

  const hits: SearchHit[] = [];

  for (const item of pool) {
    const matchesAll = tokens.every((token) => item.searchText.includes(token));
    if (!matchesAll) continue;
    hits.push({ item, score: scoreItem(item, tokens, fullQuery) });
  }

  hits.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "tr"));

  return groupHits(hits, limitPerType);
}

export function countSearchMatches(
  items: SearchIndexItem[],
  rawQuery: string,
  filters?: HeroSearchFilters,
): number {
  const tokens = tokenizeSearchQuery(rawQuery);
  if (tokens.length === 0) return 0;

  const pool = filters ? applyHeroSearchFilters(items, filters) : items;

  return pool.filter((item) =>
    tokens.every((token) => item.searchText.includes(token)),
  ).length;
}
