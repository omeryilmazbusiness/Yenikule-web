import type { Listing } from "@/features/listings/types/listing.types";
import {
  getListingCategoryLabel,
  getListingTypeLabel,
} from "@/features/listings/utils/listing-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { getProjectStatusLabel } from "@/features/projects/utils/project-formatters";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import {
  getVehicleCategoryLabel,
  formatVehicleSpecs,
} from "@/features/vehicles/utils/vehicle-formatters";
import type { SearchIndexItem } from "@/features/search/types/search.types";
import { normalizeSearchText } from "@/features/search/utils/normalize-search-text";
import { routes } from "@/lib/routes";

function joinSearchParts(parts: (string | number | undefined | null)[]): string {
  return normalizeSearchText(
    parts
      .filter((part) => part !== undefined && part !== null && String(part).trim())
      .map(String)
      .join(" "),
  );
}

function listingToIndexItem(listing: Listing): SearchIndexItem {
  const categoryLabel = getListingCategoryLabel(listing.category);
  const typeLabel = getListingTypeLabel(listing.type);

  return {
    id: listing.id,
    type: "listing",
    title: listing.title,
    subtitle: `${listing.neighborhood}, ${listing.district} · ${typeLabel}`,
    href: routes.listings.detail(listing.slug),
    badge: categoryLabel,
    isFeatured: listing.isFeatured,
    listingType: listing.type,
    searchText: joinSearchParts([
      listing.title,
      listing.shortDescription,
      listing.description,
      categoryLabel,
      typeLabel,
      listing.city,
      listing.district,
      listing.neighborhood,
      listing.address,
      listing.rooms,
      listing.features.join(" "),
      "konut",
      "ev",
      "daire",
      "ilan",
    ]),
  };
}

function projectToIndexItem(project: Project): SearchIndexItem {
  const statusLabel = getProjectStatusLabel(project.status);

  return {
    id: project.id,
    type: "project",
    title: project.title,
    subtitle: `${project.name} · ${project.district}, ${project.city}`,
    href: routes.projects.detail(project.slug),
    badge: statusLabel,
    isFeatured: project.isFeatured,
    searchText: joinSearchParts([
      project.title,
      project.name,
      project.shortDescription,
      project.description,
      statusLabel,
      project.city,
      project.district,
      project.neighborhood,
      project.address,
      project.features.join(" "),
      project.amenities.join(" "),
      "proje",
    ]),
  };
}

function vehicleToIndexItem(vehicle: Vehicle): SearchIndexItem {
  const categoryLabel = getVehicleCategoryLabel(vehicle.category);

  return {
    id: vehicle.id,
    type: "vehicle",
    title: vehicle.title,
    subtitle: `${vehicle.brand} ${vehicle.model} · ${vehicle.year}`,
    href: routes.vehicles.detail(vehicle.slug),
    badge: categoryLabel,
    isFeatured: vehicle.isFeatured,
    searchText: joinSearchParts([
      vehicle.title,
      vehicle.brand,
      vehicle.model,
      vehicle.trim,
      vehicle.shortDescription,
      vehicle.description,
      categoryLabel,
      vehicle.color,
      vehicle.city,
      vehicle.year,
      formatVehicleSpecs(vehicle),
      vehicle.features.join(" "),
      "araba",
      "araç",
      "otomobil",
      "arac",
    ]),
  };
}

export function buildSearchIndex(
  listings: Listing[],
  projects: Project[],
  vehicles: Vehicle[],
): SearchIndexItem[] {
  return [
    ...listings.map(listingToIndexItem),
    ...projects.map(projectToIndexItem),
    ...vehicles.map(vehicleToIndexItem),
  ];
}
