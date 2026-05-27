import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/Container";
import { cn } from "@/lib/cn";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { routes } from "@/lib/routes";

type PublicMobileFooterProps = {
  className?: string;
};

export async function PublicMobileFooter({ className }: PublicMobileFooterProps) {
  const siteConfig = await getPublicSiteConfig();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-footer-muted/15 bg-footer text-footer-foreground lg:hidden",
        className,
      )}
    >
      <Container className="mobile-footer-inner py-8">
        <div className="flex items-center gap-3">
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-xl bg-bronze/10">
            <Image
              src="/images/brand/yenikule-mark.png"
              alt={`${siteConfig.shortName} logo`}
              fill
              sizes="36px"
              className="object-contain p-1.5"
            />
          </span>
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold">
              {siteConfig.name}
            </p>
            <p className="truncate text-xs text-footer-muted">
              {siteConfig.company.legalName}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5 text-sm text-footer-muted">
          <li className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-bronze-soft" aria-hidden />
            <span className="leading-relaxed">{siteConfig.address.full}</span>
          </li>
          <li>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center gap-2.5 transition-colors hover:text-footer-foreground"
            >
              <Phone className="size-4 shrink-0 text-bronze-soft" aria-hidden />
              {siteConfig.phoneDisplay}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2.5 transition-colors hover:text-footer-foreground"
            >
              <Mail className="size-4 shrink-0 text-bronze-soft" aria-hidden />
              {siteConfig.email}
            </a>
          </li>
        </ul>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          <Link
            href={routes.about}
            className="text-footer-muted transition-colors hover:text-footer-foreground"
          >
            Hakkımızda
          </Link>
          <Link
            href={routes.contact}
            className="text-footer-muted transition-colors hover:text-footer-foreground"
          >
            İletişim
          </Link>
          <Link
            href={routes.legal.privacy}
            className="text-footer-muted transition-colors hover:text-footer-foreground"
          >
            Gizlilik
          </Link>
        </div>

        <p className="mt-5 border-t border-footer-muted/20 pt-4 text-xs text-footer-muted">
          © {currentYear} {siteConfig.name}. Tüm hakları saklıdır.
        </p>
      </Container>
    </footer>
  );
}
