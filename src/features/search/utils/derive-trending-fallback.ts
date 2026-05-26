import type { SearchIndexItem } from "@/features/search/types/search.types";
import { normalizeSearchText } from "@/features/search/utils/normalize-search-text";

function incrementCount(
  counts: Map<string, { display: string; count: number }>,
  term: string,
) {
  const trimmed = term.trim();
  if (trimmed.length < 2) return;

  const key = normalizeSearchText(trimmed);
  const existing = counts.get(key);
  if (existing) {
    existing.count += 1;
    return;
  }

  counts.set(key, { display: trimmed, count: 1 });
}

function topTermsFromCounts(
  counts: Map<string, { display: string; count: number }>,
  limit: number,
): string[] {
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.display.localeCompare(b.display, "tr"))
    .slice(0, limit)
    .map((entry) => entry.display);
}

/** Analitik verisi yokken portföyden önerilen arama terimleri */
export function deriveTrendingFallbackFromIndex(
  index: SearchIndexItem[],
  limit = 4,
): string[] {
  const counts = new Map<string, { display: string; count: number }>();

  for (const item of index) {
    if (item.type === "vehicle") {
      const brand = item.title.split(/\s+/)[0];
      incrementCount(counts, brand ?? item.title);
      continue;
    }

    const districtMatch = item.subtitle.match(/,\s*([^·]+)\s*·/);
    if (districtMatch?.[1]) {
      incrementCount(counts, districtMatch[1].trim());
    }

    if (item.listingType === "satilik") {
      incrementCount(counts, "Satılık daire");
    } else if (item.listingType === "kiralik") {
      incrementCount(counts, "Kiralık daire");
    }
  }

  return topTermsFromCounts(counts, limit);
}
