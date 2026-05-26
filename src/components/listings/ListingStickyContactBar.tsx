"use client";

import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { MobileFloatingContactBar } from "@/components/common/MobileFloatingContactBar";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { formatListingPrice } from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type ListingStickyContactBarProps = {
  listing: Listing;
};

export function ListingStickyContactBar({ listing }: ListingStickyContactBarProps) {
  const siteConfig = useSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <MobileFloatingContactBar aria-label="İlan iletişim">
      <div className="mobile-contact-dock-inner">
        <div className="mobile-contact-dock-price">
          <p className="mobile-contact-dock-price-label">Fiyat</p>
          <p className="mobile-contact-dock-price-value">
            {formatListingPrice(listing)}
          </p>
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
