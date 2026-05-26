import Link from "next/link";
import { ArrowUpRight, Home, MapPin } from "lucide-react";

import { ImmersiveCardShell } from "@/components/common/ImmersiveCardShell";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ImmersiveListingBadges } from "@/components/listings/ImmersiveListingBadges";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatListingLocation,
  formatListingPrice,
  formatListingSummary,
  getListingCategoryLabel,
  getListingStatusLabel,
  getListingTypeLabel,
} from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { IMAGE_PLACEHOLDERS, pickPrimaryImage } from "@/lib/images";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type ListingCardProps = {
  listing: Listing;
  className?: string;
  variant?: "default" | "immersive";
};

export function ListingCard({
  listing,
  className,
  variant = "default",
}: ListingCardProps) {
  const imageSrc = pickPrimaryImage(listing.images, IMAGE_PLACEHOLDERS.listing);
  const href = routes.listings.detail(listing.slug);
  const typeBadge =
    listing.type === "satilik"
      ? "sale"
      : listing.type === "kiralik"
        ? "rent"
        : "secondary";

  if (variant === "immersive") {
    return (
      <ImmersiveCardShell
        href={href}
        imageSrc={imageSrc}
        imageAlt={listing.title}
        fallbackSrc={IMAGE_PLACEHOLDERS.listing}
        title={listing.title}
        className={className}
        eyebrow={getListingCategoryLabel(listing.category)}
        badges={<ImmersiveListingBadges listing={listing} />}
        meta={
          <div className="immersive-card-meta-rows">
            <p className="immersive-card-meta-row">
              <span className="immersive-card-meta-icon" aria-hidden>
                <MapPin className="size-3.5" />
              </span>
              <span className="line-clamp-1">{formatListingLocation(listing)}</span>
            </p>
            <p className="immersive-card-meta-row">
              <span className="immersive-card-meta-icon" aria-hidden>
                <Home className="size-3.5" />
              </span>
              <span className="line-clamp-1">{formatListingSummary(listing)}</span>
            </p>
          </div>
        }
        footer={
          <>
            <p className="immersive-card-price">
              {formatListingPrice(listing)}
            </p>
            <div className="immersive-card-actions">
              <Link
                href={href}
                className="immersive-card-icon-btn"
                aria-label="İlan detayı"
              >
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <a
                href={getWhatsAppUrl(
                  `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="immersive-card-icon-btn immersive-card-icon-btn-whatsapp"
                aria-label="WhatsApp ile iletişim"
              >
                <WhatsAppIcon className="size-4" />
              </a>
            </div>
          </>
        }
      />
    );
  }

  return (
    <article
      className={cn(
        "soft-card soft-card-lift group flex h-full flex-col",
        className,
      )}
    >
      <Link href={href} className="relative block overflow-hidden">
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={imageSrc}
            alt={listing.title}
            aspectRatio="4/3"
            rounded={false}
            className="transition-premium-slow group-hover:scale-[1.04] motion-reduce:transform-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            fallbackSrc={IMAGE_PLACEHOLDERS.listing}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-premium group-hover:opacity-100 motion-reduce:opacity-0"
            aria-hidden
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant={typeBadge}>{getListingTypeLabel(listing.type)}</Badge>
            {listing.isFeatured ? (
              <Badge variant="featured">Öne Çıkan</Badge>
            ) : null}
          </div>
          {listing.status !== "aktif" ? (
            <Badge variant="muted">{getListingStatusLabel(listing.status)}</Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="section-eyebrow mb-2.5 text-[10px]">
          {getListingCategoryLabel(listing.category)}
        </p>
        <Link href={href}>
          <h3 className="font-heading line-clamp-2 text-lg font-medium leading-snug text-foreground transition-premium group-hover:text-bronze md:text-xl">
            {listing.title}
          </h3>
        </Link>

        <p className="mt-2.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 opacity-70" aria-hidden />
          <span className="line-clamp-1">{formatListingLocation(listing)}</span>
        </p>

        <p className="mt-1 text-sm text-muted-foreground/90">
          {formatListingSummary(listing)}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/50 pt-5 transition-premium group-hover:border-border">
          <p className="font-heading text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {formatListingPrice(listing)}
          </p>
          <div className="flex gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden transition-premium sm:inline-flex"
            >
              <Link href={href}>
                Detay
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
            <Button asChild variant="whatsapp" size="sm" className="shrink-0 transition-premium">
              <a
                href={getWhatsAppUrl(
                  `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
