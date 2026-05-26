"use client";

import { Loader2 } from "lucide-react";

import { VehicleActiveFilters } from "@/components/vehicles/VehicleActiveFilters";
import { useVehicleFilters } from "@/components/vehicles/use-vehicle-filters";

type VehiclesResultsHeaderProps = {
  total: number;
  page: number;
  totalPages: number;
};

export function VehiclesResultsHeader({
  total,
  page,
  totalPages,
}: VehiclesResultsHeaderProps) {
  const { isPending } = useVehicleFilters();

  return (
    <div className="listings-results-header">
      <div className="flex min-w-0 items-center gap-2">
        {isPending ? (
          <Loader2
            className="size-4 shrink-0 animate-spin text-bronze"
            aria-hidden
          />
        ) : null}
        <p className="listings-results-count">
          <span className="font-semibold text-foreground">{total}</span> araç
          {totalPages > 1 ? (
            <span className="text-muted-foreground">
              {" "}
              · Sayfa {page}/{totalPages}
            </span>
          ) : null}
        </p>
      </div>
      <VehicleActiveFilters className="hidden sm:flex" />
    </div>
  );
}
