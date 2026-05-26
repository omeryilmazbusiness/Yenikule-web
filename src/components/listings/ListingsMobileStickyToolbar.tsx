"use client";

import { useEffect, useState } from "react";
import { Filter, Loader2, RotateCcw, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { ListingFilterFields } from "@/components/listings/ListingFilterFields";
import { useListingFilters } from "@/components/listings/use-listing-filters";
import { VehicleFilterFields } from "@/components/vehicles/VehicleFilterFields";
import { useVehicleFilters } from "@/components/vehicles/use-vehicle-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ListingFilters } from "@/features/listings/types/listing.types";
import type { VehicleFilters } from "@/features/vehicles/types/vehicle.types";
import { parseListingFiltersFromSearchParams } from "@/features/listings/utils/listing-search-params";
import { parseVehicleFiltersFromSearchParams } from "@/features/vehicles/utils/vehicle-search-params";
import type { ListingsSegment } from "@/lib/listings-segment";
import { cn } from "@/lib/cn";

type ListingsMobileStickyToolbarProps = {
  segment: ListingsSegment;
};

function countListingFilters(filters: ListingFilters): number {
  return [
    filters.category,
    filters.type,
    filters.city,
    filters.district,
    filters.minPrice,
    filters.maxPrice,
    filters.minArea,
    filters.maxArea,
    filters.rooms,
    filters.isFeatured,
    filters.sort && filters.sort !== "newest" ? filters.sort : undefined,
  ].filter(Boolean).length;
}

function countVehicleFilters(filters: VehicleFilters): number {
  return [
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.minYear,
    filters.maxYear,
    filters.maxMileage,
    filters.fuelType,
    filters.transmission,
    filters.isFeatured,
    filters.sort && filters.sort !== "newest" ? filters.sort : undefined,
  ].filter(Boolean).length;
}

function ListingToolbar() {
  const searchParams = useSearchParams();
  const { applied, patchFilters, applyFilters, clearFilters, isPending } =
    useListingFilters();
  const [search, setSearch] = useState(applied.search ?? "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<ListingFilters>(applied);

  const filterCount = countListingFilters(applied);

  useEffect(() => {
    setSearch(applied.search ?? "");
  }, [applied.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = search.trim();
      if (trimmed !== (applied.search ?? "")) {
        patchFilters({ search: trimmed || undefined });
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [search, applied.search, patchFilters]);

  const patchDraft = (patch: Partial<ListingFilters>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      for (const key of Object.keys(patch) as (keyof ListingFilters)[]) {
        if (patch[key] === undefined || patch[key] === "") {
          delete next[key];
        }
      }
      return next;
    });
  };

  return (
    <>
      <div className="listings-mobile-toolbar">
        <div className="listings-mobile-search">
          {isPending ? (
            <Loader2
              className="listings-mobile-search-icon animate-spin text-bronze"
              aria-hidden
            />
          ) : (
            <Search className="listings-mobile-search-icon" aria-hidden />
          )}
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="İlan, mahalle, ilçe ara..."
            className="listings-mobile-search-input"
            aria-label="İlan ara"
            enterKeyHint="search"
          />
        </div>

        <button
          type="button"
          className={cn(
            "listings-mobile-filter-btn",
            filterCount > 0 && "listings-mobile-filter-btn-active",
          )}
          onClick={() => {
            setDraft(parseListingFiltersFromSearchParams(searchParams));
            setFilterOpen(true);
          }}
          aria-label="Filtreleri aç"
        >
          <Filter className="size-[1.15rem]" aria-hidden />
          {filterCount > 0 ? (
            <span className="listings-mobile-filter-badge">{filterCount}</span>
          ) : null}
        </button>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col rounded-t-[1.35rem] p-0"
        >
          <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
            <SheetTitle className="font-heading text-lg">Filtreler</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <ListingFilterFields
              filters={draft}
              onPatch={patchDraft}
              draftMode
              hideSearch
              idPrefix="mobile-toolbar"
            />
          </div>

          <SheetFooter className="gap-2 border-t border-border/60 p-4 sm:flex-col">
            <Button
              className="min-h-11 w-full"
              disabled={isPending}
              onClick={() => {
                applyFilters(draft);
                setFilterOpen(false);
              }}
            >
              Sonuçları göster
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full"
              onClick={() => {
                clearFilters();
                setDraft({});
                setFilterOpen(false);
              }}
            >
              <RotateCcw className="size-4" aria-hidden />
              Temizle
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

function VehicleToolbar() {
  const searchParams = useSearchParams();
  const { applied, patchFilters, applyFilters, clearFilters, isPending } =
    useVehicleFilters();
  const [search, setSearch] = useState(applied.search ?? "");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<VehicleFilters>(applied);

  const filterCount = countVehicleFilters(applied);

  useEffect(() => {
    setSearch(applied.search ?? "");
  }, [applied.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmed = search.trim();
      if (trimmed !== (applied.search ?? "")) {
        patchFilters({ search: trimmed || undefined });
      }
    }, 320);
    return () => window.clearTimeout(timer);
  }, [search, applied.search, patchFilters]);

  const patchDraft = (patch: Partial<VehicleFilters>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      for (const key of Object.keys(patch) as (keyof VehicleFilters)[]) {
        if (patch[key] === undefined || patch[key] === "") {
          delete next[key];
        }
      }
      return next;
    });
  };

  return (
    <>
      <div className="listings-mobile-toolbar">
        <div className="listings-mobile-search">
          {isPending ? (
            <Loader2
              className="listings-mobile-search-icon animate-spin text-bronze"
              aria-hidden
            />
          ) : (
            <Search className="listings-mobile-search-icon" aria-hidden />
          )}
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Marka, model ara..."
            className="listings-mobile-search-input"
            aria-label="Araç ara"
            enterKeyHint="search"
          />
        </div>

        <button
          type="button"
          className={cn(
            "listings-mobile-filter-btn",
            filterCount > 0 && "listings-mobile-filter-btn-active",
          )}
          onClick={() => {
            setDraft(parseVehicleFiltersFromSearchParams(searchParams));
            setFilterOpen(true);
          }}
          aria-label="Araç filtrelerini aç"
        >
          <Filter className="size-[1.15rem]" aria-hidden />
          {filterCount > 0 ? (
            <span className="listings-mobile-filter-badge">{filterCount}</span>
          ) : null}
        </button>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[90vh] flex-col rounded-t-[1.35rem] p-0"
        >
          <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
            <SheetTitle className="font-heading text-lg">Araç filtreleri</SheetTitle>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <VehicleFilterFields
              filters={draft}
              onPatch={patchDraft}
              draftMode
              hideSearch
              idPrefix="mobile-toolbar"
            />
          </div>

          <SheetFooter className="gap-2 border-t border-border/60 p-4 sm:flex-col">
            <Button
              className="min-h-11 w-full"
              disabled={isPending}
              onClick={() => {
                applyFilters(draft);
                setFilterOpen(false);
              }}
            >
              Sonuçları göster
            </Button>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 w-full"
              onClick={() => {
                clearFilters();
                setDraft({});
                setFilterOpen(false);
              }}
            >
              <RotateCcw className="size-4" aria-hidden />
              Temizle
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function ListingsMobileStickyToolbar({
  segment,
}: ListingsMobileStickyToolbarProps) {
  return segment === "arac" ? <VehicleToolbar /> : <ListingToolbar />;
}
