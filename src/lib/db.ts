/**
 * Veritabanı bağlantısı için gelecekteki entegrasyon noktası.
 * Şu an mock repository'ler kullanılmaktadır.
 */

import { env } from "@/lib/env";

export type DatabaseClient = {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
};

class PlaceholderDatabase implements DatabaseClient {
  private connected = false;

  async connect(): Promise<void> {
    if (!env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL tanımlı değil. Mock modunda veritabanı bağlantısı gerekmez.",
      );
    }
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

let dbInstance: DatabaseClient | null = null;

export function getDatabase(): DatabaseClient {
  if (!dbInstance) {
    dbInstance = new PlaceholderDatabase();
  }
  return dbInstance;
}

export async function withDatabase<T>(
  fn: (db: DatabaseClient) => Promise<T>,
): Promise<T> {
  const db = getDatabase();
  await db.connect();
  try {
    return await fn(db);
  } finally {
    await db.disconnect();
  }
}
