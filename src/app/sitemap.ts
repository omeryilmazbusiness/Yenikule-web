import type { MetadataRoute } from "next";

import { listingService } from "@/features/listings/services/listing.service";
import { projectService } from "@/features/projects/services/project.service";
import { vehicleService } from "@/features/vehicles/services/vehicle.service";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    routes.home,
    routes.about,
    routes.contact,
    routes.listings.index,
    routes.projects.index,
    routes.vehicles.index,
    routes.legal.privacy,
    routes.legal.terms,
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === routes.home ? "daily" : "weekly",
    priority: path === routes.home ? 1 : 0.7,
  }));

  const [listings, projects, vehicles] = await Promise.all([
    listingService.getAll({ pageSize: 500, status: "aktif" }),
    projectService.getAll({ pageSize: 500 }),
    vehicleService.getAll({ pageSize: 500 }),
  ]);

  const listingRoutes: MetadataRoute.Sitemap = listings.items.map((listing) => ({
    url: `${baseUrl}${routes.listings.detail(listing.slug)}`,
    lastModified: new Date(listing.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.items.map((project) => ({
    url: `${baseUrl}${routes.projects.detail(project.slug)}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.items.map((vehicle) => ({
    url: `${baseUrl}${routes.vehicles.detail(vehicle.slug)}`,
    lastModified: new Date(vehicle.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...listingRoutes, ...projectRoutes, ...vehicleRoutes];
}
