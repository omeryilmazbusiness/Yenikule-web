"use client";

import { useState } from "react";
import {
  CircleDollarSign,
  Coins,
  DollarSign,
  Gem,
  Loader2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLiveGoldPrices } from "@/components/market/use-live-gold-prices";
import { HAREM_GOLD_SOURCE_URL } from "@/features/market/data/harem-gold-symbols";
import type { HaremGoldQuote } from "@/features/market/types/harem-gold.types";
import { formatHaremGoldPrice } from "@/features/market/utils/parse-harem-gold";
import { cn } from "@/lib/cn";

const SYMBOL_ICONS: Record<string, LucideIcon> = {
  XHGLD: Gem,
  ALTIN: Gem,
  GA: Coins,
  GRAMALTIN: Coins,
  C: CircleDollarSign,
  CEYREK: CircleDollarSign,
  USD: DollarSign,
  USDTRY: DollarSign,
};

function getSymbolIcon(code: string): LucideIcon {
  const key = code.replace(/\s+/g, "").toUpperCase();
  return SYMBOL_ICONS[key] ?? TrendingUp;
}

function formatUpdatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

type HaremGoldLiveTriggerProps = {
  overlay?: boolean;
  compact?: boolean;
  className?: string;
};

function GoldPriceRow({ item }: { item: HaremGoldQuote }) {
  const Icon = getSymbolIcon(item.code);

  return (
    <li className="harem-gold-row">
      <span className="harem-gold-row-icon" aria-hidden>
        <Icon className="size-4" />
      </span>
      <div className="harem-gold-row-body">
        <p className="harem-gold-row-label">{item.label}</p>
        <div className="harem-gold-row-prices">
          <span className="harem-gold-price-pill">
            <span className="harem-gold-price-key">Alış</span>
            <span className="harem-gold-price-val">
              {formatHaremGoldPrice(item.buy)}
            </span>
          </span>
          <span className="harem-gold-price-pill harem-gold-price-pill-sell">
            <span className="harem-gold-price-key">Satış</span>
            <span className="harem-gold-price-val">
              {formatHaremGoldPrice(item.sell)}
            </span>
          </span>
        </div>
      </div>
    </li>
  );
}

export function HaremGoldLiveTrigger({
  overlay = false,
  compact = false,
  className,
}: HaremGoldLiveTriggerProps) {
  const [open, setOpen] = useState(false);
  const { items, isLoading, reload, snapshot } = useLiveGoldPrices(open);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "nav-action-minimal",
            overlay
              ? "text-white/75 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          <Coins
            className={cn("size-4 shrink-0", overlay ? "text-bronze-soft" : "text-bronze")}
            aria-hidden
          />
          <span className={cn(compact && "max-w-[7rem] truncate text-xs sm:max-w-none sm:text-sm")}>
            Harem Altın Canlı
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="harem-gold-dialog max-w-md gap-0 overflow-hidden p-0">
        <DialogHeader className="harem-gold-dialog-head">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <DialogTitle className="font-heading text-lg font-semibold">
                Harem Altın Canlı
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Güncel altın ve döviz kurları
              </DialogDescription>
            </div>
            <span className="harem-gold-dialog-live">
              <span className="harem-gold-dialog-live-dot" aria-hidden />
              Canlı
            </span>
          </div>
        </DialogHeader>

        <div className="harem-gold-dialog-body">
          {isLoading && items.length === 0 ? (
            <div className="harem-gold-dialog-loading">
              <Loader2 className="size-5 animate-spin text-bronze" aria-hidden />
              <span>Kurlar yükleniyor…</span>
            </div>
          ) : null}

          {!isLoading && items.length === 0 ? (
            <div className="harem-gold-dialog-empty">
              <p>Veriler şu an alınamadı.</p>
              <button
                type="button"
                className="harem-gold-dialog-retry"
                onClick={() => {
                  void reload();
                }}
              >
                <RefreshCw className="size-3.5" aria-hidden />
                Yeniden dene
              </button>
            </div>
          ) : null}

          {items.length > 0 ? (
            <ul className="harem-gold-list">
              {items.map((item) => (
                <GoldPriceRow key={item.code} item={item} />
              ))}
            </ul>
          ) : null}
        </div>

        <div className="harem-gold-dialog-foot">
          {snapshot?.updatedAt ? (
            <p className="harem-gold-dialog-updated">
              Son güncelleme: {formatUpdatedAt(snapshot.updatedAt)}
            </p>
          ) : null}
          <a
            href={HAREM_GOLD_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="harem-gold-dialog-source"
          >
            haremaltin.com
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
