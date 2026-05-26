import type {
  Listing,
  ListingCreateInput,
  ListingFilters,
  ListingUpdateInput,
  PaginatedListings,
} from "@/features/listings/types/listing.types";

export interface ListingRepository {
  findAll(filters?: ListingFilters): Promise<PaginatedListings>;
  findById(id: string): Promise<Listing | null>;
  findBySlug(slug: string): Promise<Listing | null>;
  findFeatured(limit?: number): Promise<Listing[]>;
  create(input: ListingCreateInput): Promise<Listing>;
  update(id: string, input: ListingUpdateInput): Promise<Listing | null>;
  delete(id: string): Promise<boolean>;
}
