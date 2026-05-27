"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { AdminNavLinkItem } from "@/components/layout/admin-nav/AdminNavLinkItem";
import { ADMIN_NAV_ITEMS } from "@/components/layout/admin-nav/admin-nav.config";
import { isAdminNavLinkActive } from "@/components/layout/admin-nav/admin-nav.utils";
import { drawerItem } from "@/lib/motion";
import { cn } from "@/lib/cn";

type AdminNavListProps = {
  onNavigate?: () => void;
  variant?: "sidebar" | "drawer";
  animateItems?: boolean;
  className?: string;
};

export function AdminNavList({
  onNavigate,
  variant = "sidebar",
  animateItems = false,
  className,
}: AdminNavListProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("admin-nav-list", className)} aria-label="Admin menü">
      {ADMIN_NAV_ITEMS.map((item, index) => {
        const active = isAdminNavLinkActive(pathname, item.href);
        const content = (
          <AdminNavLinkItem
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={active}
            onNavigate={onNavigate}
            variant={variant}
          />
        );

        if (!animateItems) {
          return <div key={item.href}>{content}</div>;
        }

        return (
          <motion.div
            key={item.href}
            custom={index + 1}
            initial="hidden"
            animate="visible"
            variants={drawerItem}
          >
            {content}
          </motion.div>
        );
      })}
    </nav>
  );
}
