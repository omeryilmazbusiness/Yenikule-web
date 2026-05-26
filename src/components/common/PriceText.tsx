import { formatPrice, formatPriceCompact } from "@/lib/format";
import { cn } from "@/lib/cn";

type PriceTextProps = {
  amount: number;
  currency?: string;
  compact?: boolean;
  className?: string;
  suffix?: string;
};

export function PriceText({
  amount,
  currency,
  compact = false,
  className,
  suffix,
}: PriceTextProps) {
  const formatted = compact
    ? formatPriceCompact(amount)
    : formatPrice(amount, currency ? { currency } : undefined);

  return (
    <span className={cn("font-semibold tabular-nums text-foreground", className)}>
      {formatted}
      {suffix ? (
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
