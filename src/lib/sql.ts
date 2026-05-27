import { neon } from "@neondatabase/serverless";

import { env } from "@/lib/env";

export type SqlClient = ReturnType<typeof neon>;

let sqlClient: SqlClient | null = null;

export function getSql(): SqlClient {
  const url = env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL tanımlı değil.");
  }

  if (!sqlClient) {
    sqlClient = neon(url);
  }

  return sqlClient;
}

export async function pingDatabase(): Promise<void> {
  const sql = getSql();
  await sql`SELECT 1 AS ok`;
}

export async function tableExists(tableName: string): Promise<boolean> {
  const sql = getSql();
  const rows = asRows<{ exists: boolean }>(
    await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = ${tableName}
      ) AS exists
    `,
  );
  return Boolean(rows[0]?.exists);
}

/** Neon sql sonucunu güvenli satır dizisine çevirir */
export function asRows<T extends Record<string, unknown>>(result: unknown): T[] {
  return Array.isArray(result) ? (result as T[]) : [];
}
