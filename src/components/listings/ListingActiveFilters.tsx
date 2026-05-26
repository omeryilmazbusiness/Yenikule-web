"use client";

import { X } from "lucide-react";

import { useListingFilters } from "@/components/listings/use-listing-filters";
import {
  LISTING_CATEGORIES,
  LISTING_TYPES,
} from "@/lib/constants";
import { cn } from "@/lib/cn";

function labelFor(
  key: string,
  value: string | number | boolean,
): string {
  if (key === "category") {
    return LISTING_CATEGORIES.find((c) => c.value === value)?.label ?? String(value);
  }
  if (key === "type") {
    return LISTING_TYPES.find((t) => t.value === value)?.label ?? String(value);
  }
  if (key === "isFeatured" || key === "featured") return "Öne çıkan";
  if (key === "search") return `“${value}”`;
  if (key === "minPrice") return `Min ₺${Number(value).toLocaleString("tr-TR")}`;
  if (key === "maxPrice") return `Max ₺${Number(value).toLocaleString("tr-TR")}`;
  if (key === "minArea") return `Min ${value} m²`;
  if (key === "maxArea") return `Max ${value} m²`;
  if (key === "city") return String(value);
  if (key === "district") return String(value);
  if (key === "rooms") return String(value);
  if (key === "sort") return "Sıralama";
  return String(value);
}

export function ListingActiveFilters({ className }: { className?: string }) {
  const { applied, patchFilters } = useListingFilters();

  const chips: { key: keyof typeof applied; label: string }[] = [];

  if (applied.search) chips.push({ key: "search", label: labelFor("search", applied.search) });
  if (applied.category) chips.push({ key: "category", label: labelFor("category", applied.category) });
  if (applied.type) chips.push({ key: "type", label: labelFor("type", applied.type) });
  if (applied.city) chips.push({ key: "city", label: labelFor("city", applied.city) });
  if (applied.district) chips.push({ key: "district", label: labelFor("district", applied.district) });
  if (applied.minPrice !== undefined) chips.push({ key: "minPrice", label: labelFor("minPrice", applied.minPrice) });
  if (applied.maxPrice !== undefined) chips.push({ key: "maxPrice", label: labelFor("maxPrice", applied.maxPrice) });
  if (applied.minArea !== undefined) chips.push({ key: "minArea", label: labelFor("minArea", applied.minArea) });
  if (applied.maxArea !== undefined) chips.push({ key: "maxArea", label: labelFor("maxArea", applied.maxArea) });
  if (applied.rooms) chips.push({ key: "rooms", label: labelFor("rooms", applied.rooms) });
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
