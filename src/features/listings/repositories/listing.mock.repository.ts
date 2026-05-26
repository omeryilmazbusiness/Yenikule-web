import { mockListings } from "@/features/listings/data/listings.mock";
import type { ListingRepository } from "@/features/listings/repositories/listing.repository";
import {
  applyListingFilters,
  paginateListings,
} from "@/features/listings/utils/listing-filters";
import type {
  Listing,
  ListingCreateInput,
  ListingFilters,
  ListingUpdateInput,
} from "@/features/listings/types/listing.types";
import {
  imagesToListingMedia,
  listingMediaToImages,
  normalizeListingMedia,
  resolveListingMedia,
} from "@/features/listings/utils/listing-media";
import { slugify } from "@/lib/format";
import { IMAGE_PLACEHOLDERS, sanitizeImages } from "@/lib/images";
import { createId } from "@/lib/validations";

const globalStore = globalThis as typeof globalThis & {
  __listingStore?: Listing[];
};

function normalizeListing(listing: Listing): Listing {
  const media = normalizeListingMedia(resolveListingMedia(listing));
  const images = sanitizeImages(
    listingMediaToImages(media),
    IMAGE_PLACEHOLDERS.listing,
  );

  return {
    ...listing,
    media,
    images,
  };
}

function getStore(): Listing[] {
  if (!globalStore.__listingStore) {
    globalStore.__listingStore = structuredClone(mockListings).map(normalizeListing);
  } else {
    globalStore.__listingStore = globalStore.__listingStore.map(normalizeListing);
  }
  return globalStore.__listingStore;
}

export class ListingMockRepository implements ListingRepository {
  async findAll(filters: ListingFilters = {}) {
    const filtered = applyListingFilters(getStore(), filters);
    const { page = 1, pageSize = 12 } = filters;
    return paginateListings(filtered, page, pageSize);
  }

  async findById(id: string): Promise<Listing | null> {
    return getStore().find((l) => l.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Listing | null> {
    return getStore().find((l) => l.slug === slug) ?? null;
  }

  async findFeatured(limit = 6): Promise<Listing[]> {
    return getStore()
      .filter((l) => l.isFeatured && l.status === "aktif")
      .slice(0, limit);
  }

  async create(input: ListingCreateInput): Promise<Listing> {
    const store = getStore();
    const now = new Date().toISOString();
    const slug = input.slug ?? slugify(input.title);

    if (store.some((l) => l.slug === slug)) {
      throw new Error("Bu slug ile bir ilan zaten mevcut.");
    }

    const media = input.media?.length
      ? normalizeListingMedia(input.media)
      : imagesToListingMedia(
          sanitizeImages(input.images, IMAGE_PLACEHOLDERS.listing),
        );
    const listing: Listing = normalizeListing({
      ...input,
      media,
      images: listingMediaToImages(media),
      id: createId(),
      slug,
      createdAt: now,
      updatedAt: now,
    });

    store.push(listing);
    return listing;
  }

  async update(id: string, input: ListingUpdateInput): Promise<Listing | null> {
    const store = getStore();
    const index = store.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const existing = store[index]!;
    const slug =
      input.slug ??
      (input.title ? slugify(input.title) : existing.slug);

    if (slug !== existing.slug && store.some((l) => l.slug === slug && l.id !== id)) {
      throw new Error("Bu slug ile bir ilan zaten mevcut.");
    }

    const nextMedia =
      input.media !== undefined
        ? normalizeListingMedia(input.media)
        : input.images
          ? imagesToListingMedia(
              sanitizeImages(input.images, IMAGE_PLACEHOLDERS.listing),
            )
          : resolveListingMedia(existing);

    const updated: Listing = normalizeListing({
      ...existing,
      ...input,
      media: nextMedia,
      images: listingMediaToImages(nextMedia),
      slug,
      updatedAt: new Date().toISOString(),
    });

    store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.findIndex((l) => l.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }
}

export const listingMockRepository = new ListingMockRepository();
