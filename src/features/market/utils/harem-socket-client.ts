import type { HaremGoldTickerSnapshot } from "@/features/market/types/harem-gold.types";
import { HAREM_GOLD_SOURCE_URL } from "@/features/market/data/harem-gold-symbols";
import { parseHaremGoldPayload } from "@/features/market/utils/parse-harem-gold";

const HAREM_SOCKET_URL = "https://socket.haremaltin.com";

const SOCKET_EVENTS = [
  "price",
  "prices",
  "data",
  "all_prices",
  "update",
  "fiyat",
  "fiyatlar",
  "price_update",
  "fiyat_guncelleme",
] as const;

export function connectHaremGoldSocket(
  onSnapshot: (snapshot: HaremGoldTickerSnapshot) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  let disposed = false;
  let socket: import("socket.io-client").Socket | null = null;

  void import("socket.io-client").then(({ io }) => {
    if (disposed) return;

    socket = io(HAREM_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 12_000,
    });

    const handlePayload = (payload: unknown) => {
      const items = parseHaremGoldPayload(payload);
      if (items.length === 0) return;

      onSnapshot({
        items,
        sourceUrl: HAREM_GOLD_SOURCE_URL,
        updatedAt: new Date().toISOString(),
      });
    };

    for (const event of SOCKET_EVENTS) {
      socket.on(event, handlePayload);
    }
  });

  return () => {
    disposed = true;
    socket?.removeAllListeners();
    socket?.disconnect();
    socket = null;
  };
}
