import { vehicleMockRepository } from "@/features/vehicles/repositories/vehicle.mock.repository";
import type { VehicleRepository } from "@/features/vehicles/repositories/vehicle.repository";
import type {
  Vehicle,
  VehicleCreateInput,
  VehicleFilters,
  VehicleUpdateInput,
  PaginatedVehicles,
} from "@/features/vehicles/types/vehicle.types";
import { isMockMode } from "@/lib/env";

function getRepository(): VehicleRepository {
  if (isMockMode()) {
    return vehicleMockRepository;
  }
  return vehicleMockRepository;
}

export const vehicleService = {
  async getAll(filters?: VehicleFilters): Promise<PaginatedVehicles> {
    return getRepository().findAll(filters);
  },

  async getById(id: string): Promise<Vehicle | null> {
    return getRepository().findById(id);
  },

  async getBySlug(slug: string): Promise<Vehicle | null> {
    return getRepository().findBySlug(slug);
  },

  async getFeatured(limit?: number): Promise<Vehicle[]> {
    return getRepository().findFeatured(limit);
  },

  async create(input: VehicleCreateInput): Promise<Vehicle> {
    return getRepository().create(input);
  },

  async update(id: string, input: VehicleUpdateInput): Promise<Vehicle | null> {
    return getRepository().update(id, input);
  },

  async remove(id: string): Promise<boolean> {
    return getRepository().delete(id);
  },
};
