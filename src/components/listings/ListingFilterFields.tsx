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
import {
  LISTING_FILTER_CITIES,
  LISTING_FILTER_DISTRICTS_BY_CITY,
  LISTING_ROOM_PRESETS,
} from "@/features/listings/data/listing-filter-locations";
import type { ListingFilters } from "@/features/listings/types/listing.types";
import {
  LISTING_CATEGORIES,
  LISTING_TYPES,
  SORT_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/cn";

type ListingFilterFieldsProps = {
  filters: ListingFilters;
  onPatch: (patch: Partial<ListingFilters>) => void;
  /** Draft modunda anlık state; URL’e yazılmaz */
  draftMode?: boolean;
  idPrefix?: string;
  hideSearch?: boolean;
};

export function ListingFilterFields({
  filters,
  onPatch,
  draftMode = false,
  idPrefix = "",
  hideSearch = false,
}: ListingFilterFieldsProps) {
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

  const districts =
    filters.city && LISTING_FILTER_DISTRICTS_BY_CITY[filters.city]
      ? LISTING_FILTER_DISTRICTS_BY_CITY[filters.city]
      : [];

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
              placeholder="İlan, mahalle, ilçe..."
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
        <span className="listing-filter-label">İlan Türü</span>
        <div className="listing-filter-pills" role="group" aria-label="İlan türü">
          <button
            type="button"
            className={cn(
              "listing-filter-pill",
              !filters.type && "listing-filter-pill-active",
            )}
            onClick={() => onPatch({ type: undefined })}
          >
            Tümü
          </button>
          {LISTING_TYPES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={cn(
                "listing-filter-pill",
                filters.type === item.value && "listing-filter-pill-active",
              )}
              onClick={() => onPatch({ type: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Kategori</Label>
        <Select
          value={filters.category ?? "all"}
          onValueChange={(value) =>
            onPatch({
              category:
                value === "all"
                  ? undefined
                  : (value as ListingFilters["category"]),
            })
          }
        >
          <SelectTrigger className="listing-filter-select">
            <SelectValue placeholder="Tüm kategoriler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm kategoriler</SelectItem>
            {LISTING_CATEGORIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="listing-filter-block">
        <Label className="listing-filter-label">Konum</Label>
        <div className="grid gap-2">
          <Select
            value={filters.city ?? "all"}
            onValueChange={(value) =>
              onPatch({
                city: value === "all" ? undefined : value,
                district: undefined,
              })
            }
          >
            <SelectTrigger className="listing-filter-select">
              <SelectValue placeholder="Şehir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm şehirler</SelectItem>
              {LISTING_FILTER_CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.district ?? "all"}
            onValueChange={(value) =>
              onPatch({
                district: value === "all" ? undefined : value,
              })
            }
            disabled={!filters.city}
          >
            <SelectTrigger className="listing-filter-select">
              <SelectValue placeholder="İlçe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm ilçeler</SelectItem>
              {districts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="listing-filter-block">
        <span className="listing-filter-label">Fiyat aralığı (₺)</span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            id={pid("min-price")}
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
            id={pid("max-price")}
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
        <span className="listing-filter-label">Alan (m²)</span>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min m²"
            className="listing-filter-input"
            value={filters.minArea ?? ""}
            onChange={(e) =>
              onPatch({
                minArea: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max m²"
            className="listing-filter-input"
            value={filters.maxArea ?? ""}
            onChange={(e) =>
              onPatch({
                maxArea: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="listing-filter-block">
        <span className="listing-filter-label">Oda sayısı</span>
        <div className="listing-filter-pills mb-2">
          {LISTING_ROOM_PRESETS.map((room) => (
            <button
              key={room}
              type="button"
              className={cn(
                "listing-filter-pill",
                filters.rooms === room && "listing-filter-pill-active",
              )}
              onClick={() =>
                onPatch({
                  rooms: filters.rooms === room ? undefined : room,
                })
              }
            >
              {room}
            </button>
          ))}
        </div>
        <Input
          placeholder="Özel: 3+1, 4+2..."
          className="listing-filter-input"
          value={filters.rooms ?? ""}
          onChange={(e) =>
            onPatch({ rooms: e.target.value.trim() || undefined })
          }
        />
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
            onPatch({ sort: value as ListingFilters["sort"] })
          }
        >
          <SelectTrigger className="listing-filter-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.listings.map((item) => (
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
