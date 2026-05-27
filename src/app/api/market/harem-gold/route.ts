import { NextResponse } from "next/server";

import { haremGoldService } from "@/features/market/services/harem-gold.service";
import type { HaremGoldApiResponse } from "@/features/market/types/harem-gold.types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(): Promise<NextResponse<HaremGoldApiResponse>> {
  const snapshot = await haremGoldService.getTickerSnapshot();

  if (!snapshot) {
    return NextResponse.json(
      {
        ok: false,
        data: null,
        error: "Harem Altın verisi şu an alınamadı.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      data: snapshot,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    },
  );
}
