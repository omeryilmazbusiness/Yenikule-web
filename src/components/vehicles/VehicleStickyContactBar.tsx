"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { MobileFloatingContactBar } from "@/components/common/MobileFloatingContactBar";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import { formatVehiclePrice } from "@/features/vehicles/utils/vehicle-formatters";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type VehicleStickyContactBarProps = {
  vehicle: Vehicle;
};

export function VehicleStickyContactBar({ vehicle }: VehicleStickyContactBarProps) {
  const siteConfig = useSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${vehicle.title}" ilanı hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <MobileFloatingContactBar aria-label="Araç iletişim">
      <div className="mobile-contact-dock-inner">
        <div className="mobile-contact-dock-price">
          <p className="mobile-contact-dock-price-label">Fiyat</p>
          <p className="mobile-contact-dock-price-value">{formatVehiclePrice(vehicle)}</p>
        </div>

        <div className="mobile-contact-dock-actions">
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="mobile-contact-dock-btn mobile-contact-dock-btn-call"
            aria-label="Telefon ile ara"
          >
            <Phone className="size-[1.15rem]" aria-hidden />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-contact-dock-btn mobile-contact-dock-btn-whatsapp"
          >
            <MessageCircle className="size-4 shrink-0" aria-hidden />
            WhatsApp
          </a>
          <Link
            href={routes.contact}
            className="mobile-contact-dock-btn mobile-contact-dock-btn-message"
          >
            Mesaj
          </Link>
        </div>
      </div>
    </MobileFloatingContactBar>
  );
}

