"use client";

import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { AdminNavBrand } from "@/components/layout/admin-nav/AdminNavBrand";
import { AdminNavList } from "@/components/layout/admin-nav/AdminNavList";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { routes } from "@/lib/routes";
import { fadeIn } from "@/lib/motion";

type AdminMobileDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
  userEmail?: string;
};

export function AdminMobileDrawer({
  open,
  onOpenChange,
  userName = "Yönetici",
  userEmail,
}: AdminMobileDrawerProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="admin-mobile-drawer w-[min(100vw-1rem,20.5rem)] gap-0 border-r-0 p-0 [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Admin menü</SheetTitle>
        </SheetHeader>

        <motion.div
          className="admin-mobile-drawer-inner"
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <div className="admin-mobile-drawer-head">
            <AdminNavBrand onNavigate={close} />
            <button
              type="button"
              onClick={close}
              className="admin-mobile-drawer-close"
              aria-label="Menüyü kapat"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          {userEmail ? (
            <div className="admin-mobile-drawer-user">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <p className="truncate text-xs text-white/55">{userEmail}</p>
            </div>
          ) : null}

          <div className="admin-mobile-drawer-nav">
            <AdminNavList
              variant="drawer"
              animateItems={open}
              onNavigate={close}
            />
          </div>

          <div className="admin-mobile-drawer-footer">
            <Link
              href={routes.home}
              onClick={close}
              className="admin-mobile-drawer-site-link"
            >
              ← Siteye dön
            </Link>
            <Link
              href={routes.auth.logout}
              onClick={close}
              className="admin-mobile-drawer-logout"
            >
              <LogOut className="size-4" aria-hidden />
              Çıkış yap
            </Link>
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
