import {
  Briefcase,
  Camera,
  Mail,
  MapPin,
  Phone,
  Play,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/Container";
import { KvkkDialogTrigger } from "@/components/legal/KvkkDialogTrigger";
import { cn } from "@/lib/cn";
import { LISTING_CATEGORIES } from "@/lib/constants";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { routes } from "@/lib/routes";

const quickLinks = [
  { href: routes.home, label: "Ana Sayfa" },
  { href: routes.about, label: "Hakkımızda" },
  { href: routes.listings.index, label: "İlanlar" },
  { href: routes.projects.index, label: "Projeler" },
  { href: routes.contact, label: "İletişim" },
] as const;

const legalLinks = [
  { href: routes.legal.privacy, label: "Gizlilik Politikası" },
  { href: routes.legal.terms, label: "Kullanım Koşulları" },
  { href: routes.legal.kvkk, label: "KVKK" },
] as const;

type PublicFooterProps = {
  className?: string;
};

export async function PublicFooter({ className }: PublicFooterProps) {
  const siteConfig = await getPublicSiteConfig();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: siteConfig.socialLinks.instagram, label: "Instagram", icon: Camera },
    { href: siteConfig.socialLinks.facebook, label: "Facebook", icon: Users },
    { href: siteConfig.socialLinks.linkedin, label: "LinkedIn", icon: Briefcase },
    { href: siteConfig.socialLinks.youtube, label: "YouTube", icon: Play },
  ] as const;

  return (
    <footer className={cn("bg-footer text-footer-foreground", className)}>
      <Container className="py-14 md:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-5 lg:col-span-4">
            <Link href={routes.home} className="inline-flex items-center gap-3">
              <span className="relative flex size-10 items-center justify-center rounded-xl bg-bronze/10">
                <Image
                  src="/images/brand/yenikule-mark.png"
                  alt={`${siteConfig.shortName} logo`}
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                />
              </span>
              <span className="font-heading text-lg font-semibold">
                {siteConfig.name}
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-footer-muted">
              {siteConfig.description}
            </p>
            <p className="text-xs text-footer-muted/80">
              {siteConfig.company.legalName}
            </p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-bronze-soft">
              Bağlantılar
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-bronze-soft">
              Kategoriler
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
              {LISTING_CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`${routes.listings.index}?category=${category.value}`}
                    className="text-sm text-footer-muted transition-colors hover:text-footer-foreground"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-bronze-soft">
              İletişim
            </h3>
            <ul className="space-y-3 text-sm text-footer-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-bronze-soft" aria-hidden />
                <span>{siteConfig.address.full}</span>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-footer-foreground"
                >
                  <Phone className="size-4 shrink-0 text-bronze-soft" aria-hidden />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-footer-foreground"
                >
                  <Mail className="size-4 shrink-0 text-bronze-soft" aria-hidden />
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs text-footer-muted/80">
              {siteConfig.workingHours}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-lg border border-footer-muted/20 text-footer-muted transition-colors hover:border-bronze-soft/40 hover:bg-bronze/10 hover:text-bronze-soft"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-footer-muted/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-footer-muted">
            © {currentYear} {siteConfig.name}. Tüm hakları saklıdır.
          </p>
          <ul className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <li key={link.href}>
                {link.href === routes.legal.kvkk ? (
                  <KvkkDialogTrigger
                    label={link.label}
                    legalName={siteConfig.company.legalName}
                    email={siteConfig.email}
                    address={siteConfig.address.full}
                    className="text-xs text-footer-muted transition-colors hover:text-footer-foreground"
                  />
                ) : (
                  <Link
                    href={link.href}
                    className="text-xs text-footer-muted transition-colors hover:text-footer-foreground"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
