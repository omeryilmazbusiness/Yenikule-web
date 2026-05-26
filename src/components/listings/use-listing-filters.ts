"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ListingFilters } from "@/features/listings/types/listing.types";
import {
  listingFiltersToSearchParams,
  parseListingFiltersFromSearchParams,
} from "@/features/listings/utils/listing-search-params";
import { appendListingsSegmentToParams, parseListingsSegment } from "@/lib/listings-segment";

export function useListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const applied = parseListingFiltersFromSearchParams(searchParams);

  const applyFilters = useCallback(
    (next: ListingFilters, options?: { resetPage?: boolean }) => {
      const merged = { ...next };
      if (options?.resetPage !== false) {
        delete merged.page;
      }
      const params = listingFiltersToSearchParams(merged);
      appendListingsSegmentToParams(params, parseListingsSegment(searchParams));
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  const patchFilters = useCallback(
    (patch: Partial<ListingFilters>) => {
      const next = { ...applied, ...patch };
      for (const key of Object.keys(patch) as (keyof ListingFilters)[]) {
        const value = patch[key];
        if (value === undefined || value === "") {
          delete next[key];
        }
      }
      applyFilters(next);
    },
    [applied, applyFilters],
  );

  const clearFilters = useCallback(() => {
    const segment = parseListingsSegment(searchParams);
    const params = new URLSearchParams();
    appendListingsSegmentToParams(params, segment);
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  return {
    applied,
    applyFilters,
    patchFilters,
    clearFilters,
    isPending,
  };
}
