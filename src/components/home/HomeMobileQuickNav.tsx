import Link from "next/link";
import { Building2, Car, Layers } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const items = [
  {
    href: routes.listings.index,
    label: "İlanlar",
    icon: Building2,
    tone: "dark" as const,
  },
  {
    href: `${routes.listings.index}?segment=arac`,
    label: "Araçlar",
    icon: Car,
    tone: "muted" as const,
  },
  {
    href: routes.projects.index,
    label: "Projeler",
    icon: Layers,
    tone: "muted" as const,
  },
] as const;

export function HomeMobileQuickNav() {
  const whatsappUrl = getWhatsAppUrl(
    "Merhaba, Yeni Kule İnşaat hakkında bilgi almak istiyorum.",
  );

  return (
    <nav
      className="home-quick-nav lg:hidden"
      aria-label="Hızlı erişim"
    >
      <ul className="home-quick-nav-grid">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`home-quick-nav-item home-quick-nav-item-${item.tone}`}
            >
              <item.icon className="size-5" aria-hidden />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="home-quick-nav-item home-quick-nav-item-whatsapp"
          >
            <WhatsAppIcon className="size-5" />
            <span>WhatsApp</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
