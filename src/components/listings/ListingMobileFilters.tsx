"use client";

import { useState } from "react";
import { Filter, Loader2, RotateCcw } from "lucide-react";

import { ListingFilterFields } from "@/components/listings/ListingFilterFields";
import { useListingFilters } from "@/components/listings/use-listing-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { ListingFilters as ListingFiltersType } from "@/features/listings/types/listing.types";
import { parseListingFiltersFromSearchParams } from "@/features/listings/utils/listing-search-params";
import { useSearchParams } from "next/navigation";

export function ListingMobileFilters() {
  const searchParams = useSearchParams();
  const { applied, applyFilters, clearFilters, isPending } = useListingFilters();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ListingFiltersType>(applied);

  const activeCount = [
    applied.search,
    applied.category,
    applied.type,
    applied.city,
    applied.district,
    applied.minPrice,
    applied.maxPrice,
    applied.minArea,
    applied.maxArea,
    applied.rooms,
    applied.isFeatured,
  ].filter(Boolean).length;

  const patchDraft = (patch: Partial<ListingFiltersType>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      for (const key of Object.keys(patch) as (keyof ListingFiltersType)[]) {
        if (patch[key] === undefined || patch[key] === "") {
          delete next[key];
        }
      }
      return next;
    });
  };

  return (
    <div className="lg:hidden">
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setDraft(parseListingFiltersFromSearchParams(searchParams));
          }
        }}
      >
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="listing-filter-mobile-trigger w-full gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Filter className="size-4" aria-hidden />
            )}
            Filtrele ve sırala
            {activeCount > 0 ? (
              <span className="listing-filter-mobile-badge">{activeCount}</span>
            ) : null}
          </Button>
        </SheetTrigger>

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
              idPrefix="mobile"
            />
          </div>

          <SheetFooter className="gap-2 border-t border-border/60 p-4 sm:flex-col">
            <Button
              className="w-full min-h-11"
              disabled={isPending}
              onClick={() => {
                applyFilters(draft);
                setOpen(false);
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
              className="w-full min-h-11"
              onClick={() => {
                clearFilters();
                setDraft({});
                setOpen(false);
              }}
            >
              <RotateCcw className="size-4" aria-hidden />
              Temizle
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
