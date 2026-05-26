import { mockVehicles } from "@/features/vehicles/data/vehicles.mock";
import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle.repository";
import {
  applyVehicleFilters,
  paginateVehicles,
} from "@/features/vehicles/utils/vehicle-filters";
import type {
  Vehicle,
  VehicleCreateInput,
  VehicleFilters,
  VehicleUpdateInput,
} from "@/features/vehicles/types/vehicle.types";
import { slugify } from "@/lib/format";
import { IMAGE_PLACEHOLDERS, sanitizeImages } from "@/lib/images";
import { createId } from "@/lib/validations";

const globalStore = globalThis as typeof globalThis & {
  __vehicleStore?: Vehicle[];
};

function normalizeVehicle(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    images: sanitizeImages(vehicle.images, IMAGE_PLACEHOLDERS.vehicle),
  };
}

function getStore(): Vehicle[] {
  if (!globalStore.__vehicleStore) {
    globalStore.__vehicleStore = structuredClone(mockVehicles).map(normalizeVehicle);
  } else {
    globalStore.__vehicleStore = globalStore.__vehicleStore.map(normalizeVehicle);
  }
  return globalStore.__vehicleStore;
}

export class VehicleMockRepository implements VehicleRepository {
  async findAll(filters: VehicleFilters = {}) {
    const filtered = applyVehicleFilters(getStore(), filters);
    const { page = 1, pageSize = 12 } = filters;
    return paginateVehicles(filtered, page, pageSize);
  }

  async findById(id: string): Promise<Vehicle | null> {
    return getStore().find((v) => v.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Vehicle | null> {
    return getStore().find((v) => v.slug === slug) ?? null;
  }

  async findFeatured(limit = 4): Promise<Vehicle[]> {
    return getStore()
      .filter((v) => v.isFeatured && (v.status === "aktif" || v.status === "rezerve"))
      .slice(0, limit);
  }

  async create(input: VehicleCreateInput): Promise<Vehicle> {
    const store = getStore();
    const now = new Date().toISOString();
    const slug = input.slug ?? slugify(input.title);

    if (store.some((v) => v.slug === slug)) {
      throw new Error("Bu slug ile bir araç ilanı zaten mevcut.");
    }

    const vehicle: Vehicle = normalizeVehicle({
      ...input,
      images: sanitizeImages(input.images, IMAGE_PLACEHOLDERS.vehicle),
      id: createId(),
      slug,
      createdAt: now,
      updatedAt: now,
    });

    store.push(vehicle);
    return vehicle;
  }

  async update(id: string, input: VehicleUpdateInput): Promise<Vehicle | null> {
    const store = getStore();
    const index = store.findIndex((v) => v.id === id);
    if (index === -1) return null;

    const existing = store[index]!;
    const slug =
      input.slug ??
      (input.title ? slugify(input.title) : existing.slug);

    if (slug !== existing.slug && store.some((v) => v.slug === slug && v.id !== id)) {
      throw new Error("Bu slug ile bir araç ilanı zaten mevcut.");
    }

    const updated: Vehicle = normalizeVehicle({
      ...existing,
      ...input,
      images: input.images
        ? sanitizeImages(input.images, IMAGE_PLACEHOLDERS.vehicle)
        : existing.images,
      slug,
      updatedAt: new Date().toISOString(),
    });

    store[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.findIndex((v) => v.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }
}

export const vehicleMockRepository = new VehicleMockRepository();
