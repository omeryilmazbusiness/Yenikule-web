import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleListRow } from "@/components/vehicles/VehicleListRow";
import { cn } from "@/lib/cn";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";

type VehicleGridProps = {
  vehicles: Vehicle[];
  className?: string;
  emptyMessage?: string;
  variant?: "default" | "immersive";
};

export function VehicleGrid({
  vehicles,
  className,
  emptyMessage = "Arama kriterlerinize uygun araç ilanı bulunamadı. Filtreleri genişletmeyi deneyin.",
  variant = "immersive",
}: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className={cn("listings-empty", className)}>
        <p className="font-heading text-xl font-medium text-foreground">
          Araç ilanı bulunamadı
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className={cn("listings-list", className)} aria-label="Araç listesi">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            <VehicleListRow vehicle={vehicle} />
          </li>
        ))}
      </ul>

      <ul
        className={cn("listings-grid", className)}
        aria-label="Araç kartları"
      >
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className="min-h-0">
            <VehicleCard vehicle={vehicle} variant={variant} className="h-full" />
          </li>
        ))}
      </ul>
    </>
  );
}
