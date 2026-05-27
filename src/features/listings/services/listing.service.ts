import { listingMockRepository } from "@/features/listings/repositories/listing.mock.repository";
import { listingPostgresRepository } from "@/features/listings/repositories/listing.postgres.repository";
import type { ListingRepository } from "@/features/listings/repositories/listing.repository";
import type {
  Listing,
  ListingCreateInput,
  ListingFilters,
  ListingUpdateInput,
  PaginatedListings,
} from "@/features/listings/types/listing.types";
import { isMockMode } from "@/lib/env";

function getRepository(): ListingRepository {
  if (isMockMode()) {
    return listingMockRepository;
  }
  return listingPostgresRepository;
}

export const listingService = {
  async getAll(filters?: ListingFilters): Promise<PaginatedListings> {
    return getRepository().findAll(filters);
  },

  async getById(id: string): Promise<Listing | null> {
    return getRepository().findById(id);
  },

  async getBySlug(slug: string): Promise<Listing | null> {
    return getRepository().findBySlug(slug);
  },

  async getFeatured(limit?: number): Promise<Listing[]> {
    return getRepository().findFeatured(limit);
  },

  async create(input: ListingCreateInput): Promise<Listing> {
    return getRepository().create(input);
  },

  async update(id: string, input: ListingUpdateInput): Promise<Listing | null> {
    return getRepository().update(id, input);
  },

  async remove(id: string): Promise<boolean> {
    return getRepository().delete(id);
  },
};
