import Link from "next/link";
import { ChevronRight, Home, MapPin } from "lucide-react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import {
  formatListingLocation,
  formatListingPrice,
  formatListingSummary,
  getListingCategoryLabel,
  getListingTypeLabel,
} from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { IMAGE_PLACEHOLDERS, pickPrimaryImage } from "@/lib/images";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type ListingListRowProps = {
  listing: Listing;
  className?: string;
};

export function ListingListRow({ listing, className }: ListingListRowProps) {
  const href = routes.listings.detail(listing.slug);
  const imageSrc = pickPrimaryImage(listing.images, IMAGE_PLACEHOLDERS.listing);

  return (
    <Link
      href={href}
      className={cn("listing-list-row", className)}
    >
      <div className="listing-list-row-media">
        <OptimizedImage
          src={imageSrc}
          alt={listing.title}
          aspectRatio="1/1"
          rounded={false}
          className="listing-list-row-image"
          sizes="112px"
          fallbackSrc={IMAGE_PLACEHOLDERS.listing}
        />
        {listing.isFeatured ? (
          <span className="listing-list-row-featured">Öne Çıkan</span>
        ) : null}
      </div>

      <div className="listing-list-row-body">
        <div className="listing-list-row-badges">
          <span
            className={cn(
              "listing-list-row-badge",
              listing.type === "satilik" && "listing-list-row-badge-sale",
              listing.type === "kiralik" && "listing-list-row-badge-rent",
            )}
          >
            {getListingTypeLabel(listing.type)}
          </span>
          <span className="listing-list-row-badge listing-list-row-badge-muted">
            {getListingCategoryLabel(listing.category)}
          </span>
        </div>

        <h3 className="listing-list-row-title">{listing.title}</h3>

        <p className="listing-list-row-meta">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{formatListingLocation(listing)}</span>
        </p>

        <p className="listing-list-row-meta">
          <Home className="size-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-1">{formatListingSummary(listing)}</span>
        </p>

        <p className="listing-list-row-price">{formatListingPrice(listing)}</p>
      </div>

      <ChevronRight className="listing-list-row-chevron" aria-hidden />
    </Link>
  );
}
