import { mockVehicles } from "@/features/vehicles/data/vehicles.mock";

export const VEHICLE_FILTER_BRANDS = [
  ...new Set(mockVehicles.map((vehicle) => vehicle.brand)),
].sort((a, b) => a.localeCompare(b, "tr"));
