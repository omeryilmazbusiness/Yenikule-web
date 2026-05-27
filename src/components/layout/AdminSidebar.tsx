"use client";

import Link from "next/link";

import { AdminNavBrand } from "@/components/layout/admin-nav/AdminNavBrand";
import { AdminNavList } from "@/components/layout/admin-nav/AdminNavList";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type AdminSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "admin-sidebar flex h-full w-64 flex-col border-r border-border bg-anthracite text-primary-foreground",
        className,
      )}
    >
      <AdminNavBrand className="border-b border-white/10" onNavigate={onNavigate} />

      <div className="flex-1 overflow-y-auto overscroll-contain p-3">
        <AdminNavList onNavigate={onNavigate} variant="sidebar" />
      </div>

      <div className="border-t border-white/10 p-4">
        <Link
          href={routes.home}
          onClick={onNavigate}
          className="text-xs text-white/60 transition-colors duration-500 hover:text-bronze-soft"
          style={{ transitionTimingFunction: "var(--ease-premium)" }}
        >
          ← Siteye Dön
        </Link>
      </div>
    </aside>
  );
}
