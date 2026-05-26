"use client";

import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Container } from "@/components/common/Container";
import { PublicMobileMenu } from "@/components/layout/PublicMobileMenu";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type PublicMobileHeaderProps = {
  className?: string;
  overlay?: boolean;
};

export function PublicMobileHeader({
  className,
  overlay = false,
}: PublicMobileHeaderProps) {
  const siteConfig = useSiteConfig();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 lg:hidden",
        overlay
          ? "glass-header-overlay"
          : "glass-header border-border/60 bg-white/90",
        className,
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <Container>
        <div className="flex h-14 items-center justify-between gap-3">
          <Link
            href={routes.home}
            className="flex min-w-0 items-center gap-2.5"
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                overlay ? "bg-white/10 text-white" : "bg-anthracite text-white",
              )}
            >
              YK
            </span>
            <span
              className={cn(
                "truncate font-heading text-sm font-semibold tracking-tight",
                overlay ? "text-white" : "text-foreground",
              )}
            >
              {siteConfig.shortName}
            </span>
          </Link>

          <div className="flex items-center gap-0.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={cn(
                "flex size-11 items-center justify-center transition-colors",
                overlay
                  ? "text-[#b8dcc8] hover:text-[#d4eadc]"
                  : "text-whatsapp hover:text-whatsapp/80",
              )}
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <PublicMobileMenu overlay={overlay} />
          </div>
        </div>
      </Container>
    </header>
  );
}
