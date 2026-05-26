import { ListingCard } from "@/components/listings/ListingCard";
import { ListingListRow } from "@/components/listings/ListingListRow";
import { cn } from "@/lib/cn";
import type { Listing } from "@/features/listings/types/listing.types";

type ListingGridProps = {
  listings: Listing[];
  className?: string;
  emptyMessage?: string;
  variant?: "default" | "immersive";
};

export function ListingGrid({
  listings,
  className,
  emptyMessage = "Arama kriterlerinize uygun ilan bulunamadı. Filtreleri genişletmeyi deneyin.",
  variant = "immersive",
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className={cn("listings-empty", className)}>
        <p className="font-heading text-xl font-medium text-foreground">
          İlan bulunamadı
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className={cn("listings-list", className)} aria-label="İlan listesi">
        {listings.map((listing) => (
          <li key={listing.id}>
            <ListingListRow listing={listing} />
          </li>
        ))}
      </ul>

      <ul
        className={cn("listings-grid", className)}
        aria-label="İlan kartları"
      >
        {listings.map((listing) => (
          <li key={listing.id} className="min-h-0">
            <ListingCard listing={listing} variant={variant} className="h-full" />
          </li>
        ))}
      </ul>
    </>
  );
}
