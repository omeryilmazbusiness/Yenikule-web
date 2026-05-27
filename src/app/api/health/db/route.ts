import { NextResponse } from "next/server";

import { checkDatabaseHealth } from "@/lib/db";
import { isMockMode } from "@/lib/env";
import { asRows, getSql, tableExists } from "@/lib/sql";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json(
      {
        ok: false,
        mode: "mock",
        message: "USE_MOCK_DATA=true veya DATABASE_URL eksik.",
      },
      { status: 503 },
    );
  }

  const health = await checkDatabaseHealth();
  if (!health.connected) {
    return NextResponse.json(
      {
        ok: false,
        mode: "database",
        error: health.error,
      },
      { status: 503 },
    );
  }

  try {
    const sql = getSql();
    const [listings, projects, vehicles, messages] = await Promise.all([
      tableExists("listings"),
      tableExists("projects"),
      tableExists("vehicles"),
      tableExists("contact_messages"),
    ]);

    if (!listings || !projects || !vehicles || !messages) {
      return NextResponse.json(
        {
          ok: false,
          mode: "database",
          error: "Veritabanı şeması eksik. db/schema.sql uygulayın.",
          tables: { listings, projects, vehicles, messages },
        },
        { status: 503 },
      );
    }

    const rows = asRows<{
      listings: number;
      projects: number;
      vehicles: number;
      messages: number;
    }>(
      await sql`
        SELECT
          (SELECT COUNT(*)::int FROM listings) AS listings,
          (SELECT COUNT(*)::int FROM projects) AS projects,
          (SELECT COUNT(*)::int FROM vehicles) AS vehicles,
          (SELECT COUNT(*)::int FROM contact_messages) AS messages
      `,
    );

    const row = rows[0];
    if (!row) {
      throw new Error("Count sorgusu boş döndü.");
    }

    return NextResponse.json({
      ok: true,
      mode: "database",
      counts: row,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        mode: "database",
        error: error instanceof Error ? error.message : "Sorgu hatası",
      },
      { status: 503 },
    );
  }
}
