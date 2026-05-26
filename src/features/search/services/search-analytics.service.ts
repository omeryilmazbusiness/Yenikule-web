import { searchAnalyticsRepository } from "@/features/search/repositories/search-analytics.repository";
import { searchService } from "@/features/search/services/search.service";
import { deriveTrendingFallbackFromIndex } from "@/features/search/utils/derive-trending-fallback";
import { normalizeSearchText } from "@/features/search/utils/normalize-search-text";

const TRENDING_DAYS = 7;
const TRENDING_LIMIT = 4;

export const searchAnalyticsService = {
  async recordSearch(term: string): Promise<void> {
    const trimmed = term.trim();
    if (normalizeSearchText(trimmed).length < 2) return;
    await searchAnalyticsRepository.record(trimmed);
  },

  async getTrendingSearches(limit = TRENDING_LIMIT): Promise<string[]> {
    return searchAnalyticsRepository.getTopTerms({
      days: TRENDING_DAYS,
      limit,
    });
  },

  /** Son 7 günün en çok arananları; eksikse portföyden tamamlar */
  async getTrendingForHero(limit = TRENDING_LIMIT): Promise<string[]> {
    const [trending, index] = await Promise.all([
      this.getTrendingSearches(limit),
      searchService.getPublicIndex(),
    ]);

    if (trending.length >= limit) {
      return trending.slice(0, limit);
    }

    const fallback = deriveTrendingFallbackFromIndex(index, limit);
    const seen = new Set(trending.map((term) => normalizeSearchText(term)));
    const merged = [...trending];

    for (const term of fallback) {
      if (merged.length >= limit) break;
      const key = normalizeSearchText(term);
      if (seen.has(key)) continue;
      merged.push(term);
      seen.add(key);
    }

    return merged.slice(0, limit);
  },
};
