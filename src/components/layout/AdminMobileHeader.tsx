"use client";

import { LogOut, Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type AdminMobileHeaderProps = {
  title: string;
  onMenuOpen: () => void;
  className?: string;
};

export function AdminMobileHeader({
  title,
  onMenuOpen,
  className,
}: AdminMobileHeaderProps) {
  return (
    <header
      className={cn(
        "admin-mobile-header sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/80 bg-card/95 px-4 backdrop-blur-md md:hidden",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onMenuOpen}
        className="admin-mobile-header-menu size-10 shrink-0 rounded-xl border-border/80"
        aria-label="Menüyü aç"
      >
        <Menu className="size-5" aria-hidden />
      </Button>

      <h1 className="min-w-0 flex-1 truncate font-heading text-base font-semibold text-foreground">
        {title}
      </h1>

      <Button
        variant="ghost"
        size="icon"
        asChild
        className="size-10 shrink-0 rounded-xl text-muted-foreground"
      >
        <Link href={routes.auth.logout} aria-label="Çıkış yap">
          <LogOut className="size-5" aria-hidden />
        </Link>
      </Button>
    </header>
  );
}
