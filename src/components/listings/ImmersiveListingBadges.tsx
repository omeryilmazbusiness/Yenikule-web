import { Key, Sparkles, Tag } from "lucide-react";

import {
  getListingStatusLabel,
  getListingTypeLabel,
} from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { cn } from "@/lib/cn";

type ImmersiveListingBadgesProps = {
  listing: Listing;
};

export function ImmersiveListingBadges({ listing }: ImmersiveListingBadgesProps) {
  const TypeIcon = listing.type === "kiralik" ? Key : Tag;

  return (
    <>
      <span
        className={cn(
          "immersive-chip",
          listing.type === "satilik" && "immersive-chip-sale",
          listing.type === "kiralik" && "immersive-chip-rent",
          listing.type !== "satilik" &&
            listing.type !== "kiralik" &&
            "immersive-chip-neutral",
        )}
      >
        <TypeIcon className="size-3.5 shrink-0" aria-hidden />
        {getListingTypeLabel(listing.type)}
      </span>
      {listing.isFeatured ? (
        <span className="immersive-chip immersive-chip-featured">
          <Sparkles className="size-3.5 shrink-0" aria-hidden />
          Öne Çıkan
        </span>
      ) : null}
      {listing.status !== "aktif" ? (
        <span className="immersive-chip immersive-chip-muted">
          {getListingStatusLabel(listing.status)}
        </span>
      ) : null}
    </>
  );
}
