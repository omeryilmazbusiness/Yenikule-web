import {
  HAREM_GOLD_API_URL,
  HAREM_GOLD_SOURCE_URL,
} from "@/features/market/data/harem-gold-symbols";
import type { HaremGoldTickerSnapshot } from "@/features/market/types/harem-gold.types";
import { fetchGenelParaGoldSnapshot } from "@/features/market/services/genelpara-gold.service";
import { parseHaremGoldPayload } from "@/features/market/utils/parse-harem-gold";

const HAREM_FETCH_HEADERS = {
  Accept: "application/json, text/plain, */*",
  "X-Requested-With": "XMLHttpRequest",
  Referer: HAREM_GOLD_SOURCE_URL,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
} as const;

const CACHE_TTL_MS = 30_000;

let memoryCache: {
  snapshot: HaremGoldTickerSnapshot;
  expiresAt: number;
} | null = null;

async function fetchHaremPayload(): Promise<unknown | null> {
  const response = await fetch(HAREM_GOLD_API_URL, {
    headers: HAREM_FETCH_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    const text = await response.text();
    if (text.trim().startsWith("<")) return null;
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return null;
    }
  }

  return response.json() as Promise<unknown>;
}

export const haremGoldService = {
  async getTickerSnapshot(options?: {
    bypassCache?: boolean;
  }): Promise<HaremGoldTickerSnapshot | null> {
    if (
      !options?.bypassCache &&
      memoryCache &&
      memoryCache.expiresAt > Date.now()
    ) {
      return memoryCache.snapshot;
    }

    try {
      const payload = await fetchHaremPayload();
      if (payload) {
        const items = parseHaremGoldPayload(payload);
        if (items.length > 0) {
          const snapshot: HaremGoldTickerSnapshot = {
            items,
            sourceUrl: HAREM_GOLD_SOURCE_URL,
            updatedAt: new Date().toISOString(),
          };

          memoryCache = {
            snapshot,
            expiresAt: Date.now() + CACHE_TTL_MS,
          };

          return snapshot;
        }
      }
    } catch {
      /* Harem erişilemedi */
    }

    const fallback = await fetchGenelParaGoldSnapshot();
    if (fallback) {
      memoryCache = {
        snapshot: fallback,
        expiresAt: Date.now() + CACHE_TTL_MS,
      };
      return fallback;
    }

    return memoryCache?.snapshot ?? null;
  },
};
