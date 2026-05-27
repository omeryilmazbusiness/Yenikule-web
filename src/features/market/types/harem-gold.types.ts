export type HaremGoldQuote = {
  code: string;
  label: string;
  buy: number;
  sell: number;
};

export type HaremGoldTickerSnapshot = {
  items: HaremGoldQuote[];
  sourceUrl: string;
  updatedAt: string;
};

export type HaremGoldApiResponse = {
  ok: boolean;
  data: HaremGoldTickerSnapshot | null;
  error?: string;
};
