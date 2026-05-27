import type { HaremGoldQuote } from "@/features/market/types/harem-gold.types";
import { HAREM_GOLD_SOURCE_URL } from "@/features/market/data/harem-gold-symbols";
import type { HaremGoldTickerSnapshot } from "@/features/market/types/harem-gold.types";

const GENELPARA_ALTIN_URL =
  "https://api.genelpara.com/json/?list=altin&sembol=XHGLD,GA,C";
const GENELPARA_DOVIZ_URL =
  "https://api.genelpara.com/json/?list=doviz&sembol=USD";

type GenelParaRow = {
  alis?: string | number;
  satis?: string | number;
};

type GenelParaResponse = {
  success?: boolean;
  data?: Record<string, GenelParaRow>;
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

function rowToQuote(
  code: string,
  label: string,
  row: GenelParaRow | undefined,
): HaremGoldQuote | null {
  if (!row) return null;

  const buy = toNumber(row.alis);
  const sell = toNumber(row.satis);
  if (buy === null && sell === null) return null;

  return {
    code,
    label,
    buy: buy ?? sell ?? 0,
    sell: sell ?? buy ?? 0,
  };
}

async function fetchGenelParaSection(url: string): Promise<Record<string, GenelParaRow>> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });

  if (!response.ok) return {};

  const json = (await response.json()) as GenelParaResponse;
  if (!json.data || typeof json.data !== "object") return {};

  return json.data;
}

/** Türkiye piyasa verisi — Harem erişilemediğinde yedek kaynak */
export async function fetchGenelParaGoldSnapshot(): Promise<HaremGoldTickerSnapshot | null> {
  try {
    const [altin, doviz] = await Promise.all([
      fetchGenelParaSection(GENELPARA_ALTIN_URL),
      fetchGenelParaSection(GENELPARA_DOVIZ_URL),
    ]);

    const items = [
      rowToQuote("XHGLD", "Has Altın", altin.XHGLD),
      rowToQuote("GA", "Gram Altın", altin.GA),
      rowToQuote("C", "Çeyrek", altin.C),
      rowToQuote("USD", "USD/TRY", doviz.USD),
    ].filter((item): item is HaremGoldQuote => item !== null);

    if (items.length === 0) return null;

    return {
      items,
      sourceUrl: HAREM_GOLD_SOURCE_URL,
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
