import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ImmersiveCardShell } from "@/components/common/ImmersiveCardShell";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { VehicleBrandLogo } from "@/components/vehicles/VehicleBrandLogo";
import { VehicleCardHighlights } from "@/components/vehicles/VehicleCardHighlights";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import {
  formatVehiclePrice,
  getVehicleCategoryLabel,
  getVehicleConditionTags,
} from "@/features/vehicles/utils/vehicle-formatters";
import { IMAGE_PLACEHOLDERS, pickPrimaryImage } from "@/lib/images";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type VehicleCardProps = {
  vehicle: Vehicle;
  className?: string;
  variant?: "default" | "immersive";
};

export function VehicleCard({
  vehicle,
  className,
  variant = "immersive",
}: VehicleCardProps) {
  const imageSrc = pickPrimaryImage(vehicle.images, IMAGE_PLACEHOLDERS.vehicle);
  const href = routes.vehicles.detail(vehicle.slug);
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${vehicle.title}" ilanı hakkında bilgi almak istiyorum.`,
  );
  const conditionTags = getVehicleConditionTags(vehicle);

  if (variant === "immersive") {
    return (
      <ImmersiveCardShell
        href={href}
        imageSrc={imageSrc}
        imageAlt={vehicle.title}
        fallbackSrc={IMAGE_PLACEHOLDERS.vehicle}
        title={vehicle.title}
        className={cn("vehicle-immersive-card", className)}
        topEndOverlay={<VehicleBrandLogo brand={vehicle.brand} />}
        eyebrow={
          <span className="line-clamp-1">
            {vehicle.brand} · {getVehicleCategoryLabel(vehicle.category)}
          </span>
        }
        badges={
          <>
            {conditionTags.map((tag) => (
              <span key={tag} className="immersive-chip vehicle-condition-chip">
                {tag}
              </span>
            ))}
            {vehicle.isFeatured ? (
              <span className="immersive-chip immersive-chip-featured">Öne Çıkan</span>
            ) : null}
          </>
        }
        meta={
          <VehicleCardHighlights
            vehicle={vehicle}
            variant="card"
            showConditionTags={false}
          />
        }
        footer={
          <>
            <div className="vehicle-card-price-block">
              <p className="immersive-card-price">{formatVehiclePrice(vehicle)}</p>
              <p className="vehicle-card-price-meta">{vehicle.city}</p>
            </div>
            <div className="immersive-card-actions">
              <Link
                href={href}
                className="immersive-card-icon-btn"
                aria-label="Araç detayı"
              >
                <ArrowUpRight className="size-4" />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="immersive-card-icon-btn immersive-card-icon-btn-whatsapp"
                aria-label="WhatsApp ile iletişim"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>
          </>
        }
      />
    );
  }

  return (
    <article className={cn("soft-card soft-card-lift flex h-full flex-col", className)}>
      <Link href={href} className="relative block p-5">
        <VehicleBrandLogo
          brand={vehicle.brand}
          size="sm"
          className="!absolute !right-4 !top-4"
        />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {getVehicleCategoryLabel(vehicle.category)}
        </p>
        <h3 className="mt-2 pr-14 font-heading text-lg font-medium text-foreground">
          {vehicle.title}
        </h3>
        <div className="mt-4">
          <VehicleCardHighlights vehicle={vehicle} variant="row" />
        </div>
        <p className="mt-4 font-semibold text-foreground">{formatVehiclePrice(vehicle)}</p>
      </Link>
    </article>
  );
}
