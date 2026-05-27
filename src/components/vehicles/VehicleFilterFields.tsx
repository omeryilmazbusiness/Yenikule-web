"use client";

import { useEffect, useState } from "react";
import { Search, Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VEHICLE_FILTER_BRANDS } from "@/features/vehicles/data/vehicle-filter-brands";
import type { VehicleFilters } from "@/features/vehicles/types/vehicle.types";
import {
  SORT_OPTIONS,
  VEHICLE_CATEGORIES,
  VEHICLE_FUEL_TYPES,
  VEHICLE_TRANSMISSIONS,
} from "@/lib/constants";
import { cn } from "@/lib/cn";

type VehicleFilterFieldsProps = {
  filters: VehicleFilters;
  onPatch: (patch: Partial<VehicleFilters>) => void;
  draftMode?: boolean;
  idPrefix?: string;
  hideSearch?: boolean;
};

export function VehicleFilterFields({
  filters,
  onPatch,
  draftMode = false,
  idPrefix = "",
  hideSearch = false,
}: VehicleFilterFieldsProps) {
  const pid = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);
  const [search, setSearch] = useState(filters.search ?? "");

  useEffect(() => {
    queueMicrotask(() => setSearch(filters.search ?? ""));
  }, [filters.search]);

  useEffect(() => {
    if (draftMode) return;
    const timer = window.setTimeout(() => {
      const trimmed = search.trim();
      if (trimmed !== (filters.search ?? "")) {
        onPatch({ search: trimmed || undefined });
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [search, draftMode, filters.search, onPatch]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="listing-filter-fields">
      {hideSearch ? null : (
        <div className="listing-filter-block">
          <Label htmlFor={pid("search")} className="listing-filter-label">
            Arama
          </Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={pid("search")}
              placeholder="Marka, model, ilan..."
              className="listing-filter-input pl-9"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                if (draftMode) {
                  onPatch({ search: value.trim() || undefined });
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Kategori</Label>
        <Select
          value={filters.category ?? "all"}
          onValueChange={(value) =>
            onPatch({
              category:
                value === "all"
                  ? undefined
                  : (value as VehicleFilters["category"]),
            })
          }
        >
          <SelectTrigger className="listing-filter-select">
            <SelectValue placeholder="Tüm kategoriler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm kategoriler</SelectItem>
            {VEHICLE_CATEGORIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Marka</Label>
        <Select
          value={filters.brand ?? "all"}
          onValueChange={(value) =>
            onPatch({ brand: value === "all" ? undefined : value })
          }
        >
          <SelectTrigger className="listing-filter-select">
            <SelectValue placeholder="Tüm markalar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm markalar</SelectItem>
            {VEHICLE_FILTER_BRANDS.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="listing-filter-block">
        <span className="listing-filter-label">Fiyat aralığı (₺)</span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            className="listing-filter-input"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onPatch({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max"
            className="listing-filter-input"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onPatch({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="listing-filter-block">
        <span className="listing-filter-label">Model yılı</span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min"
            className="listing-filter-input"
            value={filters.minYear ?? ""}
            onChange={(e) =>
              onPatch({
                minYear: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder={`Max (${currentYear})`}
            className="listing-filter-input"
            value={filters.maxYear ?? ""}
            onChange={(e) =>
              onPatch({
                maxYear: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="listing-filter-block">
        <Label htmlFor={pid("max-mileage")} className="listing-filter-label">
          Maks. kilometre
        </Label>
        <Input
          id={pid("max-mileage")}
          type="number"
          inputMode="numeric"
          placeholder="Örn. 100000"
          className="listing-filter-input"
          value={filters.maxMileage ?? ""}
          onChange={(e) =>
            onPatch({
              maxMileage: e.target.value ? Number(e.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Yakıt</Label>
        <Select
          value={filters.fuelType ?? "all"}
          onValueChange={(value) =>
            onPatch({
              fuelType:
                value === "all"
                  ? undefined
                  : (value as VehicleFilters["fuelType"]),
            })
          }
        >
          <SelectTrigger className="listing-filter-select">
            <SelectValue placeholder="Tümü" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            {VEHICLE_FUEL_TYPES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="listing-filter-block">
        <span className="listing-filter-label">Vites</span>
        <div className="listing-filter-pills" role="group" aria-label="Vites tipi">
          <button
            type="button"
            className={cn(
              "listing-filter-pill",
              !filters.transmission && "listing-filter-pill-active",
            )}
            onClick={() => onPatch({ transmission: undefined })}
          >
            Tümü
          </button>
          {VEHICLE_TRANSMISSIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              className={cn(
                "listing-filter-pill",
                filters.transmission === item.value && "listing-filter-pill-active",
              )}
              onClick={() => onPatch({ transmission: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="listing-filter-block">
        <button
          type="button"
          className={cn(
            "listing-filter-featured-toggle",
            filters.isFeatured && "listing-filter-featured-toggle-active",
          )}
          onClick={() =>
            onPatch({ isFeatured: filters.isFeatured ? undefined : true })
          }
        >
          <Sparkles className="size-4" aria-hidden />
          Yalnızca öne çıkanlar
        </button>
      </div>

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Sıralama</Label>
        <Select
          value={filters.sort ?? "newest"}
          onValueChange={(value) =>
            onPatch({ sort: value as VehicleFilters["sort"] })
          }
        >
          <SelectTrigger className="listing-filter-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.vehicles.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
