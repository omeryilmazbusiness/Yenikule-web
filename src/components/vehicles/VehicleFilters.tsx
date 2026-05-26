"use client";

import { Loader2, RotateCcw } from "lucide-react";

import { VehicleFilterFields } from "@/components/vehicles/VehicleFilterFields";
import { useVehicleFilters } from "@/components/vehicles/use-vehicle-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type VehicleFiltersProps = {
  className?: string;
};

export function VehicleFilters({ className }: VehicleFiltersProps) {
  const { applied, patchFilters, clearFilters, isPending } = useVehicleFilters();

  return (
    <aside
      className={cn(
        "listing-filter-sidebar hidden w-full max-w-[18rem] shrink-0 lg:block xl:max-w-[19rem]",
        className,
      )}
      aria-label="Araç filtreleri"
    >
      <div
        className={cn(
          "listing-filter-sidebar-inner",
          isPending && "listing-filter-sidebar-pending",
        )}
      >
        <div className="listing-filter-sidebar-head">
          <h2 className="listing-filter-sidebar-title">Filtreler</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 gap-1.5 px-2 text-muted-foreground"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <RotateCcw className="size-3.5" aria-hidden />
            )}
            Temizle
          </Button>
        </div>

        <VehicleFilterFields filters={applied} onPatch={patchFilters} />
      </div>
    </aside>
  );
}
