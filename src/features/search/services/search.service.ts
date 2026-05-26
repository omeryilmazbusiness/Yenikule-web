import { listingService } from "@/features/listings/services/listing.service";
import { projectService } from "@/features/projects/services/project.service";
import { buildSearchIndex } from "@/features/search/utils/build-search-index";
import {
  countSearchMatches,
  querySearchIndex,
} from "@/features/search/utils/query-search-index";
import type {
  GroupedSearchResults,
  SearchIndexItem,
} from "@/features/search/types/search.types";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";

const PUBLIC_LISTING_STATUSES = new Set(["aktif", "rezerve"]);
const PUBLIC_VEHICLE_STATUSES = new Set(["aktif", "rezerve"]);

export const searchService = {
  async getPublicIndex(): Promise<SearchIndexItem[]> {
    const [listings, projects, vehicles] = await Promise.all([
      listingService.getAll({ pageSize: 500 }),
      projectService.getAll({ pageSize: 500 }),
      vehicleService.getAll({ pageSize: 500 }),
    ]);

    const publicListings = listings.items.filter((item) =>
      PUBLIC_LISTING_STATUSES.has(item.status),
    );
    const publicVehicles = vehicles.items.filter((item) =>
      PUBLIC_VEHICLE_STATUSES.has(item.status),
    );

    return buildSearchIndex(publicListings, projects.items, publicVehicles);
  },

  async searchPublic(
    query: string,
    options?: { limitPerType?: number },
  ): Promise<GroupedSearchResults> {
    const index = await this.getPublicIndex();
    return querySearchIndex(index, query, options);
  },

  async countPublicMatches(query: string): Promise<number> {
    const index = await this.getPublicIndex();
    return countSearchMatches(index, query);
  },
};
