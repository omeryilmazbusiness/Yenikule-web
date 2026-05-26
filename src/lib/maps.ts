import type { Listing } from "@/features/listings/types/listing.types";
import type { Project } from "@/features/projects/types/project.types";
import { siteConfig } from "@/lib/site-config";

function buildMapQuery(parts: {
  latitude?: number;
  longitude?: number;
  address?: string;
  neighborhood?: string;
  district?: string;
  city?: string;
}): string {
  if (
    parts.latitude !== undefined &&
    parts.longitude !== undefined &&
    Number.isFinite(parts.latitude) &&
    Number.isFinite(parts.longitude)
  ) {
    return `${parts.latitude},${parts.longitude}`;
  }

  return [
    parts.address,
    parts.neighborhood,
    parts.district,
    parts.city,
    "Türkiye",
  ]
    .filter(Boolean)
    .join(", ");
}

function buildMapLabel(parts: {
  address?: string;
  neighborhood?: string;
  district?: string;
  city?: string;
}): string {
  if (parts.address?.trim()) {
    return parts.address.trim();
  }
  return [parts.neighborhood, parts.district, parts.city, "Türkiye"]
    .filter(Boolean)
    .join(", ");
}

/** Tam adres — Google Maps sorgusu için */
export function getListingMapQuery(listing: Listing): string {
  return buildMapQuery(listing);
}

export function getListingMapLabel(listing: Listing): string {
  return buildMapLabel(listing);
}

export function getProjectMapQuery(project: Project): string {
  return buildMapQuery(project);
}

export function getProjectMapLabel(project: Project): string {
  return buildMapLabel(project);
}

export function getGoogleMapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** API anahtarı gerektirmeyen Google Maps embed */
export function getGoogleMapsEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=tr&z=16&output=embed`;
}

export function getSiteMapQuery(): string {
  return buildMapQuery({
    address: siteConfig.address.street,
    district: siteConfig.address.district,
    city: siteConfig.address.city,
  });
}

export function getSiteMapLabel(): string {
  return buildMapLabel({
    address: siteConfig.address.street,
    district: siteConfig.address.district,
    city: siteConfig.address.city,
  });
}
