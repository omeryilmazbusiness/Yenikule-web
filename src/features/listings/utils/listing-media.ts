import { createId } from "@/lib/validations";
import type { Listing } from "@/features/listings/types/listing.types";
import type { ListingMedia, ListingMediaType } from "@/features/listings/types/listing-media.types";

export function createListingMediaItem(
  type: ListingMediaType,
  url: string,
  isPrimary = false,
): ListingMedia {
  return {
    id: createId(),
    type,
    url,
    isPrimary,
  };
}

export function imagesToListingMedia(images: string[]): ListingMedia[] {
  return images.map((url, index) =>
    createListingMediaItem(
      url.match(/\.(mp4|webm|mov|m4v)(\?|$)/i) ? "video" : "image",
      url,
      index === 0,
    ),
  );
}

export function normalizeListingMedia(media: ListingMedia[]): ListingMedia[] {
  if (media.length === 0) return media;

  const primaryIndex = media.findIndex((item) => item.isPrimary);
  const startIndex = primaryIndex >= 0 ? primaryIndex : 0;

  return media.map((item, index) => ({
    ...item,
    isPrimary: index === startIndex,
  }));
}

export function listingMediaToImages(media: ListingMedia[]): string[] {
  const sorted = [...normalizeListingMedia(media)].sort((a, b) => {
    if (a.isPrimary === b.isPrimary) return 0;
    return a.isPrimary ? -1 : 1;
  });

  return sorted.map((item) => item.url);
}

export function resolveListingMedia(listing: Pick<Listing, "media" | "images">): ListingMedia[] {
  if (listing.media?.length) {
    return normalizeListingMedia(listing.media);
  }
  if (listing.images?.length) {
    return imagesToListingMedia(listing.images);
  }
  return [];
}

export function getListingPrimaryMedia(
  listing: Pick<Listing, "media" | "images">,
): ListingMedia | null {
  const media = resolveListingMedia(listing);
  return media.find((item) => item.isPrimary) ?? media[0] ?? null;
}

export function isVideoMediaUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}
