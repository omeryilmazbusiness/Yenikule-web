"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { publicNavLinks } from "@/lib/public-nav";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

function isTabActive(pathname: string, href: string): boolean {
  if (href === routes.home) {
    return pathname === routes.home;
  }

  if (href === routes.about) {
    return pathname === routes.about || pathname.startsWith(`${routes.about}/`);
  }

  if (href === routes.listings.index) {
    return (
      pathname.startsWith(routes.listings.index) ||
      pathname.startsWith(routes.vehicles.index)
    );
  }

  if (href === routes.projects.index) {
    return pathname.startsWith(routes.projects.index);
  }

  if (href === routes.contact) {
    return pathname === routes.contact;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNavigation() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="mobile-dock" aria-label="Mobil alt menü">
      <div className="mobile-dock-glass">
        <ul className="mobile-dock-list">
          {publicNavLinks.map((tab) => {
            const active = isTabActive(pathname, tab.href);
            const Icon = tab.icon;

            return (
              <li key={tab.href} className="min-w-0 flex-1">
                <Link
                  href={tab.href}
                  className={cn(
                    "mobile-dock-item",
                    active && "mobile-dock-item-active",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="mobile-dock-icon-wrap">
                    <Icon aria-hidden />
                  </span>
                  <span className="mobile-dock-label">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
