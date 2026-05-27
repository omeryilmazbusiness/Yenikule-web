import { HAREM_GOLD_DISPLAY_SYMBOLS } from "@/features/market/data/harem-gold-symbols";
import type { HaremGoldQuote } from "@/features/market/types/harem-gold.types";

type HaremRawPrice = {
  alis?: string | number;
  satis?: string | number;
  alis_fiyat?: string | number;
  satis_fiyat?: string | number;
  buy?: string | number;
  sell?: string | number;
};

function toNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const raw = String(value).trim();
  if (!raw) return null;

  let normalized = raw;
  if (raw.includes(",") && raw.lastIndexOf(",") > raw.lastIndexOf(".")) {
    normalized = raw.replace(/\./g, "").replace(",", ".");
  } else {
    normalized = raw.replace(/[^\d.-]/g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function readPrice(row: HaremRawPrice): { buy: number; sell: number } | null {
  const buy =
    toNumber(row.alis) ??
    toNumber(row.alis_fiyat) ??
    toNumber(row.buy);
  const sell =
    toNumber(row.satis) ??
    toNumber(row.satis_fiyat) ??
    toNumber(row.sell);

  if (buy === null && sell === null) return null;

  return {
    buy: buy ?? sell ?? 0,
    sell: sell ?? buy ?? 0,
  };
}

function normalizeKey(key: string): string {
  return key.replace(/\s+/g, "").replace(/[/_-]/g, "").toUpperCase();
}

export function parseHaremGoldPayload(payload: unknown): HaremGoldQuote[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, HaremRawPrice>)
      : (root as Record<string, HaremRawPrice>);

  const normalizedMap = new Map<string, HaremRawPrice>();
  for (const [key, value] of Object.entries(data)) {
    if (!value || typeof value !== "object") continue;
    normalizedMap.set(normalizeKey(key), value);
  }

  const items: HaremGoldQuote[] = [];

  for (const symbol of HAREM_GOLD_DISPLAY_SYMBOLS) {
    const row = symbol.keys
      .map((key) => normalizedMap.get(normalizeKey(key)))
      .find(Boolean);

    if (!row) continue;

    const prices = readPrice(row);
    if (!prices) continue;

    const matchedKey =
      symbol.keys.find((key) => normalizedMap.has(normalizeKey(key))) ??
      symbol.label;

    items.push({
      code: matchedKey,
      label: symbol.label,
      buy: prices.buy,
      sell: prices.sell,
    });
  }

  return items;
}

export function formatHaremGoldPrice(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
