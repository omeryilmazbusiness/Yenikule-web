"use client";

import { useCallback, useEffect, useState } from "react";

import {
  HAREM_GOLD_API_URL,
  HAREM_GOLD_SOURCE_URL,
} from "@/features/market/data/harem-gold-symbols";
import type {
  HaremGoldApiResponse,
  HaremGoldTickerSnapshot,
} from "@/features/market/types/harem-gold.types";
import { connectHaremGoldSocket } from "@/features/market/utils/harem-socket-client";
import { parseHaremGoldPayload } from "@/features/market/utils/parse-harem-gold";

const POLL_MS = 45_000;

async function fetchFromInternalApi(): Promise<HaremGoldTickerSnapshot | null> {
  const response = await fetch("/api/market/harem-gold", {
    cache: "no-store",
  });
  if (!response.ok) return null;

  const json = (await response.json()) as HaremGoldApiResponse;
  return json.ok && json.data ? json.data : null;
}

async function fetchFromBrowser(): Promise<HaremGoldTickerSnapshot | null> {
  const response = await fetch(HAREM_GOLD_API_URL, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest",
    },
    cache: "no-store",
    credentials: "omit",
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as unknown;
  const items = parseHaremGoldPayload(payload);
  if (items.length === 0) return null;

  return {
    items,
    sourceUrl: HAREM_GOLD_SOURCE_URL,
    updatedAt: new Date().toISOString(),
  };
}

export function useLiveGoldPrices(enabled = true) {
  const [snapshot, setSnapshot] = useState<HaremGoldTickerSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const fromApi = await fetchFromInternalApi();
      if (fromApi?.items.length) {
        setSnapshot(fromApi);
        return;
      }

      const fromBrowser = await fetchFromBrowser();
      if (fromBrowser?.items.length) {
        setSnapshot(fromBrowser);
      }
    } catch {
      /* yanıt yok */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    queueMicrotask(() => {
      void load();
    });
    const intervalId = window.setInterval(() => {
      void load();
    }, POLL_MS);

    return () => window.clearInterval(intervalId);
  }, [enabled, load]);

  useEffect(() => {
    if (!enabled) return;

    const disconnect = connectHaremGoldSocket((liveSnapshot) => {
      setSnapshot(liveSnapshot);
      setIsLoading(false);
    });

    return disconnect;
  }, [enabled]);

  return {
    snapshot,
    items: snapshot?.items ?? [],
    isLoading,
    reload: load,
  };
}
