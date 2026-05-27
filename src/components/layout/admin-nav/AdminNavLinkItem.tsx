"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";

type AdminNavLinkItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate?: () => void;
  variant?: "sidebar" | "drawer";
};

export function AdminNavLinkItem({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
  variant = "sidebar",
}: AdminNavLinkItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "admin-nav-link",
        variant === "drawer" && "admin-nav-link-drawer",
        active && "admin-nav-link-active",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="admin-nav-link-icon" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}
