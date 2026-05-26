import type {
  Vehicle,
  VehicleCreateInput,
  VehicleFilters,
  VehicleUpdateInput,
  PaginatedVehicles,
} from "@/features/vehicles/types/vehicle.types";

export interface VehicleRepository {
  findAll(filters?: VehicleFilters): Promise<PaginatedVehicles>;
  findById(id: string): Promise<Vehicle | null>;
  findBySlug(slug: string): Promise<Vehicle | null>;
  findFeatured(limit?: number): Promise<Vehicle[]>;
  create(input: VehicleCreateInput): Promise<Vehicle>;
  update(id: string, input: VehicleUpdateInput): Promise<Vehicle | null>;
  delete(id: string): Promise<boolean>;
}
