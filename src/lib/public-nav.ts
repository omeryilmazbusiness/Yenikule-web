import {
  Building2,
  Home,
  Info,
  LayoutGrid,
  Mail,
  type LucideIcon,
} from "lucide-react";

import { routes } from "@/lib/routes";

export type PublicNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const publicNavLinks: PublicNavLink[] = [
  { href: routes.home, label: "Ana Sayfa", icon: Home },
  { href: routes.about, label: "Hakkımızda", icon: Info },
  { href: routes.listings.index, label: "İlanlar", icon: LayoutGrid },
  { href: routes.projects.index, label: "Projeler", icon: Building2 },
  { href: routes.contact, label: "İletişim", icon: Mail },
];
