import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  SearchAnalyticsEvent,
  SearchAnalyticsStore,
} from "@/features/search/types/search-analytics.types";
import { normalizeSearchText } from "@/features/search/utils/normalize-search-text";

const RETENTION_DAYS = 7;
const MAX_EVENTS = 2_000;

const globalStore = globalThis as typeof globalThis & {
  __searchAnalyticsStore?: SearchAnalyticsStore;
  __searchAnalyticsLoaded?: boolean;
};

function getFilePath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "yenikule-search-analytics.json");
  }
  return path.join(process.cwd(), ".data", "search-analytics.json");
}

function pruneEvents(events: SearchAnalyticsEvent[]): SearchAnalyticsEvent[] {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

  return events
    .filter((event) => new Date(event.searchedAt).getTime() >= cutoff)
    .slice(-MAX_EVENTS);
}

async function readFromDisk(): Promise<SearchAnalyticsStore | null> {
  try {
    const raw = await fs.readFile(getFilePath(), "utf8");
    const parsed = JSON.parse(raw) as SearchAnalyticsStore;
    if (!Array.isArray(parsed.events)) return null;
    return { events: pruneEvents(parsed.events) };
  } catch {
    return null;
  }
}

async function writeToDisk(store: SearchAnalyticsStore): Promise<void> {
  const filePath = getFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
}

async function ensureLoaded(): Promise<SearchAnalyticsStore> {
  if (globalStore.__searchAnalyticsLoaded && globalStore.__searchAnalyticsStore) {
    return globalStore.__searchAnalyticsStore;
  }

  const fromDisk = await readFromDisk();
  const store = fromDisk ?? { events: [] };
  globalStore.__searchAnalyticsStore = store;
  globalStore.__searchAnalyticsLoaded = true;
  return store;
}

export const searchAnalyticsRepository = {
  async record(term: string): Promise<void> {
    const normalized = normalizeSearchText(term);
    if (normalized.length < 2 || normalized.length > 80) return;

    const store = await ensureLoaded();
    const event: SearchAnalyticsEvent = {
      term: term.trim(),
      searchedAt: new Date().toISOString(),
    };

    store.events = pruneEvents([...store.events, event]);
    globalStore.__searchAnalyticsStore = store;

    try {
      await writeToDisk(store);
    } catch (error) {
      console.warn("[search-analytics] Disk yazılamadı:", error);
    }
  },

  async getTopTerms(options?: {
    days?: number;
    limit?: number;
  }): Promise<string[]> {
    const days = options?.days ?? RETENTION_DAYS;
    const limit = options?.limit ?? 4;
    const store = await ensureLoaded();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    const counts = new Map<string, { display: string; count: number }>();

    for (const event of store.events) {
      if (new Date(event.searchedAt).getTime() < cutoff) continue;

      const key = normalizeSearchText(event.term);
      if (key.length < 2) continue;

      const existing = counts.get(key);
      if (existing) {
        existing.count += 1;
        existing.display = event.term.trim();
        continue;
      }

      counts.set(key, { display: event.term.trim(), count: 1 });
    }

    return [...counts.values()]
      .sort((a, b) => b.count - a.count || a.display.localeCompare(b.display, "tr"))
      .slice(0, limit)
      .map((entry) => entry.display);
  },
};
