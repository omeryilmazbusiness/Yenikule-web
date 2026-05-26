import {
  Building2,
  Car,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Tag,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const adminNavItems: AdminNavItem[] = [
  { href: routes.admin.dashboard, label: "Panel", icon: LayoutDashboard },
  { href: routes.admin.listings, label: "İlanlar", icon: Tag },
  { href: routes.admin.projects, label: "Projeler", icon: Building2 },
  { href: routes.admin.vehicles, label: "Araçlar", icon: Car },
  { href: routes.admin.media, label: "Medya", icon: ImageIcon },
  { href: routes.admin.messages, label: "Mesajlar", icon: MessageSquare },
  { href: routes.admin.settings, label: "Ayarlar", icon: Settings },
];

type AdminSidebarProps = {
  activePath?: string;
  onNavigate?: () => void;
  className?: string;
};

function isNavActive(pathname: string, href: string): boolean {
  if (href === routes.admin.dashboard) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  activePath = "",
  onNavigate,
  className,
}: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-border bg-anthracite text-primary-foreground",
        className,
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-bronze text-xs font-bold text-accent-foreground">
          YK
        </span>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold">
            {siteConfig.shortName}
          </p>
          <p className="text-xs text-white/60">Yönetim Paneli</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Admin menü">
        {adminNavItems.map((item) => {
          const active = isNavActive(activePath, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-bronze text-accent-foreground"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href={routes.home}
          onClick={onNavigate}
          className="text-xs text-white/60 transition-colors hover:text-bronze-soft"
        >
          ← Siteye Dön
        </Link>
      </div>
    </aside>
  );
}
