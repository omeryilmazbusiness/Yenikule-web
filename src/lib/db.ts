import { pingDatabase } from "@/lib/sql";
import { env } from "@/lib/env";

export type DatabaseHealth = {
  connected: boolean;
  hasUrl: boolean;
  error?: string;
};

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  if (!env.DATABASE_URL) {
    return { connected: false, hasUrl: false, error: "DATABASE_URL tanımlı değil" };
  }

  try {
    await pingDatabase();
    return { connected: true, hasUrl: true };
  } catch (error) {
    return {
      connected: false,
      hasUrl: true,
      error: error instanceof Error ? error.message : "Bağlantı hatası",
    };
  }
}
