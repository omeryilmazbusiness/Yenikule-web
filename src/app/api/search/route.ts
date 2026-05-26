import { NextResponse } from "next/server";

import { searchService } from "@/features/search/services/search.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";

    if (!query) {
      const index = await searchService.getPublicIndex();
      return NextResponse.json({
        success: true,
        index,
      });
    }

    const results = await searchService.searchPublic(query, { limitPerType: 8 });
    const total = await searchService.countPublicMatches(query);

    return NextResponse.json({
      success: true,
      query,
      results,
      total,
    });
  } catch (error) {
    console.error("[api/search]", error);
    return NextResponse.json(
      { success: false, error: "Arama yapılamadı." },
      { status: 500 },
    );
  }
}
