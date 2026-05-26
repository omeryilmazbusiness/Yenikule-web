import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  formatListingLocation,
  formatListingPrice,
  formatListingSummary,
  getListingCategoryLabel,
  getListingStatusLabel,
  getListingTypeLabel,
} from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { Container } from "@/components/common/Container";

type ListingDetailHeroProps = {
  listing: Listing;
};

export function ListingDetailHero({ listing }: ListingDetailHeroProps) {
  return (
    <div className="border-b border-border bg-card">
      <Container className="py-8 md:py-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{getListingTypeLabel(listing.type)}</Badge>
          <Badge variant="outline">{getListingCategoryLabel(listing.category)}</Badge>
          {listing.status !== "aktif" && (
            <Badge variant="secondary">
              {getListingStatusLabel(listing.status)}
            </Badge>
          )}
          {listing.isFeatured && <Badge>Öne Çıkan</Badge>}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {listing.title}
        </h1>

        <p className="mt-3 flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          {formatListingLocation(listing)}
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-3xl font-bold text-primary md:text-4xl">
            {formatListingPrice(listing)}
          </p>
          <p className="text-sm text-muted-foreground md:text-base">
            {formatListingSummary(listing)}
          </p>
        </div>
      </Container>
    </div>
  );
}
