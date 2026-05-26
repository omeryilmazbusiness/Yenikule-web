"use client";

import { X } from "lucide-react";

import { useVehicleFilters } from "@/components/vehicles/use-vehicle-filters";
import {
  VEHICLE_CATEGORIES,
  VEHICLE_FUEL_TYPES,
  VEHICLE_TRANSMISSIONS,
} from "@/lib/constants";
import { cn } from "@/lib/cn";

function labelFor(key: string, value: string | number | boolean): string {
  if (key === "category") {
    return VEHICLE_CATEGORIES.find((c) => c.value === value)?.label ?? String(value);
  }
  if (key === "fuelType") {
    return VEHICLE_FUEL_TYPES.find((f) => f.value === value)?.label ?? String(value);
  }
  if (key === "transmission") {
    return VEHICLE_TRANSMISSIONS.find((t) => t.value === value)?.label ?? String(value);
  }
  if (key === "isFeatured") return "Öne çıkan";
  if (key === "search") return `“${value}”`;
  if (key === "brand") return String(value);
  if (key === "minPrice") return `Min ₺${Number(value).toLocaleString("tr-TR")}`;
  if (key === "maxPrice") return `Max ₺${Number(value).toLocaleString("tr-TR")}`;
  if (key === "minYear") return `Min ${value}`;
  if (key === "maxYear") return `Max ${value}`;
  if (key === "maxMileage") return `Max ${Number(value).toLocaleString("tr-TR")} km`;
  return String(value);
}

export function VehicleActiveFilters({ className }: { className?: string }) {
  const { applied, patchFilters } = useVehicleFilters();

  const chips: { key: keyof typeof applied; label: string }[] = [];

  if (applied.search) chips.push({ key: "search", label: labelFor("search", applied.search) });
  if (applied.category) chips.push({ key: "category", label: labelFor("category", applied.category) });
  if (applied.brand) chips.push({ key: "brand", label: labelFor("brand", applied.brand) });
  if (applied.minPrice !== undefined) chips.push({ key: "minPrice", label: labelFor("minPrice", applied.minPrice) });
  if (applied.maxPrice !== undefined) chips.push({ key: "maxPrice", label: labelFor("maxPrice", applied.maxPrice) });
  if (applied.minYear !== undefined) chips.push({ key: "minYear", label: labelFor("minYear", applied.minYear) });
  if (applied.maxYear !== undefined) chips.push({ key: "maxYear", label: labelFor("maxYear", applied.maxYear) });
  if (applied.maxMileage !== undefined) chips.push({ key: "maxMileage", label: labelFor("maxMileage", applied.maxMileage) });
  if (applied.fuelType) chips.push({ key: "fuelType", label: labelFor("fuelType", applied.fuelType) });
  if (applied.transmission) chips.push({ key: "transmission", label: labelFor("transmission", applied.transmission) });
  if (applied.isFeatured) chips.push({ key: "isFeatured", label: labelFor("isFeatured", true) });

  if (chips.length === 0) return null;

  return (
    <ul className={cn("listing-active-filters", className)}>
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            className="listing-active-filter-chip"
            onClick={() => patchFilters({ [chip.key]: undefined })}
          >
            {chip.label}
            <X className="size-3" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
}
