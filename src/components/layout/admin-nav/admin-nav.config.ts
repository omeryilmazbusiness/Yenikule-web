import {
  Building2,
  Car,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { routes } from "@/lib/routes";

export type AdminNavLinkConfig = {
  type: "link";
  href: string;
  label: string;
  icon: LucideIcon;
};

export type AdminNavItemConfig = AdminNavLinkConfig;

export const ADMIN_NAV_ITEMS: AdminNavItemConfig[] = [
  {
    type: "link",
    href: routes.admin.dashboard,
    label: "Panel",
    icon: LayoutDashboard,
  },
  {
    type: "link",
    href: routes.admin.listings,
    label: "İlanlar",
    icon: Tag,
  },
  {
    type: "link",
    href: routes.admin.projects,
    label: "Projeler",
    icon: Building2,
  },
  {
    type: "link",
    href: routes.admin.vehicles,
    label: "Araçlar",
    icon: Car,
  },
  {
    type: "link",
    href: routes.admin.media,
    label: "Medya",
    icon: ImageIcon,
  },
  {
    type: "link",
    href: routes.admin.messages,
    label: "Mesajlar",
    icon: MessageSquare,
  },
  {
    type: "link",
    href: routes.admin.settings,
    label: "Siteyi özelleştir",
    icon: Settings,
  },
];
