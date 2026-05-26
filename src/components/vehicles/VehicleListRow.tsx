import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { OptimizedImage } from "@/components/common/OptimizedImage";
import { VehicleBrandLogo } from "@/components/vehicles/VehicleBrandLogo";
import { VehicleCardHighlights } from "@/components/vehicles/VehicleCardHighlights";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import {
  formatVehiclePrice,
  getVehicleCategoryLabel,
} from "@/features/vehicles/utils/vehicle-formatters";
import { IMAGE_PLACEHOLDERS, pickPrimaryImage } from "@/lib/images";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type VehicleListRowProps = {
  vehicle: Vehicle;
  className?: string;
};

export function VehicleListRow({ vehicle, className }: VehicleListRowProps) {
  const href = routes.vehicles.detail(vehicle.slug);
  const imageSrc = pickPrimaryImage(vehicle.images, IMAGE_PLACEHOLDERS.vehicle);

  return (
    <Link href={href} className={cn("listing-list-row vehicle-list-row", className)}>
      <div className="listing-list-row-media vehicle-list-row-media">
        <OptimizedImage
          src={imageSrc}
          alt={vehicle.title}
          aspectRatio="1/1"
          rounded={false}
          className="listing-list-row-image"
          sizes="112px"
          fallbackSrc={IMAGE_PLACEHOLDERS.vehicle}
        />
        <VehicleBrandLogo brand={vehicle.brand} size="sm" className="vehicle-list-row-logo" />
        {vehicle.isFeatured ? (
          <span className="listing-list-row-featured">Öne Çıkan</span>
        ) : null}
      </div>

      <div className="listing-list-row-body">
        <div className="listing-list-row-badges">
          <span className="listing-list-row-badge listing-list-row-badge-sale">
            {vehicle.brand}
          </span>
          <span className="listing-list-row-badge listing-list-row-badge-muted">
            {getVehicleCategoryLabel(vehicle.category)}
          </span>
        </div>

        <h3 className="listing-list-row-title">{vehicle.title}</h3>

        <VehicleCardHighlights vehicle={vehicle} variant="row" />

        <p className="listing-list-row-price">{formatVehiclePrice(vehicle)}</p>
      </div>

      <ChevronRight className="listing-list-row-chevron" aria-hidden />
    </Link>
  );
}
