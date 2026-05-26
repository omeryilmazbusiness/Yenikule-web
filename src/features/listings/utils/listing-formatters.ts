import { LISTING_CATEGORIES, LISTING_STATUSES, LISTING_TYPES } from "@/lib/constants";
import { formatArea, formatPrice } from "@/lib/format";
import type { Listing } from "@/features/listings/types/listing.types";

export function getListingCategoryLabel(category: Listing["category"]): string {
  return LISTING_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function getListingTypeLabel(type: Listing["type"]): string {
  return LISTING_TYPES.find((t) => t.value === type)?.label ?? type;
}

export function getListingStatusLabel(status: Listing["status"]): string {
  return LISTING_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function formatListingPrice(listing: Listing): string {
  if (listing.type === "kiralik") {
    return `${formatPrice(listing.price)} / ay`;
  }
  return formatPrice(listing.price);
}

export function formatListingLocation(listing: Listing): string {
  return `${listing.neighborhood}, ${listing.district} / ${listing.city}`;
}

export function formatListingSummary(listing: Listing): string {
  const parts: string[] = [formatArea(listing.area)];
  if (listing.rooms) parts.push(listing.rooms);
  if (listing.floor !== undefined && listing.totalFloors !== undefined) {
    parts.push(`${listing.floor}. kat / ${listing.totalFloors} kat`);
  }
  return parts.join(" · ");
}

export function getListingBadgeVariant(
  status: Listing["status"],
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "aktif":
      return "default";
    case "rezerve":
      return "secondary";
    case "satildi":
    case "kiralandi":
      return "destructive";
    default:
      return "outline";
  }
}
