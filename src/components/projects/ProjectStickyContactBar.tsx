"use client";

import { Phone } from "lucide-react";
import Link from "next/link";

import { MobileFloatingContactBar } from "@/components/common/MobileFloatingContactBar";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { formatProjectAvailability } from "@/features/projects/utils/project-formatters";
import type { Project } from "@/features/projects/types/project.types";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type ProjectStickyContactBarProps = {
  project: Project;
};

export function ProjectStickyContactBar({ project }: ProjectStickyContactBarProps) {
  const siteConfig = useSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${project.title}" projesi hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <MobileFloatingContactBar aria-label="Proje iletişim">
      <div className="mobile-contact-dock-inner">
        <div className="mobile-contact-dock-price">
          <p className="mobile-contact-dock-price-label">Durum</p>
          <p className="mobile-contact-dock-price-value mobile-contact-dock-price-value-sm">
            {formatProjectAvailability(project)}
          </p>
        </div>

        <div className="mobile-contact-dock-actions">
          <a
            href={`tel:${siteConfig.phone}`}
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
            <WhatsAppIcon className="size-4 shrink-0" />
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
