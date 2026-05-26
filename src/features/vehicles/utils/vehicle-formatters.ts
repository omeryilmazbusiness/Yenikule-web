import { VEHICLE_CATEGORIES, VEHICLE_STATUSES } from "@/lib/constants";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";

export function getVehicleCategoryLabel(category: Vehicle["category"]): string {
  return VEHICLE_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function getVehicleStatusLabel(status: Vehicle["status"]): string {
  return VEHICLE_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function formatVehiclePrice(vehicle: Vehicle): string {
  return formatPrice(vehicle.price);
}

export function formatVehicleMileage(mileage: number): string {
  return `${formatNumber(mileage)} km`;
}

export function formatVehicleTitle(vehicle: Vehicle): string {
  return `${vehicle.brand} ${vehicle.model} (${vehicle.year})`;
}

export function getVehicleTrim(vehicle: Vehicle): string | null {
  const trim = vehicle.trim?.trim();
  if (trim) return trim;

  const packageFeature = vehicle.features.find((feature) =>
    /paket/i.test(feature),
  );
  return packageFeature ?? null;
}

export function getVehicleConditionTags(vehicle: Vehicle): string[] {
  const tags: string[] = [];
  const condition = vehicle.condition;

  if (condition?.accidentFree) tags.push("Kazasız");
  if (condition?.paintFree) tags.push("Boyasız");

  if (tags.length > 0 || condition) {
    return tags;
  }

  const text = `${vehicle.description} ${vehicle.shortDescription}`.toLocaleLowerCase(
    "tr-TR",
  );
  if (/kazasız|kazasiz/.test(text)) tags.push("Kazasız");
  if (/boyasız|boyasiz/.test(text)) tags.push("Boyasız");

  return tags;
}

export type VehicleCardSpecItem = {
  label: string;
  value: string;
};

export function getVehicleCardSpecs(vehicle: Vehicle): VehicleCardSpecItem[] {
  const trim = getVehicleTrim(vehicle);
  const specs: VehicleCardSpecItem[] = [
    { label: "Yıl", value: String(vehicle.year) },
    { label: "Km", value: formatVehicleMileage(vehicle.mileage) },
    { label: "Renk", value: vehicle.color },
    { label: "Model", value: vehicle.model },
  ];

  if (trim) {
    specs.push({ label: "Paket", value: trim });
  }

  return specs;
}

export function formatVehicleSpecs(vehicle: Vehicle): string {
  const fuelLabels: Record<Vehicle["fuelType"], string> = {
    benzin: "Benzin",
    dizel: "Dizel",
    lpg: "LPG",
    hibrit: "Hibrit",
    elektrik: "Elektrik",
  };

  const transmissionLabels: Record<Vehicle["transmission"], string> = {
    manuel: "Manuel",
    otomatik: "Otomatik",
  };

  const parts = [
    fuelLabels[vehicle.fuelType],
    transmissionLabels[vehicle.transmission],
    formatVehicleMileage(vehicle.mileage),
  ];

  if (vehicle.engineSize) {
    parts.unshift(`${vehicle.engineSize} L`);
  }

  return parts.join(" · ");
}
