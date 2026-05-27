import Link from "next/link";
import {
  Banknote,
  Calendar,
  Car,
  Cog,
  Gauge,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import {
  formatVehicleMileage,
  formatVehiclePrice,
  formatVehicleSpecs,
  getVehicleCategoryLabel,
  getVehicleConditionTags,
  getVehicleStatusLabel,
  getVehicleTrim,
} from "@/features/vehicles/utils/vehicle-formatters";
import { formatDate } from "@/lib/format";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type DetailRow = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function buildDetailRows(vehicle: Vehicle): DetailRow[] {
  const trim = getVehicleTrim(vehicle);

  const rows: DetailRow[] = [
    { icon: Banknote, label: "Fiyat", value: formatVehiclePrice(vehicle) },
    { icon: MapPin, label: "Konum", value: vehicle.city },
    { icon: Tag, label: "Kategori", value: getVehicleCategoryLabel(vehicle.category) },
    { icon: Calendar, label: "Yıl", value: String(vehicle.year) },
    { icon: Gauge, label: "Kilometre", value: formatVehicleMileage(vehicle.mileage) },
    { icon: Cog, label: "Teknik", value: formatVehicleSpecs(vehicle) },
    { icon: Palette, label: "Renk", value: vehicle.color },
  ];

  if (trim) {
    rows.push({ icon: Car, label: "Paket", value: trim });
  }

  if (vehicle.engineSize) {
    rows.push({ icon: ShieldCheck, label: "Motor", value: `${vehicle.engineSize} L` });
  }

  return rows;
}

type VehicleDetailPanelProps = {
  vehicle: Vehicle;
  className?: string;
};

export async function VehicleDetailPanel({ vehicle, className }: VehicleDetailPanelProps) {
  const siteConfig = await getPublicSiteConfig();
  const rows = buildDetailRows(vehicle);
  const conditionTags = getVehicleConditionTags(vehicle);
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${vehicle.title}" ilanı hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <aside className={cn("listing-detail-panel", className)}>
      <div className="listing-detail-panel-header">
        <div className="listing-detail-chips">
          <span className="listing-detail-chip listing-detail-chip-neutral">
            <Tag className="size-3.5" aria-hidden />
            {getVehicleCategoryLabel(vehicle.category)}
          </span>
          {conditionTags.map((tag) => (
            <span key={tag} className="listing-detail-chip listing-detail-chip-neutral">
              <ShieldCheck className="size-3.5" aria-hidden />
              {tag}
            </span>
          ))}
          {vehicle.isFeatured ? (
            <span className="listing-detail-chip listing-detail-chip-featured">
              <Sparkles className="size-3.5" aria-hidden />
              Öne Çıkan
            </span>
          ) : null}
          {vehicle.status !== "aktif" ? (
            <span className="listing-detail-chip listing-detail-chip-muted">
              {getVehicleStatusLabel(vehicle.status)}
            </span>
          ) : null}
        </div>

        <h1 className="listing-detail-title">{vehicle.title}</h1>
        <p className="listing-detail-summary">
          {vehicle.brand} {vehicle.model} · {vehicle.year} · {formatVehicleMileage(vehicle.mileage)}
        </p>
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

      <div className="listing-detail-description">
        <h2 className="listing-detail-section-title">Açıklama</h2>
        <p className="listing-detail-description-text whitespace-pre-line">
          {vehicle.description}
        </p>
      </div>

      {vehicle.features.length > 0 ? (
        <div className="listing-detail-features">
          <h2 className="listing-detail-section-title">Özellikler</h2>
          <ul className="listing-detail-feature-list">
            {vehicle.features.map((feature) => (
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
        <a href={`tel:${siteConfig.phone}`} className="listing-detail-contact-btn">
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
        Yayın: {formatDate(vehicle.createdAt)}
        {vehicle.updatedAt !== vehicle.createdAt
          ? ` · Güncelleme: ${formatDate(vehicle.updatedAt)}`
          : null}
      </p>
    </aside>
  );
}

