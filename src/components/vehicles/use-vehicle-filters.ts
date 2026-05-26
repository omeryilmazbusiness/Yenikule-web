"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { VehicleFilters } from "@/features/vehicles/types/vehicle.types";
import {
  vehicleFiltersToSearchParams,
  parseVehicleFiltersFromSearchParams,
} from "@/features/vehicles/utils/vehicle-search-params";
import { appendListingsSegmentToParams } from "@/lib/listings-segment";

export function useVehicleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const applied = parseVehicleFiltersFromSearchParams(searchParams);

  const applyFilters = useCallback(
    (next: VehicleFilters, options?: { resetPage?: boolean }) => {
      const merged = { ...next };
      if (options?.resetPage !== false) {
        delete merged.page;
      }
      const params = vehicleFiltersToSearchParams(merged);
      appendListingsSegmentToParams(params, "arac");
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });
    },
    [pathname, router],
  );

  const patchFilters = useCallback(
    (patch: Partial<VehicleFilters>) => {
      const next = { ...applied, ...patch };
      for (const key of Object.keys(patch) as (keyof VehicleFilters)[]) {
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
    const params = new URLSearchParams();
    appendListingsSegmentToParams(params, "arac");
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [pathname, router]);

  return {
    applied,
    applyFilters,
    patchFilters,
    clearFilters,
    isPending,
  };
}
