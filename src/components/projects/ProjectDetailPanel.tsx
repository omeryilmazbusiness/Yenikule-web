import Link from "next/link";
import {
  Building2,
  Calendar,
  FileDown,
  Home,
  Layers,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ProjectDetailMap } from "@/components/projects/ProjectDetailMap";
import { Button } from "@/components/ui/button";
import {
  formatProjectAvailability,
  formatProjectLocation,
  formatProjectTimeline,
  getProjectStatusLabel,
} from "@/features/projects/utils/project-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { formatDate, formatNumber } from "@/lib/format";
import { routes } from "@/lib/routes";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type DetailRow = {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: boolean;
};

function buildDetailRows(project: Project): DetailRow[] {
  const rows: DetailRow[] = [
    {
      icon: Users,
      label: "Satış Durumu",
      value: formatProjectAvailability(project),
      highlight: true,
    },
    {
      icon: MapPin,
      label: "Konum",
      value: formatProjectLocation(project),
    },
    {
      icon: Building2,
      label: "Proje Durumu",
      value: getProjectStatusLabel(project.status),
    },
    {
      icon: Home,
      label: "Proje Adı",
      value: project.name,
    },
    {
      icon: Layers,
      label: "Konut Sayısı",
      value: `${formatNumber(project.availableUnits)} müsait / ${formatNumber(project.totalUnits)} toplam`,
    },
    {
      icon: Calendar,
      label: "Teslim Takvimi",
      value: formatProjectTimeline(project),
    },
  ];

  return rows;
}

type ProjectDetailPanelProps = {
  project: Project;
  className?: string;
};

export async function ProjectDetailPanel({ project, className }: ProjectDetailPanelProps) {
  const siteConfig = await getPublicSiteConfig();
  const rows = buildDetailRows(project);
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${project.title}" projesi hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <aside className={cn("listing-detail-panel", className)}>
      <div className="listing-detail-panel-header">
        <div className="listing-detail-chips">
          <span className="listing-detail-chip listing-detail-chip-neutral">
            <Building2 className="size-3.5" aria-hidden />
            {getProjectStatusLabel(project.status)}
          </span>
          {project.isFeatured ? (
            <span className="listing-detail-chip listing-detail-chip-featured">
              <Sparkles className="size-3.5" aria-hidden />
              Öne Çıkan
            </span>
          ) : null}
        </div>

        <p className="section-eyebrow mb-2 text-[10px] text-bronze">{project.name}</p>
        <h1 className="listing-detail-title">{project.title}</h1>
        <p className="listing-detail-summary">{project.shortDescription}</p>
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
                  row.highlight && "listing-detail-row-value-price",
                )}
              >
                {row.value}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <ProjectDetailMap project={project} />

      <div className="listing-detail-description">
        <h2 className="listing-detail-section-title">Proje Hakkında</h2>
        <p className="listing-detail-description-text whitespace-pre-line">
          {project.description}
        </p>
      </div>

      {project.features.length > 0 ? (
        <div className="listing-detail-features">
          <h2 className="listing-detail-section-title">Proje Özellikleri</h2>
          <ul className="listing-detail-feature-list">
            {project.features.map((feature) => (
              <li key={feature} className="listing-detail-feature-pill">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.amenities.length > 0 ? (
        <div className="listing-detail-features">
          <h2 className="listing-detail-section-title">Sosyal Olanaklar</h2>
          <ul className="listing-detail-feature-list">
            {project.amenities.map((amenity) => (
              <li key={amenity} className="listing-detail-feature-pill">
                {amenity}
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
        {project.brochureUrl ? (
          <a
            href={project.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="listing-detail-contact-btn"
          >
            <FileDown className="size-4" aria-hidden />
            Broşür
          </a>
        ) : null}
        <Button asChild variant="outline" className="listing-detail-contact-message">
          <Link href={routes.contact}>
            <MessageCircle className="size-4" aria-hidden />
            Mesaj Gönder
          </Link>
        </Button>
      </div>

      <p className="listing-detail-meta">
        Yayın: {formatDate(project.createdAt)}
        {project.updatedAt !== project.createdAt
          ? ` · Güncelleme: ${formatDate(project.updatedAt)}`
          : null}
      </p>
    </aside>
  );
}
