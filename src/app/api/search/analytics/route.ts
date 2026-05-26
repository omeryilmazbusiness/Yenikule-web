import { NextResponse } from "next/server";
import { z } from "zod";

import { searchAnalyticsService } from "@/features/search/services/search-analytics.service";

const recordSchema = z.object({
  q: z.string().trim().min(2).max(80),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { q } = recordSchema.parse(body);

    await searchAnalyticsService.recordSearch(q);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Geçersiz arama terimi." },
        { status: 400 },
      );
    }

    console.error("[api/search/analytics]", error);
    return NextResponse.json(
      { success: false, error: "Arama kaydedilemedi." },
      { status: 500 },
    );
  }
}
