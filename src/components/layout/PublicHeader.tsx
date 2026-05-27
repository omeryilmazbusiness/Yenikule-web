"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Container } from "@/components/common/Container";
import { HaremGoldLiveTrigger } from "@/components/market/HaremGoldLiveTrigger";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { publicNavLinks } from "@/lib/public-nav";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

type PublicHeaderProps = {
  className?: string;
  overlay?: boolean;
};

export function PublicHeader({
  className,
  overlay = false,
}: PublicHeaderProps) {
  const siteConfig = useSiteConfig();
  const pathname = usePathname();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 hidden lg:block",
        overlay ? "glass-header-overlay" : "glass-header border-border/60 bg-white/85",
        className,
      )}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href={routes.home}
            className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
          >
            <span
              className={cn(
                "relative flex size-10 items-center justify-center rounded-xl",
                overlay ? "bg-white/10" : "bg-anthracite/5",
              )}
              aria-hidden
            >
              <Image
                src="/images/brand/yenikule-mark.png"
                alt=""
                fill
                sizes="40px"
                className="object-contain p-1.5"
                priority={overlay}
              />
            </span>
            <div className="leading-tight">
              <span
                className={cn(
                  "font-heading block text-base font-semibold tracking-tight",
                  overlay ? "text-white" : "text-foreground",
                )}
              >
                {siteConfig.shortName}
              </span>
              <span
                className={cn(
                  "text-xs font-light",
                  overlay ? "text-white/55" : "text-muted-foreground",
                )}
              >
                İnşaat
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Ana menü">
            {publicNavLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== routes.home && pathname.startsWith(link.href));
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link-minimal",
                    overlay
                      ? isActive
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      overlay ? "opacity-90" : "opacity-60",
                    )}
                    aria-hidden
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={routes.contact}
              className={cn(
                "nav-action-minimal hidden lg:inline-flex",
                overlay
                  ? "text-white/75 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Mail className="size-4 shrink-0 opacity-70" aria-hidden />
              İletişim
            </Link>
            <span
              className={cn(
                "mx-1 hidden h-4 w-px lg:block",
                overlay ? "bg-white/15" : "bg-border",
              )}
              aria-hidden
            />
            <HaremGoldLiveTrigger
              overlay={overlay}
              className="hidden lg:inline-flex"
            />
            <span
              className={cn(
                "mx-1 hidden h-4 w-px lg:block",
                overlay ? "bg-white/15" : "bg-border",
              )}
              aria-hidden
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp: ${siteConfig.whatsappDisplay}`}
              className={cn(
                "nav-action-minimal",
                overlay
                  ? "text-[#b8dcc8] hover:text-[#d4eadc]"
                  : "text-whatsapp hover:text-whatsapp/80",
              )}
            >
              <WhatsAppIcon className="size-4 opacity-90" />
              WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
