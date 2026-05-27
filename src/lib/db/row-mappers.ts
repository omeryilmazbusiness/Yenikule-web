import type { ContactMessage } from "@/features/contact/types/contact.types";
import type { Listing } from "@/features/listings/types/listing.types";
import type { ListingMedia } from "@/features/listings/types/listing-media.types";
import {
  listingMediaToImages,
  normalizeListingMedia,
  resolveListingMedia,
} from "@/features/listings/utils/listing-media";
import type { Project } from "@/features/projects/types/project.types";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { IMAGE_PLACEHOLDERS, sanitizeImages } from "@/lib/images";

type ListingRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  category: Listing["category"];
  type: Listing["type"];
  status: Listing["status"];
  price: string | number;
  currency: string;
  area: string | number;
  rooms: string | null;
  floor: number | null;
  total_floors: number | null;
  building_age: number | null;
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  features: string[] | unknown;
  images: string[] | unknown;
  media: ListingMedia[] | null | unknown;
  is_featured: boolean;
  project_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export function mapListingRow(row: ListingRow): Listing {
  const media = row.media
    ? normalizeListingMedia(row.media as ListingMedia[])
    : undefined;
  const images = sanitizeImages(
    (row.images as string[]) ?? [],
    IMAGE_PLACEHOLDERS.listing,
  );

  const listing: Listing = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description,
    category: row.category,
    type: row.type,
    status: row.status,
    price: Number(row.price),
    currency: row.currency,
    area: Number(row.area),
    rooms: row.rooms ?? undefined,
    floor: row.floor ?? undefined,
    totalFloors: row.total_floors ?? undefined,
    buildingAge: row.building_age ?? undefined,
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    address: row.address,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    images,
    media,
    isFeatured: row.is_featured,
    projectId: row.project_id ?? undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };

  const resolvedMedia = normalizeListingMedia(resolveListingMedia(listing));
  return {
    ...listing,
    media: resolvedMedia,
    images: listingMediaToImages(resolvedMedia),
  };
}

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  short_description: string;
  status: Project["status"];
  city: string;
  district: string;
  neighborhood: string;
  address: string;
  total_units: number;
  available_units: number;
  start_year: number;
  delivery_year: number | null;
  features: string[] | unknown;
  amenities: string[] | unknown;
  images: string[] | unknown;
  cover_image: string;
  brochure_url: string | null;
  is_featured: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description,
    status: row.status,
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    address: row.address,
    totalUnits: row.total_units,
    availableUnits: row.available_units,
    startYear: row.start_year,
    deliveryYear: row.delivery_year ?? undefined,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    coverImage: row.cover_image,
    brochureUrl: row.brochure_url ?? undefined,
    isFeatured: row.is_featured,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

type VehicleRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  category: Vehicle["category"];
  status: Vehicle["status"];
  brand: string;
  model: string;
  trim: string | null;
  condition: Vehicle["condition"] | null;
  year: number;
  mileage: number;
  fuel_type: Vehicle["fuelType"];
  transmission: Vehicle["transmission"];
  engine_size: string | null;
  color: string;
  price: string | number;
  currency: string;
  city: string;
  features: string[] | unknown;
  images: string[] | unknown;
  is_featured: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

export function mapVehicleRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description,
    category: row.category,
    status: row.status,
    brand: row.brand,
    model: row.model,
    trim: row.trim ?? undefined,
    condition: row.condition ?? undefined,
    year: row.year,
    mileage: row.mileage,
    fuelType: row.fuel_type,
    transmission: row.transmission,
    engineSize: row.engine_size ?? undefined,
    color: row.color,
    price: Number(row.price),
    currency: row.currency,
    city: row.city,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    images: sanitizeImages(
      Array.isArray(row.images) ? (row.images as string[]) : [],
      IMAGE_PLACEHOLDERS.vehicle,
    ),
    isFeatured: row.is_featured,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactMessage["status"];
  listing_id: string | null;
  project_id: string | null;
  vehicle_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export function mapContactRow(row: ContactRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    listingId: row.listing_id ?? undefined,
    projectId: row.project_id ?? undefined,
    vehicleId: row.vehicle_id ?? undefined,
    ipAddress: row.ip_address ?? undefined,
    userAgent: row.user_agent ?? undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
