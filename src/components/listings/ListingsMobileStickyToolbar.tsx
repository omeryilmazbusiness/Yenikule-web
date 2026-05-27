"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Loader2, RotateCcw, Search, SquarePen } from "lucide-react";
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

function FilterSheetChrome({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <SheetContent
      side="bottom"
      className="mobile-app-sheet listings-filter-sheet flex flex-col gap-0 p-0"
    >
      <div className="listings-filter-sheet-handle" aria-hidden />
      <SheetHeader className="mobile-app-sheet-header shrink-0 border-b border-border/60 px-5 py-3.5 text-left">
        <SheetTitle className="font-heading text-base">{title}</SheetTitle>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </SheetHeader>

      <div className="mobile-app-sheet-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
        {children}
      </div>

      <SheetFooter className="mobile-app-sheet-footer listings-filter-sheet-footer gap-2 border-t border-border/60 p-4 sm:flex-col">
        {footer}
      </SheetFooter>
    </SheetContent>
  );
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
          aria-label="Arama kriterlerini düzenle"
        >
          <SquarePen className="size-[1.15rem]" aria-hidden />
          {filterCount > 0 ? (
            <span className="listings-mobile-filter-badge">{filterCount}</span>
          ) : null}
        </button>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <FilterSheetChrome
          title="Konut kriterleri"
          subtitle={
            filterCount > 0
              ? `${filterCount} aktif filtre — düzenleyip uygulayın`
              : "Filtreleri seçin, sonuçlar anında güncellenir"
          }
          footer={
            <>
              <Button
                className="min-h-11 w-full rounded-2xl"
                disabled={isPending}
                onClick={() => {
                  applyFilters(draft);
                  setFilterOpen(false);
                }}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                Sonuçları göster
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full rounded-2xl"
                onClick={() => {
                  clearFilters();
                  setDraft({});
                  setFilterOpen(false);
                }}
              >
                <RotateCcw className="size-4" aria-hidden />
                Tümünü temizle
              </Button>
            </>
          }
        >
          <ListingFilterFields
            filters={draft}
            onPatch={patchDraft}
            draftMode
            hideSearch
            idPrefix="mobile-toolbar"
          />
        </FilterSheetChrome>
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
          aria-label="Araç kriterlerini düzenle"
        >
          <SquarePen className="size-[1.15rem]" aria-hidden />
          {filterCount > 0 ? (
            <span className="listings-mobile-filter-badge">{filterCount}</span>
          ) : null}
        </button>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <FilterSheetChrome
          title="Araç kriterleri"
          subtitle={
            filterCount > 0
              ? `${filterCount} aktif filtre — düzenleyip uygulayın`
              : "Marka, fiyat ve özelliklere göre daraltın"
          }
          footer={
            <>
              <Button
                className="min-h-11 w-full rounded-2xl"
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
                className="min-h-11 w-full rounded-2xl"
                onClick={() => {
                  clearFilters();
                  setDraft({});
                  setFilterOpen(false);
                }}
              >
                <RotateCcw className="size-4" aria-hidden />
                Tümünü temizle
              </Button>
            </>
          }
        >
          <VehicleFilterFields
            filters={draft}
            onPatch={patchDraft}
            draftMode
            hideSearch
            idPrefix="mobile-toolbar"
          />
        </FilterSheetChrome>
      </Sheet>
    </>
  );
}

export function ListingsMobileStickyToolbar({
  segment,
}: ListingsMobileStickyToolbarProps) {
  return segment === "arac" ? <VehicleToolbar /> : <ListingToolbar />;
}
