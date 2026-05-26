import Link from "next/link";
import {
  Banknote,
  Building2,
  Calendar,
  Home,
  Key,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Sparkles,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ListingDetailMap } from "@/components/listings/ListingDetailMap";
import { Button } from "@/components/ui/button";
import {
  formatListingLocation,
  formatListingPrice,
  formatListingSummary,
  getListingCategoryLabel,
  getListingStatusLabel,
  getListingTypeLabel,
} from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { formatArea, formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type DetailRow = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function buildDetailRows(listing: Listing): DetailRow[] {
  const rows: DetailRow[] = [
    {
      icon: Banknote,
      label: "Fiyat",
      value: formatListingPrice(listing),
    },
    {
      icon: MapPin,
      label: "Konum",
      value: formatListingLocation(listing),
    },
    {
      icon: Tag,
      label: "İlan Tipi",
      value: getListingTypeLabel(listing.type),
    },
    {
      icon: Home,
      label: "Kategori",
      value: getListingCategoryLabel(listing.category),
    },
    {
      icon: Ruler,
      label: "Alan",
      value: formatArea(listing.area),
    },
  ];

  if (listing.rooms) {
    rows.push({ icon: Building2, label: "Oda Sayısı", value: listing.rooms });
  }

  if (listing.floor !== undefined && listing.totalFloors !== undefined) {
    rows.push({
      icon: Layers,
      label: "Kat Bilgisi",
      value: `${listing.floor}. kat / ${listing.totalFloors} kat`,
    });
  }

  if (listing.buildingAge !== undefined) {
    rows.push({
      icon: Calendar,
      label: "Bina Yaşı",
      value: `${listing.buildingAge} yıl`,
    });
  }

  return rows;
}

type ListingDetailPanelProps = {
  listing: Listing;
  className?: string;
};

export async function ListingDetailPanel({ listing, className }: ListingDetailPanelProps) {
  const siteConfig = await getPublicSiteConfig();
  const rows = buildDetailRows(listing);
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );
  const TypeIcon = listing.type === "kiralik" ? Key : Tag;

  return (
    <aside className={cn("listing-detail-panel", className)}>
      <div className="listing-detail-panel-header">
        <div className="listing-detail-chips">
          <span
            className={cn(
              "listing-detail-chip",
              listing.type === "satilik" && "listing-detail-chip-sale",
              listing.type === "kiralik" && "listing-detail-chip-rent",
            )}
          >
            <TypeIcon className="size-3.5" aria-hidden />
            {getListingTypeLabel(listing.type)}
          </span>
          <span className="listing-detail-chip listing-detail-chip-neutral">
            <Home className="size-3.5" aria-hidden />
            {getListingCategoryLabel(listing.category)}
          </span>
          {listing.isFeatured ? (
            <span className="listing-detail-chip listing-detail-chip-featured">
              <Sparkles className="size-3.5" aria-hidden />
              Öne Çıkan
            </span>
          ) : null}
          {listing.status !== "aktif" ? (
            <span className="listing-detail-chip listing-detail-chip-muted">
              {getListingStatusLabel(listing.status)}
            </span>
          ) : null}
        </div>

        <h1 className="listing-detail-title">{listing.title}</h1>
        <p className="listing-detail-summary">{formatListingSummary(listing)}</p>
      </div>

      <ul className="listing-detail-rows">
        {rows.map((row) => (
          <li key={row.label} className="listing-detail-row">
            <span className="listing-detail-row-icon" aria-hidden>
              <row.icon className="size-4" />
            </span>
            <div className="listing-detail-row-body">
              <span className="listing-detail-row-label">{row.label}</span>
              <span
                className={cn(
                  "listing-detail-row-value",
                  row.label === "Fiyat" && "listing-detail-row-value-price",
                )}
              >
                {row.value}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <ListingDetailMap listing={listing} />

      <div className="listing-detail-description">
        <h2 className="listing-detail-section-title">Açıklama</h2>
        <p className="listing-detail-description-text whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      {listing.features.length > 0 ? (
        <div className="listing-detail-features">
          <h2 className="listing-detail-section-title">Özellikler</h2>
          <ul className="listing-detail-feature-list">
            {listing.features.map((feature) => (
              <li key={feature} className="listing-detail-feature-pill">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="listing-detail-contact">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="listing-detail-contact-btn listing-detail-contact-btn-primary"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </a>
        <a
          href={`tel:${siteConfig.phone}`}
          className="listing-detail-contact-btn"
        >
          <Phone className="size-4" aria-hidden />
          Ara
        </a>
        <Button asChild variant="outline" className="listing-detail-contact-message">
          <Link href={routes.contact}>
            <MessageCircle className="size-4" aria-hidden />
            Mesaj Gönder
          </Link>
        </Button>
      </div>

      <p className="listing-detail-meta">
        Yayın: {formatDate(listing.createdAt)}
        {listing.updatedAt !== listing.createdAt
          ? ` · Güncelleme: ${formatDate(listing.updatedAt)}`
          : null}
      </p>
    </aside>
  );
}
