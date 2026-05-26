import Image from "next/image";

import {
  getVehicleBrandInitial,
  getVehicleBrandLogoSrc,
  hasVehicleBrandLogo,
  normalizeVehicleBrandKey,
} from "@/lib/vehicle-brands";
import { cn } from "@/lib/cn";

type VehicleBrandLogoProps = {
  brand: string;
  className?: string;
  size?: "sm" | "md";
};

export function VehicleBrandLogo({
  brand,
  className,
  size = "md",
}: VehicleBrandLogoProps) {
  const logoSrc = getVehicleBrandLogoSrc(brand);
  const brandKey = normalizeVehicleBrandKey(brand);
  const hasLogo = hasVehicleBrandLogo(brand);
  const imageSize = size === "sm" ? 40 : 48;

  return (
    <div
      className={cn(
        "vehicle-brand-logo",
        size === "sm" && "vehicle-brand-logo-sm",
        brandKey === "audi" && "vehicle-brand-logo-audi",
        className,
      )}
      title={brand}
    >
      {hasLogo ? (
        <Image
          src={logoSrc}
          alt={`${brand} logosu`}
          width={imageSize}
          height={imageSize}
          className="vehicle-brand-logo-image"
          priority={false}
        />
      ) : (
        <span className="vehicle-brand-logo-fallback" aria-hidden>
          {getVehicleBrandInitial(brand)}
        </span>
      )}
    </div>
  );
}
